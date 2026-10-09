import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const viewType = (searchParams.get('view') || 'daily').toLowerCase();
  const brand = (searchParams.get('brand') || 'ALL').trim();
  const region = (searchParams.get('region') || 'ALL').trim();
  const source = (searchParams.get('source') || 'ALL').trim();
  const session = (searchParams.get('session') || 'ALL').trim();

  // Multipliers for each dropdown selection
  const brandMultipliers: Record<string, number> = {
    'Frozen Bottle': 0.82,
    'Madno': 0.13,
    'Lubov': 0.03,
    'Boba Bar': 0.02,
  };

  const regionMultipliers: Record<string, number> = {
    'KA': 0.52,
    'MH': 0.28,
    'TN': 0.16,
    'Kerela': 0.04,
  };

  const sourceMultipliers: Record<string, number> = {
    'Swiggy': 0.43,
    'Zomato': 0.30,
    'In Store': 0.25,
    'Ownly': 0.015,
    'Magicpin': 0.003,
    'Website': 0.002,
  };

  const sessionMultipliers: Record<string, number> = {
    'Dinner': 0.45,
    'Snacks': 0.22,
    'Lunch': 0.20,
    'Post Dinner': 0.10,
    'Breakfast': 0.03,
  };

  let multiplier = 1.0;
  if (brand !== 'ALL') multiplier *= (brandMultipliers[brand] ?? 0.25);
  if (region !== 'ALL') multiplier *= (regionMultipliers[region] ?? 0.25);
  if (source !== 'ALL') multiplier *= (sourceMultipliers[source] ?? 0.20);
  if (session !== 'ALL') multiplier *= (sessionMultipliers[session] ?? 0.20);

  // Guarantee minimum visible numbers
  multiplier = Math.max(0.008, multiplier);

  const fmt = (v: number) => v.toLocaleString('en-IN', { maximumFractionDigits: 2 });
  const baseNet = 1654290.98 * multiplier;
  const baseTxn = Math.max(8, Math.round(6694 * multiplier));
  const baseGross = 2558794.59 * multiplier;
  const baseDis = -973213.69 * multiplier;
  const aov = (baseNet / baseTxn).toFixed(2);

  const dailyKPI = [
    { param: 'Gross Sales', yesterday: fmt(baseGross), mtd: fmt(baseGross * 7.2), lmtd: fmt(baseGross * 6.7), trends: '+7.2%', lm: fmt(baseGross * 26.7), ly: fmt(baseGross * 20.3) },
    { param: 'Discount', yesterday: fmt(baseDis), mtd: fmt(baseDis * 7.0), lmtd: fmt(baseDis * 6.4), trends: '+10.3%', lm: fmt(baseDis * 26.1), ly: fmt(baseDis * 18.7) },
    { param: 'Net Sales', yesterday: fmt(baseNet), mtd: fmt(baseNet * 7.5), lmtd: fmt(baseNet * 6.9), trends: '+8.1%', lm: fmt(baseNet * 27.6), ly: fmt(baseNet * 21.6) },
    { param: 'Orders (Txn)', yesterday: fmt(baseTxn), mtd: fmt(baseTxn * 7.2), lmtd: fmt(baseTxn * 6.6), trends: '+10.0%', lm: fmt(baseTxn * 26.6), ly: fmt(baseTxn * 20.2) },
    { param: 'AOV', yesterday: aov, mtd: (parseFloat(aov) * 1.03).toFixed(2), lmtd: (parseFloat(aov) * 1.05).toFixed(2), trends: '-1.7%', lm: aov, ly: (parseFloat(aov) * 1.07).toFixed(2) },
    { param: 'Discount %', yesterday: '-38.03%', mtd: '-37.14%', lmtd: '-36.08%', trends: '+2.9%', lm: '-37.24%', ly: '-34.90%' },
  ];

  const weeklyKPI = [
    { param: 'Gross Sales', cwk: fmt(baseGross * 5.6), lw: fmt(baseGross * 5.4), l2w: fmt(baseGross * 5.0), gwLw: '+2.89%', gwL2w: '+10.12%' },
    { param: 'Discount', cwk: fmt(baseDis * 5.4), lw: fmt(baseDis * 5.1), l2w: fmt(baseDis * 4.8), gwLw: '+5.39%', gwL2w: '+12.82%' },
    { param: 'Net Sales', cwk: fmt(baseNet * 5.7), lw: fmt(baseNet * 5.6), l2w: fmt(baseNet * 5.2), gwLw: '+2.59%', gwL2w: '+9.97%' },
    { param: 'Orders (Txn)', cwk: fmt(baseTxn * 5.6), lw: fmt(baseTxn * 5.4), l2w: fmt(baseTxn * 5.1), gwLw: '+4.25%', gwL2w: '+9.56%' },
    { param: 'AOV', cwk: '253.14', lw: '257.24', l2w: '252.20', gwLw: '-1.59%', gwL2w: '+0.37%' },
    { param: 'Discount %', cwk: '-37.05%', lw: '-36.17%', l2w: '-36.16%', gwLw: '+2.43%', gwL2w: '+2.46%' },
  ];

  const monthlyKPI = [
    { param: 'Gross Sales', octMtd: fmt(baseGross * 7.2), sep: fmt(baseGross * 26.7), aug: fmt(baseGross * 25.1), jul: fmt(baseGross * 23.0), momGw: '+6.47%' },
    { param: 'Discount', octMtd: fmt(baseDis * 7.0), sep: fmt(baseDis * 26.1), aug: fmt(baseDis * 24.5), jul: fmt(baseDis * 21.8), momGw: '+6.87%' },
    { param: 'Net Sales', octMtd: fmt(baseNet * 7.5), sep: fmt(baseNet * 27.6), aug: fmt(baseNet * 26.1), jul: fmt(baseNet * 24.1), momGw: '+6.18%' },
    { param: 'Orders (Txn)', octMtd: fmt(baseTxn * 7.2), sep: fmt(baseTxn * 26.6), aug: fmt(baseTxn * 25.2), jul: fmt(baseTxn * 23.0), momGw: '+5.46%' },
    { param: 'AOV', octMtd: '255.10', sep: '256.76', aug: '255.00', jul: '258.36', momGw: '+0.69%' },
    { param: 'Discount %', octMtd: '-37.14%', sep: '-37.24%', aug: '-37.10%', jul: '-35.98%', momGw: '-0.26%' },
  ];

  const liveKPI = [
    { param: 'Live Gross', yesterday: fmt(baseGross * 0.42), mtd: fmt(baseGross * 7.2), lmtd: fmt(baseGross * 6.7), trends: '+12.4%', lm: fmt(baseGross * 26.7), ly: fmt(baseGross * 20.3) },
    { param: 'Live Discount', yesterday: fmt(baseDis * 0.42), mtd: fmt(baseDis * 7.0), lmtd: fmt(baseDis * 6.4), trends: '+8.1%', lm: fmt(baseDis * 26.1), ly: fmt(baseDis * 18.7) },
    { param: 'Live Net Sales', yesterday: fmt(baseNet * 0.42), mtd: fmt(baseNet * 7.5), lmtd: fmt(baseNet * 6.9), trends: '+14.2%', lm: fmt(baseNet * 27.6), ly: fmt(baseNet * 21.6) },
    { param: 'Live Orders', yesterday: fmt(Math.round(baseTxn * 0.42)), mtd: fmt(baseTxn * 7.2), lmtd: fmt(baseTxn * 6.6), trends: '+11.8%', lm: fmt(baseTxn * 26.6), ly: fmt(baseTxn * 20.2) },
    { param: 'Live AOV', yesterday: aov, mtd: aov, lmtd: aov, trends: '+2.1%', lm: aov, ly: aov },
    { param: 'Discount %', yesterday: '-38.03%', mtd: '-37.14%', lmtd: '-36.08%', trends: '-0.8%', lm: '-37.24%', ly: '-34.90%' },
  ];

  const aovBuckets = [
    { bucket: '0-100', col1: `0.1% | ${Math.max(1, Math.round(3 * multiplier))}`, col2: `0.1% | ${Math.max(1, Math.round(4 * multiplier))}`, col3: `0.1% | ${Math.max(1, Math.round(59 * multiplier))}`, col4: `0.1% | ${Math.max(1, Math.round(26 * multiplier))}` },
    { bucket: '100-200', col1: `2.8% | ${Math.max(1, Math.round(457 * multiplier))}`, col2: `3.1% | ${Math.max(1, Math.round(565 * multiplier))}`, col3: `2.5% | ${Math.max(1, Math.round(3455 * multiplier))}`, col4: `4.1% | ${Math.max(1, Math.round(4946 * multiplier))}` },
    { bucket: '200-300', col1: `18.1% | ${Math.max(1, Math.round(2386 * multiplier))}`, col2: `19% | ${Math.max(1, Math.round(2422 * multiplier))}`, col3: `21.9% | ${Math.max(1, Math.round(21811 * multiplier))}`, col4: `21.3% | ${Math.max(1, Math.round(17537 * multiplier))}` },
    { bucket: '300-400', col1: `32.8% | ${Math.max(1, Math.round(3714 * multiplier))}`, col2: `23.5% | ${Math.max(1, Math.round(2600 * multiplier))}`, col3: `28.9% | ${Math.max(1, Math.round(24831 * multiplier))}`, col4: `31.8% | ${Math.max(1, Math.round(21720 * multiplier))}` },
    { bucket: '400-500', col1: `28.9% | ${Math.max(1, Math.round(2574 * multiplier))}`, col2: `31.7% | ${Math.max(1, Math.round(3016 * multiplier))}`, col3: `28.2% | ${Math.max(1, Math.round(20363 * multiplier))}`, col4: `24.9% | ${Math.max(1, Math.round(14306 * multiplier))}` },
    { bucket: '500-600', col1: `11% | ${Math.max(1, Math.round(841 * multiplier))}`, col2: `15.9% | ${Math.max(1, Math.round(1323 * multiplier))}`, col3: `12% | ${Math.max(1, Math.round(7184 * multiplier))}`, col4: `10.6% | ${Math.max(1, Math.round(5011 * multiplier))}` },
    { bucket: '>600', col1: '0% | 0', col2: '0% | 0', col3: `6.8% | ${Math.max(1, Math.round(2645 * multiplier))}`, col4: `7.5% | ${Math.max(1, Math.round(2599 * multiplier))}` },
  ];

  const discountBuckets = [
    { bucket: '0%', col1: `16.3% | ${Math.max(1, Math.round(1463 * multiplier))}`, col2: `24.9% | ${Math.max(1, Math.round(2590 * multiplier))}`, col3: `27.2% | ${Math.max(1, Math.round(21690 * multiplier))}`, col4: `32.5% | ${Math.max(1, Math.round(21420 * multiplier))}` },
    { bucket: '1%-10%', col1: `3.7% | ${Math.max(1, Math.round(281 * multiplier))}`, col2: `10% | ${Math.max(1, Math.round(1144 * multiplier))}`, col3: `8.5% | ${Math.max(1, Math.round(6579 * multiplier))}`, col4: `7.8% | ${Math.max(1, Math.round(4988 * multiplier))}` },
    { bucket: '10%-20%', col1: `10.4% | ${Math.max(1, Math.round(824 * multiplier))}`, col2: `9.3% | ${Math.max(1, Math.round(797 * multiplier))}`, col3: `9.9% | ${Math.max(1, Math.round(6023 * multiplier))}`, col4: `9.8% | ${Math.max(1, Math.round(5832 * multiplier))}` },
    { bucket: '20%-30%', col1: `11% | ${Math.max(1, Math.round(1183 * multiplier))}`, col2: `9.9% | ${Math.max(1, Math.round(930 * multiplier))}`, col3: `11.3% | ${Math.max(1, Math.round(8431 * multiplier))}`, col4: `16.4% | ${Math.max(1, Math.round(10223 * multiplier))}` },
    { bucket: '30%-40%', col1: `26.4% | ${Math.max(1, Math.round(2768 * multiplier))}`, col2: `24.8% | ${Math.max(1, Math.round(2584 * multiplier))}`, col3: `26.7% | ${Math.max(1, Math.round(21791 * multiplier))}`, col4: `25% | ${Math.max(1, Math.round(16998 * multiplier))}` },
    { bucket: '40%-50%', col1: `28.7% | ${Math.max(1, Math.round(3206 * multiplier))}`, col2: `20.5% | ${Math.max(1, Math.round(2186 * multiplier))}`, col3: `15.6% | ${Math.max(1, Math.round(14262 * multiplier))}`, col4: `8.2% | ${Math.max(1, Math.round(5988 * multiplier))}` },
    { bucket: '50%-60%', col1: `3.8% | ${Math.max(1, Math.round(574 * multiplier))}`, col2: `0.9% | ${Math.max(1, Math.round(137 * multiplier))}`, col3: `1.2% | ${Math.max(1, Math.round(1504 * multiplier))}`, col4: `0.6% | ${Math.max(1, Math.round(632 * multiplier))}` },
    { bucket: '60%-70%', col1: `0.1% | ${Math.max(1, Math.round(5 * multiplier))}`, col2: `0.1% | ${Math.max(1, Math.round(5 * multiplier))}`, col3: `0.1% | ${Math.max(1, Math.round(66 * multiplier))}`, col4: `0.1% | ${Math.max(1, Math.round(52 * multiplier))}` },
    { bucket: '70%-80%', col1: `0.1% | ${Math.max(1, Math.round(1 * multiplier))}`, col2: '0% | 0', col3: `0.1% | ${Math.max(1, Math.round(2 * multiplier))}`, col4: `0.1% | ${Math.max(1, Math.round(7 * multiplier))}` },
    { bucket: '80%-90%', col1: '0% | 0', col2: '0% | 0', col3: '0% | 0', col4: '0% | 0' },
    { bucket: '90%-100%', col1: '0% | 0', col2: '0% | 0', col3: '0% | 0', col4: `0.1% | ${Math.max(1, Math.round(5 * multiplier))}` },
  ];

  const brandSummary = [
    { brand: 'Frozen Bottle', todayRev: fmt(1361945.20 * multiplier), lwRev: '1,527,938.74', growth: '-10.86%', todayDis: '-38.86%', lwDis: '-33.95%', disChange: '-4.91%' },
    { brand: 'Madno', todayRev: fmt(217070.66 * multiplier), lwRev: '248,423.59', growth: '-12.62%', todayDis: '-36.72%', lwDis: '-35.07%', disChange: '-1.65%' },
    { brand: 'Lubov', todayRev: fmt(41896.73 * multiplier), lwRev: '23,669.96', growth: '+77.00%', todayDis: '-9.20%', lwDis: '-22.00%', disChange: '+12.81%' },
    { brand: 'Boba Bar', todayRev: fmt(33378.39 * multiplier), lwRev: '30,577.34', growth: '+9.16%', todayDis: '-37.66%', lwDis: '-37.46%', disChange: '-0.20%' },
  ];

  const sourceSummary = [
    { source: 'In Store', todayRev: fmt(413067.33 * multiplier), lwRev: '327,500.62', growth: '+26.13%', todayDis: '-35.11%', lwDis: '-4.75%', disChange: '-30.36%' },
    { source: 'Swiggy', todayRev: fmt(712060.43 * multiplier), lwRev: '796,805.36', growth: '-10.64%', todayDis: '-38.59%', lwDis: '-37.58%', disChange: '-1.01%' },
    { source: 'Zomato', todayRev: fmt(502321.15 * multiplier), lwRev: '578,142.08', growth: '-13.11%', todayDis: '-39.12%', lwDis: '-38.22%', disChange: '-0.90%' },
    { source: 'Ownly', todayRev: fmt(25019.70 * multiplier), lwRev: '27,602.03', growth: '-9.36%', todayDis: '-3.25%', lwDis: '0.00%', disChange: '-3.25%' },
    { source: 'Magicpin', todayRev: fmt(1459.12 * multiplier), lwRev: '408.81', growth: '+256.92%', todayDis: '-47.54%', lwDis: '-51.31%', disChange: '+3.77%' },
    { source: 'Website', todayRev: fmt(1522.85 * multiplier), lwRev: '1,580.55', growth: '-3.65%', todayDis: '0.00%', lwDis: '0.00%', disChange: '0.00%' },
  ];

  let selectedOverallKPI = dailyKPI;
  if (viewType === 'weekly') selectedOverallKPI = weeklyKPI;
  else if (viewType === 'monthly') selectedOverallKPI = monthlyKPI;
  else if (viewType === 'live') selectedOverallKPI = liveKPI;

  return NextResponse.json({
    success: true,
    viewType,
    dataTill: '09 Oct 2026 05:00 PM (Hourly Synced)',
    executiveInsight: '-9.6% vs LW, +22.3% vs L2W, +8.1% vs MoM, +41.7% vs LY -> Dynamic Filter Pacing',
    kpis: {
      netRev: fmt(baseNet),
      orders: fmt(baseTxn),
      disPct: '-38.03%',
      aov: aov,
      offlinePct: '25.0%',
      onlinePct: '75.0%',
    },
    slicers: {
      brands: ['Frozen Bottle', 'Madno', 'Boba Bar', 'Lubov'],
      regions: ['KA', 'MH', 'TN', 'Kerela'],
      sources: ['In Store', 'Swiggy', 'Zomato', 'Magicpin', 'Ownly', 'Website'],
      sessions: ['Breakfast', 'Lunch', 'Snacks', 'Dinner', 'Post Dinner'],
    },
    overallKPI: selectedOverallKPI,
    aovBuckets,
    discountBuckets,
    brandSummary,
    sourceSummary,
  });
}
