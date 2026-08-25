import React, { useState } from 'react';
import Header from './components/Header';
import HomeSection from './components/HomeSection';
import AboutSection from './components/AboutSection';
import PortfolioSection from './components/PortfolioSection';
import AppsSection from './components/AppsSection';
import MotionLabSection from './components/MotionLabSection';
import CareersSection from './components/CareersSection';
import AdminPanel from './components/AdminPanel';
import Footer from './components/Footer';
import ConsultationModal from './components/ConsultationModal';
import AdminLoginModal from './components/AdminLoginModal';
import ToastProvider from './components/Toast';
import { InlineEditProvider } from './components/InlineEditProvider';

export default function App() {
  const [activeTab, setActiveTab] = useState('inicio');
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<string | undefined>(undefined);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);

  const handleOpenConsultation = (serviceName?: string) => {
    setSelectedService(serviceName);
    setIsConsultationOpen(true);
  };

  return (
    <ToastProvider>
      <InlineEditProvider>
        <div className="min-h-screen bg-[#060606] text-white flex flex-col selection:bg-[#22c55e]/30 selection:text-white">
          
          {/* Persistent Global Header */}
          <Header 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            onOpenConsultation={() => handleOpenConsultation()} 
            onOpenAdminLogin={() => setIsAdminLoginOpen(true)} 
          />

          {/* Main Content Area */}
          <main className="flex-1 w-full">
            {activeTab === 'inicio' && (
              <HomeSection 
                onNavigate={setActiveTab} 
                onOpenConsultation={handleOpenConsultation} 
              />
            )}

            {activeTab === 'sobre-nos' && (
              <AboutSection 
                onNavigate={setActiveTab} 
                onOpenConsultation={handleOpenConsultation} 
              />
            )}

            {activeTab === 'portfolio' && (
              <PortfolioSection 
                onOpenConsultation={handleOpenConsultation} 
              />
            )}

            {activeTab === 'apps' && (
              <AppsSection 
                onOpenConsultation={handleOpenConsultation} 
              />
            )}

            {/* MOTION LAB: Exact Motion Principles Site */}
            {activeTab === 'academia' && (
              <MotionLabSection 
                onNavigate={setActiveTab} 
                onOpenConsultation={handleOpenConsultation} 
              />
            )}

            {activeTab === 'carreiras' && (
              <CareersSection />
            )}

            {activeTab === 'admin' && (
              <AdminPanel />
            )}
          </main>

          {/* Footer (Rendered across Techify tabs) */}
          {activeTab !== 'academia' && activeTab !== 'admin' && (
            <Footer 
              onNavigate={setActiveTab} 
              onOpenConsultation={handleOpenConsultation} 
            />
          )}

          {/* Modals */}
          <ConsultationModal 
            isOpen={isConsultationOpen} 
            onClose={() => setIsConsultationOpen(false)} 
            defaultService={selectedService} 
          />

          <AdminLoginModal 
            isOpen={isAdminLoginOpen} 
            onClose={() => setIsAdminLoginOpen(false)} 
            onSuccess={() => setActiveTab('admin')} 
          />
        </div>
      </InlineEditProvider>
    </ToastProvider>
  );
}
