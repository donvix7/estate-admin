"use client"
import Link from 'next/link';
import React from 'react'

const RequestTable = ({requests}) => {
  return (
    <div>
        
      {/* Requests Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 font-manrope">Estate Name</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 font-manrope">Type</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 font-manrope">Location</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 font-manrope">Status</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 font-manrope text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
            {requests.length > 0 ? (
              requests.map((request) => (
                <tr key={request._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                  <td className="px-6 py-5">
                    <Link href={`/dashboard/requests/${request._id}`} className="flex flex-col group/link">
                      <span className="font-bold text-slate-900 dark:text-white font-headline group-hover/link:text-primary transition-colors">{request.name}</span>
                      <span className="text-[10px] text-slate-400 font-medium tabular-nums uppercase tracking-wider">{request._id}</span>
                    </Link>
                  </td>
                  <td className="px-6 py-5">
                    <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">
                      {request.type}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-slate-600 dark:text-slate-300">{request.location?.city}, {request.location?.state}</span>
                      <span className="text-[10px] text-slate-400 font-body line-clamp-1">{request.location?.address}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${request.status === 'pending' ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`}></span>
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${request.status === 'pending' ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                        {request.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <Link 
                      href={`/dashboard/requests/${request._id}`}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-slate-800 text-white text-[10px] font-bold uppercase tracking-widest rounded-md hover:opacity-90 transition-all shadow-lg shadow-slate-900/10"
                    >
                      <span className="material-symbols-outlined text-sm">visibility</span>
                      View Detail
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-20 text-center">
                  <div className="flex flex-col items-center gap-4 opacity-20">
                    <span className="material-symbols-outlined text-6xl">inbox</span>
                    <p className="text-sm font-bold uppercase tracking-[0.2em]">No Join Requests Found</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default RequestTable