import { db, isFirebaseConfigured } from './config';
import { 
  collection, addDoc, updateDoc, deleteDoc, 
  doc, getDocs, query, orderBy, where 
} from 'firebase/firestore';

const COLLECTION = 'projects';

// Seed all 19 GitHub projects with beautiful professional descriptions, tech stacks, and live links
export const initialProjectsSeed = [
  {
    id: "seed-1",
    title: "Ruiz Diamonds",
    description: "Sophisticated e-commerce diamond platform with interactive cart systems, high-fidelity image carousels, and a smooth checkout pipeline.",
    tech: ["React", "Tailwind CSS", "Vite", "Firebase"],
    githubUrl: "https://github.com/princegajera1/ruiz_diamonds",
    liveUrl: "https://ruiz-diamonds.vercel.app/",
    category: "frontend",
    featured: true,
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
    createdAt: "2026-05-15T00:00:00Z"
  },
  {
    id: "seed-2",
    title: "Chandrakant Traders",
    description: "Advanced invoice billing and inventory ledger management panel designed for commercial tyre distribution houses, powered by high-speed search and real-time state synchronization.",
    tech: ["React", "Tailwind CSS", "Firebase", "Firestore"],
    githubUrl: "https://github.com/princegajera1/-CHANDRAKANT-TRADERS",
    liveUrl: "https://chandrakant-traders.vercel.app/",
    category: "fullstack",
    featured: true,
    image: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=800&q=80",
    createdAt: "2026-05-10T00:00:00Z"
  },
  {
    id: "seed-3",
    title: "Daily Bite",
    description: "A complete food delivery web application built with React, featuring state management, dynamic ordering flows, and real-time order status tracking.",
    tech: ["React", "Node.js", "Firebase", "Tailwind CSS"],
    githubUrl: "https://github.com/princegajera1/dailybite",
    liveUrl: "https://dailybite-delta.vercel.app/",
    category: "fullstack",
    featured: true,
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
    createdAt: "2026-05-01T00:00:00Z"
  },
  {
    id: "seed-4",
    title: "Quiz Application",
    description: "Interactive, fast-paced trivia challenge application showcasing active question timers, progressive score updates, and sleek feedback dashboard graphs.",
    tech: ["React", "Firebase", "Tailwind CSS"],
    githubUrl: "https://github.com/princegajera1/quiz_app",
    liveUrl: "https://quiz-app.vercel.app/",
    category: "frontend",
    featured: true,
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80",
    createdAt: "2026-04-20T00:00:00Z"
  },
  {
    id: "seed-5",
    title: "Dev Orbit",
    description: "A social community portal for developers. Share open-source projects, discover peer codebases, and collaborate in real-time with responsive UI panels.",
    tech: ["React", "Firebase", "GSAP", "Tailwind CSS"],
    githubUrl: "https://github.com/princegajera1/dev-orbit",
    liveUrl: "",
    category: "fullstack",
    featured: true,
    image: "https://images.unsplash.com/photo-1618477388954-7852f32655ec?auto=format&fit=crop&w=800&q=80",
    createdAt: "2026-04-15T00:00:00Z"
  },
  {
    id: "seed-6",
    title: "Conversational AI Chatbot",
    description: "Intelligent chatbot executing natural language processing and custom contextual flows to resolve queries and automate customer support tasks.",
    tech: ["Python", "React", "OpenAI API", "Tailwind CSS"],
    githubUrl: "https://github.com/princegajera1/chatbot",
    liveUrl: "",
    category: "ai",
    featured: true,
    image: "https://images.unsplash.com/photo-1531747118685-ca8fa6e08806?auto=format&fit=crop&w=800&q=80",
    createdAt: "2026-04-05T00:00:00Z"
  },
  {
    id: "seed-7",
    title: "Gurukul online Learning",
    description: "Comprehensive online course portal tracking student registrations, interactive video lectures, and quiz assessment pipelines.",
    tech: ["React", "Node.js", "Express", "MongoDB"],
    githubUrl: "https://github.com/princegajera1/gurukul1",
    liveUrl: "",
    category: "fullstack",
    featured: false,
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80",
    createdAt: "2026-03-25T00:00:00Z"
  },
  {
    id: "seed-8",
    title: "Theme Nest",
    description: "Stylish component library and landing templates featuring customizable color systems, reusable layout grids, and interactive CSS utility grids.",
    tech: ["React", "Tailwind CSS", "Framer Motion"],
    githubUrl: "https://github.com/princegajera1/theme-nest",
    liveUrl: "",
    category: "frontend",
    featured: false,
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
    createdAt: "2026-03-10T00:00:00Z"
  },
  {
    id: "seed-9",
    title: "Nike Landing Page",
    description: "High-fidelity athletic product showcase with advanced mouse hover scale responses, smooth parallax panels, and custom product configuration views.",
    tech: ["React", "GSAP", "Tailwind CSS"],
    githubUrl: "https://github.com/princegajera1/nike-landing-page",
    liveUrl: "",
    category: "frontend",
    featured: false,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
    createdAt: "2026-02-28T00:00:00Z"
  },
  {
    id: "seed-10",
    title: "Bean Street Coffee",
    description: "A highly aesthetic, cozy shop website boasting smooth scrolling sections, clean product displays, and responsive booking forms.",
    tech: ["React", "GSAP", "Tailwind CSS"],
    githubUrl: "https://github.com/princegajera1/coffee-website",
    liveUrl: "",
    category: "frontend",
    featured: false,
    image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80",
    createdAt: "2026-02-15T00:00:00Z"
  },
  {
    id: "seed-11",
    title: "Secure Password Manager",
    description: "Robust local credential storage manager equipped with high-entropy random password generation, clipboard copy shortcuts, and responsive dark panels.",
    tech: ["React", "Tailwind CSS", "Web Crypto API"],
    githubUrl: "https://github.com/princegajera1/Password",
    liveUrl: "",
    category: "frontend",
    featured: false,
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80",
    createdAt: "2026-01-30T00:00:00Z"
  },
  {
    id: "seed-12",
    title: "Prince Gajera's Profile",
    description: "Developer profile repository hosting open-source portfolios, customized configuration matrices, and clean modular utilities.",
    tech: ["Markdown", "Git", "GitHub"],
    githubUrl: "https://github.com/princegajera1/princegajera1",
    liveUrl: "",
    category: "tools",
    featured: false,
    image: "https://images.unsplash.com/photo-1618401471353-b98aedd07871?auto=format&fit=crop&w=800&q=80",
    createdAt: "2026-01-15T00:00:00Z"
  },
  {
    id: "seed-13",
    title: "Prodigy Task 05",
    description: "A dynamic weather forecast dashboard querying geolocation APIs to render 5-day forecasts, atmospheric stats, and beautiful weather-based graphics.",
    tech: ["HTML5", "CSS3", "JavaScript", "Weather API"],
    githubUrl: "https://github.com/princegajera1/PRODIGY_GA_05",
    liveUrl: "",
    category: "frontend",
    featured: false,
    image: "https://images.unsplash.com/photo-1561484930-998b6a7b22e8?auto=format&fit=crop&w=800&q=80",
    createdAt: "2026-01-05T00:00:00Z"
  },
  {
    id: "seed-14",
    title: "Prodigy Task 04",
    description: "A premium personal developer portfolio website displaying high-end typography reveals and responsive fluid grid project collections.",
    tech: ["HTML5", "CSS3", "JavaScript", "GSAP"],
    githubUrl: "https://github.com/princegajera1/PRODIGY_GA_04",
    liveUrl: "",
    category: "frontend",
    featured: false,
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    createdAt: "2025-12-20T00:00:00Z"
  },
  {
    id: "seed-15",
    title: "Prodigy Task 03",
    description: "Responsive grid tic-tac-toe game incorporating automated game-state solvers, responsive player turn indicators, and glowing modal overlays.",
    tech: ["HTML5", "CSS3", "JavaScript"],
    githubUrl: "https://github.com/princegajera1/PRODIGY_GA_03",
    liveUrl: "",
    category: "frontend",
    featured: false,
    image: "https://images.unsplash.com/photo-1611195974226-a6a9be9dd763?auto=format&fit=crop&w=800&q=80",
    createdAt: "2025-12-10T00:00:00Z"
  },
  {
    id: "seed-16",
    title: "Prodigy Task 02",
    description: "Interactive stop-watch and timer application equipped with lap-recording, milliseconds accuracy, and glowing glassmorphic panels.",
    tech: ["HTML5", "CSS3", "JavaScript", "GSAP"],
    githubUrl: "https://github.com/princegajera1/PRODIGY_GA_02",
    liveUrl: "",
    category: "frontend",
    featured: false,
    image: "https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&w=800&q=80",
    createdAt: "2025-11-25T00:00:00Z"
  },
  {
    id: "seed-17",
    title: "Prodigy Task 01",
    description: "Clean, modern responsive UI landing page built for high-fidelity sports apparel showcases with custom micro-animations on interaction triggers.",
    tech: ["HTML5", "CSS3", "JavaScript"],
    githubUrl: "https://github.com/princegajera1/PRODIGY_GA_01",
    liveUrl: "",
    category: "frontend",
    featured: false,
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=800&q=80",
    createdAt: "2025-11-10T00:00:00Z"
  },
  {
    id: "seed-18",
    title: "GP Core Utilities",
    description: "Lightweight modular Java helper utility library executing automated workspace setups, file parsing pipelines, and local database scripts.",
    tech: ["Java", "OOP", "Maven"],
    githubUrl: "https://github.com/princegajera1/gp",
    liveUrl: "",
    category: "tools",
    featured: false,
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80",
    createdAt: "2025-10-25T00:00:00Z"
  },
  {
    id: "seed-19",
    title: "Interactive Neon Portfolio",
    description: "His personal flagship developer showcase. Rich dark-neon aesthetics, custom cursor tracking, dynamic 3D elements, and clean single-page scroll layout.",
    tech: ["React", "Vite", "GSAP 3", "Tailwind CSS", "Firebase"],
    githubUrl: "https://github.com/princegajera1/portfolio",
    liveUrl: "https://princegajera.web.app",
    category: "fullstack",
    featured: false,
    image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80",
    createdAt: "2025-10-10T00:00:00Z"
  }
];

// LocalStorage mock DB for persistent admin CRUD testing when Firebase config is missing
const LOCAL_STORAGE_KEY = 'prince_projects';

const cleanupExpiredProjects = (list) => {
  const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;
  const now = new Date();
  let changed = false;
  
  const cleaned = list.filter(p => {
    if (p.deleted && p.deletedAt) {
      const deletedTime = new Date(p.deletedAt);
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

const getLocalProjects = () => {
  const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      return cleanupExpiredProjects(parsed);
    } catch (e) {
      console.error("Error parsing local projects", e);
    }
  }
  // Initialize with seed and save to localStorage
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialProjectsSeed));
  return [...initialProjectsSeed];
};

export const getProjects = async (category = null, includeDeleted = false) => {
  if (!isFirebaseConfigured || !db) {
    let list = getLocalProjects();
    if (!includeDeleted) {
      list = list.filter(p => !p.deleted);
    }
    if (category && category !== 'all') {
      list = list.filter(p => p.category === category);
    }
    // Sort desc by date
    return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  try {
    const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    let projectsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // In-memory filtering to bypass composite index requirement
    if (!includeDeleted) {
      projectsList = projectsList.filter(p => !p.deleted);
    }
    if (category && category !== 'all') {
      projectsList = projectsList.filter(p => p.category === category);
    }

    // If database is empty, fall back to seeds
    if (projectsList.length === 0) {
      return initialProjectsSeed;
    }
    return projectsList;
  } catch (error) {
    console.error('Error fetching projects from Firestore:', error);
    return initialProjectsSeed;
  }
};

export const addProject = async (projectData) => {
  const newProj = {
    ...projectData,
    createdAt: new Date().toISOString(),
    featured: projectData.featured || false,
    deleted: false,
    deletedAt: null
  };

  if (!isFirebaseConfigured || !db) {
    const local = getLocalProjects();
    const mockProj = { id: `mock-${Date.now()}`, ...newProj };
    local.unshift(mockProj);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(local));
    window.dispatchEvent(new CustomEvent('projectsUpdated'));
    return mockProj;
  }

  const docRef = await addDoc(collection(db, COLLECTION), newProj);
  window.dispatchEvent(new CustomEvent('projectsUpdated'));
  return { id: docRef.id, ...newProj };
};

export const updateProject = async (id, updates) => {
  if (!isFirebaseConfigured || !db) {
    let local = getLocalProjects();
    local = local.map(p => p.id === id ? { ...p, ...updates } : p);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(local));
    window.dispatchEvent(new CustomEvent('projectsUpdated'));
    return true;
  }

  const docRef = doc(db, COLLECTION, id);
  await updateDoc(docRef, updates);
  window.dispatchEvent(new CustomEvent('projectsUpdated'));
  return true;
};

// Send project to Recycle Bin (Trash System)
export const deleteProject = async (id) => {
  if (!isFirebaseConfigured || !db) {
    let local = getLocalProjects();
    local = local.map(p => p.id === id ? { ...p, deleted: true, deletedAt: new Date().toISOString() } : p);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(local));
    window.dispatchEvent(new CustomEvent('projectsUpdated'));
    return true;
  }

  const docRef = doc(db, COLLECTION, id);
  await updateDoc(docRef, { deleted: true, deletedAt: new Date().toISOString() });
  window.dispatchEvent(new CustomEvent('projectsUpdated'));
  return true;
};

// Restore project from Recycle Bin
export const restoreProject = async (id) => {
  if (!isFirebaseConfigured || !db) {
    let local = getLocalProjects();
    local = local.map(p => p.id === id ? { ...p, deleted: false, deletedAt: null } : p);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(local));
    window.dispatchEvent(new CustomEvent('projectsUpdated'));
    return true;
  }

  const docRef = doc(db, COLLECTION, id);
  await updateDoc(docRef, { deleted: false, deletedAt: null });
  window.dispatchEvent(new CustomEvent('projectsUpdated'));
  return true;
};

// Permanent physical deletion
export const permanentlyDeleteProject = async (id) => {
  if (!isFirebaseConfigured || !db) {
    let local = getLocalProjects();
    local = local.filter(p => p.id !== id);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(local));
    window.dispatchEvent(new CustomEvent('projectsUpdated'));
    return true;
  }

  const docRef = doc(db, COLLECTION, id);
  await deleteDoc(docRef);
  window.dispatchEvent(new CustomEvent('projectsUpdated'));
  return true;
};
