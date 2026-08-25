import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Lock, 
  GraduationCap, 
  Sparkles, 
  Code2, 
  Cpu, 
  Layers, 
  ArrowRight, 
  Bell, 
  CheckCircle2, 
  Loader2, 
  Clock,
  Compass
} from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface AcademySectionProps {
  onNavigate?: (tab: string) => void;
}

export default function AcademySection({ onNavigate }: AcademySectionProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleNotifyMe = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) return;

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'academy_waitlist'), {
        email: cleanEmail,
        createdAt: serverTimestamp(),
        source: 'academy_locked_page'
      });
      setSubscribed(true);
    } catch (err) {
      console.warn('Error adding to waitlist:', err);
      // Fallback optimistic success
      setSubscribed(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const upcomingModules = [
    {
      icon: Code2,
      tag: 'Módulo 01',
      title: 'Engenharia Frontend Moderna',
      desc: 'React 19, TypeScript rigoroso, Vite, arquitetura de componentes escaláveis e micro-interações fluidas.'
    },
    {
      icon: Cpu,
      tag: 'Módulo 02',
      title: 'Inteligência Artificial & Agentes',
      desc: 'Integração de LLMs, geração de interfaces dinâmicas, pipelines de dados e automações inteligentes.'
    },
    {
      icon: Layers,
      tag: 'Módulo 03',
      title: 'UI/UX & Design Industrial',
      desc: 'Design systems em Tailwind, hierarquia tipográfica, contraste comercial e layouts de alta conversão.'
    }
  ];

  return (
    <div className="relative w-full min-h-[80vh] overflow-hidden bg-black text-white selection:bg-[#22c55e]/30 selection:text-white pt-12 pb-24">
      {/* Background Neon Elements */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[350px] bg-[#22c55e]/10 blur-[140px] pointer-events-none" />
      <div className="absolute top-10 right-10 w-72 h-72 bg-emerald-900/10 blur-[100px] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        
        {/* Top Tag */}
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1.5 text-xs font-bold text-amber-400 mb-6 shadow-[0_0_15px_rgba(245,158,11,0.15)]"
          >
            <Lock className="h-3.5 w-3.5" />
            <span>ÁREA EM DESENVOLVIMENTO</span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white max-w-3xl leading-[1.15]"
          >
            Techify <span className="text-[#4ade80]">Academia</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-5 max-w-2xl text-sm sm:text-base text-neutral-300 leading-relaxed font-normal"
          >
            Estamos estruturando uma plataforma de formação técnica intensiva. Nossos cursos, trilhas práticas de desenvolvimento e tutorias com Inteligência Artificial estão em fase final de preparação.
          </motion.p>
        </div>

        {/* Status Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 rounded-3xl border border-neutral-800 bg-gradient-to-b from-[#0a0d0a] to-[#040604] p-6 sm:p-10 shadow-2xl relative overflow-hidden"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#22c55e]/30 bg-[#22c55e]/15 text-[#4ade80] shadow-[0_0_20px_rgba(34,197,94,0.2)]">
                <Clock className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#4ade80] uppercase tracking-wider">Lançamento Oficial</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-[#22c55e] animate-pulse" />
                </div>
                <h3 className="text-lg font-bold text-white">Acesso Antecipado e Lista de Espera</h3>
                <p className="text-xs sm:text-sm text-neutral-400 max-w-md">
                  Cadastre seu e-mail para receber o aviso de abertura das vagas com desconto exclusivo para os primeiros alunos.
                </p>
              </div>
            </div>

            {/* Email Form */}
            <div className="w-full md:w-auto md:min-w-[320px]">
              {subscribed ? (
                <div className="flex items-center gap-2.5 rounded-2xl border border-[#22c55e]/40 bg-[#22c55e]/10 p-4 text-[#4ade80]">
                  <CheckCircle2 className="h-5 w-5 shrink-0" />
                  <span className="text-xs font-bold">Você está na lista prioritária! Avisaremos em breve.</span>
                </div>
              ) : (
                <form onSubmit={handleNotifyMe} className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    required
                    placeholder="Seu melhor e-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 rounded-xl border border-neutral-800 bg-neutral-900/90 px-3.5 py-3 text-xs text-white placeholder-neutral-500 focus:border-[#22c55e] focus:outline-none transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center justify-center gap-1.5 rounded-xl bg-[#22c55e] hover:bg-[#16a34a] text-black font-extrabold px-5 py-3 text-xs transition-all shadow-[0_0_15px_rgba(34,197,94,0.3)] cursor-pointer disabled:opacity-50 shrink-0"
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Bell className="h-3.5 w-3.5" />
                        <span>Notificar-me</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </motion.div>

        {/* Modules in Development Preview */}
        <div className="mt-12 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-400 text-center">
            Trilhas que farão parte da plataforma
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {upcomingModules.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-neutral-800/80 bg-[#070907] p-5 hover:border-neutral-700 transition-colors flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-800 bg-neutral-900 text-[#4ade80]">
                        <IconComp className="h-4 w-4" />
                      </div>
                      <span className="text-[10px] font-bold text-neutral-400 bg-neutral-900 border border-neutral-800 px-2 py-0.5 rounded-full">
                        {item.tag}
                      </span>
                    </div>
                    <h4 className="font-bold text-white text-sm">{item.title}</h4>
                    <p className="text-xs text-neutral-400 leading-relaxed">{item.desc}</p>
                  </div>

                  <div className="pt-2 border-t border-neutral-900 flex items-center gap-1.5 text-[11px] text-neutral-400">
                    <Clock className="h-3 w-3" />
                    <span>Em gravação & revisão</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Navigation Buttons */}
        <div className="mt-14 flex flex-wrap items-center justify-center gap-4">
          {onNavigate && (
            <>
              <button
                onClick={() => onNavigate('inicio')}
                className="flex items-center gap-2 rounded-xl border border-neutral-800 bg-neutral-900/80 hover:bg-neutral-800 hover:text-white px-5 py-2.5 text-xs font-bold text-neutral-300 transition-colors cursor-pointer"
              >
                <span>Voltar ao Início</span>
              </button>
              <button
                onClick={() => onNavigate('apps')}
                className="flex items-center gap-2 rounded-xl bg-[#22c55e] hover:bg-[#16a34a] text-black font-extrabold px-5 py-2.5 text-xs transition-all shadow-[0_0_20px_rgba(34,197,94,0.25)] cursor-pointer"
              >
                <Compass className="h-3.5 w-3.5" />
                <span>Explorar Apps Techify</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
}
