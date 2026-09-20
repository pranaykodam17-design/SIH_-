import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Satellite, Search, HelpCircle, Menu, X, ChevronRight,
  Zap, Bell
} from 'lucide-react';

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Platform', to: '/platform' },
  { label: 'Compare', to: '/compare' },
  { label: 'Analysis', to: '/analysis' },
  { label: 'Use Cases', to: '/use-cases' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'About', to: '/about' },
];

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => setMenuOpen(false), [location.pathname]);

  const isActive = (to: string) => {
    if (to === '/') return location.pathname === '/';
    if (to === '/platform') return location.pathname === '/platform' || location.pathname === '/enhance';
    return location.pathname.startsWith(to);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled || menuOpen ? 'navbar-blur' : 'bg-transparent'
          }`}
        style={{ height: 'var(--nav-height)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 flex-shrink-0 group">
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-glow-cyan group-hover:shadow-btn-cyan-lg transition-shadow duration-300">
                <Satellite size={18} className="text-[#10233F]" />
              </div>
              <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-cyan-400 border-2 border-[#020c1b] animate-pulse-slow" />
            </div>
            <div className="hidden sm:block">
              <div className="text-base font-black text-[#10233F] tracking-tight leading-none">SRM</div>
              <div className="text-[10px] font-medium text-[#6B7F95] tracking-wider leading-none mt-0.5">
                Sharper Earth. Better Decisions.
              </div>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`relative px-3.5 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${isActive(link.to)
                  ? 'text-[#1677FF] bg-cyan-400/8'
                  : 'text-[#526A82] hover:text-[#10233F] hover:bg-white'
                  }`}
              >
                {link.label}
                {isActive(link.to) && (
                  <span className="absolute bottom-0.5 left-3 right-3 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full" />
                )}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="hidden lg:flex items-center gap-2">
            <button
              className="w-9 h-9 flex items-center justify-center rounded-xl text-[#6B7F95] hover:text-[#425873] hover:bg-white transition-all duration-200"
              title="Search"
            >
              <Search size={16} />
            </button>
            <button
              className="w-9 h-9 flex items-center justify-center rounded-xl text-[#6B7F95] hover:text-[#425873] hover:bg-white transition-all duration-200 relative"
              title="Notifications"
            >
              <Bell size={16} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-cyan-400 rounded-full" />
            </button>
            <button
              className="w-9 h-9 flex items-center justify-center rounded-xl text-[#6B7F95] hover:text-[#425873] hover:bg-white transition-all duration-200"
              title="Help"
            >
              <HelpCircle size={16} />
            </button>
            <div className="w-px h-5 bg-white mx-1" />
            <button
              onClick={() => navigate('/platform')}
              className="btn-primary text-xs py-2 px-4"
            >
              <Zap size={13} />
              Get Started
            </button>
          </div>

          {/* Mobile: Get Started + Hamburger */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => navigate('/platform')}
              className="btn-primary text-xs py-2 px-3"
            >
              <Zap size={12} />
              Start
            </button>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="w-9 h-9 flex items-center justify-center rounded-xl text-[#526A82] hover:text-[#10233F] hover:bg-white transition-all duration-200"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="lg:hidden navbar-blur border-t border-[#D7E6F4] px-4 py-3 space-y-1 animate-fade-in">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${isActive(link.to)
                  ? 'bg-cyan-400/10 text-[#1677FF] border border-cyan-400/20'
                  : 'text-[#526A82] hover:text-[#10233F] hover:bg-white'
                  }`}
              >
                {link.label}
                <ChevronRight size={14} className="opacity-40" />
              </Link>
            ))}
            <div className="pt-2 pb-1 flex gap-3">
              <button className="flex-1 btn-secondary text-xs py-2.5 justify-center">
                <Search size={13} /> Search
              </button>
              <button className="flex-1 btn-secondary text-xs py-2.5 justify-center">
                <HelpCircle size={13} /> Help
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Spacer */}
      <div style={{ height: 'var(--nav-height)' }} />
    </>
  );
};
