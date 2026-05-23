import React from 'react';
import { getJoinRequestById } from '@/lib/services';
import Link from 'next/link';
import RequestDecisionButtons from '@/components/RequestDecisionButtons';

const RequestDetailPage = async ({ params }) => {
  const { id } = await params;
  const request = await getJoinRequestById(id);

  if (!request) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-900 dark:text-white">
        <span className="material-symbols-outlined text-6xl opacity-20 mb-4">error_outline</span>
        <h2 className="text-2xl font-bold font-headline">Request Not Found</h2>
        <p className="text-slate-500 font-body mt-2">The requested identifier {id} does not exist in our records.</p>
        <Link href="/dashboard/requests" className="mt-8 px-6 py-2 bg-slate-900 text-white rounded-md text-xs font-bold uppercase tracking-widest font-manrope transition-opacity hover:opacity-90">Back to Requests</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-8 py-10 text-slate-900 dark:text-white font-body">
      {/* Page Header */}
      <div className="flex justify-between items-end mb-12 animate-in fade-in slide-in-from-top-4 duration-500">
        <div>
          <nav className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest font-manrope mb-2">
            <Link href="/dashboard/requests" className="hover:text-slate-900 dark:hover:text-white transition-colors">Join Requests</Link>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span className="text-slate-900 dark:text-white">Request Detail</span>
          </nav>
          <div className="flex items-center gap-4">
            <h2 className="text-4xl font-extrabold font-headline tracking-tight">{request.name}</h2>
            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${request.status === 'pending' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}>
              {request.status}
            </span>
          </div>
          <p className="text-[25px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-2">ID: {request._id}</p>
        </div>
        
        <RequestDecisionButtons id={id} request={request} />

      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Main Details */}
        <div className="col-span-12 lg:col-span-8 space-y-8 animate-in fade-in slide-in-from-left-4 duration-700">
          {/* Identity & Location */}
          <section className="bg-white dark:bg-slate-900 p-8 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold font-headline">Registration Identity</h3>
              <span className="material-symbols-outlined text-slate-400">info</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-manrope">Estate Name</label>
                <p className="text-lg font-bold">{request.name}</p>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-manrope">Estate Type</label>
                <p className="text-lg font-bold capitalize">{request.type}</p>
              </div>
              <div className="col-span-2 space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-manrope">Physical Address</label>
                <p className="text-sm font-medium leading-relaxed text-slate-600 dark:text-slate-400">
                  {request.location?.address}, {request.location?.city}, {request.location?.state}
                </p>
              </div>
            </div>
          </section>

          {/* Amenities */}
          <section className="bg-white dark:bg-slate-900 p-8 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
            <h3 className="text-xl font-bold font-headline">Proposed Amenities</h3>
            <div className="flex flex-wrap gap-3">
              {request.amenities?.length > 0 ? (
                request.amenities.map((amenity, idx) => (
                  <span key={idx} className="px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 font-manrope border border-slate-100 dark:border-slate-700">
                    {amenity}
                  </span>
                ))
              ) : (
                <p className="text-xs text-slate-400 italic">No specific amenities listed.</p>
              )}
            </div>
          </section>
        </div>

        {/* Sidebar Info */}
        <div className="col-span-12 lg:col-span-4 space-y-8 animate-in fade-in slide-in-from-right-4 duration-700">
          {/* Contact Details */}
          <section className="bg-slate-900 text-white p-8 rounded-xl shadow-2xl space-y-6">
            <h3 className="text-lg font-bold font-headline tracking-tight border-b border-white/10 pb-4">Administrative Contact</h3>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-white">mail</span>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest font-manrope">Official Email</p>
                  <p className="text-sm font-bold truncate">{request.officeContact?.[0] || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-white">phone</span>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest font-manrope">Phone Number</p>
                  <p className="text-sm font-bold">{request.officeContact?.[1] || 'N/A'}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Timeline Info */}
          <section className="bg-white dark:bg-slate-900 p-8 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-manrope">Request Timeline</h3>
            <div className="space-y-6">
              <div className="flex gap-4 relative">
                <div className="w-px bg-slate-100 dark:bg-slate-800 absolute left-[7px] top-6 bottom-0"></div>
                <div className="w-4 h-4 rounded-full border-4 border-emerald-500 bg-white dark:bg-slate-900 z-10 shrink-0"></div>
                <div className="pb-4">
                  <p className="text-xs font-bold">Registration Submitted</p>
                  <p className="text-[10px] text-slate-400 tabular-nums uppercase mt-1">
                    {new Date(request.createdAt).toLocaleDateString()} at {new Date(request.createdAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-4 h-4 rounded-full border-4 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 z-10 shrink-0"></div>
                <div>
                  <p className="text-xs font-bold text-slate-400">Approval Pending</p>
                  <p className="text-[10px] text-slate-400 uppercase mt-1">Awaiting admin review</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default RequestDetailPage;