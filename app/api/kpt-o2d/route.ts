import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const brand = (searchParams.get('brand') || 'ALL').trim();
  const region = (searchParams.get('region') || 'KA').trim();
  const platform = (searchParams.get('platform') || 'Swiggy').toLowerCase();

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

  // Raw array rows: [code, name, region, brand, ftdOrders, ftdKpt, ftdKptP80, ftdKptMed, ftdO2d, ftdO2dP80, ftdO2dMed, mtdOrders, mtdKpt, mtdKptP80, mtdKptMed, mtdO2d, mtdO2dP80, mtdO2dMed]
  const rawData: (string | number)[][] = [
    ['FZBBLR023', 'Tata Sherwood', 'KA', 'Frozen Bottle', 24.0, 5.89, 8.0, 4.8, 28.11, 36.16, 25.6, 137.0, 6.48, 8.4, 5.6, 25.65, 32.3, 23.0],
    ['FZBUDP001', 'Manipal', 'KA', 'Frozen Bottle', 21.0, 5.4, 7.6, 4.4, 19.85, 24.2, 17.4, 103.0, 7.62, 9.86, 6.0, 20.92, 25.08, 19.1],
    ['FZBBLR029', 'Tumkur', 'KA', 'Frozen Bottle', 15.0, 10.71, 20.12, 7.4, 31.17, 44.7, 27.0, 113.0, 10.92, 17.42, 8.3, 29.41, 39.66, 26.9],
    ['FZBBLR017', 'Kempfort', 'KA', 'Frozen Bottle', 27.0, 15.46, 20.96, 15.2, 32.48, 40.68, 31.8, 175.0, 15.02, 20.28, 13.3, 32.56, 43.92, 28.4],
    ['FZBBLR025', 'Whitefield', 'KA', 'Frozen Bottle', 25.0, 5.97, 10.78, 4.0, 31.86, 38.04, 29.6, 158.0, 6.24, 11.06, 4.45, 29.4, 37.8, 28.55],
    ['FZBBLR037', 'Miraya Rose', 'KA', 'Madno', 17.0, 5.28, 8.16, 3.8, 31.56, 36.52, 33.3, 101.0, 9.48, 14.3, 7.5, 33.33, 42.9, 31.3],
    ['FZBBLR032', 'ITPL', 'KA', 'Boba Bar', 19.0, 6.87, 12.44, 6.9, 33.63, 40.84, 29.7, 97.0, 8.17, 13.94, 7.2, 34.51, 44.86, 32.6],
    ['FZBBLR012', 'Gunjur', 'KA', 'Frozen Bottle', 22.0, 8.51, 11.46, 7.0, 33.55, 44.36, 34.95, 124.0, 11.73, 18.2, 8.65, 34.2, 44.66, 31.65],
    ['FZBBLR034', 'AECS Layout', 'KA', 'Frozen Bottle', 21.0, 9.0, 13.6, 7.6, 32.76, 41.3, 30.8, 116.0, 7.75, 10.8, 6.2, 27.28, 35.1, 26.0],
    ['FZBBLR040', 'Shivamogga', 'KA', 'Lubov', 13.0, 3.46, 5.48, 3.6, 20.48, 31.82, 17.1, 95.0, 5.67, 9.1, 5.3, 23.57, 29.86, 20.7],
    ['FZBBLR013', 'Hsr Layout', 'KA', 'Frozen Bottle', 32.0, 8.81, 14.12, 6.8, 27.63, 36.3, 24.15, 168.0, 8.17, 11.24, 6.45, 26.98, 34.02, 24.4],
    ['CFIBLR019', 'Sarjapur Road', 'KA', 'Madno', 1.0, 1.5, 1.5, 1.5, 13.2, 13.2, 13.2, 7.0, 4.3, 5.88, 2.5, 23.87, 26.9, 24.4],
    ['FZBBLR008', 'BTM Layout', 'KA', 'Frozen Bottle', 19.0, 7.07, 12.12, 6.2, 24.17, 29.88, 23.3, 154.0, 11.04, 16.38, 9.9, 29.04, 37.26, 27.75],
    ['FZBBLR019', 'Koramangala', 'KA', 'Frozen Bottle', 26.0, 12.14, 18.9, 9.9, 41.13, 54.9, 38.3, 146.0, 11.33, 18.0, 9.0, 33.46, 43.2, 32.35],
    ['FZBBLR002', 'Banashankari', 'KA', 'Boba Bar', 26.0, 6.67, 9.2, 6.5, 25.55, 34.4, 23.75, 147.0, 6.17, 9.7, 5.2, 28.52, 39.08, 26.1],
    ['FZBMUM001', 'Bandra West', 'MH', 'Frozen Bottle', 22.0, 7.1, 10.4, 6.1, 28.4, 35.1, 26.2, 142.0, 7.8, 11.2, 6.4, 29.1, 36.8, 27.0],
    ['FZBMUM002', 'Khar', 'MH', 'Frozen Bottle', 18.0, 6.4, 9.1, 5.8, 29.8, 37.2, 28.0, 131.0, 6.9, 10.5, 6.0, 28.9, 35.6, 26.8],
    ['FZBMAA001', 'Anna Nagar', 'TN', 'Frozen Bottle', 20.0, 8.2, 11.5, 7.1, 31.4, 39.0, 29.5, 139.0, 8.7, 12.1, 7.5, 30.8, 38.2, 29.1],
    ['FZBCOK001', 'Kakkanad', 'Kerela', 'Frozen Bottle', 14.0, 9.1, 13.0, 8.0, 27.5, 34.0, 25.0, 98.0, 9.5, 13.8, 8.4, 28.2, 35.1, 26.0],
  ];

  const storesMaster = rawData.map((row) => ({
    code: String(row[0]),
    name: String(row[1]),
    region: String(row[2]),
    brand: String(row[3]),
    ftdOrders: Number(row[4]),
    ftdKpt: Number(row[5]),
    ftdKptP80: Number(row[6]),
    ftdKptMed: Number(row[7]),
    ftdO2d: Number(row[8]),
    ftdO2dP80: Number(row[9]),
    ftdO2dMed: Number(row[10]),
    mtdOrders: Number(row[11]),
    mtdKpt: Number(row[12]),
    mtdKptP80: Number(row[13]),
    mtdKptMed: Number(row[14]),
    mtdO2d: Number(row[15]),
    mtdO2dP80: Number(row[16]),
    mtdO2dMed: Number(row[17]),
  }));

  const filteredStores = storesMaster.filter((s) => {
    if (region !== 'ALL' && s.region !== region) return false;
    if (brand !== 'ALL' && s.brand !== brand) return false;
    return true;
  });

  return NextResponse.json({
    success: true,
    platform: platform === 'zomato' ? 'Zomato' : 'Swiggy',
    overall,
    stores: filteredStores,
  });
}
