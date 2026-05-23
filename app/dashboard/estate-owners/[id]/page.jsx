import React from 'react';
import Link from 'next/link';
import getEstates, { getOwnerById } from '@/lib/services';
import DeleteOwnerModal from '@/components/DeleteOwnerModal';

const EstateOwnerProfilePage = async ({ params }) => {
    // Resolve the promise if it's dynamic
    const resolvedParams = await params;
    const ownerId = resolvedParams.id;
    
    const owner = await getOwnerById(ownerId);
    const allEstates = await getEstates();
    
    // Filter estates owned by this person (safe check)
    const ownedProperties = allEstates.filter(e => {
        if (!e.owner || !e.owner.name) return false;
        
        const ownerNameSlug = e.owner.name.toLowerCase().replace(/\s+/g, '-');
        return ownerNameSlug === ownerId || e.owner.name === owner.name;
    });

    return (
        <div className="pt-10 pb-12 px-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-[10px] font-bold text-slate-400 dark:text-slate-500 mb-8 tracking-widest font-manrope uppercase opacity-80">
                <Link href="/dashboard/estate-owners" className="hover:text-primary dark:hover:text-white transition-colors">Stakeholder Directory</Link>
                <span className="material-symbols-outlined text-xs">chevron_right</span>
                <span className="text-slate-900 dark:text-primary font-black">{owner.name}</span>
                {owner.estateID && (
                    <>
                        <span className="material-symbols-outlined text-xs">chevron_right</span>
                        <span className="text-slate-400 dark:text-slate-600 font-bold">{owner.estateID}</span>
                    </>
                )}
            </nav>

            {/* Profile Header Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-10">
                <div className="lg:col-span-8">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-10 bg-white dark:bg-slate-900 p-10 rounded-2xl border border-slate-300 dark:border-slate-800 relative overflow-hidden group">
                        <div className="relative shrink-0">
                            <div className="w-36 h-36 rounded-2xl p-1 bg-gradient-to-tr from-slate-200 to-slate-50 dark:from-slate-800 dark:to-slate-700 shadow-inner">
                                <img 
                                    src={owner.avatar} 
                                    alt={owner.name} 
                                    className="w-full h-full rounded-[14px] object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-1000 shadow-2xl" 
                                />
                            </div>
                            <div className="absolute -bottom-3 -right-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-3 py-1.5 rounded-lg text-[9px] font-black tracking-widest uppercase border border-white/20 dark:border-slate-900/10 shadow-xl">
                                Verified Principal
                            </div>
                        </div>
                        <div className="flex-1 w-full text-center md:text-left">
                            <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-4">
                                <div>
                                    <h2 className="text-5xl font-black font-headline tracking-tighter text-slate-900 dark:text-white mb-2 leading-tight">{owner.name}</h2>
                                    <div className="flex flex-wrap justify-center md:justify-start items-center gap-3">
                                        <p className="text-slate-500 dark:text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 font-manrope">
                                            <span className="material-symbols-outlined text-sm">shield_person</span>
                                            {owner.role || 'Principal Stakeholder'}
                                        </p>
                                        <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700 hidden md:block"></span>
                                        <p className="text-slate-500 dark:text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 font-manrope">
                                            <span className="material-symbols-outlined text-sm">fingerprint</span>
                                            Principal ID: <span className="text-slate-900 dark:text-white font-black">{ownerId}</span>
                                        </p>
                                    </div>
                                </div>
                                <div className="hidden lg:block p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                                    <span className="material-symbols-outlined text-3xl text-slate-300 dark:text-slate-600">account_balance</span>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-8 mt-8 border-t border-slate-100 dark:border-slate-800">
                                <div className="space-y-1">
                                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] font-manrope">Primary Communication</label>
                                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate selection:bg-primary selection:text-white">{owner.email}</p>
                                </div>
                                <div className="space-y-1">
                                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] font-manrope">Secured Line</label>
                                    <p className="text-sm font-bold text-slate-900 dark:text-white tabular-nums">{owner.phone || "No direct line linked"}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Management Actions */}
                <div className="lg:col-span-4 flex flex-col gap-3">
                    <button className="w-full py-5 px-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl flex items-center justify-between group transition-all duration-500 hover:scale-[1.02] cursor-pointer">
                        <span className="text-xs font-black tracking-[0.2em] uppercase font-manrope">Initiate Liaison</span>
                        <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">send</span>
                    </button>
                    <Link 
                        href={`/dashboard/estate-owners/${ownerId}/edit`}
                        className="w-full py-5 px-6 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700 transition-all border border-slate-300 dark:border-slate-700 group"
                    >
                        <span className="text-xs font-black tracking-[0.2em] uppercase font-manrope">Modify Identity</span>
                        <span className="material-symbols-outlined group-hover:rotate-12 transition-transform">edit_note</span>
                    </Link>
                    <button className="w-full py-5 px-6 bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 rounded-2xl flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-800 transition-all border border-slate-200 dark:border-slate-800 cursor-pointer">
                        <span className="text-xs font-black tracking-[0.2em] uppercase font-manrope">Generate Ledger</span>
                        <span className="material-symbols-outlined">ios_share</span>
                    </button>
                    <DeleteOwnerModal ownerName={owner.name} id={ownerId} />
                </div>
            </div>

            {/* Bento Grid Metrics & Portfolio */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Main Portfolio Table */}
                <div className="lg:col-span-8 space-y-8">
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-4">
                            <h3 className="text-2xl font-black font-headline tracking-tighter text-slate-900 dark:text-white">Managed Portfolio</h3>
                            <span className="px-2.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-black rounded-md font-manrope tabular-nums border border-slate-200 dark:border-slate-700">
                                {ownedProperties.length} Verified Assets
                            </span>
                        </div>
                    </div>
                    
                    <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-300 dark:border-slate-800">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest font-manrope">Estate Identity</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest font-manrope">Location</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest font-manrope">Status</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest font-manrope text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                                    {ownedProperties.map((estate, index) => (
                                        <tr key={index} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                                            <td className="px-8 py-5">
                                                <Link href={`/dashboard/estates/${estate._id}`} className="flex items-center gap-4 group/link">
                                                    <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden shadow-sm border border-slate-200 dark:border-slate-700 group-hover/link:scale-105 transition-transform duration-500">
                                                        <img src={estate.image} alt={estate.name} className="w-full h-full object-cover" />
                                                    </div>
                                                    <span className="font-bold text-sm text-slate-900 dark:text-white tracking-tight group-hover/link:text-primary dark:group-hover/link:text-blue-400 transition-colors">{estate.name}</span>
                                                </Link>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest opacity-80">{typeof estate.location === 'object' ? estate.location.city : 'N/A'}</span>
                                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.15em] mt-0.5 truncate max-w-[150px]">
                                                        {typeof estate.location === 'object' ? `${estate.location.address}, ${estate.location.state}` : (estate.location || 'Unknown')}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-2">
                                                    <span className={`w-1.5 h-1.5 rounded-full ${estate.status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300 dark:bg-slate-600'}`}></span>
                                                    <span className={`text-[9px] font-black uppercase tracking-widest ${estate.status === 'Active' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'}`}>
                                                        {estate.status}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <Link href={`/dashboard/estates/${estate._id}`} className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 hover:bg-slate-900 dark:hover:bg-white hover:text-white dark:hover:text-slate-900 transition-all">
                                                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                    {ownedProperties.length === 0 && (
                                        <tr>
                                            <td colSpan="4" className="px-8 py-24 text-center">
                                                <div className="flex flex-col items-center gap-3 opacity-20">
                                                    <span className="material-symbols-outlined text-5xl">folder_off</span>
                                                    <p className="text-[10px] font-black uppercase tracking-[0.3em]">No associated assets detected</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Sidebar Metrics */}
                <div className="lg:col-span-4 space-y-8">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] font-manrope text-center">Stakeholder Analytics</h3>
                    
                    <div className="space-y-6">
                        {/* Metrics Card 1 */}
                        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border-l-4 border-slate-900 dark:border-white border-y border-r border-slate-300 dark:border-slate-800 transition-transform hover:translate-x-1 duration-500">
                            <label className="block text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 font-manrope">Total Assets Controlled</label>
                            <div className="flex items-end justify-between">
                                <h4 className="text-6xl font-black font-headline text-slate-900 dark:text-white tracking-tighter tabular-nums leading-none">{ownedProperties.length}</h4>
                                <div className="flex flex-col items-end">
                                    <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 flex items-center bg-emerald-50 dark:bg-emerald-400/10 px-3 py-1 rounded-full uppercase tracking-widest border border-emerald-100 dark:border-emerald-400/20">Stable</span>
                                    <p className="text-[8px] font-bold text-slate-400 mt-1 uppercase">Portfolio Health</p>
                                </div>
                            </div>
                        </div>

                        {/* Metrics Card 2 */}
                        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-300 dark:border-slate-800 transition-transform hover:translate-x-1 duration-500 group">
                            <div className="flex justify-between items-center mb-6">
                                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] font-manrope">System Reliability</label>
                                <span className="material-symbols-outlined text-slate-200 dark:text-slate-700">speed</span>
                            </div>
                            <h4 className="text-4xl font-black font-headline text-slate-900 dark:text-white tracking-tighter tabular-nums leading-none mb-4">98.4<span className="text-lg opacity-40">%</span></h4>
                            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden shadow-inner">
                                <div className="bg-slate-900 dark:bg-white h-full group-hover:w-[98%] transition-all duration-1000" style={{ width: '92%' }}></div>
                            </div>
                            <p className="mt-3 text-[9px] font-black text-slate-400 uppercase tracking-widest font-manrope text-right">Institutional Grade</p>
                        </div>

                        {/* Visual Asset Spotlight */}
                        <div className="relative group h-64 rounded-2xl overflow-hidden cursor-pointer border border-slate-300 dark:border-slate-800">
                            <img 
                                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                                alt="Flagship Asset" 
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale-[0.3] group-hover:grayscale-0" 
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent flex flex-col justify-end p-8">
                                <span className="text-[9px] font-black text-blue-400 uppercase tracking-[0.3em] font-manrope mb-2">Prime Portfolio Asset</span>
                                <h5 className="text-white font-headline font-extrabold text-2xl leading-tight tracking-tighter">The Horizon Pavilion</h5>
                                <p className="text-white/60 text-[10px] font-medium mt-1 font-manrope">Global Residential Portfolio</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Global Context Footer */}
            <footer className="mt-24 pt-12 border-t border-slate-100 dark:border-slate-800 flex flex-col items-center">
                <div className="flex items-center gap-3 mb-6">
                    <span className="w-8 h-px bg-slate-200 dark:bg-slate-800"></span>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em] font-manrope text-center whitespace-nowrap">
                        Global Audit Chain Verification
                    </p>
                    <span className="w-8 h-px bg-slate-200 dark:bg-slate-800"></span>
                </div>
                <div className="flex flex-wrap justify-center gap-x-12 gap-y-4">
                    <span className="text-[9px] font-black text-slate-900 dark:text-white uppercase tracking-widest font-manrope flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-emerald-500"></span> Proof: Validated
                    </span>
                    <span className="text-[9px] font-black text-slate-900 dark:text-white uppercase tracking-widest font-manrope flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-blue-500"></span> Links: {ownedProperties.length} Records
                    </span>
                    <span className="text-[9px] font-black text-slate-900 dark:text-white uppercase tracking-widest font-manrope flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-amber-500"></span> System: 4.2.1 Stable
                    </span>
                </div>
            </footer>
        </div>
    );
};

export default EstateOwnerProfilePage;