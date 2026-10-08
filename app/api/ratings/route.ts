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

function parseRowDate(dateStr: string, isDMY = false): Date | null {
  if (!dateStr) return null;
  const cleaned = dateStr.replace(/["']/g, '').trim();
  const parts = cleaned.split(/[-/ ]/);
  if (parts.length < 3) {
    const d = new Date(cleaned);
    return isNaN(d.getTime()) ? null : d;
  }
  let day: number, month: number, year: number;
  if (isDMY) {
    day = parseInt(parts[0], 10);
    month = parseInt(parts[1], 10) - 1;
    year = parseInt(parts[2].slice(0, 4), 10);
  } else {
    month = parseInt(parts[0], 10) - 1;
    day = parseInt(parts[1], 10);
    year = parseInt(parts[2].slice(0, 4), 10);
  }
  if (year < 100) year += 2000;
  const d = new Date(year, month, day);
  return isNaN(d.getTime()) ? null : d;
}

interface DimensionMetrics {
  prevRatingSum: number;
  prevRatingCount: number;
  currRatingSum: number;
  currRatingCount: number;
  prevRatedOrders: number;
  currRatedOrders: number;
  prevIssueOrders: number;
  currIssueOrders: number;
  prevStars: Record<number, number>;
  currStars: Record<number, number>;
}

function createEmptyMetric(): DimensionMetrics {
  return {
    prevRatingSum: 0,
    prevRatingCount: 0,
    currRatingSum: 0,
    currRatingCount: 0,
    prevRatedOrders: 0,
    currRatedOrders: 0,
    prevIssueOrders: 0,
    currIssueOrders: 0,
    prevStars: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    currStars: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  };
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
    if (lines.length < 2) return NextResponse.json({ success: false, error: 'Empty dataset' });

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
    const brandIdx = headers.findIndex((h) => h.toLowerCase().includes('brand'));
    const regionIdx = headers.findIndex((h) => h.toLowerCase().includes('region') || h.toLowerCase().includes('state') || h.toLowerCase().includes('city'));
    const categoryIdx = headers.findIndex((h) => h.toLowerCase().includes('category') || h.toLowerCase().includes('complaint') || h.toLowerCase().includes('issue'));
    const dateIdx = headers.findIndex((h) => h.toLowerCase() === 'date' || h.toLowerCase().includes('date and time'));
    const ratingIdx = headers.findIndex((h) => h.toLowerCase() === 'rating' || h.toLowerCase() === 'order rating');
    const orderCountIdx = headers.findIndex((h) => h.toLowerCase().includes('order count') || h.toLowerCase() === 'orders');

    // Column O (14) for Swiggy, Column M (12) for Zomato
    const ratedOrderIdx = platform === 'swiggy' ? 14 : platform === 'zomato' ? 12 : -1;

    // Determine latest date in the sheet to dynamically build Previous & Current windows
    let maxDate: Date | null = null;
    const parsedRows: any[] = [];

    for (let i = headerIdx + 1; i < lines.length; i++) {
      const cols = parseCSVLine(lines[i]);
      const storeType = (cols[storeTypeIdx] || '').toUpperCase();
      if (storeType !== 'COCO') continue;

      const d = parseRowDate(cols[dateIdx] || '', platform === 'google');
      if (d) {
        if (!maxDate || d.getTime() > maxDate.getTime()) maxDate = d;
      }
      parsedRows.push({ cols, date: d });
    }

    const currYear = maxDate ? maxDate.getFullYear() : 2026;
    const currMonth = maxDate ? maxDate.getMonth() : 9; // Oct is 9 (0-indexed)
    const prevMonth = currMonth === 0 ? 11 : currMonth - 1;
    const prevYear = currMonth === 0 ? currYear - 1 : currYear;

    const currentLabel = maxDate ? maxDate.toLocaleString('default', { month: 'short' }) + `-${String(currYear).slice(-2)}` : 'Oct-26';
    const previousLabel = new Date(prevYear, prevMonth, 1).toLocaleString('default', { month: 'short' }) + `-${String(prevYear).slice(-2)}`;

    const overall = createEmptyMetric();
    const brandMap: Record<string, DimensionMetrics> = {};
    const regionMap: Record<string, DimensionMetrics> = {};
    const categoryIssuesMap: Record<string, { prev: number; curr: number }> = {};
    const regionBrandMap: Record<string, Record<string, DimensionMetrics>> = {};

    const knownBrands = ['Frozen Bottle', 'Madno', 'Boba Bar', 'Lubov'];

    for (const row of parsedRows) {
      const { cols, date } = row;
      if (!date) continue;

      const isCurrent = date.getFullYear() === currYear && date.getMonth() === currMonth;
      const isPrevious = date.getFullYear() === prevYear && date.getMonth() === prevMonth;
      if (!isCurrent && !isPrevious) continue;

      // Extract Brand
      let brand = brandIdx !== -1 && cols[brandIdx] ? cols[brandIdx].trim() : '';
      if (!brand || !knownBrands.some((kb) => brand.toLowerCase().includes(kb.toLowerCase()))) {
        const store = cols[storeNameIdx] || '';
        const match = knownBrands.find((kb) => store.toLowerCase().includes(kb.toLowerCase()));
        brand = match || 'Frozen Bottle';
      }

      // Extract Region
      let region = regionIdx !== -1 && cols[regionIdx] ? cols[regionIdx].trim().toUpperCase() : 'KA';
      if (region.includes('KARNATAKA')) region = 'KA';
      else if (region.includes('MAHARASHTRA') || region.includes('MUMBAI') || region.includes('PUNE')) region = 'MH';
      else if (region.includes('TAMIL') || region.includes('CHENNAI')) region = 'TN';
      else if (region.includes('KERALA') || region.includes('KOCHI')) region = 'Kerela';

      // Rated Orders: Column == "1"
      let isRatedOrder = false;
      if (ratedOrderIdx !== -1 && cols[ratedOrderIdx]) {
        const rawVal = cols[ratedOrderIdx].trim();
        if (rawVal === '1') isRatedOrder = true;
      }

      // Rating value
      const rVal = parseFloat(cols[ratingIdx] || '0');
      const hasRating = !isNaN(rVal) && rVal >= 1 && rVal <= 5;
      const star = hasRating ? Math.min(5, Math.max(1, Math.round(rVal))) : 0;

      // Category level issues using Order Count column
      const category = categoryIdx !== -1 && cols[categoryIdx] ? cols[categoryIdx].trim() : '';
      const orderCount = orderCountIdx !== -1 ? parseInt(cols[orderCountIdx] || '1', 10) || 1 : 1;
      const isIssue = (hasRating && rVal <= 3) || (category && category !== '0' && category.toLowerCase() !== 'none');

      if (category && category !== '0') {
        if (!categoryIssuesMap[category]) categoryIssuesMap[category] = { prev: 0, curr: 0 };
        if (isCurrent) categoryIssuesMap[category].curr += orderCount;
        if (isPrevious) categoryIssuesMap[category].prev += orderCount;
      }

      // Update Aggregations
      const updateTarget = (target: DimensionMetrics) => {
        if (isCurrent) {
          if (isRatedOrder) target.currRatedOrders++;
          if (isIssue) target.currIssueOrders += orderCount;
          if (hasRating) {
            target.currRatingSum += rVal;
            target.currRatingCount++;
            target.currStars[star]++;
          }
        } else if (isPrevious) {
          if (isRatedOrder) target.prevRatedOrders++;
          if (isIssue) target.prevIssueOrders += orderCount;
          if (hasRating) {
            target.prevRatingSum += rVal;
            target.prevRatingCount++;
            target.prevStars[star]++;
          }
        }
      };

      updateTarget(overall);

      if (!brandMap[brand]) brandMap[brand] = createEmptyMetric();
      updateTarget(brandMap[brand]);

      if (!regionMap[region]) regionMap[region] = createEmptyMetric();
      updateTarget(regionMap[region]);

      if (!regionBrandMap[region]) regionBrandMap[region] = {};
      if (!regionBrandMap[region][brand]) regionBrandMap[region][brand] = createEmptyMetric();
      updateTarget(regionBrandMap[region][brand]);
    }

    const formatMetricBlock = (m: DimensionMetrics, name: string) => {
      const prevAvg = m.prevRatingCount > 0 ? (m.prevRatingSum / m.prevRatingCount) : 0;
      const currAvg = m.currRatingCount > 0 ? (m.currRatingSum / m.currRatingCount) : 0;
      const diffRating = (currAvg - prevAvg);

      const ratedOrderDiff = m.prevRatedOrders > 0
        ? (((m.currRatedOrders - m.prevRatedOrders) / m.prevRatedOrders) * 100)
        : 0;

      const issueDiff = m.prevIssueOrders > 0
        ? (((m.currIssueOrders - m.prevIssueOrders) / m.prevIssueOrders) * 100)
        : 0;

      const calcShares = (stars: Record<number, number>, total: number) => {
        const res: Record<number, string> = { 1: '0%', 2: '0%', 3: '0%', 4: '0%', 5: '0%' };
        for (let s = 1; s <= 5; s++) {
          res[s] = total > 0 ? `${Math.round((stars[s] / total) * 100)}%` : '0%';
        }
        return res;
      };

      return {
        name,
        prevRating: prevAvg.toFixed(2),
        currRating: currAvg.toFixed(2),
        ratingDiff: (diffRating >= 0 ? '+' : '') + diffRating.toFixed(2),
        prevStars: calcShares(m.prevStars, m.prevRatingCount),
        currStars: calcShares(m.currStars, m.currRatingCount),
        prevRatedOrders: m.prevRatedOrders,
        currRatedOrders: m.currRatedOrders,
        ratedOrdersPct: (ratedOrderDiff >= 0 ? '+' : '') + ratedOrderDiff.toFixed(2) + '%',
        prevIssueOrders: m.prevIssueOrders,
        currIssueOrders: m.currIssueOrders,
        issueOrdersPct: (issueDiff >= 0 ? '+' : '') + issueDiff.toFixed(2) + '%',
      };
    };

    return NextResponse.json({
      success: true,
      platform,
      previousLabel,
      currentLabel,
      average: formatMetricBlock(overall, 'Average'),
      brands: Object.entries(brandMap).map(([b, m]) => formatMetricBlock(m, b)),
      regions: Object.entries(regionMap).map(([r, m]) => ({
        region: formatMetricBlock(m, r),
        brandBreakdown: Object.entries(regionBrandMap[r] || {}).map(([b, bm]) => formatMetricBlock(bm, b)),
      })),
      categoryIssues: Object.entries(categoryIssuesMap)
        .map(([cat, counts]) => ({ category: cat, ...counts }))
        .sort((a, b) => b.curr - a.curr)
        .slice(0, 10),
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
