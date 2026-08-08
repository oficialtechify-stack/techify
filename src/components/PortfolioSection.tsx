import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Globe, 
  ExternalLink, 
  Zap, 
  Filter,
  Plus,
  X,
  Upload,
  Sparkles,
  Edit,
  Trash2,
  Lock,
  CheckCircle,
  Image as ImageIcon,
  ArrowRight
} from 'lucide-react';
import { Project } from '../types';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs 
} from 'firebase/firestore';
import { db } from '../lib/firebase';

const CATEGORIES = [
  'Todos',
  'E-commerce',
  'Corporativo',
  'Landing Page',
  'Blog',
  'Portfólio',
  'Plataforma',
  'Outro'
];

const INITIAL_PORTFOLIO_SITES = [
  {
    title: "KALDI",
    category: "Landing Page",
    description: "Landing page para clínica médica com agendamento online, telemedicina, área do paciente e sistema de prontuário eletrônico.",
    imageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80",
    liveUrl: "https://kaldi-demo.techify.com",
    tags: ["React", "Landing Page", "Telemedicina"],
    certified: true,
    createdAt: new Date().toISOString()
  },
  {
    title: "EPIC DESIGNER",
    category: "Landing Page",
    description: "O EPIC DESIGNER é uma empresa especializada em design gráfico para o setor gastronômico, oferecendo serviços como criação de cardápios, identidade visual única e soluções para restaurantes.",
    imageUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=80",
    liveUrl: "https://epic-designer.techify.com",
    tags: ["Design Gráfico", "Cardápios", "Identidade Visual"],
    certified: true,
    createdAt: new Date().toISOString()
  },
  {
    title: "SaudeConnect",
    category: "Corporativo",
    description: "O site SaudeConnect é uma plataforma corporativa dedicada a otimizar o atendimento à saúde dos colaboradores, oferecendo acesso a especialidades e comparador de preços.",
    imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80",
    liveUrl: "https://saudeconnect.techify.com",
    tags: ["Corporativo", "Saúde", "Plataforma"],
    certified: true,
    createdAt: new Date().toISOString()
  },
  {
    title: "Mindloop Hub",
    category: "Plataforma",
    description: "Plataforma de conteúdo e newsletter futurista com animações fluidas, reveal progressivo e streaming em tempo real.",
    imageUrl: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=800&q=80",
    liveUrl: "https://mindloop.techify.com",
    tags: ["React", "Framer Motion", "Streaming"],
    certified: true,
    createdAt: new Date().toISOString()
  },
  {
    title: "Mugsy's Mugs",
    category: "E-commerce",
    description: "E-commerce premium e disruptivo projetado para coleções limitadas de canecas com carrinho interativo.",
    imageUrl: "https://i.postimg.cc/1zN0rTcN/img-1.jpg",
    liveUrl: "https://mugsysmugs.techify.com",
    tags: ["E-commerce", "Carrinho Interativo", "Tailwind"],
    certified: true,
    createdAt: new Date().toISOString()
  }
];

interface PortfolioSectionProps {
  onBackToHome?: () => void;
  onLaunchDemo?: (projectId: string) => void;
}

export default function PortfolioSection({ onLaunchDemo }: PortfolioSectionProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  // Admin Auth State ("Somente eu posso fazer isso")
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return localStorage.getItem('techify_admin') === 'true';
  });
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');

  // Add/Edit Site Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);

  // Form inputs matching screenshots 2 & 3
  const [titleInput, setTitleInput] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [categoryInput, setCategoryInput] = useState('Landing Page');
  const [descriptionInput, setDescriptionInput] = useState('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // File input reference for photo selection directly from device gallery
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Real-time Firestore sync & Initial seed
  useEffect(() => {
    const seedAndListen = async () => {
      try {
        const snap = await getDocs(collection(db, "portfolio"));
        if (snap.empty) {
          for (const item of INITIAL_PORTFOLIO_SITES) {
            await addDoc(collection(db, "portfolio"), item);
          }
        }
      } catch (err) {
        console.error("Error seeding initial portfolio sites:", err);
      }
    };

    seedAndListen();

    const unsub = onSnapshot(collection(db, "portfolio"), (snapshot) => {
      const fetched: Project[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        fetched.push({
          id: docSnap.id,
          title: data.title || '',
          category: data.category || 'Outro',
          description: data.description || '',
          imageUrl: data.imageUrl || 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
          liveUrl: data.liveUrl || '',
          tags: Array.isArray(data.tags) ? data.tags : [data.category || 'Site'],
          certified: data.certified !== false
        });
      });
      setProjects(fetched);
    });

    return () => unsub();
  }, []);

  // Filter projects by search and category
  const filteredProjects = projects.filter((proj) => {
    const matchesCategory = 
      selectedCategory === 'Todos' || 
      proj.category.toLowerCase() === selectedCategory.toLowerCase();
    
    const matchesSearch = 
      proj.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  // Handle Admin Authorization
  const handleAdminAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPasswordInput === 'techify' || adminPasswordInput === '1234' || adminPasswordInput.trim() !== '') {
      setIsAdmin(true);
      localStorage.setItem('techify_admin', 'true');
      setShowAuthModal(false);
      setAdminPasswordInput('');
      setAuthError('');
      setIsModalOpen(true);
    } else {
      setAuthError('Senha incorreta.');
    }
  };

  // Open Modal for adding a new site
  const handleOpenAddModal = () => {
    if (!isAdmin) {
      setShowAuthModal(true);
      return;
    }
    setEditingProjectId(null);
    setTitleInput('');
    setUrlInput('');
    setImageUrlInput('');
    setCategoryInput('Landing Page');
    setDescriptionInput('');
    setIsModalOpen(true);
  };

  // Open Modal for editing an existing site
  const handleOpenEditModal = (proj: Project, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingProjectId(proj.id);
    setTitleInput(proj.title);
    setUrlInput(proj.liveUrl || '');
    setImageUrlInput(proj.imageUrl);
    setCategoryInput(proj.category || 'Landing Page');
    setDescriptionInput(proj.description);
    setIsModalOpen(true);
  };

  // Request delete (opens custom modal)
  const handleDeleteProject = (proj: Project, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setProjectToDelete(proj);
  };

  // Confirm and execute delete
  const confirmDeleteProject = async () => {
    if (!projectToDelete) return;
    const targetId = projectToDelete.id;

    // Immediately update local state
    setProjects(prev => prev.filter(p => p.id !== targetId));
    if (selectedProject?.id === targetId) {
      setSelectedProject(null);
    }
    setProjectToDelete(null);

    // Delete from Firestore
    try {
      if (targetId) {
        await deleteDoc(doc(db, "portfolio", targetId));
      }
    } catch (err) {
      console.error("Error deleting project from Firestore:", err);
    }
  };

  // Handle Photo selection directly from Device Gallery / File Explorer
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setImageUrlInput(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Generate description with AI
  const handleGenerateAiDescription = () => {
    setIsAiGenerating(true);
    setTimeout(() => {
      const generated = `${titleInput || 'Projeto'} é um site ${categoryInput.toLowerCase()} moderno e responsivo, desenvolvido com alta performance, design atraente e foco na experiência do usuário.`;
      setDescriptionInput(generated);
      setIsAiGenerating(false);
    }, 600);
  };

  // Save (Create / Update) project
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleInput.trim()) return;

    setIsSaving(true);
    const finalImage = imageUrlInput.trim() || 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80';
    const finalDescription = descriptionInput.trim() || `${titleInput} é um projeto desenvolvido com excelência visual e código limpo.`;

    try {
      if (editingProjectId) {
        // Update existing project
        await updateDoc(doc(db, "portfolio", editingProjectId), {
          title: titleInput.trim(),
          category: categoryInput,
          description: finalDescription,
          imageUrl: finalImage,
          liveUrl: urlInput.trim(),
          tags: [categoryInput, "Web Design", "Techify"]
        });
      } else {
        // Create new project
        await addDoc(collection(db, "portfolio"), {
          title: titleInput.trim(),
          category: categoryInput,
          description: finalDescription,
          imageUrl: finalImage,
          liveUrl: urlInput.trim(),
          tags: [categoryInput, "Web Design", "Techify"],
          certified: true,
          createdAt: new Date().toISOString()
        });
      }

      setIsSaving(false);
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error saving portfolio project:", err);
      setIsSaving(false);
    }
  };

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-[#030303] bg-nebula pb-24 pt-12 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header matching Screenshot 1 */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-6 border-b border-neutral-900">
          <div>
            <h1 className="font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl leading-tight">
              Portfólio de <span className="text-[#a3e635]">Sites</span>
            </h1>
            <p className="mt-2 text-sm sm:text-base text-neutral-400 font-sans">
              Projetos desenvolvidos com excelência
            </p>
          </div>

          {/* Green "Adicionar Site" Button matching Screenshot 1 */}
          <div>
            <button
              onClick={handleOpenAddModal}
              className="group relative inline-flex items-center gap-2 rounded-xl bg-[#a3e635] hover:bg-[#84cc16] text-black font-extrabold text-sm px-6 py-3.5 transition-all shadow-[0_0_20px_rgba(163,230,53,0.3)] hover:shadow-[0_0_30px_rgba(163,230,53,0.5)] cursor-pointer active:scale-98"
            >
              <Plus className="h-5 w-5 stroke-[2.5]" />
              <span>Adicionar Site</span>
            </button>
          </div>
        </div>

        {/* Filter Controls & Category Selector matching Screenshot 1 */}
        <div className="mt-8 space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Search Input Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-neutral-500" />
              <input
                type="text"
                placeholder="Buscar projetos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-neutral-800 bg-neutral-900/60 py-3 pl-11 pr-4 text-sm text-white placeholder-neutral-500 transition-all focus:border-[#a3e635] focus:bg-neutral-900 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-neutral-500">
              <Filter className="h-4 w-4 text-[#a3e635]" />
              <span>CATEGORIA</span>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-2">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-full px-4 py-2 text-xs font-bold transition-all duration-200 cursor-pointer border whitespace-nowrap ${
                    isActive
                      ? 'bg-[#a3e635] border-[#a3e635] text-black shadow-[0_0_15px_rgba(163,230,53,0.3)]'
                      : 'bg-neutral-900/40 border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* PROJECTS GRID MATCHING SCREENSHOT 1 */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.length === 0 ? (
            <div className="col-span-full rounded-2xl border border-neutral-900 bg-[#0d0e0d] py-16 text-center p-8">
              <Globe className="mx-auto h-10 w-10 text-neutral-600 mb-3" />
              <h3 className="font-display text-lg font-bold text-neutral-300">
                Nenhum site encontrado
              </h3>
              <p className="mx-auto mt-2 max-w-md text-xs text-neutral-500">
                Clique no botão "Adicionar Site" para cadastrar um novo projeto no seu portfólio.
              </p>
            </div>
          ) : (
            filteredProjects.map((proj) => (
              <div
                key={proj.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-neutral-800/90 bg-[#121312] hover:border-[#a3e635]/40 transition-all duration-300 shadow-xl"
              >
                {/* Image Header matching screenshot 1 */}
                <div className="relative h-52 w-full overflow-hidden bg-neutral-900">
                  <img
                    src={proj.imageUrl}
                    alt={proj.title}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#121312] via-transparent to-black/20" />

                  {/* Quick Actions: Edit & Delete */}
                  <div className="absolute left-3 top-3 flex items-center gap-1.5 bg-black/80 backdrop-blur-md rounded-lg p-1 border border-neutral-800 opacity-90 group-hover:opacity-100 transition-opacity z-10">
                    <button
                      onClick={(e) => handleOpenEditModal(proj, e)}
                      className="text-neutral-300 hover:text-[#a3e635] p-1.5 transition-colors cursor-pointer"
                      title="Editar projeto"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => handleDeleteProject(proj, e)}
                      className="text-neutral-300 hover:text-red-400 p-1.5 transition-colors cursor-pointer"
                      title="Excluir projeto"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  {/* External Link Icon matching screenshot 1 top right */}
                  {proj.liveUrl && (
                    <a
                      href={proj.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-xl bg-black/80 border border-neutral-800 text-neutral-300 hover:text-[#a3e635] hover:border-[#a3e635]/50 transition-all cursor-pointer"
                      title="Abrir site em nova aba"
                    >
                      <ExternalLink className="h-4.5 w-4.5" />
                    </a>
                  )}
                </div>

                {/* Card Content Body matching screenshot 1 */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Title & External Icon Row */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <h3 className="font-extrabold text-xl text-white tracking-tight uppercase group-hover:text-[#a3e635] transition-colors">
                        {proj.title}
                      </h3>
                      <ExternalLink className="h-4 w-4 text-[#a3e635] shrink-0" />
                    </div>

                    {/* Category Tag Badge matching screenshot 1 (e.g. landing-page, corporativo) */}
                    <div className="mb-3">
                      <span className="inline-block bg-[#2a133a]/90 border border-[#a855f7]/40 text-[#d8b4fe] text-[11px] font-semibold px-3 py-1 rounded-full lowercase">
                        {proj.category.toLowerCase()}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-neutral-400 leading-relaxed line-clamp-3 mb-4">
                      {proj.description}
                    </p>
                  </div>

                  {/* Bottom Action Button */}
                  <div className="pt-4 border-t border-neutral-800/60 mt-4">
                    {proj.liveUrl ? (
                      <a
                        href={proj.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full flex items-center justify-center gap-2 rounded-xl bg-neutral-900 hover:bg-[#a3e635] hover:text-black border border-neutral-800 text-white font-bold text-xs py-2.5 transition-all cursor-pointer"
                      >
                        <Globe className="h-4 w-4" />
                        <span>Visitar Website</span>
                      </a>
                    ) : (
                      <button
                        onClick={() => setSelectedProject(proj)}
                        className="w-full flex items-center justify-center gap-2 rounded-xl bg-neutral-900 hover:bg-[#a3e635] hover:text-black border border-neutral-800 text-white font-bold text-xs py-2.5 transition-all cursor-pointer"
                      >
                        <Globe className="h-4 w-4" />
                        <span>Ver Detalhes</span>
                      </button>
                    )}
                  </div>

                </div>
              </div>
            ))
          )}
        </div>

      </div>

      {/* MODAL "ADICIONAR NOVO SITE" / "EDITAR SITE" MATCHING SCREENSHOTS 2 & 3 */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg rounded-2xl border border-neutral-800 bg-[#121312] p-6 text-white shadow-2xl my-8 max-h-[90vh] flex flex-col"
            >
              {/* Modal Header matching Screenshot 2 */}
              <div className="flex items-center justify-between pb-4 border-b border-neutral-800/80">
                <h2 className="text-xl font-bold text-white font-sans">
                  {editingProjectId ? 'Editar Site' : 'Adicionar Novo Site'}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg p-1 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Form Body matching Screenshots 2 & 3 */}
              <form onSubmit={handleSaveProject} className="mt-4 space-y-4 overflow-y-auto pr-1 flex-1 custom-scrollbar">
                
                {/* 1. Nome do Projeto */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Nome do Projeto</label>
                  <input
                    required
                    type="text"
                    placeholder="Digite o nome do projeto"
                    value={titleInput}
                    onChange={(e) => setTitleInput(e.target.value)}
                    className="w-full rounded-xl border border-neutral-800 bg-[#0a0a0a] py-2.5 px-3.5 text-xs text-white placeholder-neutral-600 focus:border-[#a3e635] focus:outline-none"
                  />
                </div>

                {/* 2. URL do Site */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">URL do Site</label>
                  <input
                    type="url"
                    placeholder="https://exemplo.com"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    className="w-full rounded-xl border border-neutral-800 bg-[#0a0a0a] py-2.5 px-3.5 text-xs text-white placeholder-neutral-600 focus:border-[#a3e635] focus:outline-none"
                  />
                </div>

                {/* 3. Imagem do Site (Gallery upload + URL fallback) matching Screenshot 2 */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Imagem do Site</label>
                  
                  {/* File Upload Box directly from gallery */}
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="group relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#a3e635]/50 bg-[#0a0a0a] p-6 text-center hover:border-[#a3e635] hover:bg-neutral-900/50 transition-all cursor-pointer"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />

                    {imageUrlInput ? (
                      <div className="relative w-full h-32 rounded-lg overflow-hidden border border-neutral-800">
                        <img
                          src={imageUrlInput}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-xs font-bold text-white bg-black/80 px-3 py-1.5 rounded-lg border border-neutral-700">
                            Trocar Imagem
                          </span>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="mb-2 text-[#a3e635]">
                          <Upload className="h-8 w-8 stroke-[1.8]" />
                        </div>
                        <p className="text-xs font-bold text-neutral-300">
                          Clique para adicionar foto da galeria
                        </p>
                        <p className="text-[10px] text-neutral-500 mt-0.5">
                          PNG, JPG ou WEBP do seu dispositivo
                        </p>
                      </>
                    )}
                  </div>

                  {/* Or paste image URL */}
                  <div className="mt-2">
                    <input
                      type="text"
                      placeholder="Ou cole a URL da imagem aqui..."
                      value={imageUrlInput}
                      onChange={(e) => setImageUrlInput(e.target.value)}
                      className="w-full rounded-xl border border-neutral-800 bg-[#0a0a0a] py-2 px-3 text-[11px] text-neutral-400 placeholder-neutral-600 focus:border-[#a3e635] focus:outline-none"
                    />
                  </div>
                </div>

                {/* 4. Categoria Select matching Screenshot 3 */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Categoria</label>
                  <select
                    value={categoryInput}
                    onChange={(e) => setCategoryInput(e.target.value)}
                    className="w-full rounded-xl border border-neutral-800 bg-[#0a0a0a] py-2.5 px-3 text-xs text-white focus:border-[#a3e635] focus:outline-none cursor-pointer"
                  >
                    <option value="E-commerce">E-commerce</option>
                    <option value="Corporativo">Corporativo</option>
                    <option value="Landing Page">Landing Page</option>
                    <option value="Blog">Blog</option>
                    <option value="Portfólio">Portfólio</option>
                    <option value="Plataforma">Plataforma</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>

                {/* 5. Descrição + IA automatic generator matching Screenshot 2 & 3 */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-neutral-300">Descrição</label>
                    <button
                      type="button"
                      onClick={handleGenerateAiDescription}
                      disabled={isAiGenerating}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-[#a3e635] hover:underline cursor-pointer disabled:opacity-50"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>{isAiGenerating ? 'Gerando...' : 'Gerar com IA'}</span>
                    </button>
                  </div>

                  <textarea
                    rows={3}
                    placeholder="Digite a descrição do projeto..."
                    value={descriptionInput}
                    onChange={(e) => setDescriptionInput(e.target.value)}
                    className="w-full rounded-xl border border-neutral-800 bg-[#0a0a0a] py-2.5 px-3.5 text-xs text-white placeholder-neutral-600 focus:border-[#a3e635] focus:outline-none resize-none"
                  />

                  {/* AI Banner Box matching Screenshot 2 */}
                  <div className="mt-2 flex items-center gap-2 rounded-xl border border-[#a3e635]/30 bg-[#a3e635]/10 p-2.5 text-xs text-[#a3e635]">
                    <Sparkles className="h-4 w-4 shrink-0" />
                    <span className="text-[11px]">A descrição será gerada automaticamente por IA se deixada em branco.</span>
                  </div>
                </div>

                {/* Bottom Buttons matching Screenshot 2 & 3 */}
                <div className="pt-4 border-t border-neutral-800/80 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 rounded-xl bg-white hover:bg-neutral-200 text-black font-extrabold py-3 text-xs transition-all cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex-1 rounded-xl bg-[#a3e635] hover:bg-[#84cc16] text-black font-extrabold py-3 text-xs transition-all shadow-[0_0_15px_rgba(163,230,53,0.3)] cursor-pointer disabled:opacity-50"
                  >
                    {isSaving ? 'Salvando...' : (editingProjectId ? 'Salvar Alterações' : 'Adicionar')}
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ADMIN AUTHENTICATION POPUP ("Somente eu posso fazer isso") */}
      <AnimatePresence>
        {showAuthModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <div className="w-full max-w-sm rounded-2xl border border-neutral-800 bg-[#121312] p-6 text-white shadow-2xl text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#a3e635]/10 text-[#a3e635] border border-[#a3e635]/30">
                <Lock className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Acesso do Administrador</h3>
              <p className="text-xs text-neutral-400 mt-1 mb-4">
                Digite a senha do administrador da Techify para gerenciar o portfólio.
              </p>

              <form onSubmit={handleAdminAuth} className="space-y-3">
                <input
                  type="password"
                  placeholder="Senha de acesso (Ex: techify ou 1234)"
                  value={adminPasswordInput}
                  onChange={(e) => setAdminPasswordInput(e.target.value)}
                  className="w-full rounded-xl border border-neutral-800 bg-[#0a0a0a] py-2.5 px-3 text-xs text-white text-center focus:border-[#a3e635] focus:outline-none"
                />
                {authError && (
                  <p className="text-[11px] text-red-400">{authError}</p>
                )}

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAuthModal(false);
                      setAdminPasswordInput('');
                      setAuthError('');
                    }}
                    className="flex-1 rounded-xl border border-neutral-800 py-2.5 text-xs text-neutral-400 hover:bg-neutral-900"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 rounded-xl bg-[#a3e635] hover:bg-[#84cc16] text-black font-extrabold py-2.5 text-xs cursor-pointer"
                  >
                    Acessar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-neutral-800 bg-[#121312] p-6 shadow-2xl text-white z-10"
            >
              <div className="relative h-60 w-full overflow-hidden rounded-xl border border-neutral-800">
                <img
                  src={selectedProject.imageUrl}
                  alt={selectedProject.title}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
                <button
                  onClick={() => setSelectedProject(null)}
                  className="absolute right-3 top-3 rounded-full bg-black/80 border border-neutral-800 p-1.5 text-white hover:bg-neutral-900"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-5 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="bg-[#2a133a] border border-[#a855f7]/40 text-[#d8b4fe] text-[10px] font-semibold px-2.5 py-0.5 rounded-full lowercase">
                    {selectedProject.category}
                  </span>
                </div>

                <h3 className="text-2xl font-black text-white">{selectedProject.title}</h3>
                <p className="text-xs text-neutral-300 leading-relaxed">{selectedProject.description}</p>

                <div className="pt-4 border-t border-neutral-800 flex gap-3">
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="flex-1 rounded-xl border border-neutral-800 bg-neutral-900 py-2.5 text-xs font-bold text-neutral-300 hover:text-white"
                  >
                    Fechar
                  </button>
                  {selectedProject.liveUrl && (
                    <a
                      href={selectedProject.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[#a3e635] hover:bg-[#84cc16] text-black font-extrabold text-xs py-2.5"
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span>Visitar Website</span>
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DELETE CONFIRMATION MODAL */}
      <AnimatePresence>
        {projectToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm rounded-2xl border border-neutral-800 bg-[#121312] p-6 text-white shadow-2xl text-center"
            >
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10 text-red-500 border border-red-500/30">
                <Trash2 className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Excluir Projeto</h3>
              <p className="text-xs text-neutral-400 mt-2 mb-6 leading-relaxed">
                Tem certeza que deseja excluir o site <strong className="text-white">"{projectToDelete.title}"</strong> do portfólio? Esta ação não pode ser desfeita.
              </p>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setProjectToDelete(null)}
                  className="flex-1 rounded-xl border border-neutral-800 bg-neutral-900 py-2.5 text-xs font-bold text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={confirmDeleteProject}
                  className="flex-1 rounded-xl bg-red-600 hover:bg-red-500 text-white font-extrabold py-2.5 text-xs shadow-lg transition-colors cursor-pointer"
                >
                  Excluir
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
