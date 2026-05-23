import React from 'react';
import { getJoinRequests } from '@/lib/services';
import Link from 'next/link';
import { MoreHorizontal } from 'lucide-react';
import RequestTable from '@/components/RequestTable';

const RequestsPage = async () => {
  const requests = await getJoinRequests();

  return (
    <div className="p-10 space-y-10 min-h-screen bg-white dark:bg-slate-900 font-body">
      {/* Page Header */}
      <div className="flex justify-between items-end mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
        <div>
          <nav className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest font-manrope mb-2">
            <Link href="/dashboard" className="hover:text-slate-900 dark:hover:text-white transition-colors">Dashboard</Link>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span className="text-slate-900 dark:text-white">Join Requests</span>
          </nav>
          <h2 className="text-4xl font-extrabold font-headline tracking-tight text-slate-900 dark:text-white">Join Requests</h2>
        </div>
      </div>

      <RequestTable requests={requests}/>

    </div>
  );
};

export default RequestsPage;