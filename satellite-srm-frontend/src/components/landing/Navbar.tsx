import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Satellite, ArrowRight, Menu, X, Sparkles } from 'lucide-react';

interface NavbarProps {
  activeSection?: string;
}

export const Navbar: React.FC<NavbarProps> = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Home', to: '/', href: '#hero' },
    { label: 'Platform', to: '/platform' },
    { label: 'Technology', href: '#approach' },
    { label: 'Multispectral', href: '#multispectral' },
    { label: 'About', href: '#challenge' },
  ];

  const handleNavClick = (item: { label: string; href?: string; to?: string }) => {
    setMobileOpen(false);
    if (item.label === 'Home') {
      if (window.location.pathname !== '/') {
        navigate('/');
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else if (item.to) {
      navigate(item.to);
    } else if (item.href) {
      if (window.location.pathname !== '/') {
        navigate('/' + item.href);
      } else {
        const el = document.querySelector(item.href);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled || mobileOpen
          ? 'navbar-blur'
          : 'bg-transparent border-b border-transparent'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Left: Brand / Logo */}
        <Link to="/" className="flex items-center gap-3.5 group">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 flex items-center justify-center shadow-[0_0_20px_rgba(0,212,255,0.4)] group-hover:shadow-[0_0_30px_rgba(0,212,255,0.7)] transition-all duration-300">
              <Satellite size={20} className="text-[#10233F] transform group-hover:rotate-12 transition-transform duration-300" />
            </div>
            {/* Pulsing indicator dot */}
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-cyan-400 border-2 border-[#020b18] animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-black text-[#10233F] tracking-tight">TerraSR</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#1677FF]/20 border border-cyan-400/30 text-cyan-700">
                AI
              </span>
            </div>
            <div className="text-[11px] font-medium text-[#526A82] tracking-wider">
              Multispectral Intelligence
            </div>
          </div>
        </Link>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-white border border-[#D7E6F4] rounded-full px-4 py-1.5 backdrop-blur-md">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => handleNavClick(item)}
              className="px-3.5 py-1.5 text-sm font-medium text-[#425873] hover:text-cyan-700 hover:bg-white rounded-full transition-all duration-200"
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Right: Launch Platform CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/platform"
            className="group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 bg-[length:200%_auto] hover:bg-right text-[#10233F] font-bold text-sm shadow-[0_0_24px_rgba(0,212,255,0.35)] hover:shadow-[0_0_36px_rgba(0,212,255,0.6)] transition-all duration-300 transform hover:-translate-y-0.5"
          >
            <span>Launch Platform</span>
            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden w-10 h-10 rounded-xl bg-white border border-[#D7E6F4] flex items-center justify-center text-[#425873] hover:text-[#10233F]"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden px-4 pt-2 pb-6 bg-white/95 backdrop-blur-2xl border-b border-[#D7E6F4] flex flex-col gap-2">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => handleNavClick(item)}
              className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-[#425873] hover:bg-white hover:text-cyan-700"
            >
              {item.label}
            </button>
          ))}
          <div className="pt-2 border-t border-[#D7E6F4] mt-1">
            <Link
              to="/platform"
              onClick={() => setMobileOpen(false)}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-[#10233F] font-bold text-sm shadow-[0_0_20px_rgba(0,212,255,0.35)]"
            >
              <span>Launch Platform</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
