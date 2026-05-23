"use client"
import Link from 'next/link';
import React, { useState } from 'react';
import { exportToCSV } from '@/lib/exportUtils';

const EstateList = ({estates}) => {
    const [filter, setFilter] = useState("All");
    const [activeTab, setActiveTab] = useState("directory");

    // Summary metrics derived from estates data
    const totalEstates = estates.length;
    const activeCount = estates.filter(e => e.status === 'Active').length;
    const pendingCount = estates.filter(e => e.status === 'Pending Approval').length;
    const renovatingCount = estates.filter(e => e.status === 'Under Renovation').length;
    const developingCount = estates.filter(e => e.status === 'Developing').length;
    
    const subscriptionBreakdown = estates.reduce((acc, e) => {
        const plan = e.subscription?.plan || e.subscriptionPlan || 'None';
        acc[plan] = (acc[plan] || 0) + 1;
        return acc;
    }, {});
    const regionBreakdown = estates.reduce((acc, e) => {
        let region = e.region;
        if (!region) {
            if (typeof e.location === 'object' && e.location !== null) {
                region = e.location.state || e.location.city || 'Unknown';
            } else if (typeof e.location === 'string') {
                region = e.location.split(', ').pop();
            } else {
                region = 'Unknown';
            }
        }
        acc[region] = (acc[region] || 0) + 1;
        return acc;
    }, {});

    const statusConfig = {
        'Active':           { dot: 'bg-emerald-500', badge: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' },
        'Pending Approval': { dot: 'bg-amber-500', badge: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20' },
        'Under Renovation': { dot: 'bg-blue-500', badge: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20' },
        'Developing':       { dot: 'bg-slate-400', badge: 'bg-slate-400/10 text-slate-600 dark:text-slate-400 border border-slate-400/20' },
    };

    const handleExport = () => {
        const exportData = estates.map(e => ({
            ID: e._id,
            Name: e.name,
            Location: typeof e.location === 'object' ? `${e.location.address}, ${e.location.city}, ${e.location.state}` : (e.location || e.address),
            Status: e.status,
            Subscription: e.subscription?.plan || e.subscriptionPlan || 'None'
        }));
        exportToCSV(exportData, 'estates_portfolio');
    };

 
    return (
    <div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
        <div className="space-y-1">
          <h1 className="text-5xl font-black tracking-tighter text-slate-900 dark:text-white font-headline leading-none">Portfolio Directory</h1>
          <p className="text-slate-400 dark:text-slate-500 font-bold font-manrope text-[10px] uppercase tracking-[0.3em]">Institutional Asset Management • {totalEstates} Global Holdings</p>
        </div>
        <div className="flex items-center gap-4">
            {/* Tab switcher */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700">
                <button
                    type="button"
                    onClick={() => setActiveTab('directory')}
                    className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest font-manrope transition-all ${activeTab === 'directory' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700' : 'text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
                >
                    Directory
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab('summary')}
                    className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest font-manrope transition-all ${activeTab === 'summary' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700' : 'text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
                >
                    Summary
                </button>
            </div>
            <Link href="/create-new-estate" className="px-8 py-3.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-manrope text-[10px] font-black uppercase tracking-widest rounded-2xl hover:opacity-90 transition-all flex items-center gap-3">
                <span className="material-symbols-outlined text-sm">add_box</span>
                Register Asset
            </Link>
        </div>
      </div>

      {/* Bento Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
        {/* Total Assets */}
        <div className="col-span-12 md:col-span-4 bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-300 dark:border-slate-800 transition-transform hover:scale-[1.01] duration-500">
          <div>
            <p className="text-slate-400 dark:text-slate-500 text-[9px] font-black uppercase tracking-[0.3em] mb-4 font-manrope">Verified Holdings</p>
            <h3 className="text-6xl font-black font-headline text-slate-900 dark:text-white tabular-nums leading-none tracking-tighter">{totalEstates}</h3>
          </div>
          <div className="mt-8 pt-6 border-t border-slate-50 dark:border-slate-800 flex items-center gap-2 text-slate-400 dark:text-slate-500 text-[9px] font-black font-manrope uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-slate-900 dark:bg-white"></span>
            Portfolio Integrity: Verified
          </div>
        </div>

        {/* Global Distribution */}
        <div className="col-span-12 md:col-span-8 bg-slate-900 dark:bg-slate-950 p-10 rounded-3xl relative overflow-hidden text-white group">
          <div className="relative z-10 flex h-full justify-between items-center">
            <div className="space-y-4">
              <p className="text-slate-400 dark:text-slate-500 text-[9px] font-black uppercase tracking-[0.3em] font-manrope">System Reliability</p>
              <h3 className="text-5xl font-black font-headline tabular-nums text-white tracking-tighter leading-none">Optimal</h3>
              <p className="text-white/40 text-[10px] font-bold font-manrope uppercase tracking-widest max-w-[240px] leading-relaxed">Cross-region performance parity maintained.</p>
            </div>
            <div className="grid grid-cols-2 gap-10 pr-4">
                <div>
                  <p className="text-[9px] font-black text-white/40 uppercase tracking-widest font-manrope mb-2">Live Nodes</p>
                  <p className="text-4xl font-black font-headline tabular-nums text-white tracking-tighter leading-none">{activeCount}</p>
                </div>
                <div>
                  <p className="text-[9px] font-black text-white/40 uppercase tracking-widest font-manrope mb-2">Developing</p>
                  <p className="text-4xl font-black font-headline tabular-nums text-blue-400 tracking-tighter leading-none">{developingCount + renovatingCount}</p>
                </div>
            </div>
          </div>
          <div className="absolute right-[-20px] bottom-[-20px] opacity-10 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
            <span className="material-symbols-outlined text-[180px]">security</span>
          </div>
        </div>
      </div>

      {/* ── SUMMARY TAB ─────────────────────────────────────────────────── */}
      {activeTab === 'summary' && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
              {/* KPI Strip */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                  {[
                      { label: 'Asset Portfolio',   value: totalEstates,    icon: 'account_balance', accent: 'text-slate-900 dark:text-white' },
                      { label: 'Active Status',     value: activeCount,     icon: 'verified',       accent: 'text-emerald-500' },
                      { label: 'Pending Review',    value: pendingCount,    icon: 'rule',           accent: 'text-amber-500' },
                  ].map((kpi) => (
                      <div key={kpi.label} className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-300 dark:border-slate-800 transition-all hover:bg-slate-50 dark:hover:bg-slate-800/30">
                          <div className="flex items-center justify-between mb-6">
                              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 font-manrope">{kpi.label}</p>
                              <span className={`material-symbols-outlined text-sm opacity-40 ${kpi.accent}`}>{kpi.icon}</span>
                          </div>
                          <p className={`text-4xl font-black font-headline tabular-nums tracking-tighter ${kpi.accent}`}>{kpi.value}</p>
                      </div>
                  ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                  {/* Status Breakdown */}
                  <div className="md:col-span-5 bg-white dark:bg-slate-900 rounded-[32px] p-10 border border-slate-300 dark:border-slate-800 space-y-10">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500 font-manrope">Distribution Analytics</h3>
                      <div className="space-y-8">
                          {Object.entries({
                              'Active': activeCount,
                              'Pending Approval': pendingCount,
                              'Under Renovation': renovatingCount,
                              'Developing': developingCount,
                          }).map(([status, count]) => (
                              <div key={status} className="space-y-3">
                                  <div className="flex justify-between items-end">
                                      <div className="flex items-center gap-3">
                                          <span className={`w-2 h-2 rounded-full ${statusConfig[status]?.dot || 'bg-slate-300'}`} />
                                          <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest font-manrope">{status}</span>
                                      </div>
                                      <span className="text-xl font-black font-headline tabular-nums text-slate-900 dark:text-white leading-none tracking-tighter">{count}</span>
                                  </div>
                                  <div className="w-full h-1.5 bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden">
                                      <div
                                          className={`h-full rounded-full transition-all duration-1000 ${statusConfig[status]?.dot || 'bg-slate-300'}`}
                                          style={{ width: totalEstates ? `${(count / totalEstates) * 100}%` : '0%' }}
                                      />
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>

                  {/* Subscription Plans */}
                  <div className="md:col-span-4 bg-white dark:bg-slate-900 rounded-[32px] p-10 border border-slate-300 dark:border-slate-800 space-y-10">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500 font-manrope">Licensing Tiers</h3>
                      <div className="space-y-4">
                          {Object.entries(subscriptionBreakdown).map(([plan, count]) => (
                              <div key={plan} className="flex items-center justify-between p-5 bg-slate-50 dark:bg-slate-800/50 rounded-[20px] border border-slate-100 dark:border-slate-800">
                                  <span className="text-[10px] font-black font-manrope text-slate-900 dark:text-white uppercase tracking-widest">{typeof plan === 'object' ? 'Standard' : plan}</span>
                                  <span className="px-3 py-1 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] font-black rounded-lg font-manrope tabular-nums">{count}</span>
                              </div>
                          ))}
                      </div>
                  </div>

                  {/* Regional Spread */}
                  <div className="md:col-span-3 bg-slate-900 dark:bg-slate-950 rounded-[32px] p-10 text-white relative overflow-hidden group space-y-10">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 font-manrope">Tactical Regions</h3>
                      <div className="space-y-6 relative z-10">
                          {Object.entries(regionBreakdown).slice(0, 5).map(([region, count]) => (
                              <div key={region} className="flex justify-between items-end border-b border-white/5 pb-4">
                                  <span className="text-[10px] font-black text-white/60 uppercase tracking-widest truncate max-w-[120px]">{typeof region === 'object' ? 'Central' : region}</span>
                                  <span className="text-xl font-black font-headline tabular-nums text-white leading-none tracking-tighter">{count}</span>
                              </div>
                          ))}
                      </div>
                      <div className="absolute -right-6 -bottom-6 opacity-10 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                          <span className="material-symbols-outlined text-[140px]">public</span>
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* ── DIRECTORY TAB ────────────────────────────────────────────────── */}
      {activeTab === 'directory' && (
          <div className="bg-white dark:bg-slate-900 rounded-[32px] overflow-hidden border border-slate-300 dark:border-slate-800">
            {/* Filter Bar */}
            <div className="px-10 py-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30 flex flex-wrap items-center justify-between gap-6">
                <div className="flex flex-wrap items-center gap-6">
                    <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500 font-manrope">Tactical Filter:</span>
                    <div className="flex flex-wrap gap-2">
                        {["All", "Active", "Pending Approval", "Under Renovation", "Developing"].map((s) => (
                            <button
                                key={s}
                                onClick={() => setFilter(s)}
                                className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest font-manrope transition-all border cursor-pointer ${filter === s ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white shadow-xl' : 'bg-white dark:bg-slate-900 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-700 hover:border-slate-400'}`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>
                <button 
                    onClick={handleExport}
                    className="flex items-center gap-3 px-6 py-2.5 bg-white dark:bg-slate-800 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-700 transition-all cursor-pointer font-manrope border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                >
                    <span className="material-symbols-outlined text-sm">inventory</span>
                    Audit Export
                </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse font-body">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                  {["Asset Identity", "Logistical Deployment", "Operational Status", "Subscription", "Actions"].map((header) => (
                    <th key={header} className="py-6 px-10 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 font-manrope">{header}</th>
                  ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-900 dark:text-white">
                  {estates.filter((estate) => estate.status === filter || filter === "All").map((estate) => {
                    // Defensive location rendering
                    const locationStr = (estate.location && typeof estate.location === 'object') 
                        ? `${estate.location.city || 'N/A'}, ${estate.location.state || 'N/A'}` 
                        : (typeof estate.location === 'string' ? estate.location : (estate.address || 'Unknown'));
                    
                    // Defensive subscription rendering
                    const subPlan = (estate.subscription && typeof estate.subscription === 'object')
                        ? (estate.subscription.plan || 'Standard')
                        : (typeof estate.subscriptionPlan === 'string' ? estate.subscriptionPlan : 'Standard');
                    
                    const subStatus = (estate.subscription && typeof estate.subscription === 'object')
                        ? (estate.subscription.status || 'Active')
                        : 'Active';

                    return (
                      <tr key={estate._id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer">
                        <td className="py-6 px-10">
                          <div className="flex items-center gap-5">
                            <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700 group-hover:scale-105 transition-transform duration-500 shadow-sm">
                              <img
                                className="w-full h-full object-cover"
                                src={estate.image}
                                alt={estate.name}
                              />
                            </div>
                            <div>
                              <p className="font-black text-slate-900 dark:text-white text-base font-headline tracking-tight">{estate.name}</p>
                              <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">{estate._id.toString()}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-6 px-10">
                          <div className="flex flex-col">
                            <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest opacity-80">{locationStr}</span>
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Geospatial verified</span>
                          </div>
                        </td>
                        <td className="py-6 px-10">
                          <span className={`inline-flex items-center px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${statusConfig[estate.status]?.badge || 'bg-slate-100 text-slate-500 border border-slate-200'}`}>
                            {estate.status}
                          </span>
                        </td>
                        <td className="py-6 px-10">
                          <div className="flex flex-col gap-1.5">
                            <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest">{subPlan}</span>
                            <div className="flex items-center gap-2">
                              <div className={`w-1.5 h-1.5 rounded-full ${subStatus === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></div>
                              <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">{subStatus}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-6 px-10 text-right">
                          <Link href={`/dashboard/estates/${estate._id}`} className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-400 hover:bg-slate-900 dark:hover:bg-white hover:text-white dark:hover:text-slate-900 transition-all group-hover:scale-110">
                            <span className="material-symbols-outlined text-lg">arrow_right_alt</span>
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {/* Pagination Footer */}
            <div className="px-10 py-8 bg-slate-50 dark:bg-slate-800/30 flex flex-col md:flex-row justify-between items-center gap-6 text-slate-900 dark:text-white border-t border-slate-100 dark:border-slate-800">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] font-manrope">System: Displaying {estates.filter((e) => e.status === filter || filter === "All").length} / {totalEstates} Global Assets</span>
              <div className="flex gap-2">
                <button className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-400 hover:text-slate-900 transition-all flex items-center justify-center cursor-pointer">
                  <span className="material-symbols-outlined text-lg">chevron_left</span>
                </button>
                <button className="w-10 h-10 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] font-black flex items-center justify-center shadow-xl">1</button>
                <button className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-400 hover:text-slate-900 transition-all flex items-center justify-center cursor-pointer">
                  <span className="material-symbols-outlined text-lg">chevron_right</span>
                </button>
              </div>
            </div>
          </div>
      )}
    </div>
  )
}

export default EstateList