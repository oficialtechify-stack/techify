import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowUpRight, 
  Users, 
  Globe, 
  Code, 
  Layers, 
  Sparkles, 
  Check, 
  Linkedin, 
  Instagram, 
  Mail, 
  Phone,
  MessageCircle,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  Cpu,
  Monitor,
  Camera,
  Pencil
} from 'lucide-react';
import { TechifyIcon } from './TechifyLogo';
import { 
  TeamMember, 
  SiteGeneralContent, 
  DEFAULT_TEAM_MEMBERS, 
  DEFAULT_SITE_CONTENT,
  getCachedTeamMembers,
  getCachedGeneralContent,
  saveTeamMembersToFirestore
} from '../lib/siteContent';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { EditableText, EditableImage, EditableIcon, useInlineEdit } from './InlineEditProvider';
import { compressImageFile } from '../lib/imageUtils';

interface AboutSectionProps {
  onNavigate: (tab: string) => void;
  onOpenConsultation: () => void;
}

export default function AboutSection({ onNavigate, onOpenConsultation }: AboutSectionProps) {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(getCachedTeamMembers);
  const [generalContent, setGeneralContent] = useState<SiteGeneralContent>(getCachedGeneralContent);

  useEffect(() => {
    const unsubTeam = onSnapshot(doc(db, "site_content", "team"), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        if (Array.isArray(data.members) && data.members.length > 0) {
          setTeamMembers(data.members);
        }
      }
    }, (err) => console.warn('Firestore team offline:', err.message));

    const unsubGeneral = onSnapshot(doc(db, "site_content", "general"), (snap) => {
      if (snap.exists()) {
        const data = snap.data() as Partial<SiteGeneralContent>;
        setGeneralContent(prev => ({ ...prev, ...data }));
      }
    }, (err) => console.warn('Firestore content offline:', err.message));

    const handleTeamUpdate = (e: Event) => {
      const customEvt = e as CustomEvent<TeamMember[]>;
      if (customEvt.detail) setTeamMembers(customEvt.detail);
    };

    const handleContentUpdate = (e: Event) => {
      const customEvt = e as CustomEvent<SiteGeneralContent>;
      if (customEvt.detail) setGeneralContent(customEvt.detail);
    };

    window.addEventListener('techify-team-updated', handleTeamUpdate);
    window.addEventListener('techify-content-updated', handleContentUpdate);

    return () => {
      unsubTeam();
      unsubGeneral();
      window.removeEventListener('techify-team-updated', handleTeamUpdate);
      window.removeEventListener('techify-content-updated', handleContentUpdate);
    };
  }, []);

  const trustedAvatars = [
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
    "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&q=80",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80",
    "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=120&q=80"
  ];

  return (
    <div className="relative w-full overflow-hidden bg-black text-white selection:bg-[#22c55e]/30 selection:text-white">
      
      {/* ========================================================================= */}
      {/* 1. HERO SPLIT SECTION (Matched exactly to reference image)                */}
      {/* ========================================================================= */}
      <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* Left Column (5.5 cols): Copy & CTA matching image */}
          <div className="lg:col-span-6 flex flex-col items-start justify-center rounded-3xl bg-[#090b09] border border-neutral-800/80 p-8 sm:p-12 lg:p-14 h-full min-h-[460px] relative overflow-hidden">
            
            {/* Ambient subtle glow */}
            <div className="absolute -top-12 -left-12 w-64 h-64 bg-[#22c55e]/10 rounded-full blur-3xl pointer-events-none" />

            {/* Trusted by avatars label */}
            <div className="flex items-center gap-3 mb-8">
              <span className="text-xs sm:text-sm font-medium text-neutral-300">
                Empresas que confiam na Techify
              </span>
              <div className="flex -space-x-2">
                {trustedAvatars.slice(0, 3).map((img, i) => (
                  <img 
                    key={i} 
                    src={img} 
                    alt="Client" 
                    className="h-6 w-6 rounded-full border-2 border-black object-cover" 
                  />
                ))}
              </div>
            </div>

            {/* Headline */}
            <motion.h1 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-[1.15] tracking-tight"
            >
              Você não precisa entender de tecnologia. <br className="hidden sm:block" />
              <span className="text-neutral-300">Precisa de resultado.</span>
            </motion.h1>

            {/* Description */}
            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-6 text-sm sm:text-base text-neutral-400 leading-relaxed font-normal max-w-lg"
            >
              A gente traduz. Você diz o que está travando o seu negócio e a gente resolve com site, sistema ou anúncio, explicando cada passo sem termo técnico.
            </motion.p>

            {/* Primary Action Button */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-8"
            >
              <button
                onClick={onOpenConsultation}
                className="group relative inline-flex items-center gap-3 rounded-full bg-black hover:bg-neutral-900 border border-neutral-700 px-7 py-3.5 text-xs sm:text-sm font-bold tracking-wide text-white transition-all shadow-[0_0_20px_rgba(0,0,0,0.5)] cursor-pointer"
              >
                <span>QUERO APARECER PRIMEIRO</span>
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#22c55e] text-black group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                  <ArrowUpRight className="h-4 w-4 stroke-[2.5]" />
                </div>
              </button>
            </motion.div>

          </div>

          {/* Right Column (6.5 cols): Office Image with 3D Hologram Floating Cards */}
          <div className="lg:col-span-6 relative h-[420px] sm:h-[500px] rounded-3xl overflow-hidden border border-neutral-800/90 shadow-2xl bg-neutral-950">
            {/* Background Office Photo */}
            <img 
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80" 
              alt="Techify Team" 
              className="h-full w-full object-cover brightness-[0.85] contrast-[1.05]"
            />
            
            {/* Vignette Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

            {/* Floating Glassmorphic 3D Card: Especialidade */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="absolute top-12 left-6 sm:left-10 rounded-2xl bg-black/85 backdrop-blur-xl border border-neutral-700/80 p-4 shadow-2xl max-w-[190px] select-none pointer-events-none"
            >
              <div className="flex items-center gap-1.5 mb-2">
                <span className="text-xs font-bold text-white">Especialidade</span>
                <div className="h-3.5 w-3.5 rounded-full bg-[#22c55e] flex items-center justify-center text-[8px] text-black font-black">
                  ✓
                </div>
              </div>
              <p className="text-[11px] text-neutral-300 leading-snug">
                que une <strong className="text-white">Estratégia</strong>, <strong className="text-white">Design</strong> e <strong className="text-[#4ade80]">Tecnologia</strong> de ponta.
              </p>
            </motion.div>

            {/* Floating Glassmorphic 3D Card: Cobrança Mensal $4,900 / $10,000 */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="absolute bottom-10 right-6 sm:right-10 rounded-2xl bg-white/95 text-neutral-900 backdrop-blur-xl border border-white/40 p-4 sm:p-5 shadow-[0_20px_50px_rgba(0,0,0,0.6)] w-60 sm:w-64 select-none"
            >
              <p className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">Cobrança mensal</p>
              <div className="flex items-baseline gap-1 mt-0.5 mb-3">
                <span className="text-lg font-black text-neutral-900">$ 4,900</span>
                <span className="text-xs font-semibold text-neutral-400">/ $10,000</span>
              </div>

              {/* Progress */}
              <div className="w-full h-1.5 rounded-full bg-neutral-200 overflow-hidden mb-3">
                <div className="h-full bg-[#22c55e] w-[49%]" />
              </div>

              {/* Mini entries */}
              <div className="space-y-1.5 text-[10px]">
                <div className="flex items-center justify-between p-1.5 rounded-lg bg-neutral-100/90 font-medium">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-[#22c55e]" />
                    <span className="font-bold text-neutral-900">Premium</span>
                  </div>
                  <span className="font-bold text-neutral-800">$120</span>
                </div>
                <div className="flex items-center justify-between p-1.5 rounded-lg bg-neutral-100/90 font-medium">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-[#22c55e]" />
                    <span className="font-bold text-neutral-900">Enterprise</span>
                  </div>
                  <span className="font-bold text-neutral-800">$450</span>
                </div>
              </div>
            </motion.div>

          </div>

        </div>
      </section>


      {/* ========================================================================= */}
      {/* 2. MANIFESTO HEADLINE (A empresa digital dedicada a criar sistemas...)     */}
      {/* ========================================================================= */}
      <section className="relative w-full py-20 border-t border-neutral-900 bg-[#050505]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          
          <div className="inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-950 px-3.5 py-1 text-xs font-bold text-neutral-300 mb-6">
            <div className="h-1.5 w-1.5 rounded-sm bg-[#22c55e]" />
            <span>Sobre nós</span>
          </div>

          <h2 className="font-display text-3xl sm:text-5xl md:text-6xl font-extrabold text-white leading-[1.15] tracking-tight">
            A empresa digital dedicada a criar sistemas, sites{' '}
            <span className="inline-flex items-center align-middle mx-1 text-[#22c55e]">
              <span className="h-7 w-7 sm:h-9 sm:w-9 rounded-full bg-[#22c55e]/20 border border-[#22c55e] inline-flex items-center justify-center text-xs">
                ⚡
              </span>
            </span>{' '}
            e <br />
            <span className="text-[#22c55e]">marketing</span>{' '}
            <span className="inline-flex items-center align-middle mx-1">
              <span className="h-7 w-7 sm:h-9 sm:w-9 rounded-full bg-[#22c55e] inline-flex items-center justify-center text-black font-bold text-xs">
                💡
              </span>
            </span>{' '}
            sob medida
          </h2>

          {/* Social Trust Avatars Group */}
          <div className="mt-12 flex flex-col items-center gap-3">
            <div className="flex -space-x-2.5 items-center">
              {trustedAvatars.map((img, i) => (
                <img 
                  key={i} 
                  src={img} 
                  alt="Avatar" 
                  className="h-10 w-10 rounded-full border-2 border-black object-cover shadow-lg" 
                />
              ))}
              <div className="h-10 w-10 rounded-full border-2 border-black bg-[#22c55e] text-black font-black text-xs flex items-center justify-center shadow-lg">
                +
              </div>
            </div>
            <span className="text-xs sm:text-sm font-semibold text-neutral-400">
              Empresas que confiam na Techify
            </span>
          </div>

        </div>
      </section>


      {/* ========================================================================= */}
      {/* 3. TIME EXECUTIVO / CONHEÇA NOSSO TIME (Exact 4 Cards from reference)      */}
      {/* ========================================================================= */}
      <section className="relative w-full py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-950 px-3.5 py-1 text-xs font-bold text-neutral-300 mb-4">
            <div className="h-1.5 w-1.5 rounded-sm bg-[#22c55e]" />
            <span>Times</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-white">
              Conheça nosso time
            </h2>

            <button
              onClick={onOpenConsultation}
              className="group inline-flex items-center gap-2 rounded-full bg-black hover:bg-neutral-900 border border-neutral-700 px-6 py-3 text-xs font-bold text-white transition-all cursor-pointer w-fit"
            >
              <span>FALE CONOSCO</span>
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#22c55e] text-black group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                <ArrowUpRight className="h-3 w-3 stroke-[2.5]" />
              </div>
            </button>
          </div>
        </div>

        {/* 4 Team Member Cards with Larger Visual Photos & Inline Editing */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((member, idx) => (
            <motion.div
              key={member.id || idx}
              initial={{ opacity: 0, y: 30, filter: 'blur(10px)', scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }}
              viewport={{ once: false, amount: 0.15 }}
              transition={{ duration: 0.65, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="group relative rounded-3xl border border-neutral-800 bg-[#090b09] p-5 flex flex-col justify-between hover:border-[#22c55e]/50 hover:bg-[#0c120c] transition-all duration-300 shadow-xl"
            >
              <div>
                {/* Large Portrait Image Container */}
                <div className="relative h-64 sm:h-72 w-full rounded-2xl bg-neutral-900 border border-neutral-800/80 overflow-hidden mb-4 shadow-lg group-hover:border-[#22c55e]/40 transition-all">
                  <EditableImage
                    id={`team_avatar_${member.id || idx}`}
                    defaultSrc={member.avatar}
                    alt={member.name}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    title={`Foto de ${member.name}`}
                  />
                  
                  {/* Subtle gradient vignette at bottom */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                  {/* Corner Action Icon */}
                  <div className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/80 border border-neutral-700 text-neutral-300 backdrop-blur-sm group-hover:text-[#4ade80] group-hover:border-[#22c55e]/50 transition-all">
                    <ArrowUpRight className="h-4 w-4" />
                  </div>
                </div>

                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <h3 className="font-display text-lg font-bold text-white group-hover:text-[#4ade80] transition-colors leading-snug">
                      <EditableText
                        id={`team_name_${member.id || idx}`}
                        defaultText={member.name}
                        title={`Nome: ${member.name}`}
                      />
                    </h3>
                    <p className="mt-0.5 text-xs font-semibold text-[#a3e635]">
                      <EditableText
                        id={`team_role_${member.id || idx}`}
                        defaultText={member.role}
                        title={`Cargo: ${member.name}`}
                      />
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-neutral-900/80">
                <p className="text-xs text-neutral-400 leading-relaxed">
                  <EditableText
                    id={`team_desc_${member.id || idx}`}
                    defaultText={member.description}
                    title={`Bio: ${member.name}`}
                    isMultiline={true}
                  />
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </section>


      {/* ========================================================================= */}
      {/* 4. FINAL IMPACT CONVERSION BANNER (Enquanto você decide...)                 */}
      {/* ========================================================================= */}
      <section className="relative w-full py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="relative overflow-hidden rounded-3xl border border-neutral-800 bg-gradient-to-b from-[#0a120a] to-[#040804] p-8 sm:p-14 lg:p-16 shadow-2xl">
          
          {/* Subtle Grid / Chart Graphic Background Overlay */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top,#22c55e,transparent_60%)] pointer-events-none" />
          <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-[#22c55e]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl">
            
            {/* Top Avatars Proof */}
            <div className="flex items-center gap-3 mb-8">
              <span className="text-xs font-semibold text-neutral-300">
                Empresas que confiam na Techify
              </span>
              <div className="flex -space-x-2">
                {trustedAvatars.slice(0, 3).map((img, i) => (
                  <img key={i} src={img} alt="Client" className="h-6 w-6 rounded-full border-2 border-black object-cover" />
                ))}
              </div>
            </div>

            {/* Title */}
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-white leading-tight">
              Enquanto você decide, <br />
              <span className="text-neutral-400">o cliente compra do concorrente</span>
            </h2>

            {/* Paragraph */}
            <p className="mt-6 text-sm sm:text-base text-neutral-300 leading-relaxed max-w-2xl font-normal">
              Cada dia sem site e sem anúncio é venda indo para outro. A Techify coloca o seu negócio na frente, com preço fechado antes de começar e prazo combinado por escrito.
            </p>

            {/* CTA Button */}
            <div className="mt-8">
              <button
                onClick={onOpenConsultation}
                className="group inline-flex items-center gap-3 rounded-full bg-[#22c55e] hover:bg-[#16a34a] px-8 py-4 text-xs sm:text-sm font-bold tracking-wide text-black transition-all shadow-[0_0_30px_rgba(34,197,94,0.4)] cursor-pointer"
              >
                <span>QUERO APARECER PRIMEIRO</span>
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-black/20 text-black group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </div>
              </button>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
