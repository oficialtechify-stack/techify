import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useSpring, useMotionValue, useTransform } from 'motion/react';
import { 
  Volume2, 
  VolumeX, 
  Sparkles, 
  ArrowRight, 
  Play, 
  RotateCcw, 
  Layers, 
  Zap, 
  Maximize2, 
  Sliders, 
  Eye, 
  CheckCircle2, 
  Compass, 
  Code2, 
  Cpu, 
  ExternalLink,
  MessageSquare,
  ChevronDown,
  Info,
  MousePointer,
  Move,
  Activity,
  Box,
  Share2
} from 'lucide-react';
import { soundFX } from '../lib/soundFx';
import { TechifyIcon } from './TechifyLogo';

interface AcademySectionProps {
  onNavigate?: (tab: string) => void;
  onOpenConsultation?: (serviceName?: string) => void;
}

// 8 Core Principles of Motion Design adapted for Techify Engineering
const PRINCIPLES = [
  {
    id: 'easing',
    number: '01',
    title: 'THE BASICS OF EASING',
    subtitle: 'Aceleração natural e inércia física',
    color: '#E8E2F8',
    textColor: '#2E1065',
    accentColor: '#8B5CF6',
    description: 'No mundo físico, nenhum objeto se move em velocidade constante instantânea. Usamos curvas Bezier e Springs para criar interfaces que parecem vivas e reagem à intenção humana.',
    techifyContext: 'Na Techify, 90% dos nossos modais e drawers usam Ease-Out cúbico (0.16, 1, 0.3, 1), entregando resposta visual em 12ms sem causar fadiga ocular.'
  },
  {
    id: 'offset',
    number: '02',
    title: 'OFFSET & DELAY (STAGGER)',
    subtitle: 'Cascata de atenção e ordem de leitura',
    color: '#DDF2FE',
    textColor: '#082F49',
    accentColor: '#0284C7',
    description: 'Quando múltiplos elementos aparecem ao mesmo tempo, o cérebro humano congela. O atraso sequencial (stagger) conduz o olhar do visitante diretamente para a chamada de ação.',
    techifyContext: 'Aplicamos delays de 40ms a 70ms em listas, dashboards e tabelas de métricas para guiar a absorção de dados sem sobrecarga cognitiva.'
  },
  {
    id: 'fade',
    number: '03',
    title: 'FADE-IN & FADE-OUT',
    subtitle: 'Transições suaves de opacidade e presença',
    color: '#D4F6E8',
    textColor: '#064E3B',
    accentColor: '#10B981',
    description: 'A mudança brusca de visibilidade quebra a imersão. Combinamos interpolação de alfa com leve escala vertical para criar uma sensação de emergência limpa.',
    techifyContext: 'Nossos overlays e popovers combinam `opacity: 0 -> 1` com `scale: 0.98 -> 1` para criar solidez estrutural sem pop-in incômodo.'
  },
  {
    id: 'morph',
    number: '04',
    title: 'TRANSFORM & MORPH',
    subtitle: 'Continuidade de estado e metamorfose de UI',
    color: '#FEF4D5',
    textColor: '#78350F',
    accentColor: '#F59E0B',
    description: 'Em vez de destruir um botão e renderizar um formulário, transformamos o botão no próprio formulário. Isso preserva a âncora espacial na mente do usuário.',
    techifyContext: 'Utilizamos Shared Layout Transitions em botões de "Comprar" e "Diagnóstico", expandindo o botão no container final em 220ms fluidos.'
  },
  {
    id: 'masking',
    number: '05',
    title: 'MASKING & CLIPPING',
    subtitle: 'Revelação por portais e cortes de visão',
    color: '#FFE8DF',
    textColor: '#7C2D12',
    accentColor: '#EA580C',
    description: 'A técnica de máscara oculta ou revela conteúdo através de limites geométricos em movimento, criando revelações cinematográficas de mockups e produtos.',
    techifyContext: 'Usado em nossos showcases de projetos (Wandr, ASME) para revelar a arquitetura de código por baixo do design final.'
  },
  {
    id: 'dimension',
    number: '06',
    title: 'DIMENSIONALITY & 3D TILT',
    subtitle: 'Profundidade espacial e camadas Z-Index',
    color: '#FCE7F3',
    textColor: '#831843',
    accentColor: '#EC4899',
    description: 'Superfícies planas ganham tangibilidade quando reagem à posição do cursor com inclinação giroscópica e reflexo especular de luz holográfica.',
    techifyContext: 'Nossos cards premium possuem física tridimensional em tempo real, calculando sombras dinâmicas que seguem a posição exata do mouse.'
  },
  {
    id: 'parallax',
    number: '07',
    title: 'PARALLAX & KINETIC SCROLL',
    subtitle: 'Velocidades diferenciais em planos visuais',
    color: '#E0E7FF',
    textColor: '#1E1B4B',
    accentColor: '#6366F1',
    description: 'Elementos de fundo movem-se mais devagar que o conteúdo em primeiro plano, criando a ilusão de espaço tridimensional profundo durante a navegação.',
    techifyContext: 'Implementamos parallax com aceleração de hardware (GPU compositing via `transform: translate3d`) garantindo 60-120 FPS cravados em mobile e desktop.'
  },
  {
    id: 'zoom',
    number: '08',
    title: 'CONTINUOUS ZOOM & FOCUS',
    subtitle: 'Mergulho contextual sem perda de referência',
    color: '#CCFBF1',
    textColor: '#134E4A',
    accentColor: '#14B8A6',
    description: 'Em vez de trocar de página bruscamente, a câmera se aproxima do detalhe selecionado, mantendo a sensação de que tudo reside em um universo unificado.',
    techifyContext: 'Aplicado no Mindloop Hub e ToonHub para navegar de mapas globais até dados atômicos de clientes sem recarregar a tela.'
  }
];

export default function AcademySection({ onNavigate, onOpenConsultation }: AcademySectionProps) {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [activePrinciple, setActivePrinciple] = useState(0);
  
  // Interactive Eye Mascot State
  const [eyePos, setEyePos] = useState({ x: 0, y: 0 });
  const mascotRef = useRef<HTMLDivElement>(null);

  // Easing Playground State
  const [selectedCurve, setSelectedCurve] = useState<'linear' | 'easeIn' | 'easeOut' | 'easeInOut' | 'spring' | 'bounce'>('easeOut');
  const [easingDuration, setEasingDuration] = useState(1.2);
  const [isPlayingEasing, setIsPlayingEasing] = useState(false);

  // Stagger Playground State
  const [staggerMode, setStaggerMode] = useState<'stagger' | 'simultaneous'>('stagger');
  const [staggerKey, setStaggerKey] = useState(0);

  // Morph Playground State
  const [morphExpanded, setMorphExpanded] = useState(false);

  // Masking Playground State
  const [maskProgress, setMaskProgress] = useState(50);

  // Real-time vs Non-Real-time Playground
  const [realtimeDragPos, setRealtimeDragPos] = useState(50);
  const [nonRealtimePos, setNonRealtimePos] = useState(50);

  // 3D Tilt Card Motion Values
  const cardRotateX = useMotionValue(0);
  const cardRotateY = useMotionValue(0);
  const springRotateX = useSpring(cardRotateX, { stiffness: 300, damping: 25 });
  const springRotateY = useSpring(cardRotateY, { stiffness: 300, damping: 25 });

  // Sound sync
  useEffect(() => {
    soundFX.enabled = soundEnabled;
  }, [soundEnabled]);

  // Track cursor for the interactive Eyes Mascot
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!mascotRef.current) return;
      const rect = mascotRef.current.getBoundingClientRect();
      const mascotCenterX = rect.left + rect.width / 2;
      const mascotCenterY = rect.top + rect.height / 2;

      const angle = Math.atan2(e.clientY - mascotCenterY, e.clientX - mascotCenterX);
      const distance = Math.min(6, Math.hypot(e.clientX - mascotCenterX, e.clientY - mascotCenterY) / 40);

      setEyePos({
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleSoundToggle = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundFX.enabled = next;
    if (next) soundFX.playChime(640);
  };

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    cardRotateX.set(-y / 7);
    cardRotateY.set(x / 7);
  };

  const handleCardMouseLeave = () => {
    cardRotateX.set(0);
    cardRotateY.set(0);
  };

  const triggerEasingPlay = () => {
    setIsPlayingEasing(true);
    soundFX.playCurveSound(selectedCurve);
    setTimeout(() => {
      setIsPlayingEasing(false);
    }, (easingDuration + 0.3) * 1000);
  };

  // Easing curve configurations for Framer Motion
  const easingTransitions: Record<string, any> = {
    linear: { duration: easingDuration, ease: 'linear' },
    easeIn: { duration: easingDuration, ease: [0.42, 0, 1, 1] },
    easeOut: { duration: easingDuration, ease: [0, 0, 0.58, 1] },
    easeInOut: { duration: easingDuration, ease: [0.42, 0, 0.58, 1] },
    spring: { duration: easingDuration, type: 'spring', stiffness: 260, damping: 14 },
    bounce: { duration: easingDuration, ease: [0.68, -0.6, 0.32, 1.6] }
  };

  return (
    <div className="relative w-full min-h-screen bg-[#070708] text-white selection:bg-[#22c55e]/30 selection:text-white pb-32">
      
      {/* Top Floating Control Bar (Inspired by Zajno Motion top nav with sound & chapter jump) */}
      <div className="sticky top-[60px] z-30 w-full border-b border-neutral-800/80 bg-[#0c0c0e]/90 backdrop-blur-md px-4 py-2.5">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          
          {/* Brand & Mascot pill */}
          <div className="flex items-center gap-3">
            <div 
              ref={mascotRef}
              className="flex h-9 w-12 items-center justify-center gap-1.5 rounded-full border border-neutral-700 bg-neutral-900 px-2 shadow-inner"
              title="Mascote Interativo Techify"
            >
              {/* Left Eye */}
              <div className="relative h-4 w-3 rounded-full bg-white flex items-center justify-center overflow-hidden">
                <div 
                  className="h-2 w-2 rounded-full bg-neutral-950 transition-transform duration-75"
                  style={{ transform: `translate(${eyePos.x}px, ${eyePos.y}px)` }}
                />
              </div>
              {/* Right Eye */}
              <div className="relative h-4 w-3 rounded-full bg-white flex items-center justify-center overflow-hidden">
                <div 
                  className="h-2 w-2 rounded-full bg-neutral-950 transition-transform duration-75"
                  style={{ transform: `translate(${eyePos.x}px, ${eyePos.y}px)` }}
                />
              </div>
            </div>

            <div className="hidden sm:block">
              <span className="text-xs font-black tracking-wider text-neutral-300 uppercase">
                Techify <span className="text-[#4ade80]">Motion Lab</span>
              </span>
              <span className="ml-2 text-[10px] font-bold text-neutral-500">
                Guia Interativo de Motion & UX
              </span>
            </div>
          </div>

          {/* Quick Chapter Navigation Pills */}
          <div className="hidden md:flex items-center gap-1.5 overflow-x-auto py-1">
            {PRINCIPLES.map((p, idx) => (
              <button
                key={p.id}
                onClick={() => {
                  setActivePrinciple(idx);
                  soundFX.playPop(400 + idx * 40);
                  const el = document.getElementById(`principle-${p.id}`);
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold tracking-tight transition-all cursor-pointer ${
                  activePrinciple === idx
                    ? 'bg-[#22c55e] text-black shadow-[0_0_12px_rgba(34,197,94,0.3)]'
                    : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800'
                }`}
              >
                {p.number}. {p.title.split(' ')[0]}
              </button>
            ))}
          </div>

          {/* Sound Toggle Button with Wave Bars */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleSoundToggle}
              className={`flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                soundEnabled 
                  ? 'border-[#22c55e]/50 bg-[#051c05] text-[#4ade80] shadow-[0_0_15px_rgba(34,197,94,0.2)]'
                  : 'border-neutral-800 bg-neutral-900/80 text-neutral-400 hover:text-neutral-200'
              }`}
              title={soundEnabled ? 'Desativar efeitos sonoros' : 'Ativar sintetizador de som'}
            >
              {soundEnabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
              <span>{soundEnabled ? 'SOM: ON' : 'SOM: OFF'}</span>
              {soundEnabled && (
                <div className="flex items-end gap-0.5 h-3 ml-0.5">
                  <span className="w-0.5 h-2 bg-[#4ade80] animate-pulse" />
                  <span className="w-0.5 h-3 bg-[#4ade80] animate-pulse delay-75" />
                  <span className="w-0.5 h-1.5 bg-[#4ade80] animate-pulse delay-150" />
                </div>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Hero Section with Editorial Zajno Motion Aesthetic */}
      <section className="relative w-full pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        
        {/* Background glow and subtle vector dots */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-[#22c55e]/15 to-transparent blur-[140px] pointer-events-none" />

        <div className="text-center max-w-4xl mx-auto">
          
          {/* Editorial Top Badge with sparkle */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full border border-neutral-700 bg-neutral-900/90 px-4 py-1.5 text-xs font-bold text-neutral-300 shadow-sm mb-6"
          >
            <Sparkles className="h-3.5 w-3.5 text-[#22c55e]" />
            <span>ENGENHARIA VISUAL & MOTION DESIGN</span>
            <span className="text-neutral-600">•</span>
            <span className="text-[#4ade80]">PRINCÍPIOS TECHIFY</span>
          </motion.div>

          {/* Headline inspired by Zajno's bold typography */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white uppercase leading-[1.05]"
          >
            A CIÊNCIA DO <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4ade80] via-[#a3e635] to-[#22c55e]">MOVIMENTO</span> NA WEB
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-base sm:text-xl text-neutral-400 font-medium leading-relaxed max-w-2xl mx-auto"
          >
            Animação em interfaces não é enfeite cosmético. É a forma mais rápida de guiar a atenção do usuário, reduzir o tempo percebido de carregamento e transformar visitantes em clientes fiéis.
          </motion.p>

          {/* Quick Action Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
          >
            <button
              onClick={() => {
                soundFX.playWhoosh();
                const el = document.getElementById('principle-easing');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex items-center gap-2 rounded-xl bg-[#22c55e] px-5 py-3 text-sm font-black text-black shadow-[0_0_20px_rgba(34,197,94,0.35)] hover:bg-[#16a34a] hover:scale-[1.02] transition-all cursor-pointer"
            >
              <span>EXPERIMENTAR PRINCÍPIOS AO VIVO</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              onClick={() => {
                soundFX.playPop(520);
                if (onOpenConsultation) {
                  onOpenConsultation('Motion Design & UI Engineering');
                } else if (onNavigate) {
                  onNavigate('inicio');
                }
              }}
              className="flex items-center gap-2 rounded-xl border border-neutral-800 bg-neutral-900/80 px-5 py-3 text-sm font-bold text-neutral-200 hover:border-neutral-700 hover:bg-neutral-800 hover:text-white transition-all cursor-pointer"
            >
              <MessageSquare className="h-4 w-4 text-[#4ade80]" />
              <span>APLICAR NO MEU PROJETO</span>
            </button>
          </motion.div>
        </div>

        {/* Dynamic Traversing Path with Glowing Spheres */}
        <div className="relative mt-16 w-full max-w-4xl mx-auto h-24 flex items-center justify-center">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 800 80" fill="none">
            <path 
              d="M 10 40 Q 200 10, 400 40 T 790 40" 
              stroke="#262626" 
              strokeWidth="2" 
              strokeDasharray="6 6" 
            />
            <motion.path 
              d="M 10 40 Q 200 10, 400 40 T 790 40" 
              stroke="#22c55e" 
              strokeWidth="3" 
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />
          </svg>
          
          {/* Animated node pills along the track */}
          <div className="absolute inset-0 flex items-center justify-between px-6">
            {['Percepção Física', 'Retenção Visual', 'Clareza de Ação', 'Alta Conversão'].map((label, i) => (
              <motion.div 
                key={label}
                whileHover={{ scale: 1.1 }}
                onMouseEnter={() => soundFX.playBlip(350 + i * 80)}
                className="flex items-center gap-1.5 rounded-full border border-neutral-800 bg-[#0f0f12] px-3 py-1 text-[11px] font-bold text-neutral-300 shadow-md cursor-default select-none"
              >
                <div className="h-2 w-2 rounded-full bg-[#22c55e] animate-ping" />
                <span>{label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* INTERACTIVE COMPARISON: Real-Time vs Non-Real-Time (Direct homage to Zajno's iconic demo) */}
      <section className="relative w-full py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="rounded-3xl border border-neutral-800 bg-neutral-900/50 p-6 sm:p-10 backdrop-blur-md">
          
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="rounded-full bg-[#22c55e]/10 border border-[#22c55e]/30 px-3 py-1 text-[11px] font-extrabold text-[#4ade80] uppercase">
              LAB DE FÍSICA INTERATIVA
            </span>
            <h2 className="mt-3 font-display text-2xl sm:text-3xl font-black text-white">
              REAL-TIME VS. NON-REAL-TIME
            </h2>
            <p className="mt-2 text-sm text-neutral-400">
              Arraste o slider abaixo para sentir na ponta dos dedos como a interpolação contínua (com inércia e amortecimento) transmite qualidade contra movimentos rígidos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Box 1: Non-Real-time (Rigid, stepped, laggy) */}
            <div className="rounded-2xl border border-neutral-800 bg-black/60 p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-black text-red-400 uppercase tracking-wide">
                    ❌ SEM FÍSICA (RÍGIDO / DISCRETO)
                  </span>
                  <span className="text-[10px] font-mono text-neutral-500">Saltos abruptos</span>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed mb-6">
                  Elemento salta imediatamente para posições fixas, ignorando aceleração e desaceleração. A sensação para o cérebro é de lentidão ou quebra.
                </p>
              </div>

              {/* Playground Track */}
              <div className="relative h-20 w-full rounded-xl bg-neutral-950 border border-neutral-900 overflow-hidden flex items-center px-4">
                <div 
                  className="h-10 w-10 rounded-lg bg-red-500/80 border border-red-400 flex items-center justify-center font-mono font-bold text-xs text-white shadow-lg transition-none"
                  style={{ marginLeft: `${Math.floor(nonRealtimePos / 25) * 23}%` }}
                >
                  ERR
                </div>
              </div>

              <div className="mt-4 flex items-center gap-3">
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={nonRealtimePos} 
                  onChange={(e) => {
                    setNonRealtimePos(Number(e.target.value));
                    soundFX.playPop(200);
                  }}
                  className="w-full accent-red-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Box 2: Real-time (Fluid, elastic, spring) */}
            <div className="rounded-2xl border border-[#22c55e]/30 bg-[#041407]/60 p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-black text-[#4ade80] uppercase tracking-wide">
                    ✓ ENGENHARIA TECHIFY (INÉRCIA 60 FPS)
                  </span>
                  <span className="text-[10px] font-mono text-[#4ade80]">Spring Física</span>
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed mb-6">
                  Calculado via vetor de velocidade com amortecimento elástico natural. A interface responde como um objeto físico de alta precisão.
                </p>
              </div>

              {/* Playground Track */}
              <div className="relative h-20 w-full rounded-xl bg-neutral-950 border border-[#22c55e]/30 overflow-hidden flex items-center px-4">
                <motion.div 
                  animate={{ x: (realtimeDragPos / 100) * 220 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 20 }}
                  className="h-10 w-10 rounded-lg bg-[#22c55e] border border-white/40 flex items-center justify-center font-bold text-xs text-black shadow-[0_0_15px_#22c55e]"
                >
                  <TechifyIcon className="h-6 w-6 text-black" />
                </motion.div>
              </div>

              <div className="mt-4 flex items-center gap-3">
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={realtimeDragPos} 
                  onChange={(e) => {
                    setRealtimeDragPos(Number(e.target.value));
                    soundFX.playBlip(480 + (Number(e.target.value) * 3));
                  }}
                  className="w-full accent-[#22c55e] cursor-pointer"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 8 INTERACTIVE PRINCIPLES SECTIONS */}
      <section className="relative w-full py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-20">
        
        {/* ========================================================================= */}
        {/* PRINCIPLE 01: THE BASICS OF EASING */}
        {/* ========================================================================= */}
        <div id="principle-easing" className="scroll-mt-28">
          <div className="rounded-3xl border border-neutral-800 bg-[#0f0f13] overflow-hidden shadow-2xl">
            
            {/* Header Ribbon in Zajno pastel palette */}
            <div 
              className="p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800"
              style={{ backgroundColor: PRINCIPLES[0].color, color: PRINCIPLES[0].textColor }}
            >
              <div>
                <span className="text-xs font-black tracking-widest uppercase opacity-80">
                  PRINCÍPIO {PRINCIPLES[0].number}
                </span>
                <h3 className="font-display text-2xl sm:text-4xl font-black tracking-tight">
                  {PRINCIPLES[0].title}
                </h3>
                <p className="mt-1 text-sm font-semibold opacity-90">
                  {PRINCIPLES[0].subtitle}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="rounded-full bg-black/15 px-3 py-1 text-xs font-bold">
                  Curvas de Aceleração
                </span>
              </div>
            </div>

            {/* Content & Interactive Playground */}
            <div className="p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              <div className="lg:col-span-5 space-y-4">
                <p className="text-neutral-300 text-sm leading-relaxed font-normal">
                  {PRINCIPLES[0].description}
                </p>

                <div className="rounded-2xl border border-neutral-800 bg-black/50 p-4">
                  <div className="flex items-center gap-2 text-xs font-black text-[#4ade80] mb-2">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>APLICAÇÃO TECHIFY</span>
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    {PRINCIPLES[0].techifyContext}
                  </p>
                </div>

                {/* Curve Selector Buttons */}
                <div className="pt-2">
                  <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block mb-2">
                    Escolha a curva para testar:
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'linear', label: 'Linear', desc: 'Sem inércia' },
                      { id: 'easeIn', label: 'Ease In', desc: 'Acelera' },
                      { id: 'easeOut', label: 'Ease Out', desc: 'Desacelera' },
                      { id: 'easeInOut', label: 'Ease In-Out', desc: 'Suave' },
                      { id: 'spring', label: 'Spring', desc: 'Elástico' },
                      { id: 'bounce', label: 'Bounce', desc: 'Impacto' }
                    ].map((curve) => (
                      <button
                        key={curve.id}
                        onClick={() => {
                          setSelectedCurve(curve.id as any);
                          soundFX.playCurveSound(curve.id);
                        }}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                          selectedCurve === curve.id
                            ? 'border-[#22c55e] bg-[#051c05] text-[#4ade80] shadow-[0_0_10px_rgba(34,197,94,0.2)]'
                            : 'border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:text-white hover:bg-neutral-800'
                        }`}
                      >
                        <div className="text-xs font-extrabold">{curve.label}</div>
                        <div className="text-[10px] opacity-60">{curve.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Interactive Curve Visualizer Canvas / Simulation Box */}
              <div className="lg:col-span-7 flex flex-col justify-between rounded-2xl border border-neutral-800 bg-neutral-950 p-6">
                
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-bold text-neutral-400">
                      TRACK: [0px ➔ 340px] | CURVA: {selectedCurve.toUpperCase()}
                    </span>
                    <button
                      onClick={triggerEasingPlay}
                      disabled={isPlayingEasing}
                      className="flex items-center gap-1.5 rounded-lg bg-[#22c55e] px-3 py-1.5 text-xs font-black text-black hover:bg-[#16a34a] transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <Play className="h-3 w-3 fill-black" />
                      <span>{isPlayingEasing ? 'EXECUTANDO...' : 'TESTAR DISPARO'}</span>
                    </button>
                  </div>

                  {/* Animated Track */}
                  <div className="relative h-24 w-full rounded-xl bg-neutral-900/90 border border-neutral-800 flex items-center px-4 overflow-hidden">
                    {/* Background grid lines */}
                    <div className="absolute inset-0 grid grid-cols-6 pointer-events-none opacity-10">
                      {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="border-r border-white" />)}
                    </div>

                    <motion.div
                      key={`${selectedCurve}-${isPlayingEasing}`}
                      animate={isPlayingEasing ? { x: [0, 280, 0] } : { x: 0 }}
                      transition={easingTransitions[selectedCurve]}
                      className="h-12 w-12 rounded-xl bg-gradient-to-tr from-[#22c55e] to-[#a3e635] border border-white/40 flex items-center justify-center shadow-[0_0_20px_#22c55e] z-10"
                    >
                      <Zap className="h-6 w-6 text-black" />
                    </motion.div>
                  </div>
                </div>

                {/* Duration Slider */}
                <div className="mt-6 pt-4 border-t border-neutral-900 flex items-center justify-between gap-4">
                  <span className="text-xs text-neutral-400 font-medium">
                    Duração da animação: <strong className="text-white">{easingDuration}s</strong>
                  </span>
                  <input
                    type="range"
                    min="0.4"
                    max="2.5"
                    step="0.1"
                    value={easingDuration}
                    onChange={(e) => {
                      setEasingDuration(Number(e.target.value));
                      soundFX.playBlip(300 + Number(e.target.value) * 100);
                    }}
                    className="w-48 accent-[#22c55e] cursor-pointer"
                  />
                </div>

              </div>

            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* PRINCIPLE 02: OFFSET & DELAY (STAGGER) */}
        {/* ========================================================================= */}
        <div id="principle-offset" className="scroll-mt-28">
          <div className="rounded-3xl border border-neutral-800 bg-[#0f0f13] overflow-hidden shadow-2xl">
            
            <div 
              className="p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800"
              style={{ backgroundColor: PRINCIPLES[1].color, color: PRINCIPLES[1].textColor }}
            >
              <div>
                <span className="text-xs font-black tracking-widest uppercase opacity-80">
                  PRINCÍPIO {PRINCIPLES[1].number}
                </span>
                <h3 className="font-display text-2xl sm:text-4xl font-black tracking-tight">
                  {PRINCIPLES[1].title}
                </h3>
                <p className="mt-1 text-sm font-semibold opacity-90">
                  {PRINCIPLES[1].subtitle}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="rounded-full bg-black/15 px-3 py-1 text-xs font-bold">
                  Cascata Temporal
                </span>
              </div>
            </div>

            <div className="p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-5 space-y-4">
                <p className="text-neutral-300 text-sm leading-relaxed">
                  {PRINCIPLES[1].description}
                </p>
                <div className="rounded-2xl border border-neutral-800 bg-black/50 p-4">
                  <div className="flex items-center gap-2 text-xs font-black text-[#38bdf8] mb-2">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>APLICAÇÃO TECHIFY</span>
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    {PRINCIPLES[1].techifyContext}
                  </p>
                </div>

                {/* Stagger Toggle Controller */}
                <div className="pt-3 flex gap-2">
                  <button
                    onClick={() => {
                      setStaggerMode('stagger');
                      setStaggerKey(prev => prev + 1);
                      soundFX.playPop(520);
                    }}
                    className={`flex-1 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      staggerMode === 'stagger'
                        ? 'border-[#0284C7] bg-[#082F49] text-[#38bdf8]'
                        : 'border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white'
                    }`}
                  >
                    ✓ Cascata Stagger (60ms)
                  </button>

                  <button
                    onClick={() => {
                      setStaggerMode('simultaneous');
                      setStaggerKey(prev => prev + 1);
                      soundFX.playPop(300);
                    }}
                    className={`flex-1 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      staggerMode === 'simultaneous'
                        ? 'border-red-500 bg-red-950/40 text-red-400'
                        : 'border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white'
                    }`}
                  >
                    ❌ Tudo de Uma Vez (0ms)
                  </button>
                </div>
              </div>

              {/* Interactive Stagger Canvas */}
              <div className="lg:col-span-7 rounded-2xl border border-neutral-800 bg-neutral-950 p-6 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono text-neutral-400">
                    MODO: {staggerMode === 'stagger' ? 'STAGGER EM CASCATA' : 'SIMULTÂNEO BRUSCO'}
                  </span>
                  <button
                    onClick={() => {
                      setStaggerKey(prev => prev + 1);
                      soundFX.playWhoosh();
                    }}
                    className="flex items-center gap-1.5 text-xs text-[#38bdf8] hover:underline cursor-pointer"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>Re-executar entrada</span>
                  </button>
                </div>

                <div key={staggerKey} className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-auto">
                  {['Faturamento', 'Conversão', 'Latência API', 'Usuários Ativos', 'Ticket Médio', 'Retenção'].map((metric, idx) => (
                    <motion.div
                      key={metric}
                      initial={{ opacity: 0, y: 25, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{
                        duration: 0.45,
                        delay: staggerMode === 'stagger' ? idx * 0.08 : 0,
                        ease: [0.16, 1, 0.3, 1]
                      }}
                      onMouseEnter={() => soundFX.playBlip(300 + idx * 70)}
                      className="rounded-xl border border-neutral-800 bg-neutral-900/90 p-3.5 hover:border-[#0284C7] transition-colors"
                    >
                      <span className="text-[10px] font-mono text-neutral-500 uppercase block mb-1">
                        Métrica 0{idx + 1}
                      </span>
                      <div className="text-xs font-bold text-white mb-2">{metric}</div>
                      <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${(idx + 2) * 15}%` }}
                          transition={{ duration: 0.6, delay: staggerMode === 'stagger' ? idx * 0.08 + 0.2 : 0.2 }}
                          className="h-full bg-sky-400"
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ========================================================================= */}
        {/* PRINCIPLE 04: TRANSFORM & MORPH (SHAPESHIFTING) */}
        {/* ========================================================================= */}
        <div id="principle-morph" className="scroll-mt-28">
          <div className="rounded-3xl border border-neutral-800 bg-[#0f0f13] overflow-hidden shadow-2xl">
            
            <div 
              className="p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800"
              style={{ backgroundColor: PRINCIPLES[3].color, color: PRINCIPLES[3].textColor }}
            >
              <div>
                <span className="text-xs font-black tracking-widest uppercase opacity-80">
                  PRINCÍPIO {PRINCIPLES[3].number}
                </span>
                <h3 className="font-display text-2xl sm:text-4xl font-black tracking-tight">
                  {PRINCIPLES[3].title}
                </h3>
                <p className="mt-1 text-sm font-semibold opacity-90">
                  {PRINCIPLES[3].subtitle}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="rounded-full bg-black/15 px-3 py-1 text-xs font-bold">
                  Metamorfose de UI
                </span>
              </div>
            </div>

            <div className="p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-5 space-y-4">
                <p className="text-neutral-300 text-sm leading-relaxed">
                  {PRINCIPLES[3].description}
                </p>
                <div className="rounded-2xl border border-neutral-800 bg-black/50 p-4">
                  <div className="flex items-center gap-2 text-xs font-black text-amber-400 mb-2">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>APLICAÇÃO TECHIFY</span>
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    {PRINCIPLES[3].techifyContext}
                  </p>
                </div>
              </div>

              {/* Interactive Morphing Element */}
              <div className="lg:col-span-7 rounded-2xl border border-neutral-800 bg-neutral-950 p-6 flex flex-col items-center justify-center min-h-[260px]">
                
                <span className="text-xs font-mono text-neutral-500 mb-6">
                  Clique no elemento abaixo para testar a metamorfose:
                </span>

                <motion.div
                  layout
                  onClick={() => {
                    setMorphExpanded(!morphExpanded);
                    soundFX.playPop(morphExpanded ? 320 : 640);
                  }}
                  className={`cursor-pointer overflow-hidden transition-colors ${
                    morphExpanded
                      ? 'w-full max-w-sm rounded-2xl border border-amber-500/40 bg-[#1e1505] p-5 shadow-[0_0_30px_rgba(245,158,11,0.2)]'
                      : 'w-48 rounded-full border border-amber-500/60 bg-amber-500 px-5 py-3 text-center shadow-[0_0_20px_rgba(245,158,11,0.4)]'
                  }`}
                  transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                >
                  {!morphExpanded ? (
                    <motion.div layout className="flex items-center justify-center gap-2 text-xs font-black text-black">
                      <Zap className="h-4 w-4" />
                      <span>SOLICITAR PROPOSTA</span>
                    </motion.div>
                  ) : (
                    <motion.div layout className="space-y-3">
                      <div className="flex items-center justify-between border-b border-amber-500/20 pb-2">
                        <span className="text-xs font-bold text-amber-300">Diagnóstico Techify</span>
                        <span className="text-[10px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full font-bold">12h</span>
                      </div>
                      <p className="text-xs text-neutral-300">
                        O botão se expandiu organicamente no formulário de contato sem saltos de layout.
                      </p>
                      <div className="flex items-center justify-end gap-2 pt-2">
                        <span className="text-[10px] text-amber-400/80 hover:underline">Fechar</span>
                      </div>
                    </motion.div>
                  )}
                </motion.div>

              </div>
            </div>

          </div>
        </div>

        {/* ========================================================================= */}
        {/* PRINCIPLE 06: DIMENSIONALITY & 3D TILT */}
        {/* ========================================================================= */}
        <div id="principle-dimension" className="scroll-mt-28">
          <div className="rounded-3xl border border-neutral-800 bg-[#0f0f13] overflow-hidden shadow-2xl">
            
            <div 
              className="p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800"
              style={{ backgroundColor: PRINCIPLES[5].color, color: PRINCIPLES[5].textColor }}
            >
              <div>
                <span className="text-xs font-black tracking-widest uppercase opacity-80">
                  PRINCÍPIO {PRINCIPLES[5].number}
                </span>
                <h3 className="font-display text-2xl sm:text-4xl font-black tracking-tight">
                  {PRINCIPLES[5].title}
                </h3>
                <p className="mt-1 text-sm font-semibold opacity-90">
                  {PRINCIPLES[5].subtitle}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="rounded-full bg-black/15 px-3 py-1 text-xs font-bold">
                  Giroscópio & Luz 3D
                </span>
              </div>
            </div>

            <div className="p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-5 space-y-4">
                <p className="text-neutral-300 text-sm leading-relaxed">
                  {PRINCIPLES[5].description}
                </p>
                <div className="rounded-2xl border border-neutral-800 bg-black/50 p-4">
                  <div className="flex items-center gap-2 text-xs font-black text-pink-400 mb-2">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>APLICAÇÃO TECHIFY</span>
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    {PRINCIPLES[5].techifyContext}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs text-neutral-400 pt-2">
                  <MousePointer className="h-4 w-4 text-pink-400 animate-bounce" />
                  <span>Passe o cursor sobre o card ao lado para testar a profundidade Z.</span>
                </div>
              </div>

              {/* Interactive 3D Holographic Card */}
              <div 
                className="lg:col-span-7 flex items-center justify-center p-6 rounded-2xl border border-neutral-800 bg-neutral-950"
                style={{ perspective: 1000 }}
              >
                <motion.div
                  onMouseMove={handleCardMouseMove}
                  onMouseLeave={handleCardMouseLeave}
                  style={{
                    rotateX: springRotateX,
                    rotateY: springRotateY,
                    transformStyle: 'preserve-3d'
                  }}
                  className="relative w-full max-w-sm h-64 rounded-2xl border border-pink-500/30 bg-gradient-to-br from-[#1b0a14] via-[#0e040a] to-[#250d1c] p-6 shadow-[0_20px_50px_rgba(236,72,153,0.15)] flex flex-col justify-between cursor-pointer"
                >
                  {/* Holographic light sheen reflection */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />

                  <div style={{ transform: 'translateZ(35px)' }} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TechifyIcon className="h-7 w-7 text-pink-400" />
                      <span className="font-display font-black text-sm tracking-wider text-white">TECHIFY BLACK</span>
                    </div>
                    <span className="rounded-full bg-pink-500/20 border border-pink-500/40 px-2.5 py-0.5 text-[10px] font-bold text-pink-300">
                      3D DEPTH
                    </span>
                  </div>

                  <div style={{ transform: 'translateZ(25px)' }}>
                    <div className="text-xs text-neutral-400 font-mono">ENGENHARIA DEDICADA</div>
                    <div className="text-xl font-black text-white mt-1">Sistemas & Plataformas Digitais</div>
                  </div>

                  <div style={{ transform: 'translateZ(40px)' }} className="flex items-center justify-between border-t border-pink-500/20 pt-3">
                    <span className="text-[11px] font-mono text-pink-300">Zero Latência • 120 FPS</span>
                    <span className="text-xs font-bold text-white flex items-center gap-1">
                      <span>Explorar</span>
                      <ArrowRight className="h-3.5 w-3.5 text-pink-400" />
                    </span>
                  </div>
                </motion.div>
              </div>
            </div>

          </div>
        </div>

        {/* ========================================================================= */}
        {/* PRINCIPLE 05: MASKING & REVEAL */}
        {/* ========================================================================= */}
        <div id="principle-masking" className="scroll-mt-28">
          <div className="rounded-3xl border border-neutral-800 bg-[#0f0f13] overflow-hidden shadow-2xl">
            
            <div 
              className="p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800"
              style={{ backgroundColor: PRINCIPLES[4].color, color: PRINCIPLES[4].textColor }}
            >
              <div>
                <span className="text-xs font-black tracking-widest uppercase opacity-80">
                  PRINCÍPIO {PRINCIPLES[4].number}
                </span>
                <h3 className="font-display text-2xl sm:text-4xl font-black tracking-tight">
                  {PRINCIPLES[4].title}
                </h3>
                <p className="mt-1 text-sm font-semibold opacity-90">
                  {PRINCIPLES[4].subtitle}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="rounded-full bg-black/15 px-3 py-1 text-xs font-bold">
                  Máscara & Split
                </span>
              </div>
            </div>

            <div className="p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-5 space-y-4">
                <p className="text-neutral-300 text-sm leading-relaxed">
                  {PRINCIPLES[4].description}
                </p>
                <div className="rounded-2xl border border-neutral-800 bg-black/50 p-4">
                  <div className="flex items-center gap-2 text-xs font-black text-orange-400 mb-2">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>APLICAÇÃO TECHIFY</span>
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    {PRINCIPLES[4].techifyContext}
                  </p>
                </div>

                <div className="pt-2">
                  <span className="text-xs font-bold text-neutral-400 block mb-2">
                    Posição da cortina de máscara: {maskProgress}%
                  </span>
                  <input
                    type="range"
                    min="5"
                    max="95"
                    value={maskProgress}
                    onChange={(e) => {
                      setMaskProgress(Number(e.target.value));
                      soundFX.playBlip(250 + Number(e.target.value) * 3);
                    }}
                    className="w-full accent-orange-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Mask Split Sandbox */}
              <div className="lg:col-span-7 rounded-2xl border border-neutral-800 bg-neutral-950 p-6 flex flex-col justify-center">
                <div className="relative w-full h-56 rounded-xl overflow-hidden border border-neutral-800">
                  
                  {/* Layer 1: Code / Wireframe layer */}
                  <div className="absolute inset-0 bg-[#0a0f0d] p-5 font-mono text-[11px] text-emerald-400/80 leading-relaxed">
                    <div className="text-neutral-500">// Camada 01: Arquitetura & Tipagem</div>
                    <div>interface TechifyApp &#123;</div>
                    <div className="pl-4">engine: "React 19 + Vite";</div>
                    <div className="pl-4">motionCurves: "Cubic-Bezier(0.16, 1, 0.3, 1)";</div>
                    <div className="pl-4">fpsTarget: 120;</div>
                    <div>&#125;</div>
                    <div className="mt-3 text-neutral-500">// Renderização ultra veloz em GPU composited layers</div>
                  </div>

                  {/* Layer 2: Live UI Layer clipped by maskProgress */}
                  <div 
                    className="absolute inset-0 bg-gradient-to-tr from-orange-950/80 via-neutral-900 to-black p-5 flex flex-col justify-between border-l-2 border-orange-500 shadow-2xl transition-all"
                    style={{ left: `${maskProgress}%` }}
                  >
                    <div>
                      <span className="rounded bg-orange-500/20 text-orange-400 px-2 py-0.5 text-[9px] font-extrabold uppercase">
                        PRODUTO FINAL
                      </span>
                      <div className="font-display font-black text-lg text-white mt-1">Interface Polida</div>
                    </div>
                    <div className="text-xs text-neutral-300">
                      Experiência comercial de alta conversão.
                    </div>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>

      </section>

      {/* FINAL CALL TO ACTION / PRODUCTION INTEGRATION BANNER */}
      <section className="relative w-full py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="rounded-3xl border border-[#22c55e]/40 bg-gradient-to-b from-[#051c05] to-[#08080a] p-8 sm:p-12 text-center relative overflow-hidden shadow-[0_0_60px_rgba(34,197,94,0.15)]">
          
          <div className="relative z-10 max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#22c55e]/40 bg-[#22c55e]/10 px-3.5 py-1 text-xs font-extrabold text-[#4ade80] mb-4">
              <Sparkles className="h-3.5 w-3.5" />
              <span>PRODUÇÃO REAL & RESULTADO COMERCIAL</span>
            </span>

            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
              QUER ESSE NÍVEL DE REFINAMENTO NO SEU PRODUTO?
            </h2>

            <p className="mt-4 text-sm sm:text-base text-neutral-300 leading-relaxed font-normal">
              Transformamos landing pages, web apps e plataformas de gestão com a mesma engenharia de movimento e acabamento visual vista nos maiores estúdios globais.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => {
                  soundFX.playChime(780);
                  if (onOpenConsultation) {
                    onOpenConsultation('Motion Design & High-End Engineering');
                  } else if (onNavigate) {
                    onNavigate('inicio');
                  }
                }}
                className="flex items-center gap-2 rounded-xl bg-[#22c55e] px-6 py-3.5 text-sm font-black text-black shadow-[0_0_25px_rgba(34,197,94,0.4)] hover:bg-[#16a34a] hover:scale-[1.02] transition-all cursor-pointer"
              >
                <span>AGENDAR DIAGNÓSTICO GRATUITO</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                onClick={() => {
                  soundFX.playPop(440);
                  if (onNavigate) onNavigate('portfolio');
                }}
                className="flex items-center gap-2 rounded-xl border border-neutral-800 bg-neutral-900/90 px-6 py-3.5 text-sm font-bold text-neutral-200 hover:text-white hover:bg-neutral-800 transition-all cursor-pointer"
              >
                <span>VER PROJETOS NO PORTFÓLIO</span>
                <ExternalLink className="h-4 w-4 text-neutral-400" />
              </button>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
