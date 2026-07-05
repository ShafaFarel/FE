import React, { useState } from 'react';
import { Sparkles, Menu, X, LayoutDashboard, Compass, Home, Bot, Moon, Sun, LogOut, LogIn, Zap } from 'lucide-react';
import { useTheme } from './ThemeProvider';

export default function Navbar({ activeView, setActiveView, userEmail, onLogout, onLoginClick }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();

  const navItems = [
    { id: 'landing',   label: 'Home',         icon: Home },
    { id: 'form',      label: 'AI Predictor', icon: Compass },
    { id: 'dashboard', label: 'Dashboard',    icon: LayoutDashboard },
    { id: 'mentor-ai', label: 'AI Mentor',    icon: Bot },
    
  ];

  const getInitials = (email) => {
    if (!email) return 'U';
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <nav className="sticky top-0 z-50 w-full">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-canvas/80 backdrop-blur-2xl border-b border-hairline" />


      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* Logo */}
          <button
            onClick={() => { setActiveView('landing'); setMobileMenuOpen(false); }}
            className="flex items-center gap-2 group"
          >
            {/* The Data Pathway Logo Icon */}
            <svg viewBox="0 0 24 24" className="h-5.5 w-5.5 text-ink transition-transform group-hover:scale-[1.04]" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
              <circle cx="6" cy="18" r="1.5" fill="currentColor" />
              <circle cx="12" cy="12" r="1.5" fill="currentColor" />
              <circle cx="18" cy="6" r="1.5" fill="currentColor" />
              <circle cx="6" cy="6" r="0.75" className="opacity-40" fill="currentColor" />
              <circle cx="18" cy="18" r="0.75" className="opacity-40" fill="currentColor" />
              <path d="M6 18l12-12" />
              <path d="M12 6h6v6" />
            </svg>
            <div className="flex items-baseline gap-1">
              <span className="text-sm font-bold tracking-[-0.03em] text-ink font-sans">EduFuture</span>
              <span className="text-sm font-normal tracking-[-0.03em] text-ink-muted font-sans">AI</span>
            </div>
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id || (item.id === 'form' && activeView === 'result');
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-all duration-150 ${
                    isActive
                      ? 'text-ink'
                      : 'text-ink-muted hover:text-ink'
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-ink' : 'text-ink-subtle'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* User Section */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-ink-subtle hover:text-ink hover:bg-surface-2 transition-all"
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4.5 w-4.5" />}
            </button>

            <div className="h-4 w-px bg-hairline" />

            {userEmail ? (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-xs font-bold text-ink truncate max-w-[100px]">
                    {userEmail.split('@')[0]}
                  </p>
                  <p className="text-[10px] text-ink-subtle font-mono">Online</p>
                </div>

                <button
                  onClick={() => setActiveView('dashboard')}
                  className="relative h-8 w-8 cursor-pointer rounded-full bg-ink flex items-center justify-center text-xs font-black text-canvas hover:scale-105 transition-all"
                >
                  {getInitials(userEmail)}
                  <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full border border-canvas bg-green-500" />
                </button>

                <button
                  onClick={onLogout}
                  className="p-2 rounded-full text-ink-subtle hover:text-error hover:bg-error/10 transition-all"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onLoginClick}
                className="btn-ink px-4 py-1.5 text-xs"
              >
                <span>Masuk</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-ink-subtle hover:bg-surface-2 transition-all"
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-ink-subtle hover:bg-surface-2 transition-all"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-hairline bg-canvas/95 backdrop-blur-2xl px-4 pt-3 pb-5 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id || (item.id === 'form' && activeView === 'result');
            return (
              <button
                key={item.id}
                onClick={() => { setActiveView(item.id); setMobileMenuOpen(false); }}
                className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-surface-2 text-ink'
                    : 'text-ink-muted hover:bg-surface-2 hover:text-ink'
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'text-ink' : 'text-ink-subtle'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="border-t border-hairline mt-3 pt-4 px-1">
            {userEmail ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-ink flex items-center justify-center text-xs font-bold text-canvas">
                    {getInitials(userEmail)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-ink">{userEmail.split('@')[0]}</p>
                    <p className="text-xs text-ink-subtle">{userEmail}</p>
                  </div>
                </div>
                <button
                  onClick={() => { onLogout(); setMobileMenuOpen(false); }}
                  className="p-2 rounded-xl text-error hover:bg-error/10 transition-all"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => { onLoginClick(); setMobileMenuOpen(false); }}
                className="w-full btn-ink flex items-center justify-center gap-2 py-3 text-sm"
              >
                <LogIn className="h-4 w-4" />
                <span>Masuk ke Akun</span>
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
