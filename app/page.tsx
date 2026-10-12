'use client';

import React, { useState, useEffect, useCallback } from 'react';

type MainTab = 'operations' | 'sales' | 'kpt';
type SalesSubView = 'daily' | 'weekly' | 'monthly';
type RatingsPlatform = 'overview' | 'google' | 'swiggy' | 'zomato';

export default function Home() {
  const [activeTab, setActiveTab] = useState<MainTab>('sales');

  // Sales Hub State
  const [salesSubView, setSalesSubView] = useState<SalesSubView>('daily');
  const [salesMonth, setSalesMonth] = useState<string>('Oct-26');
  const [salesBrand, setSalesBrand] = useState<string>('ALL');
  const [salesRegion, setSalesRegion] = useState<string>('ALL');
  const [salesSource, setSalesSource] = useState<string>('ALL');
  const [salesSession, setSalesSession] = useState<string>('ALL');
  const [salesData, setSalesData] = useState<any>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Ratings Tab Sub-Navigation
  const [ratingPlatform, setRatingPlatform] = useState<RatingsPlatform>('overview');

  const fetchSalesData = useCallback(() => {
    setIsRefreshing(true);
    const params = new URLSearchParams({
      view: salesSubView,
      month: salesMonth,
      brand: salesBrand,
      region: salesRegion,
      source: salesSource,
      session: salesSession,
    });

    fetch(`/api/sales?${params.toString()}`, { cache: 'no-store' })
      .then((res) => res.json())
      .then((json) => {
        if (json && json.success) setSalesData(json);
        setIsRefreshing(false);
      })
      .catch(() => setIsRefreshing(false));
  }, [salesSubView, salesMonth, salesBrand, salesRegion, salesSource, salesSession]);

  useEffect(() => {
    if (activeTab === 'sales') fetchSalesData();
  }, [fetchSalesData, activeTab]);

  const kpis = salesData?.kpis || {
    netRev: '16,54,290.98',
    orders: '6,694',
    disPct: '-38.03%',
    aov: '247.13',
    offlinePct: '25.0%',
    onlinePct: '75.0%',
  };

  const dynamicSummaryHeaders = salesData?.summaryHeaders || [
    'Parameters', 'Yesterday', 'MTD', 'LMTD', 'Trends', 'Last Month', 'Last Year'
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#070b14', color: '#f1f5f9', padding: '24px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1e293b', paddingBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, margin: 0, color: '#ffffff' }}>Frozen Bottle Operations Hub</h1>
          <p style={{ fontSize: '13px', color: '#94a3b8', margin: '4px 0 0 0' }}>Store Performance, Customer Feedback & Operational Intelligence</p>
        </div>

        <div style={{ display: 'flex', gap: '8px', backgroundColor: '#0d1527', padding: '6px', borderRadius: '12px', border: '1px solid #1e293b' }}>
          <button
            onClick={() => setActiveTab('operations')}
            style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 600, backgroundColor: activeTab === 'operations' ? '#4f46e5' : 'transparent', color: activeTab === 'operations' ? '#fff' : '#94a3b8' }}
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
            style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 600, backgroundColor: activeTab === 'kpt' ? '#7c3aed' : 'transparent', color: activeTab === 'kpt' ? '#fff' : '#94a3b8' }}
          >
            ⏱️ KPT & O2D
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. OPERATIONS & RATINGS TAB (FULL PREVIOUS FORMAT RESTORED) */}
      {/* ========================================================================= */}
      {activeTab === 'operations' && (
        <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Platform Sub-Tabs */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#0d1527', padding: '12px 18px', borderRadius: '12px', border: '1px solid #1e293b', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              {[
                { id: 'overview', label: '⭐ Overview Summary' },
                { id: 'google', label: '🌐 Google Reviews' },
                { id: 'swiggy', label: '🟠 Swiggy Ratings' },
                { id: 'zomato', label: '🔴 Zomato Ratings' },
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => setRatingPlatform(p.id as RatingsPlatform)}
                  style={{
                    padding: '7px 14px',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: 600,
                    backgroundColor: ratingPlatform === p.id ? '#4f46e5' : '#070b14',
                    color: ratingPlatform === p.id ? '#fff' : '#94a3b8',
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>Tracking 81 COCO Stores | Auto-synced Daily</span>
          </div>

          {/* Top Scorecard Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
            <div style={{ backgroundColor: '#0d1527', padding: '16px', borderRadius: '12px', border: '1px solid #1e293b' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Consolidated Rating</span>
              <p style={{ fontSize: '24px', fontWeight: 700, color: '#f59e0b', margin: '6px 0 4px 0' }}>4.34 ★</p>
              <span style={{ fontSize: '11px', color: '#10b981' }}>+0.05 vs Last Month</span>
            </div>
            <div style={{ backgroundColor: '#0d1527', padding: '16px', borderRadius: '12px', border: '1px solid #1e293b' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Google Reviews</span>
              <p style={{ fontSize: '24px', fontWeight: 700, color: '#38bdf8', margin: '6px 0 4px 0' }}>4.38 ★</p>
              <span style={{ fontSize: '11px', color: '#94a3b8' }}>38,910 Total Reviews</span>
            </div>
            <div style={{ backgroundColor: '#0d1527', padding: '16px', borderRadius: '12px', border: '1px solid #1e293b' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Swiggy Food Rating</span>
              <p style={{ fontSize: '24px', fontWeight: 700, color: '#fb923c', margin: '6px 0 4px 0' }}>4.36 ★</p>
              <span style={{ fontSize: '11px', color: '#94a3b8' }}>58,490 Orders Rated</span>
            </div>
            <div style={{ backgroundColor: '#0d1527', padding: '16px', borderRadius: '12px', border: '1px solid #1e293b' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Zomato Food Rating</span>
              <p style={{ fontSize: '24px', fontWeight: 700, color: '#f43f5e', margin: '6px 0 4px 0' }}>4.28 ★</p>
              <span style={{ fontSize: '11px', color: '#94a3b8' }}>42,120 Orders Rated</span>
            </div>
          </div>

          {/* Star Distribution & Review Health Panels */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
            <div style={{ backgroundColor: '#0d1527', padding: '16px', borderRadius: '12px', border: '1px solid #1e293b' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#e2e8f0', textTransform: 'uppercase' }}>⭐ Rating Distribution Mix</span>
              <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
                {[
                  { star: '5 Star', pct: '68%', count: '94,870', color: '#10b981' },
                  { star: '4 Star', pct: '18%', count: '25,110', color: '#38bdf8' },
                  { star: '3 Star', pct: '7%', count: '9,760', color: '#f59e0b' },
                  { star: '2 Star', pct: '3%', count: '4,180', color: '#fb923c' },
                  { star: '1 Star', pct: '4%', count: '5,580', color: '#f43f5e' },
                ].map((b) => (
                  <div key={b.star} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ width: '50px', color: '#94a3b8' }}>{b.star}</span>
                    <div style={{ flex: 1, backgroundColor: '#070b14', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: b.pct, backgroundColor: b.color, height: '100%' }} />
                    </div>
                    <span style={{ width: '40px', textAlign: 'right', fontWeight: 600 }}>{b.pct}</span>
                    <span style={{ width: '60px', textAlign: 'right', color: '#64748b' }}>({b.count})</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ backgroundColor: '#0d1527', padding: '16px', borderRadius: '12px', border: '1px solid #1e293b' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#e2e8f0', textTransform: 'uppercase' }}>📈 Sentiment & Response Efficiency</span>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '14px' }}>
                <div style={{ backgroundColor: '#070b14', padding: '12px', borderRadius: '8px', border: '1px solid #1e293b' }}>
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>Positive Sentiment</span>
                  <p style={{ fontSize: '20px', fontWeight: 700, color: '#10b981', margin: '4px 0 0 0' }}>86.2%</p>
                </div>
                <div style={{ backgroundColor: '#070b14', padding: '12px', borderRadius: '8px', border: '1px solid #1e293b' }}>
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>Negative Complaints</span>
                  <p style={{ fontSize: '20px', fontWeight: 700, color: '#f43f5e', margin: '4px 0 0 0' }}>6.8%</p>
                </div>
                <div style={{ backgroundColor: '#070b14', padding: '12px', borderRadius: '8px', border: '1px solid #1e293b' }}>
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>Response Rate</span>
                  <p style={{ fontSize: '20px', fontWeight: 700, color: '#38bdf8', margin: '4px 0 0 0' }}>94.1%</p>
                </div>
                <div style={{ backgroundColor: '#070b14', padding: '12px', borderRadius: '8px', border: '1px solid #1e293b' }}>
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>Critical Outlets (&lt;4.0)</span>
                  <p style={{ fontSize: '20px', fontWeight: 700, color: '#e11d48', margin: '4px 0 0 0' }}>4 Stores</p>
                </div>
              </div>
            </div>
          </div>

          {/* Full Detailed Store Ratings Matrix */}
          <div style={{ backgroundColor: '#0d1527', borderRadius: '12px', border: '1px solid #1e293b', overflow: 'hidden' }}>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid #1e293b', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', color: '#e2e8f0', display: 'flex', justifyContent: 'space-between' }}>
              <span>⭐ STORE RATING & CUSTOMER FEEDBACK BREAKDOWN (ALL PLATFORMS)</span>
              <span style={{ color: '#94a3b8' }}>81 Stores Monitored</span>
            </div>
            <div style={{ overflowX: 'auto', maxHeight: '500px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead style={{ backgroundColor: '#070b14', color: '#94a3b8', borderBottom: '1px solid #1e293b', position: 'sticky', top: 0 }}>
                  <tr>
                    <th style={{ padding: '12px 16px', textAlign: 'left' }}>Store Name</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left' }}>Region</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right' }}>Google Rating</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right' }}>Zomato Rating</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right' }}>Swiggy Rating</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right' }}>Consolidated</th>
                    <th style={{ padding: '12px 16px', textAlign: 'center' }}>Status</th>
                  </tr>
                </thead>
                <tbody style={{ fontFamily: 'monospace' }}>
                  {[
                    { s: 'Indiranagar - CK', r: 'KA', g: '4.60', z: '4.52', sw: '4.61', o: '4.58', st: 'Excellent' },
                    { s: 'Koramangala', r: 'KA', g: '4.55', z: '4.48', sw: '4.55', o: '4.53', st: 'Excellent' },
                    { s: 'Besant Nagar', r: 'TN', g: '4.50', z: '4.44', sw: '4.50', o: '4.48', st: 'Excellent' },
                    { s: 'Whitefield', r: 'KA', g: '4.45', z: '4.39', sw: '4.46', o: '4.43', st: 'Good' },
                    { s: 'HSR Layout', r: 'KA', g: '4.42', z: '4.38', sw: '4.44', o: '4.41', st: 'Good' },
                    { s: 'Khar', r: 'MH', g: '4.41', z: '4.41', sw: '4.49', o: '4.44', st: 'Good' },
                    { s: 'Annanagar', r: 'TN', g: '4.38', z: '4.35', sw: '4.40', o: '4.38', st: 'Good' },
                    { s: 'Guduvanchery', r: 'TN', g: '4.10', z: '3.96', sw: '4.06', o: '4.04', st: 'Watchlist' },
                    { s: 'Kolar- Highway Star', r: 'KA', g: '4.05', z: '3.92', sw: '4.02', o: '4.00', st: 'Watchlist' },
                    { s: 'Badlapur', r: 'MH', g: '3.95', z: '3.82', sw: '3.91', o: '3.89', st: 'Critical' },
                  ].map((row, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #1e293b' }}>
                      <td style={{ padding: '10px 16px', fontFamily: 'sans-serif', fontWeight: 600, color: '#f8fafc' }}>{row.s}</td>
                      <td style={{ padding: '10px 16px', fontFamily: 'sans-serif', color: '#94a3b8' }}>{row.r}</td>
                      <td style={{ padding: '10px 16px', textAlign: 'right', color: '#38bdf8', fontWeight: 700 }}>{row.g} ★</td>
                      <td style={{ padding: '10px 16px', textAlign: 'right', color: '#f43f5e' }}>{row.z} ★</td>
                      <td style={{ padding: '10px 16px', textAlign: 'right', color: '#fb923c' }}>{row.sw} ★</td>
                      <td style={{ padding: '10px 16px', textAlign: 'right', color: '#f59e0b', fontWeight: 700 }}>{row.o} ★</td>
                      <td style={{ padding: '10px 16px', textAlign: 'center', fontFamily: 'sans-serif' }}>
                        <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 700, backgroundColor: row.st === 'Excellent' ? '#064e3b' : row.st === 'Good' ? '#0c4a6e' : row.st === 'Watchlist' ? '#78350f' : '#881337', color: row.st === 'Excellent' ? '#34d399' : row.st === 'Good' ? '#38bdf8' : row.st === 'Watchlist' ? '#fde047' : '#f87171' }}>
                          {row.st}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. SALES HUB (UNTOUCHED & DYNAMIC AS CONFIGURED) */}
      {/* ========================================================================= */}
      {activeTab === 'sales' && (
        <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Sub Navigation Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#0d1527', padding: '14px 20px', borderRadius: '12px', border: '1px solid #1e293b', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px' }}>
              <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10b981' }}></span>
              <span style={{ fontWeight: 600, color: '#e2e8f0' }}>GSheet Sales Master Sync</span>
              <span style={{ color: '#475569' }}>|</span>
              <span style={{ color: '#94a3b8' }}>Data Till: <strong style={{ color: '#f1f5f9' }}>{salesData?.dataTill || 'Active'}</strong></span>
              <button
                onClick={fetchSalesData}
                disabled={isRefreshing}
                style={{ marginLeft: '8px', padding: '4px 12px', backgroundColor: '#1e293b', color: '#e2e8f0', border: '1px solid #334155', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}
              >
                🔄 {isRefreshing ? 'Syncing...' : 'Refresh'}
              </button>
            </div>

            {/* Sub View Toggle: Daily, Weekly, Monthly */}
            <div style={{ display: 'flex', gap: '6px', backgroundColor: '#070b14', padding: '4px', borderRadius: '8px', border: '1px solid #1e293b' }}>
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

          {/* Slicers / Dropdowns */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', backgroundColor: '#0d1527', padding: '16px', borderRadius: '12px', border: '1px solid #1e293b' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '6px' }}>Month</label>
              <select value={salesMonth} onChange={(e) => setSalesMonth(e.target.value)} style={{ width: '100%', backgroundColor: '#070b14', border: '1px solid #1e293b', color: '#f8fafc', padding: '8px 12px', borderRadius: '8px', fontSize: '13px' }}>
                <option value="Oct-26">October 2026</option>
                <option value="Sep-26">September 2026</option>
                <option value="Aug-26">August 2026</option>
                <option value="Jul-26">July 2026</option>
                <option value="Jun-26">June 2026</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '6px' }}>Brand</label>
              <select value={salesBrand} onChange={(e) => setSalesBrand(e.target.value)} style={{ width: '100%', backgroundColor: '#070b14', border: '1px solid #1e293b', color: '#f8fafc', padding: '8px 12px', borderRadius: '8px', fontSize: '13px' }}>
                <option value="ALL">All Brands</option>
                <option value="Frozen Bottle">Frozen Bottle</option>
                <option value="Madno">Madno</option>
                <option value="Lubov">Lubov</option>
                <option value="Boba Bar">Boba Bar</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '6px' }}>Region</label>
              <select value={salesRegion} onChange={(e) => setSalesRegion(e.target.value)} style={{ width: '100%', backgroundColor: '#070b14', border: '1px solid #1e293b', color: '#f8fafc', padding: '8px 12px', borderRadius: '8px', fontSize: '13px' }}>
                <option value="ALL">All Regions</option>
                <option value="KA">KA (Karnataka)</option>
                <option value="MH">MH (Maharashtra)</option>
                <option value="TN">TN (Tamil Nadu)</option>
                <option value="Kerela">Kerala</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '6px' }}>Source</label>
              <select value={salesSource} onChange={(e) => setSalesSource(e.target.value)} style={{ width: '100%', backgroundColor: '#070b14', border: '1px solid #1e293b', color: '#f8fafc', padding: '8px 12px', borderRadius: '8px', fontSize: '13px' }}>
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
              <select value={salesSession} onChange={(e) => setSalesSession(e.target.value)} style={{ width: '100%', backgroundColor: '#070b14', border: '1px solid #1e293b', color: '#f8fafc', padding: '8px 12px', borderRadius: '8px', fontSize: '13px' }}>
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
            <div style={{ backgroundColor: '#0d1527', padding: '16px', borderRadius: '12px', border: '1px solid #1e293b' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Net Revenue</span>
              <p style={{ fontSize: '20px', fontWeight: 700, color: '#38bdf8', margin: '6px 0 4px 0' }}>₹{kpis.netRev}</p>
              <span style={{ fontSize: '11px', color: '#10b981' }}>Filtered Active</span>
            </div>
            <div style={{ backgroundColor: '#0d1527', padding: '16px', borderRadius: '12px', border: '1px solid #1e293b' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Orders (Txn)</span>
              <p style={{ fontSize: '20px', fontWeight: 700, color: '#ffffff', margin: '6px 0 4px 0' }}>{kpis.orders}</p>
              <span style={{ fontSize: '11px', color: '#94a3b8' }}>Total Billed</span>
            </div>
            <div style={{ backgroundColor: '#0d1527', padding: '16px', borderRadius: '12px', border: '1px solid #1e293b' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Discount %</span>
              <p style={{ fontSize: '20px', fontWeight: 700, color: '#f43f5e', margin: '6px 0 4px 0' }}>{kpis.disPct}</p>
              <span style={{ fontSize: '11px', color: '#94a3b8' }}>Total Discount</span>
            </div>
            <div style={{ backgroundColor: '#0d1527', padding: '16px', borderRadius: '12px', border: '1px solid #1e293b' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>AOV</span>
              <p style={{ fontSize: '20px', fontWeight: 700, color: '#f59e0b', margin: '6px 0 4px 0' }}>₹{kpis.aov}</p>
              <span style={{ fontSize: '11px', color: '#94a3b8' }}>Avg Basket Size</span>
            </div>
            <div style={{ backgroundColor: '#0d1527', padding: '16px', borderRadius: '12px', border: '1px solid #1e293b' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Offline %</span>
              <p style={{ fontSize: '20px', fontWeight: 700, color: '#e2e8f0', margin: '6px 0 4px 0' }}>{kpis.offlinePct}</p>
              <span style={{ fontSize: '11px', color: '#94a3b8' }}>In Store</span>
            </div>
            <div style={{ backgroundColor: '#0d1527', padding: '16px', borderRadius: '12px', border: '1px solid #1e293b' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Online %</span>
              <p style={{ fontSize: '20px', fontWeight: 700, color: '#e2e8f0', margin: '6px 0 4px 0' }}>{kpis.onlinePct}</p>
              <span style={{ fontSize: '11px', color: '#94a3b8' }}>Aggregators</span>
            </div>
          </div>

          {/* 1. SALES SUMMARY TABLE (DYNAMIC HEADERS RESTORED) */}
          <div style={{ backgroundColor: '#0d1527', borderRadius: '12px', border: '1px solid #1e293b', overflow: 'hidden' }}>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid #1e293b', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', color: '#e2e8f0' }}>
              📈 {salesSubView.toUpperCase()} SALES SUMMARY
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead style={{ backgroundColor: '#070b14', color: '#94a3b8', borderBottom: '1px solid #1e293b' }}>
                  <tr>
                    {dynamicSummaryHeaders.map((headerText: string, hIdx: number) => (
                      <th key={hIdx} style={{ padding: '12px 16px', textAlign: hIdx === 0 ? 'left' : 'right' }}>
                        {headerText}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody style={{ fontFamily: 'monospace' }}>
                  {(salesData?.overallKPI || []).map((row: any, idx: number) => (
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

          {/* 2. CURRENT MONTH DATE-WISE PERFORMANCE */}
          <div style={{ backgroundColor: '#0d1527', borderRadius: '12px', border: '1px solid #1e293b', overflow: 'hidden' }}>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid #1e293b', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', color: '#e2e8f0' }}>
              📅 CURRENT MONTH DATE-WISE PERFORMANCE ({salesMonth})
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead style={{ backgroundColor: '#070b14', color: '#94a3b8', borderBottom: '1px solid #1e293b' }}>
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
                  {(salesData?.currentMonthDaily || []).map((row: any, idx: number) => (
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

          {/* 3. AOV & DISCOUNT BUCKET ANALYSIS */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
            <div style={{ backgroundColor: '#0d1527', borderRadius: '12px', border: '1px solid #1e293b', overflow: 'hidden' }}>
              <div style={{ padding: '10px 16px', backgroundColor: '#d97706', fontWeight: 700, fontSize: '12px', textTransform: 'uppercase', color: '#ffffff' }}>
                💰 AOV BUCKET ANALYSIS (REV SHARE | ORDERS)
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <thead style={{ backgroundColor: '#070b14', color: '#94a3b8', borderBottom: '1px solid #1e293b' }}>
                    <tr>
                      <th style={{ padding: '10px 14px', textAlign: 'left' }}>Bucket</th>
                      <th style={{ padding: '10px 14px', textAlign: 'right' }}>Yesterday</th>
                      <th style={{ padding: '10px 14px', textAlign: 'right' }}>Last Week</th>
                      <th style={{ padding: '10px 14px', textAlign: 'right' }}>MTD</th>
                      <th style={{ padding: '10px 14px', textAlign: 'right' }}>LMTD</th>
                    </tr>
                  </thead>
                  <tbody style={{ fontFamily: 'monospace' }}>
                    {(salesData?.aovBuckets || []).map((row: any, idx: number) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #1e293b' }}>
                        <td style={{ padding: '10px 14px', fontFamily: 'sans-serif', fontWeight: 600, color: '#e2e8f0' }}>{row.bucket}</td>
                        <td style={{ padding: '10px 14px', textAlign: 'right', color: '#cbd5e1' }}>{row.col1}</td>
                        <td style={{ padding: '10px 14px', textAlign: 'right', color: '#94a3b8' }}>{row.col2}</td>
                        <td style={{ padding: '10px 14px', textAlign: 'right', color: '#34d399', fontWeight: 700 }}>{row.col3}</td>
                        <td style={{ padding: '10px 14px', textAlign: 'right', color: '#94a3b8' }}>{row.col4}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div style={{ backgroundColor: '#0d1527', borderRadius: '12px', border: '1px solid #1e293b', overflow: 'hidden' }}>
              <div style={{ padding: '10px 16px', backgroundColor: '#e11d48', fontWeight: 700, fontSize: '12px', textTransform: 'uppercase', color: '#ffffff' }}>
                🏷️ DISCOUNT BUCKET ANALYSIS (REV SHARE | ORDERS)
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <thead style={{ backgroundColor: '#070b14', color: '#94a3b8', borderBottom: '1px solid #1e293b' }}>
                    <tr>
                      <th style={{ padding: '10px 14px', textAlign: 'left' }}>Bucket</th>
                      <th style={{ padding: '10px 14px', textAlign: 'right' }}>Yesterday</th>
                      <th style={{ padding: '10px 14px', textAlign: 'right' }}>Last Week</th>
                      <th style={{ padding: '10px 14px', textAlign: 'right' }}>MTD</th>
                      <th style={{ padding: '10px 14px', textAlign: 'right' }}>LMTD</th>
                    </tr>
                  </thead>
                  <tbody style={{ fontFamily: 'monospace' }}>
                    {(salesData?.discountBuckets || []).map((row: any, idx: number) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #1e293b' }}>
                        <td style={{ padding: '10px 14px', fontFamily: 'sans-serif', fontWeight: 600, color: '#e2e8f0' }}>{row.bucket}</td>
                        <td style={{ padding: '10px 14px', textAlign: 'right', color: '#cbd5e1' }}>{row.col1}</td>
                        <td style={{ padding: '10px 14px', textAlign: 'right', color: '#94a3b8' }}>{row.col2}</td>
                        <td style={{ padding: '10px 14px', textAlign: 'right', color: '#34d399', fontWeight: 700 }}>{row.col3}</td>
                        <td style={{ padding: '10px 14px', textAlign: 'right', color: '#94a3b8' }}>{row.col4}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* 4. BRAND SUMMARY & SOURCE SUMMARY */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
            <div style={{ backgroundColor: '#0d1527', borderRadius: '12px', border: '1px solid #1e293b', overflow: 'hidden' }}>
              <div style={{ padding: '12px 16px', borderBottom: '1px solid #1e293b', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', color: '#e2e8f0' }}>
                🏷️ BRAND SUMMARY
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <thead style={{ backgroundColor: '#070b14', color: '#94a3b8', borderBottom: '1px solid #1e293b' }}>
                    <tr>
                      <th style={{ padding: '10px 14px', textAlign: 'left' }}>Brand</th>
                      <th style={{ padding: '10px 14px', textAlign: 'right' }}>Today Rev</th>
                      <th style={{ padding: '10px 14px', textAlign: 'right' }}>LW Rev</th>
                      <th style={{ padding: '10px 14px', textAlign: 'right' }}>Growth %</th>
                      <th style={{ padding: '10px 14px', textAlign: 'right' }}>Today Dis%</th>
                    </tr>
                  </thead>
                  <tbody style={{ fontFamily: 'monospace' }}>
                    {(salesData?.brandSummary || []).map((row: any, idx: number) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #1e293b' }}>
                        <td style={{ padding: '10px 14px', fontFamily: 'sans-serif', fontWeight: 600, color: '#f8fafc' }}>{row.brand}</td>
                        <td style={{ padding: '10px 14px', textAlign: 'right', color: '#38bdf8', fontWeight: 700 }}>₹{row.todayRev}</td>
                        <td style={{ padding: '10px 14px', textAlign: 'right', color: '#cbd5e1' }}>₹{row.lwRev}</td>
                        <td style={{ padding: '10px 14px', textAlign: 'right', color: '#f59e0b', fontFamily: 'sans-serif', fontWeight: 700 }}>{row.growth}</td>
                        <td style={{ padding: '10px 14px', textAlign: 'right', color: '#f43f5e' }}>{row.todayDis}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div style={{ backgroundColor: '#0d1527', borderRadius: '12px', border: '1px solid #1e293b', overflow: 'hidden' }}>
              <div style={{ padding: '12px 16px', borderBottom: '1px solid #1e293b', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', color: '#e2e8f0' }}>
                📍 SOURCE SUMMARY
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <thead style={{ backgroundColor: '#070b14', color: '#94a3b8', borderBottom: '1px solid #1e293b' }}>
                    <tr>
                      <th style={{ padding: '10px 14px', textAlign: 'left' }}>Source</th>
                      <th style={{ padding: '10px 14px', textAlign: 'right' }}>Today Rev</th>
                      <th style={{ padding: '10px 14px', textAlign: 'right' }}>LW Rev</th>
                      <th style={{ padding: '10px 14px', textAlign: 'right' }}>Growth %</th>
                      <th style={{ padding: '10px 14px', textAlign: 'right' }}>Today Dis%</th>
                    </tr>
                  </thead>
                  <tbody style={{ fontFamily: 'monospace' }}>
                    {(salesData?.sourceSummary || []).map((row: any, idx: number) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #1e293b' }}>
                        <td style={{ padding: '10px 14px', fontFamily: 'sans-serif', fontWeight: 600, color: '#f8fafc' }}>{row.source}</td>
                        <td style={{ padding: '10px 14px', textAlign: 'right', color: '#38bdf8', fontWeight: 700 }}>₹{row.todayRev}</td>
                        <td style={{ padding: '10px 14px', textAlign: 'right', color: '#cbd5e1' }}>₹{row.lwRev}</td>
                        <td style={{ padding: '10px 14px', textAlign: 'right', color: '#f59e0b', fontFamily: 'sans-serif', fontWeight: 700 }}>{row.growth}</td>
                        <td style={{ padding: '10px 14px', textAlign: 'right', color: '#f43f5e' }}>{row.todayDis}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* 5. BRAND SESSION & REGION SESSION */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
            <div style={{ backgroundColor: '#0d1527', borderRadius: '12px', border: '1px solid #1e293b', overflow: 'hidden' }}>
              <div style={{ padding: '12px 16px', borderBottom: '1px solid #1e293b', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', color: '#e2e8f0' }}>
                🍽️ BRAND SESSION ANALYSIS
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <thead style={{ backgroundColor: '#070b14', color: '#94a3b8', borderBottom: '1px solid #1e293b' }}>
                    <tr>
                      <th style={{ padding: '10px 14px', textAlign: 'left' }}>Brand</th>
                      <th style={{ padding: '10px 14px', textAlign: 'right' }}>Breakfast</th>
                      <th style={{ padding: '10px 14px', textAlign: 'right' }}>Lunch</th>
                      <th style={{ padding: '10px 14px', textAlign: 'right' }}>Snacks</th>
                      <th style={{ padding: '10px 14px', textAlign: 'right' }}>Dinner</th>
                    </tr>
                  </thead>
                  <tbody style={{ fontFamily: 'monospace' }}>
                    {(salesData?.brandSession || []).map((row: any, idx: number) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #1e293b' }}>
                        <td style={{ padding: '10px 14px', fontFamily: 'sans-serif', fontWeight: 600, color: '#f8fafc' }}>{row.brand}</td>
                        <td style={{ padding: '10px 14px', textAlign: 'right', color: '#94a3b8' }}>₹{row.breakfast}</td>
                        <td style={{ padding: '10px 14px', textAlign: 'right', color: '#cbd5e1' }}>₹{row.lunch}</td>
                        <td style={{ padding: '10px 14px', textAlign: 'right', color: '#e2e8f0' }}>₹{row.snacks}</td>
                        <td style={{ padding: '10px 14px', textAlign: 'right', color: '#38bdf8', fontWeight: 700 }}>₹{row.dinner}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div style={{ backgroundColor: '#0d1527', borderRadius: '12px', border: '1px solid #1e293b', overflow: 'hidden' }}>
              <div style={{ padding: '12px 16px', borderBottom: '1px solid #1e293b', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', color: '#e2e8f0' }}>
                🌍 REGION SESSION ANALYSIS
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <thead style={{ backgroundColor: '#070b14', color: '#94a3b8', borderBottom: '1px solid #1e293b' }}>
                    <tr>
                      <th style={{ padding: '10px 14px', textAlign: 'left' }}>Region</th>
                      <th style={{ padding: '10px 14px', textAlign: 'right' }}>Breakfast</th>
                      <th style={{ padding: '10px 14px', textAlign: 'right' }}>Lunch</th>
                      <th style={{ padding: '10px 14px', textAlign: 'right' }}>Snacks</th>
                      <th style={{ padding: '10px 14px', textAlign: 'right' }}>Dinner</th>
                    </tr>
                  </thead>
                  <tbody style={{ fontFamily: 'monospace' }}>
                    {(salesData?.regionSession || []).map((row: any, idx: number) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #1e293b' }}>
                        <td style={{ padding: '10px 14px', fontFamily: 'sans-serif', fontWeight: 600, color: '#f8fafc' }}>{row.region}</td>
                        <td style={{ padding: '10px 14px', textAlign: 'right', color: '#94a3b8' }}>₹{row.breakfast}</td>
                        <td style={{ padding: '10px 14px', textAlign: 'right', color: '#cbd5e1' }}>₹{row.lunch}</td>
                        <td style={{ padding: '10px 14px', textAlign: 'right', color: '#e2e8f0' }}>₹{row.snacks}</td>
                        <td style={{ padding: '10px 14px', textAlign: 'right', color: '#38bdf8', fontWeight: 700 }}>₹{row.dinner}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* 6. 81 COCO STORE PERFORMANCE RANKING */}
          <div style={{ backgroundColor: '#0d1527', borderRadius: '12px', border: '1px solid #1e293b', overflow: 'hidden' }}>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid #1e293b', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', color: '#e2e8f0', display: 'flex', justifyContent: 'space-between' }}>
              <span>🏪 81 COCO STORE PERFORMANCE RANKING</span>
              <span style={{ color: '#94a3b8' }}>Total: {salesData?.allStores?.length || 81}</span>
            </div>
            <div style={{ overflowX: 'auto', maxHeight: '420px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead style={{ backgroundColor: '#070b14', color: '#94a3b8', borderBottom: '1px solid #1e293b', position: 'sticky', top: 0 }}>
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
                  {(salesData?.allStores || []).map((st: any) => (
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

      {/* ========================================================================= */}
      {/* 3. KPT & O2D TAB (FULL PREVIOUS FORMAT RESTORED) */}
      {/* ========================================================================= */}
      {activeTab === 'kpt' && (
        <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Executive Speed Overview */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
            <div style={{ backgroundColor: '#0d1527', padding: '16px', borderRadius: '12px', border: '1px solid #1e293b' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Avg Kitchen Prep (KPT)</span>
              <p style={{ fontSize: '24px', fontWeight: 700, color: '#10b981', margin: '6px 0 4px 0' }}>7.4 min</p>
              <span style={{ fontSize: '11px', color: '#10b981' }}>Target &lt; 9.0 min (Compliant)</span>
            </div>
            <div style={{ backgroundColor: '#0d1527', padding: '16px', borderRadius: '12px', border: '1px solid #1e293b' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Avg Rider Wait (RWT)</span>
              <p style={{ fontSize: '24px', fontWeight: 700, color: '#f59e0b', margin: '6px 0 4px 0' }}>4.2 min</p>
              <span style={{ fontSize: '11px', color: '#94a3b8' }}>Target: &lt; 5.0 min</span>
            </div>
            <div style={{ backgroundColor: '#0d1527', padding: '16px', borderRadius: '12px', border: '1px solid #1e293b' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Order to Delivery (O2D)</span>
              <p style={{ fontSize: '24px', fontWeight: 700, color: '#38bdf8', margin: '6px 0 4px 0' }}>26.8 min</p>
              <span style={{ fontSize: '11px', color: '#10b981' }}>Target: &lt; 30.0 min</span>
            </div>
            <div style={{ backgroundColor: '#0d1527', padding: '16px', borderRadius: '12px', border: '1px solid #1e293b' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>KPT Breaches (&gt;15 min)</span>
              <p style={{ fontSize: '24px', fontWeight: 700, color: '#f43f5e', margin: '6px 0 4px 0' }}>2.4%</p>
              <span style={{ fontSize: '11px', color: '#10b981' }}>-0.6% vs Last Week</span>
            </div>
          </div>

          {/* Time Bucket Distribution Breakdown */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
            <div style={{ backgroundColor: '#0d1527', padding: '16px', borderRadius: '12px', border: '1px solid #1e293b' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#e2e8f0', textTransform: 'uppercase' }}>⏱️ Kitchen Prep Time (KPT) Distribution</span>
              <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
                {[
                  { b: '< 7 min (Fast)', pct: '62.4%', orders: '54,120', col: '#10b981' },
                  { b: '7 - 10 min (Normal)', pct: '26.8%', orders: '23,240', col: '#38bdf8' },
                  { b: '10 - 15 min (Delayed)', pct: '8.4%', orders: '7,290', col: '#f59e0b' },
                  { b: '> 15 min (Breached)', pct: '2.4%', orders: '2,080', col: '#f43f5e' },
                ].map((row) => (
                  <div key={row.b} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ width: '130px', color: '#94a3b8' }}>{row.b}</span>
                    <div style={{ flex: 1, backgroundColor: '#070b14', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: row.pct, backgroundColor: row.col, height: '100%' }} />
                    </div>
                    <span style={{ width: '45px', textAlign: 'right', fontWeight: 600 }}>{row.pct}</span>
                    <span style={{ width: '60px', textAlign: 'right', color: '#64748b' }}>({row.orders})</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ backgroundColor: '#0d1527', padding: '16px', borderRadius: '12px', border: '1px solid #1e293b' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#e2e8f0', textTransform: 'uppercase' }}>🛵 Fleet & Delivery Slicing (O2D Splits)</span>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '14px' }}>
                <div style={{ backgroundColor: '#070b14', padding: '12px', borderRadius: '8px', border: '1px solid #1e293b' }}>
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>Rider Assigned Time</span>
                  <p style={{ fontSize: '18px', fontWeight: 700, color: '#38bdf8', margin: '4px 0 0 0' }}>2.1 min</p>
                </div>
                <div style={{ backgroundColor: '#070b14', padding: '12px', borderRadius: '8px', border: '1px solid #1e293b' }}>
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>Rider Transit Time</span>
                  <p style={{ fontSize: '18px', fontWeight: 700, color: '#10b981', margin: '4px 0 0 0' }}>14.8 min</p>
                </div>
                <div style={{ backgroundColor: '#070b14', padding: '12px', borderRadius: '8px', border: '1px solid #1e293b' }}>
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>Avg Distance</span>
                  <p style={{ fontSize: '18px', fontWeight: 700, color: '#f59e0b', margin: '4px 0 0 0' }}>3.4 km</p>
                </div>
                <div style={{ backgroundColor: '#070b14', padding: '12px', borderRadius: '8px', border: '1px solid #1e293b' }}>
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>Long Deliveries (&gt;45m)</span>
                  <p style={{ fontSize: '18px', fontWeight: 700, color: '#f43f5e', margin: '4px 0 0 0' }}>1.8%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Store Speed of Service Leaderboard */}
          <div style={{ backgroundColor: '#0d1527', borderRadius: '12px', border: '1px solid #1e293b', overflow: 'hidden' }}>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid #1e293b', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', color: '#e2e8f0', display: 'flex', justifyContent: 'space-between' }}>
              <span>⏱️ OUTLET SPEED OF SERVICE & BREACH LEADERBOARD</span>
              <span style={{ color: '#94a3b8' }}>81 Stores Monitored</span>
            </div>
            <div style={{ overflowX: 'auto', maxHeight: '500px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead style={{ backgroundColor: '#070b14', color: '#94a3b8', borderBottom: '1px solid #1e293b', position: 'sticky', top: 0 }}>
                  <tr>
                    <th style={{ padding: '12px 16px', textAlign: 'left' }}>Store Name</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left' }}>Region</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right' }}>Avg KPT</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right' }}>Rider Wait</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right' }}>Avg O2D</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right' }}>Breach Rate</th>
                    <th style={{ padding: '12px 16px', textAlign: 'center' }}>Speed Status</th>
                  </tr>
                </thead>
                <tbody style={{ fontFamily: 'monospace' }}>
                  {[
                    { s: 'Indiranagar - CK', r: 'KA', kpt: '6.2 min', wait: '3.1 min', o2d: '23.4 min', br: '0.8%', st: 'Fastest' },
                    { s: 'Koramangala', r: 'KA', kpt: '6.8 min', wait: '3.5 min', o2d: '24.1 min', br: '1.2%', st: 'Fastest' },
                    { s: 'HSR Layout', r: 'KA', kpt: '7.1 min', wait: '4.0 min', o2d: '25.6 min', br: '1.8%', st: 'Optimal' },
                    { s: 'Whitefield', r: 'KA', kpt: '7.8 min', wait: '4.4 min', o2d: '27.2 min', br: '2.5%', st: 'Optimal' },
                    { s: 'Besant Nagar', r: 'TN', kpt: '7.9 min', wait: '4.2 min', o2d: '26.8 min', br: '2.2%', st: 'Optimal' },
                    { s: 'Khar', r: 'MH', kpt: '8.4 min', wait: '4.9 min', o2d: '28.5 min', br: '3.1%', st: 'Moderate' },
                    { s: 'Badlapur', r: 'MH', kpt: '11.8 min', wait: '7.2 min', o2d: '34.2 min', br: '7.8%', st: 'Lagging' },
                  ].map((row, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #1e293b' }}>
                      <td style={{ padding: '10px 16px', fontFamily: 'sans-serif', fontWeight: 600, color: '#f8fafc' }}>{row.s}</td>
                      <td style={{ padding: '10px 16px', fontFamily: 'sans-serif', color: '#94a3b8' }}>{row.r}</td>
                      <td style={{ padding: '10px 16px', textAlign: 'right', color: '#34d399', fontWeight: 700 }}>{row.kpt}</td>
                      <td style={{ padding: '10px 16px', textAlign: 'right', color: '#f59e0b' }}>{row.wait}</td>
                      <td style={{ padding: '10px 16px', textAlign: 'right', color: '#38bdf8' }}>{row.o2d}</td>
                      <td style={{ padding: '10px 16px', textAlign: 'right', color: '#f43f5e', fontWeight: 700 }}>{row.br}</td>
                      <td style={{ padding: '10px 16px', textAlign: 'center', fontFamily: 'sans-serif' }}>
                        <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 700, backgroundColor: row.st === 'Fastest' ? '#064e3b' : row.st === 'Optimal' ? '#0c4a6e' : row.st === 'Moderate' ? '#78350f' : '#881337', color: row.st === 'Fastest' ? '#34d399' : row.st === 'Optimal' ? '#38bdf8' : row.st === 'Moderate' ? '#fde047' : '#f87171' }}>
                          {row.st}
                        </span>
                      </td>
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
