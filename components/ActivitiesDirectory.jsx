"use client"
import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { exportToCSV } from '@/lib/exportUtils';
import { formatDate } from '@/lib/utils';

const ActivitiesDirectory = ({ initialLogs, estates }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [estateFilter, setEstateFilter] = useState("All Estates");
    const [typeFilter, setTypeFilter] = useState("Activity Type");
    const [dateRange, setDateRange] = useState("All Time");

    // Filtering Logic
    const filteredLogs = useMemo(() => {
        return initialLogs.filter(log => {
            // ... (rest of filtering logic)
            const matchesSearch = !searchQuery || 
                log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
                log.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                log.location.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesEstate = estateFilter === "All Estates" || log.location === estateFilter;
            const matchesType = typeFilter === "Activity Type" || log.type === typeFilter;

            let matchesDate = true;
            if (dateRange !== "All Time") {
                const logDate = new Date(log.date);
                const now = new Date();
                const diffTime = Math.abs(now - logDate);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                
                if (dateRange === "Last 7 Days") matchesDate = diffDays <= 7;
                else if (dateRange === "Last 30 Days") matchesDate = diffDays <= 30;
                else if (dateRange === "Last 24 Hours") matchesDate = diffDays <= 1;
            }

            return matchesSearch && matchesEstate && matchesType && matchesDate;
        });
    }, [initialLogs, searchQuery, estateFilter, typeFilter, dateRange]);

    const handleExport = () => {
        const exportData = filteredLogs.map(({ _id, type, subType, location, user, date, time }) => ({
            ID: _id,
            Type: type,
            Category: subType,
            Estate: location,
            User: user,
            Date: date,
            Time: time
        }));
        exportToCSV(exportData, 'activities_log');
    };

    const criticalLogs = filteredLogs.filter(log => log.critical);

    return (
        <div className="space-y-10">
            {/* Page Header (Moved here for functionality) */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 text-slate-900 dark:text-white">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white font-headline leading-none">Centralized Logs</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-body mt-2 text-sm">Real-time audit trail of all architectural and operational activities.</p>
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={handleExport}
                        className="bg-slate-100 dark:bg-slate-800 px-4 py-2 text-xs font-bold tracking-widest uppercase rounded-md text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer font-manrope shadow-sm active:scale-95 border border-slate-200 dark:border-slate-700"
                    >
                        Export CSV
                    </button>
                    <button 
                        onClick={() => window.location.reload()}
                        className="bg-primary-gradient px-4 py-2 text-xs font-bold tracking-widest uppercase rounded-md text-white shadow-lg hover:opacity-90 transition-all cursor-pointer font-manrope active:scale-95"
                    >
                        Refresh Logs
                    </button>
                </div>
            </div>

            <section className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800">
                {/* Filters Bar */}
                <div className="p-6 bg-slate-50 dark:bg-slate-800/50 flex flex-wrap gap-4 items-center">
                    {/* Search Input */}
                    <div className="flex-1 min-w-[240px]">
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
                            <input 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-md text-sm focus:ring-1 focus:ring-primary/20 font-body placeholder:text-slate-400 outline-none transition-all text-slate-900 dark:text-white" 
                                placeholder="Search logs (user, type, location)..." 
                                type="text" 
                            />
                        </div>
                    </div>

                    {/* Dropdown Filters */}
                    <div className="flex flex-wrap gap-3">
                        {/* Estate Filter */}
                        <div className="relative group">
                            <select 
                                value={estateFilter}
                                onChange={(e) => setEstateFilter(e.target.value)}
                                className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-md py-2.5 pl-4 pr-10 text-xs font-bold uppercase tracking-widest font-manrope focus:ring-1 focus:ring-primary/20 cursor-pointer appearance-none outline-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236B7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-size-[1.25rem_1.25rem] bg-position-[right_0.5rem_center] bg-no-repeat shadow-sm text-slate-900 dark:text-white"
                            >
                                <option className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">All Estates</option>
                                {estates.map(e => <option key={e._id} value={e.name} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">{e.name}</option>)}
                            </select>
                        </div>

                        {/* Activity Type Filter */}
                        <div className="relative group">
                            <select 
                                value={typeFilter}
                                onChange={(e) => setTypeFilter(e.target.value)}
                                className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-md py-2.5 pl-4 pr-10 text-xs font-bold uppercase tracking-widest font-manrope focus:ring-1 focus:ring-primary/20 cursor-pointer appearance-none outline-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236B7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-size-[1.25rem_1.25rem] bg-position-[right_0.5rem_center] bg-no-repeat shadow-sm text-slate-900 dark:text-white"
                            >
                                <option className="bg-white dark:bg-slate-900">Activity Type</option>
                                <option className="bg-white dark:bg-slate-900">Security</option>
                                <option className="bg-white dark:bg-slate-900">Maintenance</option>
                                <option className="bg-white dark:bg-slate-900">Financial</option>
                                <option className="bg-white dark:bg-slate-900">Administrative</option>
                            </select>
                        </div>

                        {/* Date Range Selector */}
                        <div className="relative group">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 dark:text-slate-400 z-10">calendar_today</span>
                            <select 
                                value={dateRange}
                                onChange={(e) => setDateRange(e.target.value)}
                                className="pl-9 pr-8 py-2.5 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-md text-xs font-bold uppercase tracking-widest font-manrope focus:ring-1 focus:ring-primary/20 cursor-pointer appearance-none outline-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236B7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-size-[1.25rem_1.25rem] bg-position-[right_0.5rem_center] bg-no-repeat shadow-sm text-slate-900 dark:text-white"
                            >
                                <option className="bg-white dark:bg-slate-900">All Time</option>
                                <option className="bg-white dark:bg-slate-900">Last 24 Hours</option>
                                <option className="bg-white dark:bg-slate-900">Last 7 Days</option>
                                <option className="bg-white dark:bg-slate-900">Last 30 Days</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Log Table */}
                <div className="overflow-x-auto min-h-[500px]">
                    <table className="w-full text-left border-collapse font-body">
                        <thead>
                            <tr className="text-slate-500 dark:text-slate-400 uppercase text-[10px] font-bold tracking-[0.15em] bg-slate-50/50 dark:bg-slate-800/30">
                                <th className="px-8 py-5">Status & Type</th>
                                <th className="px-6 py-5">Estate Location</th>
                                <th className="px-6 py-5">Involved User</th>
                                <th className="px-6 py-5">Timestamp</th>
                                <th className="px-8 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-100 dark:divide-slate-800">
                            {filteredLogs.map((log) => (
                                <tr key={log._id} className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group cursor-pointer ${log.critical ? 'border-l-4 border-red-600 dark:border-red-400' : ''}`}>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-8 h-8 rounded-md flex items-center justify-center ${log.iconColor}`}>
                                                <span className="material-symbols-outlined text-sm">{log.icon}</span>
                                            </div>
                                            <div>
                                                <Link href={`/dashboard/activities/${log._id}`} className="text-sm font-bold text-slate-900 dark:text-white font-headline tracking-tight hover:text-primary dark:hover:text-blue-400 hover:underline transition-all">{log.type}</Link>
                                                <p className={`text-[11px] ${log.critical ? 'text-red-600 dark:text-red-400 font-semibold uppercase tracking-tight' : 'text-slate-500 dark:text-slate-400'}`}>{log.subType}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 text-sm font-medium text-slate-500 dark:text-slate-400">
                                        {log.location}
                                    </td>
                                    <td className="px-6 py-6">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-black text-slate-500 dark:text-slate-400 shadow-xs">{log.userInitials}</div>
                                            <span className="text-sm text-slate-900 dark:text-white font-medium">{log.user}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6">
                                        <p className="text-sm text-slate-900 dark:text-white font-medium font-body">{formatDate(log.date)}</p>
                                        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-body">{log.time}</p>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        {log.critical ? (
                                            <Link href={`/dashboard/activities/${log._id}`} className="inline-block bg-red-100/30 dark:bg-red-400/10 px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-widest text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-400/20 transition-colors cursor-pointer font-manrope">
                                                Review
                                            </Link>
                                        ) : (
                                            <Link href={`/dashboard/activities/${log._id}`} className="inline-block text-primary hover:bg-primary/5 p-2 rounded-md transition-all cursor-pointer">
                                                <span className="material-symbols-outlined text-lg">{log.actionLabel}</span>
                                            </Link>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {filteredLogs.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-8 py-20 text-center">
                                        <div className="opacity-20 mb-4 flex justify-center text-slate-400">
                                            <span className="material-symbols-outlined text-6xl">search_off</span>
                                        </div>
                                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em]">No logs found matching your criteria.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Adjusted Pagination View */}
                <div className="px-8 py-6 bg-white dark:bg-slate-900 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold uppercase tracking-widest font-manrope text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800">
                    <span>Showing {filteredLogs.length} of {initialLogs.length} Activities</span>
                    <div className="flex gap-1">
                        <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-all shadow-sm border border-slate-200 dark:border-slate-700 cursor-pointer active:scale-90 text-slate-900 dark:text-white"><span className="material-symbols-outlined text-sm">chevron_left</span></button>
                        <button className="w-8 h-8 flex items-center justify-center rounded bg-slate-900 dark:bg-slate-800 text-white shadow-md active:scale-90 cursor-pointer transition-all">1</button>
                        <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-all shadow-sm border border-slate-200 dark:border-slate-700 cursor-pointer active:scale-90 text-slate-900 dark:text-white"><span className="material-symbols-outlined text-sm">chevron_right</span></button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ActivitiesDirectory;
