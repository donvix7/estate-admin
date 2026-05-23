import React from 'react';
import { getLogById } from '@/lib/services';
import Link from 'next/link';

export default async function ActivityDetailPage({ params }) {
    const { id } = await params;
    const log = await getLogById(id);

    if (!log) {
        return (
            <div className="p-10 text-center">
                <h2 className="text-2xl font-bold">Activity Not Found</h2>
                <Link href="/dashboard/activities" className="text-primary hover:underline mt-4 inline-block">Back to Logs</Link>
            </div>
        );
    }

    return (
        <div className="p-10 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Section: Severity Banner */}
            <section className="bg-surface-container-low rounded-xl overflow-hidden shadow-sm">
                <div className={`flex flex-col md:flex-row items-center justify-between p-8 bg-gradient-to-r ${log.critical ? 'from-error/10' : 'from-primary/5'} to-transparent`}>
                    <div className="flex items-center gap-6">
                        <div className={`w-16 h-16 ${log.critical ? 'bg-error' : 'bg-primary'} flex items-center justify-center rounded-lg shadow-lg`}>
                            <span className="material-symbols-outlined text-white text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                                {log.icon || 'info'}
                            </span>
                        </div>
                        <div>
                            <h2 className="text-3xl font-extrabold tracking-tighter text-on-surface font-headline">{log.type}</h2>
                            <div className="flex items-center gap-3 mt-1">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${log.critical ? 'bg-error text-white' : 'bg-secondary-container text-on-secondary-container'} uppercase tracking-widest`}>
                                    {log.critical ? 'Critical Severity' : 'Standard Event'}
                                </span>
                                <span className="text-on-surface-variant font-medium text-sm font-body">• {log.subType}</span>
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 md:mt-0 flex gap-3">
                        <button className="bg-surface-container-highest px-6 py-3 rounded-md text-on-surface font-bold text-xs uppercase tracking-widest hover:bg-surface-variant transition-colors cursor-pointer font-manrope">Acknowledge</button>
                        <button className="bg-gradient-to-br from-primary to-primary-container px-6 py-3 rounded-md text-white font-bold text-xs uppercase tracking-widest shadow-md active:scale-95 transition-all cursor-pointer font-manrope">Escalate Thread</button>
                    </div>
                </div>
            </section>

            {/* Quick Stats Bar */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-surface-container-lowest p-6 rounded-lg flex items-center gap-4 border border-outline-variant/10 shadow-sm">
                    <div className="p-3 bg-surface-container rounded-lg">
                        <span className="material-symbols-outlined text-on-surface-variant">schedule</span>
                    </div>
                    <div>
                        <p className="text-[10px] uppercase font-bold text-on-primary-container tracking-widest font-manrope">Event Time</p>
                        <p className="text-base font-bold text-on-surface tabular-nums">{log.date} • {log.time}</p>
                    </div>
                </div>
                <div className="bg-surface-container-lowest p-6 rounded-lg flex items-center gap-4 border border-outline-variant/10 shadow-sm">
                    <div className="p-3 bg-surface-container rounded-lg">
                        <span className="material-symbols-outlined text-on-surface-variant">location_on</span>
                    </div>
                    <div>
                        <p className="text-[10px] uppercase font-bold text-on-primary-container tracking-widest font-manrope">Location</p>
                        <p className="text-base font-bold text-on-surface">{log.location}</p>
                    </div>
                </div>
                <div className="bg-surface-container-lowest p-6 rounded-lg flex items-center gap-4 border border-outline-variant/10 shadow-sm">
                    <div className="p-3 bg-surface-container rounded-lg">
                        <span className="material-symbols-outlined text-on-surface-variant">fingerprint</span>
                    </div>
                    <div>
                        <p className="text-[10px] uppercase font-bold text-on-primary-container tracking-widest font-manrope">Reference ID</p>
                        <p className="text-base font-bold text-on-surface">#{log.id}</p>
                    </div>
                </div>
            </section>

            {/* Main Area */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Left Column: Primary Content */}
                <div className="lg:col-span-8 space-y-10">
                    {/* Event Narrative */}
                    <div className="bg-surface-container-lowest p-8 rounded-xl shadow-sm space-y-6 border border-outline-variant/5">
                        <h3 className="text-xl font-bold border-b border-surface-container pb-4 font-headline">Event Narrative</h3>
                        <div className="prose prose-slate max-w-none text-on-surface-variant leading-relaxed font-body">
                            <p>The automated diagnostic system detected non-standard operational patterns during the routine system audit. These parameters were characterized by deviations from baseline performance metrics, suggesting either a transient mechanical anomaly or a deliberate system adjustment.</p>
                            <p className="mt-4">Initial system protocols initiated a temporary isolation of the affected subsystem to prevent cascade failure. Real-time data streams confirmed that localized safeguards successfully mitigated any potential structural integrity issues within the immediate operational quadrant.</p>
                            <div className="my-6 p-6 bg-surface-container-low rounded-lg border-l-4 border-primary shadow-sm">
                                <p className="italic text-sm font-medium">"Preliminary analysis indicates that the automated response suppressed the primary fault-line within 12 seconds. No downstream impact was recorded in the primary database ledger." — System Architect v1.0</p>
                            </div>
                            <p>A secondary validation sweep has been scheduled for the next synchronization cycle. All related telemetry has been successfully encapsulated and prioritized for archival in the central administrative vault.</p>
                        </div>
                    </div>

                    {/* Origin Data */}
                    <div className="bg-surface-container-lowest p-8 rounded-xl shadow-sm border border-outline-variant/5">
                        <h3 className="text-xl font-bold border-b border-surface-container pb-4 mb-6 font-headline">Origin & Technical Vector</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="p-6 bg-surface-container-low rounded-xl border border-outline-variant/5 shadow-inner">
                                <p className="text-[10px] uppercase font-bold text-on-primary-container tracking-widest mb-1 font-manrope">Source Node Address</p>
                                <p className="text-lg font-mono font-bold text-on-surface tabular-nums">192.168.1.{log.id}44</p>
                                <span className="inline-block mt-2 px-2 py-0.5 bg-secondary-container text-on-secondary-container text-[10px] rounded font-bold uppercase tracking-tight">Internal Infrastructure</span>
                            </div>
                            <div className="p-6 bg-surface-container-low rounded-xl border border-outline-variant/5 shadow-inner">
                                <p className="text-[10px] uppercase font-bold text-on-primary-container tracking-widest mb-1 font-manrope">Access Point Hub</p>
                                <p className="text-lg font-bold text-on-surface">{log.location.split(',')[0]}</p>
                                <span className="inline-block mt-2 px-2 py-0.5 bg-tertiary-fixed text-on-tertiary-fixed-variant text-[10px] rounded font-bold uppercase tracking-tight">Verified Protocol</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Contextual Sidebar */}
                <div className="lg:col-span-4 space-y-10">
                    {/* Personnel Involved */}
                    <div className="space-y-4">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-on-primary-container font-manrope opacity-60">Personnel & Oversight</h3>
                        <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm border-l-4 border-primary-container flex items-center gap-4 border border-outline-variant/10">
                            <div className="w-12 h-12 rounded-lg bg-surface-container-low flex items-center justify-center font-bold text-primary font-manrope uppercase shadow-inner">
                                {log.userInitials || 'AD'}
                            </div>
                            <div className="overflow-hidden">
                                <p className="font-bold text-on-surface truncate">{log.user || 'Administrator'}</p>
                                <p className="text-xs text-on-surface-variant font-semibold tracking-tight">Stakeholder / Operative</p>
                            </div>
                            <span className="ml-auto material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                        </div>
                        <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm border-l-4 border-tertiary-container flex items-center gap-4 border border-outline-variant/10">
                            <div className="w-12 h-12 rounded-lg bg-tertiary-container flex items-center justify-center text-white shadow-inner">
                                <span className="material-symbols-outlined">psychology</span>
                            </div>
                            <div>
                                <p className="font-bold text-on-surface">Sentinel AI v4.2</p>
                                <p className="text-xs text-on-surface-variant font-semibold tracking-tight">Detection Engine</p>
                            </div>
                        </div>
                    </div>

                    {/* Evidence Vault */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-on-primary-container font-manrope opacity-60">Evidence Vault</h3>
                            <button className="text-[10px] font-bold text-primary uppercase tracking-widest hover:underline cursor-pointer">Download Archive</button>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                            <div className="group relative bg-surface-container-lowest p-3 rounded-xl shadow-sm border border-outline-variant/20 hover:border-primary transition-all cursor-pointer">
                                <div className="aspect-video w-full rounded-lg bg-surface-container-high mb-3 overflow-hidden shadow-inner flex items-center justify-center">
                                    <span className="material-symbols-outlined text-4xl opacity-20 group-hover:scale-110 transition-transform">analytics</span>
                                </div>
                                <div className="flex items-center justify-between px-1">
                                    <div className="overflow-hidden">
                                        <p className="text-xs font-bold text-on-surface truncate">METRIC_AUDIT_{log.id}.JPG</p>
                                        <p className="text-[10px] text-on-surface-variant font-bold uppercase tabular-nums">2.4 MB • Image/JPEG</p>
                                    </div>
                                    <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">download</span>
                                </div>
                            </div>
                            <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant/20 flex items-center gap-4 hover:bg-surface-container-low transition-colors group cursor-pointer border-l-4 border-outline-variant/10">
                                <div className="w-10 h-10 bg-surface-container flex items-center justify-center rounded-lg shadow-inner">
                                    <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">description</span>
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <p className="text-xs font-bold text-on-surface truncate uppercase">LOG_DUMP_{log.id}.JSON</p>
                                    <p className="text-[10px] text-on-surface-variant font-bold tabular-nums uppercase">142 KB • Data File</p>
                                </div>
                                <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">file_download</span>
                            </div>
                        </div>
                    </div>

                    {/* Internal Notes Actions */}
                    <div className="bg-primary-container p-8 rounded-xl shadow-2xl space-y-6 relative overflow-hidden border border-white/5">
                        <div className="flex items-center gap-3 text-white relative z-10">
                            <span className="material-symbols-outlined text-xl opacity-60">edit_note</span>
                            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em]">Administrative Response</h3>
                        </div>
                        <textarea className="w-full bg-slate-800/80 border border-white/5 rounded-xl text-white text-xs p-4 placeholder:text-slate-500 focus:ring-1 focus:ring-on-primary-container min-h-[120px] relative z-10 shadow-inner outline-none font-body" placeholder="Add a secure internal note..."></textarea>
                        <button className="w-full py-4 bg-primary text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-lg hover:opacity-90 transition-all font-manrope cursor-pointer relative z-10 shadow-lg active:scale-[0.98]">Add Note</button>
                        <div className="absolute top-[-40px] right-[-40px] opacity-[0.05] pointer-events-none">
                            <span className="material-symbols-outlined text-[180px]">security</span>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}