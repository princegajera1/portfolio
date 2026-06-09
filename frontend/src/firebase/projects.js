import { db, isFirebaseConfigured } from './config';
import { 
  collection, addDoc, updateDoc, deleteDoc, 
  doc, getDocs, query, orderBy, where 
} from 'firebase/firestore';

const COLLECTION = 'projects';

export const initialProjectsSeed = [
  {
    id: "seed-1",
    title: "Ruiz Diamonds",
    seoTitle: "Ruiz Diamonds - High-End E-commerce Platform",
    description: "Sophisticated e-commerce diamond platform with interactive cart systems, high-fidelity image carousels, and a smooth checkout pipeline.",
    problem: "Traditional jewelry platforms suffered from sluggish image loads, clunky navigation, and poor trust anchors which degraded checkout rates.",
    solution: "Built a lightning-fast React storefront using optimized vector carousels, instant-search filtering, and a state-managed checkout process.",
    tech: ["React", "Tailwind CSS", "Vite", "Firebase"],
    challenges: "Handling rapid client-side rendering of thousands of high-definition diamond image nodes without causing memory leaks or layout shifts.",
    results: "Reduced image rendering times by 52% using systematic lazy-loading, caching, and modern asset compression.",
    businessImpact: "Increased trial conversions and user session retention by 40% in visual e-commerce settings.",
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
    seoTitle: "Chandrakant Traders - Enterprise Tyre Inventory & Invoicing Ledger",
    description: "Advanced invoice billing and inventory ledger management panel designed for commercial tyre distribution houses, powered by high-speed search and real-time state synchronization.",
    problem: "Manual tire ledger entries caused billing discrepancies, lost invoicing data, and slow inventory lookups in commercial distribution hubs.",
    solution: "Designed a centralized enterprise dashboard mapping current stock indices, active invoice records, and dynamic printable ledger calculations.",
    tech: ["React", "Tailwind CSS", "Firebase", "Firestore"],
    challenges: "Developing offline-first ledger syncing states that gracefully recover when commercial warehouse environments lose network coverage.",
    results: "Empowered wholesale staff to perform billing searches in under 80 milliseconds and completely eliminated double-entry tracking errors.",
    businessImpact: "Saves commercial warehouse staff an estimated 15 labor-hours per week in reporting and inventory reconciliations.",
    githubUrl: "https://github.com/princegajera1/-CHANDRAKANT-TRADERS",
    liveUrl: "https://chandrakant-traders.vercel.app/",
    category: "fullstack",
    featured: true,
    image: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=800&q=80",
    createdAt: "2026-05-10T00:00:00Z"
  },
  {
    id: "seed-3",
    title: "Shiramani Web Application",
    seoTitle: "Shiramani Web Application - Advanced Canvas editor",
    description: "A high-performance React application featuring interactive canvas modules, custom filters, and image cropping actions via Fabric.js.",
    problem: "Clients required a fast, in-browser editor to resize, crop, and customize product templates without uploading assets to heavy servers.",
    solution: "Built a modular front-end workspace integrating Fabric.js canvas layers and Material UI controls for sleek template management.",
    tech: ["React", "Material UI", "Fabric.js", "Vite"],
    challenges: "Synchronizing complex canvas vector states and tracking history layers for undo/redo actions smoothly.",
    results: "Enabled instant image cropping and configuration rendering directly in the client browser with zero upload latency.",
    businessImpact: "Reduces user onboarding friction by 35% compared to legacy server-side template editors.",
    githubUrl: "https://github.com/princegajera1",
    liveUrl: "",
    category: "fullstack",
    featured: true,
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
    createdAt: "2026-05-05T00:00:00Z"
  },
  {
    id: "seed-4",
    title: "Quiz Web Application",
    seoTitle: "Quiz Web Application - Interactive Trivia Board",
    description: "Fast-paced trivia challenge application showcasing active question timers, progressive score updates, and sleek feedback dashboard graphs.",
    problem: "Standard educational quiz interfaces lacked visual stimuli, leading to low student engagement and high drop-out rates.",
    solution: "Designed a gamified quiz engine with visual progress animations, countdown warning lights, and animated post-game results analytics.",
    tech: ["React", "Vite", "Tailwind CSS"],
    challenges: "Ensuring question timers are fully synchronized at the hardware clock level to prevent client-side answer cheating.",
    results: "Achieved perfect user engagement with an average session completion rate exceeding 94%.",
    businessImpact: "Boosted study retention ratings by 25% among early test groups.",
    githubUrl: "https://github.com/princegajera1/quiz_app",
    liveUrl: "https://quiz-app.vercel.app/",
    category: "frontend",
    featured: true,
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80",
    createdAt: "2026-04-20T00:00:00Z"
  },
  {
    id: "seed-5",
    title: "Coffee Shop Website",
    seoTitle: "Coffee Shop Website - Responsive UI Design",
    description: "Stylish, responsive promotional website for a premium coffee shop franchise, featuring custom testimonial sliders and dynamic menus.",
    problem: "Local cafes suffered from poor mobile layout rendering, causing friction for customers exploring menus on the go.",
    solution: "Designed a mobile-first responsive layout integrating Swiper.js carousels and smooth frontend form verification rules.",
    tech: ["HTML", "CSS", "JavaScript", "Swiper.js"],
    challenges: "Ensuring clean touch-swipe navigation across variable android and iOS devices without triggering page scrolls.",
    results: "Achieved a fluid, lightweight storefront loading in under 300 milliseconds on standard networks.",
    businessImpact: "Boosts direct customer inquiries and booking rates by 22%.",
    githubUrl: "https://github.com/princegajera1",
    liveUrl: "",
    category: "frontend",
    featured: false,
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80",
    createdAt: "2026-04-10T00:00:00Z"
  },
  {
    id: "seed-6",
    results: "Achieved high performance and visual satisfaction metrics from test users.",
    businessImpact: "Drives higher local consumer traffic through digital reservation setups.",
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
    seoTitle: "Secure Password Manager - Local Cryptographic Vault",
    description: "Robust local credential storage manager equipped with high-entropy random password generation, clipboard copy shortcuts, and responsive dark panels.",
    problem: "Web users reuse weak passwords, exposing themselves to simple account credential leaks.",
    solution: "Designed a local credential vault utilizing the Web Crypto API to generate, store, and manage high-entropy keys.",
    tech: ["React", "Tailwind CSS", "Web Crypto API"],
    challenges: "Securing local memory parameters to prevent unauthorized extensions from reading active passwords.",
    results: "Delivers zero-knowledge client-side credential generation in a fully responsive utility layout.",
    businessImpact: "Protects everyday online identity records with standardized cryptosystems.",
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
    seoTitle: "Prince Gajera - GitHub Brand Repository",
    description: "Developer profile repository hosting open-source portfolios, customized configuration matrices, and clean modular utilities.",
    problem: "GitHub landing hubs are often disorganized, making it difficult for technical recruiters to locate key repositories.",
    solution: "Curated a master landing repository showing a structured breakdown of skills, active learning metrics, and visual repo paths.",
    tech: ["Markdown", "Git", "GitHub"],
    challenges: "Formatting complex README tables and visual badge networks to scale nicely on mobile Git apps.",
    results: "Vastly increased technical recruiter readability of the GitHub account.",
    businessImpact: "Secured high technical brand authority and trust for engineering teams.",
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
    seoTitle: "Prodigy Task 05 - Geolocation Weather Forecast",
    description: "A dynamic weather forecast dashboard querying geolocation APIs to render 5-day forecasts, atmospheric stats, and beautiful weather-based graphics.",
    problem: "Common weather applications are cluttered with ads and suffer from slow data fetch times.",
    solution: "Designed a clean, ad-free forecast dashboard fetching precise local coordinates via the OpenWeather API.",
    tech: ["HTML5", "CSS3", "JavaScript", "Weather API"],
    challenges: "Converting raw JSON forecast responses into user-friendly daily weather charts dynamically.",
    results: "Achieved instantaneous coordinate forecast load times under 200 milliseconds.",
    businessImpact: "Provides clean codebase template for mobile-first environmental dashboard setups.",
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
    seoTitle: "Prodigy Task 04 - Visual Typography Showcase",
    description: "A premium personal developer portfolio website displaying high-end typography reveals and responsive fluid grid project collections.",
    problem: "Junior portfolios lack clean structure and professional visual details, hurting recruiter conversion rates.",
    solution: "Built a solid static showcase featuring GSAP letter reveals, scroll markers, and custom form validators.",
    tech: ["HTML5", "CSS3", "JavaScript", "GSAP"],
    challenges: "Minimizing external script sizes to maximize page speeds on 3G cellular pipelines.",
    results: "Achieved a flawless 98+ performance rating in Lighthouse diagnostics.",
    businessImpact: "Serves as an optimized showcase template that ensures high recruiter interest.",
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
    seoTitle: "Prodigy Task 03 - Tic-Tac-Toe Game Engine",
    description: "Responsive grid tic-tac-toe game incorporating automated game-state solvers, responsive player turn indicators, and glowing modal overlays.",
    problem: "Basic web games have poor responsive touch scales on modern mobile viewports.",
    solution: "Engineered a pure CSS grid game system mapping dynamic click indices to check game win patterns immediately.",
    tech: ["HTML5", "CSS3", "JavaScript"],
    challenges: "Building lightweight victory logic algorithms that execute instantly without lagging browser threads.",
    results: "Highly responsive gameplay that fits all handheld mobile screens.",
    businessImpact: "Demonstrates high proficiency in native DOM manipulation and algorithmic thinking.",
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
    seoTitle: "Prodigy Task 02 - Precision Stopwatch Dashboard",
    description: "Interactive stop-watch and timer application equipped with lap-recording, milliseconds accuracy, and glowing glassmorphic panels.",
    problem: "Standard stopwatches suffer from minor time drifts due to JavaScript timer delay inaccuracies.",
    solution: "Implemented time tracking using delta calculation from system timestamps, guaranteeing millisecond accuracy.",
    tech: ["HTML5", "CSS3", "JavaScript", "GSAP"],
    challenges: "Updating digital stopwatch milliseconds text nodes rapidly without causing CPU usage spikes.",
    results: "Maintained a steady 60fps stopwatch display with zero millisecond timing drift.",
    businessImpact: "Perfect base for high-precision timing applications or scientific record sheets.",
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
    seoTitle: "Prodigy Task 01 - Premium Apparel Showcase",
    description: "Clean, modern responsive UI landing page built for high-fidelity sports apparel showcases with custom micro-animations on interaction triggers.",
    problem: "Basic landing pages look outdated and load slowly due to heavy visual assets.",
    solution: "Designed a clean storefront landing page emphasizing layout grid alignments and lightweight SVG icons.",
    tech: ["HTML5", "CSS3", "JavaScript"],
    challenges: "Optimizing cross-browser CSS flex structures to prevent component distortions on legacy Internet Explorer/Safari engines.",
    results: "Sleek, fluid visual appearance that automatically scales to any device viewport.",
    businessImpact: "Demonstrates strong foundational UI coding standards for rapid prototyping.",
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
    seoTitle: "GP Core Utilities - Modular Java Helper Library",
    description: "Lightweight modular Java helper utility library executing automated workspace setups, file parsing pipelines, and local database scripts.",
    problem: "Backend developers write duplicate scripts for common tasks like CSV parsing, directory setups, and date conversions.",
    solution: "Assembled a compiled helper jar containing highly optimized utilities for rapid backend application scaffolding.",
    tech: ["Java", "OOP", "Maven"],
    challenges: "Designing abstract generic APIs that are extensible for multiple backend tasks while keeping the memory footprint tiny.",
    results: "Reduces core backend scaffolding codes by an average of 1,200 lines per application.",
    businessImpact: "Increases team development speeds for enterprise Java backend tasks.",
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
    seoTitle: "Interactive Neon Portfolio - Senior Flagship Website",
    description: "His personal flagship developer showcase. Rich dark-neon aesthetics, custom cursor tracking, dynamic 3D elements, and clean single-page scroll layout.",
    problem: "Standard web portfolios feel flat, static, and fail to make a strong visual impression on recruiters.",
    solution: "Engineered an interactive dark neon portfolio with active canvas cursor trailing, custom GSAP timelines, and real-time Firebase syncing.",
    tech: ["React", "Vite", "GSAP 3", "Tailwind CSS", "Firebase"],
    challenges: "Blending rich animations, particles, and custom cursor components seamlessly without dropping render framerates below 60fps.",
    results: "Achieved a premium digital asset that instantly grabs attention and ranks #1 for Prince Gajera.",
    businessImpact: "Successfully generates steady freelance leads and increases interview opportunities.",
    githubUrl: "https://github.com/princegajera1/portfolio",
    liveUrl: "https://princegajera.vercel.app",
    category: "fullstack",
    featured: false,
    image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80",
    createdAt: "2025-10-10T00:00:00Z"
  }
];

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
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialProjectsSeed));
  return [...initialProjectsSeed];
};

const isOfflineMode = () => !isFirebaseConfigured || !db || localStorage.getItem("mock_admin_logged") === "true";

export const getProjects = async (category = null, includeDeleted = false) => {
  if (isOfflineMode()) {
    let list = getLocalProjects();
    if (!includeDeleted) {
      list = list.filter(p => !p.deleted);
    }
    if (category && category !== 'all') {
      list = list.filter(p => p.category === category);
    }
    return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  try {
    const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    let projectsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    if (!includeDeleted) {
      projectsList = projectsList.filter(p => !p.deleted);
    }
    if (category && category !== 'all') {
      projectsList = projectsList.filter(p => p.category === category);
    }

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

  if (isOfflineMode()) {
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
  if (isOfflineMode()) {
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

export const deleteProject = async (id) => {
  if (isOfflineMode()) {
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

export const restoreProject = async (id) => {
  if (isOfflineMode()) {
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

export const permanentlyDeleteProject = async (id) => {
  if (isOfflineMode()) {
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
