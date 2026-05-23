"use client"
import React from 'react';
import Link from 'next/link';
import { exportToCSV } from '@/lib/exportUtils';

const ResidentRegistry = ({ residents, estateName }) => {
    const handleExport = () => {
        const exportData = residents.map(r => ({
            ID: r.id || r._id,
            Name: r.name,
            Estate: estateName,
            Unit: r.unitNumber || 'Standard'
        }));
        exportToCSV(exportData, `resident_registry_${estateName.toLowerCase().replace(/\s+/g, '_')}`);
    };

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-300 dark:border-slate-800 overflow-hidden">
            <div className="px-10 py-8 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-6 bg-slate-50/50 dark:bg-slate-800/30">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center">
                        <span className="material-symbols-outlined text-xl">groups</span>
                    </div>
                    <div>
                        <h3 className="text-2xl font-black font-headline tracking-tighter text-slate-900 dark:text-white leading-none">Resident Directory</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1 font-manrope">Unified Census Protocol • {residents.length} Entities</p>
                    </div>
                </div>
                <button 
                    onClick={handleExport}
                    className="flex items-center gap-3 px-6 py-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-700 transition-all cursor-pointer font-manrope border border-slate-300 dark:border-slate-700 active:scale-95 group shadow-sm"
                >
                    <span className="material-symbols-outlined text-sm group-hover:translate-y-0.5 transition-transform">download</span>
                    Audit Export
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 dark:bg-slate-800/50">
                            <th className="px-10 py-5 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500 font-manrope border-b border-slate-100 dark:border-slate-800">Identity Identifier</th>
                            <th className="px-10 py-5 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500 font-manrope border-b border-slate-100 dark:border-slate-800">Principal Name</th>
                            <th className="px-10 py-5 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500 font-manrope border-b border-slate-100 dark:border-slate-800 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                        {residents.map((resident, idx) => (
                            <tr key={resident.id || idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors group">
                                <td className="px-10 py-6">
                                    <span className="text-[11px] font-black tabular-nums text-slate-400 dark:text-slate-600 font-manrope tracking-widest uppercase">ID: {resident.id || resident._id || `RES-${idx}`}</span>
                                </td>
                                <td className="px-10 py-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-black text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700 group-hover:bg-slate-900 dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-slate-900 transition-all">
                                            {resident.name?.charAt(0) || 'R'}
                                        </div>
                                        <span className="text-base font-black text-slate-900 dark:text-white tracking-tighter font-headline">{resident.name}</span>
                                    </div>
                                </td>
                                <td className="px-10 py-6 text-right">
                                    <Link href={`/dashboard/activities/${resident.id || resident._id}`} className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 hover:bg-slate-900 dark:hover:bg-white hover:text-white dark:hover:text-slate-900 transition-all border border-transparent hover:border-slate-900 dark:hover:border-white">
                                        <span className="material-symbols-outlined text-lg">arrow_forward</span>
                                    </Link>
                                </td>
                            </tr>
                        ))}
                        {residents.length === 0 && (
                            <tr>
                                <td colSpan="3" className="px-10 py-32 text-center">
                                    <div className="flex flex-col items-center gap-4 opacity-20">
                                        <span className="material-symbols-outlined text-6xl">person_off</span>
                                        <p className="text-[10px] font-black uppercase tracking-[0.4em] font-manrope">No tactical records detected for this holding</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div className="px-10 py-6 bg-slate-50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 flex justify-center">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.3em] font-manrope">The Estate Director • Secure Resident Registry Protocol</p>
            </div>
        </div>
    );
};

export default ResidentRegistry;
