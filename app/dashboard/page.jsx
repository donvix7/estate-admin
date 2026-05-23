import React from 'react';
import Link from 'next/link';
import getEstates, { getLogs } from '@/lib/services';
import { timeAgo } from '@/lib/utils';

const DashboardPage = async () => {

    const estates = await getEstates();
    const logs = await getLogs();

    // Take the last 3 estates from the list (most recently added to the database)
    const recentEstates = estates.slice(-3).reverse();

  return (
    <div className="p-10 max-w-7xl mx-auto space-y-12 text-slate-900 dark:text-white">
      {/* Page Header */}
      <header className="flex flex-col md:flex-row justify-between items-end gap-8 animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="space-y-2">
          <h1 className="text-5xl font-black font-headline tracking-tighter leading-none text-slate-900 dark:text-white">System Command</h1>
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] font-manrope">Architectural Intelligence • Real-time Monitoring Active</p>
        </div>
        <div className="flex gap-4">
          <Link 
            href="/create-new-estate" 
            className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-3.5 rounded-2xl text-[10px] font-black tracking-widest uppercase hover:opacity-90 transition-all flex items-center gap-3"
          >
            <span className="material-symbols-outlined text-sm">add_circle</span>
            Initialize Asset
          </Link>
          <Link 
            href="/generate-report" 
            className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 px-8 py-3.5 rounded-2xl text-[10px] font-black tracking-widest uppercase hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center gap-3"
          >
            <span className="material-symbols-outlined text-sm text-slate-400">analytics</span>
            Audit Report
          </Link>
        </div>
      </header>

      {/* Top Metrics Bento */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-300 dark:border-slate-800 border-l-4 border-l-slate-900 dark:border-l-white transition-transform hover:scale-[1.02] duration-500">
          <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] mb-4 font-manrope">Verified Portfolio</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-5xl font-black text-slate-900 dark:text-white font-headline tracking-tighter leading-none">{estates.length}</h3>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Holdings</span>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-300 dark:border-slate-800 transition-transform hover:scale-[1.02] duration-500">
          <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] mb-4 font-manrope">System Throughput</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-5xl font-black text-slate-900 dark:text-white font-headline tracking-tighter leading-none">{logs.length}</h3>
            <div className="flex items-center gap-1 text-[10px] font-black text-emerald-500 uppercase tracking-widest ml-2 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Nominal
            </div>
          </div>
        </div>
        <div className="md:col-span-2 bg-slate-900 dark:bg-slate-950 p-8 rounded-3xl text-white relative overflow-hidden group">
          <div className="relative z-10 flex h-full items-center justify-between">
            <div className="space-y-4">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] font-manrope">Threat Intelligence</p>
                <div className="flex items-center gap-6">
                    <h3 className="text-5xl font-black font-headline text-white tracking-tighter leading-none">{logs.filter(log => log.critical === true).length}</h3>
                    <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-widest text-red-500">Critical Vectors Detected</p>
                        <p className="text-[10px] font-bold text-slate-400 max-w-[180px]">Immediate architectural resolution required for flagged assets.</p>
                    </div>
                </div>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500">
                <span className="material-symbols-outlined text-3xl fill-1">crisis_alert</span>
            </div>
          </div>
          <div className="absolute right-[-20px] bottom-[-20px] opacity-10 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
            <span className="material-symbols-outlined text-[150px]">verified_user</span>
          </div>
        </div>
      </div>

      {/* Asymmetric Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Main Column */}
        <div className="lg:col-span-8 space-y-12">
          {/* Performance Visualization */}
          <section className="bg-white dark:bg-slate-900 p-10 rounded-[32px] border border-slate-300 dark:border-slate-800">
            <div className="flex justify-between items-center mb-10">
              <div className="space-y-1">
                <h4 className="text-xl font-black text-slate-900 dark:text-white font-headline tracking-tighter">Tactical Performance</h4>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Portfolio Revenue vs. Operational Overhead</p>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-slate-900 dark:bg-white shadow-[0_0_8px_rgba(0,0,0,0.3)]"></span>
                    <span className="text-[9px] font-black text-slate-900 dark:text-white uppercase tracking-widest">Yield</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700"></span>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Costs</span>
                </div>
              </div>
            </div>
            <div className="h-64 flex items-end justify-between gap-4 px-4 relative">
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-5">
                    {[1,2,3,4].map(i => <div key={i} className="w-full h-px bg-slate-900 dark:bg-white"></div>)}
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-t-xl h-[40%] transition-all hover:bg-slate-200 dark:hover:bg-slate-700"></div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-t-xl h-[65%] transition-all hover:bg-slate-200 dark:hover:bg-slate-700"></div>
                <div className="w-full bg-slate-900 dark:bg-white rounded-t-xl h-[85%] transition-all hover:opacity-80 shadow-2xl"></div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-t-xl h-[55%] transition-all hover:bg-slate-200 dark:hover:bg-slate-700"></div>
                <div className="w-full bg-slate-900 dark:bg-white rounded-t-xl h-[95%] transition-all hover:opacity-80 shadow-2xl"></div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-t-xl h-[70%] transition-all hover:bg-slate-200 dark:hover:bg-slate-700"></div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-t-xl h-[60%] transition-all hover:bg-slate-200 dark:hover:bg-slate-700"></div>
            </div>
            <div className="flex justify-between mt-6 px-4 text-[9px] uppercase font-black text-slate-400 tracking-[0.3em] font-manrope">
              <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span>
            </div>
          </section>

          {/* Recently Created Estates List */}
          <section className="space-y-6">
            <div className="flex justify-between items-end px-4">
              <div className="space-y-1">
                <h4 className="text-2xl font-black text-slate-900 dark:text-white font-headline tracking-tighter leading-none">Asset Registry</h4>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest font-manrope">Recently Commissioned Holdings</p>
              </div>
              <Link className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest hover:gap-3 transition-all flex items-center gap-2 group" href="/dashboard/estates">
                Expand Full Portfolio
                <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </Link>
            </div>
            
            <div className="bg-white dark:bg-slate-900 rounded-[32px]  border border-slate-300 dark:border-slate-800">
              <div className="">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                    <tr className="text-slate-400 dark:text-slate-500 uppercase text-[10px] font-black tracking-[0.2em] font-manrope">
                      {['Asset Identity', 'Deployment Location', 'Manager', 'Status'].map((header) => (
                        <th key={header} className="px-10 py-6">{header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                    {recentEstates.map((estate) => {
                      const locationStr = (estate.location && typeof estate.location === 'object') 
                        ? `${estate.location.city}, ${estate.location.state}` 
                        : (estate.location || estate.address || 'Pending');
                      
                      return (
                        <tr key={estate._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group cursor-pointer">
                          <td className="px-10 py-8">
                            <Link href={`/dashboard/estates/${estate._id}`} className="flex items-center gap-5">
                              <div className="w-14 h-14 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 group-hover:scale-105 transition-transform duration-700 shadow-sm">
                                <img 
                                  src={estate.image} 
                                  alt={estate.name} 
                                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all"
                                />
                              </div>
                              <div>
                                <span className="text-base font-black text-slate-900 dark:text-white font-headline tracking-tight group-hover:text-primary transition-all">{estate.name}</span>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Asset Verified</p>
                              </div>
                            </Link>
                          </td>
                          <td className="px-10 py-8">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest opacity-80">{locationStr}</span>
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Tactical Geo-link</span>
                            </div>
                          </td>
                          <td className="px-10 py-8 text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest">
                             {typeof estate.manager === 'object' ? (estate.manager.name || estate.manager.email || 'Asset Manager') : (estate.manager || 'N/A')}
                          </td>
                          <td className="px-10 py-8">
                            <span className={`inline-flex px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${estate.status === 'Active' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'} border border-black/5`}>
                              {estate.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {recentEstates.length === 0 && (
                <div className="p-24 text-center">
                  <span className="material-symbols-outlined text-6xl text-slate-100 dark:text-slate-800 mb-6">folder_off</span>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">No asset data currently indexed.</p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-4 space-y-12">
          <section className="bg-white dark:bg-slate-900 p-10 rounded-[32px] border border-slate-300 dark:border-slate-800 space-y-10">
            <div className="space-y-1">
                <h4 className="text-xl font-black text-slate-900 dark:text-white font-headline tracking-tighter">Operational Alerts</h4>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Logistical Queue Status</p>
            </div>
            <div className="space-y-8 font-manrope">
              <div className="flex gap-6 group">
                <div className="w-3 h-3 rounded-full bg-red-500 mt-1 shrink-0 shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
                <div>
                  <p className="text-sm font-black text-slate-900 dark:text-white tracking-tight uppercase">Audit Required</p>
                  <p className="text-[11px] font-bold text-slate-400 mt-1 leading-relaxed">3 new registrations require immediate document verification.</p>
                  <button className="mt-4 text-[9px] font-black uppercase tracking-widest text-slate-900 dark:text-white border-b-2 border-slate-900 dark:border-white pb-0.5 hover:pb-1 transition-all">Execute Review</button>
                </div>
              </div>
              <div className="flex gap-6 group opacity-80">
                <div className="w-3 h-3 rounded-full bg-amber-500 mt-1 shrink-0"></div>
                <div>
                  <p className="text-sm font-black text-slate-900 dark:text-white tracking-tight uppercase">System Patching</p>
                  <p className="text-[11px] font-bold text-slate-400 mt-1 leading-relaxed">Network architecture upgrade v4.2 scheduled for 02:00 UTC.</p>
                  <button className="mt-4 text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">Defer Update</button>
                </div>
              </div>
            </div>
          </section>

          <div className="bg-slate-900 dark:bg-white p-10 rounded-[32px] text-white dark:text-slate-900 relative overflow-hidden group shadow-2xl">
            <div className="relative z-10 space-y-4">
              <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400">Tactical Insight</p>
              <h4 className="text-3xl font-black font-headline tracking-tighter leading-none">Director's Global Feed</h4>
              <p className="text-xs font-bold opacity-60 leading-relaxed font-manrope">Premium portfolio analytics and regional yield tracking are now fully operational for all enterprise-tier estates.</p>
              <button className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-xl">Deploy Analytics</button>
            </div>
            <span className="material-symbols-outlined absolute -bottom-8 -right-8 text-white/10 dark:text-slate-900/10 text-[180px] group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-1000">hub</span>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default DashboardPage;