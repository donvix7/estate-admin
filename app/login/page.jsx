"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import { handleAdminLogin, serverLogin } from '@/lib/actions';
import { useRouter } from 'next/navigation';

const LoginPage = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  
  const handleLogin = async(e)=>{
    e.preventDefault();
    setError('');
    setLoading(true);
    const data = {
      email,
      password
    }

    try {
      const res = await serverLogin(data);
      console.log(res)
      router.push('/dashboard');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="bg-surface font-body text-on-surface selection:bg-secondary-container selection:text-on-secondary-container min-h-screen">
      {/* Back to Home Link */}
      <div className="fixed top-8 left-8 z-50">
        <Link 
          href="/" 
          className="flex items-center gap-2 group transition-all duration-200"
        >
          <span className="material-symbols-outlined text-secondary group-hover:text-primary transition-colors">
            arrow_back
          </span>
          <span className="font-label text-sm font-medium text-secondary group-hover:text-primary tracking-wide">
            Back to Home
          </span>
        </Link>
      </div>

      <main className="min-h-screen flex items-center justify-center relative overflow-hidden architectural-grid">
        {/* Abstract Architectural Texture Element */}
        <div className="absolute -top-24 -right-24 w-96 h-96 border-[0.5px] border-outline-variant/30 rotate-12 pointer-events-none"></div>
        <div className="absolute -bottom-12 -left-12 w-64 h-64 border-[0.5px] border-outline-variant/30 -rotate-45 pointer-events-none"></div>
        
        <section className="w-full max-w-[440px] px-6 py-12">
          {/* Brand Identity */}
          <div className="text-center mb-12">
            <h1 className="font-headline font-extrabold text-3xl tracking-tighter text-primary mb-2">
              The Estate Director
            </h1>
            <p className="font-label text-sm text-on-surface-variant/80 tracking-wide uppercase">
              Executive Management Portal
            </p>
          </div>

          {/* Login Card */}
          <div className="bg-surface-container-lowest rounded-xl whisper-shadow p-10 border border-outline-variant/10">
            <div className="mb-8">
              <h2 className="font-headline font-bold text-xl text-primary">Sign In</h2>
              <p className="text-on-surface-variant text-sm mt-1">Access your global portfolio</p>
            </div>
            
            {error && (
              <div className="mb-6 p-4 bg-error-container/20 border border-error/20 rounded-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                <span className="material-symbols-outlined text-error text-sm">report</span>
                <p className="text-xs font-semibold text-error tracking-wide uppercase">{error}</p>
              </div>
            )}
            
            <form className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <label 
                  className="block font-label text-xs font-semibold uppercase tracking-wider text-on-surface-variant" 
                  htmlFor="email"
                >
                  Email Address
                </label>
                <div className="relative group">
                  <input 
                    className="w-full h-12 px-4 bg-surface-container-low border-0 focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest rounded-lg transition-all duration-200 placeholder:text-outline text-on-surface" 
                    id="email" 
                    name="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@estatedirector.com" 
                    type="email"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label 
                    className="block font-label text-xs font-semibold uppercase tracking-wider text-on-surface-variant" 
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <Link 
                    href="#" 
                    className="text-xs font-medium text-secondary hover:text-primary transition-colors"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative group">
                  <input 
                    className="w-full h-12 px-4 bg-surface-container-low border-0 focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest rounded-lg transition-all duration-200 placeholder:text-outline text-on-surface dark:text-white" 
                    id="password" 
                    name="password" 
                      value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    
                    placeholder="••••••••" 
                    type="password"
                  />
                </div>
              </div>

              {/* Options */}
              <div className="flex items-center space-x-2 py-1">
                <input 
                  className="w-4 h-4 rounded-sm border-outline-variant text-primary focus:ring-primary" 
                  id="remember" 
                  type="checkbox" 
                />
                <label 
                  className="text-sm text-on-surface-variant" 
                  htmlFor="remember"
                >
                  Keep me signed in on this device
                </label>
              </div>

              {/* Action Button */}
              <button 
                className={`w-full h-12 primary-gradient text-on-primary font-label text-sm font-bold uppercase tracking-widest rounded-lg transition-transform active:scale-[0.98] hover:opacity-90 shadow-lg shadow-primary/10 cursor-pointer flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`} 
                type="submit"
                onClick={handleLogin}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="animate-spin h-4 w-4 border-2 border-on-primary/30 border-t-on-primary rounded-full"></span>
                    <span>Processing...</span>
                  </>
                ) : 'Sign In'}
              </button>
            </form>

            <div className="mt-10 pt-8 border-t border-outline-variant/10 flex flex-col items-center gap-4">
              <p className="text-sm text-on-surface-variant">New associate?</p>
              <button className="px-6 py-2 border-[0.5px] border-outline text-primary font-label text-xs font-bold uppercase tracking-wider rounded-md hover:bg-surface-container-low transition-colors cursor-pointer">
                Request Access
              </button>
            </div>
          </div>

          {/* Legal/Context Links */}
          <div className="mt-12 flex justify-center gap-6">
            <Link className="text-[10px] font-bold uppercase tracking-[0.2em] text-outline hover:text-secondary transition-colors" href="#">Security Protocol</Link>
            <Link className="text-[10px] font-bold uppercase tracking-[0.2em] text-outline hover:text-secondary transition-colors" href="#">Privacy</Link>
            <Link className="text-[10px] font-bold uppercase tracking-[0.2em] text-outline hover:text-secondary transition-colors" href="#">Contact Support</Link>
          </div>
        </section>

        {/* Dynamic Background Image Decoration (Right Side Only visible on large screens) */}
        <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-1/3 bg-surface-container-low z-[-1] overflow-hidden">
          <img 
            className="w-full h-full object-cover opacity-20 mix-blend-multiply grayscale" 
            alt="Monolithic modern architecture facade" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC2i9-tApP0HXr0qW5zSQEhvoge7cMW9P8CKdHzLCEZBJPiG9K4YvNDrG-YUAMWYgl2xJw2XS9uxeOr6jcj7PqbDF-4fIP2rxQmSdLK6_TQex3mFZIwggGaKmfurnRiiBo4rLgK5Pkv2KUNjrOq8hp0cqKRg8cMUjUPSve1ZhzzqPO2wl8oqnfl0etElEzFzZvCkRvJHR-I4GqsQFRANqzIwf3NWncTzdtkyKeMAcQ49CVuz-szzU6AOVxAotc9zJxkY75KQDt0qe-Y" 
          />
          <div className="absolute inset-0 bg-linear-to-r from-surface to-transparent"></div>
        </div>
      </main>

      {/* Simple Footer for transactional page */}
      <footer className="bg-surface-container-low py-6 px-8">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-body text-xs tracking-normal text-secondary">
            © 2024 The Estate Director. All rights reserved.
          </p>
          <div className="flex gap-6">
            <span className="text-[10px] text-outline font-medium tracking-widest uppercase">London</span>
            <span className="text-[10px] text-outline font-medium tracking-widest uppercase">New York</span>
            <span className="text-[10px] text-outline font-medium tracking-widest uppercase">Geneva</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LoginPage;