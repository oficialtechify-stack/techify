import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  Sparkles, 
  MessageSquare, 
  Maximize2, 
  Layers,
  Zap,
  Smartphone,
  CheckCircle2,
  RefreshCw,
  LayoutGrid
} from 'lucide-react';
import { soundFX } from '../lib/soundFx';

interface MotionLabSectionProps {
  onNavigate?: (tab: string) => void;
  onOpenConsultation?: (serviceName?: string) => void;
}

export const MotionLabSection: React.FC<MotionLabSectionProps> = ({
  onNavigate,
  onOpenConsultation
}) => {
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeKey, setIframeKey] = useState(1);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Parent-child postMessage communication bridge
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (!event.data) return;
      if (event.data.type === 'TECHIFY_OPEN_CONSULTATION') {
        soundFX.playClick();
        onOpenConsultation?.(event.data.service || 'Techify Motion');
      } else if (event.data.type === 'TECHIFY_NAVIGATE') {
        soundFX.playClick();
        onNavigate?.(event.data.tab || 'inicio');
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onNavigate, onOpenConsultation]);

  const handleReload = () => {
    soundFX.playClick();
    setIframeLoaded(false);
    setIframeKey(prev => prev + 1);
  };

  return (
    <div id="techify-motion-lab-container" className="relative w-full min-h-screen bg-[#0c0b0b] text-white flex flex-col overflow-hidden">
      {/* Sleek Floating Quick Navigation Bar */}
      <header className="sticky top-0 z-40 w-full bg-[#0c0b0b]/90 backdrop-blur-md border-b border-white/10 px-4 py-2.5 sm:px-6 flex items-center justify-between transition-all">
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => {
              soundFX.playClick();
              onNavigate?.('inicio');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900/80 hover:bg-neutral-800 border border-white/10 text-neutral-300 hover:text-white text-xs font-semibold transition-all cursor-pointer shadow-sm"
            title="Voltar para a página inicial"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Início</span>
          </button>

          <button
            onClick={() => {
              soundFX.playClick();
              onNavigate?.('apps');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900/80 hover:bg-neutral-800 border border-white/10 text-neutral-300 hover:text-white text-xs font-semibold transition-all cursor-pointer shadow-sm"
            title="Ver todos os aplicativos"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Apps & Ecossistema</span>
          </button>
        </div>

        {/* Center Badge */}
        <div className="flex items-center gap-2 text-xs font-bold text-neutral-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-white font-mono tracking-tight text-[11px] sm:text-xs">
            TECHIFY <span className="text-emerald-400">MOTION LAB</span>
          </span>
        </div>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleReload}
            className="p-1.5 rounded-lg bg-neutral-900/80 hover:bg-neutral-800 border border-white/10 text-neutral-400 hover:text-white text-xs transition-all cursor-pointer"
            title="Recarregar animações"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => {
              soundFX.playSuccess();
              onOpenConsultation?.('Techify Motion Design & Engenharia');
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs transition-all shadow-[0_0_15px_rgba(34,197,94,0.3)] hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-black" />
            <span>Contratar Motion</span>
          </button>
        </div>
      </header>

      {/* Loading Skeleton */}
      {!iframeLoaded && (
        <div className="absolute inset-0 top-[52px] z-20 flex flex-col items-center justify-center bg-[#0c0b0b] text-neutral-400 space-y-4">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 rounded-full border-2 border-emerald-500/20 border-t-emerald-500 animate-spin"></div>
            <div className="absolute inset-3 rounded-full bg-emerald-500/10 animate-ping"></div>
          </div>
          <div className="text-center space-y-1">
            <p className="text-sm font-semibold text-white tracking-wide">Carregando Techify Motion Lab...</p>
            <p className="text-xs text-neutral-500">Renderizando canvas físico, GSAP e 8 capítulos de animação</p>
          </div>
        </div>
      )}

      {/* Full Interactive Frame */}
      <main className="flex-1 w-full relative bg-[#0c0b0b]">
        <iframe
          key={iframeKey}
          ref={iframeRef}
          src="/motion-lab.html"
          title="Techify Motion Lab - Interactive Experience"
          onLoad={() => setIframeLoaded(true)}
          className={`w-full h-[calc(100vh-53px)] sm:h-[calc(100vh-56px)] border-0 transition-opacity duration-500 ${
            iframeLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            display: 'block',
            overflow: 'hidden',
            backgroundColor: '#0c0b0b'
          }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />
      </main>
    </div>
  );
};

export default MotionLabSection;
