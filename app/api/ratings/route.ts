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
  let day = parseInt(parts[0], 10);
  let month = parseInt(parts[1], 10) - 1;
  let year = parseInt(parts[2].slice(0, 4), 10);
  if (parts[0].length === 4) {
    year = parseInt(parts[0], 10);
    month = parseInt(parts[1], 10) - 1;
    day = parseInt(parts[2], 10);
  }
  if (year < 100) year += 2000;
  const d = new Date(year, month, day);
  return isNaN(d.getTime()) ? null : d;
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

    // Platform Column Index Mapping
    let colDate = 2;       // Zomato Col C
    let colStore = 3;      // Zomato Col D
    let colBrand = 4;      // Zomato Col E
    let colCategory = 6;   // Zomato Col G
    let colOrderCount = 8; // Zomato Col I
    let colRating = 9;     // Zomato Col J
    let colStoreType = 10; // Zomato Col K
    let colRegion = 11;    // Zomato Col L
    let colRatedOrder = 12;// Zomato Col M
    let colComment = 13;   // Zomato Col N

    if (platform === 'swiggy') {
      colDate = 4;         // Col E
      colStore = 5;        // Col F
      colBrand = 6;        // Col G
      colCategory = 8;     // Col I
      colOrderCount = 10;  // Col K
      colRating = 11;      // Col L
      colStoreType = 12;   // Col M
      colRegion = 13;      // Col N
      colRatedOrder = 14;  // Col O
      colComment = 9;      // Col J
    } else if (platform === 'google') {
      colRating = 7;       // Col H
      colComment = 8;      // Col I
      colDate = 10;        // Col K
      colStore = 12;       // Col M
      colStoreType = 13;   // Col N
      colRegion = 14;      // Col O
      colBrand = 0;        // Col A
      colRatedOrder = -1;
    }

    interface CleanRow {
      date: Date;
      dateKey: string;
      brand: string;
      region: string;
      store: string;
      rating: number;
      isRatedOrder: boolean;
      orderCount: number;
      isIssue: boolean;
      comment: string;
    }

    const rows: CleanRow[] = [];
    let maxDate: Date | null = null;
    const knownBrands = ['Frozen Bottle', 'Madno', 'Boba Bar', 'Lubov'];

    // Universal scan: parses rows regardless of top/bottom position
    for (let i = 1; i < lines.length; i++) {
      const cols = parseCSVLine(lines[i]);
      if (cols.length < 5) continue;

      const sType = (cols[colStoreType] || '').trim().toUpperCase();
      if (sType !== 'COCO') continue; // Enforce COCO store evaluation

      const d = parseDDMMYYYY(cols[colDate] || '');
      if (!d) continue;

      if (!maxDate || d.getTime() > maxDate.getTime()) {
        maxDate = d;
      }

      // Brand Normalization
      let brand = (cols[colBrand] || '').trim();
      const matchedBrand = knownBrands.find((kb) => brand.toLowerCase().includes(kb.toLowerCase()));
      if (matchedBrand) brand = matchedBrand;
      else if (!brand) {
        const storeName = cols[colStore] || '';
        const sbMatch = knownBrands.find((kb) => storeName.toLowerCase().includes(kb.toLowerCase()));
        brand = sbMatch || 'Frozen Bottle';
      }

      // Region Normalization
      let region = (cols[colRegion] || '').trim().toUpperCase();
      if (region.includes('KARNATAKA') || region === 'KA') region = 'KA';
      else if (region.includes('MAHARASHTRA') || region.includes('MUMBAI') || region.includes('PUNE') || region === 'MH') region = 'MH';
      else if (region.includes('TAMIL') || region.includes('CHENNAI') || region === 'TN') region = 'TN';
      else if (region.includes('KERALA') || region.includes('KOCHI') || region === 'KERELA' || region === 'KL') region = 'Kerela';
      else if (!region) region = 'KA';

      const rVal = parseFloat(cols[colRating] || '0');
      const hasRating = !isNaN(rVal) && rVal >= 1 && rVal <= 5;
      const isRated = colRatedOrder !== -1 && cols[colRatedOrder] ? cols[colRatedOrder].trim() === '1' : hasRating;
      const orderCount = colOrderCount !== -1 ? parseInt(cols[colOrderCount] || '1', 10) || 1 : 1;
      const commentText = (cols[colComment] || '').replace(/^"|"$/g, '').trim();
      const isIssue = (hasRating && rVal <= 3) || (commentText && commentText.length > 2 && commentText !== '0');

      rows.push({
        date: d,
        dateKey: d.toISOString().split('T')[0],
        brand,
        region,
        store: (cols[colStore] || 'COCO Store').trim(),
        rating: hasRating ? rVal : 0,
        isRatedOrder: isRated,
        orderCount,
        isIssue,
        comment: commentText,
      });
    }

    const refDate = maxDate || new Date(2026, 9, 7);
    const currYear = refDate.getFullYear();
    const currMonth = refDate.getMonth();
    const prevMonth = currMonth === 0 ? 11 : currMonth - 1;
    const prevYear = currMonth === 0 ? currYear - 1 : currYear;

    const currentLabel = refDate.toLocaleString('default', { month: 'short' }) + `-${String(currYear).slice(-2)}`;
    const previousLabel = new Date(prevYear, prevMonth, 1).toLocaleString('default', { month: 'short' }) + `-${String(prevYear).slice(-2)}`;

    // Build Slicer Options
    const allBrands = Array.from(new Set(rows.map((r) => r.brand))).sort();
    const allRegions = Array.from(new Set(rows.map((r) => r.region))).sort();
    const allStores = Array.from(new Set(rows.map((r) => r.store))).sort();

    // Apply Slicers
    const filteredRows = rows.filter((r) => {
      if (brandFilter !== 'ALL' && r.brand !== brandFilter) return false;
      if (regionFilter !== 'ALL' && r.region !== regionFilter) return false;
      if (storeFilter !== 'ALL' && r.store !== storeFilter) return false;
      return true;
    });

    // Generate Line Chart Data for Day, Week, and Month trends
    const dayMap: Record<string, { sum: number; count: number; date: string }> = {};
    const weekMap: Record<string, { sum: number; count: number; label: string }> = {};
    const monthMap: Record<string, { sum: number; count: number; label: string }> = {};

    for (const r of filteredRows) {
      if (r.rating <= 0) continue;

      // Day Level (Last 14 Days)
      const diffDays = Math.floor((refDate.getTime() - r.date.getTime()) / (24 * 60 * 60 * 1000));
      if (diffDays >= 0 && diffDays <= 14) {
        if (!dayMap[r.dateKey]) dayMap[r.dateKey] = { sum: 0, count: 0, date: r.dateKey.slice(5) };
        dayMap[r.dateKey].sum += r.rating;
        dayMap[r.dateKey].count++;
      }

      // Week Level (Last 8 Weeks)
      const weekDiff = Math.floor(diffDays / 7);
      if (diffDays >= 0 && weekDiff <= 7) {
        const wKey = `WK - ${8 - weekDiff}`;
        if (!weekMap[wKey]) weekMap[wKey] = { sum: 0, count: 0, label: wKey };
        weekMap[wKey].sum += r.rating;
        weekMap[wKey].count++;
      }

      // Month Level (Last 6 Months)
      const mKey = r.date.toLocaleString('default', { month: 'short' }) + `-${String(r.date.getFullYear()).slice(-2)}`;
      if (!monthMap[mKey]) monthMap[mKey] = { sum: 0, count: 0, label: mKey };
      monthMap[mKey].sum += r.rating;
      monthMap[mKey].count++;
    }

    const chartData = {
      day: Object.keys(dayMap).sort().map((k) => ({
        label: dayMap[k].date,
        rating: (dayMap[k].sum / dayMap[k].count).toFixed(2),
      })),
      week: Object.keys(weekMap).map((k) => ({
        label: weekMap[k].label,
        rating: (weekMap[k].sum / weekMap[k].count).toFixed(2),
      })),
      month: Object.keys(monthMap).map((k) => ({
        label: monthMap[k].label,
        rating: (monthMap[k].sum / monthMap[k].count).toFixed(2),
      })),
    };

    // Calculate Matrix Metrics for Current vs Previous Month
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

    // Overall Average
    const overall = buildMetric('Average', filteredRows);

    // Brand Breakdown
    const brands = allBrands.map((b) => buildMetric(b, filteredRows.filter((r) => r.brand === b)));

    // Region by Brand Hierarchy
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
      slicers: { brands: allBrands, regions: allRegions, stores: allStores },
      chartData,
      performance: { overall, brands, regions },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
