import React, { useState } from 'react';
import { Home, Globe, Briefcase, Shield, LogOut, Users, Menu, X, GraduationCap, Layers, Sparkles, MessageSquare, Lock } from 'lucide-react';
import { TechifyIcon } from './TechifyLogo';
import { useAdminAuth } from '../lib/adminAuth';
import { motion, AnimatePresence } from 'motion/react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenConsultation: () => void;
  onOpenAdminLogin: () => void;
}

export default function Header({ activeTab, setActiveTab, onOpenConsultation, onOpenAdminLogin }: HeaderProps) {
  const { isAdmin, logout } = useAdminAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const baseNavItems = [
    { id: 'inicio', label: 'INÍCIO', icon: Home },
    { id: 'sobre-nos', label: 'SOBRE NÓS', icon: Users },
    { id: 'portfolio', label: 'PORTFÓLIO', icon: Globe },
    { id: 'apps', label: 'APPS', icon: Layers, isNew: true },
    { id: 'academia', label: 'TECHIFY MOTION', icon: Sparkles, isNew: true },
    { id: 'carreiras', label: 'CARREIRAS', icon: Briefcase },
  ];

  const navItems = isAdmin 
    ? [...baseNavItems, { id: 'admin', label: 'ADMIN', icon: Shield }]
    : baseNavItems;

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-900 bg-black/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8 py-3 sm:py-3.5">
        {/* Logo Container and Brand Name */}
        <div 
          className="flex cursor-pointer items-center gap-2.5 sm:gap-3 transition-opacity hover:opacity-90 select-none shrink-0"
          onClick={() => handleNavClick('inicio')}
        >
          {/* Exact Techify icon box */}
          <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg border border-neutral-800 bg-[#060606] p-1.5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] ring-1 ring-black">
            <TechifyIcon className="h-full w-full" color="#2eff00" />
          </div>
          <span className="font-display text-lg sm:text-xl font-black tracking-wider text-white">
            TECHIFY
          </span>
        </div>

        {/* Desktop Navigation Actions */}
        <nav className="hidden lg:flex items-center gap-1 sm:gap-1.5">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold tracking-wide transition-all cursor-pointer select-none ${
                  isActive
                    ? 'border border-[#22c55e] bg-[#051c05]/80 text-[#4ade80] shadow-[0_0_15px_rgba(34,197,94,0.18)]'
                    : 'text-neutral-300 hover:text-white hover:bg-neutral-900/50 border border-transparent'
                }`}
              >
                <IconComponent className={`h-3.5 w-3.5 shrink-0 ${isActive ? 'text-[#4ade80]' : 'text-neutral-400'}`} />
                <span className="font-semibold">{item.label}</span>
                
                {/* Visual badge for APPS (Novo) or ACADEMIA (Em Dev) */}
                {'isNew' in item && item.isNew && (
                  <span className="ml-0.5 rounded-full bg-[#22c55e]/20 border border-[#22c55e]/40 px-1.5 py-0.2 text-[9px] font-extrabold text-[#4ade80]">
                    NOVO
                  </span>
                )}
                {'inDev' in item && item.inDev && (
                  <span className="ml-0.5 flex items-center gap-0.5 rounded-full bg-neutral-800 border border-neutral-700 px-1.5 py-0.2 text-[9px] font-semibold text-neutral-400">
                    <Lock className="h-2 w-2 text-neutral-400" />
                    <span>DEV</span>
                  </span>
                )}

                {/* Active bottom highlight bar */}
                {isActive && (
                  <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-8 h-[2.5px] bg-[#22c55e] rounded-full shadow-[0_0_8px_#22c55e]" />
                )}
              </button>
            );
          })}

          {isAdmin && (
            <button
              onClick={() => {
                logout();
                if (activeTab === 'admin') handleNavClick('inicio');
              }}
              className="flex items-center gap-1.5 rounded-xl border border-red-900/40 bg-red-950/20 px-3 py-1.5 text-xs font-bold text-red-400 hover:bg-red-900/30 hover:text-red-300 transition-colors cursor-pointer ml-1"
            >
              <LogOut className="h-3.5 w-3.5 shrink-0" />
              <span>Sair</span>
            </button>
          )}
        </nav>

        {/* Quick Contact Action Button on Desktop & Mobile Menu Button */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onOpenConsultation}
            className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-neutral-800 bg-[#0d0e0d] hover:border-[#22c55e]/50 hover:bg-[#141514] px-3.5 py-2 text-xs font-semibold text-white transition-all shadow-sm cursor-pointer"
          >
            <MessageSquare className="h-3.5 w-3.5 text-[#22c55e]" />
            <span>Falar com Engenheiro</span>
          </button>

          {/* Mobile Hamburger Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex lg:hidden items-center justify-center h-10 w-10 rounded-xl border border-neutral-800 bg-neutral-900/80 text-neutral-300 hover:text-white hover:border-neutral-700 transition-colors cursor-pointer"
            aria-label="Abrir menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="lg:hidden border-t border-neutral-900 bg-black/95 px-4 py-4 backdrop-blur-xl"
          >
            <div className="flex flex-col space-y-1.5">
              {navItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                      isActive
                        ? 'border border-[#22c55e]/50 bg-[#06200a] text-[#4ade80]'
                        : 'text-neutral-300 hover:bg-neutral-900 hover:text-white border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <IconComponent className={`h-4 w-4 ${isActive ? 'text-[#4ade80]' : 'text-neutral-400'}`} />
                      <span>{item.label}</span>
                      {'isNew' in item && item.isNew && (
                        <span className="rounded-full bg-[#22c55e]/20 border border-[#22c55e]/40 px-2 py-0.5 text-[10px] font-extrabold text-[#4ade80]">
                          NOVO
                        </span>
                      )}
                      {'inDev' in item && item.inDev && (
                        <span className="flex items-center gap-1 rounded-full bg-neutral-800 border border-neutral-700 px-2 py-0.5 text-[10px] font-semibold text-neutral-400">
                          <Lock className="h-2.5 w-2.5" />
                          <span>EM DEV</span>
                        </span>
                      )}
                    </div>
                    {isActive && <div className="h-2 w-2 rounded-full bg-[#22c55e]" />}
                  </button>
                );
              })}

              <div className="pt-3 mt-2 border-t border-neutral-900 flex flex-col gap-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenConsultation();
                  }}
                  className="w-full py-3 rounded-xl bg-[#22c55e] text-black font-extrabold text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(34,197,94,0.3)] cursor-pointer"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>Falar com Engenheiro</span>
                </button>

                {isAdmin && (
                  <button
                    onClick={() => {
                      logout();
                      handleNavClick('inicio');
                    }}
                    className="w-full py-2.5 rounded-xl border border-red-900/40 bg-red-950/20 text-red-400 text-xs font-bold flex items-center justify-center gap-2"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Sair do Painel Admin</span>
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

