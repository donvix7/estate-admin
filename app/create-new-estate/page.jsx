'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { createEstate } from '@/lib/actions';
import { useRouter } from 'next/navigation';
import { getOwners } from '@/lib/services';

const EstateCreationWizard = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [estateData, setEstateData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [billingFrequency, setBillingFrequency] = useState('annually');
  const [estateType, setEstateType ] = useState('Residential High-Rise');
  const [address, setAddress] = useState('');
  const [estateName, setEstateName] = useState('');
  const [subscriptionPlan, setSubscriptionPlan] = useState('Basic Plan');
  const [owner, setowner] = useState('');
  const [officialEmail, setOfficialEmail] = useState('');
  const [totalUnits, setTotalUnits] = useState('');
  const [squareFootage, setSquareFootage] = useState('');
  const [amenityTier, setAmenityTier] = useState('');
  const [image, setImage] = useState("https://lh3.googleusercontent.com/aida-public/AB6AXuAlKxzv_hBMikN-CEXjGGSSfszG5NW05tGq8F9w90MjjYuViW0KWbkL_foGDf9wLWLmhccqDNDEo2ruuyar1a_P4YvBvsW1Uq_zBLjmZ3FE9bDI4eUEIjKzm9Mteo4XCgzx6g08HvSSKsqLze4gGNiT8iLJq6bXOiOPcwFAdSrsWMyRLpJ1bRbu3b8eng-4e77UIIvaBUT95nClVe4L859JdPGIBMJrpKGSPt5jFKbvwF-mGZiLtGWJKgYrzchB3zJTENWVDM-MU8UK" );
  const [imageUrl, setImageUrl] = useState('');
  const [estatePayDate, setEstatePayDate] = useState("Apr 01, 2026");
  const [category, setCategory] = useState('');
  const [region, setRegion] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [ownersList, setOwnersList] = useState([]);
  const router = useRouter();

useEffect(() => {
  const fetchOwners = async () => {
    const data = await getOwners();
    setOwnersList(data);
  };
  fetchOwners();
}, []);

const handleOwnerChange = (e) => {
  const selectedName = e.target.value;
  setowner(selectedName);
  const selectedOwner = ownersList.find(o => o.name === selectedName);
  if (selectedOwner) {
    setOfficialEmail(selectedOwner.email || '');
  } else {
    setOfficialEmail('');
  }
};
  const steps = [
    { id: 1, label: 'Identity' },

    { id: 2, label: 'Units' },
    { id: 3, label: 'Assets' },
    { id: 4, label: 'Review' },
  ];

 
  const handleSubmit = async (e) => {
    e?.preventDefault();
    setLoading(true);
    setError('');
  

    const data = {
      name: estateName,
      location: address,
      description: `${estateType} at ${address}`,
      classification: estateType.includes('Residential') ? 'Residential' : 
                     estateType.includes('Commercial') ? 'Commercial' :
                     estateType.includes('Industrial') ? 'Industrial' :
                     estateType.includes('Mixed-Use') ? 'Mixed-Use' : 'Residential',
      subscription: subscriptionPlan,
      manager: owner,
      units: parseInt(totalUnits) || 0,
      sqft: parseInt(squareFootage.replace(/[^0-9]/g, '')) || 0,
      tier: amenityTier || 'Standard',
      image: image
    };
    console.log(data)
    try {
      const result = await createEstate(data);
      console.log('Estate created:', result);
    } catch (err) {
      setError('Failed to create estate. Please try again.');
    } finally {
      setLoading(false);
      router.push("/dashboard/estates")
    }
  }

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  return (
    <div className="flex bg-white dark:bg-slate-900 font-body selection:bg-slate-200 dark:selection:bg-slate-800 min-h-screen">
    

      {/* Main Container Wrapper */}
      <div className="flex-1 flex flex-col">
        {/* TopAppBar (Wizard Stepper) */}
        <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-8 h-20 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-900 dark:text-white">
              <span className="material-symbols-outlined text-xl">arrow_back</span>
            </Link>
            <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight font-headline">Estate Wizard</h1>
          </div>
          
          <nav className="hidden md:flex gap-8 h-full items-center">
            {steps.map((step) => (
              <div 
                key={step.id}
                className={`flex flex-col items-center justify-center h-full transition-all border-b-2 ${
                  currentStep === step.id 
                    ? 'text-slate-900 dark:text-white border-primary dark:border-blue-500 font-bold' 
                    : 'text-slate-400 dark:text-slate-500 border-transparent font-medium'
                } text-[10px] uppercase tracking-widest cursor-default px-2`}
              >
                <span>Step {step.id}: {step.label}</span>
              </div>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <button className="px-4 py-2 text-[10px] font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors uppercase tracking-widest cursor-pointer font-manrope">Save Draft</button>
            <button 
              onClick={nextStep}
              disabled={currentStep === 4}
              className="px-6 py-2.5 bg-slate-900 dark:bg-slate-800 text-white text-[10px] font-bold uppercase tracking-widest rounded-md shadow-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-manrope border border-slate-800 dark:border-slate-700"
            >
              {currentStep === 4 ? 'Authorizing...' : `Continue to ${steps[currentStep]?.label || 'Review'}`}
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="p-10 w-full flex-1 max-w-5xl mx-auto">
          {/* Step Progress Bar */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-2 font-manrope text-on-surface">
              <span className="text-[10px] font-bold tracking-widest text-on-secondary-container uppercase bg-secondary-container px-2 py-1 rounded">Step 0{currentStep} of 04</span>
              <div className="text-right">
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Portfolio Completion</p>
                <div className="w-48 h-1.5 bg-surface-container rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary-gradient transition-all duration-500 ease-in-out" 
                    style={{ width: `${(currentStep / 4) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <form>
            {/* Step Content */}
          <div className="max-w-5xl">
            {/* Step 1: Identity */}
            {currentStep === 1 && (
              <div className="grid grid-cols-12 gap-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="col-span-12 lg:col-span-8 space-y-8">
                  <div className="flex flex-col gap-2 mb-4">
                    <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white font-headline">Estate Identity</h2>
                    <p className="text-slate-500 dark:text-slate-400 font-medium text-lg max-w-2xl font-body">Establish the primary identifiers and physical footprint for your new holding.</p>
                  </div>

                  <div className="bg-white dark:bg-slate-900 p-8 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 text-slate-900 dark:text-white space-y-8">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="col-span-2 md:col-span-1 space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 font-manrope">Estate Name</label>
                        <input 
                        value={estateName}
                        onChange={(e) => {setEstateName(e.target.value)}}
                        className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-md px-4 py-3 focus:ring-1 focus:ring-primary focus:bg-white dark:focus:bg-slate-950 transition-all placeholder:text-slate-400/50 font-medium font-body outline-none" placeholder="e.g. Skyline Towers Phase I" type="text" />
                      </div>
                      <div className="col-span-2 md:col-span-1 space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 font-manrope">Primary Classification</label>
                        <select 
                        value={estateType}
                        onChange={(e) => {setEstateType(e.target.value)}}
                        className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-md px-4 py-3 focus:ring-1 focus:ring-primary focus:bg-white dark:focus:bg-slate-950 transition-all font-medium font-body outline-none appearance-none cursor-pointer">
                          {['Residential High-Rise', 'Mixed-Use Development', 'Commercial Plaza', 'Industrial Complex'].map((estateType) => (
                            <option key={estateType} value={estateType} className="bg-white dark:bg-slate-900">{estateType}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant font-manrope">Physical Address</label>
                      <textarea 
                        className="w-full bg-surface-container-high border-none rounded-md px-4 py-3 focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest transition-all placeholder:text-outline/50 font-medium font-body outline-none resize-none" 
                        placeholder="Enter full street address, city, and state..." 
                        rows={3}
                        value={address}
                        onChange={(e) => {setAddress(e.target.value)}}
                      ></textarea>
                    </div>

                    <div className="grid grid-cols-2 gap-6 pt-4 border-t border-outline-variant/5">
                      <div className="col-span-2 md:col-span-1 space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant font-manrope">Initial Subscription Plan</label>
                        <select 
                        value={subscriptionPlan}
                        onChange={(e) => {setSubscriptionPlan(e.target.value)}}
                        className="w-full bg-surface-container-high border-none rounded-md px-4 py-3 focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest transition-all font-medium font-body outline-none appearance-none cursor-pointer">
                          {["Basic", "Professional", "Enterprise"].map((plan) => (
                            <option key={plan} value={plan}>{plan}</option>
                          ))}
                        </select>
                      </div>
                      <div className="col-span-2 md:col-span-1 space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant font-manrope">Billing Frequency</label>
                        <select 
                        value={billingFrequency}
                        onChange={(e) => {setBillingFrequency(e.target.value)}}
                        className="w-full bg-surface-container-high border-none rounded-md px-4 py-3 focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest transition-all font-medium font-body outline-none appearance-none cursor-pointer">
                          {["Annual (10% Discount)", "Monthly", "Quarterly"].map((frequency) => (
                            <option key={frequency} value={frequency}>{frequency}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                 
                </div>

                <div className="col-span-12 lg:col-span-4 space-y-8">
                  <div className="bg-white dark:bg-slate-900 p-8 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 text-slate-900 dark:text-white space-y-6">
                    <h3 className="text-xl font-bold font-headline text-slate-900 dark:text-white">Contact Details</h3>
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 font-manrope">Manager Name</label>
                        <select
                          value={owner}
                          onChange={handleOwnerChange}
                          className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-md px-4 py-3 focus:ring-1 focus:ring-primary focus:bg-white dark:focus:bg-slate-950 transition-all text-sm font-body outline-none appearance-none cursor-pointer"
                        >
                          <option value="" className="bg-white dark:bg-slate-900">Select an owner</option>
                          {ownersList.map((o) => (
                            <option key={o._id} value={o.name} className="bg-white dark:bg-slate-900">{o.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 font-manrope">Official Email</label>
                        <input
                        value={officialEmail}
                        readOnly
                        className="w-full bg-slate-50/50 dark:bg-slate-800/50 border-none rounded-md px-4 py-3 text-sm font-semibold text-slate-500 dark:text-slate-400 font-body outline-none cursor-not-allowed opacity-75" placeholder="Pick an owner to see email..." type="email" />
                      </div>
                    </div>
                  </div>
                  <div className="bg-slate-900 dark:bg-slate-950 p-8 rounded-xl text-white relative overflow-hidden shadow-lg border border-slate-100/10 dark:border-white/5">
                    <div className="relative z-10 space-y-4">
                      <span className="material-symbols-outlined text-3xl opacity-60">verified_user</span>
                      <h4 className="text-lg font-bold font-headline text-white">Compliance</h4>
                      <p className="text-xs leading-relaxed opacity-80 font-body text-white">Initial configuration sets the foundation for your digital ledger. Ensure naming matches legal registry.</p>
                    </div>
                    <div className="absolute -right-8 -bottom-8 opacity-10">
                      <span className="material-symbols-outlined text-[160px]">architecture</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Units */}
            {currentStep === 2 && (
              <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="flex flex-col gap-2">
                  <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white font-headline">Unit & Operational Details</h2>
                  <p className="text-slate-500 dark:text-slate-400 font-medium text-lg max-w-2xl font-body">Define the structural capacity and operational rigor of your new estate asset.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
                  <div className="bg-white dark:bg-slate-900 p-8 rounded-xl shadow-sm space-y-8 flex flex-col border border-slate-100 dark:border-slate-800 text-slate-900 dark:text-white">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-primary dark:text-blue-400">
                        <span className="material-symbols-outlined text-2xl">apartment</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold font-headline">Unit Configuration</h3>
                        <p className="text-xs text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wider font-manrope">Spatial Allocation</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest transition-all">Total Units</label>
                        <input 
                        value={totalUnits}
                        onChange={(e) => {setTotalUnits(e.target.value)}}
                        className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-md px-4 py-3 focus:ring-1 focus:ring-primary focus:bg-white dark:focus:bg-slate-950 outline-none font-body" placeholder="e.g. 142" type="number" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest transition-all">Square Footage</label>
                        <div className="relative">
                          <input 
                          value={squareFootage}
                          onChange={(e) => {setSquareFootage(e.target.value)}}
                          className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-md px-4 py-3 focus:ring-1 focus:ring-primary focus:bg-white dark:focus:bg-slate-950 outline-none font-body" placeholder="e.g. 240,000" type="text" />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">SQ FT</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 font-manrope">Amenity Tier</label>
                      <select 
                      value={amenityTier}
                      onChange={(e) => {setAmenityTier(e.target.value)}}
                      className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-md px-4 py-3 outline-none cursor-pointer appearance-none">
                        {["Premium - Concierge & Valet", "Platinum - Ultra-Luxury", "Gold - Standard", "Silver - Basic"].map((tier) => (
                          <option key={tier} className="bg-white dark:bg-slate-900">{tier}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-slate-900 p-8 rounded-xl shadow-sm space-y-8 flex flex-col border border-slate-100 dark:border-slate-800 text-slate-900 dark:text-white">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-primary dark:text-blue-400">
                        <span className="material-symbols-outlined text-2xl">shield</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold font-headline">Operations & Security</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider font-manrope">Asset Integrity</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-bold uppercase tracking-widest transition-all">Security Protocol</label>
                      <div className="grid grid-cols-1 gap-3">
                        <button className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                          <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-primary dark:text-blue-400">fingerprint</span>
                            <span className="font-bold text-sm font-manrope">Biometric Access</span>
                          </div>
                          <div className="w-4 h-4 rounded-full border-2 border-primary dark:border-blue-400 bg-primary/20"></div>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-2 mb-20 relative h-80 rounded-xl overflow-hidden group border border-slate-100 dark:border-slate-800">
                    <img alt="Modern Architecture" className="w-full h-full object-cover grayscale" src={image}/>
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent"></div>
                    <div className="absolute bottom-8 left-8 text-white">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-white/60">{estateName}</p>
                      <h4 className="text-3xl font-black font-headline text-white">{estateName}</h4>
                      <div className="mt-4 flex items-center gap-2">
                        <label className="px-4 py-2 border border-white/20 bg-white/10 backdrop-blur-sm flex items-center gap-2 rounded-md text-white font-bold text-sm uppercase tracking-widest font-manrope cursor-pointer hover:bg-white/20 transition-all">
                          <Plus className="w-4 h-4"/>
                          Upload Image
                          <input type="file" accept="image/*" onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) setImage(URL.createObjectURL(file));
                          }} className="hidden" />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Assets & Financials */}
            {currentStep === 3 && (
              <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500 text-slate-900 dark:text-white">
                <div className="flex flex-col gap-2">
                  <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white font-headline">Infrastructure & Scope</h2>
                  <p className="text-slate-500 dark:text-slate-400 font-medium text-lg max-w-2xl font-body">Define the technical specifications and structural capacity of the estate holding.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  <div className="lg:col-span-8 space-y-8">
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 text-slate-900 dark:text-white space-y-8">
                      <div className="grid grid-cols-2 gap-6">
                        <div className="col-span-2 md:col-span-1 space-y-2">
                          <label className="block text-sm font-bold tracking-wide">Structural Footprint (SqFt)</label>
                          <input 
                            value={squareFootage}
                            onChange={(e) => setSquareFootage(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-md px-4 py-3 focus:ring-1 focus:ring-primary focus:bg-white dark:focus:bg-slate-950 transition-all font-medium font-body outline-none" placeholder="e.g. 450,000" type="text" />
                        </div>
                        <div className="col-span-2 md:col-span-1 space-y-2">
                          <label className="block text-sm font-bold tracking-wide">Service Tier</label>
                          <select 
                             value={amenityTier}
                             onChange={(e) => setAmenityTier(e.target.value)}
                             className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-md px-4 py-3 focus:ring-1 focus:ring-primary focus:bg-white dark:focus:bg-slate-950 transition-all font-medium font-body outline-none appearance-none cursor-pointer">
                            {['Ultra-Luxury', 'Premium', 'Standard', 'Entry'].map((tier) => (
                              <option key={tier} value={tier} className="bg-white dark:bg-slate-900">{tier}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Final Review */}
            {currentStep === 4 && (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 text-slate-900 dark:text-white">
                <div className="flex justify-between items-end">
                  <div className="space-y-2">
                    <h2 className="text-4xl font-extrabold font-headline tracking-tight">Final Review</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-lg font-body">Verify architectural and financial projections before authorization.</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black font-headline text-primary dark:text-blue-400">100% Complete</p>
                  </div>
                </div>

                <div className="grid grid-cols-12 gap-6 pb-20">
                  <div className="col-span-12 lg:col-span-8 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-8 space-y-8 border border-slate-100 dark:border-slate-800">
                    <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">fingerprint</span>
                        Identity & Scale
                      </span>
                      <button onClick={() => setCurrentStep(1)} className="text-primary dark:text-blue-400 hover:opacity-70 transition-opacity cursor-pointer">Edit</button>
                    </div>
                    <div className="grid grid-cols-3 gap-10">
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Estate Name</label>
                        <p className="text-xl font-bold font-headline text-slate-900 dark:text-white">{estateName}</p>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Total Area</label>
                        <p className="text-xl font-bold font-headline font-body tabular-nums text-slate-900 dark:text-white">{squareFootage}</p>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Status</label>
                        <p className="text-sm font-bold uppercase text-primary dark:text-blue-400">Pending Approval</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-10 pt-4 border-t border-slate-100 dark:border-slate-800">
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Selected Plan</label>
                        <p className="text-sm font-bold font-headline text-slate-900 dark:text-white">{subscriptionPlan}</p>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Billing Cycle</label>
                        <p className="text-sm font-bold font-headline text-slate-900 dark:text-white">{billingFrequency}</p>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Auth Level</label>
                        <p className="text-sm font-bold font-headline text-slate-900 dark:text-white">L1 Executive</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-12 lg:col-span-4 bg-slate-100 dark:bg-slate-800 rounded-xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm">
                    <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1 font-manrope">Estate Capacity</p>
                    <p className="text-3xl font-extrabold font-headline text-slate-900 dark:text-white">{totalUnits} Units</p>
                  </div>
                  <div className="col-span-12 flex items-center justify-between pt-10 border-t border-slate-100 dark:border-slate-800 mt-6">
                    <div className="flex items-center gap-4">
                      <span className="material-symbols-outlined text-primary dark:text-blue-400 text-3xl">verified_user</span>
                      <div>
                        <p className="text-sm font-bold font-headline text-slate-900 dark:text-white">Admin Authorization Required</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-body">Authorize permanent ledger entry for this estate asset.</p>
                      </div>
                    </div>
                    <button onClick={() => alert('Estate Authorized Successfully')} className="bg-slate-900 dark:bg-slate-950 px-12 py-4 rounded-md text-sm font-bold tracking-widest uppercase text-white shadow-2xl hover:scale-105 active:scale-95 transition-transform flex items-center gap-3 cursor-pointer border border-slate-800 dark:border-white/5">
                      Authorize Entry
                      <span className="material-symbols-outlined">arrow_forward</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          </form>

          {/* Loading Modal */}
          {loading && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-10 flex flex-col items-center gap-6 max-w-sm w-full mx-4 border border-slate-100 dark:border-slate-800">
                {/* Spinner */}
                <div className="relative w-16 h-16">
                  <div className="absolute inset-0 rounded-full border-4 border-slate-100 dark:border-slate-800"></div>
                  <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary dark:border-t-blue-400 animate-spin"></div>
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-black font-headline text-slate-900 dark:text-white">Authorizing Entry</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-body">Recording estate to the permanent ledger. Please wait...</p>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-primary dark:text-blue-400 uppercase tracking-widest font-manrope">
                  <span className="w-2 h-2 rounded-full bg-primary dark:bg-blue-400 animate-pulse"></span>
                  Processing
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Global Footer Actions */}
        <footer className="fixed bottom-0 right-0 left-0 h-24 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-t border-slate-100 dark:border-slate-800 px-12 flex items-center justify-between z-30">
          <div className="flex items-center gap-4 text-slate-900 dark:text-white">
            <button 
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center gap-2 px-6 py-3 text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed font-manrope"
            >
              <span className="material-symbols-outlined text-lg">arrow_back</span>
              Previous Step
            </button>
            <div className="h-6 w-px bg-slate-100 dark:bg-slate-800"></div>
            <button type="button" className="px-6 py-3 text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-2 font-manrope">
              <span className="material-symbols-outlined text-lg">save</span>
              Save Draft
            </button>
          </div>
          <div className="flex items-center gap-8 text-slate-900 dark:text-white">
            <div className="text-right hidden lg:block">
              <p className="text-[10px] uppercase font-black tracking-widest text-slate-400 dark:text-slate-500">Registry Commitment</p>
              <p className="text-xl font-headline font-extrabold text-slate-900 dark:text-white tabular-nums">
                {currentStep === 4 ? 'Verified Entry' : 'Drafting...'}
              </p>
            </div>
            <button 
              type="button"
              disabled={loading}
              onClick={currentStep === 4 ? handleSubmit : nextStep}
              className="group relative px-10 py-4 bg-slate-900 dark:bg-slate-800 text-white rounded-md font-bold uppercase tracking-widest text-sm shadow-2xl transition-all active:scale-95 hover:opacity-90 font-manrope disabled:opacity-60 disabled:cursor-not-allowed border border-slate-800 dark:border-slate-700"
            >
              <span className="flex items-center gap-3">
                {currentStep === 4 ? (loading ? 'Submitting...' : 'Complete') : 'Continue'}
                <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </span>
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default EstateCreationWizard;