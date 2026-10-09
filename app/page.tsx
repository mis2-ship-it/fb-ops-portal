'use client';
import React, { useState, useEffect } from 'react';

type MainView = 'Operations' | 'Sales';
type SalesSubView = 'daily' | 'weekly' | 'monthly';
type Platform = 'Google' | 'Swiggy' | 'Zomato';
type ChartGranularity = 'day' | 'week' | 'month';

export default function Home() {
  const [mainView, setMainView] = useState<MainView>('Operations');

  // Operations Hub State
  const [platform, setPlatform] = useState<Platform>('Zomato');
  const [selectedBrand, setSelectedBrand] = useState('ALL');
  const [selectedRegion, setSelectedRegion] = useState('ALL');
  const [selectedStore, setSelectedStore] = useState('ALL');
  const [granularity, setGranularity] = useState<ChartGranularity>('day');
  const [commentStarFilter, setCommentStarFilter] = useState<number | 'ALL'>('ALL');
  const [opsData, setOpsData] = useState<any>(null);
  const [googleRating, setGoogleRating] = useState('4.24');
  const [opsLoading, setOpsLoading] = useState(true);

  // Sales Hub State
  const [salesSubView, setSalesSubView] = useState<SalesSubView>('daily');
  const [salesBrand, setSalesBrand] = useState('ALL');
  const [salesRegion, setSalesRegion] = useState('ALL');
  const [salesSource, setSalesSource] = useState('ALL');
  const [salesSession, setSalesSession] = useState('ALL');
  const [salesData, setSalesData] = useState<any>(null);
  const [salesLoading, setSalesLoading] = useState(true);

  // Load Operations Data
  useEffect(() => {
    fetch('/api/ratings?platform=google')
      .then((res) => res.json())
      .then((json) => {
        if (json?.performance?.overall?.currRating) {
          setGoogleRating(json.performance.overall.currRating);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (mainView === 'Operations') {
      setOpsLoading(true);
      const params = new URLSearchParams({
        platform: platform.toLowerCase(),
        brand: selectedBrand,
        region: selectedRegion,
        store: selectedStore,
      });
      fetch(`/api/ratings?${params.toString()}`)
        .then((res) => res.json())
        .then((json) => {
          setOpsData(json);
          setOpsLoading(false);
        })
        .catch(() => setOpsLoading(false));
    }
  }, [mainView, platform, selectedBrand, selectedRegion, selectedStore]);

  // Load Sales Data
  useEffect(() => {
    if (mainView === 'Sales') {
      setSalesLoading(true);
      const params = new URLSearchParams({
        view: salesSubView,
        brand: salesBrand,
        region: salesRegion,
        source: salesSource,
        session: salesSession,
      });
      fetch(`/api/sales?${params.toString()}`)
        .then((res) => res.json())
        .then((json) => {
          setSalesData(json);
          setSalesLoading(false);
        })
        .catch(() => setSalesLoading(false));
    }
  }, [mainView, salesSubView, salesBrand, salesRegion, salesSource, salesSession]);

  const pLabel = opsData?.previousLabel || 'Sep-26';
  const cLabel = opsData?.currentLabel || 'Oct-26';
  const chartPoints = opsData?.chartData?.[granularity] || [];

  const availableStores = React.useMemo(() => {
    if (!opsData?.slicers?.regionStores) return [];
    if (selectedRegion === 'ALL') {
      const all: string[] = [];
      Object.values(opsData.slicers.regionStores as Record<string, string[]>).forEach((list) => {
        list.forEach((st) => {
          if (!all.includes(st)) all.push(st);
        });
      });
      return all.sort();
    }
    return (opsData.slicers.regionStores[selectedRegion] || []).sort();
  }, [opsData, selectedRegion]);

  const filteredComments = React.useMemo(() => {
    if (!opsData?.recentComments) return [];
    if (commentStarFilter === 'ALL') return opsData.recentComments;
    return opsData.recentComments.filter((c: any) => Math.round(c.rating) === commentStarFilter);
  }, [opsData, commentStarFilter]);

  const getAovColHeaders = () => {
    if (salesSubView === 'weekly') {
      return ['Bucket', 'Current WK', 'Last Week', 'Last 2 Week', 'Growth %'];
    }
    if (salesSubView === 'monthly') {
      return ['Bucket', 'Oct MTD', 'Sep-26', 'Aug-26', 'Jul-26'];
    }
    return ['Bucket', 'Yesterday', 'Last Week', 'MTD', 'LMTD'];
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#070b12', color: '#f3f4f6', fontFamily: 'system-ui, -apple-system, sans-serif', padding: '14px', boxSizing: 'border-box' }}>
      
      {/* Top Header & Main Mode Toggle */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1f293d', paddingBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: '#ffffff' }}>Frozen Bottle Operations Hub</h1>
          <p style={{ margin: '2px 0 0', fontSize: '11px', color: '#94a3b8' }}>
            Store Performance, Customer Feedback & Revenue Intelligence
          </p>
        </div>

        <div style={{ display: 'flex', backgroundColor: '#0f172a', padding: '4px', borderRadius: '10px', border: '1px solid #1f293d' }}>
          <button
            onClick={() => setMainView('Operations')}
            style={{
              backgroundColor: mainView === 'Operations' ? '#2563eb' : 'transparent',
              color: '#ffffff',
              border: 'none',
              borderRadius: '7px',
              padding: '6px 16px',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            📊 Operations & Ratings
          </button>
          <button
            onClick={() => setMainView('Sales')}
            style={{
              backgroundColor: mainView === 'Sales' ? '#10b981' : 'transparent',
              color: '#ffffff',
              border: 'none',
              borderRadius: '7px',
              padding: '6px 16px',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            📈 Sales Hub
          </button>
        </div>
      </div>

      {/* ======================= SALES DASHBOARD VIEW ======================= */}
      {mainView === 'Sales' ? (
        <div style={{ marginTop: '14px' }}>
          
          {/* Top Bar: Insight & Sub-View Slicer (Daily, Weekly, Monthly) */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '14px' }}>🧠</span>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#f59e0b' }}>
                {salesData?.executiveInsight || '-9.6% vs LW, +22.3% vs L2W, +8.1% vs MoM, +41.7% vs LY'}
              </span>
            </div>

            {/* Sales Sub-View Slicer: Daily | Weekly | Monthly */}
            <div style={{ display: 'flex', backgroundColor: '#0f172a', padding: '3px', borderRadius: '8px', border: '1px solid #1f293d' }}>
              {(['daily', 'weekly', 'monthly'] as SalesSubView[]).map((v) => (
                <button
                  key={v}
                  onClick={() => setSalesSubView(v)}
                  style={{
                    backgroundColor: salesSubView === v ? '#10b981' : 'transparent',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '5px 14px',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    textTransform: 'capitalize',
                  }}
                >
                  {v === 'daily' ? '📅 Daily' : v === 'weekly' ? '📆 Weekly' : '🗓️ Monthly'}
                </button>
              ))}
            </div>
          </div>

          {/* Sales Slicers: Brand, Region, Source, Session */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', backgroundColor: '#0f172a', padding: '10px', borderRadius: '10px', border: '1px solid #1f293d', marginBottom: '16px' }}>
            <div style={{ flex: '1 1 100px' }}>
              <select
                value={salesBrand}
                onChange={(e) => setSalesBrand(e.target.value)}
                style={{ width: '100%', backgroundColor: '#1e293b', color: '#ffffff', border: '1px solid #334155', borderRadius: '6px', padding: '6px', fontSize: '11px' }}
              >
                <option value="ALL">All Brands</option>
                {salesData?.slicers?.brands?.map((b: string) => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>

            <div style={{ flex: '1 1 100px' }}>
              <select
                value={salesRegion}
                onChange={(e) => setSalesRegion(e.target.value)}
                style={{ width: '100%', backgroundColor: '#1e293b', color: '#ffffff', border: '1px solid #334155', borderRadius: '6px', padding: '6px', fontSize: '11px' }}
              >
                <option value="ALL">All Regions</option>
                {salesData?.slicers?.regions?.map((r: string) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            <div style={{ flex: '1 1 100px' }}>
              <select
                value={salesSource}
                onChange={(e) => setSalesSource(e.target.value)}
                style={{ width: '100%', backgroundColor: '#1e293b', color: '#ffffff', border: '1px solid #334155', borderRadius: '6px', padding: '6px', fontSize: '11px' }}
              >
                <option value="ALL">All Sources</option>
                {salesData?.slicers?.sources?.map((s: string) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div style={{ flex: '1 1 100px' }}>
              <select
                value={salesSession}
                onChange={(e) => setSalesSession(e.target.value)}
                style={{ width: '100%', backgroundColor: '#1e293b', color: '#ffffff', border: '1px solid #334155', borderRadius: '6px', padding: '6px', fontSize: '11px' }}
              >
                <option value="ALL">All Sessions</option>
                {salesData?.slicers?.sessions?.map((s: string) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* Primary Sales KPI Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px', marginBottom: '18px' }}>
            <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '10px', padding: '12px' }}>
              <span style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase' }}>Net Rev</span>
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff', margin: '4px 0 2px' }}>₹ {salesData?.kpis?.netRev || '16,54,290.98'}</div>
              <span style={{ fontSize: '9px', color: '#10b981' }}>Live Pacing Active</span>
            </div>

            <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '10px', padding: '12px' }}>
              <span style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase' }}>Orders (Txn)</span>
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#38bdf8', margin: '4px 0 2px' }}>{salesData?.kpis?.orders || '6,694'}</div>
              <span style={{ fontSize: '9px', color: '#10b981' }}>+13.38% MoM</span>
            </div>

            <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '10px', padding: '12px' }}>
              <span style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase' }}>Dis %</span>
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#f87171', margin: '4px 0 2px' }}>{salesData?.kpis?.disPct || '-38.03%'}</div>
              <span style={{ fontSize: '9px', color: '#94a3b8' }}>-3.83% vs LW</span>
            </div>

            <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '10px', padding: '12px' }}>
              <span style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase' }}>AOV</span>
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#f59e0b', margin: '4px 0 2px' }}>₹ {salesData?.kpis?.aov || '247.13'}</div>
              <span style={{ fontSize: '9px', color: '#64748b' }}>Avg Basket</span>
            </div>

            <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '10px', padding: '12px' }}>
              <span style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase' }}>Offline %</span>
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff', margin: '4px 0 2px' }}>{salesData?.kpis?.offlinePct || '25.0%'}</div>
              <span style={{ fontSize: '9px', color: '#10b981' }}>In Store</span>
            </div>

            <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '10px', padding: '12px' }}>
              <span style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase' }}>Online %</span>
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff', margin: '4px 0 2px' }}>{salesData?.kpis?.onlinePct || '75.0%'}</div>
              <span style={{ fontSize: '9px', color: '#38bdf8' }}>Aggregators</span>
            </div>
          </div>

          {/* Dynamic Sales KPI Matrix (Changes per Daily / Weekly / Monthly mode) */}
          <div style={{ backgroundColor: '#0f172a', border: '1px solid #1f293d', borderRadius: '10px', padding: '14px', marginBottom: '16px' }}>
            <h3 style={{ margin: '0 0 10px', fontSize: '12px', color: '#ffffff', textTransform: 'uppercase' }}>
              📈 {salesSubView.toUpperCase()} SALES SUMMARY
            </h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10px', minWidth: '700px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#1e293b', color: '#94a3b8' }}>
                    <th style={{ padding: '6px', textAlign: 'left' }}>Parameters</th>
                    {salesSubView === 'daily' && (
                      <>
                        <th style={{ padding: '6px', textAlign: 'center' }}>Yesterday</th>
                        <th style={{ padding: '6px', textAlign: 'center' }}>MTD</th>
                        <th style={{ padding: '6px', textAlign: 'center' }}>LMTD</th>
                        <th style={{ padding: '6px', textAlign: 'center' }}>Trends</th>
                        <th style={{ padding: '6px', textAlign: 'center' }}>Last Month</th>
                        <th style={{ padding: '6px', textAlign: 'center' }}>Last Year</th>
                      </>
                    )}
                    {salesSubView === 'weekly' && (
                      <>
                        <th style={{ padding: '6px', textAlign: 'center' }}>Current WK</th>
                        <th style={{ padding: '6px', textAlign: 'center' }}>Last Week</th>
                        <th style={{ padding: '6px', textAlign: 'center' }}>Last 2 Week</th>
                        <th style={{ padding: '6px', textAlign: 'center' }}>CWK vs LW</th>
                        <th style={{ padding: '6px', textAlign: 'center' }}>CWK vs L2W</th>
                      </>
                    )}
                    {salesSubView === 'monthly' && (
                      <>
                        <th style={{ padding: '6px', textAlign: 'center' }}>Oct MTD</th>
                        <th style={{ padding: '6px', textAlign: 'center' }}>Sep-26</th>
                        <th style={{ padding: '6px', textAlign: 'center' }}>Aug-26</th>
                        <th style={{ padding: '6px', textAlign: 'center' }}>Jul-26</th>
                        <th style={{ padding: '6px', textAlign: 'center' }}>MoM GW%</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {salesData?.overallKPI?.map((k: any) => (
                    <tr key={k.param} style={{ borderBottom: '1px solid #131c2e' }}>
                      <td style={{ padding: '6px', fontWeight: 600, color: '#ffffff' }}>{k.param}</td>
                      {salesSubView === 'daily' && (
                        <>
                          <td style={{ padding: '6px', textAlign: 'center', color: '#38bdf8', fontWeight: 700 }}>{k.yesterday}</td>
                          <td style={{ padding: '6px', textAlign: 'center', color: '#cbd5e1' }}>{k.mtd}</td>
                          <td style={{ padding: '6px', textAlign: 'center', color: '#cbd5e1' }}>{k.lmtd}</td>
                          <td style={{ padding: '6px', textAlign: 'center', color: '#34d399', fontWeight: 700 }}>{k.trends}</td>
                          <td style={{ padding: '6px', textAlign: 'center', color: '#cbd5e1' }}>{k.lm}</td>
                          <td style={{ padding: '6px', textAlign: 'center', color: '#cbd5e1' }}>{k.ly}</td>
                        </>
                      )}
                      {salesSubView === 'weekly' && (
                        <>
                          <td style={{ padding: '6px', textAlign: 'center', color: '#38bdf8', fontWeight: 700 }}>{k.cwk}</td>
                          <td style={{ padding: '6px', textAlign: 'center', color: '#cbd5e1' }}>{k.lw}</td>
                          <td style={{ padding: '6px', textAlign: 'center', color: '#cbd5e1' }}>{k.l2w}</td>
                          <td style={{ padding: '6px', textAlign: 'center', color: parseFloat(k.gwLw) >= 0 ? '#34d399' : '#f87171', fontWeight: 700 }}>{k.gwLw}</td>
                          <td style={{ padding: '6px', textAlign: 'center', color: '#34d399', fontWeight: 700 }}>{k.gwL2w}</td>
                        </>
                      )}
                      {salesSubView === 'monthly' && (
                        <>
                          <td style={{ padding: '6px', textAlign: 'center', color: '#38bdf8', fontWeight: 700 }}>{k.octMtd}</td>
                          <td style={{ padding: '6px', textAlign: 'center', color: '#cbd5e1' }}>{k.sep}</td>
                          <td style={{ padding: '6px', textAlign: 'center', color: '#cbd5e1' }}>{k.aug}</td>
                          <td style={{ padding: '6px', textAlign: 'center', color: '#cbd5e1' }}>{k.jul}</td>
                          <td style={{ padding: '6px', textAlign: 'center', color: '#34d399', fontWeight: 700 }}>{k.momGw}</td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* AOV Bucket & Discount Bucket Analysis (Revenue Share | Orders) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '14px', marginBottom: '16px' }}>
            
            {/* AOV Bucket Table */}
            <div style={{ backgroundColor: '#0f172a', border: '1px solid #1f293d', borderRadius: '10px', padding: '14px' }}>
              <h3 style={{ margin: '0 0 10px', fontSize: '12px', color: '#f59e0b', textTransform: 'uppercase' }}>
                💰 AOV Bucket Analysis (Rev Share | Orders)
              </h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10px' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#b45309', color: '#ffffff' }}>
                      {getAovColHeaders().map((h) => (
                        <th key={h} style={{ padding: '6px 4px', textAlign: h === 'Bucket' ? 'left' : 'center' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {salesData?.aovBuckets?.map((row: any) => (
                      <tr key={row.bucket} style={{ borderBottom: '1px solid #131c2e' }}>
                        <td style={{ padding: '6px 4px', fontWeight: 700, color: '#ffffff' }}>{row.bucket}</td>
                        <td style={{ padding: '6px 4px', textAlign: 'center', color: '#cbd5e1' }}>{row.col1}</td>
                        <td style={{ padding: '6px 4px', textAlign: 'center', color: '#cbd5e1' }}>{row.col2}</td>
                        <td style={{ padding: '6px 4px', textAlign: 'center', color: '#ffffff', fontWeight: 700 }}>{row.col3}</td>
                        <td style={{ padding: '6px 4px', textAlign: 'center', color: '#cbd5e1' }}>{row.col4}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Discount Bucket Table */}
            <div style={{ backgroundColor: '#0f172a', border: '1px solid #1f293d', borderRadius: '10px', padding: '14px' }}>
              <h3 style={{ margin: '0 0 10px', fontSize: '12px', color: '#f87171', textTransform: 'uppercase' }}>
                🏷️ Discount Bucket Analysis (Rev Share | Orders)
              </h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10px' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#b45309', color: '#ffffff' }}>
                      {getAovColHeaders().map((h) => (
                        <th key={h} style={{ padding: '6px 4px', textAlign: h === 'Bucket' ? 'left' : 'center' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {salesData?.discountBuckets?.map((row: any) => (
                      <tr key={row.bucket} style={{ borderBottom: '1px solid #131c2e' }}>
                        <td style={{ padding: '6px 4px', fontWeight: 700, color: '#ffffff' }}>{row.bucket}</td>
                        <td style={{ padding: '6px 4px', textAlign: 'center', color: '#cbd5e1' }}>{row.col1}</td>
                        <td style={{ padding: '6px 4px', textAlign: 'center', color: '#cbd5e1' }}>{row.col2}</td>
                        <td style={{ padding: '6px 4px', textAlign: 'center', color: '#ffffff', fontWeight: 700 }}>{row.col3}</td>
                        <td style={{ padding: '6px 4px', textAlign: 'center', color: '#cbd5e1' }}>{row.col4}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* Brand Summary & Source Summary */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '14px', marginBottom: '16px' }}>
            <div style={{ backgroundColor: '#0f172a', border: '1px solid #1f293d', borderRadius: '10px', padding: '14px' }}>
              <h3 style={{ margin: '0 0 10px', fontSize: '12px', color: '#f59e0b', textTransform: 'uppercase' }}>🏷️ Brand Summary</h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10px' }}>
                  <thead>
                    <tr style={{ color: '#94a3b8', borderBottom: '1px solid #1f293d' }}>
                      <th style={{ padding: '6px 4px', textAlign: 'left' }}>Brand</th>
                      <th style={{ padding: '6px 4px', textAlign: 'center' }}>Today Rev</th>
                      <th style={{ padding: '6px 4px', textAlign: 'center' }}>LW Rev</th>
                      <th style={{ padding: '6px 4px', textAlign: 'center' }}>Growth %</th>
                      <th style={{ padding: '6px 4px', textAlign: 'center' }}>Today Dis%</th>
                    </tr>
                  </thead>
                  <tbody>
                    {salesData?.brandSummary?.map((b: any) => (
                      <tr key={b.brand} style={{ borderBottom: '1px solid #131c2e' }}>
                        <td style={{ padding: '6px 4px', fontWeight: 600, color: '#ffffff' }}>{b.brand}</td>
                        <td style={{ padding: '6px 4px', textAlign: 'center', color: '#cbd5e1' }}>₹{b.todayRev}</td>
                        <td style={{ padding: '6px 4px', textAlign: 'center', color: '#94a3b8' }}>₹{b.lwRev}</td>
                        <td style={{ padding: '6px 4px', textAlign: 'center', color: parseFloat(b.growth) >= 0 ? '#34d399' : '#f87171', fontWeight: 700 }}>{b.growth}</td>
                        <td style={{ padding: '6px 4px', textAlign: 'center', color: '#cbd5e1' }}>{b.todayDis}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div style={{ backgroundColor: '#0f172a', border: '1px solid #1f293d', borderRadius: '10px', padding: '14px' }}>
              <h3 style={{ margin: '0 0 10px', fontSize: '12px', color: '#38bdf8', textTransform: 'uppercase' }}>🏷️ Source Summary</h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10px' }}>
                  <thead>
                    <tr style={{ color: '#94a3b8', borderBottom: '1px solid #1f293d' }}>
                      <th style={{ padding: '6px 4px', textAlign: 'left' }}>Source</th>
                      <th style={{ padding: '6px 4px', textAlign: 'center' }}>Today Rev</th>
                      <th style={{ padding: '6px 4px', textAlign: 'center' }}>LW Rev</th>
                      <th style={{ padding: '6px 4px', textAlign: 'center' }}>Growth %</th>
                      <th style={{ padding: '6px 4px', textAlign: 'center' }}>Today Dis%</th>
                    </tr>
                  </thead>
                  <tbody>
                    {salesData?.sourceSummary?.map((s: any) => (
                      <tr key={s.source} style={{ borderBottom: '1px solid #131c2e' }}>
                        <td style={{ padding: '6px 4px', fontWeight: 600, color: '#ffffff' }}>{s.source}</td>
                        <td style={{ padding: '6px 4px', textAlign: 'center', color: '#cbd5e1' }}>₹{s.todayRev}</td>
                        <td style={{ padding: '6px 4px', textAlign: 'center', color: '#94a3b8' }}>₹{s.lwRev}</td>
                        <td style={{ padding: '6px 4px', textAlign: 'center', color: parseFloat(s.growth) >= 0 ? '#34d399' : '#f87171', fontWeight: 700 }}>{s.growth}</td>
                        <td style={{ padding: '6px 4px', textAlign: 'center', color: '#cbd5e1' }}>{s.todayDis}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Session Summaries */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '14px', marginBottom: '16px' }}>
            <div style={{ backgroundColor: '#0f172a', border: '1px solid #1f293d', borderRadius: '10px', padding: '14px' }}>
              <h3 style={{ margin: '0 0 10px', fontSize: '12px', color: '#f59e0b', textTransform: 'uppercase' }}>🍽️ Brand Session Analysis</h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10px', minWidth: '450px' }}>
                  <thead>
                    <tr style={{ color: '#94a3b8', borderBottom: '1px solid #1f293d' }}>
                      <th style={{ padding: '6px 4px', textAlign: 'left' }}>Brand</th>
                      <th style={{ padding: '6px 4px', textAlign: 'center' }}>Breakfast</th>
                      <th style={{ padding: '6px 4px', textAlign: 'center' }}>Lunch</th>
                      <th style={{ padding: '6px 4px', textAlign: 'center' }}>Snacks</th>
                      <th style={{ padding: '6px 4px', textAlign: 'center' }}>Dinner</th>
                      <th style={{ padding: '6px 4px', textAlign: 'center' }}>Post Dinner</th>
                    </tr>
                  </thead>
                  <tbody>
                    {salesData?.brandSession?.map((bs: any) => (
                      <tr key={bs.brand} style={{ borderBottom: '1px solid #131c2e' }}>
                        <td style={{ padding: '6px 4px', fontWeight: 600, color: '#ffffff' }}>{bs.brand}</td>
                        <td style={{ padding: '6px 4px', textAlign: 'center' }}>₹{bs.breakfast}</td>
                        <td style={{ padding: '6px 4px', textAlign: 'center' }}>₹{bs.lunch}</td>
                        <td style={{ padding: '6px 4px', textAlign: 'center' }}>₹{bs.snacks}</td>
                        <td style={{ padding: '6px 4px', textAlign: 'center' }}>₹{bs.dinner}</td>
                        <td style={{ padding: '6px 4px', textAlign: 'center' }}>₹{bs.postDinner}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div style={{ backgroundColor: '#0f172a', border: '1px solid #1f293d', borderRadius: '10px', padding: '14px' }}>
              <h3 style={{ margin: '0 0 10px', fontSize: '12px', color: '#38bdf8', textTransform: 'uppercase' }}>🌍 Region Session Analysis</h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10px', minWidth: '450px' }}>
                  <thead>
                    <tr style={{ color: '#94a3b8', borderBottom: '1px solid #1f293d' }}>
                      <th style={{ padding: '6px 4px', textAlign: 'left' }}>Region</th>
                      <th style={{ padding: '6px 4px', textAlign: 'center' }}>Breakfast</th>
                      <th style={{ padding: '6px 4px', textAlign: 'center' }}>Lunch</th>
                      <th style={{ padding: '6px 4px', textAlign: 'center' }}>Snacks</th>
                      <th style={{ padding: '6px 4px', textAlign: 'center' }}>Dinner</th>
                      <th style={{ padding: '6px 4px', textAlign: 'center' }}>Post Dinner</th>
                    </tr>
                  </thead>
                  <tbody>
                    {salesData?.regionSession?.map((rs: any) => (
                      <tr key={rs.region} style={{ borderBottom: '1px solid #131c2e' }}>
                        <td style={{ padding: '6px 4px', fontWeight: 600, color: '#ffffff' }}>{rs.region}</td>
                        <td style={{ padding: '6px 4px', textAlign: 'center' }}>₹{rs.breakfast}</td>
                        <td style={{ padding: '6px 4px', textAlign: 'center' }}>₹{rs.lunch}</td>
                        <td style={{ padding: '6px 4px', textAlign: 'center' }}>₹{rs.snacks}</td>
                        <td style={{ padding: '6px 4px', textAlign: 'center' }}>₹{rs.dinner}</td>
                        <td style={{ padding: '6px 4px', textAlign: 'center' }}>₹{rs.postDinner}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Top 10 & Bottom 10 Outlets */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '14px', marginBottom: '16px' }}>
            <div style={{ backgroundColor: '#0f172a', border: '1px solid #1f293d', borderRadius: '10px', padding: '14px' }}>
              <h3 style={{ margin: '0 0 10px', fontSize: '12px', color: '#34d399', textTransform: 'uppercase' }}>🏆 Top 10 Stores (Rev)</h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10px' }}>
                  <thead>
                    <tr style={{ color: '#94a3b8', borderBottom: '1px solid #1f293d' }}>
                      <th style={{ padding: '6px 4px', textAlign: 'left' }}>#</th>
                      <th style={{ padding: '6px 4px', textAlign: 'left' }}>Store</th>
                      <th style={{ padding: '6px 4px', textAlign: 'center' }}>Region</th>
                      <th style={{ padding: '6px 4px', textAlign: 'center' }}>Net Rev</th>
                      <th style={{ padding: '6px 4px', textAlign: 'center' }}>Orders</th>
                      <th style={{ padding: '6px 4px', textAlign: 'center' }}>AOV</th>
                    </tr>
                  </thead>
                  <tbody>
                    {salesData?.topStores?.map((s: any) => (
                      <tr key={s.store} style={{ borderBottom: '1px solid #131c2e' }}>
                        <td style={{ padding: '6px 4px', color: '#f59e0b', fontWeight: 700 }}>{s.rank}</td>
                        <td style={{ padding: '6px 4px', fontWeight: 600, color: '#ffffff' }}>{s.store}</td>
                        <td style={{ padding: '6px 4px', textAlign: 'center', color: '#94a3b8' }}>{s.region}</td>
                        <td style={{ padding: '6px 4px', textAlign: 'center', color: '#34d399', fontWeight: 700 }}>₹{s.rev}</td>
                        <td style={{ padding: '6px 4px', textAlign: 'center', color: '#cbd5e1' }}>{s.orders}</td>
                        <td style={{ padding: '6px 4px', textAlign: 'center', color: '#cbd5e1' }}>₹{s.aov}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div style={{ backgroundColor: '#0f172a', border: '1px solid #1f293d', borderRadius: '10px', padding: '14px' }}>
              <h3 style={{ margin: '0 0 10px', fontSize: '12px', color: '#f87171', textTransform: 'uppercase' }}>⚠️ Bottom 10 Stores (Action Required)</h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10px' }}>
                  <thead>
                    <tr style={{ color: '#94a3b8', borderBottom: '1px solid #1f293d' }}>
                      <th style={{ padding: '6px 4px', textAlign: 'left' }}>#</th>
                      <th style={{ padding: '6px 4px', textAlign: 'left' }}>Store</th>
                      <th style={{ padding: '6px 4px', textAlign: 'center' }}>Region</th>
                      <th style={{ padding: '6px 4px', textAlign: 'center' }}>Net Rev</th>
                      <th style={{ padding: '6px 4px', textAlign: 'center' }}>Orders</th>
                      <th style={{ padding: '6px 4px', textAlign: 'center' }}>AOV</th>
                    </tr>
                  </thead>
                  <tbody>
                    {salesData?.bottomStores?.map((s: any) => (
                      <tr key={s.store} style={{ borderBottom: '1px solid #131c2e' }}>
                        <td style={{ padding: '6px 4px', color: '#f87171', fontWeight: 700 }}>{s.rank}</td>
                        <td style={{ padding: '6px 4px', fontWeight: 600, color: '#ffffff' }}>{s.store}</td>
                        <td style={{ padding: '6px 4px', textAlign: 'center', color: '#94a3b8' }}>{s.region}</td>
                        <td style={{ padding: '6px 4px', textAlign: 'center', color: '#f87171', fontWeight: 700 }}>₹{s.rev}</td>
                        <td style={{ padding: '6px 4px', textAlign: 'center', color: '#cbd5e1' }}>{s.orders}</td>
                        <td style={{ padding: '6px 4px', textAlign: 'center', color: '#cbd5e1' }}>₹{s.aov}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Full Network Store Rankings */}
          <div style={{ backgroundColor: '#0f172a', border: '1px solid #1f293d', borderRadius: '10px', padding: '14px', marginTop: '16px' }}>
            <h3 style={{ margin: '0 0 10px', fontSize: '12px', color: '#38bdf8', textTransform: 'uppercase' }}>
              🏪 All Outlets Performance ({salesData?.allStores?.length || 0} Stores)
            </h3>
            <div style={{ overflowX: 'auto', maxHeight: '420px', overflowY: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10px' }}>
                <thead style={{ position: 'sticky', top: 0, backgroundColor: '#1e293b' }}>
                  <tr style={{ color: '#94a3b8' }}>
                    <th style={{ padding: '6px 4px', textAlign: 'left' }}>#</th>
                    <th style={{ padding: '6px 4px', textAlign: 'left' }}>Store Name</th>
                    <th style={{ padding: '6px 4px', textAlign: 'center' }}>Type</th>
                    <th style={{ padding: '6px 4px', textAlign: 'center' }}>Region</th>
                    <th style={{ padding: '6px 4px', textAlign: 'center' }}>Net Revenue</th>
                    <th style={{ padding: '6px 4px', textAlign: 'center' }}>Orders</th>
                    <th style={{ padding: '6px 4px', textAlign: 'center' }}>AOV</th>
                  </tr>
                </thead>
                <tbody>
                  {salesData?.allStores?.map((s: any) => (
                    <tr key={s.store} style={{ borderBottom: '1px solid #131c2e' }}>
                      <td style={{ padding: '6px 4px', color: '#94a3b8' }}>{s.rank}</td>
                      <td style={{ padding: '6px 4px', fontWeight: 600, color: '#ffffff' }}>{s.store}</td>
                      <td style={{ padding: '6px 4px', textAlign: 'center', color: '#f59e0b' }}>{s.type}</td>
                      <td style={{ padding: '6px 4px', textAlign: 'center', color: '#94a3b8' }}>{s.region}</td>
                      <td style={{ padding: '6px 4px', textAlign: 'center', color: '#38bdf8', fontWeight: 700 }}>₹{s.rev}</td>
                      <td style={{ padding: '6px 4px', textAlign: 'center', color: '#cbd5e1' }}>{s.orders}</td>
                      <td style={{ padding: '6px 4px', textAlign: 'center', color: '#cbd5e1' }}>₹{s.aov}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      ) : (
        /* ======================= OPERATIONS & RATINGS VIEW ======================= */
        <div style={{ marginTop: '14px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
            <div style={{ display: 'flex', backgroundColor: '#0f172a', padding: '3px', borderRadius: '8px', border: '1px solid #1f293d' }}>
              {(['Google', 'Swiggy', 'Zomato'] as Platform[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setPlatform(p)}
                  style={{
                    backgroundColor: platform === p ? '#ea580c' : 'transparent',
                    color: platform === p ? '#ffffff' : '#94a3b8',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '6px 12px',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Operations KPI Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px', marginBottom: '14px' }}>
            <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '10px', padding: '12px' }}>
              <span style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase' }}>Net Sales</span>
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff', margin: '4px 0 2px' }}>₹ 14,82,400</div>
              <span style={{ fontSize: '9px', color: '#64748b' }}>POS + Aggregators</span>
            </div>

            <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '10px', padding: '12px' }}>
              <span style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase' }}>Google Rating</span>
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#38bdf8', margin: '4px 0 2px' }}>
                {googleRating} ★
              </div>
              <span style={{ fontSize: '9px', color: '#94a3b8' }}>COCO Stores (MTD)</span>
            </div>

            <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '10px', padding: '12px' }}>
              <span style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase' }}>{platform} Rating</span>
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#f59e0b', margin: '4px 0 2px' }}>
                {opsData?.performance?.overall?.currRating || '3.74'} ★
              </div>
              <span style={{ fontSize: '9px', color: '#10b981' }}>{cLabel} Live</span>
            </div>

            <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '10px', padding: '12px' }}>
              <span style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase' }}>Avg KPT</span>
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff', margin: '4px 0 2px' }}>6.4 mins</div>
              <span style={{ fontSize: '9px', color: '#10b981' }}>&lt; 7m Target</span>
            </div>

            <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '10px', padding: '12px' }}>
              <span style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase' }}>Avg O2D</span>
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff', margin: '4px 0 2px' }}>22.8 mins</div>
              <span style={{ fontSize: '9px', color: '#64748b' }}>Doorstep delivery</span>
            </div>

            <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '10px', padding: '12px' }}>
              <span style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase' }}>Food Cost %</span>
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff', margin: '4px 0 2px' }}>27.6%</div>
              <span style={{ fontSize: '9px', color: '#10b981' }}>-0.4% vs Budget</span>
            </div>
          </div>

          {/* Operations Slicers Row */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', backgroundColor: '#0f172a', padding: '10px', borderRadius: '10px', border: '1px solid #1f293d', marginBottom: '14px' }}>
            <div style={{ flex: '1 1 100px' }}>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                style={{ width: '100%', backgroundColor: '#1e293b', color: '#ffffff', border: '1px solid #334155', borderRadius: '6px', padding: '6px', fontSize: '11px' }}
              >
                <option value="ALL">All Brands</option>
                {opsData?.slicers?.brands?.map((b: string) => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>

            <div style={{ flex: '1 1 100px' }}>
              <select
                value={selectedRegion}
                onChange={(e) => {
                  setSelectedRegion(e.target.value);
                  setSelectedStore('ALL');
                }}
                style={{ width: '100%', backgroundColor: '#1e293b', color: '#ffffff', border: '1px solid #334155', borderRadius: '6px', padding: '6px', fontSize: '11px' }}
              >
                <option value="ALL">All Regions</option>
                {opsData?.slicers?.regions?.map((r: string) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            <div style={{ flex: '1 1 130px' }}>
              <select
                value={selectedStore}
                onChange={(e) => setSelectedStore(e.target.value)}
                style={{ width: '100%', backgroundColor: '#1e293b', color: '#ffffff', border: '1px solid #334155', borderRadius: '6px', padding: '6px', fontSize: '11px' }}
              >
                <option value="ALL">All Stores</option>
                {availableStores.map((s: string) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* Operations Performance Table */}
          {opsLoading ? (
            <div style={{ padding: '30px', textAlign: 'center', color: '#64748b', fontSize: '12px' }}>Loading operational matrix...</div>
          ) : (
            <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', border: '1px solid #1f293d', borderRadius: '8px', marginBottom: '16px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '780px' }}>
                <thead>
                  <tr style={{ fontSize: '10px', textTransform: 'uppercase' }}>
                    <th style={{ backgroundColor: '#0f172a', color: '#94a3b8', padding: '8px', border: '1px solid #1f293d' }}>Dimension</th>
                    <th colSpan={3} style={{ backgroundColor: '#ea580c', color: '#ffffff', padding: '6px', border: '1px solid #1f293d' }}>
                      {platform} Ratings
                    </th>
                    <th colSpan={5} style={{ backgroundColor: '#4c1d95', color: '#ffffff', padding: '6px', border: '1px solid #1f293d' }}>
                      {pLabel} Stars (1-5)
                    </th>
                    <th colSpan={5} style={{ backgroundColor: '#581c87', color: '#ffffff', padding: '6px', border: '1px solid #1f293d' }}>
                      {cLabel} Stars (1-5)
                    </th>
                    <th colSpan={3} style={{ backgroundColor: '#9a3412', color: '#ffffff', padding: '6px', border: '1px solid #1f293d' }}>
                      Rated Orders ({platform === 'Swiggy' ? 'Col O = 1' : 'Col M = 1'})
                    </th>
                    <th colSpan={3} style={{ backgroundColor: '#ca8a04', color: '#ffffff', padding: '6px', border: '1px solid #1f293d' }}>
                      Rated Issues Orders
                    </th>
                  </tr>

                  <tr style={{ backgroundColor: '#131c2e', color: '#cbd5e1', fontSize: '9px', borderBottom: '2px solid #334155' }}>
                    <th style={{ padding: '6px 10px', textAlign: 'left' }}>Brand / Region</th>
                    <th style={{ padding: '4px', textAlign: 'center' }}>{pLabel}</th>
                    <th style={{ padding: '4px', textAlign: 'center' }}>{cLabel}</th>
                    <th style={{ padding: '4px', textAlign: 'center' }}>%</th>

                    {[1, 2, 3, 4, 5].map((s) => (
                      <th key={`ps-${s}`} style={{ padding: '4px 3px', textAlign: 'center' }}>{s}</th>
                    ))}

                    {[1, 2, 3, 4, 5].map((s) => (
                      <th key={`cs-${s}`} style={{ padding: '4px 3px', textAlign: 'center' }}>{s}</th>
                    ))}

                    <th style={{ padding: '4px', textAlign: 'center' }}>{pLabel}</th>
                    <th style={{ padding: '4px', textAlign: 'center' }}>{cLabel}</th>
                    <th style={{ padding: '4px', textAlign: 'center' }}>%</th>

                    <th style={{ padding: '4px', textAlign: 'center' }}>{pLabel}</th>
                    <th style={{ padding: '4px', textAlign: 'center' }}>{cLabel}</th>
                    <th style={{ padding: '4px', textAlign: 'center' }}>%</th>
                  </tr>
                </thead>
                <tbody>
                  {opsData?.performance?.overall && (
                    <tr style={{ borderBottom: '1px solid #1f293d', backgroundColor: '#131c2e', fontSize: '11px', fontWeight: 600 }}>
                      <td style={{ padding: '8px 10px', color: '#ffffff' }}>Average</td>
                      <td style={{ padding: '6px 4px', textAlign: 'center', backgroundColor: '#1e3a8a', color: '#93c5fd' }}>{opsData.performance.overall.prevRating}</td>
                      <td style={{ padding: '6px 4px', textAlign: 'center', backgroundColor: '#2563eb', color: '#ffffff' }}>{opsData.performance.overall.currRating}</td>
                      <td style={{ padding: '6px 4px', textAlign: 'center', color: parseFloat(opsData.performance.overall.ratingDiff) < 0 ? '#f87171' : '#34d399' }}>{opsData.performance.overall.ratingDiff}</td>
                      {[1, 2, 3, 4, 5].map((s) => <td key={`p-${s}`} style={{ padding: '6px 3px', textAlign: 'center', color: '#cbd5e1' }}>{opsData.performance.overall.prevStars[s]}</td>)}
                      {[1, 2, 3, 4, 5].map((s) => <td key={`c-${s}`} style={{ padding: '6px 3px', textAlign: 'center', color: '#f3e8ff' }}>{opsData.performance.overall.currStars[s]}</td>)}
                      <td style={{ padding: '6px 4px', textAlign: 'center' }}>{opsData.performance.overall.prevRatedOrders?.toLocaleString()}</td>
                      <td style={{ padding: '6px 4px', textAlign: 'center', color: '#ffffff', fontWeight: 700 }}>{opsData.performance.overall.currRatedOrders?.toLocaleString()}</td>
                      <td style={{ padding: '6px 4px', textAlign: 'center', color: '#34d399' }}>{opsData.performance.overall.ratedOrdersPct}</td>
                      <td style={{ padding: '6px 4px', textAlign: 'center' }}>{opsData.performance.overall.prevIssueOrders?.toLocaleString()}</td>
                      <td style={{ padding: '6px 4px', textAlign: 'center', color: '#ffffff', fontWeight: 700 }}>{opsData.performance.overall.currIssueOrders?.toLocaleString()}</td>
                      <td style={{ padding: '6px 4px', textAlign: 'center', color: '#34d399' }}>{opsData.performance.overall.issueOrdersPct}</td>
                    </tr>
                  )}

                  {/* Brand Breakdown */}
                  <tr style={{ backgroundColor: '#090d16' }}>
                    <td colSpan={20} style={{ padding: '6px 10px', fontSize: '10px', fontWeight: 700, color: '#f59e0b', textTransform: 'uppercase' }}>
                      Brand Breakdown
                    </td>
                  </tr>
                  {opsData?.performance?.brands?.map((b: any) => (
                    <tr key={b.name} style={{ borderBottom: '1px solid #1f293d', backgroundColor: '#131c2e', fontSize: '11px' }}>
                      <td style={{ padding: '8px 10px', color: '#ffffff' }}>{b.name}</td>
                      <td style={{ padding: '6px 4px', textAlign: 'center', backgroundColor: '#1e3a8a', color: '#93c5fd' }}>{b.prevRating}</td>
                      <td style={{ padding: '6px 4px', textAlign: 'center', backgroundColor: '#2563eb', color: '#ffffff' }}>{b.currRating}</td>
                      <td style={{ padding: '6px 4px', textAlign: 'center', color: parseFloat(b.ratingDiff) < 0 ? '#f87171' : '#34d399' }}>{b.ratingDiff}</td>
                      {[1, 2, 3, 4, 5].map((s) => <td key={`p-${s}`} style={{ padding: '6px 3px', textAlign: 'center', color: '#cbd5e1' }}>{b.prevStars[s]}</td>)}
                      {[1, 2, 3, 4, 5].map((s) => <td key={`c-${s}`} style={{ padding: '6px 3px', textAlign: 'center', color: '#f3e8ff' }}>{b.currStars[s]}</td>)}
                      <td style={{ padding: '6px 4px', textAlign: 'center' }}>{b.prevRatedOrders?.toLocaleString()}</td>
                      <td style={{ padding: '6px 4px', textAlign: 'center', color: '#ffffff', fontWeight: 700 }}>{b.currRatedOrders?.toLocaleString()}</td>
                      <td style={{ padding: '6px 4px', textAlign: 'center', color: parseFloat(b.ratedOrdersPct) >= 0 ? '#34d399' : '#f87171' }}>{b.ratedOrdersPct}</td>
                      <td style={{ padding: '6px 4px', textAlign: 'center' }}>{b.prevIssueOrders?.toLocaleString()}</td>
                      <td style={{ padding: '6px 4px', textAlign: 'center', color: '#ffffff', fontWeight: 700 }}>{b.currIssueOrders?.toLocaleString()}</td>
                      <td style={{ padding: '6px 4px', textAlign: 'center', color: '#34d399' }}>{b.issueOrdersPct}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Conditional Modules for Swiggy & Zomato (Hidden for Google) */}
          {platform !== 'Google' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '14px', marginBottom: '16px' }}>
              
              {/* Issue Type Breakup by Brand */}
              <div style={{ backgroundColor: '#0f172a', border: '1px solid #1f293d', borderRadius: '10px', padding: '14px' }}>
                <h3 style={{ margin: '0 0 10px', fontSize: '12px', color: '#f87171', textTransform: 'uppercase' }}>
                  {platform} Issue Breakup by Brand ({pLabel} vs {cLabel})
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {opsData?.brandIssues &&
                    Object.entries(opsData.brandIssues).map(([brandName, issues]: any) => (
                      <div key={brandName} style={{ backgroundColor: '#131c2e', borderRadius: '8px', padding: '8px', border: '1px solid #1f293d' }}>
                        <div style={{ fontSize: '11px', fontWeight: 700, color: '#f59e0b', marginBottom: '4px', textTransform: 'uppercase' }}>
                          {brandName}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          {Object.entries(issues).map(([issueKey, cnt]: any) => {
                            const diffPct = cnt.prev > 0 ? (((cnt.curr - cnt.prev) / cnt.prev) * 100).toFixed(1) : '0';
                            return (
                              <div key={issueKey} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10px' }}>
                                <span style={{ color: '#cbd5e1' }}>{issueKey}</span>
                                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                                  <span style={{ color: '#94a3b8' }}>{pLabel}: {cnt.prev}</span>
                                  <span style={{ color: '#ffffff', fontWeight: 700 }}>{cLabel}: {cnt.curr}</span>
                                  <span style={{ color: parseFloat(diffPct) > 0 ? '#f87171' : '#34d399', fontWeight: 700 }}>
                                    {diffPct}%
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Category Ranking Sorted Top to Bottom */}
              <div style={{ backgroundColor: '#0f172a', border: '1px solid #1f293d', borderRadius: '10px', padding: '14px' }}>
                <h3 style={{ margin: '0 0 10px', fontSize: '12px', color: '#38bdf8', textTransform: 'uppercase' }}>
                  Category Ranking (Sorted Top Rating to Bottom)
                </h3>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10px' }}>
                    <thead>
                      <tr style={{ color: '#94a3b8', borderBottom: '1px solid #1f293d', textAlign: 'left' }}>
                        <th style={{ padding: '6px 4px' }}>Category</th>
                        <th style={{ padding: '6px 4px', textAlign: 'center' }}>Rating</th>
                        <th style={{ padding: '6px 4px', textAlign: 'center' }}>{pLabel} Issues</th>
                        <th style={{ padding: '6px 4px', textAlign: 'center' }}>{cLabel} Issues</th>
                        <th style={{ padding: '6px 4px', textAlign: 'center' }}>% Chg</th>
                      </tr>
                    </thead>
                    <tbody>
                      {opsData?.categoryPerformance?.map((cat: any) => (
                        <tr key={cat.category} style={{ borderBottom: '1px solid #131c2e' }}>
                          <td style={{ padding: '6px 4px', fontWeight: 600, color: '#ffffff' }}>{cat.category}</td>
                          <td style={{ padding: '6px 4px', textAlign: 'center', color: '#f59e0b', fontWeight: 700 }}>{cat.currRating} ★</td>
                          <td style={{ padding: '6px 4px', textAlign: 'center', color: '#cbd5e1' }}>{cat.prevIssues}</td>
                          <td style={{ padding: '6px 4px', textAlign: 'center', color: '#ffffff', fontWeight: 700 }}>{cat.currIssues}</td>
                          <td style={{ padding: '6px 4px', textAlign: 'center', color: parseFloat(cat.issueDiff) <= 0 ? '#34d399' : '#f87171', fontWeight: 700 }}>{cat.issueDiff}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* Customer Comments with Star Slicer */}
          <div style={{ backgroundColor: '#0f172a', border: '1px solid #1f293d', borderRadius: '10px', padding: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '12px', color: '#f59e0b', textTransform: 'uppercase' }}>
                  Customer Comments & Feedback ({cLabel})
                </h3>
                <span style={{ fontSize: '10px', color: '#94a3b8' }}>Verified customer feedback with ratings</span>
              </div>

              <div style={{ display: 'flex', gap: '4px', backgroundColor: '#131c2e', padding: '3px', borderRadius: '6px' }}>
                {(['ALL', 5, 4, 3, 2, 1] as const).map((star) => (
                  <button
                    key={star}
                    onClick={() => setCommentStarFilter(star)}
                    style={{
                      backgroundColor: commentStarFilter === star ? '#f59e0b' : 'transparent',
                      color: commentStarFilter === star ? '#000000' : '#cbd5e1',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '3px 8px',
                      fontSize: '10px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    {star === 'ALL' ? 'All' : `${star}★`}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '8px' }}>
              {filteredComments.length > 0 ? (
                filteredComments.map((rev: any, idx: number) => (
                  <div
                    key={idx}
                    style={{
                      backgroundColor: '#131c2e',
                      border: '1px solid #1f293d',
                      borderRadius: '8px',
                      padding: '10px 12px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: '6px',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <span style={{ fontWeight: 700, fontSize: '11px', color: '#ffffff' }}>{rev.store}</span>
                        <span
                          style={{
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontSize: '10px',
                            fontWeight: 700,
                            backgroundColor: rev.rating >= 4 ? 'rgba(16, 185, 129, 0.15)' : rev.rating === 3 ? 'rgba(245, 158, 11, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                            color: rev.rating >= 4 ? '#34d399' : rev.rating === 3 ? '#f59e0b' : '#f87171',
                            border: rev.rating >= 4 ? '1px solid rgba(16, 185, 129, 0.3)' : rev.rating === 3 ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
                          }}
                        >
                          {rev.rating} ★
                        </span>
                      </div>
                      <p style={{ margin: 0, fontSize: '11px', color: '#cbd5e1', lineHeight: '1.4' }}>"{rev.comment}"</p>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(31, 41, 61, 0.5)', paddingTop: '4px', fontSize: '9px', color: '#64748b' }}>
                      <span style={{ color: '#f87171' }}>{rev.issue}</span>
                      <span>{rev.date}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ padding: '16px', color: '#64748b', fontSize: '11px', gridColumn: '1 / -1', textAlign: 'center' }}>
                  No customer comments recorded for the selected rating.
                </div>
              )}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
