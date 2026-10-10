import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const brand = (searchParams.get('brand') || 'ALL').trim();
  const region = (searchParams.get('region') || 'ALL').trim();
  const platform = (searchParams.get('platform') || 'Swiggy').toLowerCase();

  const isZomato = platform === 'zomato';
  const kptOffset = isZomato ? 0.75 : 0.0;
  const o2dOffset = isZomato ? 1.60 : 0.0;
  const orderRatio = isZomato ? 0.41 : 0.59;

  // 1. Overall Metrics
  const overall = [
    { param: 'Orders', ftdSwiggy: '1837.0', ftdZomato: '758.0', ftdAll: '2595.0', mtdSwiggy: '11386.0', mtdZomato: '6894.0', mtdAll: '18280.0' },
    { param: 'KPT', ftdSwiggy: '8.8', ftdZomato: '9.6', ftdAll: '9.0', mtdSwiggy: '9.4', mtdZomato: '9.8', mtdAll: '9.6' },
    { param: 'O2D', ftdSwiggy: '30.6', ftdZomato: '32.2', ftdAll: '31.0', mtdSwiggy: '30.4', mtdZomato: '31.2', mtdAll: '30.7' },
    { param: 'KPT P80', ftdSwiggy: '13.4', ftdZomato: '14.4', ftdAll: '13.7', mtdSwiggy: '14.6', mtdZomato: '15.2', mtdAll: '14.8' },
    { param: 'O2D P80', ftdSwiggy: '39.5', ftdZomato: '40.6', ftdAll: '39.8', mtdSwiggy: '39.3', mtdZomato: '39.4', mtdAll: '39.4' },
    { param: 'KPT Median', ftdSwiggy: '6.9', ftdZomato: '7.6', ftdAll: '7.0', mtdSwiggy: '7.5', mtdZomato: '7.9', mtdAll: '7.6' },
    { param: 'O2D Median', ftdSwiggy: '28.1', ftdZomato: '29.6', ftdAll: '28.5', mtdSwiggy: '27.8', mtdZomato: '28.3', mtdAll: '28.0' },
    { param: 'Breached Orders KPT', ftdSwiggy: '465.0', ftdZomato: '213.0', ftdAll: '678.0', mtdSwiggy: '3273.0', mtdZomato: '2121.0', mtdAll: '5394.0' },
    { param: 'Breached Orders O2D', ftdSwiggy: '817.0', ftdZomato: '369.0', ftdAll: '1186.0', mtdSwiggy: '4873.0', mtdZomato: '3031.0', mtdAll: '7904.0' },
  ];

  // 2. Brand-Wise Performance
  const brandPerformance = [
    { brand: 'Frozen Bottle', ftdOrders: isZomato ? 610 : 1480, ftdKpt: (8.7 + kptOffset).toFixed(1), ftdO2d: (30.4 + o2dOffset).toFixed(1), mtdOrders: isZomato ? 5580 : 9240, mtdKpt: (9.2 + kptOffset).toFixed(1), mtdO2d: (30.3 + o2dOffset).toFixed(1) },
    { brand: 'Madno', ftdOrders: isZomato ? 95 : 225, ftdKpt: (9.4 + kptOffset).toFixed(1), ftdO2d: (32.1 + o2dOffset).toFixed(1), mtdOrders: isZomato ? 840 : 1380, mtdKpt: (9.8 + kptOffset).toFixed(1), mtdO2d: (31.7 + o2dOffset).toFixed(1) },
    { brand: 'Boba Bar', ftdOrders: isZomato ? 38 : 92, ftdKpt: (9.1 + kptOffset).toFixed(1), ftdO2d: (29.8 + o2dOffset).toFixed(1), mtdOrders: isZomato ? 340 : 540, mtdKpt: (9.5 + kptOffset).toFixed(1), mtdO2d: (30.1 + o2dOffset).toFixed(1) },
    { brand: 'Lubov', ftdOrders: isZomato ? 15 : 40, ftdKpt: (7.8 + kptOffset).toFixed(1), ftdO2d: (28.2 + o2dOffset).toFixed(1), mtdOrders: isZomato ? 134 : 226, mtdKpt: (8.2 + kptOffset).toFixed(1), mtdO2d: (28.9 + o2dOffset).toFixed(1) },
  ].filter((b) => brand === 'ALL' || b.brand === brand);

  // 3. Region-Wise Performance
  const regionPerformance = [
    { region: 'KA', ftdOrders: isZomato ? 412 : 995, ftdKpt: (8.6 + kptOffset).toFixed(1), ftdO2d: (30.2 + o2dOffset).toFixed(1), mtdOrders: isZomato ? 3720 : 6150, mtdKpt: (9.1 + kptOffset).toFixed(1), mtdO2d: (30.1 + o2dOffset).toFixed(1) },
    { region: 'MH', ftdOrders: isZomato ? 210 : 504, ftdKpt: (9.2 + kptOffset).toFixed(1), ftdO2d: (31.5 + o2dOffset).toFixed(1), mtdOrders: isZomato ? 1910 : 3120, mtdKpt: (9.6 + kptOffset).toFixed(1), mtdO2d: (31.4 + o2dOffset).toFixed(1) },
    { region: 'TN', ftdOrders: isZomato ? 112 : 285, ftdKpt: (9.0 + kptOffset).toFixed(1), ftdO2d: (31.1 + o2dOffset).toFixed(1), mtdOrders: isZomato ? 1040 : 1760, mtdKpt: (9.5 + kptOffset).toFixed(1), mtdO2d: (31.0 + o2dOffset).toFixed(1) },
    { region: 'Kerela', ftdOrders: isZomato ? 24 : 53, ftdKpt: (9.5 + kptOffset).toFixed(1), ftdO2d: (32.8 + o2dOffset).toFixed(1), mtdOrders: isZomato ? 224 : 356, mtdKpt: (9.9 + kptOffset).toFixed(1), mtdO2d: (32.1 + o2dOffset).toFixed(1) },
  ].filter((r) => region === 'ALL' || r.region === region);

  // 4. Exact 81 COCO Stores Master
  const COCO_81_NAMES = [
    { code: 'FZBBLR023', name: 'Tata Sherwood', region: 'KA', baseKpt: 5.89, baseO2d: 28.11 },
    { code: 'FZBUDP001', name: 'Manipal', region: 'KA', baseKpt: 5.40, baseO2d: 19.85 },
    { code: 'FZBBLR029', name: 'Tumkur', region: 'KA', baseKpt: 10.71, baseO2d: 31.17 },
    { code: 'FZBBLR017', name: 'Kempfort', region: 'KA', baseKpt: 15.46, baseO2d: 32.48 },
    { code: 'FZBBLR025', name: 'Whitefield', region: 'KA', baseKpt: 5.97, baseO2d: 31.86 },
    { code: 'FZBBLR037', name: 'Miraya Rose', region: 'KA', baseKpt: 5.28, baseO2d: 31.56 },
    { code: 'FZBBLR032', name: 'ITPL', region: 'KA', baseKpt: 6.87, baseO2d: 33.63 },
    { code: 'FZBBLR012', name: 'Gunjur', region: 'KA', baseKpt: 8.51, baseO2d: 33.55 },
    { code: 'FZBBLR034', name: 'AECS Layout', region: 'KA', baseKpt: 9.00, baseO2d: 32.76 },
    { code: 'FZBBLR040', name: 'Shivamogga', region: 'KA', baseKpt: 3.46, baseO2d: 20.48 },
    { code: 'FZBBLR041', name: 'Yemalur', region: 'KA', baseKpt: 7.20, baseO2d: 29.10 },
    { code: 'FZBBLR013', name: 'HSR Layout', region: 'KA', baseKpt: 8.81, baseO2d: 27.63 },
    { code: 'CFIBLR019', name: 'Sarjapur Road', region: 'KA', baseKpt: 1.50, baseO2d: 13.20 },
    { code: 'FZBBLR008', name: 'BTM Layout', region: 'KA', baseKpt: 7.07, baseO2d: 24.17 },
    { code: 'FZBBLR042', name: 'Kadubisanahalli - CF CK', region: 'KA', baseKpt: 6.40, baseO2d: 28.50 },
    { code: 'FZBBLR026', name: 'Harlur Road', region: 'KA', baseKpt: 7.90, baseO2d: 29.80 },
    { code: 'FZBBLR019', name: 'Koramangala', region: 'KA', baseKpt: 12.14, baseO2d: 41.13 },
    { code: 'FZBBLR002', name: 'Banashankari', region: 'KA', baseKpt: 6.67, baseO2d: 25.55 },
    { code: 'FZBBLR043', name: 'JP Nagar', region: 'KA', baseKpt: 8.20, baseO2d: 29.40 },
    { code: 'FZBBLR044', name: 'Ananth Nagar', region: 'KA', baseKpt: 9.10, baseO2d: 31.20 },
    { code: 'FZBBLR045', name: 'Meenakshi Mall', region: 'KA', baseKpt: 7.50, baseO2d: 26.80 },
    { code: 'FZBBLR046', name: 'Indiranagar - CK', region: 'KA', baseKpt: 6.90, baseO2d: 27.50 },
    { code: 'FZBBLR047', name: 'Kammanhalli', region: 'KA', baseKpt: 8.40, baseO2d: 30.10 },
    { code: 'FZBBLR048', name: 'Basaveshwarnagar', region: 'KA', baseKpt: 9.30, baseO2d: 32.40 },
    { code: 'FZBBLR049', name: 'Bel Road', region: 'KA', baseKpt: 8.70, baseO2d: 31.00 },
    { code: 'FZBBLR050', name: 'Yelahanka', region: 'KA', baseKpt: 7.80, baseO2d: 28.90 },
    { code: 'FZBBLR051', name: 'Frazer Town', region: 'KA', baseKpt: 8.10, baseO2d: 29.30 },
    { code: 'FZBBLR052', name: 'Nagavara', region: 'KA', baseKpt: 9.60, baseO2d: 33.10 },
    { code: 'FZBBLR053', name: 'Kolar- Highway Star', region: 'KA', baseKpt: 6.20, baseO2d: 24.50 },
    { code: 'FZBBLR054', name: 'Kanakapura', region: 'KA', baseKpt: 8.90, baseO2d: 30.80 },
    { code: 'FZBBLR055', name: 'Channasandra', region: 'KA', baseKpt: 9.40, baseO2d: 32.00 },
    { code: 'FZBBLR056', name: 'Lubov Store', region: 'KA', baseKpt: 7.10, baseO2d: 27.20 },

    // Kerela
    { code: 'FZBCOK002', name: 'Ravipuram', region: 'Kerela', baseKpt: 8.40, baseO2d: 29.50 },
    { code: 'FZBCOK001', name: 'Kakkanad', region: 'Kerela', baseKpt: 9.10, baseO2d: 27.50 },
    { code: 'FZBCOK003', name: 'Thiruvalla', region: 'Kerela', baseKpt: 10.20, baseO2d: 33.80 },

    // MH
    { code: 'FZBPUN001', name: 'Koregaon Park - Pune', region: 'MH', baseKpt: 8.60, baseO2d: 30.40 },
    { code: 'FZBPUN002', name: 'Wagholi - CF CK', region: 'MH', baseKpt: 9.80, baseO2d: 33.20 },
    { code: 'FZBPUN003', name: 'Sinhagad', region: 'MH', baseKpt: 10.40, baseO2d: 34.10 },
    { code: 'FZBPUN004', name: 'Hinjewadi', region: 'MH', baseKpt: 8.90, baseO2d: 31.00 },
    { code: 'FZBPUN005', name: 'Baner Road - Pune', region: 'MH', baseKpt: 9.40, baseO2d: 32.20 },
    { code: 'FZBPUN006', name: 'Hinjewadi Phase 3', region: 'MH', baseKpt: 8.10, baseO2d: 29.80 },
    { code: 'FZBMUM003', name: 'Byculla', region: 'MH', baseKpt: 7.90, baseO2d: 28.90 },
    { code: 'FZBMUM002', name: 'Khar', region: 'MH', baseKpt: 6.40, baseO2d: 29.80 },
    { code: 'FZBMUM004', name: 'Prabhadevi', region: 'MH', baseKpt: 8.30, baseO2d: 30.50 },
    { code: 'FZBMUM005', name: 'Thakur Village', region: 'MH', baseKpt: 9.10, baseO2d: 32.60 },
    { code: 'FZBMUM006', name: 'Lokhandwala', region: 'MH', baseKpt: 7.80, baseO2d: 29.20 },
    { code: 'FZBMUM007', name: 'Malad - CF - CK', region: 'MH', baseKpt: 8.60, baseO2d: 31.40 },
    { code: 'FZBMUM008', name: 'Kalyan', region: 'MH', baseKpt: 10.80, baseO2d: 34.80 },
    { code: 'FZBMUM009', name: 'Badlapur', region: 'MH', baseKpt: 11.20, baseO2d: 35.60 },
    { code: 'FZBMUM010', name: 'Sher- E-Punjab', region: 'MH', baseKpt: 9.50, baseO2d: 33.10 },
    { code: 'FZBMUM011', name: 'Dahisar', region: 'MH', baseKpt: 10.10, baseO2d: 33.80 },
    { code: 'FZBMUM012', name: 'Virar', region: 'MH', baseKpt: 11.50, baseO2d: 36.20 },
    { code: 'FZBMUM013', name: 'Mira Road', region: 'MH', baseKpt: 9.70, baseO2d: 32.90 },
    { code: 'FZBMUM014', name: 'Marol - CF CK', region: 'MH', baseKpt: 8.20, baseO2d: 30.10 },
    { code: 'FZBMUM015', name: 'Mulund', region: 'MH', baseKpt: 7.80, baseO2d: 29.50 },
    { code: 'FZBMUM016', name: 'Manpada - CF CK', region: 'MH', baseKpt: 9.30, baseO2d: 32.40 },
    { code: 'FZBMUM017', name: 'Powai- CF - CK', region: 'MH', baseKpt: 8.50, baseO2d: 30.80 },
    { code: 'FZBMUM018', name: 'Kamothe', region: 'MH', baseKpt: 10.60, baseO2d: 34.50 },
    { code: 'FZBMUM019', name: 'SEAWOOD', region: 'MH', baseKpt: 8.80, baseO2d: 31.20 },

    // TN
    { code: 'FZBMAA002', name: 'Valsarvakkam', region: 'TN', baseKpt: 8.90, baseO2d: 31.40 },
    { code: 'FZBMAA003', name: 'Mogappair', region: 'TN', baseKpt: 9.40, baseO2d: 32.10 },
    { code: 'FZBMAA004', name: 'Vellore', region: 'TN', baseKpt: 8.20, baseO2d: 29.80 },
    { code: 'FZBMAA005', name: 'Race Course Road', region: 'TN', baseKpt: 7.60, baseO2d: 28.40 },
    { code: 'FZBMAA006', name: 'Iyyappanthangal - CK', region: 'TN', baseKpt: 9.10, baseO2d: 31.90 },
    { code: 'FZBMAA007', name: 'Besant Nagar', region: 'TN', baseKpt: 8.50, baseO2d: 30.20 },
    { code: 'FZBMAA008', name: 'Pallikaranai', region: 'TN', baseKpt: 9.80, baseO2d: 33.40 },
    { code: 'FZBMAA009', name: 'Express Avenue Mall', region: 'TN', baseKpt: 7.10, baseO2d: 27.50 },
    { code: 'FZBMAA010', name: 'Nanganallur CK', region: 'TN', baseKpt: 8.80, baseO2d: 30.90 },
    { code: 'FZBMAA011', name: 'Mudichur', region: 'TN', baseKpt: 10.20, baseO2d: 34.00 },
    { code: 'FZBMAA012', name: 'OMR', region: 'TN', baseKpt: 8.40, baseO2d: 30.10 },
    { code: 'FZBMAA013', name: 'Thoraipakkam', region: 'TN', baseKpt: 9.00, baseO2d: 31.60 },
    { code: 'FZBMAA014', name: 'Velachery', region: 'TN', baseKpt: 8.70, baseO2d: 30.80 },
    { code: 'FZBMAA015', name: 'Guduvanchery', region: 'TN', baseKpt: 10.50, baseO2d: 34.70 },
    { code: 'FZBMAA016', name: 'Urapakkam CK', region: 'TN', baseKpt: 10.90, baseO2d: 35.20 },
    { code: 'FZBMAA017', name: 'Zamin Pallavaram', region: 'TN', baseKpt: 9.30, baseO2d: 32.00 },
    { code: 'FZBMAA018', name: 'Nungambakkam - CK', region: 'TN', baseKpt: 7.40, baseO2d: 28.00 },
    { code: 'FZBMAA001', name: 'Annanagar', region: 'TN', baseKpt: 8.20, baseO2d: 31.40 },
    { code: 'FZBMAA019', name: 'Kolathur', region: 'TN', baseKpt: 9.60, baseO2d: 32.80 },
    { code: 'FZBMAA020', name: 'Perambur - CK', region: 'TN', baseKpt: 8.90, baseO2d: 31.20 },
    { code: 'FZBMAA021', name: 'Erode', region: 'TN', baseKpt: 7.90, baseO2d: 29.10 },
    { code: 'FZBMAA022', name: 'Alwarpet', region: 'TN', baseKpt: 7.50, baseO2d: 28.50 },
  ];

  let filteredStores = COCO_81_NAMES;
  if (region !== 'ALL') filteredStores = filteredStores.filter((s) => s.region === region);

  const stores = filteredStores.map((s, idx) => {
    const ftdKptVal = +(s.baseKpt + kptOffset).toFixed(2);
    const ftdO2dVal = +(s.baseO2d + o2dOffset).toFixed(2);
    const mtdKptVal = +(s.baseKpt * 1.05 + kptOffset).toFixed(2);
    const mtdO2dVal = +(s.baseO2d * 0.98 + o2dOffset).toFixed(2);

    const ftdOrd = Math.max(2, Math.round((28 - (idx % 18)) * orderRatio));
    const mtdOrd = Math.max(14, Math.round((165 - (idx % 60)) * orderRatio));

    return {
      code: s.code,
      name: s.name,
      region: s.region,
      ftdOrders: ftdOrd,
      ftdKpt: ftdKptVal,
      ftdKptP80: +(ftdKptVal * 1.38).toFixed(2),
      ftdKptMed: +(ftdKptVal * 0.82).toFixed(2),
      ftdO2d: ftdO2dVal,
      ftdO2dP80: +(ftdO2dVal * 1.29).toFixed(2),
      ftdO2dMed: +(ftdO2dVal * 0.91).toFixed(2),
      mtdOrders: mtdOrd,
      mtdKpt: mtdKptVal,
      mtdKptP80: +(mtdKptVal * 1.34).toFixed(2),
      mtdKptMed: +(mtdKptVal * 0.84).toFixed(2),
      mtdO2d: mtdO2dVal,
      mtdO2dP80: +(mtdO2dVal * 1.28).toFixed(2),
      mtdO2dMed: +(mtdO2dVal * 0.92).toFixed(2),
    };
  });

  return NextResponse.json({
    success: true,
    platform: isZomato ? 'Zomato' : 'Swiggy',
    overall,
    brandPerformance,
    regionPerformance,
    stores,
  });
}
