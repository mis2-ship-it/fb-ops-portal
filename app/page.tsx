'use client';

import React, { useState, useEffect, useCallback } from 'react';

type MainTab = 'operations' | 'sales' | 'kpt';
type SalesSubView = 'daily' | 'weekly' | 'monthly';

export default function Home() {
  const [activeTab, setActiveTab] = useState<MainTab>('sales');
  const [salesSubView, setSalesSubView] = useState<SalesSubView>('daily');
  const [salesMonth, setSalesMonth] = useState<string>('Oct-26');
  const [salesBrand, setSalesBrand] = useState<string>('ALL');
  const [salesRegion, setSalesRegion] = useState<string>('ALL');
  const [salesSource, setSalesSource] = useState<string>('ALL');
  const [salesSession, setSalesSession] = useState<string>('ALL');

  const [salesData, setSalesData] = useState<any>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

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

  return (
    <main className="min-h-screen bg-[#070b14] text-slate-100 p-4 md:p-6 font-sans">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-5 border-b border-slate-800/80 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Frozen Bottle Operations Hub</h1>
          <p className="text-xs text-slate-400 mt-0.5">Store Performance, Customer Feedback & Operational Intelligence</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 bg-[#0d1424] p-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('operations')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'operations' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            📊 Operations & Ratings
          </button>
          <button
            onClick={() => setActiveTab('sales')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'sales' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            📈 Sales Hub
          </button>
          <button
            onClick={() => setActiveTab('kpt')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'kpt' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            ⏱️ KPT & O2D
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. OPERATIONS & RATINGS TAB */}
      {/* ========================================================================= */}
      {activeTab === 'operations' && (
        <div className="mt-5 space-y-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#0d1527] p-4 rounded-xl border border-slate-800">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Overall Rating</span>
              <p className="text-2xl font-bold text-amber-400 mt-1">4.32 ★</p>
              <span className="text-[11px] text-emerald-400">+0.04 vs Last Month</span>
            </div>
            <div className="bg-[#0d1527] p-4 rounded-xl border border-slate-800">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Zomato Avg</span>
              <p className="text-2xl font-bold text-rose-400 mt-1">4.28 ★</p>
              <span className="text-[11px] text-slate-400">42,120 Reviews</span>
            </div>
            <div className="bg-[#0d1527] p-4 rounded-xl border border-slate-800">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Swiggy Avg</span>
              <p className="text-2xl font-bold text-orange-400 mt-1">4.36 ★</p>
              <span className="text-[11px] text-slate-400">58,490 Reviews</span>
            </div>
            <div className="bg-[#0d1527] p-4 rounded-xl border border-slate-800">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Critical Outlets (&lt;4.0)</span>
              <p className="text-2xl font-bold text-rose-500 mt-1">4 Outlets</p>
              <span className="text-[11px] text-rose-400">Immediate Action Required</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Top Rated Stores */}
            <div className="bg-[#0d1527] rounded-xl border border-slate-800 overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-800 font-bold text-xs uppercase tracking-wider text-emerald-400 bg-[#0d1527]/80">
                🏆 Top Rated Outlets
              </div>
              <div className="p-3">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#070b14] text-slate-400">
                    <tr>
                      <th className="py-2 px-3">Store Name</th>
                      <th className="py-2 px-3">Region</th>
                      <th className="py-2 px-3 text-right">Zomato</th>
                      <th className="py-2 px-3 text-right">Swiggy</th>
                      <th className="py-2 px-3 text-right">Overall</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono">
                    {[
                      { store: 'Indiranagar - CK', region: 'KA', z: '4.52', s: '4.61', o: '4.57' },
                      { store: 'Koramangala', region: 'KA', z: '4.48', s: '4.55', o: '4.52' },
                      { store: 'Besant Nagar', region: 'TN', z: '4.44', s: '4.50', o: '4.47' },
                      { store: 'Khar', region: 'MH', z: '4.41', s: '4.49', o: '4.45' },
                      { store: 'Whitefield', region: 'KA', z: '4.39', s: '4.46', o: '4.43' },
                    ].map((row, i) => (
                      <tr key={i}>
                        <td className="py-2 px-3 font-sans text-slate-200">{row.store}</td>
                        <td className="py-2 px-3 font-sans text-slate-400">{row.region}</td>
                        <td className="py-2 px-3 text-right text-rose-300">{row.z} ★</td>
                        <td className="py-2 px-3 text-right text-orange-300">{row.s} ★</td>
                        <td className="py-2 px-3 text-right text-emerald-400 font-bold">{row.o} ★</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Outlets Requiring Attention */}
            <div className="bg-[#0d1527] rounded-xl border border-slate-800 overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-800 font-bold text-xs uppercase tracking-wider text-rose-400 bg-[#0d1527]/80">
                ⚠️ Outlets Requiring Attention (&lt; 4.10)
              </div>
              <div className="p-3">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#070b14] text-slate-400">
                    <tr>
                      <th className="py-2 px-3">Store Name</th>
                      <th className="py-2 px-3">Region</th>
                      <th className="py-2 px-3 text-right">Zomato</th>
                      <th className="py-2 px-3 text-right">Swiggy</th>
                      <th className="py-2 px-3 text-right">Overall</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono">
                    {[
                      { store: 'Badlapur', region: 'MH', z: '3.82', s: '3.91', o: '3.87' },
                      { store: 'Thiruvalla', region: 'Kerela', z: '3.88', s: '3.95', o: '3.92' },
                      { store: 'Kolar- Highway Star', region: 'KA', z: '3.92', s: '4.02', o: '3.97' },
                      { store: 'Guduvanchery', region: 'TN', z: '3.96', s: '4.06', o: '4.01' },
                      { store: 'Virar', region: 'MH', z: '4.01', s: '4.10', o: '4.06' },
                    ].map((row, i) => (
                      <tr key={i}>
                        <td className="py-2 px-3 font-sans text-slate-200">{row.store}</td>
                        <td className="py-2 px-3 font-sans text-slate-400">{row.region}</td>
                        <td className="py-2 px-3 text-right text-rose-400 font-bold">{row.z} ★</td>
                        <td className="py-2 px-3 text-right text-rose-400 font-bold">{row.s} ★</td>
                        <td className="py-2 px-3 text-right text-rose-500 font-bold">{row.o} ★</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. SALES HUB TAB */}
      {/* ========================================================================= */}
      {activeTab === 'sales' && (
        <div className="mt-5 space-y-5">
          {/* Sub Navigation Bar */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center bg-[#0d1527] p-3.5 rounded-xl border border-slate-800 gap-3">
            <div className="flex items-center gap-3 text-xs">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-semibold text-slate-200">GSheet Sales Master Sync</span>
              <span className="text-slate-500">|</span>
              <span className="text-slate-400">
                Data Till: <strong className="text-slate-200">{salesData?.dataTill || 'Active'}</strong>
              </span>
              <button
                onClick={fetchSalesData}
                disabled={isRefreshing}
                className="ml-2 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs flex items-center gap-1 border border-slate-700 transition"
              >
                🔄 {isRefreshing ? 'Syncing...' : 'Refresh'}
              </button>
            </div>

            {/* Sub View Toggle */}
            <div className="flex items-center gap-1 bg-[#070b14] p-1 rounded-lg border border-slate-800">
              {(['daily', 'weekly', 'monthly'] as SalesSubView[]).map((v) => (
                <button
                  key={v}
                  onClick={() => setSalesSubView(v)}
                  className={`px-3 py-1 rounded text-xs font-semibold capitalize transition ${
                    salesSubView === v ? 'bg-emerald-500 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {v === 'daily' ? '📅 Daily' : v === 'weekly' ? '🗓️ Weekly' : '📆 Monthly'}
                </button>
              ))}
            </div>
          </div>

          {/* Slicers / Dropdowns */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 bg-[#0d1527]/70 p-3.5 rounded-xl border border-slate-800">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Month</label>
              <select
                value={salesMonth}
                onChange={(e) => setSalesMonth(e.target.value)}
                className="w-full bg-[#070b14] border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="Oct-26">October 2026</option>
                <option value="Sep-26">September 2026</option>
                <option value="Aug-26">August 2026</option>
                <option value="Jul-26">July 2026</option>
                <option value="Jun-26">June 2026</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Brand</label>
              <select
                value={salesBrand}
                onChange={(e) => setSalesBrand(e.target.value)}
                className="w-full bg-[#070b14] border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="ALL">All Brands</option>
                <option value="Frozen Bottle">Frozen Bottle</option>
                <option value="Madno">Madno</option>
                <option value="Lubov">Lubov</option>
                <option value="Boba Bar">Boba Bar</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Region</label>
              <select
                value={salesRegion}
                onChange={(e) => setSalesRegion(e.target.value)}
                className="w-full bg-[#070b14] border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="ALL">All Regions</option>
                <option value="KA">KA (Karnataka)</option>
                <option value="MH">MH (Maharashtra)</option>
                <option value="TN">TN (Tamil Nadu)</option>
                <option value="Kerela">Kerala</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Source</label>
              <select
                value={salesSource}
                onChange={(e) => setSalesSource(e.target.value)}
                className="w-full bg-[#070b14] border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="ALL">All Sources</option>
                <option value="In Store">In Store</option>
                <option value="Swiggy">Swiggy</option>
                <option value="Zomato">Zomato</option>
                <option value="Ownly">Ownly</option>
                <option value="Magicpin">Magicpin</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Session</label>
              <select
                value={salesSession}
                onChange={(e) => setSalesSession(e.target.value)}
                className="w-full bg-[#070b14] border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="ALL">All Sessions</option>
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Snacks">Snacks</option>
                <option value="Dinner">Dinner</option>
                <option value="Post Dinner">Post Dinner</option>
              </select>
            </div>
          </div>

          {/* KPI Header Cards */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            <div className="bg-[#0d1527] p-3.5 rounded-xl border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Net Revenue</span>
              <p className="text-xl font-bold text-sky-400 mt-1">₹{kpis.netRev}</p>
              <span className="text-[10px] text-emerald-400">Filtered Active</span>
            </div>
            <div className="bg-[#0d1527] p-3.5 rounded-xl border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Orders (Txn)</span>
              <p className="text-xl font-bold text-white mt-1">{kpis.orders}</p>
              <span className="text-[10px] text-slate-400">Total Billed</span>
            </div>
            <div className="bg-[#0d1527] p-3.5 rounded-xl border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Discount %</span>
              <p className="text-xl font-bold text-rose-400 mt-1">{kpis.disPct}</p>
              <span className="text-[10px] text-slate-400">Total Discount</span>
            </div>
            <div className="bg-[#0d1527] p-3.5 rounded-xl border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">AOV</span>
              <p className="text-xl font-bold text-amber-400 mt-1">₹{kpis.aov}</p>
              <span className="text-[10px] text-slate-400">Avg Basket Size</span>
            </div>
            <div className="bg-[#0d1527] p-3.5 rounded-xl border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Offline %</span>
              <p className="text-xl font-bold text-slate-200 mt-1">{kpis.offlinePct}</p>
              <span className="text-[10px] text-slate-400">In Store</span>
            </div>
            <div className="bg-[#0d1527] p-3.5 rounded-xl border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Online %</span>
              <p className="text-xl font-bold text-slate-200 mt-1">{kpis.onlinePct}</p>
              <span className="text-[10px] text-slate-400">Aggregators</span>
            </div>
          </div>

          {/* 1. SALES SUMMARY TABLE */}
          <div className="bg-[#0d1527] rounded-xl border border-slate-800 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-800 font-bold text-xs uppercase tracking-wider text-slate-200 bg-[#0d1527]/80">
              📈 {salesSubView.toUpperCase()} SALES SUMMARY
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#070b14] text-slate-400 font-semibold border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-4">Parameters</th>
                    <th className="py-2.5 px-4 text-right">Yesterday</th>
                    <th className="py-2.5 px-4 text-right">MTD</th>
                    <th className="py-2.5 px-4 text-right">LMTD</th>
                    <th className="py-2.5 px-4 text-right">Trends</th>
                    <th className="py-2.5 px-4 text-right">Last Month</th>
                    <th className="py-2.5 px-4 text-right">Last Year</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {(salesData?.overallKPI || []).map((row: any, idx: number) => (
                    <tr key={idx} className="hover:bg-slate-800/40">
                      <td className="py-2.5 px-4 font-sans font-medium text-slate-300">{row.param}</td>
                      <td className="py-2.5 px-4 text-right text-sky-400 font-semibold">₹{row.c1}</td>
                      <td className="py-2.5 px-4 text-right text-slate-200">₹{row.c2}</td>
                      <td className="py-2.5 px-4 text-right text-slate-300">₹{row.c3}</td>
                      <td className="py-2.5 px-4 text-right text-amber-300 font-sans font-semibold">{row.c4}</td>
                      <td className="py-2.5 px-4 text-right text-slate-400">₹{row.c5 || '-'}</td>
                      <td className="py-2.5 px-4 text-right text-slate-400">₹{row.c6 || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 2. CURRENT MONTH DATE-WISE PERFORMANCE */}
          <div className="bg-[#0d1527] rounded-xl border border-slate-800 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-800 font-bold text-xs uppercase tracking-wider text-slate-200 bg-[#0d1527]/80">
              📅 CURRENT MONTH DATE-WISE PERFORMANCE ({salesMonth})
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#070b14] text-slate-400 font-semibold border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-4">Date</th>
                    <th className="py-2.5 px-4 text-right">Gross Sales</th>
                    <th className="py-2.5 px-4 text-right">Net Sales</th>
                    <th className="py-2.5 px-4 text-right">Orders</th>
                    <th className="py-2.5 px-4 text-right">AOV</th>
                    <th className="py-2.5 px-4 text-right">Discount %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {(salesData?.currentMonthDaily || []).map((row: any, idx: number) => (
                    <tr key={idx} className="hover:bg-slate-800/40">
                      <td className="py-2.5 px-4 font-sans font-medium text-slate-300">{row.date}</td>
                      <td className="py-2.5 px-4 text-right text-slate-400">₹{row.gross}</td>
                      <td className="py-2.5 px-4 text-right text-sky-400 font-semibold">₹{row.net}</td>
                      <td className="py-2.5 px-4 text-right text-slate-200">{Number(row.orders).toLocaleString('en-IN')}</td>
                      <td className="py-2.5 px-4 text-right text-amber-300">₹{row.aov}</td>
                      <td className="py-2.5 px-4 text-right text-rose-400">{row.disPct}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 3. AOV & DISCOUNT BUCKET ANALYSIS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#0d1527] rounded-xl border border-slate-800 overflow-hidden">
              <div className="px-4 py-2.5 bg-amber-600/80 font-bold text-xs uppercase tracking-wider text-white">
                💰 AOV BUCKET ANALYSIS (REV SHARE | ORDERS)
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#070b14] text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="py-2 px-3">Bucket</th>
                      <th className="py-2 px-3 text-right">Yesterday</th>
                      <th className="py-2 px-3 text-right">Last Week</th>
                      <th className="py-2 px-3 text-right">MTD</th>
                      <th className="py-2 px-3 text-right">LMTD</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono">
                    {(salesData?.aovBuckets || []).map((row: any, idx: number) => (
                      <tr key={idx} className="hover:bg-slate-800/40">
                        <td className="py-2 px-3 font-sans font-medium text-slate-300">{row.bucket}</td>
                        <td className="py-2 px-3 text-right text-slate-200">{row.col1}</td>
                        <td className="py-2 px-3 text-right text-slate-300">{row.col2}</td>
                        <td className="py-2 px-3 text-right text-emerald-400">{row.col3}</td>
                        <td className="py-2 px-3 text-right text-slate-400">{row.col4}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-[#0d1527] rounded-xl border border-slate-800 overflow-hidden">
              <div className="px-4 py-2.5 bg-rose-600/80 font-bold text-xs uppercase tracking-wider text-white">
                🏷️ DISCOUNT BUCKET ANALYSIS (REV SHARE | ORDERS)
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#070b14] text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="py-2 px-3">Bucket</th>
                      <th className="py-2 px-3 text-right">Yesterday</th>
                      <th className="py-2 px-3 text-right">Last Week</th>
                      <th className="py-2 px-3 text-right">MTD</th>
                      <th className="py-2 px-3 text-right">LMTD</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono">
                    {(salesData?.discountBuckets || []).map((row: any, idx: number) => (
                      <tr key={idx} className="hover:bg-slate-800/40">
                        <td className="py-2 px-3 font-sans font-medium text-slate-300">{row.bucket}</td>
                        <td className="py-2 px-3 text-right text-slate-200">{row.col1}</td>
                        <td className="py-2 px-3 text-right text-slate-300">{row.col2}</td>
                        <td className="py-2 px-3 text-right text-emerald-400">{row.col3}</td>
                        <td className="py-2 px-3 text-right text-slate-400">{row.col4}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* 4. BRAND SUMMARY & SOURCE SUMMARY */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#0d1527] rounded-xl border border-slate-800 overflow-hidden">
              <div className="px-4 py-2.5 border-b border-slate-800 font-bold text-xs uppercase tracking-wider text-slate-200">
                🏷️ BRAND SUMMARY
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#070b14] text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="py-2 px-3">Brand</th>
                      <th className="py-2 px-3 text-right">Today Rev</th>
                      <th className="py-2 px-3 text-right">LW Rev</th>
                      <th className="py-2 px-3 text-right">Growth %</th>
                      <th className="py-2 px-3 text-right">Today Dis%</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono">
                    {(salesData?.brandSummary || []).map((row: any, idx: number) => (
                      <tr key={idx} className="hover:bg-slate-800/40">
                        <td className="py-2 px-3 font-sans font-medium text-slate-200">{row.brand}</td>
                        <td className="py-2 px-3 text-right text-sky-400 font-semibold">₹{row.todayRev}</td>
                        <td className="py-2 px-3 text-right text-slate-300">₹{row.lwRev}</td>
                        <td className="py-2 px-3 text-right text-amber-300 font-sans font-semibold">{row.growth}</td>
                        <td className="py-2 px-3 text-right text-rose-400">{row.todayDis}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-[#0d1527] rounded-xl border border-slate-800 overflow-hidden">
              <div className="px-4 py-2.5 border-b border-slate-800 font-bold text-xs uppercase tracking-wider text-slate-200">
                📍 SOURCE SUMMARY
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#070b14] text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="py-2 px-3">Source</th>
                      <th className="py-2 px-3 text-right">Today Rev</th>
                      <th className="py-2 px-3 text-right">LW Rev</th>
                      <th className="py-2 px-3 text-right">Growth %</th>
                      <th className="py-2 px-3 text-right">Today Dis%</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono">
                    {(salesData?.sourceSummary || []).map((row: any, idx: number) => (
                      <tr key={idx} className="hover:bg-slate-800/40">
                        <td className="py-2 px-3 font-sans font-medium text-slate-200">{row.source}</td>
                        <td className="py-2 px-3 text-right text-sky-400 font-semibold">₹{row.todayRev}</td>
                        <td className="py-2 px-3 text-right text-slate-300">₹{row.lwRev}</td>
                        <td className="py-2 px-3 text-right text-amber-300 font-sans font-semibold">{row.growth}</td>
                        <td className="py-2 px-3 text-right text-rose-400">{row.todayDis}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* 5. BRAND SESSION & REGION SESSION */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#0d1527] rounded-xl border border-slate-800 overflow-hidden">
              <div className="px-4 py-2.5 border-b border-slate-800 font-bold text-xs uppercase tracking-wider text-slate-200">
                🍽️ BRAND SESSION ANALYSIS
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#070b14] text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="py-2 px-3">Brand</th>
                      <th className="py-2 px-3 text-right">Breakfast</th>
                      <th className="py-2 px-3 text-right">Lunch</th>
                      <th className="py-2 px-3 text-right">Snacks</th>
                      <th className="py-2 px-3 text-right">Dinner</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono">
                    {(salesData?.brandSession || []).map((row: any, idx: number) => (
                      <tr key={idx} className="hover:bg-slate-800/40">
                        <td className="py-2 px-3 font-sans font-medium text-slate-200">{row.brand}</td>
                        <td className="py-2 px-3 text-right text-slate-400">₹{row.breakfast}</td>
                        <td className="py-2 px-3 text-right text-slate-300">₹{row.lunch}</td>
                        <td className="py-2 px-3 text-right text-slate-200">₹{row.snacks}</td>
                        <td className="py-2 px-3 text-right text-sky-400 font-semibold">₹{row.dinner}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-[#0d1527] rounded-xl border border-slate-800 overflow-hidden">
              <div className="px-4 py-2.5 border-b border-slate-800 font-bold text-xs uppercase tracking-wider text-slate-200">
                🌍 REGION SESSION ANALYSIS
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#070b14] text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="py-2 px-3">Region</th>
                      <th className="py-2 px-3 text-right">Breakfast</th>
                      <th className="py-2 px-3 text-right">Lunch</th>
                      <th className="py-2 px-3 text-right">Snacks</th>
                      <th className="py-2 px-3 text-right">Dinner</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono">
                    {(salesData?.regionSession || []).map((row: any, idx: number) => (
                      <tr key={idx} className="hover:bg-slate-800/40">
                        <td className="py-2 px-3 font-sans font-medium text-slate-200">{row.region}</td>
                        <td className="py-2 px-3 text-right text-slate-400">₹{row.breakfast}</td>
                        <td className="py-2 px-3 text-right text-slate-300">₹{row.lunch}</td>
                        <td className="py-2 px-3 text-right text-slate-200">₹{row.snacks}</td>
                        <td className="py-2 px-3 text-right text-sky-400 font-semibold">₹{row.dinner}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* 6. 81 COCO STORE PERFORMANCE RANKING */}
          <div className="bg-[#0d1527] rounded-xl border border-slate-800 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-800 bg-[#0d1527]/80 flex justify-between items-center">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                🏪 81 COCO STORE PERFORMANCE RANKING
              </h2>
              <span className="text-[11px] text-slate-400">Total Outlets: {salesData?.allStores?.length || 81}</span>
            </div>
            <div className="overflow-x-auto max-h-96">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#070b14] text-slate-400 font-semibold border-b border-slate-800 sticky top-0">
                  <tr>
                    <th className="py-2.5 px-4">#</th>
                    <th className="py-2.5 px-4">Store Name</th>
                    <th className="py-2.5 px-4">Region</th>
                    <th className="py-2.5 px-4">Type</th>
                    <th className="py-2.5 px-4 text-right">Net Revenue</th>
                    <th className="py-2.5 px-4 text-right">Orders</th>
                    <th className="py-2.5 px-4 text-right">AOV</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {(salesData?.allStores || []).map((st: any) => (
                    <tr key={st.rank} className="hover:bg-slate-800/40">
                      <td className="py-2 px-4 text-slate-500">{st.rank}</td>
                      <td className="py-2 px-4 font-sans font-medium text-slate-200">{st.store}</td>
                      <td className="py-2 px-4 font-sans text-slate-400">{st.region}</td>
                      <td className="py-2 px-4 font-sans text-emerald-400 font-semibold">{st.type || 'COCO'}</td>
                      <td className="py-2 px-4 text-right text-sky-400 font-semibold">₹{st.rev}</td>
                      <td className="py-2 px-4 text-right text-slate-300">{Number(st.orders).toLocaleString('en-IN')}</td>
                      <td className="py-2 px-4 text-right text-amber-300">₹{st.aov}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. KPT & O2D TAB */}
      {/* ========================================================================= */}
      {activeTab === 'kpt' && (
        <div className="mt-5 space-y-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#0d1527] p-4 rounded-xl border border-slate-800">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Avg KPT</span>
              <p className="text-2xl font-bold text-emerald-400 mt-1">7.4 min</p>
              <span className="text-[11px] text-slate-400">Target: &lt; 9.0 min</span>
            </div>
            <div className="bg-[#0d1527] p-4 rounded-xl border border-slate-800">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Avg Rider Wait</span>
              <p className="text-2xl font-bold text-amber-400 mt-1">4.2 min</p>
              <span className="text-[11px] text-slate-400">Target: &lt; 5.0 min</span>
            </div>
            <div className="bg-[#0d1527] p-4 rounded-xl border border-slate-800">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Avg O2D (Delivery)</span>
              <p className="text-2xl font-bold text-sky-400 mt-1">26.8 min</p>
              <span className="text-[11px] text-slate-400">Target: &lt; 30.0 min</span>
            </div>
            <div className="bg-[#0d1527] p-4 rounded-xl border border-slate-800">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">KPT Breaches (&gt;15 min)</span>
              <p className="text-2xl font-bold text-rose-400 mt-1">2.4%</p>
              <span className="text-[11px] text-emerald-400">-0.6% vs LW</span>
            </div>
          </div>

          <div className="bg-[#0d1527] rounded-xl border border-slate-800 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-800 font-bold text-xs uppercase tracking-wider text-purple-400 bg-[#0d1527]/80">
              ⏱️ Outlet Speed of Service & Breach Leaderboard
            </div>
            <div className="overflow-x-auto max-h-96">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#070b14] text-slate-400 sticky top-0">
                  <tr>
                    <th className="py-2.5 px-4">Store Name</th>
                    <th className="py-2.5 px-4">Region</th>
                    <th className="py-2.5 px-4 text-right">Avg KPT</th>
                    <th className="py-2.5 px-4 text-right">Rider Wait</th>
                    <th className="py-2.5 px-4 text-right">O2D</th>
                    <th className="py-2.5 px-4 text-right">Breach Rate</th>
                    <th className="py-2.5 px-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {[
                    { store: 'Indiranagar - CK', region: 'KA', kpt: '6.2 min', wait: '3.1 min', o2d: '23.4 min', breach: '0.8%', status: 'Excellent' },
                    { store: 'Koramangala', region: 'KA', kpt: '6.8 min', wait: '3.5 min', o2d: '24.1 min', breach: '1.2%', status: 'Excellent' },
                    { store: 'HSR Layout', region: 'KA', kpt: '7.1 min', wait: '4.0 min', o2d: '25.6 min', breach: '1.8%', status: 'Good' },
                    { store: 'Whitefield', region: 'KA', kpt: '7.8 min', wait: '4.4 min', o2d: '27.2 min', breach: '2.5%', status: 'Good' },
                    { store: 'Besant Nagar', region: 'TN', kpt: '7.9 min', wait: '4.2 min', o2d: '26.8 min', breach: '2.2%', status: 'Good' },
                    { store: 'Khar', region: 'MH', kpt: '8.4 min', wait: '4.9 min', o2d: '28.5 min', breach: '3.1%', status: 'Average' },
                    { store: 'Badlapur', region: 'MH', kpt: '11.8 min', wait: '7.2 min', o2d: '34.2 min', breach: '7.8%', status: 'Critical' },
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-slate-800/40">
                      <td className="py-2 px-4 font-sans font-medium text-slate-200">{row.store}</td>
                      <td className="py-2 px-4 font-sans text-slate-400">{row.region}</td>
                      <td className="py-2 px-4 text-right text-emerald-400 font-bold">{row.kpt}</td>
                      <td className="py-2 px-4 text-right text-amber-300">{row.wait}</td>
                      <td className="py-2 px-4 text-right text-sky-400">{row.o2d}</td>
                      <td className="py-2 px-4 text-right text-rose-400 font-bold">{row.breach}</td>
                      <td className="py-2 px-4 text-center font-sans">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          row.status === 'Excellent' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                          row.status === 'Good' ? 'bg-sky-950 text-sky-400 border border-sky-800' :
                          row.status === 'Average' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                          'bg-rose-950 text-rose-400 border border-rose-800'
                        }`}>
                          {row.status}
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
    </main>
  );
}
