'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LogOut, Search, Building2, User, ChevronRight } from 'lucide-react';
import getEstates, { getOwners, getJoinRequests } from '@/lib/services';

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState('');
  const [estates, setEstates] = useState([]);
  const [owners, setOwners] = useState([]);
  const [requests, setRequests] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef(null);

  const router = useRouter();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [estatesData, ownersData, requestsData] = await Promise.all([
          getEstates(),
          getOwners(),
          getJoinRequests()
        ]);
        setEstates(estatesData);
        setOwners(ownersData);
        setRequests(requestsData);
      } catch (error) {
        console.error('Failed to fetch search data:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const handleClickAway = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickAway);
    return () => document.removeEventListener('mousedown', handleClickAway);
  }, []);

  const filteredResults = searchQuery.trim() === '' ? [] : [
    ...estates.filter(e => 
      e.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      e.id.toLowerCase().includes(searchQuery.toLowerCase())
    ).map(e => ({ ...e, type: 'estate', icon: <Building2 className="w-4 h-4" />, href: `/dashboard/estates/${e.id}` })),
    ...owners.filter(o => 
      o.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      o.id.toLowerCase().includes(searchQuery.toLowerCase())
    ).map(o => ({ ...o, type: 'owner', icon: <User className="w-4 h-4" />, href: `/dashboard/estate-owners/${o.id}/view` }))
  ].slice(0, 8);

  const navLinks = [
    { label: 'Overview', href: '/dashboard', icon: 'dashboard' },
    { label: 'Estates', href: '/dashboard/estates', icon: 'domain' },
    { label: 'Join Requests', href: '/dashboard/requests', icon: 'assignment_ind' },
    { label: 'Owners', href: '/dashboard/estate-owners', icon: 'person' },
    { label: 'Payments', href: '/dashboard/payments', icon: 'payments' },
    { label: 'Activities', href: '/dashboard/activities', icon: 'history' },
    { label: 'Settings', href: '/dashboard/settings', icon: 'settings' },
  ];


  const handleLogout = () => {
    // Clear any session data here if needed
    router.push('/login');
  };

  return (
    <div className="bg-white text-slate-900 min-h-screen font-body dark:bg-slate-900 dark:text-white">
      {/* SideNavBar Shell */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-900 flex flex-col p-6 z-50 font-manrope antialiased tracking-tight">
        <div className="mb-10 px-4">
          <Link href="/" className="text-xl font-bold tracking-tighter text-white hover:opacity-80 transition-opacity">
            Estate Director
          </Link>
          <div className="mt-2 text-xs text-slate-400 uppercase tracking-widest">Super Admin</div>
        </div>
        
        <nav className="flex-1 space-y-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.href}
                href={link.href} 
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors group ${
                  isActive 
                    ? 'bg-blue-600/10 text-blue-400 border-l-4 border-blue-500 font-semibold' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <span 
                  className="material-symbols-outlined" 
                  style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                >
                  {link.icon}
                </span>
                <span>{link.label}</span>
                {link.label === 'Join Requests' && requests.filter(r => r.status === 'pending').length > 0 && (
                  <span className="ml-auto bg-rose-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full animate-pulse">
                    {requests.filter(r => r.status === 'pending').length}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-800/50 flex items-center gap-4 px-4 text-white">
          <img 
            alt="Super Admin Avatar" 
            className="w-10 h-10 rounded-lg object-cover" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDeFcHrdRysxddBXV-kGqRqI2mEgmDO2VQ4IiFcieIW0qQhl4VA3CK5Vm-8-i0C_vf6sCtL4ngf5fOfIBKwwJoiaM6PjxcDCt1zy3FUcYNGecT4gw65o6Xa4JHK_p4nwxjRGs3GTrURmu9IjplhOL-O_oHWdFkoy2hX120AP1s7Z8ecAJMRls9fST19q5zFKKeCXp-T2c4MDtaBKZRnP88qzKnfCuZ3nU1kydcw8PdOagRMdERwdU11TjSe3dZtKyOq6AH_NrKSP-mN"
          />
          <div className="overflow-hidden">
            <p className="text-sm font-bold truncate">Estate Director</p>
            <p className="text-xs text-slate-500 truncate">Super Admin</p>
          </div>
        </div>
        <div>
            <button className='text-red-500 flex gap-2  mt-5 mx-auto p-4 hover:cursor-pointer hover:bg-red-500/10 rounded-lg w-full justify-center' onClick={handleLogout}>logout <LogOut/></button>
        </div>
      </aside>

      {/* Main Content Canvas */}
      <div className="ml-64 min-h-screen">
        {/* TopNavBar Shell */}
        <header className="fixed top-0 right-0 left-64 h-20 border-b border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md z-40 transition-colors duration-300">
          <div className="flex justify-between items-center px-10 w-full h-full text-slate-900 dark:text-white">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative w-full max-w-md" ref={searchRef}>
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
                <input 
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-xl py-2.5 pl-11 pr-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none font-manrope placeholder:text-slate-400" 
                  placeholder="Search estates, owners, or IDs..." 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsSearchOpen(true);
                  }}
                  onFocus={() => setIsSearchOpen(true)}
                />

                {/* Search Results Dropdown */}
                {isSearchOpen && searchQuery.trim() !== '' && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                    <div className="p-2">
                      <div className="px-3 py-2 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 mb-1">
                        Global Search Results
                      </div>
                      <div className="max-h-[320px] overflow-y-auto">
                        {filteredResults.length > 0 ? (
                          filteredResults.map((result, idx) => (
                            <Link 
                              key={`${result.type}-${result.id}`}
                              href={result.href}
                              onClick={() => {
                                setIsSearchOpen(false);
                                setSearchQuery('');
                              }}
                              className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group"
                            >
                              <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${result.type === 'estate' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-500' : 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-500'}`}>
                                  {result.icon}
                                </div>
                                <div>
                                  <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{result.name}</p>
                                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-manrope uppercase tracking-tight">{result.type} • {result.id}</p>
                                </div>
                              </div>
                              <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-primary transition-colors" />
                            </Link>
                          ))
                        ) : (
                          <div className="p-8 text-center">
                            <p className="text-xs text-slate-500 dark:text-slate-400 italic">No matching assets found.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-6">
              <Link 
                href="/create-new-estate"
                className="bg-primary text-on-primary px-6 py-2.5 rounded-md font-manrope text-sm font-semibold tracking-wider flex items-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-primary/10 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">add</span>
                NEW ESTATE
              </Link>
              <div className="h-6 w-px bg-outline-variant/10"></div>
              <div className="flex items-center gap-2">
                <button className="hover:bg-surface-container rounded-full p-2 transition-all scale-95 active:scale-90 cursor-pointer text-on-surface-variant">
                  <span className="material-symbols-outlined">notifications</span>
                </button>
                <button className="hover:bg-surface-container rounded-full p-2 transition-all scale-95 active:scale-90 cursor-pointer text-on-surface-variant">
                  <span className="material-symbols-outlined">account_circle</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="pt-20 bg-white dark:bg-slate-900 min-h-[calc(100vh-5rem)] transition-colors duration-300">
          {children}
        </main>
      </div>
    </div>
  );
}