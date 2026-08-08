import React, { useState, useEffect } from 'react';
import { 
  Shield, Calendar, Clock, Briefcase, Users, Handshake, 
  Mail, Phone, Instagram, CheckCircle2, XCircle, Send, 
  Plus, Trash2, Check, RefreshCw, ExternalLink
} from 'lucide-react';
import { collection, onSnapshot, doc, updateDoc, deleteDoc, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface ConsultaItem {
  id: string;
  nome: string;
  email: string;
  whatsapp: string;
  servico: string;
  data: string;
  horario?: string;
  resumo?: string;
  status: 'pendente' | 'concluido' | 'recusado';
  createdAt?: string;
}

interface CandidaturaItem {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  vaga: string;
  portfolio?: string;
  experiencia?: string;
  status: 'pendente' | 'aprovado' | 'recusado';
  createdAt?: string;
}

interface LeadItem {
  id: string;
  nome: string;
  segmento: string;
  email: string;
  telefone: string;
  instagram: string;
  interesses: string;
  status: string;
  emailsEnviados: number;
  dataEnvio: string;
  createdAt?: string;
}

interface ParceiroItem {
  id: string;
  nome: string;
  empresa: string;
  email: string;
  telefone: string;
  categoria: string;
  status: string;
  createdAt?: string;
}

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<'andamento' | 'historico' | 'candidaturas' | 'leads' | 'parceiros'>('andamento');

  const [consultas, setConsultas] = useState<ConsultaItem[]>([]);
  const [candidaturas, setCandidaturas] = useState<CandidaturaItem[]>([]);
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [parceiros, setParceiros] = useState<ParceiroItem[]>([]);

  const [isNewLeadModalOpen, setIsNewLeadModalOpen] = useState(false);
  const [newLeadForm, setNewLeadForm] = useState({
    nome: '',
    segmento: 'Roupas',
    email: '',
    telefone: '',
    instagram: '',
    interesses: 'Site',
  });

  // Seed sample data if collections are empty
  useEffect(() => {
    const seedInitialData = async () => {
      try {
        const consultasSnap = await getDocs(collection(db, "consultas"));
        if (consultasSnap.empty) {
          const initialConsultas = [
            {
              nome: "Lucas",
              email: "rickmarketing81@gmail.com",
              whatsapp: "81995498590",
              servico: "Design Gráfico",
              status: "pendente",
              data: "12/08/2026",
              horario: "14:00",
              resumo: "Criação de nova identidade visual.",
              createdAt: "2026-08-12T14:00:00Z"
            },
            {
              nome: "maros henrique gomes barbosa",
              email: "aigerakabane81983521523@gmail.com",
              whatsapp: "453456345345",
              servico: "Branding",
              status: "pendente",
              data: "15/08/2026",
              horario: "10:30",
              resumo: "Estratégia de branding e logotipo.",
              createdAt: "2026-08-15T10:30:00Z"
            },
            {
              nome: "Letícia Carla Araújo da Silva",
              email: "leticiacarla0826@gmail.com",
              whatsapp: "+55 81 8545-1557",
              servico: "Outro",
              status: "pendente",
              data: "18/08/2026",
              horario: "16:00",
              resumo: "Mentoria e consultoria de design.",
              createdAt: "2026-08-18T16:00:00Z"
            },
            {
              nome: "MARCOS HENRIQUE GOMES BARBOSA",
              email: "aigerakabane81983521523@gmail.com",
              whatsapp: "81998352152",
              servico: "Criação de Sites",
              status: "concluido",
              data: "02/04/2026",
              horario: "09:00",
              resumo: "Desenvolvimento do site institucional.",
              createdAt: "2026-04-02T09:00:00Z"
            },
            {
              nome: "marcos henrique",
              email: "rickmarketing81@gmail.com",
              whatsapp: "81995498590",
              servico: "Criação de Sites",
              status: "concluido",
              data: "15/11/2025",
              horario: "15:00",
              resumo: "Portal e-commerce.",
              createdAt: "2025-11-15T15:00:00Z"
            },
            {
              nome: "marcos henrique",
              email: "rickmarketing81@gmail.com",
              whatsapp: "81995498590",
              servico: "Criação de Sites",
              status: "concluido",
              data: "13/11/2025",
              horario: "11:00",
              resumo: "Otimização de velocidade.",
              createdAt: "2025-11-13T11:00:00Z"
            },
            {
              nome: "marcos henrique",
              email: "rickmarketing81@gmail.com",
              whatsapp: "81995498590",
              servico: "Branding",
              status: "recusado",
              data: "13/11/2025",
              horario: "14:00",
              resumo: "Escopo fora do orçamento.",
              createdAt: "2025-11-13T14:00:00Z"
            }
          ];
          for (const item of initialConsultas) {
            await addDoc(collection(db, "consultas"), item);
          }
        }

        const leadsSnap = await getDocs(collection(db, "leads"));
        if (leadsSnap.empty) {
          const initialLeads = [
            {
              nome: "Rickzinxx",
              segmento: "Roupas",
              email: "aigerakabane81983521523@gmail.com",
              telefone: "5581983521523",
              instagram: "Xr_rickk",
              interesses: "Logo",
              status: "Completo",
              emailsEnviados: 0,
              dataEnvio: "20/05/2026",
              createdAt: "2026-05-20T10:00:00Z"
            },
            {
              nome: "BRENDA EVELYN",
              segmento: "Não",
              email: "brendaevelyn2023@gmail.com",
              telefone: "8199272391",
              instagram: "eve.lyn._4",
              interesses: "Inglês",
              status: "Completo",
              emailsEnviados: 10,
              dataEnvio: "02/04/2026",
              createdAt: "2026-04-02T10:00:00Z"
            },
            {
              nome: "Marcos paulo De souza",
              segmento: "Vendo roupa",
              email: "dmarcospaulo893@gmail.com",
              telefone: "81999130885",
              instagram: "Piquetehh",
              interesses: "Site",
              status: "Completo",
              emailsEnviados: 17,
              dataEnvio: "03/01/2026",
              createdAt: "2026-01-03T10:00:00Z"
            },
            {
              nome: "Lucas Mendes",
              segmento: "Moda Masculina",
              email: "lucas.mendes@gmail.com",
              telefone: "81988887777",
              instagram: "lucas_mendes",
              interesses: "E-commerce & App",
              status: "Completo",
              emailsEnviados: 2,
              dataEnvio: "10/06/2026",
              createdAt: "2026-06-10T10:00:00Z"
            },
            {
              nome: "Mariana Costa",
              segmento: "Estética & Beleza",
              email: "mariana.costa@beleza.com",
              telefone: "81977776666",
              instagram: "mari_estetica",
              interesses: "Identidade Visual",
              status: "Completo",
              emailsEnviados: 5,
              dataEnvio: "18/07/2026",
              createdAt: "2026-07-18T10:00:00Z"
            }
          ];
          for (const item of initialLeads) {
            await addDoc(collection(db, "leads"), item);
          }
        }

        const candidaturasSnap = await getDocs(collection(db, "candidaturas"));
        if (candidaturasSnap.empty) {
          const initialCandidaturas = [
            {
              nome: "Gabriel Santos",
              email: "gabriel.santos@gmail.com",
              telefone: "11988882222",
              vaga: "Engenheiro Frontend Senior",
              portfolio: "https://github.com/gabrielsantos",
              experiencia: "5 anos de experiência com React, TypeScript e Tailwind CSS.",
              status: "pendente",
              createdAt: new Date().toISOString()
            },
            {
              nome: "Ana Paula Lima",
              email: "ana.lima@design.com",
              telefone: "21977773333",
              vaga: "Lead Product Designer (UI/UX)",
              portfolio: "https://behance.net/analima",
              experiencia: "Especialista em Figma, Design Systems e testes de usabilidade.",
              status: "pendente",
              createdAt: new Date().toISOString()
            }
          ];
          for (const item of initialCandidaturas) {
            await addDoc(collection(db, "candidaturas"), item);
          }
        }

        const parceirosSnap = await getDocs(collection(db, "parceiros"));
        if (parceirosSnap.empty) {
          const initialParceiros = [
            {
              nome: "Rodrigo Mendes",
              empresa: "Apex Cloud Soluções",
              email: "rodrigo@apexcloud.com.br",
              telefone: "11966665555",
              categoria: "Infraestrutura Cloud",
              status: "Ativo",
              createdAt: new Date().toISOString()
            },
            {
              nome: "Juliana Costa",
              empresa: "Vortex Marketing Digital",
              email: "juliana@vortex.com.br",
              telefone: "21955554444",
              categoria: "Mídia & Performance",
              status: "Ativo",
              createdAt: new Date().toISOString()
            }
          ];
          for (const item of initialParceiros) {
            await addDoc(collection(db, "parceiros"), item);
          }
        }
      } catch (err) {
        console.error("Error seeding initial Firestore data:", err);
      }
    };

    seedInitialData();
  }, []);

  // Real-time Firestore Listeners
  useEffect(() => {
    const unsubConsultas = onSnapshot(collection(db, "consultas"), (snapshot) => {
      const docs: ConsultaItem[] = [];
      snapshot.forEach((doc) => {
        docs.push({ id: doc.id, ...doc.data() } as ConsultaItem);
      });
      setConsultas(docs);
    });

    const unsubCandidaturas = onSnapshot(collection(db, "candidaturas"), (snapshot) => {
      const docs: CandidaturaItem[] = [];
      snapshot.forEach((doc) => {
        docs.push({ id: doc.id, ...doc.data() } as CandidaturaItem);
      });
      setCandidaturas(docs);
    });

    const unsubLeads = onSnapshot(collection(db, "leads"), (snapshot) => {
      const docs: LeadItem[] = [];
      snapshot.forEach((doc) => {
        docs.push({ id: doc.id, ...doc.data() } as LeadItem);
      });
      setLeads(docs);
    });

    const unsubParceiros = onSnapshot(collection(db, "parceiros"), (snapshot) => {
      const docs: ParceiroItem[] = [];
      snapshot.forEach((doc) => {
        docs.push({ id: doc.id, ...doc.data() } as ParceiroItem);
      });
      setParceiros(docs);
    });

    return () => {
      unsubConsultas();
      unsubCandidaturas();
      unsubLeads();
      unsubParceiros();
    };
  }, []);

  // Filtered lists
  const emAndamentoList = consultas.filter(c => c.status === 'pendente');
  const historicoList = consultas.filter(c => c.status === 'concluido' || c.status === 'recusado');

  // Status Handlers
  const handleUpdateConsultaStatus = async (id: string, newStatus: 'concluido' | 'recusado') => {
    try {
      await updateDoc(doc(db, "consultas", id), { status: newStatus });
    } catch (err) {
      console.error("Error updating consulta status:", err);
    }
  };

  const handleDeleteConsulta = async (id: string) => {
    try {
      await deleteDoc(doc(db, "consultas", id));
    } catch (err) {
      console.error("Error deleting consulta:", err);
    }
  };

  const handleUpdateCandidaturaStatus = async (id: string, newStatus: 'aprovado' | 'recusado') => {
    try {
      await updateDoc(doc(db, "candidaturas", id), { status: newStatus });
    } catch (err) {
      console.error("Error updating candidatura status:", err);
    }
  };

  const handleDeleteCandidatura = async (id: string) => {
    try {
      await deleteDoc(doc(db, "candidaturas", id));
    } catch (err) {
      console.error("Error deleting candidatura:", err);
    }
  };

  const handleSendEmailLead = async (lead: LeadItem) => {
    try {
      await updateDoc(doc(db, "leads", lead.id), {
        emailsEnviados: (lead.emailsEnviados || 0) + 1,
        dataEnvio: new Date().toLocaleDateString('pt-BR')
      });
      window.location.href = `mailto:${lead.email}?subject=Atendimento Techify&body=Olá ${lead.nome}, entramos em contato sobre o seu projeto...`;
    } catch (err) {
      console.error("Error sending email to lead:", err);
    }
  };

  const handleDeleteLead = async (id: string) => {
    try {
      await deleteDoc(doc(db, "leads", id));
    } catch (err) {
      console.error("Error deleting lead:", err);
    }
  };

  const handleDeleteParceiro = async (id: string) => {
    try {
      await deleteDoc(doc(db, "parceiros", id));
    } catch (err) {
      console.error("Error deleting parceiro:", err);
    }
  };

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadForm.nome || !newLeadForm.email) return;

    try {
      await addDoc(collection(db, "leads"), {
        nome: newLeadForm.nome,
        segmento: newLeadForm.segmento || 'Geral',
        email: newLeadForm.email,
        telefone: newLeadForm.telefone || 'N/A',
        instagram: newLeadForm.instagram ? newLeadForm.instagram.replace('@', '') : 'N/A',
        interesses: newLeadForm.interesses || 'Site',
        status: 'Completo',
        emailsEnviados: 0,
        dataEnvio: new Date().toLocaleDateString('pt-BR'),
        createdAt: new Date().toISOString()
      });
      setIsNewLeadModalOpen(false);
      setNewLeadForm({ nome: '', segmento: 'Roupas', email: '', telefone: '', instagram: '', interesses: 'Site' });
    } catch (err) {
      console.error("Error adding new lead:", err);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#070807] text-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        
        {/* Header exact match to screenshots */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800/60">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#a3e635]/10 border border-[#a3e635]/30 text-[#a3e635] shadow-[0_0_20px_rgba(163,230,53,0.15)]">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <h1 className="font-display text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
                Painel <span className="text-[#a3e635]">Admin</span>
              </h1>
              <p className="text-neutral-400 text-xs sm:text-sm font-sans mt-0.5">
                Gerencie consultas agendadas e candidaturas às vagas
              </p>
            </div>
          </div>

          {activeTab === 'leads' && (
            <button
              onClick={() => setIsNewLeadModalOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-[#a3e635] hover:bg-[#84cc16] text-black font-extrabold text-xs px-4 py-2.5 transition-all shadow-[0_0_12px_rgba(163,230,53,0.3)] cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Cadastrar Lead</span>
            </button>
          )}
        </div>

        {/* Tab Selection Navigation Bar */}
        <div className="mt-8 rounded-2xl border border-neutral-800/80 bg-[#0e0f0e] p-1.5 flex flex-wrap items-center gap-2">
          
          <button
            onClick={() => setActiveTab('andamento')}
            className={`px-4 py-2.5 rounded-xl flex items-center gap-2 text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'andamento'
                ? 'bg-[#a3e635] text-black shadow-[0_0_12px_rgba(163,230,53,0.3)]'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900/60'
            }`}
          >
            <Calendar className="h-4 w-4" />
            <span>Em Andamento ({emAndamentoList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('historico')}
            className={`px-4 py-2.5 rounded-xl flex items-center gap-2 text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'historico'
                ? 'bg-[#a3e635] text-black shadow-[0_0_12px_rgba(163,230,53,0.3)]'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900/60'
            }`}
          >
            <Clock className="h-4 w-4" />
            <span>Histórico ({historicoList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('candidaturas')}
            className={`px-4 py-2.5 rounded-xl flex items-center gap-2 text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'candidaturas'
                ? 'bg-[#a3e635] text-black shadow-[0_0_12px_rgba(163,230,53,0.3)]'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900/60'
            }`}
          >
            <Briefcase className="h-4 w-4" />
            <span>Candidaturas ({candidaturas.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('leads')}
            className={`px-4 py-2.5 rounded-xl flex items-center gap-2 text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'leads'
                ? 'bg-[#a3e635] text-black shadow-[0_0_12px_rgba(163,230,53,0.3)]'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900/60'
            }`}
          >
            <Users className="h-4 w-4" />
            <span>Leads ({leads.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('parceiros')}
            className={`px-4 py-2.5 rounded-xl flex items-center gap-2 text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'parceiros'
                ? 'bg-[#a3e635] text-black shadow-[0_0_12px_rgba(163,230,53,0.3)]'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900/60'
            }`}
          >
            <Handshake className="h-4 w-4" />
            <span>Parceiros ({parceiros.length})</span>
          </button>

        </div>

        {/* TAB CONTENT PANELS */}

        {/* 1. EM ANDAMENTO TAB */}
        {activeTab === 'andamento' && (
          <div className="mt-6">
            {emAndamentoList.length === 0 ? (
              <div className="rounded-2xl border border-neutral-800 bg-[#121312] p-12 text-center text-neutral-400">
                <Calendar className="mx-auto h-10 w-10 text-neutral-600 mb-3" />
                <p className="text-base font-bold text-white">Nenhum agendamento em andamento</p>
                <p className="text-xs text-neutral-500 mt-1">Novas solicitações de consulta enviadas no site aparecerão aqui em tempo real.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {emAndamentoList.map((item) => (
                  <div 
                    key={item.id}
                    className="bg-[#131414] border border-neutral-800/80 rounded-2xl p-5 hover:border-neutral-700/80 transition-all flex flex-col justify-between shadow-lg"
                  >
                    <div>
                      {/* Name Header */}
                      <h3 className="font-bold text-white text-lg font-sans tracking-tight">
                        {item.nome}
                      </h3>

                      {/* Badges Row */}
                      <div className="flex flex-wrap items-center gap-2 mt-2 mb-4">
                        <span className="bg-[#451a03]/60 border border-[#f59e0b]/40 text-[#f59e0b] text-[11px] font-bold px-2.5 py-0.5 rounded-md">
                          pendente
                        </span>
                        <span className="bg-[#4c1d95]/50 border border-[#a855f7]/40 text-[#d8b4fe] text-[11px] font-bold px-2.5 py-0.5 rounded-md">
                          {item.servico}
                        </span>
                      </div>

                      {/* Contact Info */}
                      <div className="space-y-2 text-xs text-neutral-300">
                        <div className="flex items-center gap-2 text-neutral-400">
                          <Mail className="h-3.5 w-3.5 text-neutral-500 shrink-0" />
                          <span className="truncate">{item.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-neutral-400">
                          <Phone className="h-3.5 w-3.5 text-neutral-500 shrink-0" />
                          <span>{item.whatsapp}</span>
                        </div>
                        {item.data && (
                          <div className="flex items-center gap-2 text-neutral-400 pt-1">
                            <Clock className="h-3.5 w-3.5 text-neutral-500 shrink-0" />
                            <span>{item.data} {item.horario ? `às ${item.horario}` : ''}</span>
                          </div>
                        )}
                        {item.resumo && (
                          <div className="bg-[#0b0c0b] p-3 rounded-xl border border-neutral-800/60 mt-3 text-xs text-neutral-400 leading-relaxed">
                            "{item.resumo}"
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-3 mt-6 pt-4 border-t border-neutral-800/50">
                      <button
                        onClick={() => handleUpdateConsultaStatus(item.id, 'concluido')}
                        className="bg-[#22c55e] hover:bg-[#16a34a] text-white font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5 text-xs transition-all active:scale-95 shadow-[0_2px_10px_rgba(34,197,94,0.2)] cursor-pointer"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Aceitar</span>
                      </button>

                      <button
                        onClick={() => handleUpdateConsultaStatus(item.id, 'recusado')}
                        className="bg-[#ef4444] hover:bg-[#dc2626] text-white font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5 text-xs transition-all active:scale-95 shadow-[0_2px_10px_rgba(239,68,68,0.2)] cursor-pointer"
                      >
                        <XCircle className="h-4 w-4" />
                        <span>Recusar</span>
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 2. HISTÓRICO TAB */}
        {activeTab === 'historico' && (
          <div className="mt-6">
            {historicoList.length === 0 ? (
              <div className="rounded-2xl border border-neutral-800 bg-[#121312] p-12 text-center text-neutral-400">
                <Clock className="mx-auto h-10 w-10 text-neutral-600 mb-3" />
                <p className="text-base font-bold text-white">Nenhum histórico registrado</p>
                <p className="text-xs text-neutral-500 mt-1">Consultas aceitas ou recusadas aparecerão neste arquivo.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {historicoList.map((item) => {
                  const isConcluido = item.status === 'concluido';
                  return (
                    <div 
                      key={item.id}
                      className="bg-[#131414] border border-neutral-800/80 rounded-2xl p-5 hover:border-neutral-700/80 transition-all flex flex-col justify-between shadow-lg"
                    >
                      <div>
                        {/* Header Row */}
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-bold text-white text-base uppercase font-sans tracking-tight">
                            {item.nome}
                          </h3>
                          <span className="bg-[#4c1d95]/50 border border-[#a855f7]/40 text-[#d8b4fe] text-[11px] font-bold px-2.5 py-0.5 rounded-md shrink-0">
                            {item.servico}
                          </span>
                        </div>

                        {/* Status Badge */}
                        <div className="my-2">
                          {isConcluido ? (
                            <span className="bg-[#4c1d95]/60 border border-[#a855f7]/50 text-[#d8b4fe] text-[11px] font-bold px-2.5 py-0.5 rounded-md inline-block">
                              concluido
                            </span>
                          ) : (
                            <span className="bg-[#7f1d1d]/60 border border-[#ef4444]/50 text-[#fca5a5] text-[11px] font-bold px-2.5 py-0.5 rounded-md inline-block">
                              recusado
                            </span>
                          )}
                        </div>

                        {/* Contact details */}
                        <div className="space-y-2 text-xs text-neutral-400 mt-3">
                          <div className="flex items-center gap-2">
                            <Mail className="h-3.5 w-3.5 text-neutral-500 shrink-0" />
                            <span className="truncate">{item.email}</span>
                          </div>
                          {item.data && (
                            <div className="flex items-center gap-2">
                              <Clock className="h-3.5 w-3.5 text-neutral-500 shrink-0" />
                              <span>{item.data}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex justify-end pt-4 mt-4 border-t border-neutral-800/50">
                        <button
                          onClick={() => handleDeleteConsulta(item.id)}
                          className="text-neutral-500 hover:text-red-400 p-1.5 transition-colors cursor-pointer"
                          title="Remover do Histórico"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* 3. CANDIDATURAS TAB */}
        {activeTab === 'candidaturas' && (
          <div className="mt-6">
            {candidaturas.length === 0 ? (
              <div className="rounded-2xl border border-neutral-800 bg-[#121312] p-12 text-center text-neutral-400">
                <Briefcase className="mx-auto h-10 w-10 text-neutral-600 mb-3" />
                <p className="text-base font-bold text-white">Nenhuma candidatura recebida</p>
                <p className="text-xs text-neutral-500 mt-1">Candidaturas enviadas na aba 'Carreiras' aparecerão aqui.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {candidaturas.map((item) => (
                  <div 
                    key={item.id}
                    className="bg-[#131414] border border-neutral-800/80 rounded-2xl p-5 hover:border-neutral-700/80 transition-all flex flex-col justify-between shadow-lg"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-bold text-white text-lg font-sans">
                          {item.nome}
                        </h3>
                        <span className="bg-[#1e293b] border border-[#3b82f6]/40 text-[#93c5fd] text-[11px] font-bold px-2.5 py-0.5 rounded-md">
                          {item.vaga}
                        </span>
                      </div>

                      <div className="space-y-2 text-xs text-neutral-400 mt-3">
                        <div className="flex items-center gap-2">
                          <Mail className="h-3.5 w-3.5 text-neutral-500 shrink-0" />
                          <span className="truncate">{item.email}</span>
                        </div>
                        {item.telefone && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-3.5 w-3.5 text-neutral-500 shrink-0" />
                            <span>{item.telefone}</span>
                          </div>
                        )}
                        {item.portfolio && (
                          <div className="flex items-center gap-2 pt-1 text-brand-lime">
                            <ExternalLink className="h-3.5 w-3.5 text-brand-lime shrink-0" />
                            <a href={item.portfolio} target="_blank" rel="noopener noreferrer" className="hover:underline truncate">
                              {item.portfolio}
                            </a>
                          </div>
                        )}
                        {item.experiencia && (
                          <div className="bg-[#0b0c0b] p-3 rounded-xl border border-neutral-800/60 mt-3 text-xs text-neutral-300 leading-relaxed">
                            {item.experiencia}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 mt-4 border-t border-neutral-800/50">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleUpdateCandidaturaStatus(item.id, 'aprovado')}
                          className="bg-[#22c55e] hover:bg-[#16a34a] text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer"
                        >
                          Aprovar
                        </button>
                        <button
                          onClick={() => handleUpdateCandidaturaStatus(item.id, 'recusado')}
                          className="bg-[#ef4444] hover:bg-[#dc2626] text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer"
                        >
                          Recusar
                        </button>
                      </div>

                      <button
                        onClick={() => handleDeleteCandidatura(item.id)}
                        className="text-neutral-500 hover:text-red-400 p-1.5 transition-colors cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 4. LEADS TAB (Exact Screenshot #4 layout) */}
        {activeTab === 'leads' && (
          <div className="mt-6">
            {leads.length === 0 ? (
              <div className="rounded-2xl border border-neutral-800 bg-[#121312] p-12 text-center text-neutral-400">
                <Users className="mx-auto h-10 w-10 text-neutral-600 mb-3" />
                <p className="text-base font-bold text-white">Nenhum lead cadastrado</p>
                <p className="text-xs text-neutral-500 mt-1">Clique em 'Cadastrar Lead' para adicionar um novo cliente em potencial.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {leads.map((lead) => (
                  <div 
                    key={lead.id}
                    className="bg-[#131414] border border-neutral-800/80 rounded-2xl p-5 hover:border-neutral-700/80 transition-all flex flex-col justify-between shadow-lg"
                  >
                    <div>
                      {/* Name & Completo Badge */}
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-bold text-white text-lg font-sans">
                          {lead.nome}
                        </h3>
                        <span className="bg-[#14532d]/50 border border-[#22c55e]/50 text-[#4ade80] text-[11px] font-bold px-2.5 py-0.5 rounded-md shrink-0">
                          {lead.status || 'Completo'}
                        </span>
                      </div>

                      {/* Segment sub-label */}
                      <p className="text-neutral-400 text-xs my-1 font-medium">
                        {lead.segmento}
                      </p>

                      {/* Info lines */}
                      <div className="space-y-2 text-xs text-neutral-400 mt-3">
                        <div className="flex items-center gap-2">
                          <Mail className="h-3.5 w-3.5 text-neutral-500 shrink-0" />
                          <span className="truncate">{lead.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-3.5 w-3.5 text-neutral-500 shrink-0" />
                          <span>{lead.telefone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Instagram className="h-3.5 w-3.5 text-neutral-500 shrink-0" />
                          <span>@{lead.instagram.replace('@', '')}</span>
                        </div>
                      </div>

                      {/* Interesses dark box */}
                      <div className="bg-[#0c0d0d] p-3 rounded-xl border border-neutral-800/80 my-3">
                        <div className="text-[#a3e635] text-xs font-bold flex items-center gap-1.5 mb-1">
                          <span className="inline-block h-2 w-2 rounded-full bg-[#a3e635] shadow-[0_0_6px_#a3e635]" />
                          <span>Interesses</span>
                        </div>
                        <p className="text-white text-xs font-medium">
                          {lead.interesses}
                        </p>
                      </div>

                      {/* Footer Row */}
                      <div className="flex items-center justify-between text-[11px] text-neutral-500 pt-1">
                        <span>Emails enviados: {lead.emailsEnviados || 0}</span>
                        <span>{lead.dataEnvio}</span>
                      </div>
                    </div>

                    {/* Bright Green Email Action Button */}
                    <div className="mt-4 pt-3 border-t border-neutral-800/50 flex items-center gap-2">
                      <button
                        onClick={() => handleSendEmailLead(lead)}
                        className="bg-[#a3e635] hover:bg-[#84cc16] text-black font-extrabold py-2.5 rounded-xl flex items-center justify-center gap-2 text-xs flex-1 transition-all shadow-[0_0_12px_rgba(163,230,53,0.25)] cursor-pointer active:scale-98"
                      >
                        <Send className="h-4 w-4" />
                        <span>Enviar Email</span>
                      </button>

                      <button
                        onClick={() => handleDeleteLead(lead.id)}
                        className="bg-neutral-900 border border-neutral-800/80 hover:bg-red-500/20 hover:border-red-500/50 text-neutral-400 hover:text-red-400 p-2.5 rounded-xl transition-all cursor-pointer"
                        title="Excluir Lead"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 5. PARCEIROS TAB */}
        {activeTab === 'parceiros' && (
          <div className="mt-6">
            {parceiros.length === 0 ? (
              <div className="rounded-2xl border border-neutral-800 bg-[#121312] p-12 text-center text-neutral-400">
                <Handshake className="mx-auto h-10 w-10 text-neutral-600 mb-3" />
                <p className="text-base font-bold text-white">Nenhum parceiro cadastrado</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {parceiros.map((item) => (
                  <div 
                    key={item.id}
                    className="bg-[#131414] border border-neutral-800/80 rounded-2xl p-5 hover:border-neutral-700/80 transition-all flex flex-col justify-between shadow-lg"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-bold text-white text-lg font-sans">
                          {item.empresa}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className="bg-[#14532d]/50 border border-[#22c55e]/50 text-[#4ade80] text-[11px] font-bold px-2.5 py-0.5 rounded-md">
                            {item.status}
                          </span>
                          <button
                            onClick={() => handleDeleteParceiro(item.id)}
                            className="text-neutral-500 hover:text-red-400 p-1 transition-colors cursor-pointer"
                            title="Excluir Parceiro"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <p className="text-neutral-400 text-xs my-1 font-medium">
                        Contato: {item.nome}
                      </p>

                      <div className="space-y-2 text-xs text-neutral-400 mt-3">
                        <div className="flex items-center gap-2">
                          <Mail className="h-3.5 w-3.5 text-neutral-500 shrink-0" />
                          <span>{item.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-3.5 w-3.5 text-neutral-500 shrink-0" />
                          <span>{item.telefone}</span>
                        </div>
                      </div>

                      <div className="bg-[#0c0d0d] p-3 rounded-xl border border-neutral-800/80 my-3 text-xs text-brand-lime">
                        Categoria: {item.categoria}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {/* New Lead Modal */}
      {isNewLeadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-neutral-800 bg-[#121312] p-6 text-white shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4">Cadastrar Novo Lead</h3>
            
            <form onSubmit={handleCreateLead} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1">Nome *</label>
                <input
                  required
                  type="text"
                  placeholder="Ex: João Silva"
                  value={newLeadForm.nome}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, nome: e.target.value })}
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-900 py-2.5 px-3 text-xs text-white focus:border-[#a3e635] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1">E-mail *</label>
                  <input
                    required
                    type="email"
                    placeholder="joao@email.com"
                    value={newLeadForm.email}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, email: e.target.value })}
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-900 py-2.5 px-3 text-xs text-white focus:border-[#a3e635] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1">Telefone</label>
                  <input
                    type="text"
                    placeholder="81999998888"
                    value={newLeadForm.telefone}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, telefone: e.target.value })}
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-900 py-2.5 px-3 text-xs text-white focus:border-[#a3e635] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1">Instagram</label>
                  <input
                    type="text"
                    placeholder="joao_oficial"
                    value={newLeadForm.instagram}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, instagram: e.target.value })}
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-900 py-2.5 px-3 text-xs text-white focus:border-[#a3e635] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1">Segmento</label>
                  <input
                    type="text"
                    placeholder="Roupas, Serviços..."
                    value={newLeadForm.segmento}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, segmento: e.target.value })}
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-900 py-2.5 px-3 text-xs text-white focus:border-[#a3e635] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1">Interesses</label>
                <input
                  type="text"
                  placeholder="Logo, Site, E-commerce..."
                  value={newLeadForm.interesses}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, interesses: e.target.value })}
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-900 py-2.5 px-3 text-xs text-white focus:border-[#a3e635] focus:outline-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewLeadModalOpen(false)}
                  className="flex-1 rounded-xl border border-neutral-800 py-2.5 text-xs text-neutral-300 hover:bg-neutral-900"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-[#a3e635] hover:bg-[#84cc16] text-black font-extrabold py-2.5 text-xs"
                >
                  Salvar Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
