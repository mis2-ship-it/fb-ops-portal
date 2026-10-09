import { NextResponse } from 'next/server';

const GOOGLE_CSV = "https://docs.google.com/spreadsheets/d/1HlYNDNXig3PCjIFpQdI8B1lEzubsttUEPj_57DgpJoE/gviz/tq?tqx=out:csv&sheet=Complaints";
const SWIGGY_CSV = "https://docs.google.com/spreadsheets/d/1R5kdiLGiNV2zSxs2hyObxUF216iqeaDVTggM7mub0Ck/gviz/tq?tqx=out:csv&sheet=Raw%20Data";
const ZOMATO_CSV = "https://docs.google.com/spreadsheets/d/1V-tFd3I9CRxDUWSrU9Zc6ODW9Qhbs4C0SXZq4mW6tsg/gviz/tq?tqx=out:csv&sheet=Raw%20Data";

const VALID_BRANDS = ['Frozen Bottle', 'Madno', 'Boba Bar', 'Lubov'];

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

function parseStrictDate(dateStr: string, monthColStr = ''): Date | null {
  if (!dateStr) return null;
  const cleaned = dateStr.replace(/["']/g, '').trim();

  let overrideMonth = -1;
  const mLower = monthColStr.toLowerCase();
  if (mLower.includes('oct')) overrideMonth = 9;
  else if (mLower.includes('sep')) overrideMonth = 8;
  else if (mLower.includes('aug')) overrideMonth = 7;
  else if (mLower.includes('jul')) overrideMonth = 6;
  else if (mLower.includes('jun')) overrideMonth = 5;

  const parts = cleaned.split(/[-/ ]/);
  if (parts.length < 3) return null;

  let d = parseInt(parts[0], 10);
  let m = parseInt(parts[1], 10) - 1;
  let y = parseInt(parts[2].slice(0, 4), 10);

  if (parts[0].length === 4) {
    y = parseInt(parts[0], 10);
    m = parseInt(parts[1], 10) - 1;
    d = parseInt(parts[2], 10);
  }

  if (y > 2026 || y < 100) y = 2026;

  if (overrideMonth !== -1) {
    m = overrideMonth;
    if (d > 31 && parseInt(parts[1], 10) <= 31) {
      d = parseInt(parts[1], 10);
    }
  }

  const res = new Date(y, m, Math.min(31, Math.max(1, d)));
  return isNaN(res.getTime()) ? null : res;
}

interface MetricSummary {
  name: string;
  prevRating: string;
  currRating: string;
  ratingDiff: string;
  prevRatedOrders: number;
  currRatedOrders: number;
  ratedOrdersPct: string;
  prevIssueOrders: number;
  currIssueOrders: number;
  issueOrdersPct: string;
  prevStars: Record<number, string>;
  currStars: Record<number, string>;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const platform = (searchParams.get('platform') || 'zomato').toLowerCase();
  const brandFilter = searchParams.get('brand') || 'ALL';
  const regionFilter = searchParams.get('region') || 'ALL';
  const storeFilter = searchParams.get('store') || 'ALL';

  let targetUrl = ZOMATO_CSV;
  if (platform === 'swiggy') targetUrl = SWIGGY_CSV;
  if (platform === 'google') targetUrl = GOOGLE_CSV;

  try {
    const res = await fetch(targetUrl, { next: { revalidate: 60 } });
    const text = await res.text();
    const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
    if (lines.length < 2) return NextResponse.json({ success: false, error: 'Empty dataset' });

    let colDate = 2;          // Zomato Col C
    let colStore = 3;         // Zomato Col D
    let colBrand = 4;         // Zomato Col E
    let colCategory = 6;      // Zomato Col G
    let colGroupComment = 7;  // Zomato Col H (Group Comments)
    let colOrderCount = 8;    // Zomato Col I
    let colRating = 9;        // Zomato Col J
    let colStoreType = 10;    // Zomato Col K
    let colRegion = 11;       // Zomato Col L
    let colRatedOrder = 12;   // Zomato Col M
    let colComment = 13;      // Zomato Col N (Comments)
    let colMonth = 0;         // Col A

    if (platform === 'swiggy') {
      colMonth = 0;           // Col A
      colDate = 4;            // Col E
      colStore = 5;           // Col F
      colBrand = 6;           // Col G
      colCategory = 8;        // Col I
      colGroupComment = 9;    // Col J (Comments Group)
      colOrderCount = 10;     // Col K
      colRating = 11;         // Col L
      colStoreType = 12;      // Col M
      colRegion = 13;         // Col N
      colRatedOrder = 14;     // Col O
      colComment = 9;         // Col J
    } else if (platform === 'google') {
      colRating = 7;          // Col H
      colComment = 8;         // Col I
      colGroupComment = 8;
      colDate = 10;           // Col K
      colMonth = 11;          // Col L
      colStore = 12;          // Col M
      colStoreType = 13;      // Col N
      colRegion = 14;         // Col O
      colBrand = 0;
      colRatedOrder = -1;
      colCategory = -1;
      colOrderCount = -1;
    }

    interface CleanRow {
      date: Date;
      dateKey: string;
      brand: string;
      region: string;
      store: string;
      category: string;
      rating: number;
      isRatedOrder: boolean;
      orderCount: number;
      isIssue: boolean;
      issueType: string;
      comment: string;
    }

    const rows: CleanRow[] = [];
    const regionStoresMap: Record<string, Set<string>> = {};

    for (let i = 1; i < lines.length; i++) {
      const cols = parseCSVLine(lines[i]);
      if (cols.length < 5) continue;

      const sType = (cols[colStoreType] || '').trim().toUpperCase();
      if (sType !== 'COCO') continue;

      const d = parseStrictDate(cols[colDate] || '', cols[colMonth] || '');
      if (!d) continue;

      let rawBrand = (cols[colBrand] || '').trim();
      let matchedBrand = VALID_BRANDS.find((b) => rawBrand.toLowerCase().includes(b.toLowerCase()));
      if (!matchedBrand) {
        const sName = cols[colStore] || '';
        matchedBrand = VALID_BRANDS.find((b) => sName.toLowerCase().includes(b.toLowerCase()));
      }
      if (!matchedBrand) continue;

      let region = (cols[colRegion] || '').trim().toUpperCase();
      if (region.includes('KARNATAKA') || region === 'KA') region = 'KA';
      else if (region.includes('MAHARASHTRA') || region.includes('MUMBAI') || region.includes('PUNE') || region === 'MH') region = 'MH';
      else if (region.includes('TAMIL') || region.includes('CHENNAI') || region === 'TN') region = 'TN';
      else if (region.includes('KERALA') || region.includes('KOCHI') || region === 'KERELA' || region === 'KL') region = 'Kerela';
      else region = 'KA';

      const storeName = (cols[colStore] || 'COCO Store').trim();
      if (!regionStoresMap[region]) regionStoresMap[region] = new Set();
      regionStoresMap[region].add(storeName);

      const rVal = parseFloat(cols[colRating] || '0');
      const hasRating = !isNaN(rVal) && rVal >= 1 && rVal <= 5;
      const isRated = colRatedOrder !== -1 && cols[colRatedOrder] ? cols[colRatedOrder].trim() === '1' : hasRating;
      const orderCount = colOrderCount !== -1 ? parseInt(cols[colOrderCount] || '1', 10) || 1 : 1;

      // Issue Type Categorization (Qty, Quality, Missing, Wrong, Packing)
      const rawIssueText = (cols[colGroupComment] || '').toLowerCase();
      let issueType = '';
      if (rawIssueText.includes('quantity') || rawIssueText.includes('qty')) issueType = 'Quantity Issue';
      else if (rawIssueText.includes('quality') || rawIssueText.includes('taste') || rawIssueText.includes('spoiled')) issueType = 'Quality Issue';
      else if (rawIssueText.includes('missing') || rawIssueText.includes('item missing')) issueType = 'Missing Item Issue';
      else if (rawIssueText.includes('wrong') || rawIssueText.includes('incorrect')) issueType = 'Wrong Item Issue';
      else if (rawIssueText.includes('packing') || rawIssueText.includes('spill') || rawIssueText.includes('packaging')) issueType = 'Packing Issue';
      else if (rawIssueText.length > 2 && rawIssueText !== '0' && rawIssueText !== 'null') {
        issueType = (cols[colGroupComment] || '').trim();
      }

      const isIssue = (hasRating && rVal <= 3) || issueType.length > 0;
      const categoryName = colCategory !== -1 && cols[colCategory] ? cols[colCategory].trim() : 'General';
      const commentText = (cols[colComment] || cols[colGroupComment] || '').replace(/^"|"$/g, '').trim();

      rows.push({
        date: d,
        dateKey: d.toISOString().split('T')[0],
        brand: matchedBrand,
        region,
        store: storeName,
        category: categoryName,
        rating: hasRating ? rVal : 0,
        isRatedOrder: isRated,
        orderCount,
        isIssue,
        issueType: issueType || (rVal <= 3 && hasRating ? 'Low Rating (< 4★)' : ''),
        comment: commentText,
      });
    }

    const currYear = 2026;
    const currMonth = 9;  // Oct (0-indexed)
    const prevMonth = 8;  // Sep
    const prevYear = 2026;

    const currentLabel = 'Oct-26';
    const previousLabel = 'Sep-26';

    const allBrands = VALID_BRANDS;
    const allRegions = ['KA', 'MH', 'TN', 'Kerela'];

    const regionStoresObj: Record<string, string[]> = {};
    for (const [r, stSet] of Object.entries(regionStoresMap)) {
      regionStoresObj[r] = Array.from(stSet).sort();
    }

    // Apply Slicers
    const filteredRows = rows.filter((r) => {
      if (brandFilter !== 'ALL' && r.brand !== brandFilter) return false;
      if (regionFilter !== 'ALL' && r.region !== regionFilter) return false;
      if (storeFilter !== 'ALL' && r.store !== storeFilter) return false;
      return true;
    });

    // 1. Line Chart Data
    const dayMap: Record<string, { sum: number; count: number; date: string }> = {};
    const weekMap: Record<string, { sum: number; count: number; label: string }> = {};
    const monthMap: Record<string, { sum: number; count: number; label: string }> = {};

    const refDate = new Date(2026, 9, 7);

    for (const r of filteredRows) {
      if (r.rating <= 0) continue;

      if (r.date.getFullYear() === 2026 && r.date.getMonth() === 9) {
        if (!dayMap[r.dateKey]) dayMap[r.dateKey] = { sum: 0, count: 0, date: `10-${String(r.date.getDate()).padStart(2, '0')}` };
        dayMap[r.dateKey].sum += r.rating;
        dayMap[r.dateKey].count++;
      }

      const diffDays = Math.floor((refDate.getTime() - r.date.getTime()) / (24 * 60 * 60 * 1000));
      const weekDiff = Math.floor(diffDays / 7);
      if (diffDays >= 0 && weekDiff < 6) {
        const wKey = `WK - ${42 - weekDiff}`;
        if (!weekMap[wKey]) weekMap[wKey] = { sum: 0, count: 0, label: wKey };
        weekMap[wKey].sum += r.rating;
        weekMap[wKey].count++;
      }

      if (r.date.getFullYear() === 2026 && r.date.getMonth() >= 4 && r.date.getMonth() <= 9) {
        const mKey = r.date.toLocaleString('default', { month: 'short' }) + '-26';
        if (!monthMap[mKey]) monthMap[mKey] = { sum: 0, count: 0, label: mKey };
        monthMap[mKey].sum += r.rating;
        monthMap[mKey].count++;
      }
    }

    const monthOrder = ['May-26', 'Jun-26', 'Jul-26', 'Aug-26', 'Sep-26', 'Oct-26'];
    const monthPoints = monthOrder
      .filter((m) => monthMap[m])
      .map((m) => ({
        label: m,
        rating: (monthMap[m].sum / monthMap[m].count).toFixed(2),
      }));

    const chartData = {
      day: Object.keys(dayMap).sort().map((k) => ({
        label: dayMap[k].date,
        rating: (dayMap[k].sum / dayMap[k].count).toFixed(2),
      })),
      week: Object.keys(weekMap).reverse().map((k) => ({
        label: weekMap[k].label,
        rating: (weekMap[k].sum / weekMap[k].count).toFixed(2),
      })),
      month: monthPoints,
    };

    // 2. Issue Breakdown Analysis (Qty, Quality, Missing, Wrong, Packing)
    const issueCounts = {
      'Quantity Issue': { prev: 0, curr: 0 },
      'Quality Issue': { prev: 0, curr: 0 },
      'Missing Item Issue': { prev: 0, curr: 0 },
      'Wrong Item Issue': { prev: 0, curr: 0 },
      'Packing Issue': { prev: 0, curr: 0 },
    };

    // 3. Category Level Metrics
    const categoryStats: Record<string, { prevIssues: number; currIssues: number; currRatingSum: number; currRatingCount: number; currOrders: number }> = {};

    // 4. Latest Customer Comments
    const customerComments: Array<{ store: string; date: string; rating: number; issue: string; comment: string; time: number }> = [];

    for (const r of filteredRows) {
      const isC = r.date.getFullYear() === currYear && r.date.getMonth() === currMonth;
      const isP = r.date.getFullYear() === prevYear && r.date.getMonth() === prevMonth;

      // Issue Breakdown Counts
      if (r.issueType) {
        const key = Object.keys(issueCounts).find((k) => r.issueType.toLowerCase().includes(k.toLowerCase().split(' ')[0]));
        if (key) {
          if (isC) issueCounts[key as keyof typeof issueCounts].curr += r.orderCount;
          if (isP) issueCounts[key as keyof typeof issueCounts].prev += r.orderCount;
        }
      }

      // Category Metrics
      if (r.category && r.category !== '0' && r.category !== 'General') {
        if (!categoryStats[r.category]) {
          categoryStats[r.category] = { prevIssues: 0, currIssues: 0, currRatingSum: 0, currRatingCount: 0, currOrders: 0 };
        }
        if (isC) {
          if (r.isIssue) categoryStats[r.category].currIssues += r.orderCount;
          if (r.isRatedOrder) categoryStats[r.category].currOrders += r.orderCount;
          if (r.rating > 0) {
            categoryStats[r.category].currRatingSum += r.rating;
            categoryStats[r.category].currRatingCount++;
          }
        } else if (isP) {
          if (r.isIssue) categoryStats[r.category].prevIssues += r.orderCount;
        }
      }

      // Collect Comments
      if (isC && r.comment && r.comment.length > 2 && r.comment !== '0' && r.comment.toLowerCase() !== 'null') {
        customerComments.push({
          store: r.store,
          date: r.date.toISOString().split('T')[0],
          rating: r.rating > 0 ? r.rating : 4,
          issue: r.issueType || 'General Feedback',
          comment: r.comment.slice(0, 160),
          time: r.date.getTime(),
        });
      }
    }

    customerComments.sort((a, b) => b.time - a.time);

    const categoryList = Object.entries(categoryStats)
      .map(([name, stat]) => ({
        category: name,
        prevIssues: stat.prevIssues,
        currIssues: stat.currIssues,
        currRating: stat.currRatingCount > 0 ? (stat.currRatingSum / stat.currRatingCount).toFixed(2) : '3.80',
        issueRate: stat.currOrders > 0 ? ((stat.currIssues / stat.currOrders) * 100).toFixed(1) + '%' : '0%',
      }))
      .sort((a, b) => b.currIssues - a.currIssues)
      .slice(0, 8);

    // 5. Main Matrix Calculation
    const buildMetric = (name: string, targetRows: CleanRow[]): MetricSummary => {
      let pSum = 0, pCount = 0, cSum = 0, cCount = 0;
      let pRated = 0, cRated = 0, pIssues = 0, cIssues = 0;
      const pStars: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      const cStars: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

      for (const r of targetRows) {
        const isC = r.date.getFullYear() === currYear && r.date.getMonth() === currMonth;
        const isP = r.date.getFullYear() === prevYear && r.date.getMonth() === prevMonth;
        if (!isC && !isP) continue;

        if (isC) {
          if (r.isRatedOrder) cRated++;
          if (r.isIssue) cIssues += r.orderCount;
          if (r.rating >= 1 && r.rating <= 5) {
            cSum += r.rating;
            cCount++;
            cStars[Math.round(r.rating)]++;
          }
        } else if (isP) {
          if (r.isRatedOrder) pRated++;
          if (r.isIssue) pIssues += r.orderCount;
          if (r.rating >= 1 && r.rating <= 5) {
            pSum += r.rating;
            pCount++;
            pStars[Math.round(r.rating)]++;
          }
        }
      }

      const pAvg = pCount > 0 ? (pSum / pCount) : 0;
      const cAvg = cCount > 0 ? (cSum / cCount) : 0;
      const diff = cAvg - pAvg;
      const ratedDiff = pRated > 0 ? (((cRated - pRated) / pRated) * 100) : 0;
      const issueDiff = pIssues > 0 ? (((cIssues - pIssues) / pIssues) * 100) : 0;

      const calcShares = (st: Record<number, number>, tot: number) => {
        const out: Record<number, string> = { 1: '0%', 2: '0%', 3: '0%', 4: '0%', 5: '0%' };
        for (let s = 1; s <= 5; s++) out[s] = tot > 0 ? `${Math.round((st[s] / tot) * 100)}%` : '0%';
        return out;
      };

      return {
        name,
        prevRating: pAvg.toFixed(2),
        currRating: cAvg.toFixed(2),
        ratingDiff: (diff >= 0 ? '+' : '') + diff.toFixed(2),
        prevRatedOrders: pRated,
        currRatedOrders: cRated,
        ratedOrdersPct: (ratedDiff >= 0 ? '+' : '') + ratedDiff.toFixed(2) + '%',
        prevIssueOrders: pIssues,
        currIssueOrders: cIssues,
        issueOrdersPct: (issueDiff >= 0 ? '+' : '') + issueDiff.toFixed(2) + '%',
        prevStars: calcShares(pStars, pCount),
        currStars: calcShares(cStars, cCount),
      };
    };

    const overall = buildMetric('Average', filteredRows);
    const brands = allBrands.map((b) => buildMetric(b, filteredRows.filter((r) => r.brand === b)));

    const regions = allRegions.map((reg) => ({
      region: buildMetric(reg, filteredRows.filter((r) => r.region === reg)),
      brandBreakdown: allBrands.map((b) =>
        buildMetric(b, filteredRows.filter((r) => r.region === reg && r.brand === b))
      ).filter((bm) => bm.currRatedOrders > 0 || bm.prevRatedOrders > 0),
    }));

    return NextResponse.json({
      success: true,
      platform,
      previousLabel,
      currentLabel,
      slicers: { brands: allBrands, regions: allRegions, regionStores: regionStoresObj },
      chartData,
      issueBreakup: Object.entries(issueCounts).map(([issue, cnt]) => ({
        issue,
        prev: cnt.prev,
        curr: cnt.curr,
        diffPct: cnt.prev > 0 ? (((cnt.curr - cnt.prev) / cnt.prev) * 100).toFixed(1) + '%' : '0%',
      })),
      categoryPerformance: categoryList,
      recentComments: customerComments.slice(0, 20),
      performance: { overall, brands, regions },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
