import { NextResponse } from 'next/server';

// Rista live sales mock / live aggregator pipeline
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const brand = searchParams.get('brand') || 'ALL';
  const region = searchParams.get('region') || 'ALL';
  const source = searchParams.get('source') || 'ALL';
  const session = searchParams.get('session') || 'ALL';

  // Overall KPI dataset matching rista_live.py output
  const overallKPI = [
    { param: 'Gross', today: '2,558,794.59', lw: '2,651,470.90', l2w: '2,028,182.47', lm: '2,439,969.84', ly: '1,762,530.22', lwGw: '-3.50%', l2wGw: '+26.16%', momGw: '+4.87%', lyGw: '+45.18%', eod: '0.00' },
    { param: 'Discount', today: '-973,213.69', lw: '-902,201.34', l2w: '-732,530.43', lm: '-964,942.02', ly: '-640,556.81', lwGw: '+7.87%', l2wGw: '+32.86%', momGw: '+0.86%', lyGw: '+51.93%', eod: '0.00' },
    { param: 'Net', today: '1,654,290.98', lw: '1,830,609.63', l2w: '1,352,452.00', lm: '1,529,724.89', ly: '1,167,303.41', lwGw: '-9.63%', l2wGw: '+22.32%', momGw: '+8.14%', lyGw: '+41.72%', eod: '1,654,290.98' },
    { param: 'Txn', today: '6,694.00', lw: '6,499.00', l2w: '5,754.00', lm: '5,904.00', ly: '4,113.00', lwGw: '+3.00%', l2wGw: '+16.34%', momGw: '+13.38%', lyGw: '+62.75%', eod: '0.00' },
    { param: 'AOV', today: '247.13', lw: '281.68', l2w: '235.05', lm: '259.10', ly: '283.81', lwGw: '-12.26%', l2wGw: '+5.14%', momGw: '-4.62%', lyGw: '-12.92%', eod: '0.00' },
    { param: 'Discount %', today: '-38.03%', lw: '-34.03%', l2w: '-36.12%', lm: '-39.55%', ly: '-36.34%', lwGw: '+11.78%', l2wGw: '+5.31%', momGw: '-3.83%', lyGw: '+4.65%', eod: '0.00' },
  ];

  // Brand Summary Table
  const brandSummary = [
    { brand: 'Frozen Bottle', todayRev: '1,361,945.20', lwRev: '1,527,938.74', growth: '-10.86%', todayDis: '-38.86%', lwDis: '-33.95%', disChange: '-4.91%' },
    { brand: 'Madno', todayRev: '217,070.66', lwRev: '248,423.59', growth: '-12.62%', todayDis: '-36.72%', lwDis: '-35.07%', disChange: '-1.65%' },
    { brand: 'Lubov', todayRev: '41,896.73', lwRev: '23,669.96', growth: '+77.00%', todayDis: '-9.20%', lwDis: '-22.00%', disChange: '+12.81%' },
    { brand: 'Boba Bar', todayRev: '33,378.39', lwRev: '30,577.34', growth: '+9.16%', todayDis: '-37.66%', lwDis: '-37.46%', disChange: '-0.20%' },
  ];

  // Source Summary Table
  const sourceSummary = [
    { source: 'In Store', todayRev: '413,067.33', lwRev: '327,500.62', growth: '+26.13%', todayDis: '-35.11%', lwDis: '-4.75%', disChange: '-30.36%' },
    { source: 'Swiggy', todayRev: '712,060.43', lwRev: '796,805.36', growth: '-10.64%', todayDis: '-38.59%', lwDis: '-37.58%', disChange: '-1.01%' },
    { source: 'Zomato', todayRev: '502,321.15', lwRev: '578,142.08', growth: '-13.11%', todayDis: '-39.12%', lwDis: '-38.22%', disChange: '-0.90%' },
    { source: 'Ownly', todayRev: '25,019.70', lwRev: '27,602.03', growth: '-9.36%', todayDis: '-3.25%', lwDis: '0.00%', disChange: '-3.25%' },
    { source: 'Magicpin', todayRev: '1,459.12', lwRev: '408.81', growth: '+256.92%', todayDis: '-47.54%', lwDis: '-51.31%', disChange: '+3.77%' },
    { source: 'Website', todayRev: '1,522.85', lwRev: '1,580.55', growth: '-3.65%', todayDis: '0.00%', lwDis: '0.00%', disChange: '0.00%' },
  ];

  // Brand Session Analysis
  const brandSession = [
    { brand: 'Frozen Bottle', breakfast: '41,482.11', lunch: '288,241.40', snacks: '309,567.37', dinner: '586,844.81', postDinner: '135,809.51', bfGw: '-23.58%', luGw: '-2.25%', snGw: '-0.84%', diGw: '-11.74%', pdGw: '-32.67%' },
    { brand: 'Madno', breakfast: '4,959.58', lunch: '52,489.17', snacks: '35,767.00', dinner: '96,249.13', postDinner: '27,605.78', bfGw: '-13.02%', luGw: '+9.45%', snGw: '-12.79%', diGw: '-7.38%', pdGw: '-44.61%' },
    { brand: 'Lubov', breakfast: '882.10', lunch: '5,254.00', snacks: '3,193.40', dinner: '32,567.23', postDinner: '0.00', bfGw: '-90.25%', luGw: '+167.34%', snGw: '-3.13%', diGw: '+247.97%', pdGw: '0.00%' },
    { brand: 'Boba Bar', breakfast: '2,033.50', lunch: '7,116.16', snacks: '6,955.77', dinner: '11,218.20', postDinner: '6,054.76', bfGw: '+307.81%', luGw: '-7.18%', snGw: '-10.80%', diGw: '+4.76%', pdGw: '+55.04%' },
  ];

  // Region Session Analysis
  const regionSession = [
    { region: 'KA', breakfast: '20,014.75', lunch: '136,938.48', snacks: '150,951.73', dinner: '296,917.28', postDinner: '65,913.75', bfGw: '-34.65%', luGw: '+12.19%', snGw: '-3.40%', diGw: '-1.63%', pdGw: '-39.43%' },
    { region: 'MH', breakfast: '8,300.51', lunch: '103,532.77', snacks: '87,563.83', dinner: '221,466.12', postDinner: '56,051.96', bfGw: '-37.62%', luGw: '+8.10%', snGw: '-3.75%', diGw: '-11.34%', pdGw: '-24.53%' },
    { region: 'TN', breakfast: '18,411.03', lunch: '97,606.94', snacks: '102,938.45', dinner: '183,190.19', postDinner: '42,525.13', bfGw: '-7.24%', luGw: '-11.35%', snGw: '+2.17%', diGw: '-12.47%', pdGw: '-33.62%' },
    { region: 'Kerela', breakfast: '2,631.00', lunch: '15,022.54', snacks: '14,029.53', dinner: '25,305.78', postDinner: '4,979.21', bfGw: '-54.24%', luGw: '-38.76%', snGw: '-13.99%', diGw: '-9.48%', pdGw: '-39.98%' },
  ];

  // Hourly Sales pacing 09:00 AM to 05:00 AM (21 time slices)
  const hourlySales = [
    { time: '09:00 AM', rev: 14200, txn: 58 },
    { time: '10:00 AM', rev: 28400, txn: 114 },
    { time: '11:00 AM', rev: 45600, txn: 184 },
    { time: '12:00 PM', rev: 89400, txn: 362 },
    { time: '01:00 PM', rev: 142500, txn: 576 },
    { time: '02:00 PM', rev: 121000, txn: 490 },
    { time: '03:00 PM', rev: 88500, txn: 358 },
    { time: '04:00 PM', rev: 105200, txn: 426 },
    { time: '05:00 PM', rev: 135800, txn: 549 },
    { time: '06:00 PM', rev: 172400, txn: 698 },
    { time: '07:00 PM', rev: 198500, txn: 803 },
    { time: '08:00 PM', rev: 224600, txn: 909 },
    { time: '09:00 PM', rev: 215000, txn: 870 },
    { time: '10:00 PM', rev: 184200, txn: 745 },
    { time: '11:00 PM', rev: 132400, txn: 536 },
    { time: '12:00 AM', rev: 86500, txn: 350 },
    { time: '01:00 AM', rev: 42300, txn: 171 },
    { time: '02:00 AM', rev: 21200, txn: 86 },
    { time: '03:00 AM', rev: 11800, txn: 48 },
    { time: '04:00 AM', rev: 6400, txn: 26 },
    { time: '05:00 AM', rev: 3200, txn: 13 },
  ];

  // Top 10 Stores
  const topStores = [
    { rank: 1, store: 'Indiranagar - CK', region: 'KA', rev: '68,450.00', orders: 275, aov: '248.91' },
    { rank: 2, store: 'Koramangala 5th Block', region: 'KA', rev: '61,220.00', orders: 242, aov: '252.98' },
    { rank: 3, store: 'BTM Layout', region: 'KA', rev: '58,100.00', orders: 238, aov: '244.12' },
    { rank: 4, store: 'Whitefield', region: 'KA', rev: '54,920.00', orders: 215, aov: '255.44' },
    { rank: 5, store: 'HSR Layout', region: 'KA', rev: '51,340.00', orders: 204, aov: '251.67' },
    { rank: 6, store: 'Bandra West', region: 'MH', rev: '49,800.00', orders: 188, aov: '264.89' },
    { rank: 7, store: 'Khar', region: 'MH', rev: '46,250.00', orders: 176, aov: '262.78' },
    { rank: 8, store: 'Anna Nagar', region: 'TN', rev: '44,120.00', orders: 182, aov: '242.42' },
    { rank: 9, store: 'Alwarpet', region: 'TN', rev: '42,890.00', orders: 169, aov: '253.79' },
    { rank: 10, store: 'Viman Nagar', region: 'MH', rev: '39,450.00', orders: 155, aov: '254.52' },
  ];

  // Bottom 10 Stores
  const bottomStores = [
    { rank: 1, store: 'Kakkanad', region: 'Kerela', rev: '4,120.00', orders: 18, aov: '228.89' },
    { rank: 2, store: 'Thiruvalla', region: 'Kerela', rev: '4,890.00', orders: 21, aov: '232.86' },
    { rank: 3, store: 'Aurangabad - 1', region: 'MH', rev: '5,210.00', orders: 24, aov: '217.08' },
    { rank: 4, store: 'Sambalpur', region: 'ROI', rev: '5,800.00', orders: 26, aov: '223.08' },
    { rank: 5, store: 'Puducherry', region: 'TN', rev: '6,450.00', orders: 28, aov: '230.36' },
    { rank: 6, store: 'Baner Road - Pune', region: 'MH', rev: '7,120.00', orders: 31, aov: '229.68' },
    { rank: 7, store: 'Nagavara', region: 'KA', rev: '7,890.00', orders: 34, aov: '232.06' },
    { rank: 8, store: 'Karaikal', region: 'TN', rev: '8,410.00', orders: 36, aov: '233.61' },
    { rank: 9, store: 'Avadi', region: 'TN', rev: '9,120.00', orders: 39, aov: '233.85' },
    { rank: 10, store: 'Manipal', region: 'KA', rev: '9,840.00', orders: 42, aov: '234.29' },
  ];

  return NextResponse.json({
    success: true,
    dataTill: '09 Oct 2026 05:00 AM',
    executiveInsight: '-9.6% vs LW, +22.3% vs L2W, +8.1% vs MoM, +41.7% vs LY -> decline',
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
    overallKPI,
    hourlySales,
    brandSummary,
    sourceSummary,
    brandSession,
    regionSession,
    topStores,
    bottomStores,
  });
}
