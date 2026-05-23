import { getEstateById, getOwners, getResidentsByEstateId } from '@/lib/services';
import Link from 'next/link';
import DeleteEstateModal from '@/components/DeleteEstateModal';
import ResidentRegistry from '@/components/ResidentRegistry';

const ViewEstatePage = async ({ params }) => {
  const { id } = await params;
  const estate = await getEstateById(id);
  const owners = await getOwners();
  const residents = await getResidentsByEstateId(id);
  
  if (!estate) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-on-surface">
        <span className="material-symbols-outlined text-6xl opacity-20 mb-4">domain_disabled</span>
        <h2 className="text-2xl font-bold font-headline">Estate Not Found</h2>
        <p className="text-on-surface-variant font-body mt-2">The requested estate identifier {id} does not exist in our records.</p>
        <Link href="/dashboard/estates" className="mt-8 px-6 py-2 bg-primary text-white rounded-md text-xs font-bold uppercase tracking-widest font-manrope">Back to Portfolio</Link>
      </div>
    );
  }

  const owner = (typeof estate.manager === 'object' ? owners.find(o => o.name === estate.manager.name) : owners.find(o => o.name === estate.manager)) || owners[0];

  return (
    <div className="max-w-7xl mx-auto px-8 py-10 text-slate-900 dark:text-white space-y-12">
      {/* Page Header */}
      <header className="flex flex-col md:flex-row justify-between items-end gap-8 animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="space-y-4">
          <nav className="flex items-center gap-2 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] font-manrope">
            <Link href="/dashboard/estates" className="hover:text-primary dark:hover:text-white transition-colors">Portfolio Hub</Link>
            <span className="material-symbols-outlined text-[12px] opacity-40">chevron_right</span>
            <span className="text-slate-900 dark:text-primary">Asset Management</span>
          </nav>
          <div className="space-y-1">
            <h1 className="text-6xl font-black font-headline tracking-tighter leading-none text-slate-900 dark:text-white">{estate.name}</h1>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[9px] font-black rounded-lg uppercase tracking-widest shadow-xl">
                Asset ID: {estate._id.toString()}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Active Infrastructure</span>
            </div>
          </div>
        </div>
        <div className="flex gap-4">
          <DeleteEstateModal estateName={estate.name} id={id} />
          <Link href={`/dashboard/estates/${id}/edit`}>
            <button className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 px-8 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center gap-3 group cursor-pointer">
              <span className="material-symbols-outlined text-sm group-hover:rotate-12 transition-transform">edit_note</span>
              Modify Configuration
            </button>
          </Link>
        </div>
      </header>

      {/* Main Tactical Grid */}
      <div className="grid grid-cols-12 gap-10">
        {/* Core Asset Identity */}
        <section className="col-span-12 lg:col-span-8 space-y-10 animate-in fade-in slide-in-from-left-4 duration-1000">
          <div className="bg-white dark:bg-slate-900 rounded-[32px] p-12 border border-slate-300 dark:border-slate-800 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                <span className="material-symbols-outlined text-[120px]">architecture</span>
            </div>
            
            <div className="relative space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] font-manrope">Primary Classification</label>
                  <p className="text-3xl font-black font-headline tracking-tight text-slate-900 dark:text-white">{estate.classification || 'Residential Portfolio'}</p>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] font-manrope">Tactical Tier</label>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-black font-headline tracking-tight text-slate-900 dark:text-white">{estate.tier || 'Enterprise'}</span>
                    <span className="material-symbols-outlined text-blue-500 text-xl fill-1">verified</span>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] font-manrope">Logistical Deployment Address</label>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0 border border-slate-100 dark:border-slate-700">
                    <span className="material-symbols-outlined text-slate-400">location_on</span>
                  </div>
                  <p className="text-lg font-bold font-body leading-relaxed max-w-md">
                    {typeof estate.location === 'object' ? `${estate.location.address}, ${estate.location.city}, ${estate.location.state}` : (estate.location || 'Pending Verification')}
                  </p>
                </div>
              </div>

              <div className="pt-10 border-t border-slate-50 dark:border-slate-800">
                <div className="flex items-center justify-between mb-6">
                    <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] font-manrope">Geo-Spatial Telemetry</label>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Real-time Feed Active</span>
                    </div>
                </div>
                <div className="h-[400px] rounded-[24px] overflow-hidden relative border border-slate-300 dark:border-slate-800 group/map">
                  <img 
                    className="w-full h-full object-cover grayscale transition-all duration-1000 group-hover/map:grayscale-0 group-hover/map:scale-110" 
                    src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80" 
                    alt="Map Grid"
                  />
                  <div className="absolute inset-0 bg-slate-900/40 mix-blend-overlay group-hover/map:bg-slate-900/10 transition-colors"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-[20px] flex items-center gap-5 shadow-2xl border border-white/20 dark:border-slate-800 backdrop-blur-xl group-hover/map:scale-105 transition-transform duration-700">
                      <div className="w-12 h-12 rounded-full bg-slate-900 dark:bg-white flex items-center justify-center">
                        <span className="material-symbols-outlined text-white dark:text-slate-900 fill-1">radar</span>
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Tactical Coordinates</p>
                        <p className="text-xl font-black font-headline tabular-nums tracking-tighter text-slate-900 dark:text-white">40.7128° N, 74.0060° W</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Intelligence Sidebar */}
        <aside className="col-span-12 lg:col-span-4 space-y-10 animate-in fade-in slide-in-from-right-4 duration-1000">
          {/* Stakeholder Identity */}
          <div className="bg-slate-50 dark:bg-slate-800/30 p-10 rounded-[32px] border border-slate-100 dark:border-slate-800 group">
            <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] font-manrope mb-8 block text-center">Stakeholder Command</label>
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="relative">
                <div className="w-28 h-28 rounded-full p-1 bg-gradient-to-tr from-slate-200 to-white dark:from-slate-700 dark:to-slate-600 shadow-inner overflow-hidden group-hover:scale-105 transition-transform duration-700">
                    <img 
                        alt={owner?.name} 
                        className="w-full h-full rounded-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 shadow-2xl" 
                        src={owner?.avatar || "/uploads/default-avatar.png"} 
                    />
                </div>
                <div className="absolute -bottom-2 right-0 w-8 h-8 rounded-full bg-slate-900 dark:bg-white border-4 border-slate-50 dark:border-slate-800 flex items-center justify-center">
                    <span className="material-symbols-outlined text-white dark:text-slate-900 text-[14px]">shield</span>
                </div>
              </div>
              <div>
                <h4 className="text-2xl font-black font-headline tracking-tighter text-slate-900 dark:text-white leading-tight">
                    {owner?.name || (typeof estate.manager === 'object' ? (estate.manager.name || estate.manager.email || 'Asset Manager') : (estate.manager || 'N/A'))}
                </h4>
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mt-2 font-manrope">Principal Asset Manager</p>
              </div>
              <div className="w-full pt-8 border-t border-slate-200 dark:border-slate-700">
                <Link href={`/dashboard/estate-owners/${owner?._id}`} className="inline-flex items-center gap-2 text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest hover:gap-4 transition-all">
                    View Stakeholder File
                    <span className="material-symbols-outlined text-sm">arrow_right_alt</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Infrastructure Metrics */}
          <div className="bg-white dark:bg-slate-900 p-10 rounded-[32px] border border-slate-300 dark:border-slate-800 space-y-10">
            <div className="flex items-center gap-6 group/item">
              <div className="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-900 dark:text-white shrink-0 group-hover/item:bg-slate-900 dark:group-hover/item:bg-white group-hover/item:text-white dark:group-hover/item:text-slate-900 transition-all duration-500">
                <span className="material-symbols-outlined text-2xl">layers</span>
              </div>
              <div>
                <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] font-manrope mb-1 block">Total Footprint</label>
                <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black font-headline tabular-nums text-slate-900 dark:text-white">{estate.sqft?.toLocaleString() || '42,000'}</span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sq Ft</span>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-900 dark:bg-white p-8 rounded-[24px] border border-slate-800 dark:border-slate-200 relative overflow-hidden group/sub">
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] font-manrope mb-2">Subscription Tier</p>
                  <p className="text-3xl font-black font-headline tracking-tighter text-white dark:text-slate-900">{estate.subscription || 'Premium'} Plan</p>
                </div>
                <div className="bg-emerald-500 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-xl shadow-emerald-500/20">
                  Active
                </div>
              </div>
              <div className="absolute right-[-20px] bottom-[-20px] opacity-10 pointer-events-none group-hover/sub:scale-110 transition-transform duration-1000">
                <span className="material-symbols-outlined text-[100px] text-white dark:text-slate-900">verified</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Resident Registry Module */}
        <section className="col-span-12 pt-10 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-300">
            <div className="flex items-center gap-4 mb-8 px-4">
                <h3 className="text-3xl font-black font-headline tracking-tighter text-slate-900 dark:text-white leading-none">Resident Registry</h3>
                <span className="w-px h-8 bg-slate-200 dark:bg-slate-800"></span>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] font-manrope">Unified Census Protocol</p>
            </div>
            <ResidentRegistry residents={residents} estateName={estate.name} />
        </section>
      </div>
    </div>
  );
};

export default ViewEstatePage;