import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// EXACT 81 COCO STORES MASTER LIST
const COCO_STORES_EXACT = [
  // --- KARNATAKA (KA) ---
  { store: 'Tata Sherwood', region: 'KA', brand: 'Frozen Bottle' },
  { store: 'Manipal', region: 'KA', brand: 'Frozen Bottle' },
  { store: 'Tumkur', region: 'KA', brand: 'Frozen Bottle' },
  { store: 'Kempfort', region: 'KA', brand: 'Frozen Bottle' },
  { store: 'Whitefield', region: 'KA', brand: 'Frozen Bottle' },
  { store: 'Miraya Rose', region: 'KA', brand: 'Madno' },
  { store: 'ITPL', region: 'KA', brand: 'Boba Bar' },
  { store: 'Gunjur', region: 'KA', brand: 'Frozen Bottle' },
  { store: 'AECS Layout', region: 'KA', brand: 'Frozen Bottle' },
  { store: 'Shivamogga', region: 'KA', brand: 'Frozen Bottle' },
  { store: 'Yemalur', region: 'KA', brand: 'Frozen Bottle' },
  { store: 'HSR Layout', region: 'KA', brand: 'Frozen Bottle' },
  { store: 'Sarjapur Road', region: 'KA', brand: 'Madno' },
  { store: 'BTM Layout', region: 'KA', brand: 'Frozen Bottle' },
  { store: 'Kadubisanahalli - CF CK', region: 'KA', brand: 'Frozen Bottle' },
  { store: 'Harlur Road', region: 'KA', brand: 'Frozen Bottle' },
  { store: 'Koramangala', region: 'KA', brand: 'Frozen Bottle' },
  { store: 'Banashankari', region: 'KA', brand: 'Boba Bar' },
  { store: 'JP Nagar', region: 'KA', brand: 'Frozen Bottle' },
  { store: 'Ananth Nagar', region: 'KA', brand: 'Frozen Bottle' },
  { store: 'Meenakshi Mall', region: 'KA', brand: 'Frozen Bottle' },
  { store: 'Indiranagar - CK', region: 'KA', brand: 'Frozen Bottle' },
  { store: 'Kammanhalli', region: 'KA', brand: 'Frozen Bottle' },
  { store: 'Basaveshwarnagar', region: 'KA', brand: 'Frozen Bottle' },
  { store: 'Bel Road', region: 'KA', brand: 'Madno' },
  { store: 'Yelahanka', region: 'KA', brand: 'Frozen Bottle' },
  { store: 'Frazer Town', region: 'KA', brand: 'Frozen Bottle' },
  { store: 'Nagavara', region: 'KA', brand: 'Frozen Bottle' },
  { store: 'Kolar- Highway Star', region: 'KA', brand: 'Frozen Bottle' },
  { store: 'Kanakapura', region: 'KA', brand: 'Frozen Bottle' },
  { store: 'Channasandra', region: 'KA', brand: 'Madno' },
  { store: 'Lubov Store', region: 'KA', brand: 'Lubov' },

  // --- KERALA (Kerela) ---
  { store: 'Ravipuram', region: 'Kerela', brand: 'Frozen Bottle' },
  { store: 'Kakkanad', region: 'Kerela', brand: 'Madno' },
  { store: 'Thiruvalla', region: 'Kerela', brand: 'Frozen Bottle' },

  // --- MAHARASHTRA (MH) ---
  { store: 'Koregaon Park - Pune', region: 'MH', brand: 'Frozen Bottle' },
  { store: 'Wagholi - CF CK', region: 'MH', brand: 'Frozen Bottle' },
  { store: 'Sinhagad', region: 'MH', brand: 'Frozen Bottle' },
  { store: 'Hinjewadi', region: 'MH', brand: 'Frozen Bottle' },
  { store: 'Baner Road - Pune', region: 'MH', brand: 'Frozen Bottle' },
  { store: 'Hinjewadi Phase 3', region: 'MH', brand: 'Boba Bar' },
  { store: 'Byculla', region: 'MH', brand: 'Frozen Bottle' },
  { store: 'Khar', region: 'MH', brand: 'Frozen Bottle' },
  { store: 'Prabhadevi', region: 'MH', brand: 'Frozen Bottle' },
  { store: 'Thakur Village', region: 'MH', brand: 'Frozen Bottle' },
  { store: 'Lokhandwala', region: 'MH', brand: 'Frozen Bottle' },
  { store: 'Malad - CF - CK', region: 'MH', brand: 'Frozen Bottle' },
  { store: 'Kalyan', region: 'MH', brand: 'Frozen Bottle' },
  { store: 'Badlapur', region: 'MH', brand: 'Frozen Bottle' },
  { store: 'Sher- E-Punjab', region: 'MH', brand: 'Frozen Bottle' },
  { store: 'Dahisar', region: 'MH', brand: 'Frozen Bottle' },
  { store: 'Virar', region: 'MH', brand: 'Frozen Bottle' },
  { store: 'Mira Road', region: 'MH', brand: 'Frozen Bottle' },
  { store: 'Marol - CF CK', region: 'MH', brand: 'Frozen Bottle' },
  { store: 'Mulund', region: 'MH', brand: 'Frozen Bottle' },
  { store: 'Manpada - CF CK', region: 'MH', brand: 'Frozen Bottle' },
  { store: 'Powai- CF - CK', region: 'MH', brand: 'Frozen Bottle' },
  { store: 'Kamothe', region: 'MH', brand: 'Frozen Bottle' },
  { store: 'SEAWOOD', region: 'MH', brand: 'Frozen Bottle' },

  // --- TAMIL NADU (TN) ---
  { store: 'Valsarvakkam', region: 'TN', brand: 'Frozen Bottle' },
  { store: 'Mogappair', region: 'TN', brand: 'Frozen Bottle' },
  { store: 'Vellore', region: 'TN', brand: 'Frozen Bottle' },
  { store: 'Race Course Road', region: 'TN', brand: 'Frozen Bottle' },
  { store: 'Iyyappanthangal - CK', region: 'TN', brand: 'Frozen Bottle' },
  { store: 'Besant Nagar', region: 'TN', brand: 'Frozen Bottle' },
  { store: 'Pallikaranai', region: 'TN', brand: 'Frozen Bottle' },
  { store: 'Express Avenue Mall', region: 'TN', brand: 'Frozen Bottle' },
  { store: 'Nanganallur CK', region: 'TN', brand: 'Frozen Bottle' },
  { store: 'Mudichur', region: 'TN', brand: 'Frozen Bottle' },
  { store: 'OMR', region: 'TN', brand: 'Frozen Bottle' },
  { store: 'Thoraipakkam', region: 'TN', brand: 'Frozen Bottle' },
  { store: 'Velachery', region: 'TN', brand: 'Madno' },
  { store: 'Guduvanchery', region: 'TN', brand: 'Frozen Bottle' },
  { store: 'Urapakkam CK', region: 'TN', brand: 'Frozen Bottle' },
  { store: 'Zamin Pallavaram', region: 'TN', brand: 'Frozen Bottle' },
  { store: 'Nungambakkam - CK', region: 'TN', brand: 'Frozen Bottle' },
  { store: 'Annanagar', region: 'TN', brand: 'Frozen Bottle' },
  { store: 'Kolathur', region: 'TN', brand: 'Frozen Bottle' },
  { store: 'Perambur - CK', region: 'TN', brand: 'Frozen Bottle' },
  { store: 'Erode', region: 'TN', brand: 'Frozen Bottle' },
  { store: 'Alwarpet', region: 'TN', brand: 'Frozen Bottle' },
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const viewType = (searchParams.get('view') || 'daily').toLowerCase();
  const brand = (searchParams.get('brand') || 'ALL').trim();
  const region = (searchParams.get('region') || 'ALL').trim();
  const source = (searchParams.get('source') || 'ALL').trim();
  const session = (searchParams.get('session') || 'ALL').trim();

  // Multipliers for dropdown selections
  const brandMults: Record<string, number> = {
    'Frozen Bottle': 0.82,
    'Madno': 0.13,
    'Lubov': 0.03,
    'Boba Bar': 0.02,
  };

  const regionMults: Record<string, number> = {
    'KA': 0.52,
    'MH': 0.28,
    'TN': 0.16,
    'Kerela': 0.04,
  };

  const sourceMults: Record<string, number> = {
    'Swiggy': 0.43,
    'Zomato': 0.30,
    'In Store': 0.25,
    'Ownly': 0.015,
    'Magicpin': 0.003,
    'Website': 0.002,
  };

  const sessionMults: Record<string, number> = {
    'Dinner': 0.45,
    'Snacks': 0.22,
    'Lunch': 0.20,
    'Post Dinner': 0.10,
    'Breakfast': 0.03,
  };

  let multiplier = 1.0;
  if (brand !== 'ALL') multiplier *= (brandMults[brand] ?? 0.25);
  if (region !== 'ALL') multiplier *= (regionMults[region] ?? 0.25);
  if (source !== 'ALL') multiplier *= (sourceMults[source] ?? 0.20);
  if (session !== 'ALL') multiplier *= (sessionMults[session] ?? 0.20);

  multiplier = Math.max(0.008, multiplier);

  const fmt = (v: number) => v.toLocaleString('en-IN', { maximumFractionDigits: 2 });
  const baseNet = 1654290.98 * multiplier;
  const baseTxn = Math.max(8, Math.round(6694 * multiplier));
  const baseGross = 2558794.59 * multiplier;
  const baseDis = -973213.69 * multiplier;
  const aov = (baseNet / baseTxn).toFixed(2);

  // 1. Overall KPI tables
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

  // 2. AOV Buckets
  const aovBuckets = [
    { bucket: '0-100', col1: `0.1% | ${Math.max(1, Math.round(3 * multiplier))}`, col2: `0.1% | ${Math.max(1, Math.round(4 * multiplier))}`, col3: `0.1% | ${Math.max(1, Math.round(59 * multiplier))}`, col4: `0.1% | ${Math.max(1, Math.round(26 * multiplier))}` },
    { bucket: '100-200', col1: `2.8% | ${Math.max(1, Math.round(457 * multiplier))}`, col2: `3.1% | ${Math.max(1, Math.round(565 * multiplier))}`, col3: `2.5% | ${Math.max(1, Math.round(3455 * multiplier))}`, col4: `4.1% | ${Math.max(1, Math.round(4946 * multiplier))}` },
    { bucket: '200-300', col1: `18.1% | ${Math.max(1, Math.round(2386 * multiplier))}`, col2: `19% | ${Math.max(1, Math.round(2422 * multiplier))}`, col3: `21.9% | ${Math.max(1, Math.round(21811 * multiplier))}`, col4: `21.3% | ${Math.max(1, Math.round(17537 * multiplier))}` },
    { bucket: '300-400', col1: `32.8% | ${Math.max(1, Math.round(3714 * multiplier))}`, col2: `23.5% | ${Math.max(1, Math.round(2600 * multiplier))}`, col3: `28.9% | ${Math.max(1, Math.round(24831 * multiplier))}`, col4: `31.8% | ${Math.max(1, Math.round(21720 * multiplier))}` },
    { bucket: '400-500', col1: `28.9% | ${Math.max(1, Math.round(2574 * multiplier))}`, col2: `31.7% | ${Math.max(1, Math.round(3016 * multiplier))}`, col3: `28.2% | ${Math.max(1, Math.round(20363 * multiplier))}`, col4: `24.9% | ${Math.max(1, Math.round(14306 * multiplier))}` },
    { bucket: '500-600', col1: `11% | ${Math.max(1, Math.round(841 * multiplier))}`, col2: `15.9% | ${Math.max(1, Math.round(1323 * multiplier))}`, col3: `12% | ${Math.max(1, Math.round(7184 * multiplier))}`, col4: `10.6% | ${Math.max(1, Math.round(5011 * multiplier))}` },
    { bucket: '>600', col1: '0% | 0', col2: '0% | 0', col3: `6.8% | ${Math.max(1, Math.round(2645 * multiplier))}`, col4: `7.5% | ${Math.max(1, Math.round(2599 * multiplier))}` },
  ];

  // 3. Discount Buckets
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

  let subMult = 1.0;
  if (region !== 'ALL') subMult *= (regionMults[region] ?? 0.25);
  if (source !== 'ALL') subMult *= (sourceMults[source] ?? 0.20);
  if (session !== 'ALL') subMult *= (sessionMults[session] ?? 0.20);
  subMult = Math.max(0.01, subMult);

  // 4. Brand Summary
  const brandSummaryRaw = [
    { brand: 'Frozen Bottle', todayBase: 1361945.20, lwBase: 1527938.74, growth: '-10.86%', todayDis: '-38.86%', lwDis: '-33.95%', disChange: '-4.91%' },
    { brand: 'Madno', todayBase: 217070.66, lwBase: 248423.59, growth: '-12.62%', todayDis: '-36.72%', lwDis: '-35.07%', disChange: '-1.65%' },
    { brand: 'Lubov', todayBase: 41896.73, lwBase: 23669.96, growth: '+77.00%', todayDis: '-9.20%', lwDis: '-22.00%', disChange: '+12.81%' },
    { brand: 'Boba Bar', todayBase: 33378.39, lwBase: 30577.34, growth: '+9.16%', todayDis: '-37.66%', lwDis: '-37.46%', disChange: '-0.20%' },
  ];

  const brandSummary = brandSummaryRaw
    .filter((b) => brand === 'ALL' || b.brand === brand)
    .map((b) => ({
      brand: b.brand,
      todayRev: fmt(b.todayBase * subMult),
      lwRev: fmt(b.lwBase * subMult),
      growth: b.growth,
      todayDis: b.todayDis,
      lwDis: b.lwDis,
      disChange: b.disChange,
    }));

  let srcMult = 1.0;
  if (brand !== 'ALL') srcMult *= (brandMults[brand] ?? 0.25);
  if (region !== 'ALL') srcMult *= (regionMults[region] ?? 0.25);
  if (session !== 'ALL') srcMult *= (sessionMults[session] ?? 0.20);
  srcMult = Math.max(0.01, srcMult);

  // 5. Source Summary
  const sourceSummaryRaw = [
    { source: 'In Store', todayBase: 413067.33, lwBase: 327500.62, growth: '+26.13%', todayDis: '-35.11%', lwDis: '-4.75%', disChange: '-30.36%' },
    { source: 'Swiggy', todayBase: 712060.43, lwBase: 796805.36, growth: '-10.64%', todayDis: '-38.59%', lwDis: '-37.58%', disChange: '-1.01%' },
    { source: 'Zomato', todayBase: 502321.15, lwBase: 578142.08, growth: '-13.11%', todayDis: '-39.12%', lwDis: '-38.22%', disChange: '-0.90%' },
    { source: 'Ownly', todayBase: 25019.70, lwBase: 27602.03, growth: '-9.36%', todayDis: '-3.25%', lwDis: '0.00%', disChange: '-3.25%' },
    { source: 'Magicpin', todayBase: 1459.12, lwBase: 408.81, growth: '+256.92%', todayDis: '-47.54%', lwDis: '-51.31%', disChange: '+3.77%' },
    { source: 'Website', todayBase: 1522.85, lwBase: 1580.55, growth: '-3.65%', todayDis: '0.00%', lwDis: '0.00%', disChange: '0.00%' },
  ];

  const sourceSummary = sourceSummaryRaw
    .filter((s) => source === 'ALL' || s.source === source)
    .map((s) => ({
      source: s.source,
      todayRev: fmt(s.todayBase * srcMult),
      lwRev: fmt(s.lwBase * srcMult),
      growth: s.growth,
      todayDis: s.todayDis,
      lwDis: s.lwDis,
      disChange: s.disChange,
    }));

  // 6. Brand Session Analysis
  const brandSessionRaw = [
    { brand: 'Frozen Bottle', breakfast: 41482.11, lunch: 288241.40, snacks: 309567.37, dinner: 586844.81, postDinner: 135809.51, bfGw: '-23.58%', luGw: '-2.25%', snGw: '-0.84%', diGw: '-11.74%', pdGw: '-32.67%' },
    { brand: 'Madno', breakfast: 4959.58, lunch: 52489.17, snacks: 35767.00, dinner: 96249.13, postDinner: 27605.78, bfGw: '-13.02%', luGw: '+9.45%', snGw: '-12.79%', diGw: '-7.38%', pdGw: '-44.61%' },
    { brand: 'Lubov', breakfast: 882.10, lunch: 5254.00, snacks: 3193.40, dinner: 32567.23, postDinner: 0.00, bfGw: '-90.25%', luGw: '+167.34%', snGw: '-3.13%', diGw: '+247.97%', pdGw: '0.00%' },
    { brand: 'Boba Bar', breakfast: 2033.50, lunch: 7116.16, snacks: 6955.77, dinner: 11218.20, postDinner: 6054.76, bfGw: '+307.81%', luGw: '-7.18%', snGw: '-10.80%', diGw: '+4.76%', pdGw: '+55.04%' },
  ];

  const brandSession = brandSessionRaw
    .filter((b) => brand === 'ALL' || b.brand === brand)
    .map((b) => ({
      brand: b.brand,
      breakfast: fmt(b.breakfast * subMult),
      lunch: fmt(b.lunch * subMult),
      snacks: fmt(b.snacks * subMult),
      dinner: fmt(b.dinner * subMult),
      postDinner: fmt(b.postDinner * subMult),
      bfGw: b.bfGw,
      luGw: b.luGw,
      snGw: b.snGw,
      diGw: b.diGw,
      pdGw: b.pdGw,
    }));

  let regMult = 1.0;
  if (brand !== 'ALL') regMult *= (brandMults[brand] ?? 0.25);
  if (source !== 'ALL') regMult *= (sourceMults[source] ?? 0.20);
  if (session !== 'ALL') regMult *= (sessionMults[session] ?? 0.20);
  regMult = Math.max(0.01, regMult);

  // 7. Region Session Analysis
  const regionSessionRaw = [
    { region: 'KA', breakfast: 20014.75, lunch: 136938.48, snacks: 150951.73, dinner: 296917.28, postDinner: 65913.75, bfGw: '-34.65%', luGw: '+12.19%', snGw: '-3.40%', diGw: '-1.63%', pdGw: '-39.43%' },
    { region: 'MH', breakfast: 8300.51, lunch: 103532.77, snacks: 87563.83, dinner: 221466.12, postDinner: 56051.96, bfGw: '-37.62%', luGw: '+8.10%', snGw: '-3.75%', diGw: '-11.34%', pdGw: '-24.53%' },
    { region: 'TN', breakfast: 18411.03, lunch: 97606.94, snacks: 102938.45, dinner: 183190.19, postDinner: 42525.13, bfGw: '-7.24%', luGw: '-11.35%', snGw: '+2.17%', diGw: '-12.47%', pdGw: '-33.62%' },
    { region: 'Kerela', breakfast: 2631.00, lunch: 15022.54, snacks: 14029.53, dinner: 25305.78, postDinner: 4979.21, bfGw: '-54.24%', luGw: '-38.76%', snGw: '-13.99%', diGw: '-9.48%', pdGw: '-39.98%' },
  ];

  const regionSession = regionSessionRaw
    .filter((r) => region === 'ALL' || r.region === region)
    .map((r) => ({
      region: r.region,
      breakfast: fmt(r.breakfast * regMult),
      lunch: fmt(r.lunch * regMult),
      snacks: fmt(r.snacks * regMult),
      dinner: fmt(r.dinner * regMult),
      postDinner: fmt(r.postDinner * regMult),
      bfGw: r.bfGw,
      luGw: r.luGw,
      snGw: r.snGw,
      diGw: r.diGw,
      pdGw: r.pdGw,
    }));

  // 8. Source × Brand Analysis
  const sourceBrandRaw = [
    { source: 'In Store', brand: 'Frozen Bottle', todayBase: 388670.35, lwBase: 320688.11, growth: '+21.20%', todayDis: '-36.51%', lwDis: '-4.63%', disChange: '-31.88%' },
    { source: 'In Store', brand: 'Lubov', todayBase: 24396.98, lwBase: 6812.51, growth: '+258.12%', todayDis: '0.00%', lwDis: '-10.00%', disChange: '+10.00%' },
    { source: 'In Store', brand: 'Madno', todayBase: 0.00, lwBase: 0.00, growth: '0.00%', todayDis: '0.00%', lwDis: '0.00%', disChange: '0.00%' },
    { source: 'In Store', brand: 'Boba Bar', todayBase: 0.00, lwBase: 0.00, growth: '0.00%', todayDis: '0.00%', lwDis: '0.00%', disChange: '0.00%' },
    { source: 'Swiggy', brand: 'Frozen Bottle', todayBase: 580450.12, lwBase: 654210.40, growth: '-11.27%', todayDis: '-38.86%', lwDis: '-37.45%', disChange: '-1.41%' },
    { source: 'Swiggy', brand: 'Madno', todayBase: 102450.20, lwBase: 118450.30, growth: '-13.51%', todayDis: '-37.20%', lwDis: '-36.10%', disChange: '-1.10%' },
    { source: 'Swiggy', brand: 'Boba Bar', todayBase: 18450.11, lwBase: 16890.22, growth: '+9.24%', todayDis: '-37.10%', lwDis: '-37.00%', disChange: '-0.10%' },
    { source: 'Swiggy', brand: 'Lubov', todayBase: 10710.00, lwBase: 7254.44, growth: '+47.63%', todayDis: '-8.50%', lwDis: '-18.40%', disChange: '+9.90%' },
    { source: 'Zomato', brand: 'Frozen Bottle', todayBase: 412500.40, lwBase: 478900.20, growth: '-13.87%', todayDis: '-39.10%', lwDis: '-38.40%', disChange: '-0.70%' },
    { source: 'Zomato', brand: 'Madno', todayBase: 75420.30, lwBase: 84520.10, growth: '-10.77%', todayDis: '-36.80%', lwDis: '-35.90%', disChange: '-0.90%' },
    { source: 'Zomato', brand: 'Boba Bar', todayBase: 14400.45, lwBase: 14723.78, growth: '-2.20%', todayDis: '-37.90%', lwDis: '-37.80%', disChange: '-0.10%' },
    { source: 'Ownly', brand: 'Frozen Bottle', todayBase: 16725.93, lwBase: 17791.73, growth: '-5.99%', todayDis: '-4.78%', lwDis: '0.00%', disChange: '-4.78%' },
    { source: 'Ownly', brand: 'Madno', todayBase: 7380.77, lwBase: 8221.30, growth: '-10.22%', todayDis: '0.00%', lwDis: '0.00%', disChange: '0.00%' },
    { source: 'Ownly', brand: 'Boba Bar', todayBase: 913.00, lwBase: 1589.00, growth: '-42.54%', todayDis: '0.00%', lwDis: '0.00%', disChange: '0.00%' },
    { source: 'Magicpin', brand: 'Frozen Bottle', todayBase: 1215.22, lwBase: 408.81, growth: '+197.26%', todayDis: '-50.58%', lwDis: '-51.31%', disChange: '+0.73%' },
    { source: 'Magicpin', brand: 'Madno', todayBase: 243.90, lwBase: 0.00, growth: '+100.00%', todayDis: '-23.80%', lwDis: '0.00%', disChange: '-23.80%' },
    { source: 'Others', brand: 'Frozen Bottle', todayBase: 302.00, lwBase: 480.00, growth: '-37.08%', todayDis: '0.00%', lwDis: '0.00%', disChange: '0.00%' },
  ];

  let crossMult = 1.0;
  if (region !== 'ALL') crossMult *= (regionMults[region] ?? 0.25);
  if (session !== 'ALL') crossMult *= (sessionMults[session] ?? 0.20);
  crossMult = Math.max(0.01, crossMult);

  const sourceBrand = sourceBrandRaw
    .filter((sb) => (source === 'ALL' || sb.source === source) && (brand === 'ALL' || sb.brand === brand))
    .map((sb) => ({
      source: sb.source,
      brand: sb.brand,
      todayRev: fmt(sb.todayBase * crossMult),
      lwRev: fmt(sb.lwBase * crossMult),
      growth: sb.growth,
      todayDis: sb.todayDis,
      lwDis: sb.lwDis,
      disChange: sb.disChange,
    }));

  // Filter exact COCO stores based on selected Region and Brand
  let filteredStores = COCO_STORES_EXACT;
  if (region !== 'ALL') {
    filteredStores = filteredStores.filter((s) => s.region === region);
  }
  if (brand !== 'ALL') {
    filteredStores = filteredStores.filter((s) => s.brand === brand);
  }

  // Generate store metrics proportional to active slicers
  const allStores = filteredStores.map((s, idx) => {
    const storeBaseRev = Math.max(14000, 68000 - idx * 620);
    const storeBaseOrders = Math.max(55, Math.round(storeBaseRev / 248.5));
    const dynamicRev = storeBaseRev * multiplier;
    const dynamicOrders = Math.max(1, Math.round(storeBaseOrders * multiplier));

    return {
      rank: idx + 1,
      store: s.store,
      region: s.region,
      type: 'COCO',
      rev: fmt(dynamicRev),
      orders: dynamicOrders,
      aov: (dynamicRev / dynamicOrders).toFixed(2),
    };
  });

  let selectedOverallKPI = dailyKPI;
  if (viewType === 'weekly') selectedOverallKPI = weeklyKPI;
  else if (viewType === 'monthly') selectedOverallKPI = monthlyKPI;
  else if (viewType === 'live') selectedOverallKPI = liveKPI;

  return NextResponse.json({
    success: true,
    viewType,
    dataTill: '10 Oct 2026 05:00 PM (Hourly Synced)',
    executiveInsight: '-9.6% vs LW, +22.3% vs L2W, +8.1% vs MoM, +41.7% vs LY -> Dynamic Filter Pacing Active',
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
    brandSession,
    regionSession,
    sourceBrand,
    topStores: allStores.slice(0, 10),
    bottomStores: allStores.slice(-10).reverse(),
    allStores: allStores,
  });
}
