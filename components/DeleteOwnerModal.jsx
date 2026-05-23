'use client';

import { deleteOwner } from '@/lib/actions';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';

const DeleteOwnerModal = ({ ownerName, id }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleDelete = () => {
    if (confirmText !== 'DELETE') return;
    setIsDeleting(true);
    setTimeout(() => {
      deleteOwner(id);
      setIsDeleting(false);
      setIsOpen(false);
      router.push('/dashboard/estate-owners');
    }, 1500);
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="w-full py-4 px-6 text-white rounded-lg bg-red-600/80 flex items-center justify-between hover:bg-red-600 transition-colors border border-red-600/20 cursor-pointer"
      >
        <span className="text-xs font-black tracking-[0.2em] uppercase font-manrope">Delete Profile</span>
        <span className="material-symbols-outlined">delete_forever</span>
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl relative z-10 overflow-hidden border border-slate-100 dark:border-slate-800 animate-in zoom-in-95 slide-in-from-bottom-8 duration-500">
            {/* Modal Header */}
            <div className="bg-red-50 dark:bg-red-950/20 p-8 border-b border-red-100 dark:border-red-900/30">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center text-red-600 dark:text-red-400">
                  <span className="material-symbols-outlined">warning</span>
                </div>
                <h3 className="text-xl font-extrabold font-headline tracking-tight text-slate-900 dark:text-white">Confirm Deletion</h3>
              </div>
              <p className="text-sm font-body text-slate-500 dark:text-slate-400 leading-relaxed">
                You are about to purge <span className="font-bold text-slate-900 dark:text-white">{ownerName}</span> ({id}).
                This action will remove the owner and all linked portfolio relationships from the system.
              </p>
            </div>

            {/* Modal Body */}
            <div className="p-8 space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest font-manrope">
                  Type <span className="text-red-600 dark:text-red-400 font-extrabold italic">DELETE</span> to authorize
                </label>
                <input
                  type="text"
                  placeholder="DELETE"
                  className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-md px-4 py-3 text-sm focus:ring-1 focus:ring-red-600 dark:focus:ring-red-400 transition-all outline-none font-black tabular-nums text-center tracking-[0.2em] placeholder:text-slate-400/30 text-red-600 dark:text-red-400"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value.toUpperCase())}
                  autoFocus
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors rounded-lg text-xs font-bold uppercase tracking-widest font-manrope text-slate-900 dark:text-white disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={confirmText !== 'DELETE' || isDeleting}
                  className={`flex-1 px-4 py-3 rounded-lg text-xs font-bold uppercase tracking-widest font-manrope text-white transition-all shadow-lg ${
                    confirmText === 'DELETE'
                      ? 'bg-red-600 shadow-red-600/20 cursor-pointer active:scale-95'
                      : 'bg-slate-200 dark:bg-slate-700 cursor-not-allowed opacity-50'
                  } disabled:opacity-75`}
                >
                  {isDeleting ? 'Purging...' : 'Authorize Purge'}
                </button>
              </div>
            </div>

            <div className="px-8 py-4 bg-slate-50 dark:bg-slate-800/50 text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-center border-t border-slate-100 dark:border-slate-800">
              Transaction ID: Purge-Request-{id}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeleteOwnerModal;
