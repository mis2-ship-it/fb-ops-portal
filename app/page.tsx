'use client';
import React, { useState, useEffect } from 'react';

type Platform = 'Google' | 'Swiggy' | 'Zomato';
type TimePeriod = 'Yesterday' | 'LW' | 'L2W' | 'MTD' | 'LMTD' | 'Last 30 Days';

export default function Home() {
  const [platform, setPlatform] = useState<Platform>('Zomato');
  const [timeFilter, setTimeFilter] = useState<TimePeriod>('MTD');
  const [data, setData] = useState<any>(null);
  const [googleData, setGoogleData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fetch selected platform data
  useEffect(() => {
    setLoading(true);
    fetch(`/api/ratings?platform=${platform.toLowerCase()}&period=${encodeURIComponent(timeFilter.toLowerCase())}`)
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [platform, timeFilter]);

  // Fetch Google Ratings specifically for KPI header
  useEffect(() => {
    fetch(`/api/ratings?platform=google&period=mtd`)
      .then((res) => res.json())
      .then((json) => setGoogleData(json))
      .catch(() => {});
  }, []);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#090d16', color: '#f8fafc', fontFamily: 'system-ui, -apple-system, sans-serif', padding: '28px', boxSizing: 'border-box' }}>
      
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1e293b', paddingBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
            Frozen Bottle Operations Hub
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#94a3b8' }}>
            Multi-channel store performance & verified ratings intelligence
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#111827', border: '1px solid #1f2937', padding: '6px 14px', borderRadius: '20px', fontSize: '12px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block' }}></span>
          <span style={{ color: '#cbd5e1' }}>Live Data Active</span>
        </div>
      </div>

      {/* Top KPI Cards (Updated with Google Rating & Platform Rating) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', margin: '24px 0' }}>
        <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '12px', padding: '16px' }}>
          <span style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Net Sales</span>
          <div style={{ fontSize: '22px', fontWeight: 700, color: '#ffffff', margin: '6px 0 2px' }}>₹ 14,82,400</div>
          <span style={{ fontSize: '11px', color: '#64748b' }}>POS + Aggregators</span>
        </div>

        <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '12px', padding: '16px' }}>
          <span style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Google Rating</span>
          <div style={{ fontSize: '22px', fontWeight: 700, color: '#38bdf8', margin: '6px 0 2px' }}>
            {googleData?.overallRating || '4.24'} ★
          </div>
          <span style={{ fontSize: '11px', color: '#94a3b8' }}>COCO Stores (MTD)</span>
        </div>

        <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '12px', padding: '16px' }}>
          <span style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{platform} Rating</span>
          <div style={{ fontSize: '22px', fontWeight: 700, color: '#f59e0b', margin: '6px 0 2px' }}>
            {loading ? '...' : (data?.overallRating || '3.74')} ★
          </div>
          <span style={{ fontSize: '11px', color: '#10b981' }}>{timeFilter} Live</span>
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
      </div>

      {/* Customer Ratings & Slicers Section */}
      <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '24px', marginTop: '24px' }}>
        
        {/* Slicer Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1e293b', paddingBottom: '18px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#ffffff' }}>Customer Ratings & Feedback</h2>
            <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#94a3b8' }}>Filter live Google Sheets by platform and evaluation window</p>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {/* Platform Slicer */}
            <div style={{ display: 'flex', backgroundColor: '#090d16', padding: '4px', borderRadius: '10px', border: '1px solid #1e293b' }}>
              {(['Google', 'Swiggy', 'Zomato'] as Platform[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setPlatform(p)}
                  style={{
                    backgroundColor: platform === p ? '#f59e0b' : 'transparent',
                    color: platform === p ? '#000000' : '#94a3b8',
                    border: 'none',
                    borderRadius: '7px',
                    padding: '6px 14px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Time Filter Slicer */}
            <div style={{ display: 'flex', backgroundColor: '#090d16', padding: '4px', borderRadius: '10px', border: '1px solid #1e293b' }}>
              {(['Yesterday', 'LW', 'L2W', 'MTD', 'LMTD', 'Last 30 Days'] as TimePeriod[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTimeFilter(t)}
                  style={{
                    backgroundColor: timeFilter === t ? '#334155' : 'transparent',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '7px',
                    padding: '6px 12px',
                    fontSize: '12px',
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Dynamic Metric Tiles */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', margin: '24px 0' }}>
          <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '12px', padding: '20px' }}>
            <span style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{platform} Rating</span>
            <div style={{ fontSize: '32px', fontWeight: 800, color: '#f59e0b', margin: '8px 0 4px' }}>
              {loading ? '...' : (data?.overallRating || '3.74')} ★
            </div>
            <span style={{ fontSize: '12px', color: '#64748b' }}>COCO Stores ({timeFilter})</span>
          </div>

          <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '12px', padding: '20px' }}>
            <span style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Rated Orders ({platform === 'Swiggy' ? 'Col O = 1' : platform === 'Zomato' ? 'Col M = 1' : 'Google Ratings'})
            </span>
            <div style={{ fontSize: '32px', fontWeight: 800, color: '#ffffff', margin: '8px 0 4px' }}>
              {loading ? '...' : (data?.ratedOrders?.toLocaleString() || '0')}
            </div>
            <span style={{ fontSize: '12px', color: '#64748b' }}>Filtered for {timeFilter}</span>
          </div>

          <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '12px', padding: '20px' }}>
            <span style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Comments Captured</span>
            <div style={{ fontSize: '32px', fontWeight: 800, color: '#ffffff', margin: '8px 0 4px' }}>
              {loading ? '...' : (data?.totalReviews?.toLocaleString() || '0')}
            </div>
            <span style={{ fontSize: '12px', color: '#64748b' }}>Customer comments with ratings</span>
          </div>
        </div>

        {/* Live Customer Comments Feed */}
        <div style={{ marginTop: '24px' }}>
          <h3 style={{ fontSize: '13px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 14px' }}>
            Recent {platform} Comments ({timeFilter})
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {loading ? (
              <div style={{ padding: '16px', color: '#64748b', fontSize: '13px' }}>Syncing data from Google Sheets...</div>
            ) : data?.recentReviews?.length > 0 ? (
              data.recentReviews.map((rev: any, idx: number) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: '#111827',
                    border: '1px solid #1f2937',
                    borderRadius: '10px',
                    padding: '14px 18px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '16px',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 600, fontSize: '14px', color: '#ffffff' }}>{rev.store}</span>
                      <span style={{ fontSize: '11px', color: '#64748b' }}>{rev.date}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '13px', color: '#cbd5e1' }}>"{rev.comment}"</p>
                  </div>
                  <span
                    style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: 700,
                      backgroundColor: rev.rating >= 4 ? 'rgba(16, 185, 129, 0.15)' : rev.rating === 3 ? 'rgba(245, 158, 11, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                      color: rev.rating >= 4 ? '#34d399' : rev.rating === 3 ? '#f59e0b' : '#f87171',
                      border: rev.rating >= 4 ? '1px solid rgba(16, 185, 129, 0.3)' : rev.rating === 3 ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {rev.rating} ★
                  </span>
                </div>
              ))
            ) : (
              <div style={{ padding: '16px', color: '#64748b', fontSize: '13px' }}>No customer comments found for {timeFilter}.</div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
