'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { editOwner } from '@/lib/actions';
import { getOwnerById } from '@/lib/services';

const EditEstateOwnerPage = () => {
    const params = useParams();
    const ownerId = params.id;
    const router = useRouter();

    // Form state
    const [name, setName] = useState('');
    const [type, setType] = useState('Individual / Private Trust');
    const [taxId, setTaxId] = useState('');
    const [jurisdiction, setJurisdiction] = useState('');
    const [email, setEmail] = useState('');
    const [dialCode, setDialCode] = useState('+44');
    const [phone, setPhone] = useState('');

    // UI state
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [error, setError] = useState('');

    // Load existing owner data
    useEffect(() => {
        const fetchOwner = async () => {
            try {
            const owner = await getOwnerById(ownerId);

            if(!owner){
                setError("Owner not found");
                return;
            }
                
            setName(owner.name || '');
            setType(owner.type || owner.role || 'Individual');
            setTaxId(owner.taxId || '');
            setJurisdiction(owner.address || owner.jurisdiction || '');
            setEmail(owner.email || '');
            // Split phone if it has a dial code
            if (owner.phone) {
                const match = owner.phone.match(/^(\+\d{1,3})\s?(.*)/);
                if (match) {
                    setDialCode(match[1]);
                    setPhone(match[2]);
                } else {
                    setPhone(owner.phone);
                }
            }
            } catch (err) {
                console.error('Error fetching owner:', err);
                setError('Could not load owner data.');
            } finally {
                setFetching(false);
            }
        };
        fetchOwner();
    }, [ownerId]);

    const handleSubmit = async () => {
        if (!name.trim()) { setError('Full Legal Name is required.'); return; }
        setLoading(true);
        setError('');
        const updatedData = {
            name,
            address: jurisdiction,
            email,
            phone: phone ? `${dialCode} ${phone}` : '',
        };
        try {
            await editOwner(ownerId, updatedData);
            router.push(`/dashboard/estate-owners/${ownerId}`);
        } catch (err) {
            setError('Failed to update owner. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-8 py-10 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 text-on-surface">
            {/* Header & Breadcrumbs */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest font-manrope opacity-60">
                    <Link href="/dashboard/estate-owners" className="hover:text-primary transition-colors">Directory</Link>
                    <span className="material-symbols-outlined text-[12px]">chevron_right</span>
                    <span>Edit Profile</span>
                </div>
                <div className="flex justify-between items-end">
                    <div>
                        <h2 className="text-3xl font-extrabold tracking-tight font-headline text-primary-container">Edit Owner Profile</h2>
                        <p className="text-on-surface-variant font-medium text-sm mt-1">Update legal entity details, contact information, and portfolio allocations.</p>
                    </div>
                    <div className="flex gap-3">
                        <Link href={`/dashboard/estate-owners/${ownerId}/view`} className="px-6 py-2.5 bg-surface-container-low text-on-secondary-container font-label text-[10px] font-bold uppercase tracking-widest rounded-md hover:bg-surface-container-high transition-colors">
                            Cancel
                        </Link>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={loading || fetching}
                            className="px-8 py-2.5 bg-primary dark:bg-white text-white dark:text-slate-900 font-label text-[10px] font-bold uppercase tracking-widest rounded-md hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Saving...' : 'Update Registration'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Error banner */}
            {error && (
                <div className="p-4 bg-error-container text-on-error-container rounded-lg text-sm font-bold font-manrope">
                    {error}
                </div>
            )}

            {fetching ? (
                <div className="flex items-center justify-center py-24">
                    <div className="w-10 h-10 rounded-full border-4 border-surface-container-high border-t-primary animate-spin" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                    {/* Left Column: Form Details */}
                    <div className="md:col-span-8 space-y-8">
                        {/* Identity Module */}
                        <div className="bg-white dark:bg-slate-900 p-8 rounded-xl border border-slate-300 dark:border-slate-800">
                            <h3 className="text-sm font-black uppercase tracking-[0.2em] font-manrope mb-8 text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-4">
                                Principal Identity
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.15em] font-manrope">Full Legal Name</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md px-4 py-3 text-sm focus:border-primary dark:focus:border-white transition-all placeholder:text-slate-400 font-body outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.15em] font-manrope">Entity Classification</label>
                                    <select
                                        value={type}
                                        onChange={(e) => setType(e.target.value)}
                                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md px-4 py-3 text-sm focus:border-primary dark:focus:border-white transition-all cursor-pointer appearance-none font-body outline-none"
                                    >
                                        <option>Individual</option>
                                        <option>Corporate</option>
                                        <option>Institutional</option>
                                        <option>Family</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.15em] font-manrope">Passport / Tax ID</label>
                                    <input
                                        type="text"
                                        value={taxId}
                                        onChange={(e) => setTaxId(e.target.value)}
                                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md px-4 py-3 text-sm focus:border-primary dark:focus:border-white transition-all placeholder:text-slate-400 font-body tabular-nums outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.15em] font-manrope">Jurisdiction of Residency</label>
                                    <input
                                        type="text"
                                        value={jurisdiction}
                                        onChange={(e) => setJurisdiction(e.target.value)}
                                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md px-4 py-3 text-sm focus:border-primary dark:focus:border-white transition-all placeholder:text-slate-400 font-body outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Contact Architecture */}
                        <div className="bg-white dark:bg-slate-900 p-8 rounded-xl border border-slate-300 dark:border-slate-800">
                            <h3 className="text-sm font-black uppercase tracking-[0.2em] font-manrope mb-8 text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-4">
                                Contact Infrastructure
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.15em] font-manrope">Primary Email Address</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md px-4 py-3 text-sm focus:border-primary dark:focus:border-white transition-all placeholder:text-slate-400 font-body outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.15em] font-manrope">Global Dialing Code</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={dialCode}
                                            onChange={(e) => setDialCode(e.target.value)}
                                            className="w-20 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md px-4 py-3 text-sm focus:border-primary dark:focus:border-white font-body tabular-nums text-center outline-none"
                                        />
                                        <input
                                            type="text"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md px-4 py-3 text-sm focus:border-primary dark:focus:border-white font-body tabular-nums outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Status & Preview */}
                    <aside className="md:col-span-4 space-y-8">
                        {/* Status Modality */}
                        <div className="bg-surface-container-high/50 p-8 rounded-xl border border-outline-variant/10 space-y-6">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] font-manrope text-on-surface-variant text-center">Registration Status</h4>
                            <div className="flex flex-col items-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-tertiary-container flex items-center justify-center shadow-lg shadow-tertiary-container/20">
                                    <span className="material-symbols-outlined text-white text-3xl">verified_user</span>
                                </div>
                                <div className="text-center">
                                    <p className="text-lg font-black font-headline text-primary-container">Verified Premium</p>
                                    <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mt-1">Active Contract</p>
                                </div>
                            </div>
                            <div className="pt-6 border-t border-outline-variant/10">
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">KYC Compliance</span>
                                    <span className="px-2 py-0.5 bg-green-50 text-green-700 text-[8px] font-black uppercase rounded shadow-sm">Validated</span>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Asset Limit</span>
                                    <span className="text-xs font-black font-headline tracking-tighter">Unlimited</span>
                                </div>
                            </div>
                        </div>

                        {/* Live preview */}
                        <div className="bg-slate-900 dark:bg-white p-8 rounded-2xl text-white dark:text-slate-900 relative overflow-hidden group">
                            <div className="relative z-10 space-y-3">
                                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] font-manrope text-on-primary-container">Live Preview</h4>
                                <p className="text-xl font-black font-headline">{name || 'Owner Name'}</p>
                                <p className="text-[10px] text-tertiary-fixed-dim font-bold uppercase tracking-widest">{type}</p>
                                {email && <p className="text-xs text-white/70">{email}</p>}
                                {jurisdiction && <p className="text-xs text-white/70">{jurisdiction}</p>}
                            </div>
                            <div className="absolute right-[-20px] bottom-[-20px] opacity-10 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                                <span className="material-symbols-outlined text-[120px]">account_balance_wallet</span>
                            </div>
                        </div>

                        {/* Danger Protocol */}
                        <div className="p-6 rounded-xl border border-error/20 bg-error-container/5 space-y-4">
                            <div className="flex items-center gap-2 text-error">
                                <span className="material-symbols-outlined text-sm">warning</span>
                                <span className="text-[10px] font-black uppercase tracking-widest font-manrope">Administrative Action</span>
                            </div>
                            <p className="text-[10px] leading-relaxed text-on-surface-variant font-medium">Removing this principal entity will dissociate all portfolio assets and trigger a regulatory audit.</p>
                            <Link href={`/dashboard/estate-owners/${ownerId}/view`} className="text-[10px] font-black text-error underline uppercase tracking-widest font-manrope hover:text-red-700 transition-colors">
                                Cancel &amp; Return
                            </Link>
                        </div>
                    </aside>
                </div>
            )}

            {/* Sticky Footer Context */}
            <footer className="pt-10 border-t border-outline-variant/10 opacity-60 flex justify-center">
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.3em] font-manrope text-center max-w-lg">
                    Changes made here are permanent and logged in the Global Audit Trail. Administrative authorization is required for identity modification.
                </p>
            </footer>

            {/* Loading Modal */}
            {loading && (
                <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="bg-surface rounded-2xl shadow-2xl p-10 flex flex-col items-center gap-6 max-w-sm w-full mx-4 border border-outline-variant/20">
                        <div className="relative w-16 h-16">
                            <div className="absolute inset-0 rounded border-4 border-surface-container-high" />
                            <div className="absolute inset-0 rounded border-4 border-transparent border-t-primary animate-spin" />
                        </div>
                        <div className="text-center space-y-2">
                            <h3 className="text-xl font-black font-headline text-on-surface">Updating Profile</h3>
                            <p className="text-sm text-on-surface-variant font-body">Committing changes to the ledger. Please wait...</p>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-widest font-manrope">
                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                            Processing
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EditEstateOwnerPage;
