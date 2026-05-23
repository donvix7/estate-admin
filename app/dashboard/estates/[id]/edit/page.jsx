"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { getEstateById, getOwners } from '@/lib/services';
import { editEstate } from '@/lib/actions';

const EditEstatePage = () => {
    const params = useParams();
    const router = useRouter();
    const id = params.id;

    // Form State
    const [name, setName] = useState('');
    const [type, setType] = useState('Mixed-Use Development');
    const [address, setAddress] = useState('');
    const [plan, setPlan] = useState('Basic');
    const [subStatus, setSubStatus] = useState('Active');
    const [totalUnits, setTotalUnits] = useState(0);
    const [ownerName, setOwnerName] = useState('');
    
    // UI State
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [owners, setOwners] = useState([]);
    const [originalEstate, setOriginalEstate] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [estateData, allOwners] = await Promise.all([
                    getEstateById(id),
                    getOwners()
                ]);

                if (estateData) {
                    setOriginalEstate(estateData);
                    setName(estateData.name || '');
                    setType(estateData.type || 'Mixed-Use Development');
                    setAddress(estateData.address || estateData.location || '');
                    setPlan(estateData.subscription?.plan || estateData.subscriptionPlan || 'Basic');
                    setSubStatus(estateData.subscription?.status || 'Active');
                    setTotalUnits(estateData.totalUnits || estateData.units?.length || 0);
                    setOwnerName(estateData.owner?.name || '');
                }
                setOwners(allOwners);
            } catch (error) {
                console.error("Error fetching estate data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        const currentOwner = owners.find(o => o.name === ownerName) || { name: ownerName };

        const updatedData = {
            ...originalEstate,
            name,
            type,
            address,
            location: address, // Mirroring address to location for directory consistency
            subscription: {
                ...originalEstate?.subscription,
                plan,
                status: subStatus,
            },
            totalUnits: parseInt(totalUnits),
            owner: {
                ...originalEstate?.owner,
                name: ownerName,
                // If we have more owner info in original, it stays. 
                // In a real app we might want to update role/avatar if the owner changed.
            },
            updated_at: new Date().toISOString(),
        };

        try {
            // Minimum 3s delay for UX consistency
            const minDelay = new Promise(resolve => setTimeout(resolve, 3000));
            await Promise.all([editEstate(id, updatedData), minDelay]);
            router.push(`/dashboard/estates/${id}`);
        } catch (error) {
            console.error("Error updating estate:", error);
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-on-surface">
                <div className="relative w-16 h-16 mb-6">
                    <div className="absolute inset-0 rounded border-4 border-surface-container-high" />
                    <div className="absolute inset-0 rounded border-4 border-transparent border-t-primary animate-spin" />
                </div>
                <p className="text-on-surface-variant font-medium font-body animate-pulse">Loading Asset Configuration...</p>
            </div>
        );
    }

    if (!originalEstate) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-on-surface">
                <span className="material-symbols-outlined text-6xl opacity-20 mb-4">domain_disabled</span>
                <h2 className="text-2xl font-bold font-headline">Estate Not Found</h2>
                <p className="text-on-surface-variant font-body mt-2">The requested estate identifier {id} does not exist in our records.</p>
                <Link href="/dashboard/estates" className="mt-8 px-6 py-2 bg-primary text-white rounded-md text-xs font-bold uppercase tracking-widest font-manrope">Back to Portfolio</Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-8 py-10 text-on-surface">
            {/* Page Header */}
            <div className="flex justify-between items-end mb-12 animate-in fade-in slide-in-from-top-4 duration-500">
                <div>
                    <nav className="flex items-center gap-2 text-[10px] font-bold text-on-secondary-container mb-2 uppercase tracking-widest font-manrope">
                        <Link href="/dashboard/estates" className="hover:text-primary transition-colors">Properties</Link>
                        <span className="material-symbols-outlined text-xs">chevron_right</span>
                        <Link href={`/dashboard/estates/${id}`} className="hover:text-primary transition-colors">{originalEstate.name}</Link>
                        <span className="material-symbols-outlined text-xs">chevron_right</span>
                        <span className="text-primary-container">Edit Configuration</span>
                    </nav>
                    <h2 className="text-4xl font-extrabold font-headline tracking-tight text-primary-container">Edit {name || originalEstate.name}</h2>
                </div>
                <div className="flex gap-4">
                    <Link href={`/dashboard/estates/${id}`}>
                        <button className="px-6 py-2.5 border border-outline-variant/30 hover:bg-surface-container-high transition-all text-on-surface-variant font-bold text-xs uppercase tracking-widest rounded-md font-manrope cursor-pointer">
                            Cancel
                        </button>
                    </Link>
                    <button 
                        onClick={handleSubmit}
                        className="bg-primary hover:opacity-90 text-white px-8 py-2.5 rounded-md font-bold text-xs uppercase tracking-widest shadow-lg shadow-primary/20 cursor-pointer font-manrope transition-all"
                    >
                        Save Changes
                    </button>
                </div>
            </div>

            {/* Bento Layout Grid */}
            <div className="grid grid-cols-12 gap-8">
                {/* Basic Identity Section */}
                <section className="col-span-12 lg:col-span-7 space-y-8 animate-in fade-in slide-in-from-left-4 duration-700 delay-100">
                    <div className="bg-surface-container-lowest p-8 rounded-xl shadow-sm border border-outline-variant/10 text-on-surface">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-bold font-headline">Basic Identity</h3>
                            <span className="material-symbols-outlined text-outline">info</span>
                        </div>
                        
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest font-manrope">Estate Name</label>
                                    <input 
                                        className="w-full bg-surface-container-high border-none rounded-md px-4 py-3 text-sm focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary transition-all outline-none font-body" 
                                        type="text" 
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest font-manrope">Primary Type</label>
                                    <select 
                                        value={type}
                                        onChange={(e) => setType(e.target.value)}
                                        className="w-full bg-surface-container-high border-none rounded-md px-4 py-3 text-sm focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary transition-all outline-none appearance-none cursor-pointer font-body"
                                    >
                                        <option>Mixed-Use Development</option>
                                        <option>Residential High-Rise</option>
                                        <option>Commercial Plaza</option>
                                        <option>Industrial Complex</option>
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest font-manrope">Address</label>
                                <input 
                                    className="w-full bg-surface-container-high border-none rounded-md px-4 py-3 text-sm focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary transition-all outline-none font-body" 
                                    type="text" 
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest font-manrope">Subscription Plan</label>
                                    <select 
                                        value={plan}
                                        onChange={(e) => setPlan(e.target.value)}
                                        className="w-full bg-surface-container-high border-none rounded-md px-4 py-3 text-sm focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary transition-all outline-none appearance-none cursor-pointer font-body"
                                    >
                                        <option value="Basic">Basic Plan</option>
                                        <option value="Professional">Professional Plan</option>
                                        <option value="Enterprise">Enterprise Plan</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest font-manrope">Billing Status</label>
                                    <select 
                                        value={subStatus}
                                        onChange={(e) => setSubStatus(e.target.value)}
                                        className="w-full bg-surface-container-high border-none rounded-md px-4 py-3 text-sm focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary transition-all outline-none appearance-none cursor-pointer font-body"
                                    >
                                        <option>Active</option>
                                        <option>Past Due</option>
                                        <option>Grace Period</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div className="pt-4">
                                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-3 block font-manrope">Location Map</label>
                                <div className="h-64 rounded-xl overflow-hidden bg-surface-container-high relative border border-outline-variant/10 shadow-inner group cursor-crosshair text-on-surface">
                                    <img 
                                        className="w-full h-full object-cover grayscale opacity-80 group-hover:opacity-100 transition-opacity duration-700" 
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCzE6yJxLa6m9Zf6TMBckS5MbOo-aPsw5HLYbX4DseMSyoHXT9hwqLZOEbHwew9oXdDHwOUxUkUnETbDWGBXRvuvkpCnkVaPK9aMBmeTp2GgVZM2Lii5UdzCyCW8_P3SJ3m6xKzokkyhIZ-y4ALkpLVi9mtHUVLXAB2CHaeL_8ar0pzDnuBBiOBxkHnZyoYkZNDInwukgC3qWRAs06PhWmRdQtYIz2NBZiMaj65ajtTSmanfFNFYeOAPunpsnDvTDLyYg5vxhTAQbY2" 
                                        alt="Map"
                                    />
                                    <div className="absolute inset-0 bg-primary/5 text-on-surface"></div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="bg-white/90 backdrop-blur-md px-5 py-2.5 rounded-full flex items-center gap-2 shadow-2xl border border-white text-on-surface">
                                            <span className="material-symbols-outlined text-primary fill-1">location_on</span>
                                            <span className="text-xs font-bold font-manrope tabular-nums tracking-tighter text-on-surface">Click to update coordinates</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Estate Sidebar */}
                <aside className="col-span-12 lg:col-span-5 space-y-8 animate-in fade-in slide-in-from-right-4 duration-700 delay-200">
                     {/* Unit Configuration Edit */}
                     <div className="bg-slate-900 text-white p-8 rounded-xl relative overflow-hidden shadow-2xl border border-slate-800">
                        <h3 className="text-lg font-bold font-headline mb-6 tracking-tight">Structural Configuration</h3>
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-widest font-manrope">Total Capacity</label>
                                    <input 
                                        className="w-full bg-white/10 border-none rounded-md px-4 py-3 text-sm focus:ring-1 focus:ring-white/30 outline-none font-body" 
                                        type="number" 
                                        value={totalUnits} 
                                        onChange={(e) => setTotalUnits(e.target.value)}
                                    />
                                </div>
                            </div>
                            <button className="w-full py-4 bg-white text-slate-900 font-bold text-[10px] uppercase tracking-widest rounded-md hover:bg-slate-100 transition-all flex items-center justify-center gap-2 cursor-pointer font-manrope">
                                Update Asset Specs
                            </button>
                        </div>
                    </div>

                    {/* Ownership Edit */}
                    <div className="bg-surface-container-lowest p-8 rounded-xl shadow-sm border border-outline-variant/10 text-on-surface">
                        <h3 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest font-manrope mb-8">Stakeholder Assignment</h3>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest font-manrope">Principal Owner</label>
                                <select 
                                    className="w-full bg-surface-container-high border-none rounded-md px-4 py-3 text-sm focus:ring-1 focus:ring-primary outline-none font-body appearance-none cursor-pointer text-on-surface"
                                    value={ownerName}
                                    onChange={(e) => setOwnerName(e.target.value)}
                                >
                                    {owners.map(o => (
                                        <option key={o.id} value={o.name}>{o.name}</option>
                                    ))}
                                </select>
                            </div>
                            <p className="text-[10px] text-on-surface-variant font-medium leading-relaxed">
                                Changing the principal owner will trigger an administrative compliance review and update all property management records.
                            </p>
                        </div>
                    </div>
                </aside>
            </div>

            {/* Submitting Modal */}
            {submitting && (
                <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="bg-surface rounded-2xl shadow-2xl p-10 flex flex-col items-center gap-6 max-w-sm w-full mx-4 border border-outline-variant/20">
                        <div className="relative w-16 h-16">
                            <div className="absolute inset-0 rounded border-4 border-surface-container-high" />
                            <div className="absolute inset-0 rounded border-4 border-transparent border-t-primary animate-spin" />
                        </div>
                        <div className="text-center space-y-2">
                            <h3 className="text-xl font-black font-headline text-on-surface">Updating Asset</h3>
                            <p className="text-sm text-on-surface-variant font-body">Serializing changes to the permanent ledger. Please wait...</p>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-widest font-manrope">
                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                            Syncing Data
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EditEstatePage;
