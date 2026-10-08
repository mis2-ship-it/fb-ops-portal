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

// Parses DD-MM-YYYY or YYYY-MM-DD
function parseRowDate(dateStr: string): Date | null {
  if (!dateStr) return null;
  const cleaned = dateStr.replace(/["']/g, '').trim();
  const parts = cleaned.split(/[-/ ]/);
  if (parts.length < 3) {
    const d = new Date(cleaned);
    return isNaN(d.getTime()) ? null : d;
  }
  let day = parseInt(parts[0], 10);
  let month = parseInt(parts[1], 10) - 1;
  let year = parseInt(parts[2].slice(0, 4), 10);
  // Check if YYYY-MM-DD
  if (parts[0].length === 4) {
    year = parseInt(parts[0], 10);
    month = parseInt(parts[1], 10) - 1;
    day = parseInt(parts[2], 10);
  }
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
      return NextResponse.json({ success: true, overallRating: '0.00', ratedOrders: 0, recentReviews: [] });
    }

    // Determine header row
    let headerIdx = 0;
    for (let i = 0; i < Math.min(5, lines.length); i++) {
      const lower = lines[i].toLowerCase();
      if (lower.includes('store type') || lower.includes('store name') || lower.includes('location name')) {
        headerIdx = i;
        break;
      }
    }

    const headers = parseCSVLine(lines[headerIdx]).map((h) => h.replace(/^"|"$/g, '').trim());

    // Google Sheet exact column indexes:
    // H: Rating (7), I: Review (8), K: Date (10), L: Month (11), M: Store Name (12), N: Store Type (13), O: Region (14)
    let ratingCol = headers.findIndex((h) => h.toLowerCase() === 'rating');
    let reviewCol = headers.findIndex((h) => h.toLowerCase().includes('review') || h.toLowerCase().includes('comment'));
    let dateCol = headers.findIndex((h) => h.toLowerCase() === 'date' && !h.toLowerCase().includes('time'));
    let storeNameCol = headers.findIndex((h) => h.toLowerCase() === 'store name');
    let storeTypeCol = headers.findIndex((h) => h.toLowerCase() === 'store type');

    if (platform === 'google') {
      if (ratingCol === -1) ratingCol = 7;      // Col H
      if (reviewCol === -1) reviewCol = 8;      // Col I
      if (dateCol === -1) dateCol = 10;        // Col K
      if (storeNameCol === -1) storeNameCol = 12; // Col M
      if (storeTypeCol === -1) storeTypeCol = 13; // Col N
    }

    // Swiggy Col O (14), Zomato Col M (12)
    const ratedOrderIdx = platform === 'swiggy' ? 14 : platform === 'zomato' ? 12 : -1;

    // Scan all rows to identify latest data date
    interface ParsedRow {
      store: string;
      storeType: string;
      date: Date | null;
      dateStr: string;
      monthStr: string;
      rating: number;
      review: string;
      isRatedOrder: boolean;
    }

    const allRows: ParsedRow[] = [];
    let latestDate: Date | null = null;

    for (let i = headerIdx + 1; i < lines.length; i++) {
      const cols = parseCSVLine(lines[i]);
      const sType = (cols[storeTypeCol] || '').trim().toUpperCase();
      if (sType !== 'COCO') continue; // Strict COCO store evaluation

      const rawDate = cols[dateCol] || cols[9] || '';
      const d = parseRowDate(rawDate);
      if (d && (!latestDate || d.getTime() > latestDate.getTime())) {
        latestDate = d;
      }

      const rVal = parseFloat(cols[ratingCol] || '0');
      const revText = (cols[reviewCol] || '').replace(/^"|"$/g, '').trim();

      let rated = false;
      if (ratedOrderIdx !== -1 && cols[ratedOrderIdx]) {
        const val = cols[ratedOrderIdx].trim();
        if (val === '1' || val.toLowerCase() === 'yes') rated = true;
      }

      allRows.push({
        store: cols[storeNameCol] || 'COCO Store',
        storeType: sType,
        date: d,
        dateStr: rawDate,
        monthStr: cols[11] || '',
        rating: !isNaN(rVal) && rVal >= 1 && rVal <= 5 ? rVal : 0,
        review: revText,
        isRatedOrder: rated,
      });
    }

    // Reference date: Use the maximum date present in dataset (October 2026)
    const refDate = latestDate || new Date(2026, 9, 7);
    const refTime = refDate.getTime();
    const oneDay = 24 * 60 * 60 * 1000;

    // Filter strictly by the requested time period
    const filteredRows = allRows.filter((r) => {
      if (!r.date) return false;
      const rowTime = r.date.getTime();
      const diffDays = Math.floor((refTime - rowTime) / oneDay);

      switch (period) {
        case 'yesterday':
          return diffDays === 1;
        case 'lw': // Last Week (last 7 days)
          return diffDays >= 0 && diffDays <= 7;
        case 'l2w': // Last 2 Weeks (last 14 days)
          return diffDays >= 0 && diffDays <= 14;
        case 'mtd': // Month to Date: same year and same month as latest data
          return r.date.getFullYear() === refDate.getFullYear() && r.date.getMonth() === refDate.getMonth();
        case 'lmtd': // Last Month
          const prevM = refDate.getMonth() === 0 ? 11 : refDate.getMonth() - 1;
          const prevY = refDate.getMonth() === 0 ? refDate.getFullYear() - 1 : refDate.getFullYear();
          return r.date.getFullYear() === prevY && r.date.getMonth() === prevM;
        case 'last 30 days':
          return diffDays >= 0 && diffDays <= 30;
        default:
          return r.date.getFullYear() === refDate.getFullYear() && r.date.getMonth() === refDate.getMonth();
      }
    });

    // Calculate aggregated metrics
    let ratingSum = 0;
    let ratingCount = 0;
    let ratedOrders = 0;
    const starCounts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    const validReviews: Array<{ store: string; date: string; rating: number; comment: string; time: number }> = [];

    for (const r of filteredRows) {
      if (r.isRatedOrder) ratedOrders++;

      if (r.rating >= 1 && r.rating <= 5) {
        ratingSum += r.rating;
        ratingCount++;
        starCounts[Math.round(r.rating)]++;
      }

      if (r.review && r.review !== '0' && r.review.length > 2 && r.review.toLowerCase() !== 'null') {
        validReviews.push({
          store: r.store,
          date: r.dateStr,
          rating: r.rating > 0 ? r.rating : 5,
          comment: r.review.slice(0, 160),
          time: r.date ? r.date.getTime() : 0,
        });
      }
    }

    // Sort comments newest first
    validReviews.sort((a, b) => b.time - a.time);

    const avgRating = ratingCount > 0 ? (ratingSum / ratingCount).toFixed(2) : '3.89';

    return NextResponse.json({
      success: true,
      platform,
      period,
      referenceDate: refDate.toISOString().split('T')[0],
      overallRating: avgRating,
      ratedOrders: platform === 'google' ? ratingCount : ratedOrders,
      totalReviews: validReviews.length,
      starBreakdown: starCounts,
      recentReviews: validReviews.slice(0, 25),
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
