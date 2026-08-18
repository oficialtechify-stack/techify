import { doc, onSnapshot, setDoc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

export interface InlineOverrides {
  texts: Record<string, string>;
  numbers: Record<string, { value: number | string; prefix?: string; suffix?: string; label?: string }>;
  icons: Record<string, string>; // icon name, e.g. "Zap", "Rocket", "Shield"
  images: Record<string, string>; // base64 or URL
}

const INLINE_CACHE_KEY = 'techify_inline_overrides_cache';

export const DEFAULT_OVERRIDES: InlineOverrides = {
  texts: {},
  numbers: {},
  icons: {},
  images: {}
};

export function getCachedInlineOverrides(): InlineOverrides {
  try {
    const raw = localStorage.getItem(INLINE_CACHE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        texts: parsed.texts || {},
        numbers: parsed.numbers || {},
        icons: parsed.icons || {},
        images: parsed.images || {}
      };
    }
  } catch (err) {
    console.warn(err);
  }
  return DEFAULT_OVERRIDES;
}

let activeOverrides: InlineOverrides = getCachedInlineOverrides();

export function getInlineOverride(type: 'text' | 'icon' | 'image' | 'number', id: string, fallback: any) {
  if (type === 'text') return activeOverrides.texts?.[id] ?? fallback;
  if (type === 'icon') return activeOverrides.icons?.[id] ?? fallback;
  if (type === 'image') return activeOverrides.images?.[id] ?? fallback;
  if (type === 'number') return activeOverrides.numbers?.[id] ?? fallback;
  return fallback;
}

export async function saveInlineText(id: string, text: string): Promise<void> {
  activeOverrides.texts[id] = text;
  persistLocally();
  notifySubscribers();
  try {
    await setDoc(doc(db, "site_content", "inline_overrides"), {
      [`texts.${id}`]: text,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    console.warn('Error saving inline text to firestore:', err);
  }
}

export async function saveInlineNumber(id: string, data: { value: number | string; prefix?: string; suffix?: string; label?: string }): Promise<void> {
  activeOverrides.numbers[id] = data;
  persistLocally();
  notifySubscribers();
  try {
    await setDoc(doc(db, "site_content", "inline_overrides"), {
      [`numbers.${id}`]: data,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    console.warn('Error saving inline number to firestore:', err);
  }
}

export async function saveInlineIcon(id: string, iconName: string): Promise<void> {
  activeOverrides.icons[id] = iconName;
  persistLocally();
  notifySubscribers();
  try {
    await setDoc(doc(db, "site_content", "inline_overrides"), {
      [`icons.${id}`]: iconName,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    console.warn('Error saving inline icon to firestore:', err);
  }
}

export async function saveInlineImage(id: string, imageUrl: string): Promise<void> {
  activeOverrides.images[id] = imageUrl;
  persistLocally();
  notifySubscribers();
  try {
    await setDoc(doc(db, "site_content", "inline_overrides"), {
      [`images.${id}`]: imageUrl,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    console.warn('Error saving inline image to firestore:', err);
  }
}

function persistLocally() {
  try {
    localStorage.setItem(INLINE_CACHE_KEY, JSON.stringify(activeOverrides));
  } catch (err) {
    console.warn(err);
  }
}

function notifySubscribers() {
  window.dispatchEvent(new CustomEvent('techify-inline-updated', { detail: activeOverrides }));
}

// Global listener to sync Firestore in real-time
export function initInlineOverridesListener(callback: (overrides: InlineOverrides) => void) {
  const unsub = onSnapshot(doc(db, "site_content", "inline_overrides"), (snap) => {
    if (snap.exists()) {
      const data = snap.data();
      const texts = data.texts || {};
      const numbers = data.numbers || {};
      const icons = data.icons || {};
      const images = data.images || {};
      
      activeOverrides = {
        texts: { ...activeOverrides.texts, ...texts },
        numbers: { ...activeOverrides.numbers, ...numbers },
        icons: { ...activeOverrides.icons, ...icons },
        images: { ...activeOverrides.images, ...images }
      };
      persistLocally();
      callback(activeOverrides);
    }
  }, (err) => {
    console.warn('Inline overrides snapshot offline fallback:', err.message);
  });

  const handleCustomEvent = (e: Event) => {
    const customEvt = e as CustomEvent<InlineOverrides>;
    if (customEvt.detail) {
      activeOverrides = customEvt.detail;
      callback(activeOverrides);
    }
  };

  window.addEventListener('techify-inline-updated', handleCustomEvent);

  return () => {
    unsub();
    window.removeEventListener('techify-inline-updated', handleCustomEvent);
  };
}
