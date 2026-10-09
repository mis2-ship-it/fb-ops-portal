import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const brand = searchParams.get('brand') || 'ALL';
  const region = searchParams.get('region') || 'KA';
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

  const storesMaster = [
    { code: 'FZBBLR023', name: 'Tata Sherwood', region: 'KA', brand: 'Frozen Bottle', ftdOrders: 24.0, ftdKpt: 5.89, ftdKptP80: 8.0, ftdKptMed: 4.8, ftdO2d: 28.11, ftdO2dP80: 36.16, ftdO2dMed: 25.6, mtdOrders: 137.0, mtdKpt: 6.48, mtdKptP80: 8.4, mtdKptMed: 5.6, mtdO2d: 25.65, mtdO2dP80: 32.3, mtdO2dMed: 23.0 },
    { code: 'FZBUDP001', name: 'Manipal', region: 'KA', brand: 'Frozen Bottle', ftdOrders: 21.0, ftdKpt: 5.4, ftdKptP80: 7.6, ftdKptMed: 4.4, ftdO2d: 19.85, ftdO2dP80: 24.2, ftdO2dMed: 17.4, mtdOrders: 103.0, mtdKpt: 7.62, mtdKptP80: 9.86, mtdKptMed: 6.0, mtdO2d: 20.92, mtdO2dP80: 25.08, mtdO2dMed: 19.1 },
    { code: 'FZBBLR029', name: 'Tumkur', region: 'KA', brand: 'Frozen Bottle', ftdOrders: 15.0, ftdKpt: 10.71, ftdKptP80: 20.12, ftdKptMed: 7.4, ftdO2d: 31.17, ftdO2dP80: 44.7, ftdO2dMed: 27.0, mtdOrders: 113.0, mtdKpt: 10.92, mtdKptP80: 17.42, mtdKptMed: 8.3, mtdO2d: 29.41, mtdO2dP80: 39.66, mtdO2dMed: 26.9 },
    { code: 'FZBBLR017', name: 'Kempfort', region: 'KA', brand: 'Frozen Bottle', ftdOrders: 27.0, ftdKpt: 15.46, ftdKptP80: 20.96, ftdKptMed: 15.2, ftdO2d: 32.48, ftdO2dP80: 40.68, ftdO2dMed: 31.8, mtdOrders: 175.0, mtdKpt: 15.02, mtdKptP80: 20.28, mtdKptMed: 13.3, mtdO2d: 32.56, mtdO2dP80: 43.92, mtdO2dMed: 28.4 },
    { code: 'FZBBLR025', name: 'Whitefield', region: 'KA', brand: 'Frozen Bottle', ftdOrders: 25.0, ftdKpt: 5.97, ftdKptP80: 10.78, ftdKptMed: 4.0, ftdO2d: 31.86, ftdO2dP80: 38.04, ftdO2dMed: 29.6, mtdOrders: 158.0, mtdKpt: 6.24, mtdKptP80: 11.06, mtdKptMed: 4.45, mtdO2d: 29.4, mtdO2dP80: 37.8, mtdO2dMed: 28.55 },
    { code: 'FZBBLR037', name: 'Miraya Rose', region: 'KA', brand: 'Madno', ftdOrders: 17.0, ftdKpt: 5.28, ftdKptP80: 8.16, ftdKptMed: 3.8, ftdO2d: 31.56, ftdO2dP80: 36.52, ftdO2dMed: 33.3, mtdOrders: 101.0, mtdKpt: 9.48, mtdKptP80: 14.3, mtdKptMed: 7.5, mtdO2d: 33.33, mtdO2dP80: 42.9, mtdO2dMed: 31.3 },
    { code: 'FZBBLR032', name: 'ITPL', region: 'KA', brand: 'Boba Bar', ftdOrders: 19.0, ftdKpt: 6.87, ftdKptP80: 12.44, ftdKptMed: 6.9, ftdO2d: 33.63, ftdO2dP80: 40.84, ftdO2dMed: 29.7, mtdOrders: 97.0, mtdKpt: 8.17, mtdKptP80: 13.94, mtdKptMed: 7.2, mtdO2d: 34.51, mtdO2dP80: 44.86, mtdO2dMed: 32.6 },
    { code: 'FZBBLR012', name: 'Gunjur', region: 'KA', brand: 'Frozen Bottle', ftdOrders: 22.0, ftdKpt: 8.51, ftdKptP80: 11.46, ftdKptMed: 7.0, ftdO2d: 33.55, ftdO2dP80: 44.36, ftdO2dMed: 34.95, mtdOrders: 124.0, mtdKpt: 11.73, mtdKptP80: 18.2, mtdKptMed: 8.65, mtdO2d: 34.2, mtdO2dP80: 44.66, mtdO2dMed: 31.65 },
    { code: 'FZBBLR034', name: 'AECS Layout', region: 'KA', brand: 'Frozen Bottle', ftdOrders: 21.0, ftdKpt: 9.0, ftdKptP80: 13.6, ftdKptMed: 7.6, ftdO2d: 32.76, ftdO2dP80: 41.3, ftdO2dMed: 30.8, mtdOrders: 116.0, mtdKpt: 7.75, mtdKptP80: 10.8, ftdKptMed: 6.2, mtdO2d: 27.28, mtdO2dP80: 35.1, mtdO2dMed: 26.0 },
    { code: 'FZBBLR040', name: 'Shivamogga', region: 'KA', brand: 'Lubov', ftdOrders: 13.0, ftdKpt: 3.46, ftdKptP80: 5.48, ftdKptMed: 3.6, ftdO2d: 20.48, ftdO2dP80: 31.82, ftdO2dMed: 17.1, mtdOrders: 95.0, mtdKpt: 5.67, mtdKptP80: 9.1, mtdKptMed: 5.3, mtdO2d: 23.57, mtdO2dP80: 29.86, mtdO2dMed: 20.7 },
    { code: 'FZBBLR013', name: 'Hsr Layout', region: 'KA', brand: 'Frozen Bottle', ftdOrders: 32.0, ftdKpt: 8.81, ftdKptP80: 14.12, ftdKptMed: 6.8, ftdO2d: 27.63, ftdO2dP80: 36.3, ftdO2dMed: 24.15, mtdOrders: 168.0, mtdKpt: 8.17, mtdKptP80: 11.24, mtdKptMed: 6.45, mtdO2d: 26.98, mtdO2dP80: 34.02, mtdO2dMed: 24.4 },
    { code: 'CFIBLR019', name: 'Sarjapur Road', region: 'KA', brand: 'Madno', ftdOrders: 1.0, ftdKpt: 1.5, ftdKptP80: 1.5, ftdKptMed: 1.5, ftdO2d: 13.2, ftdO2dP80: 13.2, ftdO2dMed: 13.2, mtdOrders: 7.0, mtdKpt: 4.3, mtdKptP80: 5.88, mtdKptMed: 2.5, mtdO2d: 23.87, mtdO2dP80: 26.9, mtdO2dMed: 24.4 },
    { code: 'FZBBLR008', name: 'BTM Layout', region: 'KA', brand: 'Frozen Bottle', ftdOrders: 19.0, ftdKpt: 7.07, ftdKptP80: 12.12, ftdKptMed: 6.2, ftdO2d: 24.17, ftdO2dP80: 29.88, ftdO2dMed: 23.3, mtdOrders: 154.0, mtdKpt: 11.04, mtdKptP80: 16.38, mtdKptMed: 9.9, mtdO2d: 29.04, mtdO2dP80: 37.26, mtdO2dMed: 27.75 },
    { code: 'FZBBLR019', name: 'Koramangala', region: 'KA', brand: 'Frozen Bottle', ftdOrders: 26.0, ftdKpt: 12.14, ftdKptP80: 18.9, ftdKptMed: 9.9, ftdO2d: 41.13, ftdO2dP80: 54.9, ftdO2dMed: 38.3, mtdOrders: 146.0, mtdKpt: 11.33, mtdKptP80: 18.0, mtdKptMed: 9.0, mtdO2d: 33.46, mtdO2dP80: 43.2, mtdO2dMed: 32.35 },
    { code: 'FZBBLR002', name: 'Banashankari', region: 'KA', brand: 'Boba Bar', ftdOrders: 26.0, ftdKpt: 6.67, ftdKptP80: 9.2, ftdKptMed: 6.5, ftdO2d: 25.55, ftdO2dP80: 34.4, ftdO2dMed: 23.75, mtdOrders: 147.0, mtdKpt: 6.17, mtdKptP80: 9.7, mtdKptMed: 5.2, mtdO2d: 28.52, mtdO2dP80: 39.08, mtdO2dMed: 26.1 },
    { code: 'FZBMUM001', name: 'Bandra West', region: 'MH', brand: 'Frozen Bottle', ftdOrders: 22.0, ftdKpt: 7.1, ftdKptP80: 10.4, ftdKptMed: 6.1, ftdO2d: 28.4, ftdO2dP80: 35.1, ftdO2dMed: 26.2, mtdOrders: 142.0, mtdKpt: 7.8, mtdKptP80: 11.2, mtdKptMed: 6.4, mtdO2d: 29.1, mtdO2dP80: 36.8, mtdO2dMed: 27.0 },
    { code: 'FZBMUM002', name: 'Khar', region: 'MH', brand: 'Frozen Bottle', ftdOrders: 18.0, ftdKpt: 6.4, ftdKptP80: 9.1, ftdKptMed: 5.8, ftdO2d: 29.8, ftdO2dP80: 37.2, ftdO2dMed: 28.0, mtdOrders: 131.0, mtdKpt: 6.9, mtdKptP80: 10.5, mtdKptMed: 6.0, mtdO2d: 28.9, mtdO2dP80: 35.6, mtdO2dMed: 26.8 },
    { code: 'FZBMAA001', name: 'Anna Nagar', region: 'TN', brand: 'Frozen Bottle', ftdOrders: 20.0, ftdKpt: 8.2, ftdKptP80: 11.5, ftdKptMed: 7.1, ftdO2d: 31.4, ftdO2dP80: 39.0, ftdO2dMed: 29.5, mtdOrders: 139.0, mtdKpt: 8.7, mtdKptP80: 12.1, mtdKptMed: 7.5, mtdO2d: 30.8, mtdO2dP80: 38.2, mtdO2dMed: 29.1 },
    { code: 'FZBCOK001', name: 'Kakkanad', region: 'Kerela', brand: 'Frozen Bottle', ftdOrders: 14.0, ftdKpt: 9.1, ftdKptP80: 13.0, ftdKptMed: 8.0, ftdO2d: 27.5, ftdO2dP80: 34.0, ftdO2dMed: 25.0, mtdOrders: 98.0, mtdKpt: 9.5, mtdKptP80: 13.8, mtdKptMed: 8.4, mtdO2d: 28.2, mtdO2dP80: 35.1, mtdO2dMed: 26.0 },
  ];

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
