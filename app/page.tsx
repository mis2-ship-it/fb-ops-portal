'use client';
import React, { useState, useEffect } from 'react';

type Platform = 'Google' | 'Swiggy' | 'Zomato';

export default function Home() {
  const [platform, setPlatform] = useState<Platform>('Zomato');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/ratings?platform=${platform.toLowerCase()}`)
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [platform]);

  const pLabel = data?.previousLabel || 'Sep-26';
  const cLabel = data?.currentLabel || 'Oct-26';

  const renderDataRow = (row: any, isSubRow = false) => {
    const isNeg = parseFloat(row.ratingDiff) < 0;
    const isOrderPos = parseFloat(row.ratedOrdersPct) >= 0;
    const isIssuePos = parseFloat(row.issueOrdersPct) <= 0; // Negative issues = positive outcome

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

        {/* Ratings Comparison */}
        <td style={{ padding: '8px 6px', textAlign: 'center', backgroundColor: '#1e3a8a', color: '#93c5fd', fontWeight: 700 }}>{row.prevRating}</td>
        <td style={{ padding: '8px 6px', textAlign: 'center', backgroundColor: '#2563eb', color: '#ffffff', fontWeight: 700 }}>{row.currRating}</td>
        <td style={{ padding: '8px 6px', textAlign: 'center', color: isNeg ? '#f87171' : '#34d399', fontWeight: 700, backgroundColor: isNeg ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)' }}>
          {row.ratingDiff}
        </td>

        {/* Previous Star Share */}
        {[1, 2, 3, 4, 5].map((s) => (
          <td key={`p-${s}`} style={{ padding: '8px 4px', textAlign: 'center', color: '#cbd5e1', backgroundColor: '#1a102f' }}>
            {row.prevStars[s]}
          </td>
        ))}

        {/* Current Star Share */}
        {[1, 2, 3, 4, 5].map((s) => (
          <td key={`c-${s}`} style={{ padding: '8px 4px', textAlign: 'center', color: '#f3e8ff', backgroundColor: '#2e1065', fontWeight: s === 5 ? 700 : 400 }}>
            {row.currStars[s]}
          </td>
        ))}

        {/* Rated Orders (Col O / M == 1) */}
        <td style={{ padding: '8px 6px', textAlign: 'center', color: '#cbd5e1' }}>{row.prevRatedOrders?.toLocaleString()}</td>
        <td style={{ padding: '8px 6px', textAlign: 'center', color: '#ffffff', fontWeight: 700 }}>{row.currRatedOrders?.toLocaleString()}</td>
        <td style={{ padding: '8px 6px', textAlign: 'center', color: isOrderPos ? '#34d399' : '#f87171', fontWeight: 700 }}>
          {row.ratedOrdersPct}
        </td>

        {/* Rated Issues Orders */}
        <td style={{ padding: '8px 6px', textAlign: 'center', color: '#cbd5e1' }}>{row.prevIssueOrders?.toLocaleString()}</td>
        <td style={{ padding: '8px 6px', textAlign: 'center', color: '#ffffff', fontWeight: 700 }}>{row.currIssueOrders?.toLocaleString()}</td>
        <td style={{ padding: '8px 6px', textAlign: 'center', color: isIssuePos ? '#34d399' : '#f87171', fontWeight: 700, backgroundColor: isIssuePos ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)' }}>
          {row.issueOrdersPct}
        </td>
      </tr>
    );
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#070b12', color: '#f3f4f6', fontFamily: 'system-ui, -apple-system, sans-serif', padding: '24px' }}>
      {/* Header & Platform Slicer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1f293d', paddingBottom: '16px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 700, color: '#ffffff' }}>Frozen Bottle Operations Hub</h1>
          <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#94a3b8' }}>
            Store Performance Comparison • Previous ({pLabel}) vs Current ({cLabel})
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

      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Processing COCO store matrices from Google Sheets...</div>
      ) : (
        <div style={{ marginTop: '20px', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #1f293d' }}>
            <thead>
              {/* Main Header Blocks */}
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
                  Rated Orders ({platform === 'swiggy' ? 'Col O = 1' : 'Col M = 1'})
                </th>
                <th colSpan={3} style={{ backgroundColor: '#ca8a04', color: '#ffffff', padding: '8px', border: '1px solid #1f293d' }}>
                  Rated Issues Orders
                </th>
              </tr>

              {/* Sub Columns */}
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
              {/* Overall Average */}
              {data?.average && renderDataRow(data.average)}

              {/* Brand Breakdown */}
              <tr style={{ backgroundColor: '#090d16' }}>
                <td colSpan={20} style={{ padding: '6px 12px', fontSize: '11px', fontWeight: 700, color: '#f59e0b', textTransform: 'uppercase' }}>
                  Brand Breakdown
                </td>
              </tr>
              {data?.brands?.map((b: any) => renderDataRow(b))}

              {/* Region & Brand Hierarchy */}
              <tr style={{ backgroundColor: '#090d16' }}>
                <td colSpan={20} style={{ padding: '6px 12px', fontSize: '11px', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase' }}>
                  Region Breakdown
                </td>
              </tr>
              {data?.regions?.map((rGroup: any) => (
                <React.Fragment key={rGroup.region.name}>
                  {renderDataRow(rGroup.region)}
                  {rGroup.brandBreakdown?.map((b: any) => renderDataRow(b, true))}
                </React.Fragment>
              ))}
            </tbody>
          </table>

          {/* Category-Level Issue Orders Section */}
          {data?.categoryIssues?.length > 0 && (
            <div style={{ marginTop: '32px', backgroundColor: '#131c2e', border: '1px solid #1f293d', borderRadius: '12px', padding: '20px' }}>
              <h3 style={{ margin: '0 0 14px', fontSize: '13px', color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Category-Wise Issue Analysis (Order Count Column)
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                {data.categoryIssues.map((cat: any) => {
                  const diff = cat.prev > 0 ? (((cat.curr - cat.prev) / cat.prev) * 100).toFixed(1) : '0.0';
                  return (
                    <div key={cat.category} style={{ backgroundColor: '#0f172a', border: '1px solid #1f293d', borderRadius: '8px', padding: '12px' }}>
                      <div style={{ fontWeight: 600, fontSize: '12px', color: '#ffffff' }}>{cat.category}</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px', fontSize: '11px' }}>
                        <span style={{ color: '#94a3b8' }}>{pLabel}: <strong style={{ color: '#ffffff' }}>{cat.prev}</strong></span>
                        <span style={{ color: '#94a3b8' }}>{cLabel}: <strong style={{ color: '#ffffff' }}>{cat.curr}</strong></span>
                        <span style={{ color: parseFloat(diff) <= 0 ? '#34d399' : '#f87171', fontWeight: 700 }}>{diff}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
