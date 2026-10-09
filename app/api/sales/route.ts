import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const viewType = (searchParams.get('view') || 'daily').toLowerCase(); // 'daily' | 'weekly' | 'monthly'
  const brand = searchParams.get('brand') || 'ALL';
  const region = searchParams.get('region') || 'ALL';
  const source = searchParams.get('source') || 'ALL';
  const session = searchParams.get('session') || 'ALL';

  // 1. Overall KPI by View Mode
  const dailyKPI = [
    { param: 'Gross Sales', yesterday: '2,558,794.59', mtd: '18,452,190.00', lmtd: '17,210,480.00', trends: '+7.2%', lm: '68,410,250.00', ly: '52,140,800.00' },
    { param: 'Discount', yesterday: '-973,213.69', mtd: '-6,854,120.00', lmtd: '-6,210,450.00', trends: '+10.3%', lm: '-25,480,100.00', ly: '-18,200,400.00' },
    { param: 'Net Sales', yesterday: '1,654,290.98', mtd: '12,410,890.00', lmtd: '11,480,210.00', trends: '+8.1%', lm: '45,820,150.00', ly: '35,840,400.00' },
    { param: 'Orders (Txn)', yesterday: '6,694.00', mtd: '48,650.00', lmtd: '44,210.00', trends: '+10.0%', lm: '178,450.00', ly: '135,210.00' },
    { param: 'AOV', yesterday: '247.13', mtd: '255.10', lmtd: '259.67', trends: '-1.7%', lm: '256.76', ly: '265.07' },
    { param: 'Discount %', yesterday: '-38.03%', mtd: '-37.14%', lmtd: '-36.08%', trends: '+2.9%', lm: '-37.24%', ly: '-34.90%' },
  ];

  const weeklyKPI = [
    { param: 'Gross Sales', cwk: '14,250,890.00', lw: '13,850,210.00', l2w: '12,940,500.00', gwLw: '+2.89%', gwL2w: '+10.12%' },
    { param: 'Discount', cwk: '-5,280,450.00', lw: '-5,010,200.00', l2w: '-4,680,120.00', gwLw: '+5.39%', gwL2w: '+12.82%' },
    { param: 'Net Sales', cwk: '9,480,240.00', lw: '9,240,150.00', l2w: '8,620,400.00', gwLw: '+2.59%', gwL2w: '+9.97%' },
    { param: 'Orders (Txn)', cwk: '37,450.00', lw: '35,920.00', l2w: '34,180.00', gwLw: '+4.25%', gwL2w: '+9.56%' },
    { param: 'AOV', cwk: '253.14', lw: '257.24', l2w: '252.20', gwLw: '-1.59%', gwL2w: '+0.37%' },
    { param: 'Discount %', cwk: '-37.05%', lw: '-36.17%', l2w: '-36.16%', gwLw: '+2.43%', gwL2w: '+2.46%' },
  ];

  const monthlyKPI = [
    { param: 'Gross Sales', octMtd: '18,452,190.00', sep: '68,410,250.00', aug: '64,250,180.00', jul: '58,940,210.00', momGw: '+6.47%' },
    { param: 'Discount', octMtd: '-6,854,120.00', sep: '-25,480,100.00', aug: '-23,840,150.00', jul: '-21,210,400.00', momGw: '+6.87%' },
    { param: 'Net Sales', octMtd: '12,410,890.00', sep: '45,820,150.00', aug: '43,150,220.00', jul: '39,840,120.00', momGw: '+6.18%' },
    { param: 'Orders (Txn)', octMtd: '48,650.00', sep: '178,450.00', aug: '169,210.00', jul: '154,200.00', momGw: '+5.46%' },
    { param: 'AOV', octMtd: '255.10', sep: '256.76', aug: '255.00', jul: '258.36', momGw: '+0.69%' },
    { param: 'Discount %', octMtd: '-37.14%', sep: '-37.24%', aug: '-37.10%', jul: '-35.98%', momGw: '-0.26%' },
  ];

  // 2. AOV Bucket Analysis (Matching attached image exactly)
  const aovBuckets = [
    { bucket: '0-100', col1: '0.1% | 3', col2: '0.1% | 4', col3: '0.1% | 59', col4: '0.1% | 26' },
    { bucket: '100-200', col1: '2.8% | 457', col2: '3.1% | 565', col3: '2.5% | 3455', col4: '4.1% | 4946' },
    { bucket: '200-300', col1: '18.1% | 2386', col2: '19% | 2422', col3: '21.9% | 21811', col4: '21.3% | 17537' },
    { bucket: '300-400', col1: '32.8% | 3714', col2: '23.5% | 2600', col3: '28.9% | 24831', col4: '31.8% | 21720' },
    { bucket: '400-500', col1: '28.9% | 2574', col2: '31.7% | 3016', col3: '28.2% | 20363', col4: '24.9% | 14306' },
    { bucket: '500-600', col1: '11% | 841', col2: '15.9% | 1323', col3: '12% | 7184', col4: '10.6% | 5011' },
    { bucket: '>600', col1: '0% | 0', col2: '0% | 0', col3: '6.8% | 2645', col4: '7.5% | 2599' },
  ];

  // 3. Discount Bucket Analysis (Matching attached image exactly)
  const discountBuckets = [
    { bucket: '0%', col1: '16.3% | 1463', col2: '24.9% | 2590', col3: '27.2% | 21690', col4: '32.5% | 21420' },
    { bucket: '1%-10%', col1: '3.7% | 281', col2: '10% | 1144', col3: '8.5% | 6579', col4: '7.8% | 4988' },
    { bucket: '10%-20%', col1: '10.4% | 824', col2: '9.3% | 797', col3: '9.9% | 6023', col4: '9.8% | 5832' },
    { bucket: '20%-30%', col1: '11% | 1183', col2: '9.9% | 930', col3: '11.3% | 8431', col4: '16.4% | 10223' },
    { bucket: '30%-40%', col1: '26.4% | 2768', col2: '24.8% | 2584', col3: '26.7% | 21791', col4: '25% | 16998' },
    { bucket: '40%-50%', col1: '28.7% | 3206', col2: '20.5% | 2186', col3: '15.6% | 14262', col4: '8.2% | 5988' },
    { bucket: '50%-60%', col1: '3.8% | 574', col2: '0.9% | 137', col3: '1.2% | 1504', col4: '0.6% | 632' },
    { bucket: '60%-70%', col1: '0.1% | 5', col2: '0.1% | 5', col3: '0.1% | 66', col4: '0.1% | 52' },
    { bucket: '70%-80%', col1: '0.1% | 1', col2: '0% | 0', col3: '0.1% | 2', col4: '0.1% | 7' },
    { bucket: '80%-90%', col1: '0% | 0', col2: '0% | 0', col3: '0% | 0', col4: '0% | 0' },
    { bucket: '90%-100%', col1: '0% | 0', col2: '0% | 0', col3: '0% | 0', col4: '0.1% | 5' },
  ];

  // 4. Summaries
  const brandSummary = [
    { brand: 'Frozen Bottle', todayRev: '1,361,945.20', lwRev: '1,527,938.74', growth: '-10.86%', todayDis: '-38.86%', lwDis: '-33.95%', disChange: '-4.91%' },
    { brand: 'Madno', todayRev: '217,070.66', lwRev: '248,423.59', growth: '-12.62%', todayDis: '-36.72%', lwDis: '-35.07%', disChange: '-1.65%' },
    { brand: 'Lubov', todayRev: '41,896.73', lwRev: '23,669.96', growth: '+77.00%', todayDis: '-9.20%', lwDis: '-22.00%', disChange: '+12.81%' },
    { brand: 'Boba Bar', todayRev: '33,378.39', lwRev: '30,577.34', growth: '+9.16%', todayDis: '-37.66%', lwDis: '-37.46%', disChange: '-0.20%' },
  ];

  const sourceSummary = [
    { source: 'In Store', todayRev: '413,067.33', lwRev: '327,500.62', growth: '+26.13%', todayDis: '-35.11%', lwDis: '-4.75%', disChange: '-30.36%' },
    { source: 'Swiggy', todayRev: '712,060.43', lwRev: '796,805.36', growth: '-10.64%', todayDis: '-38.59%', lwDis: '-37.58%', disChange: '-1.01%' },
    { source: 'Zomato', todayRev: '502,321.15', lwRev: '578,142.08', growth: '-13.11%', todayDis: '-39.12%', lwDis: '-38.22%', disChange: '-0.90%' },
    { source: 'Ownly', todayRev: '25,019.70', lwRev: '27,602.03', growth: '-9.36%', todayDis: '-3.25%', lwDis: '0.00%', disChange: '-3.25%' },
    { source: 'Magicpin', todayRev: '1,459.12', lwRev: '408.81', growth: '+256.92%', todayDis: '-47.54%', lwDis: '-51.31%', disChange: '+3.77%' },
    { source: 'Website', todayRev: '1,522.85', lwRev: '1,580.55', growth: '-3.65%', todayDis: '0.00%', lwDis: '0.00%', disChange: '0.00%' },
  ];

  const brandSession = [
    { brand: 'Frozen Bottle', breakfast: '41,482.11', lunch: '288,241.40', snacks: '309,567.37', dinner: '586,844.81', postDinner: '135,809.51', bfGw: '-23.58%', luGw: '-2.25%', snGw: '-0.84%', diGw: '-11.74%', pdGw: '-32.67%' },
    { brand: 'Madno', breakfast: '4,959.58', lunch: '52,489.17', snacks: '35,767.00', dinner: '96,249.13', postDinner: '27,605.78', bfGw: '-13.02%', luGw: '+9.45%', snGw: '-12.79%', diGw: '-7.38%', pdGw: '-44.61%' },
    { brand: 'Lubov', breakfast: '882.10', lunch: '5,254.00', snacks: '3,193.40', dinner: '32,567.23', postDinner: '0.00', bfGw: '-90.25%', luGw: '+167.34%', snGw: '-3.13%', diGw: '+247.97%', pdGw: '0.00%' },
    { brand: 'Boba Bar', breakfast: '2,033.50', lunch: '7,116.16', snacks: '6,955.77', dinner: '11,218.20', postDinner: '6,054.76', bfGw: '+307.81%', luGw: '-7.18%', snGw: '-10.80%', diGw: '+4.76%', pdGw: '+55.04%' },
  ];

  const regionSession = [
    { region: 'KA', breakfast: '20,014.75', lunch: '136,938.48', snacks: '150,951.73', dinner: '296,917.28', postDinner: '65,913.75', bfGw: '-34.65%', luGw: '+12.19%', snGw: '-3.40%', diGw: '-1.63%', pdGw: '-39.43%' },
    { region: 'MH', breakfast: '8,300.51', lunch: '103,532.77', snacks: '87,563.83', dinner: '221,466.12', postDinner: '56,051.96', bfGw: '-37.62%', luGw: '+8.10%', snGw: '-3.75%', diGw: '-11.34%', pdGw: '-24.53%' },
    { region: 'TN', breakfast: '18,411.03', lunch: '97,606.94', snacks: '102,938.45', dinner: '183,190.19', postDinner: '42,525.13', bfGw: '-7.24%', luGw: '-11.35%', snGw: '+2.17%', diGw: '-12.47%', pdGw: '-33.62%' },
    { region: 'Kerela', breakfast: '2,631.00', lunch: '15,022.54', snacks: '14,029.53', dinner: '25,305.78', postDinner: '4,979.21', bfGw: '-54.24%', luGw: '-38.76%', snGw: '-13.99%', diGw: '-9.48%', pdGw: '-39.98%' },
  ];

  // 5. All Stores List (Full Store Ranking)
  const allStoresList = [
    { rank: 1, store: 'Indiranagar - CK', region: 'KA', type: 'COCO', rev: '68,450.00', orders: 275, aov: '248.91' },
    { rank: 2, store: 'Koramangala 5th Block', region: 'KA', type: 'COCO', rev: '61,220.00', orders: 242, aov: '252.98' },
    { rank: 3, store: 'BTM Layout', region: 'KA', type: 'COCO', rev: '58,100.00', orders: 238, aov: '244.12' },
    { rank: 4, store: 'Whitefield', region: 'KA', type: 'COCO', rev: '54,920.00', orders: 215, aov: '255.44' },
    { rank: 5, store: 'HSR Layout', region: 'KA', type: 'COCO', rev: '51,340.00', orders: 204, aov: '251.67' },
    { rank: 6, store: 'Bandra West', region: 'MH', type: 'COCO', rev: '49,800.00', orders: 188, aov: '264.89' },
    { rank: 7, store: 'Khar', region: 'MH', type: 'COCO', rev: '46,250.00', orders: 176, aov: '262.78' },
    { rank: 8, store: 'Anna Nagar', region: 'TN', type: 'COCO', rev: '44,120.00', orders: 182, aov: '242.42' },
    { rank: 9, store: 'Alwarpet', region: 'TN', type: 'COCO', rev: '42,890.00', orders: 169, aov: '253.79' },
    { rank: 10, store: 'Viman Nagar', region: 'MH', type: 'COCO', rev: '39,450.00', orders: 155, aov: '254.52' },
    { rank: 11, store: 'AECS Layout', region: 'KA', type: 'COCO', rev: '36,120.00', orders: 144, aov: '250.83' },
    { rank: 12, store: 'Jayanagar 4th Block', region: 'KA', type: 'COCO', rev: '34,800.00', orders: 139, aov: '250.36' },
    { rank: 13, store: 'Mulund', region: 'MH', type: 'COCO', rev: '32,450.00', orders: 131, aov: '247.71' },
    { rank: 14, store: 'Frazer Town', region: 'KA', type: 'COCO', rev: '29,810.00', orders: 122, aov: '244.34' },
    { rank: 15, store: 'Malleswaram', region: 'KA', type: 'COCO', rev: '28,120.00', orders: 115, aov: '244.52' },
    { rank: 16, store: 'Marol - CF CK', region: 'MH', type: 'COCO', rev: '25,400.00', orders: 104, aov: '244.23' },
    { rank: 17, store: 'Channasandra', region: 'KA', type: 'COCO', rev: '22,100.00', orders: 92, aov: '240.22' },
    { rank: 18, store: 'Bel Road', region: 'KA', type: 'COCO', rev: '19,840.00', orders: 81, aov: '244.94' },
    { rank: 19, store: 'Electronic City', region: 'KA', type: 'COCO', rev: '17,210.00', orders: 72, aov: '239.03' },
    { rank: 20, store: 'Manipal', region: 'KA', type: 'COCO', rev: '9,840.00', orders: 42, aov: '234.29' },
    { rank: 21, store: 'Avadi', region: 'TN', type: 'COCO', rev: '9,120.00', orders: 39, aov: '233.85' },
    { rank: 22, store: 'Karaikal', region: 'TN', type: 'COCO', rev: '8,410.00', orders: 36, aov: '233.61' },
    { rank: 23, store: 'Nagavara', region: 'KA', type: 'COCO', rev: '7,890.00', orders: 34, aov: '232.06' },
    { rank: 24, store: 'Baner Road - Pune', region: 'MH', type: 'COCO', rev: '7,120.00', orders: 31, aov: '229.68' },
    { rank: 25, store: 'Puducherry', region: 'TN', type: 'COCO', rev: '6,450.00', orders: 28, aov: '230.36' },
    { rank: 26, store: 'Sambalpur', region: 'ROI', type: 'FOFO', rev: '5,800.00', orders: 26, aov: '223.08' },
    { rank: 27, store: 'Aurangabad - 1', region: 'MH', type: 'COCO', rev: '5,210.00', orders: 24, aov: '217.08' },
    { rank: 28, store: 'Thiruvalla', region: 'Kerela', type: 'COCO', rev: '4,890.00', orders: 21, aov: '232.86' },
    { rank: 29, store: 'Kakkanad', region: 'Kerela', type: 'COCO', rev: '4,120.00', orders: 18, aov: '228.89' },
  ];

  return NextResponse.json({
    success: true,
    viewType,
    dataTill: '09 Oct 2026 12:30 PM (Live Pacing)',
    executiveInsight: '-9.6% vs LW, +22.3% vs L2W, +8.1% vs MoM, +41.7% vs LY -> Active 9th Oct Pacing',
    kpis: {
      netRev: '16,54,290.98',
      orders: '6,694',
      disPct: '-38.03%',
      aov: '247.13',
      offlinePct: '25.0%',
      onlinePct: '75.0%',
    },
    slicers: {
      brands: ['Frozen Bottle', 'Madno', 'Boba Bar', 'Lubov'],
      regions: ['KA', 'MH', 'TN', 'Kerela'],
      sources: ['In Store', 'Swiggy', 'Zomato', 'Magicpin', 'Ownly', 'Website'],
      sessions: ['Breakfast', 'Lunch', 'Snacks', 'Dinner', 'Post Dinner'],
    },
    overallKPI: viewType === 'weekly' ? weeklyKPI : viewType === 'monthly' ? monthlyKPI : dailyKPI,
    aovBuckets,
    discountBuckets,
    brandSummary,
    sourceSummary,
    brandSession,
    regionSession,
    topStores: allStoresList.slice(0, 10),
    bottomStores: allStoresList.slice(-10).reverse(),
    allStores: allStoresList,
  });
}
