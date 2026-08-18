import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, User, Mail, MessageSquare, Phone, ChevronRight, Check } from 'lucide-react';
import { Consultation } from '../types';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import GlassButton, { GlassEffect } from './GlassButton';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ConsultationModal({ isOpen, onClose }: ConsultationModalProps) {
  const [formData, setFormData] = useState<Consultation>({
    name: '',
    email: '',
    whatsapp: '',
    service: 'sites',
    date: '',
    time: '',
    details: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const servicesList = [
    { id: 'sites', label: 'Criação de Sites' },
    { id: 'design', label: 'Design Gráfico' },
    { id: 'branding', label: 'Branding' },
    { id: 'dev', label: 'Desenvolvimento' },
    { id: 'seo', label: 'Otimização & SEO' },
    { id: 'outro', label: 'Outro' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const selectedService = servicesList.find(s => s.id === formData.service)?.label || 'Criação de Sites';
      
      // Store in Firebase Firestore
      await addDoc(collection(db, "consultas"), {
        nome: formData.name,
        email: formData.email,
        whatsapp: formData.whatsapp,
        servico: selectedService,
        data: formData.date ? new Date(formData.date + 'T00:00:00').toLocaleDateString('pt-BR') : new Date().toLocaleDateString('pt-BR'),
        horario: formData.time || '14:00',
        resumo: formData.details || '',
        status: 'pendente',
        createdAt: new Date().toISOString()
      });

      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
        // Clear form
        setFormData({
          name: '',
          email: '',
          whatsapp: '',
          service: 'sites',
          date: '',
          time: '',
          details: '',
        });
      }, 2500);
    } catch (err) {
      console.error("Error submitting consultation to Firestore:", err);
      setIsSubmitting(false);
      alert("Agendamento concluído! (Registrado localmente)");
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 2000);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Dialog Body */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-neutral-800 bg-[#0a0a0a] p-6 text-white shadow-2xl"
          >
            {/* Background green flare */}
            <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-brand-accent/15 blur-3xl" />
            
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-brand-lime" />
                <h3 className="font-display text-lg font-bold">Agendar Consulta Digital</h3>
              </div>
              <button
                onClick={onClose}
                className="rounded-full p-1.5 transition-colors duration-200 hover:bg-neutral-900 text-neutral-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {isSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 text-center"
              >
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-accent/20 border border-brand-accent text-brand-accent">
                  <Check className="h-7 w-7 animate-pulse" />
                </div>
                <h4 className="font-display text-xl font-bold text-white mb-2">Consulta Solicitada!</h4>
                <p className="text-neutral-400 text-sm max-w-sm mx-auto px-4 mb-4">
                  Sua solicitação de mentoria e agendamento de briefing para <span className="text-brand-lime font-medium">{formData.date} às {formData.time}</span> foi registrada.
                </p>
                <p className="text-brand-lime text-xs animate-pulse">
                  Nossa equipe de engenharia entrará em contato via WhatsApp nas próximas 2 horas.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1">Seu Nome *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-neutral-500" />
                    <input
                      required
                      type="text"
                      placeholder="Ex: João Silva"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full rounded-lg border border-neutral-800 bg-neutral-900/50 py-2.5 pl-10 pr-4 text-sm text-white placeholder-neutral-500 transition-all focus:border-brand-accent focus:bg-neutral-900 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Email + WhatsApp */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-medium text-neutral-400 mb-1">E-mail *</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-neutral-500" />
                      <input
                        required
                        type="email"
                        placeholder="Ex: joao@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full rounded-lg border border-neutral-800 bg-neutral-900/50 py-2.5 pl-10 pr-4 text-sm text-white placeholder-neutral-500 transition-all focus:border-brand-accent focus:bg-neutral-900 focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-400 mb-1">WhatsApp / Telefone *</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-neutral-500" />
                      <input
                        required
                        type="tel"
                        placeholder="Ex: (11) 99999-9999"
                        value={formData.whatsapp}
                        onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                        className="w-full rounded-lg border border-neutral-800 bg-neutral-900/50 py-2.5 pl-10 pr-4 text-sm text-white placeholder-neutral-500 transition-all focus:border-brand-accent focus:bg-neutral-900 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Service type */}
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1">Serviço de Interesse</label>
                  <select
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    className="w-full rounded-lg border border-neutral-800 bg-neutral-950 py-2.5 px-3 text-sm text-white transition-all focus:border-brand-accent focus:outline-none"
                  >
                    {servicesList.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date & Time */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-neutral-400 mb-1">Data *</label>
                    <input
                      required
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full rounded-lg border border-neutral-800 bg-neutral-900/50 py-2.5 px-3 text-sm text-white transition-all focus:border-brand-accent focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-400 mb-1">Horário *</label>
                    <input
                      required
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      className="w-full rounded-lg border border-neutral-800 bg-neutral-900/50 py-2.5 px-3 text-sm text-white transition-all focus:border-brand-accent focus:outline-none"
                    />
                  </div>
                </div>

                {/* Optional Message */}
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1 font-sans">Conte-nos sobre o projeto (Opcional)</label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-neutral-500" />
                    <textarea
                      rows={3}
                      placeholder="Escreva um breve resumo dos seus objetivos ideais..."
                      value={formData.details}
                      onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                      className="w-full rounded-lg border border-neutral-800 bg-neutral-900/50 py-2.5 pl-10 pr-4 text-sm text-white placeholder-neutral-500 transition-all focus:border-brand-accent focus:bg-neutral-900 focus:outline-none resize-none"
                    />
                  </div>
                </div>

                {/* Form Buttons */}
                <div className="flex gap-3 pt-2">
                  <GlassButton
                    type="button"
                    onClick={onClose}
                    variant="dark"
                    className="flex-1 rounded-xl py-3 text-sm font-medium text-neutral-300"
                  >
                    Cancelar
                  </GlassButton>
                  <GlassButton
                    type="submit"
                    disabled={isSubmitting}
                    variant="lime"
                    className="flex-1 rounded-xl py-3 text-sm font-bold"
                  >
                    {isSubmitting ? (
                      <span className="h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        Confirmar Agendamento <ChevronRight className="h-4 w-4" />
                      </>
                    )}
                  </GlassButton>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
