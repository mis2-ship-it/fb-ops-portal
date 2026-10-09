'use client';
import React, { useState, useEffect } from 'react';

type Platform = 'Google' | 'Swiggy' | 'Zomato';
type ChartGranularity = 'day' | 'week' | 'month';

export default function Home() {
  const [platform, setPlatform] = useState<Platform>('Zomato');
  const [selectedBrand, setSelectedBrand] = useState('ALL');
  const [selectedRegion, setSelectedRegion] = useState('ALL');
  const [selectedStore, setSelectedStore] = useState('ALL');
  const [granularity, setGranularity] = useState<ChartGranularity>('day');
  const [data, setData] = useState<any>(null);
  const [googleRating, setGoogleRating] = useState('4.24');
  const [loading, setLoading] = useState(true);

  // Fetch Google Rating once for top KPI
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

  // Fetch dashboard data
  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({
      platform: platform.toLowerCase(),
      brand: selectedBrand,
      region: selectedRegion,
      store: selectedStore,
    });
    fetch(`/api/ratings?${params.toString()}`)
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [platform, selectedBrand, selectedRegion, selectedStore]);

  // Dynamic Store List based on Region Selection
  const availableStores = React.useMemo(() => {
    if (!data?.slicers?.regionStores) return [];
    if (selectedRegion === 'ALL') {
      const all: string[] = [];
      Object.values(data.slicers.regionStores as Record<string, string[]>).forEach((list) => {
        list.forEach((st) => {
          if (!all.includes(st)) all.push(st);
        });
      });
      return all.sort();
    }
    return (data.slicers.regionStores[selectedRegion] || []).sort();
  }, [data, selectedRegion]);

  const handleRegionChange = (newReg: string) => {
    setSelectedRegion(newReg);
    setSelectedStore('ALL');
  };

  const pLabel = data?.previousLabel || 'Sep-26';
  const cLabel = data?.currentLabel || 'Oct-26';
  const chartPoints = data?.chartData?.[granularity] || [];

  const renderSvgLineChart = () => {
    if (!chartPoints || chartPoints.length === 0) {
      return <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>No trend data available</div>;
    }
    const width = 850;
    const height = 180;
    const padding = 45;
    const ratings = chartPoints.map((p: any) => parseFloat(p.rating));
    const minR = Math.max(1, Math.min(...ratings) - 0.25);
    const maxR = Math.min(5, Math.max(...ratings) + 0.25);

    const getX = (idx: number) => padding + (idx * (width - 2 * padding)) / Math.max(1, chartPoints.length - 1);
    const getY = (val: number) => height - padding - ((val - minR) / (maxR - minR || 1)) * (height - 2 * padding);

    const pointsStr = chartPoints.map((p: any, idx: number) => `${getX(idx)},${getY(parseFloat(p.rating))}`).join(' ');

    return (
      <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: '200px', overflow: 'visible' }}>
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#1f293d" strokeWidth="1" />
        <polyline fill="none" stroke="#f59e0b" strokeWidth="3" points={pointsStr} />
        {chartPoints.map((p: any, idx: number) => {
          const cx = getX(idx);
          const cy = getY(parseFloat(p.rating));
          return (
            <g key={idx}>
              <circle cx={cx} cy={cy} r="5" fill="#f59e0b" stroke="#090d16" strokeWidth="2" />
              <text x={cx} y={cy - 10} fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">
                {p.rating} ★
              </text>
              <text x={cx} y={height - padding + 18} fill="#94a3b8" fontSize="10" textAnchor="middle">
                {p.label}
              </text>
            </g>
          );
        })}
      </svg>
    );
  };

  const renderDataRow = (row: any, isSubRow = false) => {
    const isNeg = parseFloat(row.ratingDiff || '0') < 0;
    const isOrderPos = parseFloat(row.ratedOrdersPct || '0') >= 0;
    const isIssuePos = parseFloat(row.issueOrdersPct || '0') <= 0;

    return (
      <tr
        key={row.name}
        style={{
          borderBottom: '1px solid #1f293d',
          backgroundColor: isSubRow ? '#0e1524' : '#131c2e',
          fontSize: '11px',
          fontWeight: isSubRow ? 400 : 600,
        }}
      >
        <td style={{ padding: '8px 12px', color: isSubRow ? '#94a3b8' : '#ffffff', paddingLeft: isSubRow ? '28px' : '12px' }}>
          {row.name}
        </td>
        <td style={{ padding: '8px 6px', textAlign: 'center', backgroundColor: '#1e3a8a', color: '#93c5fd', fontWeight: 700 }}>{row.prevRating}</td>
        <td style={{ padding: '8px 6px', textAlign: 'center', backgroundColor: '#2563eb', color: '#ffffff', fontWeight: 700 }}>{row.currRating}</td>
        <td style={{ padding: '8px 6px', textAlign: 'center', color: isNeg ? '#f87171' : '#34d399', fontWeight: 700, backgroundColor: isNeg ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)' }}>
          {row.ratingDiff}
        </td>

        {[1, 2, 3, 4, 5].map((s) => (
          <td key={`ps-${s}`} style={{ padding: '8px 4px', textAlign: 'center', color: '#cbd5e1', backgroundColor: '#1a102f' }}>
            {row.prevStars ? row.prevStars[s] : '0%'}
          </td>
        ))}

        {[1, 2, 3, 4, 5].map((s) => (
          <td key={`cs-${s}`} style={{ padding: '8px 4px', textAlign: 'center', color: '#f3e8ff', backgroundColor: '#2e1065', fontWeight: s === 5 ? 700 : 400 }}>
            {row.currStars ? row.currStars[s] : '0%'}
          </td>
        ))}

        <td style={{ padding: '8px 6px', textAlign: 'center', color: '#cbd5e1' }}>{row.prevRatedOrders?.toLocaleString()}</td>
        <td style={{ padding: '8px 6px', textAlign: 'center', color: '#ffffff', fontWeight: 700 }}>{row.currRatedOrders?.toLocaleString()}</td>
        <td style={{ padding: '8px 6px', textAlign: 'center', color: isOrderPos ? '#34d399' : '#f87171', fontWeight: 700 }}>
          {row.ratedOrdersPct}
        </td>

        <td style={{ padding: '8px 6px', textAlign: 'center', color: '#cbd5e1' }}>{row.prevIssueOrders?.toLocaleString()}</td>
        <td style={{ padding: '8px 6px', textAlign: 'center', color: '#ffffff', fontWeight: 700 }}>{row.currIssueOrders?.toLocaleString()}</td>
        <td style={{ padding: '8px 6px', textAlign: 'center', color: isIssuePos ? '#34d399' : '#f87171', fontWeight: 700, backgroundColor: isIssuePos ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)' }}>
          {row.issueOrdersPct}
        </td>
      </tr>
    );
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#070b12', color: '#f3f4f6', fontFamily: 'system-ui, -apple-system, sans-serif', padding: '24px' }}>
      
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1f293d', paddingBottom: '16px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 800, color: '#ffffff' }}>Frozen Bottle Operations Hub</h1>
          <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#94a3b8' }}>
            Store Performance • Previous ({pLabel}) vs Current ({cLabel})
          </p>
        </div>

        {/* Platform Slicer */}
        <div style={{ display: 'flex', backgroundColor: '#0f172a', padding: '4px', borderRadius: '10px', border: '1px solid #1f293d' }}>
          {(['Google', 'Swiggy', 'Zomato'] as Platform[]).map((p) => (
            <button
              key={p}
              onClick={() => setPlatform(p)}
              style={{
                backgroundColor: platform === p ? '#ea580c' : 'transparent',
                color: platform === p ? '#ffffff' : '#94a3b8',
                border: 'none',
                borderRadius: '8px',
                padding: '6px 16px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Top Operations KPI Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', margin: '20px 0' }}>
        <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '12px', padding: '16px' }}>
          <span style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Net Sales</span>
          <div style={{ fontSize: '22px', fontWeight: 700, color: '#ffffff', margin: '6px 0 2px' }}>₹ 14,82,400</div>
          <span style={{ fontSize: '11px', color: '#64748b' }}>POS + Aggregators</span>
        </div>

        <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '12px', padding: '16px' }}>
          <span style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Google Rating</span>
          <div style={{ fontSize: '22px', fontWeight: 700, color: '#38bdf8', margin: '6px 0 2px' }}>
            {googleRating} ★
          </div>
          <span style={{ fontSize: '11px', color: '#94a3b8' }}>COCO Stores (MTD)</span>
        </div>

        <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '12px', padding: '16px' }}>
          <span style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{platform} Rating</span>
          <div style={{ fontSize: '22px', fontWeight: 700, color: '#f59e0b', margin: '6px 0 2px' }}>
            {data?.performance?.overall?.currRating || '3.74'} ★
          </div>
          <span style={{ fontSize: '11px', color: '#10b981' }}>{cLabel} Live</span>
        </div>

        <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '12px', padding: '16px' }}>
          <span style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Avg KPT</span>
          <div style={{ fontSize: '22px', fontWeight: 700, color: '#ffffff', margin: '6px 0 2px' }}>6.4 mins</div>
          <span style={{ fontSize: '11px', color: '#10b981' }}>&lt; 7m SLA Target</span>
        </div>

        <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '12px', padding: '16px' }}>
          <span style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Avg O2D</span>
          <div style={{ fontSize: '22px', fontWeight: 700, color: '#ffffff', margin: '6px 0 2px' }}>22.8 mins</div>
          <span style={{ fontSize: '11px', color: '#64748b' }}>Doorstep delivery</span>
        </div>

        <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '12px', padding: '16px' }}>
          <span style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Food Cost %</span>
          <div style={{ fontSize: '22px', fontWeight: 700, color: '#ffffff', margin: '6px 0 2px' }}>27.6%</div>
          <span style={{ fontSize: '11px', color: '#10b981' }}>-0.4% vs Budget</span>
        </div>
      </div>

      {/* Slicers Row: Brand, Region, Cascading Store */}
      <div style={{ display: 'flex', gap: '12px', marginTop: '16px', flexWrap: 'wrap', backgroundColor: '#0f172a', padding: '12px 16px', borderRadius: '12px', border: '1px solid #1f293d' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Brand:</span>
          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            style={{ backgroundColor: '#1e293b', color: '#ffffff', border: '1px solid #334155', borderRadius: '6px', padding: '4px 8px', fontSize: '12px' }}
          >
            <option value="ALL">All Brands</option>
            {data?.slicers?.brands?.map((b: string) => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Region:</span>
          <select
            value={selectedRegion}
            onChange={(e) => handleRegionChange(e.target.value)}
            style={{ backgroundColor: '#1e293b', color: '#ffffff', border: '1px solid #334155', borderRadius: '6px', padding: '4px 8px', fontSize: '12px' }}
          >
            <option value="ALL">All Regions</option>
            {data?.slicers?.regions?.map((r: string) => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Store:</span>
          <select
            value={selectedStore}
            onChange={(e) => setSelectedStore(e.target.value)}
            style={{ backgroundColor: '#1e293b', color: '#ffffff', border: '1px solid #334155', borderRadius: '6px', padding: '4px 8px', fontSize: '12px', maxWidth: '240px' }}
          >
            <option value="ALL">All Stores {selectedRegion !== 'ALL' ? `(${selectedRegion})` : ''}</option>
            {availableStores.map((s: string) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Rating Trend Line Chart */}
      <div style={{ marginTop: '20px', backgroundColor: '#0f172a', border: '1px solid #1f293d', borderRadius: '12px', padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {platform} Rating Trend
            </h2>
            <span style={{ fontSize: '11px', color: '#94a3b8' }}>Dynamic trend based on selected slicers</span>
          </div>

          <div style={{ display: 'flex', backgroundColor: '#1e293b', padding: '2px', borderRadius: '8px' }}>
            {(['day', 'week', 'month'] as ChartGranularity[]).map((g) => (
              <button
                key={g}
                onClick={() => setGranularity(g)}
                style={{
                  backgroundColor: granularity === g ? '#f59e0b' : 'transparent',
                  color: granularity === g ? '#000000' : '#94a3b8',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '4px 12px',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                }}
              >
                {g === 'month' ? 'Last 6 Months' : g}
              </button>
            ))}
          </div>
        </div>

        {renderSvgLineChart()}
      </div>

      {/* Main Performance Comparison Table */}
      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Syncing store performance for {cLabel}...</div>
      ) : (
        <div style={{ marginTop: '20px', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #1f293d' }}>
            <thead>
              <tr style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                <th style={{ backgroundColor: '#0f172a', color: '#94a3b8', padding: '10px', border: '1px solid #1f293d' }}>Dimension</th>
                <th colSpan={3} style={{ backgroundColor: '#ea580c', color: '#ffffff', padding: '8px', border: '1px solid #1f293d' }}>
                  {platform} Ratings
                </th>
                <th colSpan={5} style={{ backgroundColor: '#4c1d95', color: '#ffffff', padding: '8px', border: '1px solid #1f293d' }}>
                  {pLabel} Stars (1-5)
                </th>
                <th colSpan={5} style={{ backgroundColor: '#581c87', color: '#ffffff', padding: '8px', border: '1px solid #1f293d' }}>
                  {cLabel} Stars (1-5)
                </th>
                <th colSpan={3} style={{ backgroundColor: '#9a3412', color: '#ffffff', padding: '8px', border: '1px solid #1f293d' }}>
                  Rated Orders ({platform === 'Swiggy' ? 'Col O = 1' : 'Col M = 1'})
                </th>
                <th colSpan={3} style={{ backgroundColor: '#ca8a04', color: '#ffffff', padding: '8px', border: '1px solid #1f293d' }}>
                  Rated Issues Orders
                </th>
              </tr>

              <tr style={{ backgroundColor: '#131c2e', color: '#cbd5e1', fontSize: '10px', borderBottom: '2px solid #334155' }}>
                <th style={{ padding: '6px 12px', textAlign: 'left' }}>Brand / Region</th>
                <th style={{ padding: '6px', textAlign: 'center' }}>{pLabel}</th>
                <th style={{ padding: '6px', textAlign: 'center' }}>{cLabel}</th>
                <th style={{ padding: '6px', textAlign: 'center' }}>%</th>

                {[1, 2, 3, 4, 5].map((s) => (
                  <th key={`ps-${s}`} style={{ padding: '6px 4px', textAlign: 'center' }}>{s}</th>
                ))}

                {[1, 2, 3, 4, 5].map((s) => (
                  <th key={`cs-${s}`} style={{ padding: '6px 4px', textAlign: 'center' }}>{s}</th>
                ))}

                <th style={{ padding: '6px', textAlign: 'center' }}>{pLabel}</th>
                <th style={{ padding: '6px', textAlign: 'center' }}>{cLabel}</th>
                <th style={{ padding: '6px', textAlign: 'center' }}>%</th>

                <th style={{ padding: '6px', textAlign: 'center' }}>{pLabel}</th>
                <th style={{ padding: '6px', textAlign: 'center' }}>{cLabel}</th>
                <th style={{ padding: '6px', textAlign: 'center' }}>%</th>
              </tr>
            </thead>
            <tbody>
              {data?.performance?.overall && renderDataRow(data.performance.overall)}

              <tr style={{ backgroundColor: '#090d16' }}>
                <td colSpan={20} style={{ padding: '6px 12px', fontSize: '11px', fontWeight: 700, color: '#f59e0b', textTransform: 'uppercase' }}>
                  Brand Breakdown
                </td>
              </tr>
              {data?.performance?.brands?.map((b: any) => renderDataRow(b))}

              <tr style={{ backgroundColor: '#090d16' }}>
                <td colSpan={20} style={{ padding: '6px 12px', fontSize: '11px', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase' }}>
                  Region Breakdown
                </td>
              </tr>
              {data?.performance?.regions?.map((rGroup: any) => (
                <React.Fragment key={rGroup.region.name}>
                  {renderDataRow(rGroup.region)}
                  {rGroup.brandBreakdown?.map((b: any) => renderDataRow(b, true))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* NEW: Issue Breakup Analysis & Category Performance */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px', marginTop: '28px' }}>
        
        {/* Issue Breakup Cards */}
        <div style={{ backgroundColor: '#0f172a', border: '1px solid #1f293d', borderRadius: '12px', padding: '20px' }}>
          <h3 style={{ margin: '0 0 14px', fontSize: '13px', color: '#f87171', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {platform} Issue Type Breakup ({pLabel} vs {cLabel})
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {data?.issueBreakup?.map((item: any) => {
              const isInc = parseFloat(item.diffPct) > 0;
              return (
                <div key={item.issue} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#131c2e', padding: '10px 14px', borderRadius: '8px', border: '1px solid #1f293d' }}>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#ffffff' }}>{item.issue}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '11px' }}>
                    <span style={{ color: '#94a3b8' }}>{pLabel}: <strong style={{ color: '#cbd5e1' }}>{item.prev}</strong></span>
                    <span style={{ color: '#94a3b8' }}>{cLabel}: <strong style={{ color: '#ffffff' }}>{item.curr}</strong></span>
                    <span style={{ color: isInc ? '#f87171' : '#34d399', fontWeight: 700, backgroundColor: isInc ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)', padding: '2px 6px', borderRadius: '4px' }}>
                      {item.diffPct}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category-Wise Performance */}
        <div style={{ backgroundColor: '#0f172a', border: '1px solid #1f293d', borderRadius: '12px', padding: '20px' }}>
          <h3 style={{ margin: '0 0 14px', fontSize: '13px', color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Top Category Issue Performance ({cLabel})
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {data?.categoryPerformance?.map((cat: any) => (
              <div key={cat.category} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#131c2e', padding: '10px 14px', borderRadius: '8px', border: '1px solid #1f293d' }}>
                <div>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#ffffff', display: 'block' }}>{cat.category}</span>
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>Avg Rating: <strong style={{ color: '#f59e0b' }}>{cat.currRating} ★</strong></span>
                </div>
                <div style={{ textAlign: 'right', fontSize: '11px' }}>
                  <span style={{ color: '#f87171', fontWeight: 700, display: 'block' }}>{cat.currIssues} Issues</span>
                  <span style={{ color: '#64748b' }}>Rate: {cat.issueRate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* NEW: Latest Customer Comments with Verified Ratings */}
      <div style={{ marginTop: '28px', backgroundColor: '#0f172a', border: '1px solid #1f293d', borderRadius: '12px', padding: '20px' }}>
        <h3 style={{ margin: '0 0 16px', fontSize: '13px', color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Recent Customer Feedback with Exact Ratings ({platform} • {cLabel})
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '12px' }}>
          {data?.recentComments?.length > 0 ? (
            data.recentComments.map((rev: any, idx: number) => (
              <div
                key={idx}
                style={{
                  backgroundColor: '#131c2e',
                  border: '1px solid #1f293d',
                  borderRadius: '10px',
                  padding: '14px 16px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '8px',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontWeight: 700, fontSize: '13px', color: '#ffffff' }}>{rev.store}</span>
                    <span
                      style={{
                        padding: '3px 8px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 700,
                        backgroundColor: rev.rating >= 4 ? 'rgba(16, 185, 129, 0.15)' : rev.rating === 3 ? 'rgba(245, 158, 11, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                        color: rev.rating >= 4 ? '#34d399' : rev.rating === 3 ? '#f59e0b' : '#f87171',
                        border: rev.rating >= 4 ? '1px solid rgba(16, 185, 129, 0.3)' : rev.rating === 3 ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
                      }}
                    >
                      {rev.rating} ★
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: '12px', color: '#cbd5e1', lineHeight: '1.4' }}>"{rev.comment}"</p>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(31, 41, 61, 0.5)', paddingTop: '6px', fontSize: '10px', color: '#64748b' }}>
                  <span style={{ color: '#f87171' }}>{rev.issue}</span>
                  <span>{rev.date}</span>
                </div>
              </div>
            ))
          ) : (
            <div style={{ padding: '16px', color: '#64748b', fontSize: '13px' }}>No written customer feedback recorded for this period.</div>
          )}
        </div>
      </div>

    </div>
  );
}
