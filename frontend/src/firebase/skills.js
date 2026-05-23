import { db, isFirebaseConfigured } from './config';
import { 
  collection, addDoc, updateDoc, deleteDoc, 
  doc, getDocs, query, orderBy 
} from 'firebase/firestore';

const COLLECTION = 'skills';

export const initialSkillsSeed = [
  // Frontend
  { id: "s-1", name: "React", level: 88, category: "frontend", icon: "react", order: 1 },
  { id: "s-2", name: "GSAP", level: 82, category: "frontend", icon: "animation", order: 2 },
  { id: "s-3", name: "Tailwind CSS", level: 90, category: "frontend", icon: "tailwind", order: 3 },
  { id: "s-4", name: "JavaScript", level: 85, category: "frontend", icon: "javascript", order: 4 },
  { id: "s-5", name: "HTML5", level: 92, category: "frontend", icon: "html", order: 5 },
  { id: "s-6", name: "Material UI", level: 78, category: "frontend", icon: "mui", order: 6 },
  
  // Backend
  { id: "s-7", name: "Firebase", level: 85, category: "backend", icon: "firebase", order: 7 },
  { id: "s-8", name: "Node.js", level: 72, category: "backend", icon: "nodejs", order: 8 },
  { id: "s-9", name: "MongoDB", level: 68, category: "backend", icon: "mongodb", order: 9 },
  { id: "s-10", name: "Python", level: 70, category: "backend", icon: "python", order: 10 },
  { id: "s-11", name: "REST APIs", level: 75, category: "backend", icon: "api", order: 11 },
  { id: "s-12", name: "SQL", level: 60, category: "backend", icon: "sql", order: 12 },

  // Tools & Others
  { id: "s-13", name: "Git", level: 88, category: "tools", icon: "git", order: 13 },
  { id: "s-14", name: "VS Code", level: 92, category: "tools", icon: "vscode", order: 14 },
  { id: "s-15", name: "Figma", level: 72, category: "tools", icon: "design", order: 15 },
  { id: "s-16", name: "Generative AI", level: 78, category: "tools", icon: "ai", order: 16 },
  { id: "s-17", name: "Docker", level: 50, category: "tools", icon: "docker", order: 17 },
  { id: "s-18", name: "Web Crypto API", level: 65, category: "tools", icon: "crypto", order: 18 }
];

const LOCAL_STORAGE_KEY = 'prince_skills';

const cleanupExpiredSkills = (list) => {
  const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;
  const now = new Date();
  let changed = false;
  
  const cleaned = list.filter(s => {
    if (s.deleted && s.deletedAt) {
      const deletedTime = new Date(s.deletedAt);
      if (now - deletedTime > thirtyDaysMs) {
        changed = true;
        return false;
      }
    }
    return true;
  });
  
  if (changed) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cleaned));
  }
  return cleaned;
};

const getLocalSkills = () => {
  const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      return cleanupExpiredSkills(parsed);
    } catch (e) {
      console.error("Error parsing local skills", e);
    }
  }
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialSkillsSeed));
  return [...initialSkillsSeed];
};

export const getSkills = async (includeDeleted = false) => {
  if (!isFirebaseConfigured || !db) {
    let list = getLocalSkills();
    if (!includeDeleted) {
      list = list.filter(s => !s.deleted);
    }
    return list.sort((a, b) => a.order - b.order);
  }

  try {
    let q = query(collection(db, COLLECTION), orderBy('order', 'asc'));
    const snapshot = await getDocs(q);
    let skillsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    if (!includeDeleted) {
      skillsList = skillsList.filter(s => !s.deleted);
    }

    if (skillsList.length === 0) {
      return initialSkillsSeed;
    }
    return skillsList;
  } catch (error) {
    console.error('Error fetching skills from Firestore:', error);
    return initialSkillsSeed;
  }
};

export const addSkill = async (skillData) => {
  const newSkillData = {
    ...skillData,
    deleted: false,
    deletedAt: null
  };

  if (!isFirebaseConfigured || !db) {
    const local = getLocalSkills();
    const newSkill = { id: `mock-skill-${Date.now()}`, ...newSkillData };
    local.push(newSkill);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(local));
    window.dispatchEvent(new CustomEvent('skillsUpdated'));
    return newSkill;
  }

  const docRef = await addDoc(collection(db, COLLECTION), newSkillData);
  window.dispatchEvent(new CustomEvent('skillsUpdated'));
  return { id: docRef.id, ...newSkillData };
};

export const updateSkill = async (id, updates) => {
  if (!isFirebaseConfigured || !db) {
    let local = getLocalSkills();
    local = local.map(s => s.id === id ? { ...s, ...updates } : s);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(local));
    window.dispatchEvent(new CustomEvent('skillsUpdated'));
    return true;
  }

  const docRef = doc(db, COLLECTION, id);
  await updateDoc(docRef, updates);
  window.dispatchEvent(new CustomEvent('skillsUpdated'));
  return true;
};

// Send skill to Recycle Bin (Trash System)
export const deleteSkill = async (id) => {
  if (!isFirebaseConfigured || !db) {
    let local = getLocalSkills();
    local = local.map(s => s.id === id ? { ...s, deleted: true, deletedAt: new Date().toISOString() } : s);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(local));
    window.dispatchEvent(new CustomEvent('skillsUpdated'));
    return true;
  }

  const docRef = doc(db, COLLECTION, id);
  await updateDoc(docRef, { deleted: true, deletedAt: new Date().toISOString() });
  window.dispatchEvent(new CustomEvent('skillsUpdated'));
  return true;
};

// Restore skill from Recycle Bin
export const restoreSkill = async (id) => {
  if (!isFirebaseConfigured || !db) {
    let local = getLocalSkills();
    local = local.map(s => s.id === id ? { ...s, deleted: false, deletedAt: null } : s);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(local));
    window.dispatchEvent(new CustomEvent('skillsUpdated'));
    return true;
  }

  const docRef = doc(db, COLLECTION, id);
  await updateDoc(docRef, { deleted: false, deletedAt: null });
  window.dispatchEvent(new CustomEvent('skillsUpdated'));
  return true;
};

// Permanent physical deletion
export const permanentlyDeleteSkill = async (id) => {
  if (!isFirebaseConfigured || !db) {
    let local = getLocalSkills();
    local = local.filter(s => s.id !== id);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(local));
    window.dispatchEvent(new CustomEvent('skillsUpdated'));
    return true;
  }

  const docRef = doc(db, COLLECTION, id);
  await deleteDoc(docRef);
  window.dispatchEvent(new CustomEvent('skillsUpdated'));
  return true;
};
