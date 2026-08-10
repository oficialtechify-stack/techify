import React, { useState, useRef, useEffect } from 'react';
import { motion, useInView, animate } from 'motion/react';
import { 
  Calendar, 
  ArrowRight, 
  Globe, 
  Palette, 
  Monitor, 
  Zap, 
  Mouse, 
  Sparkles, 
  TrendingUp, 
  Trophy, 
  ShieldCheck, 
  Box, 
  CheckCircle
} from 'lucide-react';
import { Service } from '../types';
import { SERVICES } from '../data';
import AnimatedGradient from './AnimatedGradient';
import { TechifyIcon } from './TechifyLogo';

interface AnimatedCounterProps {
  targetValue: number;
  suffix?: string;
  label: string;
  idx: number;
}

function AnimatedCounter({ targetValue, suffix = '', label, idx }: AnimatedCounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [currentValue, setCurrentValue] = useState(0);

  useEffect(() => {
    if (isInView) {
      const controls = animate(0, targetValue, {
        duration: 2.2,
        ease: [0.16, 1, 0.3, 1],
        onUpdate: (latest) => {
          setCurrentValue(Math.floor(latest));
        },
      });
      return () => controls.stop();
    }
  }, [isInView, targetValue]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay: idx * 0.15 }}
      className="flex flex-col items-center text-center"
    >
      <h3 className="font-display text-5xl font-extrabold text-[#a3e635] text-glow-green sm:text-6xl tracking-tight drop-shadow-[0_0_20px_rgba(163,230,53,0.5)]">
        {currentValue}{suffix}
      </h3>
      <p className="mt-2 text-xs font-semibold tracking-wider text-neutral-400 uppercase">
        {label}
      </p>
    </motion.div>
  );
}

interface HomeSectionProps {
  onNavigate: (tab: string) => void;
  onOpenConsultation: () => void;
}

export default function HomeSection({ onNavigate, onOpenConsultation }: HomeSectionProps) {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [interactive3D, setInteractive3D] = useState(false);
  const [nodes, setNodes] = useState<{ x: number; y: number; s: number }[]>(() => {
    // Generate star coordinates for a premium aesthetic
    return Array.from({ length: 90 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      s: Math.random() * 2 + 1,
    }));
  });

  const premiumFeatures = [
    { label: 'ESTÉTICA FUTURISTA', icon: Zap },
    { label: 'INTERATIVIDADE FLUIDA', icon: Sparkles },
    { label: 'CONVERSÃO EXTREMA', icon: Trophy },
    { label: 'UX DE ALTA PERFORMANCE', icon: ShieldCheck },
  ];

  return (
    <div className="relative w-full overflow-hidden bg-black bg-nebula pb-24">
      {/* Full-screen Dark Hero Section with Animated Gradient background */}
      <div className="relative w-full min-h-screen flex flex-col justify-center items-center overflow-hidden pb-12">
        {/* Animated Gradient Background only in this hero section */}
        <AnimatedGradient 
          config={{
            preset: "custom",
            color1: "#000000",
            color2: "#183808",
            color3: "#030a02",
            rotation: -50,
            proportion: 60,
            scale: 0.15,
            speed: 20,
            distortion: 8,
            swirl: 45,
            swirlIterations: 8,
            softness: 85,
            offset: 0,
            shape: "Checks",
            shapeSize: 35,
          }}
          noise={{ opacity: 0.15 }}
        />
        
        {/* Soft dark vignette overlay to blend with bg & improve contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black z-[1] pointer-events-none" />

        {/* Background Starry Pixels */}
        <div className="absolute inset-0 pointer-events-none opacity-40 z-0">
          {nodes.map((star, idx) => (
            <div
              key={idx}
              className="absolute rounded-full bg-white animate-pulse"
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: `${star.s}px`,
                height: `${star.s}px`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${Math.random() * 4 + 2}s`,
              }}
            />
          ))}
        </div>

        {/* Hero Section Content */}
        <section className="relative mx-auto max-w-7xl px-4 pt-8 text-center sm:px-6 lg:px-8 z-10 w-full flex flex-col items-center">
          
          {/* Circular Techify Logo Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mx-auto mb-6 flex h-28 w-28 sm:h-32 sm:w-32 items-center justify-center rounded-full border-2 border-[#a3e635] bg-black p-2 text-center ring-1 ring-[#a3e635]/20 shadow-md overflow-hidden"
          >
            <TechifyIcon className="h-full w-full rounded-full" />
          </motion.div>

          {/* Digital Innovation Pill Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#a3e635]/40 bg-[#a3e635]/10 px-4 py-1.5 text-xs text-[#a3e635] tracking-wider font-semibold mb-6"
          >
            <Sparkles className="h-3.5 w-3.5 text-[#a3e635]" />
            <span>Inovação Digital</span>
          </motion.div>

          {/* Main Header Title (From Image 1 & 2) */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="font-display text-5xl font-extrabold tracking-tight text-white sm:text-7xl lg:text-8xl leading-none"
          >
            Transforme Seu <br />
            <span className="text-[#a3e635] inline-block hover:scale-[1.01] transition-transform duration-300">
              Negócio Digital
            </span>
          </motion.h1>

          {/* Taglines (From Image 1 & 2) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mx-auto mt-6 max-w-2xl space-y-2 text-center"
          >
            <p className="text-base text-neutral-300 sm:text-lg font-normal">
              Criamos plataformas web e identidade visual que geram resultados reais.
            </p>
            <p className="text-base sm:text-lg font-semibold text-[#a3e635]">
              Da ideia ao lançamento, sua visão ganha vida.
            </p>
          </motion.div>

          {/* Pill Tags List from Image 2 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="mx-auto mt-8 flex flex-wrap justify-center gap-2.5 max-w-3xl"
          >
            {[
              { tag: '🎓 Cursos Grátis' },
              { tag: '🌐 8 Idiomas' },
              { tag: '🤖 IA Tutora 24/7' },
              { tag: '💆 Massagem' },
              { tag: '💻 Programação' },
              { tag: '🏆 Certificados' },
            ].map((item, id) => (
              <span
                key={id}
                className="rounded-full border border-[#a3e635]/30 bg-[#a3e635]/10 px-4 py-1.5 text-xs font-semibold text-[#a3e635] hover:border-[#a3e635] hover:bg-[#a3e635]/20 transition-all duration-300 cursor-default"
              >
                {item.tag}
              </span>
            ))}
          </motion.div>

          {/* Action Buttons Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mx-auto mt-10 flex flex-wrap items-center justify-center gap-4 max-w-3xl"
          >
            {/* Button 1: Consultation */}
            <button
              onClick={onOpenConsultation}
              className="group flex items-center justify-between gap-3 rounded-xl bg-[#a3e635] hover:bg-[#84cc16] text-black font-extrabold text-sm px-6 py-3.5 transition-all duration-300 hover:scale-[1.02] cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Agendar Consulta</span>
              </div>
              <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
            </button>

            {/* Button 2: Portfolio */}
            <button
              onClick={() => onNavigate('portfolio')}
              className="flex items-center justify-center rounded-xl bg-white hover:bg-neutral-100 text-[#84cc16] font-extrabold text-sm px-7 py-3.5 transition-all duration-300 hover:scale-[1.02] cursor-pointer shadow-md"
            >
              Ver Portfólio
            </button>
          </motion.div>

          {/* Scroll To Explore Mouse Indicator (From Image 3) */}
          <div className="mt-12 flex flex-col items-center gap-2">
            <span className="text-[11px] font-bold tracking-wider text-[#a3e635] uppercase">
              Role para explorar
            </span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-5 h-8 rounded-full border-2 border-[#a3e635] flex items-start justify-center p-1"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-[#a3e635]" />
            </motion.div>
          </div>

          {/* Statistics Section with Scroll Animated Counters (From Image 3) */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7 }}
            className="w-full max-w-4xl mx-auto mt-12 px-4"
          >
            <div className="grid grid-cols-3 gap-4 text-center">
              <AnimatedCounter targetValue={50} suffix="+" label="Projetos" idx={0} />
              <AnimatedCounter targetValue={30} suffix="+" label="Clientes" idx={1} />
              <AnimatedCounter targetValue={100} suffix="%" label="Satisfação" idx={2} />
            </div>
          </motion.div>
        </section>
      </div>

      {/* Services Grid (Image 3) */}
      <motion.section 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7 }}
        className="mx-auto max-w-7xl px-4 mt-36 sm:px-6 lg:px-8"
      >
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl font-black tracking-tight text-white sm:text-5xl uppercase">
            NOSSOS <span className="text-brand-lime">SERVIÇOS</span>
          </h2>
          <p className="mt-3 text-xs font-black tracking-widest text-neutral-400 uppercase">
            SOLUÇÕES COMPLETAS PARA ELEVAR SUA PRESENÇA DIGITAL
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((srv, idx) => {
            // Icon choosing map
            let SrvIcon = Globe;
            if (srv.iconName === 'Palette') SrvIcon = Palette;
            else if (srv.iconName === 'Monitor') SrvIcon = Monitor;
            else if (srv.iconName === 'Zap') SrvIcon = Zap;

            const isHovered = hoveredCard === srv.id;

            return (
              <motion.div
                key={srv.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                onMouseEnter={() => setHoveredCard(srv.id)}
                onMouseLeave={() => setHoveredCard(null)}
                className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-neutral-800 bg-[#070707] p-8 text-left transition-all duration-300 hover:border-neutral-700 hover:translate-y-[-4px]"
              >
                {/* Visual border */}
                {isHovered && (
                  <div className="absolute inset-0 border border-brand-accent/30 rounded-2xl pointer-events-none" />
                )}

                <div>
                  {/* Rounded icon block matching screenshots */}
                  <div 
                    className="mb-8 flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-900/60"
                    style={{ color: srv.color }}
                  >
                    <SrvIcon className="h-6 w-6" />
                  </div>

                  <h3 className="font-display text-lg font-black tracking-wider text-white mb-4">
                    {srv.title}
                  </h3>

                  <p className="text-sm leading-relaxed text-neutral-400">
                    {srv.description}
                  </p>
                </div>

                {/* Tag Footer inside cards matching screenshots */}
                <div className="mt-8 pt-4 border-t border-neutral-900 flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-brand-lime" />
                  <span className="text-[10px] font-black tracking-widest text-neutral-500 uppercase">
                    TECHIFY CORE
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* Mid Banner Section (Image 4): The design you only find here */}
      <motion.section 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7 }}
        className="mx-auto max-w-4xl px-4 mt-36 text-center"
      >
        <div className="inline-flex items-center gap-1.5 rounded-full border border-brand-accent/20 bg-brand-accent/5 px-4 py-1.5 text-xs text-brand-lime tracking-widest uppercase font-semibold mb-6">
          <Zap className="h-3 w-3 text-brand-lime" />
          <span>CONVITE PREMIUM</span>
        </div>

        <h2 className="font-display text-4xl font-black text-white uppercase tracking-tight sm:text-6xl">
          O DESIGN QUE VOCÊ <br />
          <span className="text-brand-lime italic tracking-wide inline-block transform skew-x-[-4deg]">
            SÓ ENCONTRA AQUI.
          </span>
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-neutral-400 sm:text-lg">
          Assim como um supercarro, um site de alta performance precisa de harmonia entre o que se vê e o que está por baixo. Na <strong className="text-white">Techify</strong>, unimos interfaces que encantam com uma engenharia de código que converte visitantes em lucros reais.
        </p>

        {/* Feature grid with custom designs (Image 5) */}
        <div className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-4">
          {premiumFeatures.map((feat, idx) => {
            const FeatIcon = feat.icon;
            return (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="flex flex-col items-center justify-center rounded-xl border border-neutral-900 bg-neutral-950/20 py-6 px-4 hover:border-neutral-800 transition-colors duration-200"
              >
                <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-800 bg-[#0d0d0d] text-brand-lime">
                  <FeatIcon className="h-4 w-4" />
                </div>
                <span className="text-[9px] font-black tracking-wider text-neutral-300 uppercase text-center">
                  {feat.label}
                </span>
              </motion.div>
            );
          })}
        </div>

        {/* Interactive 3D Experience Simulated Button with dynamic background */}
        <div className="mt-16 flex flex-col items-center justify-center">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setInteractive3D(!interactive3D)}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 via-blue-500 to-emerald-400 p-[2px] transition-all duration-300 shadow-[0_0_40px_rgba(124,58,237,0.25)] hover:shadow-[0_0_50px_rgba(57,255,20,0.35)]"
          >
            <div className="rounded-2xl bg-neutral-950 px-10 py-5 text-white flex items-center gap-3">
              <Box className="h-5 w-5 text-brand-lime animate-spin" style={{ animationDuration: '4s' }} />
              <span className="font-display font-black tracking-widest text-sm uppercase">
                {interactive3D ? 'DESATIVAR MÓDULO 3D' : 'EXPERIÊNCIA 3D'}
              </span>
            </div>
          </motion.button>

          {/* Interactive physics particles panel when 3D is active */}
          {interactive3D && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="w-full max-w-2xl mt-8 rounded-2xl border border-brand-accent/20 bg-neutral-950/80 p-6 shadow-inner text-left"
            >
              <div className="flex items-center gap-2 mb-4 text-brand-lime">
                <Sparkles className="h-5 w-5" />
                <h4 className="font-display text-sm font-bold uppercase tracking-wider">Câmera Vetorial Reconectada</h4>
              </div>
              <p className="text-gray-400 text-xs leading-relaxed mb-4">
                Interaja com o renderizados de pós-processamento da Techify Core. Os nós refletem gravitação de cursor em tempo real operando em WebGL2:
              </p>
              
              {/* Actual interactive vector canvas element */}
              <div className="relative h-44 rounded-lg bg-[#0e0e0e] border border-neutral-900 flex items-center justify-center overflow-hidden cursor-crosshair">
                <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:16px_16px]" />
                <div className="flex gap-4">
                  {[1, 2, 3, 4, 5, 6].map((node) => (
                    <motion.div
                      key={node}
                      animate={{ 
                        height: [20, 60, 10, 40, 20],
                        opacity: [0.5, 1, 0.5]
                      }}
                      transition={{ repeat: Infinity, duration: 2 * node, ease: 'easeInOut' }}
                      className="w-2.5 rounded-full bg-brand-accent"
                    />
                  ))}
                </div>
                <div className="absolute bottom-2 right-3 text-[9px] font-mono text-neutral-600">
                  FPS: 60.0 // RENDERER: VULKAN_MAPPED
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.section>
    </div>
  );
}
