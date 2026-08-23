import React, { useState, useEffect, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Sparkles, Edit3 } from 'lucide-react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomeSection from './components/HomeSection';
import ConsultationModal from './components/ConsultationModal';
import AdminLoginModal from './components/AdminLoginModal';
import LoadingScreen from './components/LoadingScreen';
import { GlassFilter } from './components/GlassButton';
import { useAdminAuth } from './lib/adminAuth';
import { InlineEditProvider } from './components/InlineEditProvider';
import { ToastProvider } from './components/Toast';

// Lazy load heavy immersive showcase components and secondary modules
const PortfolioSection = lazy(() => import('./components/PortfolioSection'));
const AppsSection = lazy(() => import('./components/AppsSection'));
const CareersSection = lazy(() => import('./components/CareersSection'));
const AcademySection = lazy(() => import('./components/AcademySection'));
const AboutSection = lazy(() => import('./components/AboutSection'));
const AdminPanel = lazy(() => import('./components/AdminPanel'));
const YuffieShowcase = lazy(() => import('./components/YuffieShowcase'));
const MugsysMugsShowcase = lazy(() => import('./components/MugsysMugsShowcase'));
const MindloopShowcase = lazy(() => import('./components/MindloopShowcase'));
const WandrShowcase = lazy(() => import('./components/WandrShowcase'));
const AsmeShowcase = lazy(() => import('./components/AsmeShowcase'));
const ToonHub = lazy(() => import('./components/ToonHub'));

export default function App() {
  const { isAdmin } = useAdminAuth();

  // Helper to detect initial tab from URL params or hash
  const getInitialTab = (): string => {
    if (typeof window === 'undefined') return 'inicio';
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const tabParam = searchParams.get('tab');
      if (tabParam) return tabParam;

      if (searchParams.get('vaga') || searchParams.get('job')) {
        return 'carreiras';
      }

      const hash = window.location.hash;
      if (hash.startsWith('#vaga-') || hash === '#carreiras' || hash === '#vagas') {
        return 'carreiras';
      }
      if (hash === '#portfolio' || hash === '#projetos') return 'portfolio';
      if (hash === '#apps') return 'apps';
      if (hash === '#sobre-nos' || hash === '#sobre') return 'sobre-nos';
      if (hash === '#academia') return 'academia';
      if (hash === '#admin') return 'admin';
    } catch (e) {
      console.warn('Error reading URL params:', e);
    }
    return 'inicio';
  };

  const [activeTab, setActiveTab] = useState<string>(getInitialTab);
  const [isConsultationOpen, setIsConsultationOpen] = useState<boolean>(false);
  const [consultationDefaultService, setConsultationDefaultService] = useState<string>('pacote_completo');
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState<boolean>(false);

  const handleOpenConsultation = (serviceName?: string) => {
    if (serviceName) {
      setConsultationDefaultService(serviceName);
    }
    setIsConsultationOpen(true);
  };

  // Sync tab with URL on popstate/hashchange and secret admin triggers
  useEffect(() => {
    let keyBuffer = '';

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore shortcut when user is typing inside an input/textarea
      const targetTag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (targetTag === 'input' || targetTag === 'textarea') return;

      // Shortcut: Ctrl + Shift + A or Cmd + Shift + A
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        setIsAdminLoginOpen(true);
        return;
      }

      // Typing secret sequence 'admin'
      keyBuffer += e.key.toLowerCase();
      if (keyBuffer.length > 10) keyBuffer = keyBuffer.slice(-10);
      if (keyBuffer.endsWith('admin')) {
        setIsAdminLoginOpen(true);
        keyBuffer = '';
      }
    };

    const handleUrlChange = () => {
      const searchParams = new URLSearchParams(window.location.search);
      if (window.location.hash === '#admin' || searchParams.get('admin') === 'true') {
        setIsAdminLoginOpen(true);
      }

      const currentTab = getInitialTab();
      if (currentTab && currentTab !== 'inicio') {
        setActiveTab(currentTab);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('hashchange', handleUrlChange);
    window.addEventListener('popstate', handleUrlChange);
    handleUrlChange();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('hashchange', handleUrlChange);
      window.removeEventListener('popstate', handleUrlChange);
    };
  }, []);

  // If the active tab matches any of the immersive showcases, render them full-screen with Suspense
  if (activeTab === 'wandr') {
    return (
      <Suspense fallback={<LoadingScreen message="Carregando Wandr. Beach Shoreline..." subMessage="Inicializando shaders e ambiente 3D imersivo" />}>
        <WandrShowcase 
          onBack={() => {
            setActiveTab('portfolio');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }} 
        />
      </Suspense>
    );
  }

  if (activeTab === 'yuffie') {
    return (
      <Suspense fallback={<LoadingScreen message="Carregando Yuffie Kinetic Interface..." subMessage="Carregando animações cinéticas e assets visuais" />}>
        <YuffieShowcase 
          onBack={() => {
            setActiveTab('portfolio');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }} 
        />
      </Suspense>
    );
  }

  if (activeTab === 'mugsys-mugs') {
    return (
      <Suspense fallback={<LoadingScreen message="Carregando Mugsy's Mugs..." subMessage="Preparando catálogo 3D e renderização de produtos" />}>
        <MugsysMugsShowcase 
          onBack={() => {
            setActiveTab('portfolio');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }} 
        />
      </Suspense>
    );
  }

  if (activeTab === 'mindloop') {
    return (
      <Suspense fallback={<LoadingScreen message="Carregando Mindloop Hub..." subMessage="Sincronizando modelos de dados e interface neural" />}>
        <MindloopShowcase 
          onBack={() => {
            setActiveTab('portfolio');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }} 
        />
      </Suspense>
    );
  }

  if (activeTab === 'asme') {
    return (
      <Suspense fallback={<LoadingScreen message="Carregando ASME Platform..." subMessage="Carregando arquitetura de micro-serviços e dados" />}>
        <AsmeShowcase 
          onBack={() => {
            setActiveTab('portfolio');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }} 
        />
      </Suspense>
    );
  }

  if (activeTab === 'toonhub') {
    return (
      <Suspense fallback={<LoadingScreen message="Carregando ToonHub Studio..." subMessage="Carregando engine de animação e galeria de personagens" />}>
        <ToonHub 
          onBack={() => {
            setActiveTab('portfolio');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }} 
        />
      </Suspense>
    );
  }

  // Return specific component block based on selected active layout tab
  const renderContent = () => {
    switch (activeTab) {
      case 'inicio':
        return (
          <HomeSection 
            onNavigate={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }} 
            onOpenConsultation={(service) => handleOpenConsultation(service)} 
          />
        );
      case 'portfolio':
        return (
          <PortfolioSection 
            onBackToHome={() => {
              setActiveTab('inicio');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }} 
            onLaunchDemo={(id) => {
              setActiveTab(id);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        );
      case 'sobre-nos':
        return (
          <AboutSection 
            onNavigate={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenConsultation={(service) => handleOpenConsultation(service)}
          />
        );
      case 'apps':
        return <AppsSection onOpenConsultation={(service) => handleOpenConsultation(service)} />;
      case 'carreiras':
        return <CareersSection />;
      case 'academia':
        return (
          <AcademySection 
            onNavigate={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }} 
          />
        );
      case 'admin':
        return <AdminPanel />;
      default:
        return (
          <HomeSection 
            onNavigate={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }} 
            onOpenConsultation={(service) => handleOpenConsultation(service)} 
          />
        );
    }
  };

  const handleNavigateFromFooter = (tab: string) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <ToastProvider>
      <InlineEditProvider>
        <div className="flex min-h-screen flex-col bg-[#030303] text-neutral-200">
          <GlassFilter />
          {/* Premium Navigation Header */}
          <Header 
            activeTab={activeTab} 
            setActiveTab={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }} 
            onOpenConsultation={() => handleOpenConsultation()} 
            onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
          />

          {/* Main Core Views Panel with Entrance Transition & Global Suspense */}
          <main className="flex-grow">
            <Suspense fallback={<LoadingScreen fullscreen={false} message="Carregando seção..." subMessage="Otimizando layout e componentes" />}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{
                    duration: 0.25,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="w-full"
                >
                  {renderContent()}
                </motion.div>
              </AnimatePresence>
            </Suspense>
          </main>

          {/* Persistent Page Footer */}
          <Footer 
            onNavigate={handleNavigateFromFooter} 
            onOpenConsultation={() => handleOpenConsultation()} 
            onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
          />

          {/* Interactive Consultation Modal */}
          <ConsultationModal 
            isOpen={isConsultationOpen} 
            defaultService={consultationDefaultService}
            onClose={() => setIsConsultationOpen(false)} 
          />

          {/* Admin Quick-Edit Floating Badge */}
          {isAdmin && activeTab !== 'admin' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-2xl border border-[#a3e635]/40 bg-[#0d120d]/95 backdrop-blur-md p-2 pl-3 shadow-[0_10px_30px_rgba(0,0,0,0.8),0_0_20px_rgba(163,230,53,0.2)]"
            >
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#a3e635] animate-ping" />
                <span className="text-xs font-bold text-white hidden sm:inline">Modo Edição Ativo (Lápis nos Textos)</span>
              </div>

              <button
                onClick={() => {
                  setActiveTab('admin');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex items-center gap-1.5 rounded-xl bg-[#a3e635] hover:bg-[#84cc16] text-black font-extrabold text-xs px-3.5 py-2 transition-all shadow-md cursor-pointer"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Painel Admin</span>
              </button>
            </motion.div>
          )}

          {/* Admin Login Password Modal */}
          <AdminLoginModal 
            isOpen={isAdminLoginOpen}
            onClose={() => setIsAdminLoginOpen(false)}
            onSuccess={() => {
              setActiveTab('admin');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        </div>
      </InlineEditProvider>
    </ToastProvider>
  );
}
