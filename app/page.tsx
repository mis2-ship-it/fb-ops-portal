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
  const [loading, setLoading] = useState(true);

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

  const pLabel = data?.previousLabel || 'Sep-26';
  const cLabel = data?.currentLabel || 'Oct-26';
  const chartPoints = data?.chartData?.[granularity] || [];

  // SVG Line Chart Coordinate Generator
  const renderSvgLineChart = () => {
    if (!chartPoints || chartPoints.length === 0) return null;
    const width = 800;
    const height = 180;
    const padding = 40;
    const ratings = chartPoints.map((p: any) => parseFloat(p.rating));
    const minR = Math.max(1, Math.min(...ratings) - 0.2);
    const maxR = Math.min(5, Math.max(...ratings) + 0.2);

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
      
      {/* Top Header & Platform Selector */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1f293d', paddingBottom: '16px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 800, color: '#ffffff' }}>Frozen Bottle Operations Hub</h1>
          <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#94a3b8' }}>
            Store Performance • Previous ({pLabel}) vs Current ({cLabel})
          </p>
        </div>

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

      {/* Slicers Row: Brand, Region, Store */}
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
            onChange={(e) => setSelectedRegion(e.target.value)}
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
            style={{ backgroundColor: '#1e293b', color: '#ffffff', border: '1px solid #334155', borderRadius: '6px', padding: '4px 8px', fontSize: '12px', maxWidth: '200px' }}
          >
            <option value="ALL">All Stores</option>
            {data?.slicers?.stores?.map((s: string) => <option key={s} value={s}>{s}</option>)}
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
                {g}
              </button>
            ))}
          </div>
        </div>

        {renderSvgLineChart()}
      </div>

      {/* Main Performance Table */}
      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Recalculating live store performance...</div>
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
    </div>
  );
}
