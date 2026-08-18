import { collection, doc, onSnapshot, setDoc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  description: string;
  avatar: string;
  linkedin?: string;
  instagram?: string;
}

export interface SiteGeneralContent {
  // Hero
  heroBadge: string;
  heroHeadline1: string;
  heroHeadline2: string;
  heroDescription: string;
  heroCtaPrimary: string;
  heroCtaSecondary: string;
  
  // Sobre Nós
  aboutBadge: string;
  aboutTitle: string;
  aboutDescription: string;
  aboutBannerTitle: string;
  aboutBannerSubtitle: string;
  aboutBannerCta: string;
  
  // Contato / Redes
  whatsapp: string;
  email: string;
  phone: string;
  instagram: string;
  linkedin: string;
  address: string;
  copyright: string;
}

export const DEFAULT_TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'marcos-henrique',
    name: "MARCOS HENRIQUE",
    role: "CEO (Diretor Executivo)",
    description: "Liderança executiva, visão estratégica e expansão de produtos digitais de alto impacto.",
    linkedin: "https://linkedin.com",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 'vitoria-ellen',
    name: "Vitória Ellen",
    role: "Designer (Head de UI/UX & Brand)",
    description: "Design de interfaces de alta conversão, identidade visual marcante e experiência fluida.",
    linkedin: "https://linkedin.com",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 'gabriel-rocha',
    name: "Gabriel Rocha",
    role: "CTO (Diretor de Tecnologia)",
    description: "Arquitetura de sistemas em nuvem, engenharia de software e inteligência computacional.",
    linkedin: "https://linkedin.com",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 'lucas-ferreira',
    name: "Lucas Ferreira",
    role: "COO (Diretor de Operações)",
    description: "Gestão operacional de processos, qualidade de entrega e sincronização ágil de times.",
    linkedin: "https://linkedin.com",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80"
  }
];

export const DEFAULT_SITE_CONTENT: SiteGeneralContent = {
  heroBadge: "Tecnologia & Performance sob Medida",
  heroHeadline1: "Você não precisa entender de tecnologia.",
  heroHeadline2: "Precisa de resultado.",
  heroDescription: "Desenvolvemos sites ultrarrápidos, plataformas exclusivas e estratégias de alta conversão para empresas que querem liderar o mercado.",
  heroCtaPrimary: "QUERO MEU PROJETO",
  heroCtaSecondary: "VER NOSSOS TRABALHOS",
  aboutBadge: "Sobre nós",
  aboutTitle: "A empresa digital dedicada a criar sistemas, sites e marketing sob medida",
  aboutDescription: "A Techify nasceu para simplificar a engenharia digital. Entregamos soluções de alto impacto com prazo garantido e excelência técnica.",
  aboutBannerTitle: "Enquanto você decide,",
  aboutBannerSubtitle: "o cliente compra do concorrente",
  aboutBannerCta: "QUERO APARECER PRIMEIRO",
  whatsapp: "(11) 99999-9999",
  email: "oficialtechify@gmail.com",
  phone: "(11) 99999-9999",
  instagram: "@oficialtechify",
  linkedin: "techify-oficial",
  address: "São Paulo - SP, Brasil",
  copyright: "© 2026 Techify. Todos os direitos reservados."
};

const TEAM_CACHE_KEY = 'techify_cached_team_members';
const CONTENT_CACHE_KEY = 'techify_cached_general_content';

export function getCachedTeamMembers(): TeamMember[] {
  try {
    const raw = localStorage.getItem(TEAM_CACHE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (err) {
    console.warn(err);
  }
  return DEFAULT_TEAM_MEMBERS;
}

export function getCachedGeneralContent(): SiteGeneralContent {
  try {
    const raw = localStorage.getItem(CONTENT_CACHE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_SITE_CONTENT, ...parsed };
    }
  } catch (err) {
    console.warn(err);
  }
  return DEFAULT_SITE_CONTENT;
}

export async function saveTeamMembersToFirestore(members: TeamMember[]): Promise<void> {
  localStorage.setItem(TEAM_CACHE_KEY, JSON.stringify(members));
  window.dispatchEvent(new CustomEvent('techify-team-updated', { detail: members }));
  
  await setDoc(doc(db, "site_content", "team"), {
    members,
    updatedAt: new Date().toISOString()
  }, { merge: true });
}

export async function saveGeneralContentToFirestore(content: Partial<SiteGeneralContent>): Promise<void> {
  const current = getCachedGeneralContent();
  const updated = { ...current, ...content };
  localStorage.setItem(CONTENT_CACHE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent('techify-content-updated', { detail: updated }));

  await setDoc(doc(db, "site_content", "general"), {
    ...updated,
    updatedAt: new Date().toISOString()
  }, { merge: true });
}
