'use client';

import React, { useState, useEffect, useCallback } from 'react';

type MainTab = 'operations' | 'sales' | 'kpt';
type SalesSubView = 'daily' | 'weekly' | 'monthly';

export default function Home() {
  const [activeTab, setActiveTab] = useState<MainTab>('sales');
  const [salesSubView, setSalesSubView] = useState<SalesSubView>('daily');
  const [salesBrand, setSalesBrand] = useState('ALL');
  const [salesRegion, setSalesRegion] = useState('ALL');
  const [salesSource, setSalesSource] = useState('ALL');
  const [salesSession, setSalesSession] = useState('ALL');

  const [salesData, setSalesData] = useState<any>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchSalesData = useCallback(() => {
    setIsRefreshing(true);
    const params = new URLSearchParams({
      view: salesSubView,
      brand: salesBrand,
      region: salesRegion,
      source: salesSource,
      session: salesSession,
    });

    fetch(`/api/sales?${params.toString()}`, { cache: 'no-store' })
      .then((res) => res.json())
      .then((json) => {
        if (json && json.success) {
          setSalesData(json);
        }
        setIsRefreshing(false);
      })
      .catch((err) => {
        console.error('Fetch error:', err);
        setIsRefreshing(false);
      });
  }, [salesSubView, salesBrand, salesRegion, salesSource, salesSession]);

  useEffect(() => {
    if (activeTab === 'sales') {
      fetchSalesData();
    }
  }, [fetchSalesData, activeTab]);

  const kpis = salesData?.kpis || {
    netRev: '16,54,290.98',
    orders: '6,694',
    disPct: '-38.03%',
    aov: '247.13',
    offlinePct: '25.0%',
    onlinePct: '75.0%',
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#090d16', color: '#f1f5f9', padding: '24px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1e293b', paddingBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, margin: 0, color: '#ffffff' }}>Frozen Bottle Operations Hub</h1>
          <p style={{ fontSize: '13px', color: '#94a3b8', margin: '4px 0 0 0' }}>Store Performance, Customer Feedback & Operational Intelligence</p>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '8px', backgroundColor: '#0f172a', padding: '6px', borderRadius: '12px', border: '1px solid #1e293b' }}>
          <button
            onClick={() => setActiveTab('operations')}
            style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 600, backgroundColor: activeTab === 'operations' ? '#1e293b' : 'transparent', color: activeTab === 'operations' ? '#fff' : '#94a3b8' }}
          >
            📊 Operations & Ratings
          </button>
          <button
            onClick={() => setActiveTab('sales')}
            style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 600, backgroundColor: activeTab === 'sales' ? '#059669' : 'transparent', color: '#fff' }}
          >
            📈 Sales Hub
          </button>
          <button
            onClick={() => setActiveTab('kpt')}
            style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 600, backgroundColor: activeTab === 'kpt' ? '#1e293b' : 'transparent', color: activeTab === 'kpt' ? '#fff' : '#94a3b8' }}
          >
            ⏱️ KPT & O2D
          </button>
        </div>
      </div>

      {activeTab === 'sales' && (
        <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Sub Navigation Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#0f172a', padding: '14px 20px', borderRadius: '12px', border: '1px solid #1e293b', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px' }}>
              <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10b981' }}></span>
              <span style={{ fontWeight: 600, color: '#e2e8f0' }}>GSheet Sales Master Sync</span>
              <span style={{ color: '#475569' }}>|</span>
              <span style={{ color: '#94a3b8' }}>Data Till: <strong style={{ color: '#f1f5f9' }}>{salesData?.dataTill || 'October 2026 Active'}</strong></span>
              <button
                onClick={fetchSalesData}
                disabled={isRefreshing}
                style={{ marginLeft: '8px', padding: '4px 12px', backgroundColor: '#1e293b', color: '#e2e8f0', border: '1px solid #334155', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}
              >
                🔄 {isRefreshing ? 'Syncing...' : 'Refresh'}
              </button>
            </div>

            {/* Sub View Toggle */}
            <div style={{ display: 'flex', gap: '6px', backgroundColor: '#090d16', padding: '4px', borderRadius: '8px', border: '1px solid #1e293b' }}>
              {(['daily', 'weekly', 'monthly'] as SalesSubView[]).map((v) => (
                <button
                  key={v}
                  onClick={() => setSalesSubView(v)}
                  style={{ padding: '6px 14px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 600, textTransform: 'capitalize', backgroundColor: salesSubView === v ? '#059669' : 'transparent', color: salesSubView === v ? '#ffffff' : '#94a3b8' }}
                >
                  {v === 'daily' ? '📅 Daily' : v === 'weekly' ? '🗓️ Weekly' : '📆 Monthly'}
                </button>
              ))}
            </div>
          </div>

          {/* Filters Bar */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', backgroundColor: '#0f172a', padding: '16px', borderRadius: '12px', border: '1px solid #1e293b' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '6px' }}>Brand</label>
              <select value={salesBrand} onChange={(e) => setSalesBrand(e.target.value)} style={{ width: '100%', backgroundColor: '#090d16', border: '1px solid #1e293b', color: '#f8fafc', padding: '8px 12px', borderRadius: '8px', fontSize: '13px' }}>
                <option value="ALL">All Brands</option>
                <option value="Frozen Bottle">Frozen Bottle</option>
                <option value="Madno">Madno</option>
                <option value="Lubov">Lubov</option>
                <option value="Boba Bar">Boba Bar</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '6px' }}>Region</label>
              <select value={salesRegion} onChange={(e) => setSalesRegion(e.target.value)} style={{ width: '100%', backgroundColor: '#090d16', border: '1px solid #1e293b', color: '#f8fafc', padding: '8px 12px', borderRadius: '8px', fontSize: '13px' }}>
                <option value="ALL">All Regions</option>
                <option value="KA">KA (Karnataka)</option>
                <option value="MH">MH (Maharashtra)</option>
                <option value="TN">TN (Tamil Nadu)</option>
                <option value="Kerela">Kerala</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '6px' }}>Source</label>
              <select value={salesSource} onChange={(e) => setSalesSource(e.target.value)} style={{ width: '100%', backgroundColor: '#090d16', border: '1px solid #1e293b', color: '#f8fafc', padding: '8px 12px', borderRadius: '8px', fontSize: '13px' }}>
                <option value="ALL">All Sources</option>
                <option value="In Store">In Store</option>
                <option value="Swiggy">Swiggy</option>
                <option value="Zomato">Zomato</option>
                <option value="Ownly">Ownly</option>
                <option value="Magicpin">Magicpin</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '6px' }}>Session</label>
              <select value={salesSession} onChange={(e) => setSalesSession(e.target.value)} style={{ width: '100%', backgroundColor: '#090d16', border: '1px solid #1e293b', color: '#f8fafc', padding: '8px 12px', borderRadius: '8px', fontSize: '13px' }}>
                <option value="ALL">All Sessions</option>
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Snacks">Snacks</option>
                <option value="Dinner">Dinner</option>
                <option value="Post Dinner">Post Dinner</option>
              </select>
            </div>
          </div>

          {/* Top KPI Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '14px' }}>
            <div style={{ backgroundColor: '#0f172a', padding: '16px', borderRadius: '12px', border: '1px solid #1e293b' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Net Revenue</span>
              <p style={{ fontSize: '20px', fontWeight: 700, color: '#38bdf8', margin: '6px 0 4px 0' }}>₹{kpis.netRev}</p>
              <span style={{ fontSize: '11px', color: '#10b981' }}>Filtered Active</span>
            </div>
            <div style={{ backgroundColor: '#0f172a', padding: '16px', borderRadius: '12px', border: '1px solid #1e293b' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Orders (Txn)</span>
              <p style={{ fontSize: '20px', fontWeight: 700, color: '#ffffff', margin: '6px 0 4px 0' }}>{kpis.orders}</p>
              <span style={{ fontSize: '11px', color: '#94a3b8' }}>Total Billed</span>
            </div>
            <div style={{ backgroundColor: '#0f172a', padding: '16px', borderRadius: '12px', border: '1px solid #1e293b' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Discount %</span>
              <p style={{ fontSize: '20px', fontWeight: 700, color: '#f43f5e', margin: '6px 0 4px 0' }}>{kpis.disPct}</p>
              <span style={{ fontSize: '11px', color: '#94a3b8' }}>Total Discount</span>
            </div>
            <div style={{ backgroundColor: '#0f172a', padding: '16px', borderRadius: '12px', border: '1px solid #1e293b' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>AOV</span>
              <p style={{ fontSize: '20px', fontWeight: 700, color: '#f59e0b', margin: '6px 0 4px 0' }}>₹{kpis.aov}</p>
              <span style={{ fontSize: '11px', color: '#94a3b8' }}>Avg Basket Size</span>
            </div>
            <div style={{ backgroundColor: '#0f172a', padding: '16px', borderRadius: '12px', border: '1px solid #1e293b' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Offline %</span>
              <p style={{ fontSize: '20px', fontWeight: 700, color: '#e2e8f0', margin: '6px 0 4px 0' }}>{kpis.offlinePct}</p>
              <span style={{ fontSize: '11px', color: '#94a3b8' }}>In Store</span>
            </div>
            <div style={{ backgroundColor: '#0f172a', padding: '16px', borderRadius: '12px', border: '1px solid #1e293b' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Online %</span>
              <p style={{ fontSize: '20px', fontWeight: 700, color: '#e2e8f0', margin: '6px 0 4px 0' }}>{kpis.onlinePct}</p>
              <span style={{ fontSize: '11px', color: '#94a3b8' }}>Aggregators</span>
            </div>
          </div>

          {/* Primary View Table: Daily / Weekly / Monthly Sales Summary */}
          <div style={{ backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid #1e293b', overflow: 'hidden' }}>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid #1e293b', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', color: '#e2e8f0' }}>
              📈 {salesSubView.toUpperCase()} SALES SUMMARY
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead style={{ backgroundColor: '#090d16', color: '#94a3b8', borderBottom: '1px solid #1e293b' }}>
                  <tr>
                    <th style={{ padding: '12px 16px', textAlign: 'left' }}>Parameters</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right' }}>Yesterday</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right' }}>MTD</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right' }}>LMTD</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right' }}>Trends</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right' }}>Last Month</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right' }}>Last Year</th>
                  </tr>
                </thead>
                <tbody style={{ fontFamily: 'monospace' }}>
                  {(salesData?.overallKPI || [
                    { param: 'Gross Sales', c1: '25,58,794.59', c2: '2,89,45,120.00', c3: '2,65,40,190.00', c4: '+7.53%', c5: '7,93,74,000.00', c6: '6,84,20,388.00' },
                    { param: 'Discount', c1: '-9,73,213.69', c2: '-1,04,50,190.00', c3: '-98,40,210.00', c4: '+9.89%', c5: '-2,80,00,500.00', c6: '-2,32,96,416.00' },
                    { param: 'Net Sales', c1: '16,54,290.98', c2: '1,84,94,930.00', c3: '1,67,00,000.00', c4: '+7.53%', c5: '5,13,73,500.00', c6: '4,46,43,571.00' },
                    { param: 'Orders (Txn)', c1: '6,694', c2: '74,830', c3: '68,240', c4: '+8.70%', c5: '2,05,200', c6: '1,77,293' },
                    { param: 'AOV', c1: '247.13', c2: '247.16', c3: '248.50', c4: '-1.08%', c5: '250.36', c6: '251.80' },
                    { param: 'Discount %', c1: '-38.03%', c2: '-36.10%', c3: '-36.08%', c4: '+2.90%', c5: '-35.28%', c6: '-34.05%' },
                  ]).map((row: any, idx: number) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #1e293b' }}>
                      <td style={{ padding: '12px 16px', fontFamily: 'sans-serif', fontWeight: 600, color: '#e2e8f0' }}>{row.param}</td>
                      <td style={{ padding: '12px 16px', textAlign: 'right', color: '#38bdf8', fontWeight: 700 }}>₹{row.c1}</td>
                      <td style={{ padding: '12px 16px', textAlign: 'right', color: '#f8fafc' }}>₹{row.c2}</td>
                      <td style={{ padding: '12px 16px', textAlign: 'right', color: '#cbd5e1' }}>₹{row.c3}</td>
                      <td style={{ padding: '12px 16px', textAlign: 'right', color: '#f59e0b', fontFamily: 'sans-serif', fontWeight: 700 }}>{row.c4}</td>
                      <td style={{ padding: '12px 16px', textAlign: 'right', color: '#94a3b8' }}>₹{row.c5 || '-'}</td>
                      <td style={{ padding: '12px 16px', textAlign: 'right', color: '#94a3b8' }}>₹{row.c6 || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Current Month Date-Wise Performance Table */}
          <div style={{ backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid #1e293b', overflow: 'hidden' }}>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid #1e293b', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', color: '#e2e8f0' }}>
              📅 CURRENT MONTH DATE-WISE PERFORMANCE (OCTOBER 2026)
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead style={{ backgroundColor: '#090d16', color: '#94a3b8', borderBottom: '1px solid #1e293b' }}>
                  <tr>
                    <th style={{ padding: '12px 16px', textAlign: 'left' }}>Date</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right' }}>Gross Sales</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right' }}>Net Sales</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right' }}>Orders</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right' }}>AOV</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right' }}>Discount %</th>
                  </tr>
                </thead>
                <tbody style={{ fontFamily: 'monospace' }}>
                  {(salesData?.currentMonthDaily || [
                    { date: '11-10-2026', gross: '28,40,120.00', net: '18,20,450.00', orders: 7360, aov: '247.34', disPct: '-38.0%' },
                    { date: '10-10-2026', gross: '27,50,340.00', net: '17,70,210.00', orders: 7160, aov: '247.23', disPct: '-38.1%' },
                    { date: '09-10-2026', gross: '28,10,450.00', net: '18,10,340.00', orders: 7310, aov: '247.65', disPct: '-38.0%' },
                    { date: '08-10-2026', gross: '26,40,230.00', net: '17,00,120.00', orders: 6870, aov: '247.47', disPct: '-38.3%' },
                    { date: '07-10-2026', gross: '25,80,120.00', net: '16,60,340.00', orders: 6710, aov: '247.44', disPct: '-38.1%' },
                    { date: '06-10-2026', gross: '24,80,340.00', net: '15,90,450.00', orders: 6430, aov: '247.34', disPct: '-37.5%' },
                    { date: '05-10-2026', gross: '23,90,120.00', net: '15,40,190.00', orders: 6220, aov: '247.53', disPct: '-37.6%' },
                    { date: '04-10-2026', gross: '26,90,340.00', net: '17,30,210.00', orders: 6980, aov: '247.88', disPct: '-37.9%' },
                    { date: '03-10-2026', gross: '27,80,120.00', net: '17,90,450.00', orders: 7210, aov: '248.32', disPct: '-38.0%' },
                    { date: '02-10-2026', gross: '28,90,450.00', net: '18,60,340.00', orders: 7480, aov: '248.70', disPct: '-38.2%' },
                    { date: '01-10-2026', gross: '24,50,120.00', net: '15,80,210.00', orders: 6390, aov: '247.29', disPct: '-37.8%' },
                  ]).map((row: any, idx: number) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #1e293b' }}>
                      <td style={{ padding: '12px 16px', fontFamily: 'sans-serif', fontWeight: 600, color: '#e2e8f0' }}>{row.date}</td>
                      <td style={{ padding: '12px 16px', textAlign: 'right', color: '#94a3b8' }}>₹{row.gross}</td>
                      <td style={{ padding: '12px 16px', textAlign: 'right', color: '#38bdf8', fontWeight: 700 }}>₹{row.net}</td>
                      <td style={{ padding: '12px 16px', textAlign: 'right', color: '#f8fafc' }}>{Number(row.orders).toLocaleString('en-IN')}</td>
                      <td style={{ padding: '12px 16px', textAlign: 'right', color: '#f59e0b' }}>₹{row.aov}</td>
                      <td style={{ padding: '12px 16px', textAlign: 'right', color: '#f43f5e' }}>{row.disPct}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 81 COCO Stores Master Table */}
          <div style={{ backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid #1e293b', overflow: 'hidden' }}>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid #1e293b', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', color: '#e2e8f0' }}>
              🏪 81 COCO STORE PERFORMANCE RANKING
            </div>
            <div style={{ overflowX: 'auto', maxHeight: '420px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead style={{ backgroundColor: '#090d16', color: '#94a3b8', borderBottom: '1px solid #1e293b', position: 'sticky', top: 0 }}>
                  <tr>
                    <th style={{ padding: '12px 16px', textAlign: 'left' }}>#</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left' }}>Store Name</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left' }}>Region</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left' }}>Type</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right' }}>Net Revenue</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right' }}>Orders</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right' }}>AOV</th>
                  </tr>
                </thead>
                <tbody style={{ fontFamily: 'monospace' }}>
                  {(salesData?.allStores || [
                    { rank: 1, store: 'Indiranagar - CK', region: 'KA', type: 'COCO', rev: '38,900.00', orders: 157, aov: '247.77' },
                    { rank: 2, store: 'Koramangala', region: 'KA', type: 'COCO', rev: '34,500.00', orders: 140, aov: '246.42' },
                    { rank: 3, store: 'Khar', region: 'MH', type: 'COCO', rev: '32,100.00', orders: 130, aov: '246.92' },
                    { rank: 4, store: 'Lokhandwala', region: 'MH', type: 'COCO', rev: '31,200.00', orders: 126, aov: '247.61' },
                    { rank: 5, store: 'Annanagar', region: 'TN', type: 'COCO', rev: '31,200.00', orders: 126, aov: '247.61' },
                    { rank: 6, store: 'HSR Layout', region: 'KA', type: 'COCO', rev: '31,200.00', orders: 126, aov: '247.61' },
                    { rank: 7, store: 'BTM Layout', region: 'KA', type: 'COCO', rev: '29,800.00', orders: 120, aov: '248.33' },
                    { rank: 8, store: 'Express Avenue Mall', region: 'TN', type: 'COCO', rev: '28,900.00', orders: 117, aov: '247.00' },
                    { rank: 9, store: 'Whitefield', region: 'KA', type: 'COCO', rev: '28,500.00', orders: 115, aov: '247.82' },
                    { rank: 10, store: 'Koregaon Park - Pune', region: 'MH', type: 'COCO', rev: '28,400.00', orders: 115, aov: '246.95' },
                  ]).map((st: any) => (
                    <tr key={st.rank} style={{ borderBottom: '1px solid #1e293b' }}>
                      <td style={{ padding: '10px 16px', color: '#64748b' }}>{st.rank}</td>
                      <td style={{ padding: '10px 16px', fontFamily: 'sans-serif', fontWeight: 600, color: '#f8fafc' }}>{st.store}</td>
                      <td style={{ padding: '10px 16px', fontFamily: 'sans-serif', color: '#94a3b8' }}>{st.region}</td>
                      <td style={{ padding: '10px 16px', fontFamily: 'sans-serif', color: '#10b981', fontWeight: 600 }}>{st.type || 'COCO'}</td>
                      <td style={{ padding: '10px 16px', textAlign: 'right', color: '#38bdf8', fontWeight: 700 }}>₹{st.rev}</td>
                      <td style={{ padding: '10px 16px', textAlign: 'right', color: '#f8fafc' }}>{Number(st.orders).toLocaleString('en-IN')}</td>
                      <td style={{ padding: '10px 16px', textAlign: 'right', color: '#f59e0b' }}>₹{st.aov}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
