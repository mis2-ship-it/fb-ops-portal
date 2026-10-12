'use client';

import React, { useState, useEffect, useCallback } from 'react';

type MainTab = 'operations' | 'sales' | 'kpt';
type SalesSubView = 'daily' | 'weekly' | 'monthly';

interface SalesPayload {
  success: boolean;
  viewType: string;
  dataTill: string;
  executiveInsight: string;
  kpis: {
    netRev: string;
    orders: string;
    disPct: string;
    aov: string;
    offlinePct: string;
    onlinePct: string;
  };
  slicers: {
    brands: string[];
    regions: string[];
    sources: string[];
    sessions: string[];
  };
  overallKPI: Array<{
    param: string;
    c1: string;
    c2: string;
    c3: string;
    c4: string;
    c5?: string;
    c6?: string;
    g1?: string;
    g2?: string;
    g3?: string;
    g4?: string;
  }>;
  currentMonthDaily: Array<{
    date: string;
    gross: string;
    net: string;
    orders: number;
    aov: string;
    disPct: string;
  }>;
  aovBuckets: Array<{
    bucket: string;
    col1: string;
    col2: string;
    col3: string;
    col4: string;
  }>;
  discountBuckets: Array<{
    bucket: string;
    col1: string;
    col2: string;
    col3: string;
    col4: string;
  }>;
  brandSummary: Array<{
    brand: string;
    todayRev: string;
    lwRev: string;
    growth: string;
    todayDis: string;
    lwDis: string;
    disChange: string;
  }>;
  sourceSummary: Array<{
    source: string;
    todayRev: string;
    lwRev: string;
    growth: string;
    todayDis: string;
    lwDis: string;
    disChange: string;
  }>;
  brandSession: Array<{
    brand: string;
    breakfast: string;
    lunch: string;
    snacks: string;
    dinner: string;
    postDinner: string;
  }>;
  regionSession: Array<{
    region: string;
    breakfast: string;
    lunch: string;
    snacks: string;
    dinner: string;
    postDinner: string;
  }>;
  topStores: Array<{
    rank: number;
    store: string;
    region: string;
    type?: string;
    rev: string;
    orders: number;
    aov: string;
  }>;
  bottomStores: Array<{
    rank: number;
    store: string;
    region: string;
    type?: string;
    rev: string;
    orders: number;
    aov: string;
  }>;
  allStores: Array<{
    rank: number;
    store: string;
    region: string;
    type?: string;
    rev: string;
    orders: number;
    aov: string;
  }>;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<MainTab>('sales');
  const [salesSubView, setSalesSubView] = useState<SalesSubView>('daily');
  const [salesBrand, setSalesBrand] = useState<string>('ALL');
  const [salesRegion, setSalesRegion] = useState<string>('ALL');
  const [salesSource, setSalesSource] = useState<string>('ALL');
  const [salesSession, setSalesSession] = useState<string>('ALL');

  const [salesData, setSalesData] = useState<SalesPayload | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

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
      .then((json: SalesPayload) => {
        setSalesData(json);
        setIsRefreshing(false);
      })
      .catch((err) => {
        console.error('Failed to load sales data:', err);
        setIsRefreshing(false);
      });
  }, [salesSubView, salesBrand, salesRegion, salesSource, salesSession]);

  useEffect(() => {
    if (activeTab === 'sales') {
      fetchSalesData();
    }
  }, [fetchSalesData, activeTab]);

  return (
    <main className="min-vh-100 bg-slate-950 text-slate-100 p-4 md:p-6 font-sans">
      {/* Top Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center pb-6 border-b border-slate-800 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            Frozen Bottle Operations Hub
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Store Performance, Customer Feedback & Operational Intelligence
          </p>
        </div>

        <nav className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('operations')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'operations'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            📊 Operations & Ratings
          </button>
          <button
            onClick={() => setActiveTab('sales')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'sales'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            📈 Sales Hub
          </button>
          <button
            onClick={() => setActiveTab('kpt')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'kpt'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            ⏱️ KPT & O2D
          </button>
        </nav>
      </header>

      {/* Operations Tab Placeholder */}
      {activeTab === 'operations' && (
        <section className="py-12 text-center text-slate-400">
          <p className="text-sm">Operations & Ratings metrics are active in the primary ops tab.</p>
        </section>
      )}

      {/* KPT Tab Placeholder */}
      {activeTab === 'kpt' && (
        <section className="py-12 text-center text-slate-400">
          <p className="text-sm">KPT & O2D analytics available via automated routing.</p>
        </section>
      )}

      {/* Sales Hub Tab */}
      {activeTab === 'sales' && (
        <section className="mt-6 space-y-6">
          {/* Sub Navigation Bar */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center bg-slate-900/90 p-4 rounded-xl border border-slate-800 gap-4">
            <div className="flex items-center gap-3">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                GSheet Sales Master Sync
              </span>
              <span className="text-xs text-slate-500">|</span>
              <span className="text-xs text-slate-400">
                Data Till:{' '}
                <strong className="text-slate-200">
                  {salesData?.dataTill || 'Loading...'}
                </strong>
              </span>
              <button
                onClick={fetchSalesData}
                disabled={isRefreshing}
                className="ml-2 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs flex items-center gap-1 border border-slate-700 transition"
              >
                🔄 {isRefreshing ? 'Syncing...' : 'Refresh'}
              </button>
            </div>

            {/* Sub View Toggle: Daily, Weekly, Monthly */}
            <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800">
              {(['daily', 'weekly', 'monthly'] as SalesSubView[]).map((v) => (
                <button
                  key={v}
                  onClick={() => setSalesSubView(v)}
                  className={`px-3 py-1 rounded text-xs font-semibold capitalize transition ${
                    salesSubView === v
                      ? 'bg-emerald-500 text-white shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {v === 'daily' ? '📅 Daily' : v === 'weekly' ? '🗓️ Weekly' : '📆 Monthly'}
                </button>
              ))}
            </div>
          </div>

          {/* Executive Insight Banner */}
          {salesData?.executiveInsight && (
            <div className="bg-slate-900/60 border border-slate-800/80 px-4 py-2.5 rounded-lg text-xs text-amber-300/90 flex items-center gap-2">
              <span>🧠</span>
              <span>{salesData.executiveInsight}</span>
            </div>
          )}

          {/* Slicers / Filters */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-900/50 p-3.5 rounded-xl border border-slate-800">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Brand
              </label>
              <select
                value={salesBrand}
                onChange={(e) => setSalesBrand(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="ALL">All Brands</option>
                <option value="Frozen Bottle">Frozen Bottle</option>
                <option value="Madno">Madno</option>
                <option value="Lubov">Lubov</option>
                <option value="Boba Bar">Boba Bar</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Region
              </label>
              <select
                value={salesRegion}
                onChange={(e) => setSalesRegion(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="ALL">All Regions</option>
                <option value="KA">KA (Karnataka)</option>
                <option value="MH">MH (Maharashtra)</option>
                <option value="TN">TN (Tamil Nadu)</option>
                <option value="Kerela">Kerala</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Source
              </label>
              <select
                value={salesSource}
                onChange={(e) => setSalesSource(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
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
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Session
              </label>
              <select
                value={salesSession}
                onChange={(e) => setSalesSession(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
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

          {/* Top KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Net Revenue
              </span>
              <p className="text-lg md:text-xl font-bold text-white mt-1">
                ₹{salesData?.kpis?.netRev || '0'}
              </p>
              <span className="text-[10px] text-emerald-400">Filtered Active</span>
            </div>

            <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Orders (Txn)
              </span>
              <p className="text-lg md:text-xl font-bold text-white mt-1">
                {salesData?.kpis?.orders || '0'}
              </p>
              <span className="text-[10px] text-slate-400">Total Billed</span>
            </div>

            <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Discount %
              </span>
              <p className="text-lg md:text-xl font-bold text-rose-400 mt-1">
                {salesData?.kpis?.disPct || '0%'}
              </p>
              <span className="text-[10px] text-slate-400">Total Discount</span>
            </div>

            <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                AOV
              </span>
              <p className="text-lg md:text-xl font-bold text-amber-400 mt-1">
                ₹{salesData?.kpis?.aov || '0'}
              </p>
              <span className="text-[10px] text-slate-400">Avg Basket Size</span>
            </div>

            <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Offline %
              </span>
              <p className="text-lg md:text-xl font-bold text-slate-200 mt-1">
                {salesData?.kpis?.offlinePct || '25%'}
              </p>
              <span className="text-[10px] text-slate-400">In Store</span>
            </div>

            <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Online %
              </span>
              <p className="text-lg md:text-xl font-bold text-slate-200 mt-1">
                {salesData?.kpis?.onlinePct || '75%'}
              </p>
              <span className="text-[10px] text-slate-400">Aggregators</span>
            </div>
          </div>

          {/* Primary View Table: Daily / Weekly / Monthly Sales Summary */}
          <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-800 flex justify-between items-center bg-slate-900/80">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                📈 {salesSubView.toUpperCase()} SALES SUMMARY
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-4">Parameters</th>
                    <th className="py-2.5 px-4 text-right">Yesterday</th>
                    <th className="py-2.5 px-4 text-right">MTD</th>
                    <th className="py-2.5 px-4 text-right">LMTD</th>
                    <th className="py-2.5 px-4 text-right">Growth %</th>
                    <th className="py-2.5 px-4 text-right">Last Month</th>
                    <th className="py-2.5 px-4 text-right">Last Year</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {salesData?.overallKPI && salesData.overallKPI.length > 0 ? (
                    salesData.overallKPI.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/40">
                        <td className="py-2.5 px-4 font-sans font-medium text-slate-300">
                          {row.param}
                        </td>
                        <td className="py-2.5 px-4 text-right text-emerald-400 font-semibold">
                          {row.c1}
                        </td>
                        <td className="py-2.5 px-4 text-right text-slate-200">{row.c2}</td>
                        <td className="py-2.5 px-4 text-right text-slate-300">{row.c3}</td>
                        <td className="py-2.5 px-4 text-right text-amber-300 font-sans font-semibold">
                          {row.c4}
                        </td>
                        <td className="py-2.5 px-4 text-right text-slate-400">{row.c5 || '-'}</td>
                        <td className="py-2.5 px-4 text-right text-slate-400">{row.c6 || '-'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-6 text-center text-slate-500 font-sans">
                        Loading sales metrics...
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Current Month Date-Wise Performance Table */}
          <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-800 bg-slate-900/80">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                📅 CURRENT MONTH DATE-WISE PERFORMANCE (OCTOBER 2026)
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
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
                  {salesData?.currentMonthDaily && salesData.currentMonthDaily.length > 0 ? (
                    salesData.currentMonthDaily.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/40">
                        <td className="py-2.5 px-4 font-sans font-medium text-slate-300">
                          {row.date}
                        </td>
                        <td className="py-2.5 px-4 text-right text-slate-400">₹{row.gross}</td>
                        <td className="py-2.5 px-4 text-right text-emerald-400 font-semibold">
                          ₹{row.net}
                        </td>
                        <td className="py-2.5 px-4 text-right text-slate-200">
                          {row.orders.toLocaleString('en-IN')}
                        </td>
                        <td className="py-2.5 px-4 text-right text-amber-300">₹{row.aov}</td>
                        <td className="py-2.5 px-4 text-right text-rose-400">{row.disPct}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-6 text-center text-slate-500 font-sans">
                        No day-level records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* 81 COCO Stores Master Ranking */}
          <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-800 bg-slate-900/80 flex justify-between items-center">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                🏪 81 COCO STORE PERFORMANCE RANKING
              </h2>
              <span className="text-[11px] text-slate-400">
                Total Outlets: {salesData?.allStores?.length || 81}
              </span>
            </div>
            <div className="overflow-x-auto max-h-96">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800 sticky top-0">
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
                  {salesData?.allStores && salesData.allStores.length > 0 ? (
                    salesData.allStores.map((st) => (
                      <tr key={st.rank} className="hover:bg-slate-800/40">
                        <td className="py-2 px-4 text-slate-500">{st.rank}</td>
                        <td className="py-2 px-4 font-sans font-medium text-slate-200">
                          {st.store}
                        </td>
                        <td className="py-2 px-4 font-sans text-slate-400">{st.region}</td>
                        <td className="py-2 px-4 font-sans text-emerald-400 font-semibold">
                          {st.type || 'COCO'}
                        </td>
                        <td className="py-2 px-4 text-right text-emerald-400 font-semibold">
                          ₹{st.rev}
                        </td>
                        <td className="py-2 px-4 text-right text-slate-300">
                          {st.orders.toLocaleString('en-IN')}
                        </td>
                        <td className="py-2 px-4 text-right text-amber-300">₹{st.aov}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-6 text-center text-slate-500 font-sans">
                        Loading store records...
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
