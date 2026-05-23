import { getLogs, getEstates } from '@/lib/services';
import ActivitiesDirectory from '@/components/ActivitiesDirectory';
import React from 'react';

const ActivitiesPage = async () => {
  const [logs, estates] = await Promise.all([getLogs(), getEstates()]);
  const criticalLogs = logs.filter(log => log.critical);
  return (
    <div className="p-8 space-y-10 max-w-[1600px] mx-auto w-full text-slate-900 dark:text-white">
      {/* Metrics Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="col-span-1 bg-white dark:bg-slate-900 p-6 rounded-xl relative overflow-hidden group border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <span className="material-symbols-outlined text-primary dark:text-blue-400 bg-primary/10 dark:bg-blue-400/10 p-2 rounded-lg">analytics</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold text-xs">+12.5%</span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-xs font-medium uppercase tracking-wider font-manrope">Total Activities</p>
          <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1 font-headline">{logs.length}</h3>
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform duration-500 pointer-events-none text-slate-900 dark:text-white">
            <span className="material-symbols-outlined text-8xl">analytics</span>
          </div>
        </div>
        <div className="col-span-1 bg-white dark:bg-slate-900 p-6 rounded-xl relative overflow-hidden group border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <span className="material-symbols-outlined text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 p-2 rounded-lg">warning</span>
            <span className="text-red-600 dark:text-red-400 font-bold text-xs">Active</span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-xs font-medium uppercase tracking-wider font-manrope">Critical Alerts</p>
          <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1 font-headline">{criticalLogs.length}</h3>
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform duration-500 pointer-events-none text-slate-900 dark:text-white">
            <span className="material-symbols-outlined text-8xl">warning</span>
          </div>
        </div>
        <div className="col-span-2 bg-slate-900 dark:bg-slate-800 p-6 rounded-xl flex items-center justify-between text-white relative overflow-hidden border border-white/10 shadow-lg">
          <div className="z-10">
            <p className="text-white/60 text-xs font-medium uppercase tracking-wider font-manrope">Operational Status</p>
            <h3 className="text-3xl font-extrabold mt-1 font-headline">Optimal</h3>
            <div className="flex gap-2 mt-4">
              {[6, 8, 5, 9, 7].map((h, i) => (
                <div key={i} className="w-1.5 rounded-full bg-emerald-400" style={{ height: `${h * 4}px` }}></div>
              ))}
            </div>
          </div>
          <div className="text-right z-10">
            <div className="text-xs font-medium text-white/60 uppercase mb-2 font-manrope">Uptime</div>
            <div className="text-xl font-bold font-body tabular-nums">99.98%</div>
          </div>
          <div className="absolute inset-0 bg-linear-to-br from-slate-900 to-slate-800/50 pointer-events-none"></div>
        </div>
      </div>

      <ActivitiesDirectory initialLogs={logs} estates={estates} />
    </div>
  );
};

export default ActivitiesPage;