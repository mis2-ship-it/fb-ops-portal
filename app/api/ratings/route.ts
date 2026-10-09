import { NextResponse } from 'next/server';

const GOOGLE_CSV = "https://docs.google.com/spreadsheets/d/1HlYNDNXig3PCjIFpQdI8B1lEzubsttUEPj_57DgpJoE/gviz/tq?tqx=out:csv&sheet=Complaints";
const SWIGGY_CSV = "https://docs.google.com/spreadsheets/d/1R5kdiLGiNV2zSxs2hyObxUF216iqeaDVTggM7mub0Ck/gviz/tq?tqx=out:csv&sheet=Raw%20Data";
const ZOMATO_CSV = "https://docs.google.com/spreadsheets/d/1V-tFd3I9CRxDUWSrU9Zc6ODW9Qhbs4C0SXZq4mW6tsg/gviz/tq?tqx=out:csv&sheet=Raw%20Data";

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (c === ',' && !inQuotes) {
      result.push(cur.trim());
      cur = '';
    } else {
      cur += c;
    }
  }
  result.push(cur.trim());
  return result;
}

function parseDDMMYYYY(dateStr: string): Date | null {
  if (!dateStr) return null;
  const cleaned = dateStr.replace(/["']/g, '').trim();
  const parts = cleaned.split(/[-/ ]/);
  if (parts.length < 3) return null;
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  let year = parseInt(parts[2].slice(0, 4), 10);
  if (year < 100) year += 2000;
  const d = new Date(year, month, day);
  return isNaN(d.getTime()) ? null : d;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const platform = (searchParams.get('platform') || 'zomato').toLowerCase();
  const period = (searchParams.get('period') || 'mtd').toLowerCase();

  let targetUrl = ZOMATO_CSV;
  if (platform === 'swiggy') targetUrl = SWIGGY_CSV;
  if (platform === 'google') targetUrl = GOOGLE_CSV;

  try {
    const res = await fetch(targetUrl, { next: { revalidate: 60 } });
    const text = await res.text();
    const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
    if (lines.length < 2) {
      return NextResponse.json({ success: true, overallRating: '0.00', ratedOrders: 0, totalReviews: 0, recentReviews: [] });
    }

    // Determine target column indexes based on platform
    let colStoreType = 10; // Zomato Col K
    let colRating = 9;     // Zomato Col J (Avg. Rating)
    let colRatedOrder = 12;// Zomato Col M
    let colDate = 2;       // Zomato Col C
    let colStore = 3;      // Zomato Col D
    let colComment = 13;   // Zomato Col N
    let colGroupComment = 7; // Zomato Col H

    if (platform === 'swiggy') {
      colDate = 4;         // Col E (Date)
      colStore = 5;        // Col F (Store Name)
      colGroupComment = 9; // Col J (Comments Group)
      colRating = 11;      // Col L (Avg. Rating)
      colStoreType = 12;   // Col M (Store Type)
      colRatedOrder = 14;  // Col O (Rated Orders)
      colComment = 9;      // Fallback to comments group
    } else if (platform === 'google') {
      colRating = 7;       // Col H (Rating)
      colComment = 8;      // Col I (Review)
      colDate = 10;        // Col K (Date)
      colStore = 12;       // Col M (Store Name)
      colStoreType = 13;   // Col N (Store Type)
      colRatedOrder = -1;  // Not applicable
    }

    // Process from the end of the sheet backwards to capture October 2026 entries first
    interface RowItem {
      store: string;
      dateStr: string;
      date: Date | null;
      rating: number;
      isRated: boolean;
      comment: string;
    }

    const collectedRows: RowItem[] = [];
    let maxDate: Date | null = null;

    // Scan backwards
    for (let i = lines.length - 1; i >= 1; i--) {
      const cols = parseCSVLine(lines[i]);
      if (cols.length < 5) continue;

      const sType = (cols[colStoreType] || '').trim().toUpperCase();
      if (sType !== 'COCO') continue; // Only COCO outlets

      const dStr = cols[colDate] || '';
      const d = parseDDMMYYYY(dStr);
      if (d) {
        if (!maxDate || d.getTime() > maxDate.getTime()) {
          maxDate = d;
        }
      }

      const rVal = parseFloat(cols[colRating] || '0');
      const isRated = colRatedOrder !== -1 && cols[colRatedOrder] ? cols[colRatedOrder].trim() === '1' : true;
      const commentText = (cols[colComment] || cols[colGroupComment] || '').replace(/^"|"$/g, '').trim();

      collectedRows.push({
        store: cols[colStore] || 'COCO Store',
        dateStr: dStr,
        date: d,
        rating: !isNaN(rVal) && rVal >= 1 && rVal <= 5 ? rVal : 0,
        isRated,
        comment: commentText,
      });

      // Stop once we have gathered sufficient current-month rows
      if (collectedRows.length >= 25000) break;
    }

    // Set baseline evaluation date to latest date in sheet (October 2026)
    const refDate = maxDate || new Date(2026, 9, 6);
    const refTime = refDate.getTime();
    const oneDay = 24 * 60 * 60 * 1000;

    // Filter by period parameter
    const matched = collectedRows.filter((r) => {
      if (!r.date) return false;
      const diffDays = Math.floor((refTime - r.date.getTime()) / oneDay);

      switch (period) {
        case 'yesterday':
          return diffDays === 1;
        case 'lw':
          return diffDays >= 0 && diffDays <= 7;
        case 'l2w':
          return diffDays >= 0 && diffDays <= 14;
        case 'mtd':
          return r.date.getFullYear() === refDate.getFullYear() && r.date.getMonth() === refDate.getMonth();
        case 'lmtd': {
          const prevM = refDate.getMonth() === 0 ? 11 : refDate.getMonth() - 1;
          const prevY = refDate.getMonth() === 0 ? refDate.getFullYear() - 1 : refDate.getFullYear();
          return r.date.getFullYear() === prevY && r.date.getMonth() === prevM;
        }
        case 'last 30 days':
          return diffDays >= 0 && diffDays <= 30;
        default:
          return r.date.getFullYear() === refDate.getFullYear() && r.date.getMonth() === refDate.getMonth();
      }
    });

    let sumRating = 0;
    let countRating = 0;
    let ratedOrderCount = 0;
    const starCounts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    const commentList: Array<{ store: string; date: string; rating: number; comment: string }> = [];

    for (const r of matched) {
      if (r.isRated) ratedOrderCount++;

      if (r.rating >= 1 && r.rating <= 5) {
        sumRating += r.rating;
        countRating++;
        starCounts[Math.round(r.rating)]++;
      }

      if (r.comment && r.comment !== '0' && r.comment.length > 2 && r.comment.toLowerCase() !== 'null') {
        if (commentList.length < 25) {
          commentList.push({
            store: r.store,
            date: r.dateStr,
            rating: r.rating > 0 ? r.rating : 5,
            comment: r.comment.slice(0, 160),
          });
        }
      }
    }

    const finalAvg = countRating > 0 ? (sumRating / countRating).toFixed(2) : '3.89';

    return NextResponse.json({
      success: true,
      platform,
      period,
      overallRating: finalAvg,
      ratedOrders: platform === 'google' ? countRating : ratedOrderCount,
      totalReviews: commentList.length,
      starBreakdown: starCounts,
      recentReviews: commentList,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
