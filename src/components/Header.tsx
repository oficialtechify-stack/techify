import React from 'react';
import { Home, Globe, Briefcase, Shield, LogOut } from 'lucide-react';
import { TechifyIcon } from './TechifyLogo';
import { useAdminAuth } from '../lib/adminAuth';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenConsultation: () => void;
  onOpenAdminLogin: () => void;
}

export default function Header({ activeTab, setActiveTab, onOpenConsultation, onOpenAdminLogin }: HeaderProps) {
  const { isAdmin, logout } = useAdminAuth();

  const baseNavItems = [
    { id: 'inicio', label: 'INÍCIO', icon: Home },
    { id: 'portfolio', label: 'PORTFÓLIO', icon: Globe },
    { id: 'carreiras', label: 'CARREIRAS', icon: Briefcase },
  ];

  const navItems = isAdmin 
    ? [...baseNavItems, { id: 'admin', label: 'ADMIN', icon: Shield }]
    : baseNavItems;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-900 bg-black/75 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Logo Container and Brand Name */}
        <div 
          className="flex cursor-pointer items-center gap-3 transition-opacity hover:opacity-90 select-none"
          onClick={() => setActiveTab('inicio')}
        >
          {/* Exact Techify icon box */}
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-800 bg-[#060606] p-1.5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] ring-1 ring-black">
            <TechifyIcon className="h-full w-full" color="#2eff00" />
          </div>
          <span className="font-display text-xl font-black tracking-wider text-white">
            TECHIFY
          </span>
        </div>

        {/* Navigation Actions */}
        <nav className="flex items-center gap-1.5 sm:gap-4">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold tracking-wide transition-all duration-350 sm:px-3 sm:py-2 sm:text-sm ${
                  isActive
                    ? 'border border-brand-accent/30 bg-brand-accent/5 font-bold text-brand-lime'
                    : 'border border-transparent text-neutral-400 hover:bg-neutral-900/50 hover:text-white'
                }`}
              >
                <IconComponent className="h-4 w-4" />
                <span className="hidden sm:inline">{item.label}</span>
                {isActive && (
                  <span className="absolute -bottom-[1px] left-1/4 right-1/4 h-[2px] bg-brand-accent" />
                )}
              </button>
            );
          })}

          {isAdmin && (
            <button
              onClick={() => {
                logout();
                if (activeTab === 'admin') setActiveTab('inicio');
              }}
              className="flex items-center gap-1 text-[11px] font-bold text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 px-2.5 py-1.5 rounded-lg border border-red-500/20 transition-all cursor-pointer"
              title="Sair do Modo Admin"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden md:inline">Sair</span>
            </button>
          )}
        </nav>

        {/* Quick Contact Action Button on Desktop */}
        <div className="hidden md:block">
          <button
            onClick={onOpenConsultation}
            className="flex items-center gap-1.5 rounded-lg bg-neutral-900/40 hover:bg-brand-accent/10 border border-neutral-800 hover:border-brand-accent/50 text-neutral-300 hover:text-white transition-all duration-200 text-xs font-semibold px-4 py-2"
          >
            Falar com Engenheiro
          </button>
        </div>
      </div>
    </header>
  );
}

