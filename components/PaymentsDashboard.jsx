"use client"
import React, { useState } from 'react';
import ReceiptModal from './ReceiptModal';
import { exportToCSV } from '@/lib/exportUtils';
import { formatDate } from '@/lib/utils';

const PaymentsDashboard = ({ initialPayments, estates }) => {
    const [statusFilter, setStatusFilter] = useState("All");
    const [monthFilter, setMonthFilter] = useState("July 2024");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTxn, setSelectedTxn] = useState(null);

    // Parsing months from data to populate filter options (if more data existed)
    // For now, we'll hardcode the selector options based on existing data.
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const handleExport = () => {
        const exportData = filteredPayments.map(p => ({
            ID: p.id,
            Estate: estates.find(e => e.id === p.estateId)?.name || 'Unknown',
            Amount: p.amount,
            Method: p.methodName,
            Status: p.status,
            Date: formatDate(p.date)
        }));
        exportToCSV(exportData, 'payments_ledger');
    };

    const handleViewReceipt = (txn) => {
        setSelectedTxn(txn);
        setIsModalOpen(true);
    };

    // Unified Filtering: Status + Time
    const filteredPayments = initialPayments.filter(p => {
        // Status check
        const matchesStatus = statusFilter === "All" || p.status === statusFilter;
        
        // Date check (parsing 2024-07-01 into "July 2024")
        const dateObj = new Date(p.date || '2024-07-01');
        const monthName = dateObj.toLocaleString('default', { month: 'long', year: 'numeric' });
        const matchesDate = monthFilter === "All Periods" || monthName === monthFilter;

        return matchesStatus && matchesDate;
    });

    // KPI Calculations (Dynamic based on filtering)
    const completedPayments = initialPayments.filter(p => {
        const dateObj = new Date(p.date || '2024-07-01');
        const monthName = dateObj.toLocaleString('default', { month: 'long', year: 'numeric' });
        return p.status === 'Completed' && (monthFilter === "All Periods" || monthName === monthFilter);
    });

    const pendingPayments = initialPayments.filter(p => {
        const dateObj = new Date(p.date || '2024-07-01');
        const monthName = dateObj.toLocaleString('default', { month: 'long', year: 'numeric' });
        return p.status === 'Pending' && (monthFilter === "All Periods" || monthName === monthFilter);
    });
    
    const totalMonthlyRevenue = completedPayments.reduce((sum, p) => sum + parseFloat(p.amount), 0);
    const outstandingAmount = pendingPayments.reduce((sum, p) => sum + parseFloat(p.amount), 0);
    const pendingAssetsCount = new Set(pendingPayments.map(p => p.estateId)).size;

    // Revenue by Estate Aggregation (Dynamic)
    const revenueMap = completedPayments.reduce((acc, p) => {
        acc[p.estateId] = (acc[p.estateId] || 0) + parseFloat(p.amount);
        return acc;
    }, {});

    const sortedRevenue = Object.entries(revenueMap)
        .map(([estateId, amount]) => {
            const estate = estates.find(e => e.id === estateId);
            return {
                name: estate?.name || 'Unknown Asset',
                amount: `$${(amount / 1000).toFixed(1)}k`,
                rawAmount: amount,
                percentage: 0 
            };
        })
        .sort((a, b) => b.rawAmount - a.rawAmount);

    const maxRevenue = Math.max(...sortedRevenue.map(s => s.rawAmount)) || 1;
    const revenueBreakdown = sortedRevenue.map(item => ({
        ...item,
        percentage: Math.round((item.rawAmount / maxRevenue) * 100)
    }));

    const topPerformerId = sortedRevenue[0]?.name ? estates.find(e => e.name === sortedRevenue[0].name)?.id : null;
    const topEstate = estates.find(e => e.id === topPerformerId);

    return (
        <div className="space-y-10">
            {/* Page Header (Moved here for functionality) */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 text-slate-900 dark:text-white">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white font-headline leading-none">Payments Dashboard</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-body mt-2 text-sm italic opacity-80">Financial oversight and automated revenue reconciliation.</p>
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={handleExport}
                        className="bg-slate-100 dark:bg-slate-800 px-4 py-2 text-xs font-bold tracking-widest uppercase rounded-md text-slate-900 dark:text-white hover:opacity-80 transition-colors cursor-pointer font-manrope shadow-sm active:scale-95 border border-slate-200 dark:border-slate-700"
                    >
                        Export Ledger
                    </button>
                    <button className="bg-slate-900 dark:bg-slate-800 px-4 py-2 text-xs font-bold tracking-widest uppercase rounded-md text-white shadow-lg hover:opacity-90 transition-all cursor-pointer font-manrope active:scale-95 flex items-center gap-2 border border-slate-800 dark:border-white/10">
                        <span className="material-symbols-outlined text-sm">add_card</span>
                        Process Payment
                    </button>
                </div>
            </div>

            {/* Receipt Modal Integration */}
            <ReceiptModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                transaction={selectedTxn}
                estate={estates.find(e => e.id === selectedTxn?.estateId)}
            />

            {/* High-Level Financial Summary Cards */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Total Monthly Revenue */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm transition-transform hover:scale-[1.01] border border-slate-100 dark:border-slate-800">
                    <div className="flex justify-between items-start mb-4">
                        <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-lg text-slate-900 dark:text-blue-400">
                            <span className="material-symbols-outlined text-xl">payments</span>
                        </div>
                        <span className="text-[10px] font-bold text-slate-900 dark:text-blue-400 bg-slate-100 dark:bg-slate-800/50 px-2 py-1 rounded uppercase tracking-widest font-manrope border border-slate-100 dark:border-slate-800">+12.4%</span>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1 font-manrope">Total Revenue ({monthFilter})</p>
                    <h2 className="text-3xl font-extrabold font-headline text-slate-900 dark:text-white tabular-nums tracking-tight">${totalMonthlyRevenue.toLocaleString()}</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-[10px] mt-2 font-body italic opacity-80">Aggregate completed transactions</p>
                </div>

                {/* Outstanding Payments */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm transition-transform hover:scale-[1.01] border border-slate-100 dark:border-slate-800">
                    <div className="flex justify-between items-start mb-4">
                        <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-lg text-slate-900 dark:text-amber-400">
                            <span className="material-symbols-outlined text-xl">pending_actions</span>
                        </div>
                        <span className="text-[10px] font-bold text-slate-900 dark:text-amber-400 bg-slate-100 dark:bg-slate-800/50 px-2 py-1 rounded uppercase tracking-widest font-manrope border border-slate-100 dark:border-slate-800">{pendingAssetsCount} Assets</span>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1 font-manrope">Outstanding Payments</p>
                    <h2 className="text-3xl font-extrabold font-headline text-slate-900 dark:text-white tabular-nums tracking-tight">${outstandingAmount.toLocaleString()}</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-[10px] mt-2 font-body italic opacity-80">Pending administrative verification</p>
                </div>
            </section>

            {/* Transactions Section (Bento Grid Layout) */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Main Table Container */}
                <section className="lg:col-span-3 bg-white dark:bg-slate-900 rounded-xl shadow-sm overflow-hidden flex flex-col border border-slate-100 dark:border-slate-800">
                    <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                        <h3 className="text-xl font-bold font-headline text-slate-900 dark:text-white tracking-tight">Recent Transactions</h3>
                        <div className="flex items-center gap-4">
                            {/* Filters */}
                            <div className="flex bg-slate-50 dark:bg-slate-800/50 p-1 rounded-lg border border-slate-100 dark:border-slate-800 shadow-inner">
                                {["All", "Completed", "Pending"].map((s) => (
                                    <button 
                                        key={s}
                                        onClick={() => setStatusFilter(s)}
                                        className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest font-manrope transition-all rounded-md cursor-pointer ${statusFilter === s ? 'bg-white dark:bg-slate-900 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                            
                            {/* Functional Date Filter */}
                            <div className="relative group">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 dark:text-slate-400 z-10">calendar_today</span>
                                <select 
                                    value={monthFilter}
                                    onChange={(e) => setMonthFilter(e.target.value)}
                                    className="pl-9 pr-8 py-1.5 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 rounded-md text-[10px] font-bold uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-800 transition-all font-manrope cursor-pointer border border-slate-100 dark:border-slate-800 appearance-none outline-none focus:ring-1 focus:ring-primary/20"
                                >
                                    <option value="All Periods" className="bg-white dark:bg-slate-900">All Periods</option>
                                    {months.map(m => <option key={m} value={m + " 2024"} className="bg-white dark:bg-slate-900">{m}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>
                    
                    <div className="overflow-x-auto min-h-[400px]">
                        <table className="w-full border-collapse text-left">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-400 dark:text-slate-500 font-manrope border-b border-slate-100 dark:border-slate-800">
                                {['Estate Name', 'ID', 'Amount (USD)', 'Method', 'Status', ''].map((header, index) => (
                                    <th key={index} className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest">{header}</th>
                                ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {filteredPayments.map((txn, i) => (
                                    <tr key={txn.id || i} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-100 dark:border-slate-800 shadow-xs group-hover:scale-105 transition-transform">
                                                    <img alt={txn.name} className="w-full h-full object-cover" src={txn.img} />
                                                </div>
                                                <span className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">{txn.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-[10px] font-bold font-manrope text-slate-500 dark:text-slate-400 uppercase tracking-widest tabular-nums opacity-60">
                                            {txn.id}
                                        </td>
                                        <td className="px-8 py-5 text-sm font-black text-slate-900 dark:text-white tabular-nums tracking-tighter">
                                            ${parseFloat(txn.amount).toLocaleString()}
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest font-manrope">
                                                <span className="material-symbols-outlined text-[14px]">{txn.method}</span>
                                                {txn.methodName}
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className={`inline-flex items-center px-3 py-1 rounded text-[9px] font-bold uppercase tracking-widest ${txn.status === 'Completed' ? 'bg-slate-900 dark:bg-slate-800 text-white' : txn.status === 'Pending' ? 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300' : 'bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400'}`}>
                                                {txn.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <button 
                                                onClick={() => handleViewReceipt(txn)}
                                                className="flex items-center gap-2 ml-auto px-4 py-1.5 border border-primary/20 text-slate-900 dark:text-blue-400 text-[9px] font-black uppercase tracking-[0.2em] rounded-md hover:bg-primary/5 transition-all cursor-pointer font-manrope active:scale-95"
                                            >
                                                <span className="material-symbols-outlined text-xs">receipt_long</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {filteredPayments.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="px-8 py-20 text-center">
                                            <div className="opacity-20 mb-4 flex justify-center text-slate-400">
                                                <span className="material-symbols-outlined text-6xl">search_off</span>
                                            </div>
                                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em]">No transactions recorded for {monthFilter}.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    
                    <div className="p-5 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center mt-auto">
                        <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest font-manrope opacity-60">
                            Showing {filteredPayments.length} transactions
                        </p>
                        <div className="flex gap-1">
                            <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all active:scale-90 cursor-pointer shadow-sm border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                                <span className="material-symbols-outlined text-sm">chevron_left</span>
                            </button>
                            <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all active:scale-90 cursor-pointer shadow-sm border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                                <span className="material-symbols-outlined text-sm">chevron_right</span>
                            </button>
                        </div>
                    </div>
                </section>

                {/* Portfolio Distribution Side Panel */}
                <section className="lg:col-span-1 space-y-6">
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 h-full flex flex-col animate-in fade-in slide-in-from-right-4 duration-700">
                        <h3 className="text-lg font-bold font-headline text-slate-900 dark:text-white mb-8 tracking-tight">Revenue by Estate</h3>
                        <div className="space-y-7 flex-1 font-manrope">
                            {revenueBreakdown.map((item, i) => (
                                <div key={i} className="space-y-3">
                                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                                        <span className="text-slate-900 dark:text-white truncate pr-2">{item.name}</span>
                                        <span className="text-slate-500 dark:text-slate-400 tabular-nums">{item.amount}</span>
                                    </div>
                                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden shadow-inner font-body">
                                        <div 
                                            className="h-full bg-slate-900 dark:bg-blue-600 relative transition-all duration-1000" 
                                            style={{ width: `${item.percentage}%`, opacity: 1 - (i * 0.15) }}
                                        >
                                            <div className="absolute inset-0 bg-white/10"></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {revenueBreakdown.length === 0 && (
                                <p className="text-xs text-slate-500 dark:text-slate-400 font-body italic opacity-60">No completed revenue recorded for this period.</p>
                            )}
                        </div>

                        <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-800">
                            <div className="flex items-center justify-between mb-6">
                                <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest font-manrope">Top Performer</span>
                                <span className="material-symbols-outlined text-slate-900 dark:text-blue-400 fill-1 text-lg">trending_up</span>
                            </div>
                            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl flex items-center gap-4 border border-slate-100 dark:border-slate-800 shadow-sm group cursor-pointer hover:border-primary/20 transition-all font-body">
                                <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0 border border-slate-100 dark:border-slate-800 shadow-xs group-hover:scale-105 transition-transform">
                                    <img 
                                        alt="Top Performer" 
                                        className="w-full h-full object-cover" 
                                        src={topEstate?.image || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab"}
                                    />
                                </div>
                                <div className="overflow-hidden">
                                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate tracking-tight">{topEstate?.name || "None Recorded"}</p>
                                    <p className="text-[10px] text-slate-900 dark:text-blue-400 font-black uppercase tracking-widest mt-0.5 font-manrope">Primary Node</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default PaymentsDashboard;
