"use client"
import React from 'react';

const ReceiptModal = ({ isOpen, onClose, transaction, estate }) => {
    if (!isOpen || !transaction) return null;

    const handlePrint = () => {
        window.print();
    };

    const handleSend = () => {
        alert(`Receipt for ${transaction.id} has been queued for delivery to ${estate?.owner?.name || 'the administrator'}.`);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col animate-in zoom-in-95 duration-300 border border-slate-100 dark:border-slate-800">
                {/* Modal Header */}
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-slate-900 dark:bg-slate-800 rounded-lg flex items-center justify-center text-white border border-slate-800 dark:border-white/10">
                            <span className="material-symbols-outlined text-sm">receipt_long</span>
                        </div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest font-manrope">Payment Receipt</h3>
                    </div>
                    <button 
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    >
                        <span className="material-symbols-outlined text-xl">close</span>
                    </button>
                </div>

                {/* Receipt Content */}
                <div className="p-8 space-y-8 bg-white dark:bg-slate-900 print:p-0">
                    {/* Brand/Header Section */}
                    <div className="text-center space-y-1">
                        <h4 className="text-2xl font-black font-headline text-slate-900 dark:text-white tracking-tight">The Estate Director</h4>
                        <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] font-manrope">Official Transaction Document</p>
                    </div>

                    {/* Main Info Strip */}
                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-5 border border-slate-100 dark:border-slate-800 flex justify-between items-center">
                        <div>
                            <p className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest font-manrope mb-1">Amount Paid</p>
                            <p className="text-3xl font-black font-headline text-slate-900 dark:text-blue-400 tabular-nums tracking-tighter">
                                ${parseFloat(transaction.amount).toLocaleString()}
                            </p>
                        </div>
                        <div className="text-right">
                            <span className={`px-2.5 py-1 rounded text-[9px] font-black uppercase tracking-widest ${transaction.status === 'Completed' ? 'bg-slate-900 dark:bg-slate-800 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
                                {transaction.status}
                            </span>
                        </div>
                    </div>

                    {/* Details Table */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-slate-800">
                            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest font-manrope">Transaction ID</span>
                            <span className="text-xs font-bold text-slate-900 dark:text-white tabular-nums">{transaction.id}</span>
                        </div>
                        <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-slate-800">
                            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest font-manrope">Estate</span>
                            <span className="text-xs font-extrabold text-slate-900 dark:text-white tracking-tight">{transaction.name}</span>
                        </div>
                        <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-slate-800">
                            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest font-manrope">Date</span>
                            <span className="text-xs font-bold text-slate-900 dark:text-white">{transaction.date || 'July 15, 2024'}</span>
                        </div>
                        <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-slate-800">
                            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest font-manrope">Payment Method</span>
                            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
                                <span className="material-symbols-outlined text-sm text-slate-500 dark:text-slate-400">{transaction.method}</span>
                                {transaction.methodName}
                            </div>
                        </div>
                    </div>

                    {/* Footer/Verification */}
                    <div className="pt-6 flex flex-col items-center gap-4">
                        <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800/50 rounded-lg p-2 border border-slate-100 dark:border-slate-800 opacity-60 grayscale hover:grayscale-0 transition-all cursor-crosshair">
                            <img 
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${transaction.id}`} 
                                alt="Verification QR" 
                                className="w-full h-full object-contain"
                            />
                        </div>
                        <p className="text-[9px] text-slate-500 dark:text-slate-400 text-center font-body leading-relaxed">
                            This receipt is generated electronically and is valid without a physical signature. <br />
                            For verification, scan the QR code above or visit our website.
                        </p>
                    </div>
                </div>

                {/* Modal Actions */}
                <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-4">
                    <button 
                        onClick={handleSend}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all active:scale-95 shadow-sm"
                    >
                        <span className="material-symbols-outlined text-sm">send</span>
                        Send
                    </button>
                    <button 
                        onClick={handlePrint}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-900 dark:bg-slate-800 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all active:scale-95 shadow-lg border border-slate-800 dark:border-white/10"
                    >
                        <span className="material-symbols-outlined text-sm">download</span>
                        Download
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReceiptModal;
