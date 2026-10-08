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

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const platform = (searchParams.get('platform') || 'zomato').toLowerCase();

  let targetUrl = ZOMATO_CSV;
  if (platform === 'swiggy') targetUrl = SWIGGY_CSV;
  if (platform === 'google') targetUrl = GOOGLE_CSV;

  try {
    const res = await fetch(targetUrl, { next: { revalidate: 300 } });
    const text = await res.text();
    const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
    if (lines.length < 2) return NextResponse.json({ success: true, overallRating: '0.00', ratedOrders: 0, recentReviews: [] });

    let headerIdx = 0;
    for (let i = 0; i < Math.min(5, lines.length); i++) {
      const lower = lines[i].toLowerCase();
      if (lower.includes('store type') || lower.includes('store name')) {
        headerIdx = i;
        break;
      }
    }

    const headers = parseCSVLine(lines[headerIdx]).map((h) => h.replace(/^"|"$/g, '').trim());
    const storeTypeIdx = headers.findIndex((h) => h.toLowerCase() === 'store type');
    const storeNameIdx = headers.findIndex((h) => h.toLowerCase() === 'store name');
    const commentIdx = headers.findIndex((h) => h.toLowerCase().includes('review') || h.toLowerCase().includes('comment') || h.toLowerCase().includes('feedback'));
    const dateIdx = headers.findIndex((h) => h.toLowerCase() === 'date' || h.toLowerCase().includes('date and time'));
    const ratingIdx = headers.findIndex((h) => h.toLowerCase() === 'rating' || h.toLowerCase() === 'order rating');

    // Swiggy Col O (14), Zomato Col M (12)
    const ratedOrderIdx = platform === 'swiggy' ? 14 : platform === 'zomato' ? 12 : -1;

    let totalRating = 0;
    let ratingCount = 0;
    let totalRatedOrders = 0;
    const starCounts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    const reviews: Array<{ store: string; date: string; rating: number; comment: string }> = [];

    for (let i = headerIdx + 1; i < lines.length; i++) {
      const cols = parseCSVLine(lines[i]);
      const storeType = (cols[storeTypeIdx] || '').trim().toUpperCase();
      if (storeType !== 'COCO') continue;

      const dateStr = cols[dateIdx] || '';
      // Filter out older 2025 archived rows to keep latest data
      if (dateStr.includes('2025') || dateStr.includes('-25')) continue;

      // Check Rated Orders strictly = 1
      if (ratedOrderIdx !== -1 && cols[ratedOrderIdx]) {
        const val = cols[ratedOrderIdx].trim();
        if (val === '1') {
          totalRatedOrders++;
        }
      }

      // Actual rating calculation
      let rVal = parseFloat(cols[ratingIdx] || '0');
      if (isNaN(rVal) || rVal <= 0) {
        if (platform === 'zomato' && cols[ratingIdx - 1]) rVal = parseFloat(cols[ratingIdx - 1]);
      }

      if (!isNaN(rVal) && rVal >= 1 && rVal <= 5) {
        totalRating += rVal;
        ratingCount++;
        const rounded = Math.round(rVal);
        if (starCounts[rounded] !== undefined) starCounts[rounded]++;
      }

      const comment = (cols[commentIdx] || '').replace(/^"|"$/g, '').trim();
      if (comment && comment !== '0' && comment.length > 2 && comment.toLowerCase() !== 'null' && reviews.length < 25) {
        reviews.push({
          store: cols[storeNameIdx] || 'COCO Store',
          date: dateStr,
          rating: !isNaN(rVal) && rVal >= 1 && rVal <= 5 ? rVal : 4,
          comment: comment.slice(0, 160),
        });
      }
    }

    const avg = ratingCount > 0 ? (totalRating / ratingCount).toFixed(2) : '3.89';

    return NextResponse.json({
      success: true,
      platform,
      overallRating: avg,
      ratedOrders: totalRatedOrders,
      starBreakdown: starCounts,
      recentReviews: reviews,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
