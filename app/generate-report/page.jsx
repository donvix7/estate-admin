'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { getEstates, getLogs, getPayments } from '@/lib/services';
import { exportToCSV } from '@/lib/exportUtils';

export default function GenerateReportPage() {

    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [estates, setEstates] = useState([]);
    const [logs, setLogs] = useState([]);
    const [payments, setPayments] = useState([]);
    const [selectedEstates, setSelectedEstates] = useState([]);
    const [reportType, setReportType] = useState('audit');
    const [timeframe, setTimeframe] = useState('7d');
    const [startDate, setStartDate] = useState('2024-05-14');
    const [endDate, setEndDate] = useState('2024-05-21');
    const [format, setFormat] = useState('pdf');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        
        const fetchData = async () => {
            const [estatesData, logsData, paymentsData] = await Promise.all([
                getEstates(),
                getLogs(),
                getPayments()
            ]);
            setEstates(estatesData);
            setLogs(logsData);
            setPayments(paymentsData);
            setSelectedEstates(estatesData.map(e => e.id)); // Default to all
        };
        fetchData();
    }, []);

    const filteredLogs = useMemo(() => {
        return logs.filter(log => {
            const matchesScope = selectedEstates.includes(log.estateId);
            if (!matchesScope) return false;

            const content = `${log.type} ${log.subType} ${log.location}`.toLowerCase();
            
            if (reportType === 'audit') return true;
            if (reportType === 'financial') {
                return content.includes('financial') || content.includes('payment') || content.includes('rent') || content.includes('ledger') || content.includes('transaction') || content.includes('amount') || content.includes('budget');
            }
            if (reportType === 'security') {
                return content.includes('security') || content.includes('breach') || content.includes('access') || content.includes('guard') || content.includes('patrol') || content.includes('gate') || content.includes('alert');
            }
            if (reportType === 'maintenance') {
                return content.includes('maintenance') || content.includes('repair') || content.includes('hvac') || content.includes('plumbing') || content.includes('electrical') || content.includes('failure') || content.includes('upgrade');
            }
            return true;
        });
    }, [logs, selectedEstates, reportType]);

    const stats = useMemo(() => {
        const critical = filteredLogs.filter(l => l.critical || l.status === 'Critical').length;
        return {
            totalLogs: filteredLogs.length,
            criticalAlerts: critical,
            activeAssets: selectedEstates.length
        };
    }, [filteredLogs, selectedEstates]);

    const handleToggleEstate = (id) => {
        setSelectedEstates(prev => 
            prev.includes(id) ? prev.filter(eid => eid !== id) : [...prev, id]
        );
    };

    const handleExport = () => {
        if (format === 'csv') {
            const exportData = filteredLogs.map(l => ({ 
                Date: l.date, 
                Time: l.time, 
                Type: l.type, 
                Location: l.location, 
                Details: l.subType,
                EstateID: l.estateId
            }));
            exportToCSV(exportData, `report_${reportType}_${new Date().toISOString().split('T')[0]}`);
        } else if (format === 'pdf') {
            if (isPreviewOpen) {
                window.print();
            } else {
                setIsPreviewOpen(true);
            }
        } else {
            setIsPreviewOpen(true);
        }
    };
    return (
        <div className="bg-surface text-on-surface min-h-screen font-body antialiased">
            {/* SideNavBar Component */}
            

            {/* Main Content Area */}
            <main className="min-h-screen flex flex-col">
                {/* TopNavBar Component */}
                <header className="fixed top-0 left-0 right-0 h-16 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/20 dark:border-slate-800/20">
                    <div className="max-w-7xl mx-auto w-full h-full flex items-center justify-between px-8">
                        <div className="flex items-center flex-1 max-w-md">
                            <div className="relative w-full">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
                                <input className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary transition-all outline-none font-body" placeholder="Search portfolio records..." type="text"/>
                            </div>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-4 text-slate-500">
                                <button className="hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer">
                                    <span className="material-symbols-outlined">notifications</span>
                                </button>
                                <button className="hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer">
                                    <span className="material-symbols-outlined">help_outline</span>
                                </button>
                            </div>
                            <div className="h-8 w-px bg-slate-200/50"></div>
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 font-headline">Generate Report</span>
                                <span className="material-symbols-outlined text-slate-400">description</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Canvas Body */}
                <div className="mt-16 p-8 flex-1 bg-surface max-w-7xl mx-auto w-full">
                    {/* Breadcrumbs */}
                    <div className="mb-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant font-manrope">
                        <Link href="/dashboard" className="hover:text-primary transition-colors">Reports</Link>
                        <span className="material-symbols-outlined text-[10px]">chevron_right</span>
                        <span className="text-primary">New Generation Request</span>
                    </div>

                    <div className="grid grid-cols-12 gap-10">
                        {/* Left Column: Configuration Matrix */}
                        <div className="col-span-12 lg:col-span-7 space-y-10">
                            {/* Report Type Selection */}
                            <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                                <div className="mb-6">
                                    <h2 className="font-headline text-3xl font-extrabold tracking-tight text-on-surface">Report Type</h2>
                                    <p className="text-on-surface-variant mt-1 font-body font-medium">Select the architectural data focus for this export.</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Type Card */}
                                    <label className="group relative cursor-pointer">
                                        <input 
                                            checked={reportType === 'audit'}
                                            onChange={() => setReportType('audit')}
                                            className="peer sr-only" name="report_type" type="radio"
                                        />
                                        <div className="p-6 h-full rounded-xl bg-surface-container-lowest border-2 border-transparent peer-checked:border-primary peer-checked:ring-4 peer-checked:ring-primary/5 transition-all duration-300 shadow-sm whisper-shadow">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="p-2.5 bg-surface-container-high rounded-xl group-hover:bg-primary group-hover:text-white transition-all shadow-inner">
                                                    <span className="material-symbols-outlined">history</span>
                                                </div>
                                                <div className="opacity-0 peer-checked:opacity-100 transition-opacity">
                                                    <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                                                </div>
                                            </div>
                                            <h3 className="font-headline font-bold text-on-surface text-lg">Full Audit Trail</h3>
                                            <p className="text-xs text-on-surface-variant mt-2 leading-relaxed font-body font-medium opacity-80">Complete log of all administrative actions, entry points, and system modifications across the selected scope.</p>
                                        </div>
                                    </label>
                                    <label className="group relative cursor-pointer">
                                        <input 
                                            checked={reportType === 'financial'}
                                            onChange={() => setReportType('financial')}
                                            className="peer sr-only" name="report_type" type="radio"
                                        />
                                        <div className="p-6 h-full rounded-xl bg-surface-container-lowest border-2 border-transparent peer-checked:border-primary peer-checked:ring-4 peer-checked:ring-primary/5 transition-all duration-300 shadow-sm whisper-shadow">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="p-2.5 bg-surface-container-high rounded-xl group-hover:bg-primary group-hover:text-white transition-all shadow-inner">
                                                    <span className="material-symbols-outlined">account_balance_wallet</span>
                                                </div>
                                                <div className="opacity-0 peer-checked:opacity-100 transition-opacity">
                                                    <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                                                </div>
                                            </div>
                                            <h3 className="font-headline font-bold text-on-surface text-lg">Financial Ledger</h3>
                                            <p className="text-xs text-on-surface-variant mt-2 leading-relaxed font-body font-medium opacity-80">Detailed breakdown of revenue, maintenance costs, service fees, and pending owner disbursements.</p>
                                        </div>
                                    </label>
                                    <label className="group relative cursor-pointer">
                                        <input 
                                            checked={reportType === 'security'}
                                            onChange={() => setReportType('security')}
                                            className="peer sr-only" name="report_type" type="radio"
                                        />
                                        <div className="p-6 h-full rounded-xl bg-surface-container-lowest border-2 border-transparent peer-checked:border-primary peer-checked:ring-4 peer-checked:ring-primary/5 transition-all duration-300 shadow-sm whisper-shadow">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="p-2.5 bg-surface-container-high rounded-xl group-hover:bg-primary group-hover:text-white transition-all shadow-inner">
                                                    <span className="material-symbols-outlined">security</span>
                                                </div>
                                                <div className="opacity-0 peer-checked:opacity-100 transition-opacity">
                                                    <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                                                </div>
                                            </div>
                                            <h3 className="font-headline font-bold text-on-surface text-lg">Security Incidents</h3>
                                            <p className="text-xs text-on-surface-variant mt-2 leading-relaxed font-body font-medium opacity-80">Inventory of flagged alerts, breach attempts, and on-site patrol reports for the specified duration.</p>
                                        </div>
                                    </label>
                                    <label className="group relative cursor-pointer">
                                        <input 
                                            checked={reportType === 'maintenance'}
                                            onChange={() => setReportType('maintenance')}
                                            className="peer sr-only" name="report_type" type="radio"
                                        />
                                        <div className="p-6 h-full rounded-xl bg-white dark:bg-slate-900 border-2 border-transparent peer-checked:border-primary peer-checked:ring-4 peer-checked:ring-primary/5 transition-all duration-300 shadow-sm whisper-shadow">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl group-hover:bg-primary group-hover:text-white transition-all shadow-inner">
                                                    <span className="material-symbols-outlined">handyman</span>
                                                </div>
                                                <div className="opacity-0 peer-checked:opacity-100 transition-opacity">
                                                    <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                                                </div>
                                            </div>
                                            <h3 className="font-headline font-bold text-slate-900 dark:text-white text-lg">Maintenance Log</h3>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed font-body font-medium opacity-80">Cumulative record of completed repairs, scheduled upgrades, and contractor performance metrics.</p>
                                        </div>
                                    </label>
                                </div>
                            </section>

                            {/* Timeframe Selector */}
                            <section className="p-8 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 shadow-inner group">
                                <div className="mb-8 flex items-center justify-between">
                                    <div>
                                        <h2 className="font-headline text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">Timeframe Selector</h2>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-body font-medium">Define the temporal boundaries of the report.</p>
                                    </div>
                                    <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl group-hover:scale-110 transition-transform">
                                        <span className="material-symbols-outlined text-primary">calendar_today</span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-4 gap-2 mb-8">
                                    {['24h', '7d', '30d', 'quarter'].map(tf => (
                                        <button 
                                            key={tf}
                                            onClick={() => setTimeframe(tf)}
                                            className={`py-3 px-4 text-xs font-black uppercase tracking-[0.15em] transition-all rounded-lg font-manrope cursor-pointer ${timeframe === tf ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:bg-primary hover:text-white shadow-sm'}`}
                                        >
                                            {tf === '24h' ? 'Last 24h' : tf === '7d' ? 'Last 7 Days' : tf === '30d' ? 'Last 30 Days' : 'Last Quarter'}
                                        </button>
                                    ))}
                                </div>
                                <div className="grid grid-cols-2 gap-8">
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-3 font-manrope opacity-60">Start Date</label>
                                        <input 
                                            value={startDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                            className="w-full bg-surface-container-lowest border-none rounded-lg p-4 text-sm font-bold focus:ring-2 focus:ring-primary shadow-inner outline-none font-body" type="date"/>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant mb-3 font-manrope opacity-60">End Date</label>
                                        <input 
                                            value={endDate}
                                            onChange={(e) => setEndDate(e.target.value)}
                                            className="w-full bg-surface-container-lowest border-none rounded-lg p-4 text-sm font-bold focus:ring-2 focus:ring-primary shadow-inner outline-none font-body" type="date"/>
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Right Column: Portfolio Scope & Export */}
                        <div className="col-span-12 lg:col-span-5 space-y-10">
                            {/* Estate Scope Selection */}
                            <section className="bg-surface-container-lowest p-8 rounded-xl border border-outline-variant/10 shadow-lg whisper-shadow">
                                <div className="mb-6">
                                    <h2 className="font-headline text-2xl font-extrabold tracking-tight text-on-surface">Estate Scope</h2>
                                    <p className="text-sm text-on-surface-variant mt-1 font-body font-medium">Add or remove properties from this specific report.</p>
                                </div>
                                <div className="relative mb-6">
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
                                    <input 
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full bg-surface-container-low border-none rounded-xl pl-12 pr-4 py-4 text-sm font-semibold focus:ring-2 focus:ring-primary shadow-inner outline-none font-body" placeholder="Search by identity..." type="text"
                                    />
                                </div>
                                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                    {estates
                                        .filter(e => e.name.toLowerCase().includes(searchQuery.toLowerCase()))
                                        .map((estate) => (
                                            <div key={estate.id} className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl group hover:bg-surface-container-high transition-all border border-outline-variant/5">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-lg bg-slate-200 overflow-hidden shadow-inner shrink-0">
                                                        <img alt={estate.name} className="w-full h-full object-cover" src={estate.image}/>
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm font-black text-on-surface tracking-tight font-headline">{estate.name}</h4>
                                                        <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest font-manrope opacity-60">{estate.id}</p>
                                                    </div>
                                                </div>
                                                <button 
                                                    onClick={() => handleToggleEstate(estate.id)}
                                                    className={`transition-all p-2 rounded-full cursor-pointer ${selectedEstates.includes(estate.id) ? 'text-primary hover:text-error' : 'text-slate-300 hover:text-primary'}`}
                                                >
                                                    <span className="material-symbols-outlined text-sm">
                                                        {selectedEstates.includes(estate.id) ? 'close' : 'add_circle'}
                                                    </span>
                                                </button>
                                            </div>
                                        ))}
                                </div>
                            </section>

                            {/* Export Control */}
                            <section className="bg-primary-container p-10 rounded-xl text-white shadow-2xl relative overflow-hidden border border-white/5">
                                <div className="mb-8 relative z-10">
                                    <h2 className="font-headline text-2xl font-extrabold tracking-tight">Export Control</h2>
                                    <p className="text-sm text-primary-fixed/60 mt-1 font-body font-medium">Choose the technical delivery format for generation.</p>
                                </div>
                                <div className="flex gap-4 mb-10 relative z-10">
                                    <label className="flex-1 cursor-pointer group">
                                        <input 
                                            checked={format === 'pdf'}
                                            onChange={() => setFormat('pdf')}
                                            className="peer sr-only" name="format" type="radio"
                                        />
                                        <div className="py-6 border-2 border-white/10 rounded-xl flex flex-col items-center gap-3 peer-checked:border-white peer-checked:bg-white/10 transition-all shadow-inner group-hover:border-white/40">
                                            <span className="material-symbols-outlined text-3xl">picture_as_pdf</span>
                                            <span className="text-[10px] font-black uppercase tracking-widest font-manrope">PDF Export</span>
                                        </div>
                                    </label>
                                    <label className="flex-1 cursor-pointer group">
                                        <input 
                                            checked={format === 'csv'}
                                            onChange={() => setFormat('csv')}
                                            className="peer sr-only" name="format" type="radio"
                                        />
                                        <div className="py-6 border-2 border-white/10 rounded-xl flex flex-col items-center gap-3 peer-checked:border-white peer-checked:bg-white/10 transition-all shadow-inner group-hover:border-white/40">
                                            <span className="material-symbols-outlined text-3xl">csv</span>
                                            <span className="text-[10px] font-black uppercase tracking-widest font-manrope">CSV Matrix</span>
                                        </div>
                                    </label>
                                    <label className="flex-1 cursor-pointer group">
                                        <input 
                                            checked={format === 'xls'}
                                            onChange={() => setFormat('xls')}
                                            className="peer sr-only" name="format" type="radio"
                                        />
                                        <div className="py-6 border-2 border-white/10 rounded-xl flex flex-col items-center gap-3 peer-checked:border-white peer-checked:bg-white/10 transition-all shadow-inner group-hover:border-white/40">
                                            <span className="material-symbols-outlined text-3xl">table_view</span>
                                            <span className="text-[10px] font-black uppercase tracking-widest font-manrope">XLS Ledger</span>
                                        </div>
                                    </label>
                                </div>
                                <button 
                                    onClick={handleExport}
                                    className="w-full py-5 bg-white text-primary-container font-headline font-black uppercase tracking-[0.2em] text-xs rounded-xl hover:bg-slate-100 transition-all flex items-center justify-center gap-4 active:scale-[0.98] cursor-pointer shadow-xl relative z-10 group"
                                >
                                    <span className="material-symbols-outlined group-hover:rotate-45 transition-transform">rocket_launch</span>
                                    Generate & Export Portfolio Data
                                </button>
                                <p className="text-[10px] text-center text-primary-fixed/40 mt-6 italic font-bold tracking-tight relative z-10">High-volume processing might require extended compute window (max 30s).</p>
                                <div className="absolute top-[-50px] right-[-50px] opacity-[0.05] pointer-events-none">
                                    <span className="material-symbols-outlined text-[200px]">analytics</span>
                                </div>
                            </section>

                            {/* Advanced Toggle */}
                            <div className="flex items-center justify-between px-8 py-4 bg-surface-container-low border border-outline-variant/10 rounded-xl shadow-inner group">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-surface-container-high rounded-lg group-hover:bg-primary group-hover:text-white transition-all">
                                        <span className="material-symbols-outlined text-sm">settings_suggest</span>
                                    </div>
                                    <span className="text-xs font-black uppercase tracking-widest text-on-surface font-manrope">Apply Internal Branding</span>
                                </div>
                                <div className="w-10 h-5 bg-slate-300 dark:bg-slate-700 rounded-full relative cursor-pointer overflow-hidden p-1">
                                    <div className="w-3 h-3 bg-white rounded-full transition-all shadow-sm"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer / System Meta */}
                <footer className="border-t border-slate-200/50 bg-white/50 backdrop-blur-md">
                    <div className="max-w-7xl mx-auto w-full p-10 flex flex-col md:flex-row justify-between items-center gap-8">
                        <div className="flex flex-wrap items-center gap-10">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest font-manrope opacity-60">System Matrix</span>
                                <div className="flex items-center gap-2 mt-1.5">
                                    <div className="w-2 h-2 rounded-full bg-primary-container animate-pulse shadow-[0_0_8px_rgba(17,28,45,0.4)]"></div>
                                    <span className="text-xs font-bold text-on-surface tracking-tight">Active Core Compute</span>
                                </div>
                            </div>
                            <div className="h-10 w-px bg-slate-200/50 hidden md:block"></div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest font-manrope opacity-60">Last Batch Generation</span>
                                <span className="text-xs font-bold text-on-surface mt-1.5 font-body tracking-tight">Financial_Q1_Audit.pdf • 2.4h elapsed</span>
                            </div>
                        </div>
                        <p className="text-[10px] text-on-surface-variant font-black uppercase tracking-widest font-manrope opacity-40">© 2026 The Estate Director. Administrative Access Level-1.</p>
                    </div>
                </footer>
            </main>

            {/* Report Preview Modal */}
            {isPreviewOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div 
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300"
                        onClick={() => setIsPreviewOpen(false)}
                    ></div>
                    <div className="relative bg-white dark:bg-slate-900 w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-8 duration-500">
                        {/* Modal Header */}
                        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900">
                            <div>
                                <h3 className="font-headline text-xl font-bold text-slate-900 dark:text-white">Report Generation Preview</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium opacity-60">Reviewing {reportType === 'audit' ? 'Full Audit Trail' : reportType === 'financial' ? 'Financial Ledger' : reportType === 'security' ? 'Security Incidents' : 'Maintenance Log'} : {timeframe} • {selectedEstates.length} Estates</p>
                            </div>
                            <button 
                                onClick={() => setIsPreviewOpen(false)}
                                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        {/* Modal Body: Scrollable Preview */}
                        <div className="flex-1 overflow-y-auto p-10 bg-slate-50 dark:bg-slate-950/50 text-slate-900 dark:text-white">
                            <div id="printable-report" className="max-w-2xl mx-auto space-y-12 bg-white dark:bg-slate-900 p-12 shadow-sm border border-slate-200/50 dark:border-slate-800/50">
                                {/* Report Mockup Header */}
                                <div className="border-b-4 border-primary pb-8 flex justify-between items-start">
                                    <div>
                                        <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white uppercase font-manrope">
                                            The Estate Director {reportType === 'audit' ? 'Audit Trail' : reportType === 'financial' ? 'Financial Ledger' : reportType === 'security' ? 'Security Report' : 'Maintenance Log'}
                                        </h1>
                                        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-1 opacity-60">INTERNAL ADMINISTRATIVE USE ONLY</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Generation ID</p>
                                        <p className="text-xs font-bold font-mono">ES-AUDIT-2024-512B</p>
                                    </div>
                                </div>

                                {/* Report Content Section 1 */}
                                <div className="space-y-6">
                                    <h4 className="text-xs font-black uppercase tracking-[0.2em] text-primary font-manrope">01. Executive Summary</h4>
                                    <div className="grid grid-cols-3 gap-6">
                                        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-800">
                                            <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Total Logs</p>
                                            <p className="text-xl font-black text-slate-900 dark:text-white">{stats.totalLogs}</p>
                                        </div>
                                        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-800">
                                            <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Critical Alerts</p>
                                            <p className="text-xl font-black text-red-600 dark:text-red-400">{stats.criticalAlerts}</p>
                                        </div>
                                        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-800">
                                            <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Active Assets</p>
                                            <p className="text-xl font-black text-slate-900 dark:text-white">{stats.activeAssets}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Report Content Section 2 */}
                                <div className="space-y-6">
                                    <h4 className="text-xs font-black uppercase tracking-[0.2em] text-primary font-manrope">02. Temporal Distribution</h4>
                                    <div className="h-32 w-full bg-slate-50 dark:bg-slate-800/50 rounded-lg flex items-end gap-1 p-4 border border-slate-200/50">
                                        {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
                                            <div key={i} className="flex-1 bg-primary/20 rounded-t-sm relative group hover:bg-primary transition-all" style={{ height: `${h}%` }}>
                                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[8px] font-bold py-1 px-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Day {i+1}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                 {/* Report Content Section 3 */}
                                <div className="space-y-6">
                                    <h4 className="text-xs font-black uppercase tracking-[0.2em] text-primary font-manrope">03. Activity Log Matrix</h4>
                                    <div className="space-y-4">
                                        {filteredLogs.slice(0, 10).map((log) => (
                                            <div key={log.id} className="flex justify-between items-start border-b border-slate-100 dark:border-slate-800 pb-4">
                                                <div className="flex-1">
                                                    <p className="text-[10px] font-black text-on-surface uppercase tracking-widest">{log.type}</p>
                                                    <p className="text-xs text-on-surface-variant font-medium mt-0.5 leading-relaxed">{log.subType}</p>
                                                </div>
                                                <div className="text-right shrink-0">
                                                    <p className="text-[10px] font-bold text-on-surface-variant uppercase">{log.date}</p>
                                                    <p className="text-[9px] font-black text-primary/60 mt-0.5">{log.location}</p>
                                                </div>
                                            </div>
                                        ))}
                                        {filteredLogs.length === 0 && (
                                            <p className="text-center py-12 text-xs text-on-surface-variant font-medium italic opacity-60">No activities found for the selected criteria.</p>
                                        )}
                                        {filteredLogs.length > 10 && (
                                            <p className="text-center pt-4 text-[9px] font-bold text-on-surface-variant uppercase tracking-widest opacity-40">... and {filteredLogs.length - 10} additional records truncated for preview ...</p>
                                        )}
                                    </div>
                                </div>

                                <div className="pt-12 mt-12 border-t border-slate-100 dark:border-slate-800 text-center">
                                    <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest opacity-40">End of Preview • Page 1 of 12</p>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer: Action Buttons */}
                        <div className="p-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-surface-container-lowest">
                            <button 
                                onClick={() => setIsPreviewOpen(false)}
                                className="px-6 py-2.5 text-xs font-black uppercase tracking-widest text-on-surface-variant hover:text-on-surface transition-all cursor-pointer font-manrope"
                            >
                                Discard Generation
                            </button>
                            <div className="flex gap-4">
                                <button 
                                    onClick={() => window.print()}
                                    className="px-6 py-2.5 bg-surface-container-high text-on-surface text-xs font-black uppercase tracking-widest rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-all cursor-pointer font-manrope flex items-center gap-2"
                                >
                                    <span className="material-symbols-outlined text-sm">print</span>
                                    Full Print
                                </button>
                                <button 
                                    onClick={handleExport}
                                    className="px-8 py-2.5 bg-primary text-white text-xs font-black uppercase tracking-widest rounded-lg hover:shadow-lg hover:shadow-primary/20 transition-all cursor-pointer font-manrope flex items-center gap-2"
                                >
                                    <span className="material-symbols-outlined text-sm">download</span>
                                    Finalize & Download
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}