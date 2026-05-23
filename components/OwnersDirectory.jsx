"use client"
import React, { useState } from 'react';
import Link from 'next/link';
import { exportToCSV } from '@/lib/exportUtils';
import { formatDate } from '@/lib/utils';

const OwnersDirectory = ({ initialOwners, initialLogs, regionalStats, estates,  }) => {
    const [typeFilter, setTypeFilter] = useState("All Entities");
    const [regionFilter, setRegionFilter] = useState("Global");
    const [statusFilter, setStatusFilter] = useState("Any Status");

    // Helper: Calculate total residents for a specific owner
    const getResidentsForOwner = (owner) => {
        if (!estates || !residents) return 0;
        // Match estates by owner name
        const ownerEstates = estates.filter(e => e.owner?.name?.trim() === owner.name?.trim());
        const estateIds = ownerEstates.map(e => e.id);
        // Match residents by estateId
        const ownerResidents = residents.filter(r => estateIds.includes(r.estateId));
        return ownerResidents.length;
    };

    // Filtering logic
    const filteredOwners = initialOwners.filter(owner => {
        const matchesType = typeFilter === "All Entities" || owner.type === typeFilter;
        
        // Region mapping logic (matching the server-side logic in the original page)
        const location = owner.nationality || owner.desc || 'Other';
        let region = 'Global';
        if (location.includes('USA') || location.includes('America') || location.includes('New York')) region = 'North America';
        else if (location.includes('Europe') || location.includes('London') || location.includes('Paris') || location.includes('Geneva')) region = 'Western Europe';
        else if (location.includes('Nigeria') || location.includes('Africa')) region = 'Africa';
        else if (location.includes('Asia')) region = 'Asia Pacific';
        
        const matchesRegion = regionFilter === "Global" || region === regionFilter;
        const matchesStatus = statusFilter === "Any Status" || owner.status === statusFilter || (statusFilter === "Critical" && owner.status === "Critical Review");

        return matchesType && matchesRegion && matchesStatus;
    });

    const handleExport = () => {
        const exportData = filteredOwners.map(owner => ({
            Name: owner.name,
            Type: owner.type,
            Nationality: owner.nationality,
            Residents: getResidentsForOwner(owner),
            JoinDate: owner.date,
            Status: owner.status
        }));
        exportToCSV(exportData, 'owners_metadata');
    };

    const statusColor = (status) => {
        switch (status) {
            case 'Active':          return 'bg-emerald-500';
            case 'Dormant':         return 'bg-slate-400';
            case 'Critical Review': return 'bg-red-500';
            case 'Pending':         return 'bg-amber-500';
            default:                return 'bg-slate-400';
        }
    };

    return (
        <div className="space-y-10">
            {/* Table Controls */}
            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-slate-300 dark:border-slate-800">
                <div className="flex flex-wrap items-center gap-4 text-slate-900 dark:text-white">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-900 rounded border border-slate-300 dark:border-slate-800 transition-all focus-within:ring-1 focus-within:ring-primary/20">
                        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest font-manrope opacity-60">Type</span>
                        <select 
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                            className="bg-transparent border-none text-xs font-bold focus:ring-0 p-0 pr-6 cursor-pointer appearance-none text-on-surface"
                        >{["All Entities", "Individual", "Corporate"].map((type, i) => (
                            <option key={i} className="bg-white dark:bg-slate-900">{type}</option>
                        ))}
                        </select>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-900 rounded border border-slate-300 dark:border-slate-800 transition-all focus-within:ring-1 focus-within:ring-primary/20">
                        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest font-manrope opacity-60">Region</span>
                        <select 
                            value={regionFilter}
                            onChange={(e) => setRegionFilter(e.target.value)}
                            className="bg-transparent border-none text-xs font-bold focus:ring-0 p-0 pr-6 cursor-pointer appearance-none text-on-surface"
                        >{["Global", "North America", "Europe", "Western Europe", "Africa", "Asia Pacific"].map((region, i) => (
                            <option key={i} className="bg-white dark:bg-slate-900">{region}</option>
                        ))}
                        </select>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-900 rounded border border-slate-300 dark:border-slate-800 transition-all focus-within:ring-1 focus-within:ring-primary/20">
                        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest font-manrope opacity-60">Status</span>
                        <select 
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="bg-transparent border-none text-xs font-bold focus:ring-0 p-0 pr-6 cursor-pointer appearance-none text-on-surface"
                        >
                            {["Any Status", "Active", "Dormant", "Critical", "Pending"].map((status, i) => (
                                <option key={i} className="bg-white dark:bg-slate-900">{status}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest font-manrope opacity-60">Showing {filteredOwners.length} Entities</span>
                    <div className="flex gap-1 ml-4">
                        <button className="w-8 h-8 flex items-center justify-center bg-surface-container-lowest rounded hover:bg-surface-container-high transition-all shadow-sm border border-outline-variant/10 active:scale-90 cursor-pointer">
                            <span className="material-symbols-outlined text-sm">chevron_left</span>
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center bg-surface-container-lowest rounded hover:bg-surface-container-high transition-all shadow-sm border border-outline-variant/10 active:scale-90 cursor-pointer">
                            <span className="material-symbols-outlined text-sm">chevron_right</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* High-Density Table */}
            <div className="bg-white dark:bg-slate-900 rounded-xl  overflow-hidden border border-slate-300 dark:border-slate-800 ">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-manrope border-b border-slate-300 dark:border-slate-800">
                            {['Name & Identity', 'Type', 'Residents', 'Joined Date', 'Actions'].map((header, i) => (
                                <th key={i} className="px-8 py-5 text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500">{header}</th>
                            ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant/5">
                            {filteredOwners.map((owner, i) => {
                                const residentCount = getResidentsForOwner(owner);
                                return (
                                    <tr key={owner.id || i} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group text-slate-700 dark:text-slate-300">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold transition-transform group-hover:scale-105 shadow-sm border border-slate-100 dark:border-slate-800 ${owner.type === 'Corporate' ? 'bg-primary-container text-white' : 'bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500'}`}>
                                                    {owner.type === 'Corporate' ? (
                                                        <span className="material-symbols-outlined text-lg">business</span>
                                                    ) : (
                                                        owner.name.split(' ').slice(0,2).map(n => n[0]).join('')
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">{owner.name}</p>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 font-manrope uppercase tracking-widest opacity-60">{owner.desc}</p>
                                                        <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700 opacity-40"></span>
                                                        <p className="text-[9px] font-black text-slate-400 dark:text-slate-600 font-manrope uppercase tracking-widest">ID: {owner._id}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-widest font-manrope ${owner.type || owner.role === 'Corporate' ? 'bg-primary/10 text-primary dark:text-blue-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}`}>{owner.type}</span>
                                        </td>
                                        <td className="px-8 py-5 text-right font-headline text-sm font-black tabular-nums tracking-tighter text-slate-900 dark:text-white">
                                            {residentCount} {residentCount === 1 ? 'Resident' : 'Residents'}
                                        </td>
                                        
                                        <td className="px-8 py-5 text-[10px] font-bold text-slate-400 dark:text-slate-500 font-manrope uppercase tracking-widest opacity-60">{formatDate(owner.createdAt)}</td>
                                       
                                        <td className="px-8 py-5 text-right">
                                          <Link href={`/dashboard/estate-owners/${owner._id}`}>
                                            <button className="px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest dark:text-primary  hover:bg-primary/5 rounded transition-all cursor-pointer border border-primary/20">
                                                view
                                            </button>
                                          </Link>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                <div className="p-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center bg-slate-50/50 dark:bg-slate-900/50">
                    <button 
                        onClick={handleExport}
                        className="text-[10px] font-black text-slate-500 dark:text-slate-400 hover:text-primary transition-all flex items-center gap-3 uppercase tracking-[0.2em] font-manrope cursor-pointer active:scale-95"
                    >
                        Export Global Metadata
                        <span className="material-symbols-outlined text-[14px]">download</span>
                    </button>
                </div>
            </div>

            
        </div>
    );
};

export default OwnersDirectory;
