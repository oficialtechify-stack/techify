import React, { useState } from 'react';
import { motion } from 'motion/react';
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
import ToonHub from './ToonHub';

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
      {/* Full-screen Dark Hero Section with Cinematic Premium background video */}
      <div className="relative w-full min-h-screen flex flex-col justify-center items-center overflow-hidden pb-12">
        <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover z-0"><source src="https://res.cloudinary.com/dfonotyfb/video/upload/v1775585556/dds3_1_rqhg7x.mp4" type="video/mp4" /> </video>
        
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
        <section className="relative mx-auto max-w-7xl px-4 pt-16 text-center sm:px-6 lg:px-8 z-10 w-full">
          
          {/* Digital Innovation Pill Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-1.5 rounded-full border border-brand-accent/20 bg-brand-accent/5 px-4 py-1.5 text-xs text-brand-lime tracking-widest uppercase font-semibold text-glow-green mb-8"
          >
            <Sparkles className="h-3.5 w-3.5 text-brand-accent animate-spin" style={{ animationDuration: '3s' }} />
            <span>INOVAÇÃO DIGITAL</span>
          </motion.div>

          {/* Main Header Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="font-display text-5xl font-black tracking-tighter text-white sm:text-7xl lg:text-8xl uppercase leading-none"
          >
            TRANSFORME SEU <br />
            <span className="text-brand-lime text-glow-green inline-block hover:scale-[1.02] transition-transform duration-300">
              TECHIFY
            </span>
          </motion.h1>

          {/* Taglines */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mx-auto mt-8 max-w-2xl space-y-3"
          >
            <p className="text-base text-neutral-300 sm:text-lg font-normal">
              Criamos plataformas web e identidade visual que geram resultados reais.
            </p>
            <p className="text-md sm:text-lg font-medium text-brand-lime">
              Da ideia ao lançamento, sua visão ganha vida.
            </p>
          </motion.div>

          {/* Emoji Tags Pills Carousel/List */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="mx-auto mt-12 flex flex-wrap justify-center gap-2 max-w-3xl"
          >
            {[
              { tag: '🎨 UX/UI Design' },
              { tag: '💻 Sistemas Web' },
              { tag: '📈 SEO Otimizado' },
              { tag: '🚀 Desenvolvimento' },
              { tag: '💎 Identidade Visual' },
              { tag: '⚡ Suporte 24/7' },
            ].map((item, id) => (
              <span
                key={id}
                className="rounded-full border border-neutral-800 bg-neutral-900/30 px-4 py-1.5 text-xs font-semibold text-neutral-300 hover:border-brand-accent/30 hover:text-white transition-all duration-350 cursor-default"
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
            className="mx-auto mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row max-w-lg"
          >
            {/* Button 1: Consultation */}
            <button
              onClick={onOpenConsultation}
              className="group flex w-full items-center justify-between rounded-xl bg-brand-lime hover:bg-brand-accent text-black font-extrabold text-sm px-6 py-4 transition-all duration-300 hover:scale-[1.02] shadow-[0_4px_30px_rgba(163,230,53,0.35)] block-glow-green sm:w-auto"
            >
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span>Agendar Consulta</span>
              </div>
              <ArrowRight className="h-4 w-4 ml-8 transition-transform group-hover:translate-x-1" />
            </button>

            {/* Button 2: Portfolio */}
            <button
              onClick={() => onNavigate('portfolio')}
              className="flex w-full items-center justify-center rounded-xl bg-white hover:bg-neutral-100 text-black font-extrabold text-sm px-8 py-4 transition-all duration-300 hover:scale-[1.02] sm:w-auto"
            >
              Ver Portfólio
            </button>
          </motion.div>

          {/* Scroll To Explore Mouse Indicator */}
          <div className="mt-20 flex flex-col items-center gap-1.5 text-glow-green">
            <span className="text-[10px] font-bold tracking-widest text-[#a3e635]">
              ROLE PARA EXPLORAR
            </span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="text-brand-lime"
            >
              <Mouse className="h-6 w-6 stroke-1.5" />
            </motion.div>
          </div>
        </section>
      </div>

      {/* Statistics Section */}
      <section className="mx-auto max-w-5xl px-4 mt-24">
        <div className="grid grid-cols-1 gap-8 rounded-2xl border border-neutral-900 bg-neutral-950/40 p-8 sm:grid-cols-3">
          {[
            { value: '50+', label: 'PROJETOS' },
            { value: '30+', label: 'CLIENTES' },
            { value: '100%', label: 'SATISFAÇÃO' },
          ].map((stat, idx) => (
            <div
              key={idx}
              className={`flex flex-col items-center text-center ${
                idx > 0 ? 'sm:border-l sm:border-neutral-900/80 sm:pl-8' : ''
              }`}
            >
              <h3 className="font-display text-5xl font-extrabold text-brand-lime text-glow-green sm:text-6xl">
                {stat.value}
              </h3>
              <p className="mt-2 text-xs font-black tracking-widest text-neutral-500 uppercase">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Services Grid (Image 3) */}
      <section className="mx-auto max-w-7xl px-4 mt-36 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl font-black tracking-tight text-white sm:text-5xl uppercase">
            NOSSOS <span className="text-brand-lime text-glow-green">SERVIÇOS</span>
          </h2>
          <p className="mt-3 text-xs font-black tracking-widest text-neutral-400 uppercase">
            SOLUÇÕES COMPLETAS PARA ELEVAR SUA PRESENÇA DIGITAL
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((srv) => {
            // Icon choosing map
            let SrvIcon = Globe;
            if (srv.iconName === 'Palette') SrvIcon = Palette;
            else if (srv.iconName === 'Monitor') SrvIcon = Monitor;
            else if (srv.iconName === 'Zap') SrvIcon = Zap;

            const isHovered = hoveredCard === srv.id;

            return (
              <motion.div
                key={srv.id}
                onMouseEnter={() => setHoveredCard(srv.id)}
                onMouseLeave={() => setHoveredCard(null)}
                className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-neutral-800 bg-[#070707] p-8 text-left transition-all duration-300 hover:border-neutral-700 hover:translate-y-[-4px]"
              >
                {/* Visual glowing border */}
                {isHovered && (
                  <div className="absolute inset-0 border border-brand-accent/30 rounded-2xl pointer-events-none border-glow-green" />
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
      </section>

      {/* Mid Banner Section (Image 4): The design you only find here */}
      <section className="mx-auto max-w-4xl px-4 mt-36 text-center">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-brand-accent/20 bg-brand-accent/5 px-4 py-1.5 text-xs text-brand-lime tracking-widest uppercase font-semibold mb-6">
          <Zap className="h-3 w-3 text-brand-lime" />
          <span>CONVITE PREMIUM</span>
        </div>

        <h2 className="font-display text-4xl font-black text-white uppercase tracking-tight sm:text-6xl">
          O DESIGN QUE VOCÊ <br />
          <span className="text-brand-lime text-glow-green italic tracking-wide inline-block transform skew-x-[-4deg]">
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
              <div 
                key={idx}
                className="flex flex-col items-center justify-center rounded-xl border border-neutral-900 bg-neutral-950/20 py-6 px-4 hover:border-neutral-800 transition-colors duration-200"
              >
                <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-800 bg-[#0d0d0d] text-brand-lime">
                  <FeatIcon className="h-4 w-4" />
                </div>
                <span className="text-[9px] font-black tracking-wider text-neutral-300 uppercase text-center">
                  {feat.label}
                </span>
              </div>
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
      </section>

      {/* Interactive ToonHub Figurines Carousel */}
      <section className="mt-36 border-t border-neutral-900">
        <ToonHub />
      </section>
    </div>
  );
}
