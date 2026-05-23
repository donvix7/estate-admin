import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="bg-surface font-body text-on-surface selection:bg-primary-fixed-dim min-h-screen">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-outline-variant/10">
        <nav className="flex justify-between items-center h-20 px-8 max-w-[1440px] mx-auto">
          <div className="text-xl font-bold tracking-tighter text-slate-900 dark:text-slate-50 font-headline">
            The Estate Director
          </div>
          <div className="hidden md:flex items-center gap-10 font-manrope font-semibold tracking-tight">
            <Link className="text-slate-900 dark:text-slate-50 border-b-2 border-slate-900 dark:border-slate-50 pb-1 cursor-pointer active:opacity-70" href="#">Portfolio</Link>
            <Link className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-200 cursor-pointer active:opacity-70" href="#">Services</Link>
            <Link className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-200 cursor-pointer active:opacity-70" href="#">Advisory</Link>
            <Link className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-200 cursor-pointer active:opacity-70" href="#">Insights</Link>
          </div>
          <div className="flex items-center gap-4">
            <Link 
              href="/login" 
              className="px-6 py-2 rounded-md font-label font-semibold text-sm tracking-wider uppercase text-on-surface hover:bg-surface-container-high transition-all"
            >
              Login
            </Link>
            <button className="primary-gradient px-6 py-2.5 rounded-md font-label font-semibold text-sm tracking-widest uppercase text-white hover:opacity-90 transition-all cursor-pointer">
              Get Started
            </button>
          </div>
        </nav>
      </header>

      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative min-h-[921px] flex items-center px-8 overflow-hidden bg-surface">
          <div className="max-w-[1440px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 z-10">
              <h1 className="font-headline text-6xl lg:text-8xl font-extrabold tracking-tighter leading-[0.9] text-primary mb-8">
                The Architectural <br /><span className="text-on-primary-container">Monolith.</span>
              </h1>
              <p className="text-xl text-on-surface-variant max-w-xl mb-10 leading-relaxed font-light">
                Command your global portfolio through a singular, authoritative interface designed for the next generation of super admins. Precision management meets effortless scale.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link 
                  href="/login" 
                  className="primary-gradient px-10 py-5 rounded-md text-white font-label font-bold text-sm tracking-widest uppercase hover:opacity-95 transition-all text-center flex items-center justify-center"
                >
                  Begin Command
                </Link>
                <button className="px-10 py-5 bg-surface-container-low hover:bg-surface-container-high rounded-md text-primary font-label font-bold text-sm tracking-widest uppercase transition-colors cursor-pointer">
                  View Portfolio
                </button>
              </div>
              <div className="mt-16 flex gap-12 items-center">
                <div>
                  <p className="font-headline text-3xl font-bold text-primary">1,240+</p>
                  <p className="text-xs font-label uppercase tracking-widest text-on-primary-container">Active Units</p>
                </div>
                <div>
                  <p className="font-headline text-3xl font-bold text-primary">24/7</p>
                  <p className="text-xs font-label uppercase tracking-widest text-on-primary-container">Real-time Audit</p>
                </div>
              </div>
            </div>
            <div className="lg:col-span-6 relative h-[600px] lg:h-[800px]">
              <div className="absolute inset-0 bg-surface-container-low rounded-xl overflow-hidden shadow-2xl rotate-3 translate-x-12 translate-y-12 transition-transform hover:rotate-0 duration-700">
                <img 
                  alt="Modern Luxury Estate" 
                  className="w-full h-full object-cover grayscale-20 hover:grayscale-0 transition-all duration-1000" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAyiOGmKqlS3E5evOy2T3WtoGKG5zULPg9tMf4Kg9JQ-E7EsrL90v4Gygwzm3OE7HnDBcL-uj5OZo6nv-xZKSWoQhNMZvboNvdEFfzxhfgbtokaPeD0pmJsb8LH5EyoneVCvUTHMBP4QtL9gASSHZ5kf6s0Q4Zze7BR6-0ApK61TjHwk_Z2UJCzpTm6YMXXfVe5-RZ0E1_gR20Zv2CdvY65UsSGRYX6Bd-Zie86OX_235HgBPKrL52KKNZeivpqmOH9qLNbCC-RXftU" 
                />
              </div>
              <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 bg-surface-container-lowest p-8 whisper-shadow rounded-lg z-20 max-w-[280px]">
                <span className="material-symbols-outlined text-on-tertiary-container mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>security</span>
                <h3 className="font-headline text-lg font-bold mb-2">Immutable Auditing</h3>
                <p className="text-sm text-on-surface-variant leading-snug">Every transaction and asset movement is captured on an immutable architectural ledger.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Portfolio Control - Bento Grid */}
        <section className="py-24 px-8 bg-surface-container-low">
          <div className="max-w-[1440px] mx-auto">
            <div className="mb-16">
              <h2 className="font-headline text-4xl font-bold text-primary tracking-tight mb-4">Portfolio Control</h2>
              <p className="text-on-surface-variant max-w-2xl">Total visibility over every asset, across every border, in a single pane of truth.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 grid-rows-none md:grid-rows-2 gap-6 h-auto md:h-[600px]">
              {/* Large Feature */}
              <div className="md:col-span-4 lg:col-span-3 bg-surface-container-lowest p-10 rounded-xl whisper-shadow flex flex-col justify-between">
                <div>
                  <span className="px-3 py-1 bg-secondary-container text-on-secondary-container text-[10px] font-bold tracking-[0.2em] uppercase rounded-full">Primary Node</span>
                  <h3 className="font-headline text-3xl font-extrabold mt-6 mb-4">Unified Asset Ledger</h3>
                  <p className="text-on-surface-variant leading-relaxed mb-8">Consolidate commercial, residential, and industrial assets into a streamlined operational matrix updated every sixty seconds.</p>
                </div>
                <div className="bg-surface p-4 rounded-lg flex items-center justify-between ghost-border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                      <span className="material-symbols-outlined text-white text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>monitoring</span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-primary">Live Performance</p>
                      <p className="text-[10px] text-on-tertiary-container uppercase tracking-widest">+12.4% ARR</p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-outline">chevron_right</span>
                </div>
              </div>
              {/* Medium Feature */}
              <div className="md:col-span-2 lg:col-span-3 bg-primary-container text-white p-10 rounded-xl overflow-hidden relative group">
                <div className="relative z-10 h-full flex flex-col justify-between">
                  <h3 className="font-headline text-3xl font-extrabold mb-4 text-white">Real-time <br />Auditing</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 opacity-60">
                      <span className="material-symbols-outlined">check_circle</span>
                      <span className="text-sm font-label">KYC/AML Verified</span>
                    </div>
                    <div className="flex items-center gap-4 opacity-60">
                      <span className="material-symbols-outlined">check_circle</span>
                      <span className="text-sm font-label">Occupancy Projections</span>
                    </div>
                  </div>
                </div>
                <div className="absolute right-0 bottom-0 translate-x-1/4 translate-y-1/4 w-64 h-64 bg-primary rounded-full blur-3xl opacity-50 transition-transform group-hover:scale-110"></div>
              </div>
              {/* Small Tiles */}
              <div className="lg:col-span-2 bg-surface-container-lowest p-8 rounded-xl ghost-border hover:bg-surface-bright transition-colors cursor-pointer group">
                <span className="material-symbols-outlined text-primary mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>public</span>
                <h4 className="font-headline text-xl font-bold mb-2">Global Jurisdictions</h4>
                <p className="text-sm text-on-surface-variant">Tax compliance across 40+ countries automatically managed by AI-led legal nodes.</p>
              </div>
              <div className="lg:col-span-2 bg-surface-container-lowest p-8 rounded-xl ghost-border hover:bg-surface-bright transition-colors cursor-pointer group">
                <span className="material-symbols-outlined text-primary mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>android_fingerprint</span>
                <h4 className="font-headline text-xl font-bold mb-2">Vault-Grade Security</h4>
                <p className="text-sm text-on-surface-variant">Multi-signature authorization for every capital call and major maintenance event.</p>
              </div>
              <div className="lg:col-span-2 bg-surface-container-lowest p-8 rounded-xl ghost-border hover:bg-surface-bright transition-colors cursor-pointer group">
                <span className="material-symbols-outlined text-primary mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>account_tree</span>
                <h4 className="font-headline text-xl font-bold mb-2">Scalable Hierarchy</h4>
                <p className="text-sm text-on-surface-variant">Assign granular permissions to family offices, trustees, and management teams.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Global Scalability Section */}
        <section className="py-24 px-8 bg-surface">
          <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="relative order-2 lg:order-1">
              <img 
                alt="Architectural Skyscraper" 
                className="w-full h-[600px] object-cover rounded-xl grayscale-50" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDS0vonw-i8B4jSynXHRknVIMuUIvYiVAp3E0GIoSRDvf-bL80eGtinoHo1GQr3y2ol3VEH4jdHHmGsNg3blZtZG1KA8hdMWDo-MuU9AESGRt7F9EVzsxwWGfsNPXJTjz4Km322kRfhtLC1R2xgxI1K2oAZcMi1r9eYsI-5haVS1UfVXVT1uK0iBhdu0KdzDU7aQksz0LWw4WAeFSDgX8sjT4BsfId7aapHIBugab6BMqkknGpyvXvYQUN4suIx8cdBs4Pa0Zz9ehmY" 
              />
              <div className="absolute -bottom-10 -right-10 bg-surface-container-lowest p-10 whisper-shadow rounded-xl max-w-sm hidden md:block">
                <p className="font-headline text-lg font-bold italic">"The level of insight provided by Estate Director changed how our family office views risk across the entire portfolio."</p>
                <p className="mt-4 text-sm font-label uppercase tracking-widest font-bold text-on-primary-container">— Chief Investment Officer</p>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <span className="text-xs font-label font-bold uppercase tracking-[0.3em] text-on-tertiary-container block mb-4">Global Reach</span>
              <h2 className="font-headline text-5xl font-extrabold text-primary mb-8 leading-tight">Scale Without <br />Friction.</h2>
              <div className="space-y-12">
                <div className="flex gap-6">
                  <div className="w-12 h-12 shrink-0 bg-secondary-container rounded-md flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>hub</span>
                  </div>
                  <div>
                    <h4 className="font-headline text-xl font-bold mb-2">Centralized Command</h4>
                    <p className="text-on-surface-variant leading-relaxed">Manage properties from Tokyo to New York within a unified visual framework. Language and currency barriers are eliminated through automated translation and conversion.</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="w-12 h-12 shrink-0 bg-secondary-container rounded-md flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>architecture</span>
                  </div>
                  <div>
                    <h4 className="font-headline text-xl font-bold mb-2">Architectural Blueprinting</h4>
                    <p className="text-on-surface-variant leading-relaxed">Detailed BIM integration allows you to view the structural integrity of your assets in 3D, predicting maintenance before it occurs.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 px-8 bg-primary-container text-white text-center relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-10 pointer-events-none">
            <div className="grid grid-cols-11 h-full w-full">
              {[...Array(11)].map((_, i) => (
                <div key={i} className="border-r border-white/20"></div>
              ))}
            </div>
          </div>
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="font-headline text-5xl font-extrabold mb-8 text-white text-center">Ready to centralize your empire?</h2>
            <p className="text-xl text-on-primary-container mb-12 font-light text-center">Join the world's most sophisticated estates in moving to a higher standard of management.</p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <button className="bg-white text-primary px-12 py-5 rounded-md font-label font-bold text-sm tracking-widest uppercase hover:bg-surface-container-high transition-colors cursor-pointer w-full sm:w-auto">
                Request Access
              </button>
              <button className="ghost-border border border-white/30 text-white px-12 py-5 rounded-md font-label font-bold text-sm tracking-widest uppercase hover:bg-white/10 transition-colors cursor-pointer w-full sm:w-auto">
                Book Demo
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-50 dark:bg-slate-950 w-full py-12 px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 max-w-[1440px] mx-auto">
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="font-manrope font-bold text-slate-900 dark:text-slate-50 text-xl mb-2">The Estate Director</div>
            <p className="font-inter text-sm tracking-normal text-slate-600 dark:text-slate-400">© 2024 The Estate Director. All rights reserved.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-8 font-inter text-sm tracking-normal text-slate-600 dark:text-slate-400">
            <Link className="hover:underline transition-all text-slate-500 dark:text-slate-400 cursor-pointer" href="#">Privacy Policy</Link>
            <Link className="hover:underline transition-all text-slate-500 dark:text-slate-400 cursor-pointer" href="#">Terms of Service</Link>
            <Link className="hover:underline transition-all text-slate-500 dark:text-slate-400 cursor-pointer" href="#">Contact</Link>
            <Link className="hover:underline transition-all text-slate-500 dark:text-slate-400 cursor-pointer" href="#">Global Offices</Link>
          </div>
          <div className="flex gap-4">
            <span className="material-symbols-outlined text-slate-400 hover:text-slate-900 cursor-pointer transition-colors">language</span>
            <span className="material-symbols-outlined text-slate-400 hover:text-slate-900 cursor-pointer transition-colors">share</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
