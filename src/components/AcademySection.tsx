import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  GraduationCap, 
  Sparkles, 
  Languages, 
  MessageCircle, 
  Play, 
  Send, 
  Cpu, 
  BookOpen, 
  Award, 
  Globe2, 
  UserCheck,
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { Course } from '../types';
import { COURSES } from '../data';

export default function AcademySection() {
  const [selectedTopic, setSelectedTopic] = useState<'tutor' | 'idiomas' | 'cursos' | null>('tutor');
  const [chatMessages, setChatMessages] = useState<{ sender: 'user' | 'tutor'; text: string; time: string }[]>([
    { sender: 'tutor', text: 'Olá! Sou a Inteligência Artificial Tutora da Techify Academy. Posso te ensinar programação, ajudar no design UI/UX, corrigir seus códigos ou traduzir idiomas. Qual o seu objetivo de aprendizado hoje?', time: '09:42' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [activeLanguage, setActiveLanguage] = useState('Inglês');
  const [lessonProgress, setLessonProgress] = useState(0);

  // Simulated AI answers to queries
  const getSimulatedTutorResponse = (query: string): string => {
    const q = query.toLowerCase();
    if (q.includes('react') || q.includes('next')) {
      return 'Excelente escolha! O React 19 introduziu Server Actions, o hook use() e suporte offline aprimorado. Na Techify, combinamos React com Vite ou Next.js para renderização híbrida rápida. Experimente estudar hooks essenciais como useState, useEffect e useMemo!';
    }
    if (q.includes('html') || q.includes('css') || q.includes('web')) {
      return 'O HTML5 fornece a estrutura semântica (<main>, <section>, <article>), enquanto o CSS3 (com ajuda do Tailwind CSS em nossos projetos) estiliza as páginas usando utilitários responsivos. Para começar, experimente flexbox e grid layouts!';
    }
    if (q.includes('design') || q.includes('ui') || q.includes('ux') || q.includes('figma')) {
      return 'Design industrial de alta performance segue três regras fundamentais: 1. Hierarquia Tipográfica nítida, 2. Uso estruturado de Espaço Negativo para descanso ocular, e 3. Paleta de Cores de alto contraste comercial (como nosso cinza profundo e neon-accent).';
    }
    if (q.includes('typescript') || q.includes('js') || q.includes('javascript')) {
      return 'TypeScript é um superconjunto de JavaScript que adiciona tipagem estática opcional. Isso evita bugs de compilação absurdos antes que o código chegue em produção! Declarar interfaces estritas é a nossa lei na Techify.';
    }
    if (q.includes('bom dia') || q.includes('olá') || q.includes('ola') || q.includes('oi')) {
      return 'Olá! Desejo um excelente dia de aprendizados. O que você gostaria de explorar hoje? Tenho tópicos preparados sobre Engenharia de Software, Design Visual e SEO Otimizado!';
    }
    return 'Entendido! Como sua Tutora IA Techify Core, recomendo explorarmos essa trilha estrutural. Na nossa equipe, aplicamos esses conceitos criando plataformas que aliam estética agressiva a carregamento instantâneo. Gostaria de ver um exemplo de código ou um guia prático?';
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage = chatInput;
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setChatMessages(prev => [...prev, { sender: 'user', text: userMessage, time: now }]);
    setChatInput('');

    // Simulate thinking briefly
    setTimeout(() => {
      const reply = getSimulatedTutorResponse(userMessage);
      setChatMessages(prev => [...prev, { sender: 'tutor', text: reply, time: now }]);
    }, 850);
  };

  const languageLessons = {
    'Inglês': {
      title: 'Slangs & Business Talk in NY',
      phrase: 'Let\'s touch base on the visual branding deliverables by tomorrow morning.',
      translation: 'Vamos nos alinhar sobre as entregas de identidade visual até amanhã de manhã.',
      tip: '"Touch base" é uma expressão corporativa muito usada nos EUA para indicar uma conversa curta de alinhamento.'
    },
    'Espanhol': {
      title: 'Diseño y Programación de Alto Nivel',
      phrase: 'La interfaz gráfica debe ser intuitiva y el código supersencillo de mantener.',
      translation: 'A interface gráfica deve ser intuitiva e o código supersimples de manter.',
      tip: 'Em espanhol técnico, costuma-se usar "interfaz" para interface e "sencillo" para simples ou limpo.'
    },
    'Japonês': {
      title: 'Tecnologia Avançada em Tokyo',
      phrase: 'インタフェースは美しく、コードは非常に高速でなければなりません。 (Intafēsu wa utsukushiku, kōdo wa hijō ni kōsoku de nakereba narimasen.)',
      translation: 'A interface deve ser bonita e o código deve ser extremamente veloz.',
      tip: '"Intafēsu" é a transliteração de interface. "Kōsoku" significa alta velocidade ou performance extrema.'
    },
    'Francês': {
      title: 'Design Minimaliste Parisien',
      phrase: 'Le design épuré attire l\'attention des utilisateurs modernes de manière subtile.',
      translation: 'O design minimalista atrai a atenção dos usuários modernos de maneira sutil.',
      tip: '"Épuré" refere-se a algo purificado, limpo ou refinado, correspondendo ao conceito moderno de espaço negativo.'
    }
  };

  const currentLesson = languageLessons[activeLanguage as keyof typeof languageLessons] || languageLessons['Inglês'];

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-[#030303] bg-nebula pb-24 pt-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Page Top Title matching screenshots */}
        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-500/20 bg-violet-500/5 px-4 py-1.5 text-xs text-violet-400 tracking-widest uppercase font-semibold mb-6">
            <GraduationCap className="h-3.5 w-3.5" />
            <span>ACADEMIA TECHIFY</span>
          </span>

          <h1 className="font-display text-4xl font-black tracking-tighter text-white sm:text-6xl uppercase leading-none">
            CONHECIMENTO <br />
            <span className="text-brand-lime text-glow-green inline-block italic transform skew-x-[-3deg] mt-2 border-b-2 border-brand-lime pb-1">
              SEM LIMITES.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-center text-sm leading-relaxed text-neutral-400">
            Nossa IA proprietária gera trilhas personalizadas de aprendizado em tempo real. Programação, design e high-performance ao seu alcance, totalmente grátis.
          </p>
        </div>

        {/* Stats segment (Image 6) */}
        <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4 max-w-4xl mx-auto">
          {[
            { value: '25+', label: 'CURSOS GRATUITOS', icon: BookOpen, color: 'text-brand-lime' },
            { value: '8', label: 'IDIOMAS', icon: Globe2, color: 'text-brand-cyan' },
            { value: '24/7', label: 'IA TUTORA', icon: Sparkles, color: 'text-violet-400' },
            { value: '100%', label: 'CERTIFICADOS', icon: Award, color: 'text-emerald-400' },
          ].map((stat, idx) => (
            <div key={idx} className="rounded-xl border border-neutral-900 bg-neutral-950/40 p-5 text-center flex flex-col items-center">
              <div className={`mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-900 ${stat.color}`}>
                <stat.icon className="h-4 w-4" />
              </div>
              <h3 className="font-display text-3xl font-extrabold text-white">
                {stat.value}
              </h3>
              <p className="mt-1 text-[9px] font-black tracking-widest text-neutral-500">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Dynamic Category Tabs Selection */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1 Selector (Tutor AI Chat) */}
          <button
            onClick={() => setSelectedTopic('tutor')}
            className={`rounded-2xl border p-6 text-left transition-all duration-300 relative overflow-hidden ${
              selectedTopic === 'tutor'
                ? 'border-violet-500/50 bg-violet-950/10 shadow-[0_4px_25px_rgba(124,58,237,0.15)]'
                : 'border-neutral-800 bg-[#070707] hover:border-neutral-700'
            }`}
          >
            <span className="absolute right-4 top-4 rounded bg-violet-500/20 border border-violet-500/20 px-2.5 py-0.5 text-[9px] font-black text-violet-400">IA</span>
            <div className="h-10 w-10 rounded-lg bg-violet-950/30 border border-violet-800/20 text-violet-400 flex items-center justify-center mb-4">
              <MessageCircle className="h-5 w-5" />
            </div>
            <h3 className="font-display text-lg font-black text-white mb-2">IA Tutora 24/7</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Responda dúvidas de código, aprenda conceitos lógicos de algoritmos e guie-se com chat em tempo real instantaneamente.
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-violet-400">
              <span>Falar com Tutora IA</span>
              <Play className="h-3 w-3 fill-current" />
            </div>
          </button>

          {/* Card 2 Selector (Aprenda Idiomas) */}
          <button
            onClick={() => setSelectedTopic('idiomas')}
            className={`rounded-2xl border p-6 text-left transition-all duration-300 relative overflow-hidden ${
              selectedTopic === 'idiomas'
                ? 'border-brand-cyan/50 bg-brand-cyan/5 shadow-[0_4px_25px_rgba(6,182,212,0.15)]'
                : 'border-neutral-800 bg-[#070707] hover:border-neutral-700'
            }`}
          >
            <span className="absolute right-4 top-4 rounded bg-brand-cyan/20 border border-brand-cyan/20 px-2.5 py-0.5 text-[9px] font-black text-brand-cyan">MULTI-LÍNGUAS</span>
            <div className="h-10 w-10 rounded-lg bg-brand-cyan/10 border border-brand-cyan/20 text-brand-cyan flex items-center justify-center mb-4">
              <Languages className="h-5 w-5" />
            </div>
            <h3 className="font-display text-lg font-black text-white mb-2">Aprenda Idiomas</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Inglês corporativo, Espanhol para design, Japonês moderno, Francês... com gírias e imersão em cultura tecnológica real.
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-brand-cyan">
              <span>Iniciar Aulas Práticas</span>
              <Play className="h-3 w-3 fill-current" />
            </div>
          </button>

          {/* Card 3 Selector (Cursos Livres) */}
          <button
            onClick={() => setSelectedTopic('cursos')}
            className={`rounded-2xl border p-6 text-left transition-all duration-300 relative overflow-hidden ${
              selectedTopic === 'cursos'
                ? 'border-brand-lime/50 bg-brand-lime/5 shadow-[0_4px_25px_rgba(163,230,53,0.15)]'
                : 'border-neutral-800 bg-[#070707] hover:border-neutral-700'
            }`}
          >
            <span className="absolute right-4 top-4 rounded bg-brand-lime/20 border border-brand-lime/20 px-2.5 py-0.5 text-[9px] font-black text-brand-lime">GRÁTIS</span>
            <div className="h-10 w-10 rounded-lg bg-brand-lime/10 border border-brand-lime/20 text-brand-lime flex items-center justify-center mb-4">
              <GraduationCap className="h-5 w-5" />
            </div>
            <h3 className="font-display text-lg font-black text-white mb-2">Academia Techify</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Cursos estruturados gratuitos de programação moderna, design responsivo, animações e muito mais. Desenvolva-se agora.
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-brand-lime">
              <span>Ver Trilha Completa</span>
              <Play className="h-3 w-3 fill-current" />
            </div>
          </button>

        </div>

        {/* Selected Interactive Screen Component */}
        <div className="mt-12">
          <AnimatePresence mode="wait">
            
            {/* Screen 1: Chatbot AI Tutor */}
            {selectedTopic === 'tutor' && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="max-w-3xl mx-auto rounded-2xl border border-neutral-900 bg-[#070707] overflow-hidden"
              >
                {/* Chat Header */}
                <div className="bg-neutral-950 px-6 py-4 border-b border-neutral-900 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="h-9 w-9 rounded-full bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400">
                        <Cpu className="h-5 w-5" />
                      </div>
                      <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-brand-accent ring-1 ring-black animate-ping" />
                    </div>
                    <div className="text-left">
                      <h4 className="font-display text-sm font-bold text-white">IA Tutora Techify</h4>
                      <p className="text-[10px] font-bold text-brand-lime uppercase tracking-widest leading-none">Online & Interativa</p>
                    </div>
                  </div>
                  
                  <span className="text-[9px] font-mono text-neutral-500">ENGINE: GEMINI_COGNITIVE</span>
                </div>

                {/* Messages Body */}
                <div className="h-96 overflow-y-auto p-6 space-y-4 bg-neutral-950/20">
                  {chatMessages.map((msg, idx) => {
                    const isTutor = msg.sender === 'tutor';
                    return (
                      <div
                        key={idx}
                        className={`flex ${isTutor ? 'justify-start' : 'justify-end'}`}
                      >
                        <div
                          className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                            isTutor
                              ? 'bg-neutral-900 text-neutral-200 border border-neutral-800 rounded-tl-none'
                              : 'bg-violet-600 text-white rounded-tr-none'
                          }`}
                        >
                          <p>{msg.text}</p>
                          <span className="block text-[9px] text-[#ffffff55] mt-2 text-right">
                            {msg.time}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Message Input Box */}
                <form onSubmit={handleSendMessage} className="p-4 bg-neutral-950 border-t border-neutral-900 flex gap-2">
                  <input
                    type="text"
                    placeholder="Pergunte sobre 'React', 'TypeScript', 'Design'..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    className="flex-1 rounded-xl border border-neutral-800 bg-neutral-900/60 py-3 px-4 text-xs sm:text-sm text-white placeholder-neutral-500 transition-all focus:border-violet-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="rounded-xl bg-violet-600 hover:bg-violet-500 text-white px-5 flex items-center justify-center transition-colors duration-200 cursor-pointer"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              </motion.div>
            )}

            {/* Screen 2: Languages Lesson Classroom */}
            {selectedTopic === 'idiomas' && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="max-w-3xl mx-auto rounded-2xl border border-neutral-900 bg-[#070707] p-6 text-left"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-neutral-900 pb-4 gap-4">
                  <div>
                    <h3 className="font-display text-lg font-black text-white">Mestre de Idiomas</h3>
                    <p className="text-xs text-neutral-400">Selecione uma linguagem para praticar imersão em design e códigos.</p>
                  </div>
                  
                  {/* Language selectors */}
                  <div className="flex flex-wrap gap-1.5">
                    {['Inglês', 'Espanhol', 'Japonês', 'Francês'].map(lang => (
                      <button
                        key={lang}
                        onClick={() => { setActiveLanguage(lang); setLessonProgress(0); }}
                        className={`rounded-lg px-3 py-1 text-xs font-bold transition-all ${
                          activeLanguage === lang
                            ? 'bg-brand-cyan text-black'
                            : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white'
                        }`}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Interactive Lesson Body */}
                <div className="mt-6 p-6 rounded-xl bg-neutral-950/40 border border-neutral-900">
                  <div className="flex items-center gap-2 text-xs font-bold text-brand-cyan uppercase mb-4 tracking-wider">
                    <Languages className="h-4 w-4" />
                    <span>Lição Ativa: {currentLesson.title}</span>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div>
                      <p className="text-[10px] font-bold text-neutral-500 uppercase">Frase do dia em {activeLanguage}</p>
                      <h4 className="font-display text-lg sm:text-xl font-bold text-white mt-1 select-all italic">
                        "{currentLesson.phrase}"
                      </h4>
                    </div>

                    <div>
                      <p className="text-[10px] font-bold text-neutral-500 uppercase">Tradução Profissional</p>
                      <p className="text-sm text-brand-cyan font-medium mt-1">
                        {currentLesson.translation}
                      </p>
                    </div>

                    <div className="rounded-lg bg-brand-cyan/5 border border-brand-cyan/15 p-4 text-xs text-neutral-300 leading-relaxed">
                      <span className="font-bold text-brand-cyan">Dica da Tutora:</span> {currentLesson.tip}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 justify-end">
                    <button
                      onClick={() => setLessonProgress(prev => Math.min(prev + 34, 100))}
                      className="rounded-xl bg-brand-cyan hover:bg-brand-cyan/80 text-black font-extrabold text-xs px-6 py-3 transition-colors flex items-center gap-1"
                    >
                      {lessonProgress >= 100 ? (
                        <>
                          <CheckCircle className="h-4 w-4" />
                          <span>Concluído!</span>
                        </>
                      ) : (
                        <span>Próximo Exercício</span>
                      )}
                    </button>
                  </div>

                  {/* ProgressBar */}
                  <div className="mt-6">
                    <div className="flex items-center justify-between text-[10px] font-bold text-neutral-600 mb-1">
                      <span>PROGRESSO DA AULA</span>
                      <span>{lessonProgress}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-neutral-900 rounded-full overflow-hidden">
                      <div className="h-full bg-brand-cyan transition-all duration-500" style={{ width: `${lessonProgress}%` }} />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Screen 3: All Free Courses */}
            {selectedTopic === 'cursos' && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 text-left"
              >
                {[
                  { title: 'HTML5 & CSS3 Semânticos', duration: '20 horas', lessons: 10, desc: 'Aprenda os pilares de estruturação limpa, SEO nativo e design responsivo com padrões mobile-first.' },
                  { title: 'Styling Moderno com Tailwind CSS v4', duration: '15 horas', lessons: 8, desc: 'Aprenda a criar designs agressivos e repletos de glows sem escrever uma única linha de CSS manual.' },
                  { title: 'Componentização Profissional com React 19', duration: '40 horas', lessons: 24, desc: 'Domine a nova versão do React, hooks customizados, lazy loading e transições integradas.' },
                  { title: 'Lógica e Arquitetura TypeScript', duration: '30 horas', lessons: 15, desc: 'Torne-se mais seguro declarando interfaces seguras e tipagens complexas que minimizam erros em builds.' },
                ].map((course, idx) => (
                  <div key={idx} className="rounded-2xl border border-neutral-900 bg-neutral-950/40 p-6 flex flex-col justify-between hover:border-neutral-800 transition-colors">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">{course.duration}</span>
                        <span className="rounded bg-brand-lime/10 px-2 py-0.5 text-[8px] font-black text-brand-lime uppercase">Carga Completa</span>
                      </div>

                      <h3 className="font-display text-lg font-black text-white mb-2">{course.title}</h3>
                      <p className="text-xs text-neutral-400 leading-relaxed mb-6">{course.desc}</p>
                    </div>

                    <div className="pt-4 border-t border-neutral-900 flex items-center justify-between">
                      <span className="text-[10px] font-mono text-neutral-600">{course.lessons} MÓDULOS DE AULA</span>
                      <button
                        onClick={() => alert(`Acesso liberado! Iniciando lição prática de: ${course.title}`)}
                        className="rounded-lg bg-neutral-900 hover:bg-brand-lime border border-neutral-800 hover:border-brand-lime text-neutral-300 hover:text-black transition-all text-[11px] font-bold px-4 py-2"
                      >
                        Iniciar Curso
                      </button>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
