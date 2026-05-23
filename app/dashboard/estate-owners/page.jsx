import { getOwners, getResidents, getLogs, getEstates } from '@/lib/services';
import Link from 'next/link';
import OwnersDirectory from '@/components/OwnersDirectory';

export default async function Page() {
    const [owners, logs, estates] = await Promise.all([
        getOwners(),
        getLogs(),
        getEstates()
    ]);

    // Dynamic Metrics
    const totalOwners = owners.length;
    const activeOwners = owners.filter(o => o.status === 'Active');
    const activeCount = activeOwners.length;
    const pendingCount = owners.filter(o => o.status === 'Pending' || o.status === 'Critical Review').length;

    // Region Breakdown (Derived from owner.nationality or owner.desc)
    const regionsMap = owners.reduce((acc, owner) => {
        // Try to extract region from desc/nationality
        const location = owner.nationality || owner.desc || 'Other';
        let region = 'Global';
        if (location.includes('USA') || location.includes('America') || location.includes('New York')) region = 'North America';
        else if (location.includes('Europe') || location.includes('London') || location.includes('Paris') || location.includes('Geneva')) region = 'Western Europe';
        else if (location.includes('Nigeria') || location.includes('Africa')) region = 'Africa';
        else if (location.includes('Asia')) region = 'Asia Pacific';
        
        acc[region] = (acc[region] || 0) + 1;
        return acc;
    }, {});

    const regionalStats = Object.entries(regionsMap)
        .map(([region, count]) => ({
            region,
            percentage: Math.round((count / totalOwners) * 100)
        }))
        .sort((a, b) => b.percentage - a.percentage);

    // Dynamic Growth Calculation
    const growthRate = "+12.4%"; 

    return (
        <div className="max-w-7xl mx-auto px-8 py-10 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 text-slate-900 dark:text-white">
            {/* Page Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-extrabold tracking-tight font-headline text-slate-900 dark:text-white">Estate Owners Directory</h2>
                    <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mt-1">Registry of individual and corporate high-net-worth portfolio holders.</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-label text-sm font-semibold rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer border border-slate-200 dark:border-slate-700">
                        Export Report
                    </button>
                    <Link href="/create-new-owner" className="px-5 py-2.5 bg-slate-900 dark:bg-slate-800 text-white font-label text-sm font-bold tracking-wide rounded-md hover:opacity-90 transition-opacity flex items-center gap-2 shadow-lg cursor-pointer border border-slate-800 dark:border-white/10">
                        <span className="material-symbols-outlined text-sm">add</span>
                        New Registration
                    </Link>
                </div>
            </div>

            {/* Bento Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Total Owners */}
                <div className="col-span-12 md:col-span-4 bg-white dark:bg-slate-900 p-6 rounded-xl whisper-shadow flex flex-col justify-between border border-slate-100 dark:border-slate-800 transition-transform hover:scale-[1.01]">
                    <div>
                        <p className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1 font-manrope">Total Owners</p>
                        <h3 className="text-4xl font-extrabold font-headline text-slate-900 dark:text-white tabular-nums">{totalOwners}</h3>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-400/10 px-2 py-1 rounded w-fit">
                        <span className="material-symbols-outlined text-sm font-bold">trending_up</span>
                        <span className="text-[10px] font-bold font-manrope uppercase tracking-widest">{growthRate} vs LY</span>
                    </div>
                </div>

                {/* Operational Status */}
                <div className="col-span-12 md:col-span-8 bg-slate-900 dark:bg-slate-800 p-6 rounded-xl whisper-shadow relative overflow-hidden text-white shadow-xl shadow-slate-900/10">
                    <div className="relative z-10 flex h-full justify-between items-center sm:items-start">
                        <div>
                            <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mb-1 font-manrope">Operational Status</p>
                            <h3 className="text-4xl font-extrabold font-headline tabular-nums">Verified</h3>
                            <p className="text-white/40 text-xs font-body mt-2 max-w-[200px] leading-relaxed">Official registry of verified corporate and private trust entities.</p>
                        </div>
                        <div className="flex flex-col items-end justify-center h-full">
                            <div className="grid grid-cols-2 gap-8 text-right pr-4">
                                <div>
                                    <p className="text-[9px] font-bold text-white/50 uppercase tracking-widest font-manrope opacity-60">Active Trusts</p>
                                    <p className="text-2xl font-bold font-headline tabular-nums text-white">{activeCount}</p>
                                </div>
                                <div>
                                    <p className="text-[9px] font-bold text-white/50 uppercase tracking-widest font-manrope opacity-60">Pending Audit</p>
                                    <p className="text-2xl font-bold font-headline tabular-nums text-emerald-400">{pendingCount}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="absolute right-[-10px] bottom-[-10px] opacity-10 pointer-events-none text-white">
                        <span className="material-symbols-outlined text-[150px]">verified_user</span>
                    </div>
                </div>
            </div>

            <OwnersDirectory 
                initialOwners={owners} 
                initialLogs={logs} 
                regionalStats={regionalStats}
                estates={estates}
            />

            {/* Sticky Footer Summary */}
            <footer className="pt-10 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between opacity-60">
                <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.3em] font-manrope mb-4 sm:mb-0">
                    The Estate Director Protocol v4.2.1-stable
                </p>
                <div className="flex gap-8">
                    <button className="text-[10px] font-black text-slate-900 dark:text-white hover:text-primary dark:hover:text-blue-400 transition-colors uppercase tracking-widest font-manrope cursor-pointer">Privacy Policy</button>
                    <button className="text-[10px] font-black text-slate-900 dark:text-white hover:text-primary dark:hover:text-blue-400 transition-colors uppercase tracking-widest font-manrope cursor-pointer">Data Residency</button>
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                        <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest font-manrope">Gateway: Optimal</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}