import { db, isFirebaseConfigured } from './config';
import { 
  collection, addDoc, updateDoc, deleteDoc, 
  doc, getDocs, query, orderBy 
} from 'firebase/firestore';

const COLLECTION = 'experience';

export const initialExperienceSeed = [
  {
    id: "exp-1",
    company: "Shreeji Software (Gota, Ahmedabad)",
    role: "Software Development Intern",
    duration: "April 15, 2026 – Present",
    description: "Developing robust, modern web architectures utilizing React 18, Tailwind CSS, and Firebase. Specializing in commercial tyre management ledgers (-CHANDRAKANT-TRADERS) and custom full-stack solutions, focusing on performance, state sync, and sub-second querying speeds.",
    technologies: ["React", "Firebase", "Tailwind CSS", "JavaScript", "REST APIs"],
    current: true,
    order: 1
  },
  {
    id: "exp-2",
    company: "Prodigy InfoTech",
    role: "Generative AI Intern",
    duration: "July 01, 2025 – July 31, 2025",
    description: "Built advanced generative AI prototypes, automated conversational chatbots, and exploratory data pipelines. Gained hands-on experience in machine learning APIs, local text generation engines, and structured full-stack Python helpers.",
    technologies: ["Python", "Generative AI", "APIs", "Data Science", "Machine Learning"],
    current: false,
    order: 2
  }
];

const LOCAL_STORAGE_KEY = 'prince_experience';

const getLocalExperience = () => {
  const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error("Error parsing local experience", e);
    }
  }
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialExperienceSeed));
  return [...initialExperienceSeed];
};

export const getExperience = async () => {
  if (!isFirebaseConfigured || !db) {
    return getLocalExperience().sort((a, b) => a.order - b.order);
  }

  try {
    const q = query(collection(db, COLLECTION), orderBy('order', 'asc'));
    const snapshot = await getDocs(q);
    const expList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    if (expList.length === 0) {
      return initialExperienceSeed;
    }
    return expList;
  } catch (error) {
    console.error('Error fetching experience from Firestore:', error);
    return initialExperienceSeed;
  }
};

export const addExperience = async (expData) => {
  if (!isFirebaseConfigured || !db) {
    const local = getLocalExperience();
    const newExp = { id: `mock-exp-${Date.now()}`, ...expData };
    local.push(newExp);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(local));
    return newExp;
  }

  const docRef = await addDoc(collection(db, COLLECTION), expData);
  return { id: docRef.id, ...expData };
};

export const updateExperience = async (id, updates) => {
  if (!isFirebaseConfigured || !db) {
    let local = getLocalExperience();
    local = local.map(e => e.id === id ? { ...e, ...updates } : e);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(local));
    return true;
  }

  const docRef = doc(db, COLLECTION, id);
  await updateDoc(docRef, updates);
  return true;
};

export const deleteExperience = async (id) => {
  if (!isFirebaseConfigured || !db) {
    let local = getLocalExperience();
    local = local.filter(e => e.id !== id);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(local));
    return true;
  }

  const docRef = doc(db, COLLECTION, id);
  await deleteDoc(docRef);
  return true;
};
