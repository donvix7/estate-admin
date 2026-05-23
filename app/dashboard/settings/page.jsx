'use client';

import React from 'react';

const SettingsPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-8 py-10 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 text-slate-900 dark:text-white">
      {/* Header Context */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-headline">System Settings</h2>
          <p className="text-slate-500 dark:text-slate-400 font-body mt-1">Configure global portfolio parameters and security protocols.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-6 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors rounded-md text-[10px] font-bold uppercase tracking-widest font-manrope text-slate-900 dark:text-white cursor-pointer border border-slate-200 dark:border-slate-700">
            Discard Changes
          </button>
          <button className="px-8 py-2.5 bg-slate-900 dark:bg-slate-800 text-white hover:opacity-90 transition-all rounded-md text-[10px] font-bold uppercase tracking-widest font-manrope shadow-lg cursor-pointer border border-slate-800 dark:border-white/10">
            Save Configuration
          </button>
        </div>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Profile & Branding */}
        <section className="lg:col-span-2 space-y-8">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <h3 className="text-lg font-bold font-headline mb-8 flex items-center gap-3">
              <span className="material-symbols-outlined text-slate-900 dark:text-blue-400">corporate_fare</span>
              Portfolio Identity
            </h3>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest font-manrope">Portfolio Official Name</label>
                  <input 
                    type="text" 
                    defaultValue="The Estate Director Global" 
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-md px-4 py-3 text-sm focus:bg-white dark:focus:bg-slate-900 focus:ring-1 focus:ring-primary/20 transition-all outline-none font-body text-slate-900 dark:text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest font-manrope">Entity Identifier</label>
                  <input 
                    type="text" 
                    defaultValue="ESG-HQ-001" 
                    disabled
                    className="w-full bg-slate-100/50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-md px-4 py-3 text-sm opacity-50 font-body tabular-nums text-slate-900 dark:text-white"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest font-manrope">Operational Base (Timezone)</label>
                <select className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-md px-4 py-3 text-sm focus:bg-white dark:focus:bg-slate-900 focus:ring-1 focus:ring-primary/20 transition-all outline-none appearance-none cursor-pointer font-body text-slate-900 dark:text-white">
                  <option className="bg-white dark:bg-slate-900">(GMT+00:00) London, UK</option>
                  <option className="bg-white dark:bg-slate-900">(GMT-05:00) New York, USA</option>
                  <option className="bg-white dark:bg-slate-900">(GMT+04:00) Dubai, UAE</option>
                  <option className="bg-white dark:bg-slate-900">(GMT+09:00) Tokyo, Japan</option>
                </select>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-700 group cursor-pointer hover:border-primary/50 transition-colors">
                    <span className="material-symbols-outlined text-slate-400 group-hover:text-primary dark:group-hover:text-blue-400">upload_file</span>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest font-manrope">Platform Branding (Logo)</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-3">Upload a high-resolution SVG or PNG (Max 2MB).</p>
                    <button className="text-[10px] font-black text-slate-900 dark:text-blue-400 uppercase tracking-widest hover:underline cursor-pointer font-manrope">Update Asset</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-8 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <h3 className="text-lg font-bold font-headline mb-8 flex items-center gap-3">
              <span className="material-symbols-outlined text-slate-900 dark:text-blue-400">security</span>
              Network & Access Protection
            </h3>
            
            <div className="space-y-6 font-body">
              <div className="flex justify-between items-center py-2">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Multi-Factor Authentication (MFA)</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Require a biometric or TOTP secondary check for all sessions.</p>
                </div>
                <div className="w-12 h-6 bg-slate-900 dark:bg-blue-600 rounded-full relative cursor-pointer shadow-inner">
                  <div className="absolute right-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-md"></div>
                </div>
              </div>

              <div className="flex justify-between items-center py-2 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Session Expiration</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Automatically terminate inactive sessions after a specific period.</p>
                </div>
                <select className="bg-slate-100 dark:bg-slate-800 border-none rounded px-3 py-1.5 text-xs font-bold font-manrope text-slate-900 dark:text-white">
                  <option className="bg-white dark:bg-slate-900">1 Hour</option>
                  <option className="bg-white dark:bg-slate-900">4 Hours</option>
                  <option className="bg-white dark:bg-slate-900">24 Hours</option>
                </select>
              </div>

              <div className="flex justify-between items-center py-2 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">IP Restricted Access</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Limit dashboard accessibility to verified corporate IP ranges.</p>
                </div>
                <div className="w-12 h-6 bg-slate-200 dark:bg-slate-700 rounded-full relative cursor-pointer shadow-inner">
                  <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-md"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Informational / Stats Column */}
        <aside className="lg:col-span-1 space-y-8">
          <div className="bg-slate-900 text-white p-8 rounded-xl shadow-2xl relative overflow-hidden group">
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/5 rounded-full blur-xl group-hover:scale-125 transition-transform duration-1000"></div>
            <div className="relative z-10 space-y-6">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-manrope">Billing Plan</h3>
              <div className="space-y-1">
                <p className="text-2xl font-black font-headline tracking-tighter">Enterprise Elite</p>
                <p className="text-xs text-blue-400 font-bold uppercase tracking-widest font-manrope italic">Full Asset Coverage</p>
              </div>
              <div className="pt-4 space-y-4">
                <div className="flex justify-between text-xs font-bold font-manrope">
                  <span className="text-slate-400">Next Audit</span>
                  <span className="tabular-nums">Jul 12, 2024</span>
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full w-[72%]"></div>
                </div>
              </div>
              <button className="w-full py-3 bg-white text-slate-900 rounded-lg text-[10px] font-bold uppercase tracking-widest font-manrope hover:bg-slate-100 transition-colors cursor-pointer shadow-md active:scale-95">
                Manage Billing
              </button>
            </div>
          </div>

          <div className="bg-slate-100 dark:bg-slate-800 p-6 rounded-xl border border-slate-100 dark:border-slate-800">
            <h4 className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] mb-4 font-manrope text-center">System Version</h4>
            <div className="flex flex-col items-center gap-2">
              <span className="text-3xl font-black font-headline tabular-nums text-slate-900 dark:text-white">4.2.0</span>
              <span className="px-2 py-1 bg-green-50 dark:bg-emerald-950/30 text-green-700 dark:text-emerald-400 text-[8px] font-bold uppercase tracking-widest rounded-md border border-green-100 dark:border-emerald-800/50">STABLE CORE</span>
            </div>
          </div>

          <div className="bg-amber-50 dark:bg-amber-950/20 p-6 rounded-xl border border-amber-100 dark:border-amber-800/50 space-y-4 font-body">
            <div className="flex items-center gap-3 text-amber-900 dark:text-amber-400">
              <span className="material-symbols-outlined text-lg">bolt</span>
              <h4 className="text-[10px] font-bold uppercase tracking-widest font-manrope">Optimization Engine</h4>
            </div>
            <p className="text-[10px] leading-relaxed text-amber-800 dark:text-amber-300 font-medium">Automatic asset data caching is currently enabled for high-performance navigation.</p>
            <button className="text-[10px] font-black text-amber-900 dark:text-amber-400 underline uppercase tracking-widest font-manrope cursor-pointer">Clear Cache</button>
          </div>
        </aside>
      </div>

      {/* Help Section */}
      <footer className="pt-10 border-t border-slate-100 dark:border-slate-800 opacity-60 flex flex-col items-center">
        <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.3em] font-manrope mb-4 text-center">Documentation Center</p>
        <div className="flex gap-8">
          <button className="text-[10px] font-black text-slate-900 dark:text-white hover:text-primary dark:hover:text-blue-400 transition-colors cursor-pointer uppercase tracking-widest font-manrope">Privacy Shield</button>
          <button className="text-[10px] font-black text-slate-900 dark:text-white hover:text-primary dark:hover:text-blue-400 transition-colors cursor-pointer uppercase tracking-widest font-manrope">License Key</button>
          <button className="text-[10px] font-black text-slate-900 dark:text-white hover:text-primary dark:hover:text-blue-400 transition-colors cursor-pointer uppercase tracking-widest font-manrope">System Status</button>
        </div>
      </footer>
    </div>
  );
};

export default SettingsPage;