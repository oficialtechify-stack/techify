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
  Send,
  Image as ImageIcon,
  ZoomIn,
  X,
  Plus,
  Upload,
  Trash2,
  Edit3,
  Loader2
} from 'lucide-react';
import { PROJECTS, SERVICES } from '../data';
import AnimatedGradient from './AnimatedGradient';
import { GradientWave } from './GradientWave';
import TechHeroBackground from './TechHeroBackground';
import { TechifyIcon } from './TechifyLogo';
import ScrollReveal from './ScrollReveal';
import ShowcaseCarousel from './ShowcaseCarousel';
import ClientsSliderSection from './ClientsSliderSection';
import PackagesSection from './PackagesSection';
import TextEmergence from './TextEmergence';
import InteractiveDiagnosisSection from './InteractiveDiagnosisSection';
import SpecialtyBentoSection from './SpecialtyBentoSection';
import ProductionProcessSection from './ProductionProcessSection';
import { EditableText, EditableNumber, EditableIcon, EditableImage } from './InlineEditProvider';
import { getCachedGeneralContent, getCachedFeedbacks, getCachedTeamMembers, SiteGeneralContent, FeedbackImage, TeamMember, saveFeedbacksToFirestore } from '../lib/siteContent';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { compressImageFile } from '../lib/imageUtils';
import { toast } from './Toast';
import { useAdminAuth } from '../lib/adminAuth';

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
  onOpenConsultation: (serviceName?: string) => void;
}

export default function HomeSection({ onNavigate, onOpenConsultation }: HomeSectionProps) {
  const { isAdmin } = useAdminAuth();
  const containerRef = useRef<HTMLDivElement>(null);
  const feedbackFileInputRef = useRef<HTMLInputElement>(null);
  const [selectedArticle, setSelectedArticle] = useState<number | null>(null);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [generalContent, setGeneralContent] = useState<SiteGeneralContent>(getCachedGeneralContent);
  const [feedbacks, setFeedbacks] = useState<FeedbackImage[]>(getCachedFeedbacks);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(getCachedTeamMembers);
  const [selectedFeedbackImage, setSelectedFeedbackImage] = useState<FeedbackImage | null>(null);

  // Manual Feedback Modal state
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [editingFeedbackId, setEditingFeedbackId] = useState<string | null>(null);
  const [feedbackImageUrl, setFeedbackImageUrl] = useState('');
  const [feedbackClientName, setFeedbackClientName] = useState('');
  const [feedbackProjectName, setFeedbackProjectName] = useState('');
  const [feedbackComment, setFeedbackComment] = useState('');
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackDate, setFeedbackDate] = useState('');
  const [isUploadingFeedback, setIsUploadingFeedback] = useState(false);
  const [isSavingFeedback, setIsSavingFeedback] = useState(false);

  const handleOpenFeedbackModal = (fb?: FeedbackImage) => {
    if (fb) {
      setEditingFeedbackId(fb.id);
      setFeedbackImageUrl(fb.imageUrl);
      setFeedbackClientName(fb.clientName || '');
      setFeedbackProjectName(fb.projectName || '');
      setFeedbackComment(fb.comment || '');
      setFeedbackRating(fb.rating || 5);
      setFeedbackDate(fb.date || '');
    } else {
      setEditingFeedbackId(null);
      setFeedbackImageUrl('');
      setFeedbackClientName('');
      setFeedbackProjectName('');
      setFeedbackComment('');
      setFeedbackRating(5);
      setFeedbackDate(new Date().toLocaleDateString('pt-BR'));
    }
    setIsFeedbackModalOpen(true);
  };

  const handleFeedbackFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingFeedback(true);
    try {
      const base64 = await compressImageFile(file, 1200, 1200, 0.88);
      setFeedbackImageUrl(base64);
      toast.success("Print Carregado", "Imagem pronta para salvar no site.");
    } catch (err) {
      console.error(err);
      toast.error("Erro no Upload", "Não foi possível processar o arquivo.");
    } finally {
      setIsUploadingFeedback(false);
    }
  };

  const handleSaveFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackImageUrl.trim()) {
      toast.warning("Imagem Obrigatória", "Por favor selecione ou insira a URL do print/feedback.");
      return;
    }
    setIsSavingFeedback(true);
    try {
      let updated: FeedbackImage[];
      if (editingFeedbackId) {
        updated = feedbacks.map(item =>
          item.id === editingFeedbackId
            ? {
                ...item,
                imageUrl: feedbackImageUrl.trim(),
                clientName: feedbackClientName.trim() || 'Cliente Satisfeito',
                projectName: feedbackProjectName.trim(),
                comment: feedbackComment.trim(),
                rating: feedbackRating,
                date: feedbackDate.trim() || new Date().toLocaleDateString('pt-BR')
              }
            : item
        );
        toast.success("Feedback Atualizado", "As alterações foram salvas no banco de dados.");
      } else {
        const newFb: FeedbackImage = {
          id: 'fb-' + Date.now(),
          imageUrl: feedbackImageUrl.trim(),
          clientName: feedbackClientName.trim() || 'Cliente Satisfeito',
          projectName: feedbackProjectName.trim(),
          comment: feedbackComment.trim(),
          rating: feedbackRating,
          date: feedbackDate.trim() || new Date().toLocaleDateString('pt-BR'),
          createdAt: new Date().toISOString()
        };
        updated = [newFb, ...feedbacks];
        toast.success("Feedback Publicado", "O print de feedback foi publicado e salvo no banco de dados.");
      }
      setFeedbacks(updated);
      await saveFeedbacksToFirestore(updated);
      setIsFeedbackModalOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao Salvar", "Não foi possível salvar o feedback.");
    } finally {
      setIsSavingFeedback(false);
    }
  };

  const handleDeleteFeedbackItem = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!window.confirm("Deseja realmente remover este print de feedback?")) return;
    try {
      const updated = feedbacks.filter(fb => fb.id !== id);
      setFeedbacks(updated);
      await saveFeedbacksToFirestore(updated);
      if (selectedFeedbackImage?.id === id) {
        setSelectedFeedbackImage(null);
      }
      toast.info("Feedback Removido", "O print foi removido com sucesso.");
    } catch (err) {
      console.error(err);
      toast.error("Erro ao Excluir", "Não foi possível remover o print.");
    }
  };

  // Sync general content, feedbacks and team members from Firestore and local cache in real-time
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "site_content", "general"), (snap) => {
      if (snap.exists()) {
        const data = snap.data() as Partial<SiteGeneralContent>;
        setGeneralContent(prev => ({ ...prev, ...data }));
      }
    }, (err) => console.warn('Firestore generalContent offline:', err.message));

    const unsubFeedbacks = onSnapshot(doc(db, "site_content", "feedbacks"), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        if (Array.isArray(data.feedbacks)) {
          setFeedbacks(data.feedbacks);
        }
      }
    }, (err) => console.warn('Firestore feedbacks offline:', err.message));

    const unsubTeam = onSnapshot(doc(db, "site_content", "team"), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        if (Array.isArray(data.members) && data.members.length > 0) {
          setTeamMembers(data.members);
        }
      }
    }, (err) => console.warn('Firestore team offline:', err.message));

    const handleContentUpdate = (e: Event) => {
      const customEvt = e as CustomEvent<SiteGeneralContent>;
      if (customEvt.detail) {
        setGeneralContent(customEvt.detail);
      }
    };

    const handleFeedbacksUpdate = (e: Event) => {
      const customEvt = e as CustomEvent<FeedbackImage[]>;
      if (customEvt.detail) {
        setFeedbacks(customEvt.detail);
      }
    };

    const handleTeamUpdate = (e: Event) => {
      const customEvt = e as CustomEvent<TeamMember[]>;
      if (customEvt.detail) {
        setTeamMembers(customEvt.detail);
      }
    };

    window.addEventListener('techify-content-updated', handleContentUpdate);
    window.addEventListener('techify-feedbacks-updated', handleFeedbacksUpdate);
    window.addEventListener('techify-team-updated', handleTeamUpdate);

    return () => {
      unsub();
      unsubFeedbacks();
      unsubTeam();
      window.removeEventListener('techify-content-updated', handleContentUpdate);
      window.removeEventListener('techify-feedbacks-updated', handleFeedbacksUpdate);
      window.removeEventListener('techify-team-updated', handleTeamUpdate);
    };
  }, []);

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
      {/* 1. HERO SECTION (Tech Cyber Constellation & Deep Spatial Background)       */}
      {/* ========================================================================= */}
      <TechHeroBackground className="min-h-[90vh] flex flex-col justify-between items-center pt-10 sm:pt-14 pb-16">
        
        {/* Parallax Cyber Orbs */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <motion.div 
            style={{ y: yHeroOrb }}
            className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(163,230,53,0.08),transparent_70%)]" 
          />

          {/* Floating Parallax Cyber Ring */}
          <motion.div
            style={{ y: yHeroRing, rotate: rotateHeroRing }}
            className="pointer-events-none absolute -top-16 left-8 sm:left-24 w-72 h-72 rounded-full border border-[#a3e635]/15 opacity-25 [border-dasharray:8px]"
          />
          <motion.div
            style={{ y: yHeroOrb, rotate: rotateServicesGeom }}
            className="pointer-events-none absolute top-32 right-10 sm:right-32 w-48 h-48 rounded-full border border-[#4ade80]/10 opacity-20"
          />
        </div>

        {/* Hero Header & Copy */}
        <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center pt-6 sm:pt-10">
          
          {/* Main Headline with Smooth Emergence */}
          <TextEmergence delay={0.1} yOffset={25} duration={0.8} blur={16}>
            <h1 className="font-display text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1] max-w-4xl pt-1 sm:pt-2">
              <span className="block text-white text-3xl sm:text-5xl md:text-6xl mb-2 sm:mb-3 font-extrabold tracking-tight">
                <EditableText 
                  id="hero_title_1" 
                  defaultText={generalContent.heroHeadline1 || "A Solução Definitiva"} 
                  title="Título Hero Linha 1" 
                />
              </span>
              <span className="block text-[#a3e635] tracking-tight uppercase drop-shadow-[0_0_35px_rgba(163,230,53,0.35)] font-black text-3xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.08] hover:drop-shadow-[0_0_45px_rgba(163,230,53,0.6)] transition-all">
                <EditableText 
                  id="hero_title_2" 
                  defaultText={generalContent.heroHeadline2 || "ESTRUTURA COMPLETA PARA SUA EMPRESA CRESCER"} 
                  title="Título Hero Linha 2" 
                />
              </span>
            </h1>
          </TextEmergence>

          {/* Subtitle with Emergence */}
          <TextEmergence delay={0.25} yOffset={18} duration={0.7} blur={10}>
            <p className="max-w-3xl text-sm sm:text-base md:text-lg text-neutral-300 leading-relaxed font-normal mt-6">
              <EditableText
                id="hero_description_main"
                defaultText={generalContent.heroDescription || "Unimos desenvolvimento de sites e sistemas, design de alto impacto e marketing estratégico. Uma experiência completa conduzida por um time pronto para acelerar seus resultados. Nossa equipe de especialistas cuida de toda a sua estratégia digital para o seu negócio escalar."}
                title="Descrição do Hero"
                isMultiline={true}
              />
            </p>
          </TextEmergence>

          {/* Dual Action Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
          >
            <button
              onClick={() => onNavigate('portfolio')}
              className="w-full sm:w-auto rounded-full border border-neutral-800 bg-neutral-900/90 hover:bg-neutral-800 hover:border-[#a3e635]/40 px-7 py-3.5 text-xs sm:text-sm font-bold tracking-wide text-neutral-200 transition-all shadow-md cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            >
              <EditableText
                id="hero_cta_secondary"
                defaultText={generalContent.heroCtaSecondary || "VER O QUE JÁ FIZEMOS"}
                title="Botão Secundário"
              />
            </button>

            <button
              onClick={onOpenConsultation}
              className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-full bg-[#a3e635] hover:bg-[#84cc16] px-7 py-3.5 text-xs sm:text-sm font-bold tracking-wide text-black transition-all shadow-[0_0_25px_rgba(163,230,53,0.35)] cursor-pointer hover:shadow-[0_0_35px_rgba(163,230,53,0.6)] hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>
                <EditableText
                  id="hero_cta_primary"
                  defaultText={generalContent.heroCtaPrimary || "FALAR COM ENGENHEIRO"}
                  title="Botão Principal"
                />
              </span>
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-black/20 text-black group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                <ArrowUpRight className="h-3.5 w-3.5" />
              </div>
            </button>
          </motion.div>
        </div>

        {/* Rating Footer */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="relative z-10 mt-12 flex flex-col items-center gap-1.5"
        >
          <span className="text-xs font-semibold text-neutral-300 tracking-wide">
            4.9/5 em satisfação de clientes
          </span>
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-[#facc15] text-[#facc15]" />
            ))}
          </div>
        </motion.div>
      </TechHeroBackground>


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
      {/* 2. SEÇÃO DE CONSCIENTIZAÇÃO DA DOR                                        */}
      {/* ========================================================================= */}
      
      {/* 2.1 Presença no Google & Conversão */}
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

      {/* 2.2 Diagnóstico Interativo (Está perdendo cliente por qual dessas três?) */}
      <InteractiveDiagnosisSection onOpenConsultation={onOpenConsultation} />


      {/* ========================================================================= */}
      {/* 3. SEÇÃO DE SOLUÇÃO & DIFERENCIAL                                         */}
      {/* ========================================================================= */}
      
      {/* 3.1 Especialidade / Cansado de contratar um profissional para cada coisa? (4 Cards com Animações Motion Avançadas) */}
      <SpecialtyBentoSection onOpenConsultation={onOpenConsultation} />

      {/* 3.2 Como Funciona Nossa Produção (Pipeline com 5 Etapas e Motion Interativo) */}
      <ProductionProcessSection onOpenConsultation={onOpenConsultation} />

      {/* 3.2 A empresa que resolve o que trava o seu negócio (Bento Stats Section) */}
      <section className="relative w-full py-24 sm:py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-neutral-900/80">
        
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
      {/* 4. SEÇÃO DE PRODUTOS, PLANOS E ENTREGÁVEIS                                */}
      {/* ========================================================================= */}
      <PackagesSection onOpenConsultation={onOpenConsultation} />


      {/* ========================================================================= */}
      {/* 5. SEÇÃO DE PROVA SOCIAL E AUTORIDADE                                     */}
      {/* ========================================================================= */}
      
      {/* 5.1 Clientes Atendidos Slider (Mockups Reais de Sites e Sistemas) */}
      <ClientsSliderSection 
        onOpenConsultation={onOpenConsultation}
        onNavigatePortfolio={() => onNavigate('portfolio')}
      />

      {/* 5.2 Cases & Portfólio CTA */}
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

      {/* 5.3 Feedbacks & Depoimentos Reais de Clientes */}
      <section className="relative w-full py-20 bg-neutral-950/60 border-y border-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <ScrollReveal threshold={0.2}>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-black px-3.5 py-1 text-xs font-bold text-neutral-300 mb-4">
                  <div className="h-1.5 w-1.5 rounded-sm bg-[#22c55e]" />
                  <span>Depoimentos & Feedbacks Reais</span>
                </div>
                <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white">
                  Feedbacks Reais de Clientes
                </h2>
                <p className="text-sm text-neutral-400 mt-2 max-w-2xl">
                  Prints autênticos de conversas no WhatsApp, avaliações e satisfação comprovada de quem contratou a Techify.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => handleOpenFeedbackModal()}
                  className="inline-flex items-center gap-2 rounded-full bg-[#22c55e] hover:bg-[#16a34a] px-4 sm:px-5 py-2 text-xs font-black text-black transition-all cursor-pointer shadow-[0_0_15px_rgba(34,197,94,0.3)] hover:scale-105"
                >
                  <Plus className="h-4 w-4 stroke-[2.5]" />
                  <span>Adicionar Print de Feedback</span>
                </button>

                {feedbacks.length > 0 && (
                  <span className="text-xs font-semibold text-neutral-400 border-l border-neutral-800 pl-3">
                    {feedbacks.length} {feedbacks.length === 1 ? 'print salvo' : 'prints salvos'}
                  </span>
                )}
              </div>
            </div>
          </ScrollReveal>

          {feedbacks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {feedbacks.map((fb, idx) => (
                <ScrollReveal key={fb.id || idx} delay={idx * 0.1} yOffset={25}>
                  <div 
                    onClick={() => setSelectedFeedbackImage(fb)}
                    className="group relative rounded-3xl border border-neutral-800/80 bg-[#0a0a0a] hover:border-[#22c55e]/50 transition-all duration-300 overflow-hidden flex flex-col cursor-pointer shadow-lg hover:shadow-[0_0_25px_rgba(34,197,94,0.12)] hover:-translate-y-1"
                  >
                    {/* Feedback Print / Image Container */}
                    <div className="relative w-full aspect-[4/3] bg-neutral-900 overflow-hidden">
                      <img 
                        src={fb.imageUrl} 
                        alt={fb.clientName || 'Feedback Real Techify'} 
                        className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/80 border border-[#22c55e]/60 text-xs font-bold text-[#a3e635] shadow-lg">
                          <ZoomIn className="h-3.5 w-3.5" />
                          <span>Ampliar</span>
                        </div>
                      </div>
                      
                      {/* Certified Stamp */}
                      <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md border border-[#22c55e]/40 text-[11px] font-bold text-emerald-400">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        <span>Verificado</span>
                      </div>

                      {/* Admin Quick Action Controls */}
                      <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 z-10">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenFeedbackModal(fb);
                          }}
                          className="h-7 w-7 rounded-lg bg-black/80 hover:bg-[#a3e635] text-white hover:text-black border border-neutral-700 flex items-center justify-center text-xs transition-colors"
                          title="Editar Feedback"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={(e) => handleDeleteFeedbackItem(fb.id, e)}
                          className="h-7 w-7 rounded-lg bg-black/80 hover:bg-red-500 text-white border border-neutral-700 flex items-center justify-center text-xs transition-colors"
                          title="Excluir Feedback"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Card Content & Details */}
                    <div className="p-5 flex flex-col justify-between flex-1">
                      <div>
                        {/* Rating Stars */}
                        <div className="flex items-center gap-1 text-[#facc15] mb-2.5">
                          {[...Array(fb.rating || 5)].map((_, i) => (
                            <Star key={i} className="h-3.5 w-3.5 fill-current" />
                          ))}
                        </div>

                        {fb.comment && (
                          <p className="text-xs sm:text-sm text-neutral-300 line-clamp-3 italic mb-3">
                            "{fb.comment}"
                          </p>
                        )}
                      </div>

                      <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between">
                        <div>
                          <h4 className="text-xs sm:text-sm font-bold text-white">
                            {fb.clientName || 'Cliente Techify'}
                          </h4>
                          {fb.projectName && (
                            <p className="text-[11px] text-neutral-400">
                              {fb.projectName}
                            </p>
                          )}
                        </div>
                        {fb.date && (
                          <span className="text-[10px] text-neutral-500 font-mono">
                            {fb.date}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          ) : (
            <ScrollReveal threshold={0.2}>
              <div className="rounded-3xl border border-neutral-800 bg-[#0c0e0c] p-8 sm:p-12 text-center flex flex-col items-center justify-center max-w-2xl mx-auto">
                <div className="h-16 w-16 rounded-2xl bg-[#a3e635]/10 border border-[#a3e635]/20 flex items-center justify-center text-[#a3e635] mb-5">
                  <ShieldCheck className="h-8 w-8" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                  Feedbacks 100% Autênticos
                </h3>
                <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed max-w-lg mb-6">
                  Aqui exibimos prints e capturas reais de conversas no WhatsApp com nossos clientes, garantindo transparência e resultados comprovados.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={() => handleOpenFeedbackModal()}
                    className="inline-flex items-center gap-2 rounded-full bg-[#22c55e] hover:bg-[#16a34a] px-6 py-2.5 text-xs font-black text-black transition-all cursor-pointer shadow-[0_0_15px_rgba(34,197,94,0.3)] hover:scale-105"
                  >
                    <Plus className="h-4 w-4 stroke-[2.5]" />
                    <span>Adicionar Print de Feedback</span>
                  </button>
                  <button
                    onClick={onOpenConsultation}
                    className="inline-flex items-center gap-2 rounded-full border border-neutral-700 hover:border-neutral-500 bg-neutral-900 px-6 py-2.5 text-xs font-bold text-neutral-200 transition-all cursor-pointer"
                  >
                    <span>Falar com a Equipe</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </ScrollReveal>
          )}

        </div>
      </section>

      {/* 5.4 Apresentação da Equipe (Conheça nosso time) */}
      <section className="relative w-full py-20 sm:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal threshold={0.2}>
          <div className="mb-14">
            <div className="inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-950 px-3.5 py-1 text-xs font-bold text-neutral-300 mb-4">
              <div className="h-1.5 w-1.5 rounded-sm bg-[#22c55e]" />
              <span>Nosso Time</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
              <div>
                <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-white">
                  Conheça nosso time
                </h2>
                <p className="text-sm text-neutral-400 mt-2 max-w-2xl font-normal">
                  Especialistas dedicados a transformar desafios técnicos em crescimento e receita para sua empresa.
                </p>
              </div>

              <button
                onClick={() => onOpenConsultation()}
                className="group inline-flex items-center gap-2 rounded-full bg-black hover:bg-neutral-900 border border-neutral-700 px-6 py-3 text-xs font-bold text-white transition-all cursor-pointer w-fit"
              >
                <span>FALE CONOSCO</span>
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#22c55e] text-black group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                  <ArrowUpRight className="h-3 w-3 stroke-[2.5]" />
                </div>
              </button>
            </div>
          </div>
        </ScrollReveal>

        {/* 4 Team Member Cards with Visual Photos & Inline Editing */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((member, idx) => (
            <ScrollReveal key={member.id || idx} delay={idx * 0.1} yOffset={30}>
              <div className="group relative rounded-3xl border border-neutral-800 bg-[#090b09] p-5 flex flex-col justify-between hover:border-[#22c55e]/50 hover:bg-[#0c120c] transition-all duration-300 shadow-xl h-full">
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
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>


      {/* ========================================================================= */}
      {/* 6. SEÇÃO DE DÚVIDAS E FECHAMENTO                                          */}
      {/* ========================================================================= */}
      
      {/* 6.1 FAQ / Blog & Artigos (As dúvidas que todo dono de negócio tem) */}
      <section className="relative w-full py-24 sm:py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-neutral-900">
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

      {/* Lightbox Modal for Feedback Prints */}
      <AnimatePresence>
        {selectedFeedbackImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedFeedbackImage(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl max-h-[90vh] w-full rounded-3xl border border-neutral-800 bg-[#0c0e0c] shadow-2xl overflow-hidden flex flex-col"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-[#121412]">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-[#22c55e] animate-pulse" />
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      {selectedFeedbackImage.clientName || 'Feedback de Cliente Autêntico'}
                    </h3>
                    {selectedFeedbackImage.projectName && (
                      <p className="text-xs text-neutral-400">
                        {selectedFeedbackImage.projectName}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const itemToEdit = selectedFeedbackImage;
                      setSelectedFeedbackImage(null);
                      handleOpenFeedbackModal(itemToEdit);
                    }}
                    className="h-8 px-3 rounded-full border border-neutral-700 bg-neutral-800 flex items-center gap-1.5 text-xs text-neutral-300 hover:text-white hover:border-neutral-500 transition-colors cursor-pointer"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                    <span>Editar</span>
                  </button>
                  <button
                    onClick={() => setSelectedFeedbackImage(null)}
                    className="h-8 w-8 rounded-full border border-neutral-700 bg-neutral-800 flex items-center justify-center text-neutral-300 hover:text-white hover:border-neutral-500 transition-colors cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* High-res Image Preview */}
              <div className="p-4 sm:p-6 overflow-y-auto max-h-[70vh] flex items-center justify-center bg-black/40">
                <img
                  src={selectedFeedbackImage.imageUrl}
                  alt={selectedFeedbackImage.clientName || 'Print de feedback real'}
                  className="max-h-[65vh] w-auto max-w-full object-contain rounded-xl border border-neutral-800 shadow-xl"
                />
              </div>

              {/* Modal Footer with details & CTA */}
              <div className="px-6 py-4 border-t border-neutral-800 bg-[#0d100d] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-[#facc15]">
                    {[...Array(selectedFeedbackImage.rating || 5)].map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-current" />
                    ))}
                  </div>
                  {selectedFeedbackImage.date && (
                    <span className="text-xs text-neutral-400 font-mono">
                      • {selectedFeedbackImage.date}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => {
                    setSelectedFeedbackImage(null);
                    onOpenConsultation();
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#22c55e] hover:bg-[#16a34a] px-6 py-2 text-xs font-bold text-black transition-all cursor-pointer shadow-[0_0_15px_rgba(34,197,94,0.3)]"
                >
                  <span>Quero um projeto de sucesso</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Direct Add / Edit Feedback Print Modal */}
      <AnimatePresence>
        {isFeedbackModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsFeedbackModalOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-xl w-full rounded-3xl border border-neutral-800 bg-[#0d0f0d] p-6 sm:p-8 shadow-2xl overflow-hidden my-8"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#22c55e]/10 text-[#22c55e]">
                    <Upload className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">
                      {editingFeedbackId ? 'Editar Print de Feedback' : 'Adicionar Print de Feedback'}
                    </h3>
                    <p className="text-xs text-neutral-400">
                      Faça upload do print do WhatsApp ou insira a URL da imagem.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsFeedbackModalOpen(false)}
                  className="h-7 w-7 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Form Content */}
              <form onSubmit={handleSaveFeedbackSubmit} className="mt-6 space-y-4">
                {/* Upload Zone / URL */}
                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-2">
                    Print / Imagem do Feedback *
                  </label>
                  
                  <input
                    type="file"
                    ref={feedbackFileInputRef}
                    onChange={handleFeedbackFileUpload}
                    accept="image/*"
                    className="hidden"
                  />

                  {feedbackImageUrl ? (
                    <div className="relative rounded-2xl border border-neutral-700 bg-neutral-900 p-2 overflow-hidden flex flex-col items-center">
                      <img
                        src={feedbackImageUrl}
                        alt="Preview Feedback"
                        className="max-h-48 w-full object-contain rounded-xl"
                      />
                      <div className="mt-2 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => feedbackFileInputRef.current?.click()}
                          className="px-3 py-1 text-xs rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200"
                        >
                          Trocar Imagem
                        </button>
                        <button
                          type="button"
                          onClick={() => setFeedbackImageUrl('')}
                          className="px-3 py-1 text-xs rounded-lg bg-red-950/60 hover:bg-red-900/80 text-red-300"
                        >
                          Remover
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => feedbackFileInputRef.current?.click()}
                      className="border-2 border-dashed border-neutral-700 hover:border-[#22c55e]/60 rounded-2xl p-6 text-center cursor-pointer bg-neutral-900/50 hover:bg-neutral-900 transition-colors flex flex-col items-center justify-center gap-2"
                    >
                      {isUploadingFeedback ? (
                        <div className="flex flex-col items-center gap-2 text-xs text-neutral-400">
                          <Loader2 className="h-6 w-6 animate-spin text-[#22c55e]" />
                          <span>Comprimindo e carregando print...</span>
                        </div>
                      ) : (
                        <>
                          <div className="h-10 w-10 rounded-full bg-[#22c55e]/10 text-[#22c55e] flex items-center justify-center">
                            <Upload className="h-5 w-5" />
                          </div>
                          <span className="text-xs font-bold text-white">
                            Clique para escolher a imagem do computador/celular
                          </span>
                          <span className="text-[11px] text-neutral-400">
                            Formatos PNG, JPG, WEBP (será otimizada automaticamente)
                          </span>
                        </>
                      )}
                    </div>
                  )}

                  {/* Or Manual URL */}
                  <div className="mt-2">
                    <span className="text-[11px] text-neutral-500 block mb-1">Ou cole o link direto da imagem:</span>
                    <input
                      type="url"
                      value={feedbackImageUrl}
                      onChange={(e) => setFeedbackImageUrl(e.target.value)}
                      placeholder="https://exemplo.com/print-feedback.png"
                      className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-2 text-xs text-white placeholder-neutral-500 focus:border-[#22c55e] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Client Name & Project */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-neutral-300 mb-1">
                      Nome do Cliente
                    </label>
                    <input
                      type="text"
                      value={feedbackClientName}
                      onChange={(e) => setFeedbackClientName(e.target.value)}
                      placeholder="Ex: Rodrigo Mendes"
                      className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-2 text-xs text-white placeholder-neutral-500 focus:border-[#22c55e] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-300 mb-1">
                      Projeto / Empresa
                    </label>
                    <input
                      type="text"
                      value={feedbackProjectName}
                      onChange={(e) => setFeedbackProjectName(e.target.value)}
                      placeholder="Ex: E-commerce & Tráfego"
                      className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-2 text-xs text-white placeholder-neutral-500 focus:border-[#22c55e] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Rating & Date */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-neutral-300 mb-1">
                      Avaliação (Estrelas)
                    </label>
                    <div className="flex items-center gap-1.5 py-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFeedbackRating(star)}
                          className="text-neutral-600 hover:scale-110 transition-transform"
                        >
                          <Star
                            className={`h-5 w-5 ${
                              star <= feedbackRating
                                ? 'text-[#facc15] fill-current'
                                : 'text-neutral-600'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="ml-2 text-xs text-neutral-400 font-mono">
                        {feedbackRating} / 5
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-300 mb-1">
                      Data do Feedback
                    </label>
                    <input
                      type="text"
                      value={feedbackDate}
                      onChange={(e) => setFeedbackDate(e.target.value)}
                      placeholder="Ex: 14/02/2025"
                      className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-2 text-xs text-white placeholder-neutral-500 focus:border-[#22c55e] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Comment / Quote */}
                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1">
                    Depoimento / Destaque (Opcional)
                  </label>
                  <textarea
                    rows={2}
                    value={feedbackComment}
                    onChange={(e) => setFeedbackComment(e.target.value)}
                    placeholder="Ex: Excelente suporte e entrega impecável antes do prazo combinado."
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-2 text-xs text-white placeholder-neutral-500 focus:border-[#22c55e] focus:outline-none resize-none"
                  />
                </div>

                {/* Submit Actions */}
                <div className="pt-3 flex items-center justify-end gap-3 border-t border-neutral-800">
                  <button
                    type="button"
                    onClick={() => setIsFeedbackModalOpen(false)}
                    className="px-4 py-2 text-xs font-bold text-neutral-400 hover:text-white rounded-xl transition-colors cursor-pointer"
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    disabled={isSavingFeedback || !feedbackImageUrl.trim()}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#22c55e] hover:bg-[#16a34a] disabled:opacity-50 px-6 py-2.5 text-xs font-black text-black transition-all cursor-pointer shadow-[0_0_15px_rgba(34,197,94,0.3)]"
                  >
                    {isSavingFeedback ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Salvando no Banco...</span>
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4 stroke-[3]" />
                        <span>Salvar Feedback</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
