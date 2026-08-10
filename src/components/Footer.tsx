import React from 'react';
import { Mail, MessageCircle, Instagram, Lock } from 'lucide-react';
import { TechifyIcon } from './TechifyLogo';

interface FooterProps {
  onNavigate: (tab: string) => void;
  onOpenConsultation: () => void;
  onOpenAdminLogin?: () => void;
}

export default function Footer({ onNavigate, onOpenConsultation, onOpenAdminLogin }: FooterProps) {
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
                <TechifyIcon className="h-full w-full" color="#2eff00" />
              </div>
              <span className="font-display text-xl font-black tracking-wider text-white">
                TECHIFY
              </span>
            </div>
            
            <p className="text-sm leading-relaxed text-neutral-400 max-w-sm">
              Inovação digital e design de alta performance. Criamos experiências que conectam marcas a resultados de impacto mensurável.
            </p>

            {/* Instagram Button matching requested link */}
            <div>
              <a
                href="https://www.instagram.com/techify.oficial"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-brand-accent/20 bg-brand-accent/5 hover:bg-brand-accent/15 px-4 py-2 text-xs font-bold text-brand-accent transition-all duration-300"
              >
                <Instagram className="h-4 w-4" />
                <span>@techify.oficial</span>
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
                href="mailto:oficialtechify@gmail.com"
                className="flex items-center gap-3 group"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-800 bg-neutral-900/30 text-brand-lime transition-colors group-hover:border-brand-accent/50 group-hover:bg-brand-accent/10">
                  <Mail className="h-4 w-4" />
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">E-mail Comercial</p>
                  <p className="text-sm font-medium text-neutral-300 group-hover:text-white transition-colors">oficialtechify@gmail.com</p>
                </div>
              </a>

              {/* WhatsApp Contact */}
              <a
                href="https://wa.me/5581995498590"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 group text-left w-full cursor-pointer"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-800 bg-neutral-900/30 text-[#2eff00] transition-colors group-hover:border-[#2eff00]/50 group-hover:bg-[#2eff00]/10">
                  <MessageCircle className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Atendimento Imediato</p>
                  <p className="text-sm font-medium text-neutral-300 group-hover:text-[#2eff00] transition-colors">Suporte via WhatsApp</p>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom copyright note */}
        <div className="mt-16 border-t border-neutral-900 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-600">
          <p>© 2026 Techify. Todos os direitos reservados. Projeto inovador de alta engenharia visual.</p>
          
          {onOpenAdminLogin && (
            <button
              onClick={onOpenAdminLogin}
              className="flex items-center gap-1 text-neutral-600 hover:text-[#2eff00] transition-colors cursor-pointer text-[11px]"
              title="Área do Administrador"
            >
              <Lock className="h-3 w-3" />
              <span>Área Restrita</span>
            </button>
          )}
        </div>
      </div>
    </footer>
  );
}
