import React from 'react';
import { Home, Globe, Briefcase, Shield } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenConsultation: () => void;
}

export default function Header({ activeTab, setActiveTab, onOpenConsultation }: HeaderProps) {
  const navItems = [
    { id: 'inicio', label: 'INÍCIO', icon: Home },
    { id: 'portfolio', label: 'PORTFÓLIO', icon: Globe },
    { id: 'carreiras', label: 'CARREIRAS', icon: Briefcase },
    { id: 'admin', label: 'ADMIN', icon: Shield },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-900 bg-black/75 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Logo Container and Brand Name */}
        <div 
          className="flex cursor-pointer items-center gap-3 transition-opacity hover:opacity-90"
          onClick={() => setActiveTab('inicio')}
        >
          {/* Exact Techify icon box from screenshots */}
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-800 bg-[#060606] p-1.5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] ring-1 ring-black">
            <svg viewBox="0 0 100 100" className="h-full w-full" fill="none">
              {/* Specialized neon logo wave */}
              <path
                d="M15,80 C30,70 35,30 50,45 C65,60 70,25 85,15"
                stroke="#39FF14"
                strokeWidth="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="50" cy="45" r="8" fill="#a3e635" />
              <circle cx="85" cy="15" r="8" fill="#a3e635" />
            </svg>
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
                    ? 'border border-brand-accent/30 bg-brand-accent/5 font-bold text-brand-lime text-glow-green shadow-[0_0_12px_rgba(57,255,20,0.08)]'
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
