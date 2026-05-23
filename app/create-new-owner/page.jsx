'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { createOwner } from '@/lib/actions';
import { useRouter } from 'next/navigation';
import { getEstates } from '@/lib/services';
import { formatDate } from '@/lib/utils';

const CreateNewOwnerPage = () => {
  const [ownerType, setOwnerType] = useState('Individual');

  // Identity fields
  const [fullName, setFullName] = useState('');
  const [registrationDate, setRegistrationDate] = useState('');
  const [nationality, setNationality] = useState('United Kingdom');

  // Contact fields
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [estatesList, setEstatesList] = useState([]);
  const [selectedEstates, setSelectedEstates] = useState([]);
  const [estateSearchQuery, setEstateSearchQuery] = useState('');
  const router = useRouter();

useEffect(() => {
  const fetchEstates = async () => {
    const data = await getEstates();
    setEstatesList(data);
  };
  fetchEstates();
}, []);

const toggleEstateSelection = (estateId) => {
  setSelectedEstates(prev => 
    prev.includes(estateId) 
      ? prev.filter(id => id !== estateId) 
      : [...prev, estateId]
  );
};
  const generateOwnerId = () => {
    const num = Math.floor(1000 + Math.random() * 9000);
    return `OWN-${num}`;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setLoading(true);
    setError('');

    if (!fullName.trim()) {
      setError('Full Legal Name is required.');
      setLoading(false);
      return;
    }

    const data = {
      id: generateOwnerId(),
      img: "default" ,
      name: fullName,
      type: ownerType,
      desc: `${ownerType} • ${nationality}`,
      date: formatDate(registrationDate),
      nationality,
      email,
      phone,
      address,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      asset: 0,
      status: 'Active',
    };

    try {
      const minDelay = new Promise((resolve) => setTimeout(resolve, 3000));
      const [result] = await Promise.all([createOwner(data), minDelay]);
      console.log('Owner created:', result);
      setSuccess(true);
    } catch (err) {
      setError('Failed to register owner. Please try again.');
    } finally {
      setLoading(false);
      router.push('/dashboard/estate-owners')
    }
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen flex font-body">

      {/* Sidebar */}
      <aside className="h-screen w-64 fixed left-0 top-0 overflow-y-auto bg-slate-900 flex flex-col p-6 z-50">
        <div className="mb-10 px-2">
          <Link href="/dashboard" className="text-xl font-black text-white tracking-tighter hover:opacity-80 transition-opacity">
            Estate Director
          </Link>
          <div className="mt-1 text-[10px] uppercase tracking-widest text-slate-500 font-bold">Super Admin</div>
        </div>
        <nav className="flex-1 space-y-1">
          {[
            { label: 'Dashboard', href: '/dashboard', icon: 'dashboard' },
            { label: 'Estates', href: '/dashboard/estates', icon: 'domain' },
            { label: 'Owners', href: '/dashboard/estate-owners', icon: 'person', active: true },
            { label: 'Payments', href: '/dashboard/payments', icon: 'payments' },
            { label: 'Activities', href: '/dashboard/activities', icon: 'history' },
            { label: 'Settings', href: '/dashboard/settings', icon: 'settings_applications' },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm font-semibold font-manrope ${
                link.active
                  ? 'bg-blue-600/10 text-blue-400 border-l-4 border-blue-500'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span className="material-symbols-outlined text-sm">{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto pt-4 border-t border-slate-800/50 space-y-1">
          <a href="#" className="flex items-center gap-3 px-4 py-2 text-slate-400 hover:text-white text-xs font-medium transition-colors">
            <span className="material-symbols-outlined text-sm">help_outline</span> Support
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-2 text-red-400 hover:opacity-80 text-xs font-medium">
            <span className="material-symbols-outlined text-sm">logout</span> Logout
          </a>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 ml-64 min-h-screen">

        {/* Top Bar */}
        <header className="w-full sticky top-0 z-40 bg-white/80 backdrop-blur-xl flex justify-between items-center px-8 py-4 border-b border-slate-200/50">
          <div className="flex items-center gap-6">
            <h1 className="text-lg font-bold tracking-tighter text-slate-900 font-headline">The Estate Director</h1>
            <div className="h-4 w-px bg-slate-300" />
            <nav className="flex gap-4">
              <Link href="/dashboard/estates" className="text-slate-500 font-manrope text-sm font-medium tracking-tight hover:text-blue-500 transition-colors">Portfolio</Link>
              <Link href="/dashboard/estate-owners" className="text-blue-600 font-bold border-b-2 border-blue-600 font-manrope text-sm tracking-tight">Owners</Link>
              <Link href="/dashboard" className="text-slate-500 font-manrope text-sm font-medium tracking-tight hover:text-blue-500 transition-colors">Reports</Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <button type="button" className="p-2 text-slate-500 hover:bg-slate-200/50 rounded-full transition-all">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button type="button" className="p-2 text-slate-500 hover:bg-slate-200/50 rounded-full transition-all">
              <span className="material-symbols-outlined">settings</span>
            </button>
            <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-200">
              <img alt="Admin" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDRrpc2qUEsJSe9TuGgPIuwPLn4T16DSiRrzwK6rnF0rzWx32fLzYATkpqugEdHum5MeDSveND7FT_SVm3tIxmcSIwtMiNQsJrj7mwbS2gcUlxo6yUvaOmGTRJ9fARgD7owb2WIOaSqVTyiBy4vex_um0L_yHT06k5gCoOHP-A4nraOk-J6DVmoJQEeVBMo4BsQtmCiv8UyCh5jtLYJQWk3sngbVSPw1o0YE15mTixqm_eq4m1ChaOnsacMie2Ns8I87qbBotiqwNje" />
            </div>
          </div>
        </header>

        <div className="p-10 max-w-6xl mx-auto">

          {/* Breadcrumb & Header */}
          <div className="mb-10">
            <div className="flex items-center gap-2 text-on-surface-variant text-sm mb-4 font-body">
              <Link href="/dashboard/estate-owners" className="hover:text-primary transition-colors">Owners</Link>
              <span className="material-symbols-outlined text-xs">chevron_right</span>
              <span className="text-primary font-semibold">Add Owner</span>
            </div>
            <h2 className="text-4xl font-extrabold tracking-tight text-on-surface font-headline">Onboard New Entity</h2>
            <p className="text-on-surface-variant mt-2 font-body">Initialize a new legal relationship within the estate ecosystem.</p>
          </div>

          {/* Error banner */}
          {error && (
            <div className="mb-6 p-4 bg-error-container text-on-error-container rounded-lg text-sm font-bold font-manrope">
              {error}
            </div>
          )}

          {/* Success banner */}
          {success && (
            <div className="mb-6 p-4 bg-tertiary-container text-on-tertiary-container rounded-lg text-sm font-bold font-manrope flex items-center gap-3">
              <span className="material-symbols-outlined">check_circle</span>
              Owner registered successfully!{' '}
              <Link href="/dashboard/estate-owners" className="underline ml-1">View all owners →</Link>
            </div>
          )}

          {/* Form Grid */}
          <div className="grid grid-cols-12 gap-10">

            {/* Left Column */}
            <div className="col-span-12 lg:col-span-8 space-y-10">

              {/* Owner Classification */}
              <section className="bg-surface-container-low p-8 rounded-xl">
                <h3 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-6 font-manrope">Owner Classification</h3>
                <div className="inline-flex p-1 bg-surface-container-high rounded-lg">
                  {['Individual', 'Corporate'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setOwnerType(type)}
                      className={`px-8 py-2.5 rounded-md text-sm font-bold transition-all font-manrope ${
                        ownerType === type
                          ? 'bg-surface-container-lowest shadow-sm text-primary'
                          : 'text-on-surface-variant hover:bg-surface-container-highest font-medium'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </section>

              {/* Identity Matrix */}
              <section className="bg-surface-container-low p-8 rounded-xl">
                <h3 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-6 font-manrope">Identity Matrix</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-on-surface-variant mb-2 ml-1 font-manrope">Full Legal Name</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-surface-container-high border-none rounded-md px-4 py-3 focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary transition-all font-body outline-none"
                      placeholder="e.g. Alexander Sterling"
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-xs font-bold text-on-surface-variant mb-2 ml-1 font-manrope">Registration Date</label>
                    <input
                      type="date"
                      value={registrationDate}
                      onChange={(e) => setRegistrationDate(e.target.value)}
                      className="w-full bg-surface-container-high border-none rounded-md px-4 py-3 focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary transition-all font-body outline-none"
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-xs font-bold text-on-surface-variant mb-2 ml-1 font-manrope">Nationality / Jurisdiction</label>
                    <select
                      value={nationality}
                      onChange={(e) => setNationality(e.target.value)}
                      className="w-full bg-surface-container-high border-none rounded-md px-4 py-3 focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary transition-all font-body outline-none appearance-none cursor-pointer"
                    >
                      {['United Kingdom', 'United States', 'Nigeria', 'Singapore', 'Switzerland', 'France', 'Germany', 'UAE'].map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-on-surface-variant mb-2 ml-1 font-manrope">Entity Bio / Professional Background</label>
                    <textarea
                      rows={2}
                      className="w-full bg-surface-container-high border-none rounded-md px-4 py-3 focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary transition-all font-body outline-none resize-none"
                      placeholder="Enter brief professional history or entity overview..."
                    />
                  </div>
                </div>
              </section>

              {/* Contact Reach */}
              <section className="bg-surface-container-low p-8 rounded-xl">
                <h3 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-6 font-manrope">Contact Reach</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="col-span-1">
                    <label className="block text-xs font-bold text-on-surface-variant mb-2 ml-1 font-manrope">Primary Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-surface-container-high border-none rounded-md px-4 py-3 focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary transition-all font-body outline-none"
                      placeholder="owner@domain.com"
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-xs font-bold text-on-surface-variant mb-2 ml-1 font-manrope">Phone Number</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-surface-container-high border-none rounded-md px-4 py-3 focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary transition-all font-body outline-none"
                      placeholder="+44 20 7946 0000"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-on-surface-variant mb-2 ml-1 font-manrope">Primary Residence Address</label>
                    <textarea
                      rows={3}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full bg-surface-container-high border-none rounded-md px-4 py-3 focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary transition-all font-body outline-none resize-none"
                      placeholder="Street, City, Postcode, Country"
                    />
                  </div>
                </div>
              </section>
            </div>

            {/* Right Column */}
            <div className="col-span-12 lg:col-span-4 space-y-10">

              {/* Portfolio Assignment */}
              <section className="bg-surface-container-low p-8 rounded-xl">
                <div className="relative mb-6">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">search</span>
                  <input 
                    type="text" 
                    value={estateSearchQuery}
                    onChange={(e) => setEstateSearchQuery(e.target.value)}
                    className="w-full bg-surface-container-high border-none rounded-md pl-10 pr-4 py-2.5 text-xs font-semibold focus:bg-surface-container-lowest transition-all font-body outline-none"
                    placeholder="Search estates by name..."
                  />
                </div>
                <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                  {estatesList
                    .filter(e => e.name.toLowerCase().includes(estateSearchQuery.toLowerCase()))
                    .map((estate) => (
                    <div 
                      key={estate.id} 
                      onClick={() => toggleEstateSelection(estate.id)}
                      className={`flex items-center gap-3 p-3 rounded-lg group transition-all cursor-pointer ${
                        selectedEstates.includes(estate.id)
                          ? 'bg-primary-gradient text-white shadow-lg'
                          : 'bg-surface-container-lowest hover:bg-surface-container-high'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded flex items-center justify-center ${
                        selectedEstates.includes(estate.id) ? 'bg-slate-700/50' : 'bg-secondary-container'
                      }`}>
                        <span className={`material-symbols-outlined ${
                          selectedEstates.includes(estate.id) ? 'text-white' : 'text-primary-container'
                        }`}>domain</span>
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-bold">{estate.name}</div>
                        <div className={`text-[10px] font-manrope ${
                          selectedEstates.includes(estate.id) ? 'text-white/60' : 'text-on-surface-variant'
                        }`}>{estate.address || 'Unknown Location'}</div>
                      </div>
                      <span className={`material-symbols-outlined ${
                        selectedEstates.includes(estate.id) ? 'text-white' : 'text-on-tertiary-container'
                      }`}>
                        {selectedEstates.includes(estate.id) ? 'check_circle' : 'add_circle'}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Verification Vault */}
              <section className="bg-surface-container-low p-8 rounded-xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant font-manrope">Verification Vault</h3>
                  <span className="material-symbols-outlined text-blue-600 text-sm">verified_user</span>
                </div>
                <div className="space-y-4">
                  <label className="border-2 border-dashed border-outline-variant rounded-xl p-6 flex flex-col items-center justify-center text-center hover:border-blue-500 transition-colors cursor-pointer">
                    <span className="material-symbols-outlined text-3xl text-outline mb-2">fingerprint</span>
                    <div className="text-xs font-bold text-primary uppercase mb-1 font-manrope">Upload ID or Passport</div>
                    <div className="text-[10px] text-on-surface-variant">PDF, JPEG or PNG (Max 10MB)</div>
                    <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" />
                  </label>
                  <label className="border-2 border-dashed border-outline-variant rounded-xl p-6 flex flex-col items-center justify-center text-center hover:border-blue-500 transition-colors cursor-pointer">
                    <span className="material-symbols-outlined text-3xl text-outline mb-2">article</span>
                    <div className="text-xs font-bold text-primary uppercase mb-1 font-manrope">Proof of Address</div>
                    <div className="text-[10px] text-on-surface-variant">Utility bill or bank statement</div>
                    <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" />
                  </label>
                </div>
              </section>

              {/* Live Preview Card */}
              <section className="bg-primary-container rounded-xl p-6 text-white relative overflow-hidden">
                <div className="relative z-10 space-y-3">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/60 font-manrope">Entity Preview</p>
                  <h4 className="text-xl font-black font-headline">{fullName || 'Full Name'}</h4>
                  <p className="text-xs text-white/70 font-body">{ownerType} • {nationality}</p>
                  {email && <p className="text-xs text-white/70 font-body">{email}</p>}
                </div>
                <div className="absolute -right-6 -bottom-6 opacity-10">
                  <span className="material-symbols-outlined text-[120px]">person</span>
                </div>
              </section>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="mt-12 pt-8 border-t border-surface-container flex justify-end items-center gap-6">
            <Link href="/dashboard/estate-owners" className="text-on-surface-variant hover:text-primary font-bold text-xs uppercase tracking-widest px-6 py-3 transition-colors font-manrope">
              Cancel
            </Link>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="bg-linear-to-br from-primary-container to-slate-800 text-white font-bold text-xs uppercase tracking-[0.05em] px-10 py-4 rounded-md shadow-xl hover:opacity-90 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed font-manrope"
            >
              {loading ? 'Processing...' : 'Execute Registration'}
            </button>
          </div>
        </div>

        <div className="h-20" />
      </main>

      {/* Loading Modal */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-surface rounded-2xl shadow-2xl p-10 flex flex-col items-center gap-6 max-w-sm w-full mx-4 border border-outline-variant/20">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-4 border-surface-container-high" />
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-black font-headline text-on-surface">Registering Entity</h3>
              <p className="text-sm text-on-surface-variant font-body">Recording owner to the permanent ledger. Please wait...</p>
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

export default CreateNewOwnerPage;
