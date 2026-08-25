import React from 'react';

interface MotionLabSectionProps {
  onNavigate?: (tab: string) => void;
  onOpenConsultation?: (serviceName?: string) => void;
}

export default function MotionLabSection({ onNavigate, onOpenConsultation }: MotionLabSectionProps) {
  return (
    <div className="w-full bg-[#0c0b0b] min-h-[calc(100vh-65px)] flex flex-col">
      {/* Sub-header bar for Motion Lab */}
      <div className="border-b border-neutral-800/80 bg-black/90 px-4 py-2.5 flex items-center justify-between z-10 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#22c55e] animate-pulse"></span>
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-300">
            Techify Motion &bull; Engenharia de Animação, UI/UX Dinâmico &amp; Alta Conversão
          </span>
        </div>
        <div className="flex items-center gap-3">
          {onOpenConsultation && (
            <button
              onClick={() => onOpenConsultation('Techify Motion & Design Interativo')}
              className="text-xs font-semibold text-[#22c55e] hover:text-[#4ade80] transition-colors cursor-pointer"
            >
              Criar Projeto com Techify Motion &rarr;
            </button>
          )}
        </div>
      </div>

      {/* Sandboxed Interactive Viewport */}
      <div className="flex-1 w-full h-[calc(100vh-115px)] min-h-[750px]">
        <iframe
          src="/motion-lab.html"
          title="Motion Principles & Animation Lab"
          className="w-full h-full border-0"
          style={{ width: '100%', height: '100%', minHeight: '800px' }}
        />
      </div>
    </div>
  );
}
