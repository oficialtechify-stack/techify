import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomeSection from './components/HomeSection';
import PortfolioSection from './components/PortfolioSection';
import CareersSection from './components/CareersSection';
import ConsultationModal from './components/ConsultationModal';
import YuffieShowcase from './components/YuffieShowcase';
import MugsysMugsShowcase from './components/MugsysMugsShowcase';
import MindloopShowcase from './components/MindloopShowcase';
import WandrShowcase from './components/WandrShowcase';
import AdminPanel from './components/AdminPanel';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('inicio');
  const [isConsultationOpen, setIsConsultationOpen] = useState<boolean>(false);

  // If the active tab matches any of the immersive showcases, render them full-screen
  if (activeTab === 'wandr') {
    return (
      <WandrShowcase 
        onBack={() => {
          setActiveTab('portfolio');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }} 
      />
    );
  }

  if (activeTab === 'yuffie') {
    return (
      <YuffieShowcase 
        onBack={() => {
          setActiveTab('portfolio');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }} 
      />
    );
  }

  if (activeTab === 'mugsys-mugs') {
    return (
      <MugsysMugsShowcase 
        onBack={() => {
          setActiveTab('portfolio');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }} 
      />
    );
  }

  if (activeTab === 'mindloop') {
    return (
      <MindloopShowcase 
        onBack={() => {
          setActiveTab('portfolio');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }} 
      />
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
            onOpenConsultation={() => setIsConsultationOpen(true)} 
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
      case 'carreiras':
        return <CareersSection />;
      case 'admin':
        return <AdminPanel />;
      default:
        return (
          <HomeSection 
            onNavigate={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }} 
            onOpenConsultation={() => setIsConsultationOpen(true)} 
          />
        );
    }
  };

  const handleNavigateFromFooter = (tab: string) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#030303] text-neutral-200">
      {/* Premium Navigation Header */}
      <Header 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }} 
        onOpenConsultation={() => setIsConsultationOpen(true)} 
      />

      {/* Main Core Views Panel */}
      <main className="flex-grow">
        {renderContent()}
      </main>

      {/* Persistent Page Footer */}
      <Footer 
        onNavigate={handleNavigateFromFooter} 
        onOpenConsultation={() => setIsConsultationOpen(true)} 
      />

      {/* Interactive Consultation Modal */}
      <ConsultationModal 
        isOpen={isConsultationOpen} 
        onClose={() => setIsConsultationOpen(false)} 
      />
    </div>
  );
}

