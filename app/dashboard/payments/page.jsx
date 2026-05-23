import { getPayments, getEstates } from '@/lib/services';
import React from 'react';
import PaymentsDashboard from '@/components/PaymentsDashboard';

const PaymentsPage = async () => {
    const [payments, estates] = await Promise.all([
        getPayments(),
        getEstates()
    ]);

  return (
    <div className="max-w-7xl mx-auto px-8 py-10 space-y-10 text-slate-900 dark:text-white animate-in fade-in slide-in-from-bottom-4 duration-700">
        <PaymentsDashboard initialPayments={payments} estates={estates} />

        {/* Footer Meta Info */}
        <footer className="flex flex-col sm:flex-row justify-between items-center pt-10 border-t border-slate-100 dark:border-slate-800 opacity-60">
            <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest font-manrope mb-4 sm:mb-0">
                © 2024 The Estate Director • Financial Management Module v4.2
            </p>
            <div className="flex gap-8">
                <button className="text-[10px] font-black text-slate-900 dark:text-white hover:text-primary dark:hover:text-blue-400 transition-colors uppercase tracking-widest font-manrope cursor-pointer">Privacy Policy</button>
                <button className="text-[10px] font-black text-slate-900 dark:text-white hover:text-primary dark:hover:text-blue-400 transition-colors uppercase tracking-widest font-manrope cursor-pointer">System Status</button>
            </div>
        </footer>
    </div>
  );
};

export default PaymentsPage;