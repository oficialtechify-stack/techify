import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, 
  Sparkles, 
  Upload, 
  Trash2, 
  Plus, 
  Edit, 
  Check, 
  Save, 
  Globe, 
  MessageSquare, 
  Info, 
  Image as ImageIcon, 
  Link as LinkIcon, 
  Linkedin, 
  Instagram, 
  Phone, 
  Mail, 
  MapPin, 
  RotateCcw,
  CheckCircle2,
  X,
  Camera
} from 'lucide-react';
import { 
  TeamMember, 
  SiteGeneralContent, 
  DEFAULT_TEAM_MEMBERS, 
  DEFAULT_SITE_CONTENT,
  getCachedTeamMembers,
  getCachedGeneralContent,
  saveTeamMembersToFirestore,
  saveGeneralContentToFirestore
} from '../lib/siteContent';
import { compressImageFile } from '../lib/imageUtils';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { toast } from './Toast';

const PRESET_AVATARS = [
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80"
];

export default function AdminSiteEditorTab() {
  const [subTab, setSubTab] = useState<'team' | 'hero' | 'about' | 'contact'>('team');
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(getCachedTeamMembers);
  const [generalContent, setGeneralContent] = useState<SiteGeneralContent>(getCachedGeneralContent);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Member Modal State
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [memberName, setMemberName] = useState('');
  const [memberRole, setMemberRole] = useState('');
  const [memberDescription, setMemberDescription] = useState('');
  const [memberAvatar, setMemberAvatar] = useState('');
  const [memberLinkedin, setMemberLinkedin] = useState('');
  const [memberInstagram, setMemberInstagram] = useState('');
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Quick photo upload ref for cards directly
  const [quickTargetMemberId, setQuickTargetMemberId] = useState<string | null>(null);
  const quickFileInputRef = useRef<HTMLInputElement>(null);

  // Sync from Firestore real-time
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

    return () => {
      unsubTeam();
      unsubGeneral();
    };
  }, []);

  const showNotification = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3500);
  };

  // Open member modal for edit or new
  const handleOpenMemberModal = (member?: TeamMember) => {
    if (member) {
      setEditingMemberId(member.id);
      setMemberName(member.name);
      setMemberRole(member.role);
      setMemberDescription(member.description);
      setMemberAvatar(member.avatar);
      setMemberLinkedin(member.linkedin || '');
      setMemberInstagram(member.instagram || '');
    } else {
      setEditingMemberId(null);
      setMemberName('');
      setMemberRole('');
      setMemberDescription('');
      setMemberAvatar(PRESET_AVATARS[0]);
      setMemberLinkedin('https://linkedin.com');
      setMemberInstagram('');
    }
    setIsMemberModalOpen(true);
  };

  // Upload image from file
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingPhoto(true);
    try {
      const base64 = await compressImageFile(file, 600, 600, 0.85);
      setMemberAvatar(base64);
    } catch (err) {
      console.error('Error compressing avatar:', err);
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  // Quick photo upload directly from card
  const handleQuickCardPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !quickTargetMemberId) return;

    try {
      const base64 = await compressImageFile(file, 600, 600, 0.85);
      const updated = teamMembers.map(m => m.id === quickTargetMemberId ? { ...m, avatar: base64 } : m);
      setTeamMembers(updated);
      await saveTeamMembersToFirestore(updated);
      toast.success("Foto Atualizada", "A nova foto do membro foi salva e publicada.");
    } catch (err) {
      console.error(err);
      toast.error("Erro ao Salvar", "Não foi possível atualizar a foto.");
    } finally {
      setQuickTargetMemberId(null);
      if (quickFileInputRef.current) quickFileInputRef.current.value = '';
    }
  };

  // Save member
  const handleSaveMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberName.trim() || !memberRole.trim()) {
      toast.warning("Campos Obrigatórios", "Preencha o nome e o cargo do colaborador.");
      return;
    }

    setIsSaving(true);
    try {
      let updated: TeamMember[];
      if (editingMemberId) {
        updated = teamMembers.map(m => m.id === editingMemberId ? {
          ...m,
          name: memberName.trim(),
          role: memberRole.trim(),
          description: memberDescription.trim() || 'Profissional especialista da Techify.',
          avatar: memberAvatar.trim() || PRESET_AVATARS[0],
          linkedin: memberLinkedin.trim(),
          instagram: memberInstagram.trim()
        } : m);
        toast.success("Membro Atualizado", `Os dados de "${memberName}" foram atualizados com sucesso.`);
      } else {
        const newMember: TeamMember = {
          id: `member-${Date.now()}`,
          name: memberName.trim(),
          role: memberRole.trim(),
          description: memberDescription.trim() || 'Profissional especialista da Techify.',
          avatar: memberAvatar.trim() || PRESET_AVATARS[0],
          linkedin: memberLinkedin.trim(),
          instagram: memberInstagram.trim()
        };
        updated = [...teamMembers, newMember];
        toast.success("Novo Membro Adicionado", `"${memberName}" agora faz parte da equipe no site.`);
      }

      setTeamMembers(updated);
      await saveTeamMembersToFirestore(updated);
      setIsMemberModalOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao Salvar", "Ocorreu um erro ao salvar o membro.");
    } finally {
      setIsSaving(false);
    }
  };

  // Delete member
  const handleDeleteMember = async (id: string, name: string) => {
    if (!window.confirm(`Tem certeza que deseja excluir "${name}" do time?`)) return;
    try {
      const updated = teamMembers.filter(m => m.id !== id);
      setTeamMembers(updated);
      await saveTeamMembersToFirestore(updated);
      toast.info("Membro Removido", `"${name}" foi excluído da lista de equipe.`);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao Excluir", "Não foi possível remover o membro.");
    }
  };

  // Restore default team
  const handleRestoreDefaultTeam = async () => {
    if (!window.confirm("Deseja restaurar a equipe padrão da Techify (Marcos Henrique, Vitória Ellen, Gabriel Rocha, Lucas Ferreira)?")) return;
    try {
      setTeamMembers(DEFAULT_TEAM_MEMBERS);
      await saveTeamMembersToFirestore(DEFAULT_TEAM_MEMBERS);
      toast.info("Equipe Restaurada", "A formação padrão da equipe foi recarregada.");
    } catch (err) {
      console.error(err);
      toast.error("Erro ao Restaurar", "Não foi possível restaurar a equipe padrão.");
    }
  };

  // Save general texts (Hero, About, Contact)
  const handleSaveGeneralContent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await saveGeneralContentToFirestore(generalContent);
      toast.success("Textos Salvos", "O conteúdo do site foi sincronizado em tempo real.");
    } catch (err) {
      console.error(err);
      toast.error("Erro ao Salvar", "Não foi possível gravar as alterações de texto.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mt-6 flex flex-col gap-6">
      {/* Hidden Quick File Input */}
      <input
        ref={quickFileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleQuickCardPhotoUpload}
      />

      {/* Header Banner */}
      <div className="rounded-2xl border border-neutral-800 bg-gradient-to-r from-[#121412] via-[#0d120d] to-[#121412] p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#a3e635]/10 text-[#a3e635] border border-[#a3e635]/30 text-xs font-bold">
              <Sparkles className="h-3.5 w-3.5" /> CMS Visual do Site
            </span>
          </div>
          <h2 className="font-display text-2xl font-black text-white">
            Editor Completo do Site
          </h2>
          <p className="text-neutral-400 text-xs sm:text-sm mt-0.5">
            Altere fotos de membros da equipe, títulos, textos, links e contatos. Todas as mudanças refletem imediatamente no site público.
          </p>
        </div>

        {feedback && (
          <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 px-4 py-2.5 text-xs font-bold text-emerald-400 animate-pulse">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{feedback}</span>
          </div>
        )}
      </div>

      {/* Sub-Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-neutral-800/80 pb-3">
        <button
          onClick={() => setSubTab('team')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            subTab === 'team'
              ? 'bg-[#a3e635] text-black shadow-[0_0_12px_rgba(163,230,53,0.3)]'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-900/60'
          }`}
        >
          <Users className="h-4 w-4" />
          <span>Equipe & Sócios ({teamMembers.length})</span>
        </button>

        <button
          onClick={() => setSubTab('hero')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            subTab === 'hero'
              ? 'bg-[#a3e635] text-black shadow-[0_0_12px_rgba(163,230,53,0.3)]'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-900/60'
          }`}
        >
          <Globe className="h-4 w-4" />
          <span>Hero & Cabeçalho</span>
        </button>

        <button
          onClick={() => setSubTab('about')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            subTab === 'about'
              ? 'bg-[#a3e635] text-black shadow-[0_0_12px_rgba(163,230,53,0.3)]'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-900/60'
          }`}
        >
          <Info className="h-4 w-4" />
          <span>Sobre Nós & Manifesto</span>
        </button>

        <button
          onClick={() => setSubTab('contact')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            subTab === 'contact'
              ? 'bg-[#a3e635] text-black shadow-[0_0_12px_rgba(163,230,53,0.3)]'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-900/60'
          }`}
        >
          <Phone className="h-4 w-4" />
          <span>Contatos & Redes Sociais</span>
        </button>
      </div>

      {/* 1. TEAM TAB */}
      {subTab === 'team' && (
        <div className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-display text-lg font-bold text-white flex items-center gap-2">
                <Users className="h-5 w-5 text-[#a3e635]" />
                Membros da Equipe & Liderança
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                Clique em <b>"Trocar Foto"</b> em qualquer card para subir a foto direto do seu dispositivo, ou clique em <b>"Editar"</b> para mudar nome, cargo e bio.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={handleRestoreDefaultTeam}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-neutral-800 hover:border-neutral-700 bg-neutral-900/80 text-neutral-400 hover:text-white text-xs font-bold transition-all cursor-pointer"
                title="Restaurar padrão"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Restaurar Padrão</span>
              </button>

              <button
                onClick={() => handleOpenMemberModal()}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#a3e635] hover:bg-[#84cc16] text-black font-extrabold text-xs transition-all shadow-[0_0_12px_rgba(163,230,53,0.3)] cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Adicionar Membro</span>
              </button>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {teamMembers.map((member, index) => (
              <div 
                key={member.id || index}
                className="group relative rounded-2xl border border-neutral-800 bg-[#0d0f0d] p-5 flex flex-col justify-between hover:border-[#a3e635]/50 transition-all shadow-lg"
              >
                <div>
                  {/* Avatar + Quick Actions */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="relative h-16 w-16 rounded-2xl bg-neutral-900 border border-neutral-700 overflow-hidden shadow-md shrink-0">
                      <img 
                        src={member.avatar} 
                        alt={member.name}
                        className="h-full w-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <button
                        onClick={() => {
                          setQuickTargetMemberId(member.id);
                          quickFileInputRef.current?.click();
                        }}
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[10px] font-bold transition-opacity cursor-pointer flex-col gap-0.5 backdrop-blur-[2px]"
                        title="Trocar Foto"
                      >
                        <Camera className="h-4 w-4 text-[#a3e635]" />
                        <span>Mudar</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenMemberModal(member)}
                        className="h-8 w-8 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                        title="Editar Dados"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </button>

                      <button
                        onClick={() => handleDeleteMember(member.id, member.name)}
                        className="h-8 w-8 rounded-xl bg-neutral-900 hover:bg-red-500/20 border border-neutral-800 hover:border-red-500/30 text-neutral-400 hover:text-red-400 flex items-center justify-center transition-colors cursor-pointer"
                        title="Excluir"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setQuickTargetMemberId(member.id);
                      quickFileInputRef.current?.click();
                    }}
                    className="w-full mb-3 py-1.5 rounded-lg bg-neutral-900/90 hover:bg-[#a3e635]/10 border border-neutral-800 hover:border-[#a3e635]/30 text-[#a3e635] text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Upload className="h-3 w-3" />
                    <span>Upload de Foto Manual</span>
                  </button>

                  <h4 className="font-display text-base font-bold text-white">
                    {member.name}
                  </h4>
                  <p className="text-xs font-semibold text-[#a3e635] mt-0.5">
                    {member.role}
                  </p>

                  <p className="text-xs text-neutral-400 mt-2.5 leading-relaxed line-clamp-3">
                    {member.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-neutral-900 flex items-center justify-between text-[10px] text-neutral-500">
                  <span>Posição #{index + 1}</span>
                  {member.linkedin && (
                    <span className="text-neutral-400 hover:text-white flex items-center gap-1">
                      <Linkedin className="h-3 w-3" /> Conectado
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. HERO TAB */}
      {subTab === 'hero' && (
        <form onSubmit={handleSaveGeneralContent} className="rounded-2xl border border-neutral-800 bg-[#0d0f0d] p-6 shadow-xl flex flex-col gap-5">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
            <h3 className="font-display text-lg font-bold text-white flex items-center gap-2">
              <Globe className="h-5 w-5 text-[#a3e635]" /> Textos da Seção Hero (Página Inicial)
            </h3>
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#a3e635] hover:bg-[#84cc16] text-black font-extrabold text-xs transition-all shadow-[0_0_12px_rgba(163,230,53,0.3)] cursor-pointer disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              <span>{isSaving ? 'Salvando...' : 'Salvar Alterações'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-neutral-300 mb-1.5">Selo / Badge Superior</label>
              <input
                type="text"
                value={generalContent.heroBadge}
                onChange={(e) => setGeneralContent(prev => ({ ...prev, heroBadge: e.target.value }))}
                className="w-full rounded-xl bg-neutral-900 border border-neutral-800 px-4 py-2.5 text-xs text-white focus:border-[#a3e635] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-300 mb-1.5">Título Linha 1</label>
              <input
                type="text"
                value={generalContent.heroHeadline1}
                onChange={(e) => setGeneralContent(prev => ({ ...prev, heroHeadline1: e.target.value }))}
                className="w-full rounded-xl bg-neutral-900 border border-neutral-800 px-4 py-2.5 text-xs text-white focus:border-[#a3e635] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-300 mb-1.5">Título Linha 2 (Destaque)</label>
              <input
                type="text"
                value={generalContent.heroHeadline2}
                onChange={(e) => setGeneralContent(prev => ({ ...prev, heroHeadline2: e.target.value }))}
                className="w-full rounded-xl bg-neutral-900 border border-neutral-800 px-4 py-2.5 text-xs text-white focus:border-[#a3e635] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-300 mb-1.5">Botão Principal (CTA)</label>
              <input
                type="text"
                value={generalContent.heroCtaPrimary}
                onChange={(e) => setGeneralContent(prev => ({ ...prev, heroCtaPrimary: e.target.value }))}
                className="w-full rounded-xl bg-neutral-900 border border-neutral-800 px-4 py-2.5 text-xs text-white focus:border-[#a3e635] focus:outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-neutral-300 mb-1.5">Descrição Principal</label>
              <textarea
                rows={3}
                value={generalContent.heroDescription}
                onChange={(e) => setGeneralContent(prev => ({ ...prev, heroDescription: e.target.value }))}
                className="w-full rounded-xl bg-neutral-900 border border-neutral-800 px-4 py-2.5 text-xs text-white focus:border-[#a3e635] focus:outline-none"
              />
            </div>
          </div>
        </form>
      )}

      {/* 3. ABOUT TAB */}
      {subTab === 'about' && (
        <form onSubmit={handleSaveGeneralContent} className="rounded-2xl border border-neutral-800 bg-[#0d0f0d] p-6 shadow-xl flex flex-col gap-5">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
            <h3 className="font-display text-lg font-bold text-white flex items-center gap-2">
              <Info className="h-5 w-5 text-[#a3e635]" /> Textos da Seção Sobre Nós & Manifesto
            </h3>
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#a3e635] hover:bg-[#84cc16] text-black font-extrabold text-xs transition-all shadow-[0_0_12px_rgba(163,230,53,0.3)] cursor-pointer disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              <span>{isSaving ? 'Salvando...' : 'Salvar Alterações'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-neutral-300 mb-1.5">Selo / Badge</label>
              <input
                type="text"
                value={generalContent.aboutBadge}
                onChange={(e) => setGeneralContent(prev => ({ ...prev, aboutBadge: e.target.value }))}
                className="w-full rounded-xl bg-neutral-900 border border-neutral-800 px-4 py-2.5 text-xs text-white focus:border-[#a3e635] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-300 mb-1.5">Título do Manifesto</label>
              <input
                type="text"
                value={generalContent.aboutTitle}
                onChange={(e) => setGeneralContent(prev => ({ ...prev, aboutTitle: e.target.value }))}
                className="w-full rounded-xl bg-neutral-900 border border-neutral-800 px-4 py-2.5 text-xs text-white focus:border-[#a3e635] focus:outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-neutral-300 mb-1.5">Descrição do Manifesto</label>
              <textarea
                rows={3}
                value={generalContent.aboutDescription}
                onChange={(e) => setGeneralContent(prev => ({ ...prev, aboutDescription: e.target.value }))}
                className="w-full rounded-xl bg-neutral-900 border border-neutral-800 px-4 py-2.5 text-xs text-white focus:border-[#a3e635] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-300 mb-1.5">Banner Final - Título</label>
              <input
                type="text"
                value={generalContent.aboutBannerTitle}
                onChange={(e) => setGeneralContent(prev => ({ ...prev, aboutBannerTitle: e.target.value }))}
                className="w-full rounded-xl bg-neutral-900 border border-neutral-800 px-4 py-2.5 text-xs text-white focus:border-[#a3e635] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-300 mb-1.5">Banner Final - Subtítulo</label>
              <input
                type="text"
                value={generalContent.aboutBannerSubtitle}
                onChange={(e) => setGeneralContent(prev => ({ ...prev, aboutBannerSubtitle: e.target.value }))}
                className="w-full rounded-xl bg-neutral-900 border border-neutral-800 px-4 py-2.5 text-xs text-white focus:border-[#a3e635] focus:outline-none"
              />
            </div>
          </div>
        </form>
      )}

      {/* 4. CONTACT TAB */}
      {subTab === 'contact' && (
        <form onSubmit={handleSaveGeneralContent} className="rounded-2xl border border-neutral-800 bg-[#0d0f0d] p-6 shadow-xl flex flex-col gap-5">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
            <h3 className="font-display text-lg font-bold text-white flex items-center gap-2">
              <Phone className="h-5 w-5 text-[#a3e635]" /> Contatos Oficiais & Rodapé
            </h3>
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#a3e635] hover:bg-[#84cc16] text-black font-extrabold text-xs transition-all shadow-[0_0_12px_rgba(163,230,53,0.3)] cursor-pointer disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              <span>{isSaving ? 'Salvando...' : 'Salvar Alterações'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-neutral-300 mb-1.5">E-mail Oficial</label>
              <input
                type="email"
                value={generalContent.email}
                onChange={(e) => setGeneralContent(prev => ({ ...prev, email: e.target.value }))}
                className="w-full rounded-xl bg-neutral-900 border border-neutral-800 px-4 py-2.5 text-xs text-white focus:border-[#a3e635] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-300 mb-1.5">WhatsApp Oficial</label>
              <input
                type="text"
                value={generalContent.whatsapp}
                onChange={(e) => setGeneralContent(prev => ({ ...prev, whatsapp: e.target.value }))}
                className="w-full rounded-xl bg-neutral-900 border border-neutral-800 px-4 py-2.5 text-xs text-white focus:border-[#a3e635] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-300 mb-1.5">Instagram Oficial</label>
              <input
                type="text"
                value={generalContent.instagram}
                onChange={(e) => setGeneralContent(prev => ({ ...prev, instagram: e.target.value }))}
                className="w-full rounded-xl bg-neutral-900 border border-neutral-800 px-4 py-2.5 text-xs text-white focus:border-[#a3e635] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-300 mb-1.5">LinkedIn Oficial</label>
              <input
                type="text"
                value={generalContent.linkedin}
                onChange={(e) => setGeneralContent(prev => ({ ...prev, linkedin: e.target.value }))}
                className="w-full rounded-xl bg-neutral-900 border border-neutral-800 px-4 py-2.5 text-xs text-white focus:border-[#a3e635] focus:outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-neutral-300 mb-1.5">Texto de Copyright / Rodapé</label>
              <input
                type="text"
                value={generalContent.copyright}
                onChange={(e) => setGeneralContent(prev => ({ ...prev, copyright: e.target.value }))}
                className="w-full rounded-xl bg-neutral-900 border border-neutral-800 px-4 py-2.5 text-xs text-white focus:border-[#a3e635] focus:outline-none"
              />
            </div>
          </div>
        </form>
      )}

      {/* MEMBER EDIT / CREATE MODAL */}
      {isMemberModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-2xl border border-neutral-800 bg-[#121412] p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
              <h3 className="font-display text-lg font-bold text-white">
                {editingMemberId ? 'Editar Membro da Equipe' : 'Adicionar Novo Membro'}
              </h3>
              <button
                onClick={() => setIsMemberModalOpen(false)}
                className="rounded-lg p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMember} className="mt-4 flex flex-col gap-4">
              {/* Photo Upload & Preview */}
              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-2">Foto do Membro</label>
                <div className="flex items-center gap-4">
                  <div className="relative h-20 w-20 rounded-2xl bg-neutral-900 border-2 border-[#a3e635]/40 overflow-hidden shadow-md shrink-0">
                    <img 
                      src={memberAvatar || PRESET_AVATARS[0]} 
                      alt="Avatar" 
                      className="h-full w-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <div className="flex-1 flex flex-col gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploadingPhoto}
                      className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-[#a3e635] hover:bg-[#84cc16] text-black font-extrabold text-xs transition-all cursor-pointer"
                    >
                      <Upload className="h-3.5 w-3.5" />
                      <span>{isUploadingPhoto ? 'Compactando...' : 'Selecionar do Computador'}</span>
                    </button>

                    <input
                      type="url"
                      placeholder="Ou cole a URL da imagem..."
                      value={memberAvatar}
                      onChange={(e) => setMemberAvatar(e.target.value)}
                      className="w-full rounded-xl bg-neutral-900 border border-neutral-800 px-3 py-1.5 text-xs text-white focus:border-[#a3e635] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Preset Avatars quick select */}
                <div className="mt-2.5 flex items-center gap-2 overflow-x-auto pb-1">
                  <span className="text-[10px] text-neutral-500 font-semibold whitespace-nowrap">Sugestões:</span>
                  {PRESET_AVATARS.map((url, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setMemberAvatar(url)}
                      className={`h-7 w-7 rounded-full overflow-hidden border transition-transform shrink-0 ${
                        memberAvatar === url ? 'border-[#a3e635] scale-110' : 'border-neutral-700 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={url} alt="Preset" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1">Nome Completo *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Marcos Henrique"
                  value={memberName}
                  onChange={(e) => setMemberName(e.target.value)}
                  className="w-full rounded-xl bg-neutral-900 border border-neutral-800 px-4 py-2.5 text-xs text-white focus:border-[#a3e635] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1">Cargo / Especialidade *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: CEO (Diretor Executivo)"
                  value={memberRole}
                  onChange={(e) => setMemberRole(e.target.value)}
                  className="w-full rounded-xl bg-neutral-900 border border-neutral-800 px-4 py-2.5 text-xs text-white focus:border-[#a3e635] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1">Biografia Resumida</label>
                <textarea
                  rows={2}
                  placeholder="Ex: Liderança executiva, visão estratégica e expansão de produtos digitais de alto impacto."
                  value={memberDescription}
                  onChange={(e) => setMemberDescription(e.target.value)}
                  className="w-full rounded-xl bg-neutral-900 border border-neutral-800 px-4 py-2 text-xs text-white focus:border-[#a3e635] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1">LinkedIn (URL)</label>
                  <input
                    type="text"
                    placeholder="https://linkedin.com/in/..."
                    value={memberLinkedin}
                    onChange={(e) => setMemberLinkedin(e.target.value)}
                    className="w-full rounded-xl bg-neutral-900 border border-neutral-800 px-3 py-2 text-xs text-white focus:border-[#a3e635] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1">Instagram (@)</label>
                  <input
                    type="text"
                    placeholder="@usuario"
                    value={memberInstagram}
                    onChange={(e) => setMemberInstagram(e.target.value)}
                    className="w-full rounded-xl bg-neutral-900 border border-neutral-800 px-3 py-2 text-xs text-white focus:border-[#a3e635] focus:outline-none"
                  />
                </div>
              </div>

              <div className="mt-3 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsMemberModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-neutral-800 hover:bg-neutral-800 text-xs font-bold text-neutral-300 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl bg-[#a3e635] hover:bg-[#84cc16] text-black font-extrabold text-xs transition-all shadow-[0_0_12px_rgba(163,230,53,0.3)] cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? 'Salvando...' : 'Salvar Membro'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
