import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useInView, animate, useScroll, useTransform } from 'motion/react';
import { 
  Calendar, 
  ArrowRight, 
  ArrowUpRight,
  Globe, 
  Palette, 
  Monitor, 
  Zap, 
  Sparkles, 
  TrendingUp, 
  Trophy, 
  ShieldCheck, 
  CheckCircle,
  Star,
  Layers,
  Database,
  BarChart3,
  Users,
  Check,
  Clock,
  Layout,
  MessageCircle,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Send
} from 'lucide-react';
import { PROJECTS, SERVICES } from '../data';
import AnimatedGradient from './AnimatedGradient';
import { GradientWave } from './GradientWave';
import WavyBackground from './WavyBackground';
import { TechifyIcon } from './TechifyLogo';
import ScrollReveal from './ScrollReveal';
import ShowcaseCarousel from './ShowcaseCarousel';
import TextEmergence from './TextEmergence';
import { EditableText, EditableNumber, EditableIcon, EditableImage } from './InlineEditProvider';

interface AnimatedCounterProps {
  targetValue: number;
  suffix?: string;
  label: string;
  idx?: number;
  id?: string;
}

function AnimatedCounter({ targetValue, suffix = '', label, idx = 0, id = 'stat_counter' }: AnimatedCounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });
  const [currentValue, setCurrentValue] = useState(0);

  useEffect(() => {
    if (isInView) {
      setCurrentValue(0);
      const controls = animate(0, targetValue, {
        duration: 1.8,
        ease: [0.16, 1, 0.3, 1],
        onUpdate: (latest) => {
          setCurrentValue(Math.floor(latest));
        },
      });
      return () => controls.stop();
    } else {
      setCurrentValue(0);
    }
  }, [isInView, targetValue]);

  return (
    <div ref={ref}>
      <EditableNumber
        id={id}
        defaultValue={currentValue}
        defaultSuffix={suffix}
        defaultLabel={label}
      />
    </div>
  );
}

interface HomeSectionProps {
  onNavigate: (tab: string) => void;
  onOpenConsultation: () => void;
}

export default function HomeSection({ onNavigate, onOpenConsultation }: HomeSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedArticle, setSelectedArticle] = useState<number | null>(null);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Framer Motion Scroll Parallax Transforms
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Layered Parallax Transformations for deep spatial immersion
  const yHeroOrb = useTransform(scrollYProgress, [0, 0.35], [0, 140]);
  const yHeroRing = useTransform(scrollYProgress, [0, 0.35], [0, -90]);
  const rotateHeroRing = useTransform(scrollYProgress, [0, 0.35], [0, 60]);
  const scaleHeroOrb = useTransform(scrollYProgress, [0, 0.25], [1, 1.3]);
  const opacityHeroOrb = useTransform(scrollYProgress, [0, 0.3], [0.4, 0.1]);

  const yPresencaOrb = useTransform(scrollYProgress, [0.08, 0.4], [-60, 100]);
  const yBentoOrb = useTransform(scrollYProgress, [0.15, 0.55], [80, -90]);
  const scaleBentoOrb = useTransform(scrollYProgress, [0.15, 0.35, 0.55], [0.85, 1.15, 0.9]);
  
  const yServicesGlow = useTransform(scrollYProgress, [0.3, 0.7], [-80, 100]);
  const rotateServicesGeom = useTransform(scrollYProgress, [0.3, 0.7], [0, -45]);

  const yEspecialidadeGlow = useTransform(scrollYProgress, [0.45, 0.8], [90, -90]);
  const scaleEspecialidadeGlow = useTransform(scrollYProgress, [0.45, 0.65, 0.85], [0.9, 1.25, 0.85]);

  const yTestimonialsAura = useTransform(scrollYProgress, [0.6, 0.9], [-60, 80]);
  const yCtaOrb = useTransform(scrollYProgress, [0.75, 1], [80, -50]);
  const scaleCtaGlow = useTransform(scrollYProgress, [0.75, 0.95, 1], [0.8, 1.3, 1.1]);

  // Client Brands for Marquee
  const clientLogos = [
    { name: 'KALDI', type: 'text' },
    { name: 'HYPE SPORTY', type: 'text' },
    { name: 'ASME AI', type: 'text' },
    { name: 'MUGSYS MUGS', type: 'text' },
    { name: 'EPIC DESIGNER', type: 'text' },
    { name: 'AGENCYOS', type: 'text' },
  ];

  // Articles data
  const articles = [
    {
      id: 1,
      title: 'Quanto custa fazer um site para a sua empresa (e por que os orçamentos variam tanto)',
      category: 'Sites & Estratégia',
      readTime: '4 min de leitura',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
      summary: 'Entenda os fatores decisivos que separam um site profissional de alta conversão de templates genéricos que não trazem retorno para o seu negócio.',
      content: 'A diferença entre um site de R$ 500 e um projeto profissional de R$ 5.000 está na engenharia de conversão: velocidade de carregamento, SEO estruturado para aparecer nas buscas locais do Google, integração direta com WhatsApp e painel de controle intuitivo.'
    },
    {
      id: 2,
      title: 'Seu negócio não aparece no Google? Veja o que está acontecendo',
      category: 'SEO & Tráfego',
      readTime: '5 min de leitura',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
      summary: 'Descubra os 3 principais erros técnicos que impedem empresas locais de serem indexadas na primeira página das pesquisas do Google.',
      content: 'Quando um cliente busca pelo seu serviço no bairro ou cidade, o algoritmo prioriza sites rápidos, cadastros verificados no Google Meu Negócio e páginas otimizadas para dispositivos móveis com dados estruturados Schema.org.'
    },
    {
      id: 3,
      title: 'Planilha ou sistema de gestão: quando a planilha começa a custar caro',
      category: 'Sistemas & Gestão',
      readTime: '3 min de leitura',
      image: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=800&q=80',
      summary: 'Como a perda de dados, erros manuais de faturamento e retrabalho na digitação de pedidos sabotam a margem de lucro de pequenas e médias empresas.',
      content: 'Planilhas funcionam bem no primeiro mês, mas rapidamente se tornam gargalos: falta de controle de estoque em tempo real, cálculos manuais de mensalidades e risco de perda acidental de arquivos podem custar milhares de reais todo mês.'
    }
  ];

  // Testimonials data
  const testimonials = [
    {
      quote: "A Techify entendeu o problema do nosso negócio com extrema rapidez e entregou um sistema robusto e veloz, sem enrolação.",
      author: "Rodrigo Mendonça",
      role: "Fundador & CEO, InovaLog Tech",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      company: "InovaLog"
    },
    {
      quote: "Comunicação direta e entrega impecável do briefing ao lançamento. Nossas conversões no WhatsApp subiram mais de 40% na primeira semana.",
      author: "Camila Guimarães",
      role: "Diretora de Marketing, Sempre Mais",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80",
      company: "Sempre Mais"
    },
    {
      quote: "Simplificaram uma demanda complexa de automação de faturamento e entregaram uma plataforma intuitiva que nosso time usa diariamente sem erros.",
      author: "Lucas Silveira",
      role: "Diretor de Operações, Genesis Group",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
      company: "Genesis"
    }
  ];

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden bg-black text-white selection:bg-[#22c55e]/30 selection:text-white">
      
      {/* Global Background Parallax Ambient Glow Blobs */}
      <motion.div 
        style={{ y: yHeroOrb, scale: scaleHeroOrb, opacity: opacityHeroOrb }}
        className="pointer-events-none fixed -top-40 left-1/2 -translate-x-1/2 w-[750px] h-[500px] rounded-full bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.18),transparent_70%)] blur-[90px] z-0"
      />
      <motion.div 
        style={{ y: yBentoOrb, scale: scaleBentoOrb }}
        className="pointer-events-none absolute top-[28%] -right-32 w-[550px] h-[550px] rounded-full bg-[radial-gradient(circle_at_center,rgba(74,222,128,0.08),transparent_70%)] blur-[100px] z-0"
      />
      <motion.div 
        style={{ y: yEspecialidadeGlow, scale: scaleEspecialidadeGlow }}
        className="pointer-events-none absolute top-[58%] -left-32 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.07),transparent_70%)] blur-[110px] z-0"
      />
      <motion.div 
        style={{ y: yCtaOrb, scale: scaleCtaGlow }}
        className="pointer-events-none absolute bottom-12 left-1/2 -translate-x-1/2 w-[800px] h-[450px] rounded-full bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.12),transparent_70%)] blur-[120px] z-0"
      />
      
      {/* ========================================================================= */}
      {/* 1. HERO SECTION (Wavy Background WebGL Effect)                            */}
      {/* ========================================================================= */}
      <WavyBackground className="min-h-[92vh] flex flex-col justify-between items-center pt-12 pb-16 bg-[#000000]">
        
        {/* Deep Space Background with Starfield & Parallax Layers */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <motion.div 
            style={{ y: yHeroOrb }}
            className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(34,197,94,0.12),transparent_70%)]" 
          />
          {/* Subtle Parallax Grid Lines */}
          <motion.div 
            style={{ y: yHeroRing }}
            className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:4rem_4rem]" 
          />

          {/* Floating Parallax Cyber Ring */}
          <motion.div
            style={{ y: yHeroRing, rotate: rotateHeroRing }}
            className="pointer-events-none absolute -top-16 left-8 sm:left-24 w-72 h-72 rounded-full border border-[#22c55e]/15 opacity-30 [border-dasharray:8px]"
          />
          <motion.div
            style={{ y: yHeroOrb, rotate: rotateServicesGeom }}
            className="pointer-events-none absolute top-32 right-10 sm:right-32 w-48 h-48 rounded-full border border-[#4ade80]/10 opacity-20"
          />
        </div>

        {/* Hero Header & Copy */}
        <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center pt-8">
          
          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.1] max-w-4xl pt-4"
          >
            <EditableText id="hero_title_1" defaultText="Transforme Seu" title="Título Hero Linha 1" /> <br />
            <span className="text-[#22c55e] drop-shadow-[0_0_35px_rgba(34,197,94,0.35)]">
              <EditableText id="hero_title_2" defaultText="Negócio Digital" title="Título Hero Linha 2" />
            </span>
          </motion.h1>

          {/* Stable Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl text-base sm:text-lg text-neutral-300 leading-relaxed font-normal mt-5"
          >
            <EditableText
              id="hero_description_main"
              defaultText="Criamos plataformas web e identidade visual que geram resultados reais. Da ideia ao lançamento, sua visão ganha vida."
              title="Descrição do Hero"
              isMultiline={true}
            />
          </motion.p>

          {/* Dual Action Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
          >
            <button
              onClick={() => onNavigate('portfolio')}
              className="w-full sm:w-auto rounded-full border border-neutral-800 bg-neutral-900/80 hover:bg-neutral-800/90 px-6 py-3.5 text-xs sm:text-sm font-bold tracking-wide text-neutral-200 transition-all cursor-pointer"
            >
              VER O QUE JÁ FIZEMOS
            </button>

            <button
              onClick={onOpenConsultation}
              className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-full bg-[#22c55e] hover:bg-[#16a34a] px-7 py-3.5 text-xs sm:text-sm font-bold tracking-wide text-black transition-all shadow-[0_0_25px_rgba(34,197,94,0.35)] cursor-pointer"
            >
              <span>FALAR COM ENGENHEIRO</span>
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-black/20 text-black group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                <ArrowUpRight className="h-3.5 w-3.5" />
              </div>
            </button>
          </motion.div>
        </div>

        {/* Rating Footer */}
        <div className="relative z-10 mt-12 flex flex-col items-center gap-1.5">
          <span className="text-xs font-semibold text-neutral-300 tracking-wide">
            4.9/5 em satisfação de clientes
          </span>
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-[#facc15] text-[#facc15]" />
            ))}
          </div>
        </div>
      </WavyBackground>


      {/* ========================================================================= */}
      {/* 2. LOGO MARQUEE / CLIENTS CAROUSEL (Infinite Seamless Flow)               */}
      {/* ========================================================================= */}
      <ScrollReveal threshold={0.1} duration={0.8} yOffset={20}>
        <section className="relative w-full border-y border-neutral-900/90 bg-[#050705]/90 py-7 sm:py-8 overflow-hidden select-none">
          {/* Subtle edge gradient fade masks */}
          <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-[#030303] via-[#030303]/90 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-[#030303] via-[#030303]/90 to-transparent z-10 pointer-events-none" />

          {/* Continuous Infinite Marquee Track */}
          <div className="flex animate-marquee items-center gap-12 sm:gap-16 hover:[animation-play-state:paused]">
            {[...clientLogos, ...clientLogos, ...clientLogos, ...clientLogos].map((logo, idx) => (
              <div 
                key={idx} 
                className="flex items-center gap-3 text-neutral-400/80 hover:text-white transition-all duration-300 cursor-default select-none shrink-0 group"
              >
                <div className="h-2 w-2 rounded-full bg-[#22c55e] shadow-[0_0_8px_rgba(34,197,94,0.8)] group-hover:scale-125 transition-transform" />
                <span className="text-sm sm:text-base font-black tracking-[0.2em] uppercase font-display text-neutral-300 group-hover:text-white group-hover:text-glow-green transition-all">
                  {logo.name}
                </span>
              </div>
            ))}
          </div>
        </section>
      </ScrollReveal>

      {/* ========================================================================= */}
      {/* 2.1 PRESENÇA NO GOOGLE & CONVERSÃO (Destaque Estratégico Fixo)            */}
      {/* ========================================================================= */}
      <section className="relative w-full py-16 sm:py-24 bg-gradient-to-b from-black via-[#060f07]/60 to-black border-b border-neutral-900/80 overflow-hidden">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          <ScrollReveal delay={0.08} yOffset={30} threshold={0.2}>
            {/* Heading */}
            <h2 className="font-display text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.15] max-w-4xl">
              Seu concorrente aparece no Google. <br />
              <span className="text-neutral-400 font-bold">
                E o seu negócio?
              </span>
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={0.25} yOffset={25} threshold={0.2}>
            {/* Text description */}
            <p className="max-w-3xl text-base sm:text-lg text-neutral-300 leading-relaxed font-normal mt-6">
              Se o cliente não encontra a sua empresa na internet, ele compra de quem ele encontra. A <strong className="text-white font-semibold">Techify</strong> faz o site, o sistema de gestão e a estratégia que colocam o seu negócio na frente.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.35} yOffset={20} threshold={0.2}>
            {/* CTA */}
            <div className="mt-8">
              <button
                onClick={onOpenConsultation}
                className="group relative inline-flex items-center justify-center gap-3 rounded-full bg-[#22c55e] hover:bg-[#16a34a] px-8 py-4 text-xs sm:text-sm font-bold tracking-wide text-black transition-all shadow-[0_0_25px_rgba(34,197,94,0.3)] cursor-pointer"
              >
                <span>QUERO APARECER PRIMEIRO</span>
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-black/20 text-black group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </div>
              </button>
            </div>
          </ScrollReveal>
        </div>
      </section>


      {/* ========================================================================= */}
      {/* 3. SOBRE NÓS / BENTO STATS SECTION                                       */}
      {/* ========================================================================= */}
      <section className="relative w-full py-24 sm:py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header Tag */}
        <ScrollReveal threshold={0.15} blur={16} yOffset={25}>
          <div className="flex flex-col items-center text-center mb-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-950 px-3.5 py-1 text-xs font-bold text-neutral-300 mb-6 shadow-[0_0_15px_rgba(34,197,94,0.15)]">
              <div className="h-1.5 w-1.5 rounded-sm bg-[#22c55e] animate-pulse" />
              <span>Sobre nós</span>
            </div>

            <TextEmergence as="h2" blur={16} yOffset={24} className="font-display text-3xl sm:text-5xl md:text-6xl font-extrabold text-white max-w-3xl leading-[1.15] tracking-tight">
              A empresa que resolve o que trava o seu negócio{' '}
              <span className="text-neutral-400">com site, sistema e anúncios.</span>
            </TextEmergence>
          </div>
        </ScrollReveal>

        {/* 4-Card Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          
          {/* Card 1: 120+ Deliveries (Large Dark Card) */}
          <ScrollReveal delay={0.05} yOffset={35} className="md:col-span-2">
            <div className="relative overflow-hidden rounded-3xl border border-neutral-800 bg-[#090b09] p-8 flex flex-col justify-between min-h-[300px] h-full hover:border-[#22c55e]/40 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-800 bg-black p-1.5">
                    <TechifyIcon className="h-full w-full" />
                  </div>
                  <span className="font-display text-base font-bold text-white">TECHIFY</span>
                </div>
                <div className="h-9 w-9 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-[#22c55e]">
                  <BarChart3 className="h-5 w-5" />
                </div>
              </div>

              <div className="mt-12">
                <AnimatedCounter id="bento_stat_1" targetValue={120} suffix="+" label="Sites, sistemas e campanhas já entregues e no ar com alta conversão." />
              </div>

              <div className="absolute right-0 bottom-0 w-64 h-64 bg-[radial-gradient(circle_at_bottom_right,rgba(34,197,94,0.12),transparent_70%)] pointer-events-none" />
            </div>
          </ScrollReveal>

          {/* Card 2: 100% Prazo Cumprido */}
          <ScrollReveal delay={0.15} yOffset={35}>
            <div className="relative overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-950 p-8 flex flex-col justify-between h-full hover:border-[#22c55e]/40 transition-colors">
              <div>
                <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                  <EditableText id="bento_card2_tag" defaultText="Prazo combinado é prazo cumprido" title="Tag Prazo" />
                </p>
                <div className="mt-3">
                  <AnimatedCounter id="bento_stat_2" targetValue={100} suffix="%" label="" />
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-neutral-900">
                <p className="text-xs italic text-neutral-400 leading-relaxed">
                  <EditableText
                    id="bento_card2_quote"
                    defaultText="“O time da Techify entregou nosso produto com qualidade e no prazo. Comunicação clara do início ao fim.”"
                    title="Depoimento Prazo"
                    isMultiline={true}
                  />
                </p>
              </div>
            </div>
          </ScrollReveal>

          {/* Card 3: 40+ Sites e Sistemas no Ar (Green Accent Card) */}
          <ScrollReveal delay={0.25} yOffset={35}>
            <div className="relative overflow-hidden rounded-3xl border border-[#22c55e]/40 bg-[#06240d] p-8 flex flex-col justify-between text-white h-full shadow-[0_0_25px_rgba(34,197,94,0.15)]">
              <div>
                <p className="text-xs font-semibold text-[#86efac] uppercase tracking-wider">
                  <EditableText id="bento_card3_tag" defaultText="Sites e sistemas no ar" title="Tag Sistemas" />
                </p>
                <div className="mt-3 text-4xl sm:text-5xl font-black text-white">
                  <AnimatedCounter id="bento_stat_3" targetValue={40} suffix="+" label="" />
                </div>
              </div>

              <p className="mt-8 text-xs font-medium text-[#bbf7d0] leading-relaxed">
                <EditableText
                  id="bento_card3_desc"
                  defaultText="No ar, funcionando e com suporte técnico garantido depois da entrega."
                  title="Descrição Sistemas no Ar"
                />
              </p>
            </div>
          </ScrollReveal>

          {/* Card 4: 100+ Empresas Atendidas */}
          <ScrollReveal delay={0.3} yOffset={35} className="md:col-span-3 lg:col-span-4">
            <div className="relative overflow-hidden rounded-3xl border border-neutral-800 bg-[#050505] p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-[#22c55e]/40 transition-colors">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-[#0a1a0c] border border-[#22c55e]/30 flex items-center justify-center text-[#22c55e]">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">
                    <EditableText id="bento_card4_title" defaultText="Empresas e Empreendedores Atendidos" title="Título Empresas Atendidas" />
                  </h4>
                  <p className="text-xs text-neutral-400">
                    <EditableText id="bento_card4_desc" defaultText="Atendimento em todo o Brasil com software de alta performance" title="Subtítulo Empresas Atendidas" />
                  </p>
                </div>
              </div>

              <div>
                <AnimatedCounter id="bento_stat_4" targetValue={100} suffix="+" label="" />
              </div>
            </div>
          </ScrollReveal>

        </div>
      </section>


      {/* ========================================================================= */}
      {/* 4. SERVIÇOS (GradientWave WebGL Background + 3 Detailed Solution Cards)   */}
      {/* ========================================================================= */}
      <section className="relative w-full overflow-hidden py-24 sm:py-32">
        {/* Animated WebGL Gradient Wave Background with Parallax Shift */}
        <motion.div style={{ y: yServicesGlow }} className="absolute inset-0 z-0">
          <GradientWave 
            colors={["#011205", "#03280c", "#0d4d1a", "#021c07"]}
            className="opacity-95 h-[130%]"
            noiseSpeed={0.00001}
            deform={{ incline: 0.35, noiseAmp: 280, noiseFlow: 4 }}
          />
        </motion.div>
        
        {/* Parallax Floating Tech Shapes in Background */}
        <motion.div 
          style={{ y: yServicesGlow, rotate: rotateServicesGeom }}
          className="pointer-events-none absolute -top-12 -right-12 w-64 h-64 rounded-3xl border border-[#22c55e]/20 bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.1),transparent_70%)] blur-sm z-[2]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black pointer-events-none z-[1]" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <ScrollReveal threshold={0.2}>
            <div className="flex flex-col items-center text-center mb-16">
              <div className="inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-black/80 px-3.5 py-1 text-xs font-bold text-neutral-300 mb-6">
                <div className="h-1.5 w-1.5 rounded-sm bg-[#22c55e]" />
                <span>Serviços</span>
              </div>

              <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-white max-w-3xl leading-tight">
                Está perdendo cliente por qual desses três?
              </h2>

              <p className="mt-4 max-w-2xl text-sm sm:text-base text-neutral-300 leading-relaxed font-normal">
                Sem site, o cliente não te acha. Sem sistema, você perde tempo e dinheiro no controle manual. Sem anúncio, ninguém sabe que a sua empresa existe. A Techify resolve os três.
              </p>

              <button
                onClick={onOpenConsultation}
                className="mt-8 group inline-flex items-center gap-2 rounded-full bg-black hover:bg-neutral-900 border border-neutral-700 px-6 py-3 text-xs font-bold text-white transition-all cursor-pointer"
              >
                <span>QUERO APARECER PRIMEIRO</span>
                <ArrowUpRight className="h-4 w-4 text-[#22c55e] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>
          </ScrollReveal>

          {/* 3 Solution Cards matching reference image */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Service 1: Sites */}
            <ScrollReveal delay={0.1} yOffset={40}>
              <div className="group rounded-3xl border border-neutral-800 bg-[#080d08]/90 backdrop-blur-md p-6 sm:p-8 flex flex-col justify-between hover:border-[#22c55e]/50 transition-all shadow-xl h-full">
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#132b17] text-[#4ade80] mb-6">
                    <Globe className="h-6 w-6" />
                  </div>
                  
                  <h3 className="font-display text-xl font-black text-white mb-2">Sites & Landing Pages</h3>
                  <p className="text-sm text-neutral-400 leading-relaxed mb-6">
                    Seu cliente procura no celular e não te encontra. Fazemos o site que aparece no Google, abre instantaneamente e vira pedidos diretos no seu WhatsApp.
                  </p>
                </div>

                <div className="rounded-2xl overflow-hidden border border-neutral-800/80 bg-neutral-950 h-44">
                  <img 
                    src="https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=600&q=80" 
                    alt="Sites" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            </ScrollReveal>

            {/* Service 2: Sistemas */}
            <ScrollReveal delay={0.2} yOffset={40}>
              <div className="group rounded-3xl border border-neutral-800 bg-[#080d08]/90 backdrop-blur-md p-6 sm:p-8 flex flex-col justify-between hover:border-[#22c55e]/50 transition-all shadow-xl h-full">
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#132b17] text-[#4ade80] mb-6">
                    <Database className="h-6 w-6" />
                  </div>
                  
                  <h3 className="font-display text-xl font-black text-white mb-2">Sistemas de Gestão</h3>
                  <p className="text-sm text-neutral-400 leading-relaxed mb-6">
                    Controlar venda, estoque e mensalidade no caderno ou na planilha custa caro e dá erro. Criamos o sistema sob medida exatamente do jeito que o seu negócio funciona.
                  </p>
                </div>

                <div className="rounded-2xl overflow-hidden border border-neutral-800/80 bg-neutral-950 h-44">
                  <img 
                    src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=600&q=80" 
                    alt="Sistemas" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            </ScrollReveal>

            {/* Service 3: Marketing */}
            <ScrollReveal delay={0.3} yOffset={40}>
              <div className="group rounded-3xl border border-neutral-800 bg-[#080d08]/90 backdrop-blur-md p-6 sm:p-8 flex flex-col justify-between hover:border-[#22c55e]/50 transition-all shadow-xl h-full">
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#132b17] text-[#4ade80] mb-6">
                    <Zap className="h-6 w-6" />
                  </div>
                  
                  <h3 className="font-display text-xl font-black text-white mb-2">Marketing & Anúncios</h3>
                  <p className="text-sm text-neutral-400 leading-relaxed mb-6">
                    Impulsionar post aleatório não traz cliente pagante. Cuidamos dos seus anúncios no Google e no Instagram para o seu telefone tocar toda semana com clientes prontos para comprar.
                  </p>
                </div>

                <div className="rounded-2xl overflow-hidden border border-neutral-800/80 bg-neutral-950 h-44">
                  <img 
                    src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80" 
                    alt="Marketing" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            </ScrollReveal>

          </div>
        </div>
      </section>


      {/* ========================================================================= */}
      {/* 4.1 PORTFÓLIO / PROJETOS ENTREGUES CTA                                    */}
      {/* ========================================================================= */}
      <section className="relative w-full py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal threshold={0.15}>
          <div className="relative overflow-hidden rounded-3xl border border-neutral-800/80 bg-gradient-to-b from-[#080d08] via-neutral-950 to-black p-8 sm:p-14 text-center flex flex-col items-center justify-center shadow-[0_0_50px_rgba(0,0,0,0.6)]">
            
            {/* Ambient Radial Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.12),transparent_70%)] blur-[70px] pointer-events-none" />

            <div className="relative z-10 inline-flex items-center gap-2 rounded-full border border-[#22c55e]/30 bg-[#22c55e]/10 px-4 py-1.5 text-xs font-bold text-[#4ade80] mb-5 shadow-[0_0_15px_rgba(34,197,94,0.15)]">
              <div className="h-2 w-2 rounded-full bg-[#22c55e] animate-pulse" />
              <span>Nossos Trabalhos & Projetos</span>
            </div>

            <h2 className="relative z-10 font-display text-3xl sm:text-5xl font-extrabold text-white max-w-3xl leading-tight">
              Conheça nossos cases e entregas reais <br />
              <span className="text-[#22c55e] drop-shadow-[0_0_25px_rgba(34,197,94,0.3)]">feitas sob medida para cada cliente.</span>
            </h2>

            <p className="relative z-10 mt-4 max-w-2xl text-sm sm:text-base text-neutral-400 leading-relaxed font-normal">
              Explore nossa galeria completa com lojas virtuais, identidades visuais de luxo, plataformas web e sistemas desenvolvidos pela Techify.
            </p>

            <div className="relative z-10 mt-8">
              <button
                onClick={() => onNavigate('portfolio')}
                className="group relative inline-flex items-center justify-center gap-3 rounded-full bg-[#22c55e] hover:bg-[#16a34a] px-8 py-4 text-xs sm:text-sm font-bold tracking-wide text-black transition-all shadow-[0_0_30px_rgba(34,197,94,0.4)] hover:shadow-[0_0_40px_rgba(34,197,94,0.6)] cursor-pointer"
              >
                <span>ACESSAR PORTFÓLIO COMPLETO</span>
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-black/20 text-black group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                  <ArrowUpRight className="h-4 w-4" />
                </div>
              </button>
            </div>
          </div>
        </ScrollReveal>
      </section>


      {/* ========================================================================= */}
      {/* 5. ESPECIALIDADE (Interactive 2x2 Bento Cards)                            */}
      {/* ========================================================================= */}
      <section className="relative w-full py-24 sm:py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <ScrollReveal threshold={0.2}>
          <div className="flex flex-col items-center text-center mb-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-950 px-3.5 py-1 text-xs font-bold text-neutral-300 mb-6">
              <div className="h-1.5 w-1.5 rounded-sm bg-[#22c55e]" />
              <span>Especialidade</span>
            </div>

            <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-white max-w-3xl leading-tight">
              Cansado de contratar um profissional para cada coisa?
            </h2>

            <p className="mt-4 max-w-2xl text-sm sm:text-base text-neutral-400 leading-relaxed font-normal">
              Um faz o site, outro some com a senha, um terceiro cuida do anúncio e ninguém se entende. Na Techify é um time completo, do começo ao fim, com alguém de prontidão para te atender.
            </p>
          </div>
        </ScrollReveal>

        {/* 2x2 Interactive Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Bento 1: Menos trabalho na mão (Mockup financeiro animado) */}
          <ScrollReveal delay={0.1} yOffset={35}>
            <div className="rounded-3xl border border-neutral-800 bg-[#080808] p-6 sm:p-8 flex flex-col justify-between h-full hover:border-[#22c55e]/40 transition-colors">
              {/* Interactive Billing Card Mockup */}
              <div className="rounded-2xl border border-neutral-800/80 bg-neutral-950 p-5 mb-8 shadow-inner">
                <div className="flex items-center justify-between text-xs text-neutral-400 mb-2">
                  <span>Cobrança mensal automatizada</span>
                  <span className="text-[#22c55e] font-bold">R$ 4.900 / R$ 10.000</span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 rounded-full bg-neutral-900 overflow-hidden mb-5">
                  <div className="h-full bg-gradient-to-r from-[#22c55e] to-[#4ade80] rounded-full w-[49%]" />
                </div>

                {/* List of automated entries */}
                <div className="space-y-2.5">
                  {[
                    { name: 'Plano Pro Anual', date: 'Hoje às 14:32', val: 'R$ 1.200' },
                    { name: 'Licença Corporativa', date: 'Ontem às 18:10', val: 'R$ 2.450' },
                    { name: 'Manutenção Mensal', date: '12 de Agosto', val: 'R$ 850' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-900/60 border border-neutral-800/50 text-xs">
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-lg bg-[#22c55e]/10 text-[#22c55e] flex items-center justify-center">
                          <Check className="h-3.5 w-3.5" />
                        </div>
                        <div>
                          <p className="font-semibold text-white">{item.name}</p>
                          <p className="text-[10px] text-neutral-500">{item.date}</p>
                        </div>
                      </div>
                      <span className="font-bold text-[#4ade80]">{item.val}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-display text-xl font-bold text-white mb-2">Menos trabalho na mão</h3>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  Tarefa repetida no manual consome o dia do seu time. Automatizamos processos para sobrar tempo para o que realmente importa: vender.
                </p>
              </div>
            </div>
          </ScrollReveal>

          {/* Bento 2: Site e loja virtual (Bar chart + Badge) */}
          <ScrollReveal delay={0.2} yOffset={35}>
            <div className="rounded-3xl border border-neutral-800 bg-[#080808] p-6 sm:p-8 flex flex-col justify-between h-full hover:border-[#22c55e]/40 transition-colors">
              {/* Visual Growth Chart */}
              <div className="rounded-2xl border border-neutral-800/80 bg-neutral-950 p-6 mb-8 flex flex-col justify-between min-h-[220px]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Você sabe de onde vem cada venda?</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#22c55e]/20 text-[#4ade80] font-bold">
                    +142% conversão
                  </span>
                </div>

                {/* Bar Growth Visualization */}
                <div className="flex items-end justify-between gap-2 h-28 pt-4">
                  {[
                    { year: '2021', h: '25%' },
                    { year: '2022', h: '40%' },
                    { year: '2023', h: '60%' },
                    { year: '2024', h: '78%' },
                    { year: '2025', h: '95%' },
                    { year: '2026', h: '100%', active: true },
                  ].map((bar, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                      <div 
                        style={{ height: bar.h }} 
                        className={`w-full rounded-md transition-all ${
                          bar.active 
                            ? 'bg-[#22c55e] shadow-[0_0_12px_#22c55e]' 
                            : 'bg-neutral-800 hover:bg-neutral-700'
                        }`} 
                      />
                      <span className={`text-[10px] ${bar.active ? 'text-[#4ade80] font-bold' : 'text-neutral-500'}`}>
                        {bar.year}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 text-[11px] font-medium text-neutral-400 bg-neutral-900/50 p-2 rounded-lg border border-neutral-800/50">
                  Estratégia, Design e Tecnologia de ponta unificados.
                </div>
              </div>

              <div>
                <h3 className="font-display text-xl font-bold text-white mb-2">Site e loja virtual</h3>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  Sites e e-commerces que carregam instantaneamente em qualquer celular e aguentam o crescimento acelerado do seu negócio sem travar.
                </p>
              </div>
            </div>
          </ScrollReveal>

          {/* Bento 3: Sistema de gestão (Live Stats + Marquee Badges) */}
          <ScrollReveal delay={0.1} yOffset={35}>
            <div className="rounded-3xl border border-neutral-800 bg-[#080808] p-6 sm:p-8 flex flex-col justify-between h-full hover:border-[#22c55e]/40 transition-colors">
              <div className="rounded-2xl border border-neutral-800/80 bg-neutral-950 p-5 mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs text-neutral-400 font-medium">Desempenho Geral</p>
                    <p className="text-3xl font-black text-white mt-1">+49% <span className="text-xs text-[#4ade80] font-bold">+2.5% semana</span></p>
                  </div>
                  <div className="h-10 w-10 rounded-xl bg-[#22c55e]/10 text-[#22c55e] flex items-center justify-center">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                </div>

                {/* Tag Badges Carousel */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {[
                    'Preço fechado',
                    'Prazo por escrito',
                    'Suporte pós-entrega',
                    'Sem fidelidade',
                    'Aparece no Google',
                    'Sem dor de cabeça'
                  ].map((tag, idx) => (
                    <span key={idx} className="rounded-full bg-neutral-900 border border-neutral-800 px-3 py-1 text-[10px] font-semibold text-neutral-300">
                      ✓ {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-display text-xl font-bold text-white mb-2">Sistema de gestão sob medida</h3>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  Estoque, vendas, mensalidades e clientes num lugar só, feito exatamente sob medida para as necessidades do seu negócio.
                </p>
              </div>
            </div>
          </ScrollReveal>

          {/* Bento 4: Anúncios que trazem cliente (Radar Orbit com Leads) */}
          <ScrollReveal delay={0.2} yOffset={35}>
            <div className="rounded-3xl border border-neutral-800 bg-[#080808] p-6 sm:p-8 flex flex-col justify-between h-full hover:border-[#22c55e]/40 transition-colors">
              {/* Orbital Radar Visual */}
              <div className="relative h-52 rounded-2xl border border-neutral-800/80 bg-neutral-950 p-4 mb-8 flex items-center justify-center overflow-hidden">
                {/* Concentric Rings */}
                <div className="absolute w-44 h-44 rounded-full border border-neutral-800/60" />
                <div className="absolute w-28 h-28 rounded-full border border-[#22c55e]/20" />
                
                {/* Center Logo */}
                <div className="relative z-10 h-12 w-12 rounded-full bg-black border border-[#22c55e] p-2 flex items-center justify-center shadow-[0_0_20px_rgba(34,197,94,0.4)]">
                  <TechifyIcon className="h-full w-full" />
                </div>

                {/* Floating Lead Pills */}
                <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-neutral-900/90 border border-neutral-800 px-2.5 py-1 rounded-full text-[10px] font-medium text-white shadow-lg animate-bounce" style={{ animationDuration: '3s' }}>
                  <span className="h-2 w-2 rounded-full bg-[#22c55e]" />
                  <span>Alexandre H. <strong className="text-[#4ade80]">+6%</strong></span>
                </div>

                <div className="absolute bottom-4 right-4 flex items-center gap-1.5 bg-neutral-900/90 border border-neutral-800 px-2.5 py-1 rounded-full text-[10px] font-medium text-white shadow-lg animate-bounce" style={{ animationDuration: '4s' }}>
                  <span className="h-2 w-2 rounded-full bg-[#22c55e]" />
                  <span>Raimundo P. <strong className="text-[#4ade80]">+4.5%</strong></span>
                </div>
              </div>

              <div>
                <h3 className="font-display text-xl font-bold text-white mb-2">Anúncio que traz cliente</h3>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  Anúncios estratégicos no Google e Instagram para o cliente certo achar sua empresa exatamente na hora em que está buscando comprar.
                </p>
              </div>
            </div>
          </ScrollReveal>

        </div>
      </section>


      {/* ========================================================================= */}
      {/* 6. DEPOIMENTOS (TESTIMONIALS)                                             */}
      {/* ========================================================================= */}
      <section className="relative w-full py-20 bg-neutral-950/60 border-y border-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <ScrollReveal threshold={0.2}>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-black px-3.5 py-1 text-xs font-bold text-neutral-300 mb-4">
                  <div className="h-1.5 w-1.5 rounded-sm bg-[#22c55e]" />
                  <span>Depoimentos</span>
                </div>
                <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white">
                  O que dizem sobre nós?
                </h2>
                <p className="text-sm text-neutral-400 mt-2">
                  Histórias reais de quem acelerou seu negócio com a Techify.
                </p>
              </div>

              {/* Navigation buttons */}
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setCurrentTestimonial((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))}
                  className="h-10 w-10 rounded-full border border-neutral-800 bg-neutral-900 flex items-center justify-center text-neutral-300 hover:text-white hover:border-neutral-700 transition-colors cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => setCurrentTestimonial((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))}
                  className="h-10 w-10 rounded-full border border-neutral-800 bg-neutral-900 flex items-center justify-center text-neutral-300 hover:text-white hover:border-neutral-700 transition-colors cursor-pointer"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testi, idx) => (
              <ScrollReveal key={idx} delay={idx * 0.12} yOffset={30}>
                <div 
                  className={`rounded-3xl border p-8 flex flex-col justify-between transition-all h-full ${
                    idx === currentTestimonial 
                      ? 'border-[#22c55e]/50 bg-[#061709] shadow-[0_0_30px_rgba(34,197,94,0.15)]' 
                      : 'border-neutral-800 bg-[#0a0a0a]'
                  }`}
                >
                  <div className="mb-6">
                    <div className="flex items-center gap-1 text-[#facc15] mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                    <p className="text-sm sm:text-base text-neutral-200 leading-relaxed italic">
                      "{testi.quote}"
                    </p>
                  </div>

                  <div className="flex items-center gap-3 pt-6 border-t border-neutral-800/80">
                    <img src={testi.avatar} alt={testi.author} className="h-10 w-10 rounded-full object-cover border border-neutral-700" />
                    <div>
                      <h4 className="text-sm font-bold text-white">{testi.author}</h4>
                      <p className="text-xs text-neutral-400">{testi.role}</p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

        </div>
      </section>


      {/* ========================================================================= */}
      {/* 7. BLOG & ARTIGOS / DÚVIDAS DOS DONOS DE NEGÓCIO                         */}
      {/* ========================================================================= */}
      <section className="relative w-full py-24 sm:py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal threshold={0.2}>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-950 px-3.5 py-1 text-xs font-bold text-neutral-300 mb-4">
                <div className="h-1.5 w-1.5 rounded-sm bg-[#22c55e]" />
                <span>Blog e artigos</span>
              </div>
              <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-white leading-tight">
                As dúvidas que todo dono de negócio tem
              </h2>
              <p className="text-sm sm:text-base text-neutral-400 mt-2">
                Respostas diretas sobre site, sistema e anúncios, sem termos técnicos complicados.
              </p>
            </div>

            <button
              onClick={() => onNavigate('carreiras')}
              className="w-fit rounded-full border border-neutral-800 bg-neutral-900 hover:bg-neutral-800 px-6 py-3 text-xs font-bold text-white transition-colors cursor-pointer shrink-0"
            >
              VER TODOS OS ARTIGOS
            </button>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((art, idx) => (
            <ScrollReveal key={art.id} delay={idx * 0.12} yOffset={35}>
              <motion.div
                whileHover={{ y: -6 }}
                onClick={() => setSelectedArticle(art.id)}
                className="group rounded-3xl border border-neutral-800 bg-[#080808] overflow-hidden flex flex-col justify-between cursor-pointer hover:border-neutral-700 transition-all shadow-lg h-full"
              >
                <div className="relative h-48 w-full overflow-hidden bg-neutral-900">
                  <img src={art.image} alt={art.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <span className="absolute top-3 left-3 rounded-md bg-black/80 backdrop-blur-md px-2.5 py-1 text-[10px] font-bold text-[#4ade80] border border-[#22c55e]/30">
                    {art.category}
                  </span>
                </div>

                <div className="p-6 flex flex-col justify-between flex-1">
                  <div>
                    <h3 className="font-display text-base sm:text-lg font-bold text-white group-hover:text-[#4ade80] transition-colors leading-snug mb-3">
                      {art.title}
                    </h3>
                    <p className="text-xs text-neutral-400 leading-relaxed line-clamp-3">
                      {art.summary}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-neutral-900 flex items-center justify-between text-xs text-neutral-500">
                    <span>{art.readTime}</span>
                    <span className="text-[#4ade80] font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Ler artigo <ChevronRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>

        {/* Modal for Article Reading */}
        {selectedArticle !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="relative w-full max-w-2xl rounded-3xl border border-neutral-800 bg-[#0a0a0a] p-6 sm:p-8 text-left shadow-2xl">
              {(() => {
                const article = articles.find(a => a.id === selectedArticle);
                if (!article) return null;
                return (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="rounded-md bg-[#22c55e]/10 border border-[#22c55e]/30 px-2.5 py-1 text-xs font-bold text-[#4ade80]">
                        {article.category}
                      </span>
                      <button 
                        onClick={() => setSelectedArticle(null)}
                        className="text-neutral-400 hover:text-white text-sm font-bold cursor-pointer"
                      >
                        Fechar ✕
                      </button>
                    </div>

                    <h3 className="font-display text-2xl font-bold text-white mb-4">
                      {article.title}
                    </h3>

                    <div className="h-48 w-full rounded-2xl overflow-hidden mb-6">
                      <img src={article.image} alt={article.title} className="h-full w-full object-cover" />
                    </div>

                    <p className="text-sm text-neutral-300 leading-relaxed mb-6 font-normal">
                      {article.content}
                    </p>

                    <div className="pt-4 border-t border-neutral-800 flex justify-end">
                      <button
                        onClick={() => {
                          setSelectedArticle(null);
                          onOpenConsultation();
                        }}
                        className="rounded-full bg-[#22c55e] px-6 py-2.5 text-xs font-bold text-black hover:bg-[#16a34a] transition-colors cursor-pointer"
                      >
                        Falar com Engenheiro Techify
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}
      </section>


      {/* ========================================================================= */}
      {/* 8. HIGH-IMPACT FINAL CTA BANNER (Enquanto você decide...)                 */}
      {/* ========================================================================= */}
      <section className="relative w-full py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <ScrollReveal threshold={0.2} duration={0.8} yOffset={35}>
          <div className="relative overflow-hidden rounded-3xl border border-neutral-800 bg-gradient-to-b from-[#08170c] via-[#040a06] to-black p-8 sm:p-16 text-center flex flex-col items-center">
            
            {/* Subtle Glow Background */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#22c55e]/15 blur-[120px] pointer-events-none" />

            {/* Headline */}
            <h2 className="relative z-10 font-display text-3xl sm:text-5xl md:text-6xl font-extrabold text-white max-w-3xl leading-[1.1] tracking-tight">
              Enquanto você decide, <br />
              <span className="text-[#4ade80]">o cliente compra do concorrente</span>
            </h2>

            <p className="relative z-10 mt-6 max-w-2xl text-sm sm:text-base text-neutral-300 leading-relaxed font-normal">
              Cada dia sem site e sem anúncio é venda indo para outro. A gente coloca o seu negócio na frente, com preço fechado antes de começar e prazo combinado por escrito.
            </p>

            <div className="relative z-10 mt-10">
              <button
                onClick={onOpenConsultation}
                className="group inline-flex items-center gap-3 rounded-full bg-[#22c55e] hover:bg-[#16a34a] px-8 py-4 text-sm font-bold tracking-wide text-black transition-all shadow-[0_0_30px_rgba(34,197,94,0.4)] cursor-pointer"
              >
                <span>QUERO APARECER PRIMEIRO</span>
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-black/20 text-black group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                  <ArrowUpRight className="h-4 w-4" />
                </div>
              </button>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Floating Instant WhatsApp Button in bottom corner */}
      <a
        href="https://wa.me/5581995498590?text=Ol%C3%A1,%20gostaria%20de%20um%20or%C3%A7amento%20com%20a%20Techify!"
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#22c55e] text-black shadow-[0_0_25px_rgba(34,197,94,0.5)] hover:scale-110 transition-all cursor-pointer"
        aria-label="Falar no WhatsApp"
      >
        <MessageCircle className="h-7 w-7" />
      </a>

    </div>
  );
}
