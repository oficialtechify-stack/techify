import React from 'react';
import { Mail, MessageCircle, Instagram } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
  onOpenConsultation: () => void;
}

export default function Footer({ onNavigate, onOpenConsultation }: FooterProps) {
  return (
    <footer className="border-t border-neutral-900 bg-black py-16 text-neutral-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          {/* Column 1: Brand details */}
          <div className="space-y-6">
            <div 
              className="flex cursor-pointer items-center gap-3"
              onClick={() => onNavigate('inicio')}
            >
              {/* Specialized Techify Logo Box */}
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-800 bg-[#060606] p-1.5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] ring-1 ring-black">
                <svg viewBox="0 0 100 100" className="h-full w-full" fill="none">
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
            
            <p className="text-sm leading-relaxed text-neutral-400 max-w-sm">
              Inovação digital e design de alta performance. Criamos experiências que conectam marcas a resultados de impacto mensurável.
            </p>

            {/* Instagram Button matching screenshots */}
            <div>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-brand-accent/20 bg-brand-accent/5 hover:bg-brand-accent/15 px-4 py-2 text-xs font-bold text-brand-accent text-glow-green transition-all duration-300"
              >
                <Instagram className="h-4 w-4" />
                <span>@techify.digital</span>
              </a>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div>
            <h4 className="font-display text-xs font-black tracking-widest text-white uppercase mb-6">
              NAVEGAÇÃO
            </h4>
            <div className="grid grid-cols-2 gap-y-3 gap-x-4">
              <button
                onClick={() => onNavigate('inicio')}
                className="text-left text-sm text-neutral-400 hover:text-white transition-colors duration-200"
              >
                Início
              </button>
              <button
                onClick={() => onNavigate('portfolio')}
                className="text-left text-sm text-neutral-400 hover:text-white transition-colors duration-200"
              >
                Portfólio
              </button>
              <button
                onClick={() => onNavigate('carreiras')}
                className="text-left text-sm text-neutral-400 hover:text-white transition-colors duration-200"
              >
                Cases
              </button>
              <button
                onClick={onOpenConsultation}
                className="text-left text-sm text-neutral-400 hover:text-white transition-colors duration-200 lg:col-span-1"
              >
                Equipe
              </button>
              <button
                onClick={() => onNavigate('carreiras')}
                className="text-left text-sm text-neutral-400 hover:text-white transition-colors duration-200"
              >
                Blog
              </button>
            </div>
          </div>

          {/* Column 3: Contacts */}
          <div className="space-y-6">
            <h4 className="font-display text-xs font-black tracking-widest text-white uppercase">
              CONTATO
            </h4>
            
            <div className="space-y-4">
              {/* Email Contact */}
              <a
                href="mailto:contato@techify.com.br"
                className="flex items-center gap-3 group"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-800 bg-neutral-900/30 text-brand-lime transition-colors group-hover:border-brand-accent/50 group-hover:bg-brand-accent/10">
                  <Mail className="h-4 w-4" />
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">E-mail Comercial</p>
                  <p className="text-sm font-medium text-neutral-300 group-hover:text-white transition-colors">contato@techify.com.br</p>
                </div>
              </a>

              {/* WhatsApp Contact */}
              <button
                onClick={onOpenConsultation}
                className="flex items-center gap-3 group text-left w-full"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-800 bg-neutral-900/30 text-brand-accent transition-colors group-hover:border-brand-accent/50 group-hover:bg-brand-accent/10">
                  <MessageCircle className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Atendimento Imediato</p>
                  <p className="text-sm font-medium text-neutral-300 group-hover:text-white transition-colors">Suporte via WhatsApp</p>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom copyright note */}
        <div className="mt-16 border-t border-neutral-900 pt-8 text-center text-xs text-neutral-600">
          <p>© 2026 Techify. Todos os direitos reservados. Projeto inovador de alta engenharia visual.</p>
        </div>
      </div>
    </footer>
  );
}
