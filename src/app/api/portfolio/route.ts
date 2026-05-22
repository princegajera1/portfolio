import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const defaultPortfolioData = {
  hero: {
    name: "Gajera Prince",
    title: "Full Stack Developer",
    subtitleText: "React Developer, Node.js Expert, UI/UX Enthusiast",
    resumeUrl: "/resume.jpg",
  },
  about: {
    bio: "I am a passionate and dedicated Full Stack Developer with an eye for clean UI/UX and a strong foundation in modern web technologies. I specialize in building highly interactive, responsive, and robust web applications using React, Node.js, and Express, with a deep interest in Generative AI and LLM integrations.",
    avatarUrl: "/avatar.png",
    yearsExp: "2+",
    projectsDone: "15+",
    clients: "5+",
    techPills: [
      "React.js",
      "Node.js",
      "JavaScript",
      "TypeScript",
      "MongoDB",
      "Express",
      "TailwindCSS",
      "Git",
      "MySQL",
      "Generative AI",
      "Python",
      "C",
      "Java",
    ],
  },
  skills: [
    { id: "1", name: "React.js", level: 90, category: "frontend" },
    { id: "2", name: "JavaScript", level: 95, category: "frontend" },
    { id: "3", name: "TypeScript", level: 85, category: "frontend" },
    { id: "4", name: "Tailwind CSS", level: 90, category: "frontend" },
    { id: "5", name: "HTML5/CSS3", level: 95, category: "frontend" },
    { id: "6", name: "Material UI", level: 80, category: "frontend" },
    { id: "7", name: "React Router", level: 85, category: "frontend" },
    { id: "8", name: "Framer Motion", level: 80, category: "frontend" },
    { id: "9", name: "Node.js", level: 85, category: "backend" },
    { id: "10", name: "Express.js", level: 80, category: "backend" },
    { id: "11", name: "REST APIs", level: 88, category: "backend" },
    { id: "12", name: "MySQL", level: 80, category: "backend" },
    { id: "13", name: "MongoDB", level: 85, category: "backend" },
    { id: "14", name: "Firebase", level: 80, category: "backend" },
    { id: "15", name: "SQLite", level: 70, category: "backend" },
    { id: "16", name: "C Language", level: 75, category: "backend" },
    { id: "17", name: "Java", level: 80, category: "backend" },
    { id: "18", name: "Python", level: 85, category: "backend" },
    { id: "19", name: "Git & GitHub", level: 90, category: "tools" },
    { id: "20", name: "VS Code", level: 95, category: "tools" },
    { id: "21", name: "Vercel", level: 85, category: "tools" },
    { id: "22", name: "GitHub Pages", level: 80, category: "tools" },
    { id: "23", name: "Generative AI", level: 85, category: "tools" },
    { id: "24", name: "Prompt Engineering", level: 80, category: "tools" },
    { id: "25", name: "LLMs", level: 80, category: "tools" },
    { id: "26", name: "OpenAI API", level: 85, category: "tools" },
    { id: "27", name: "Vite", level: 85, category: "tools" },
  ],
  projects: [
    {
      id: "proj-1",
      title: "CHANDRAKANT TRADERS",
      description: "A comprehensive business management application with billing, inventory, and a secure admin panel.",
      tech: ["React", "Node.js", "MySQL", "TailwindCSS"],
      github: "https://github.com/princegajera1/-CHANDRAKANT-TRADERS",
      demo: "https://chandrakant-traders.vercel.app/",
      featured: true,
      image: "",
    },
    {
      id: "proj-2",
      title: "Ruiz Diamonds",
      description: "A premium e-commerce platform for diamonds featuring elegant UI and advanced product filtering.",
      tech: ["React", "TailwindCSS", "Framer Motion"],
      github: "https://github.com/princegajera1/ruiz_diamonds",
      demo: "https://ruiz-diamonds.vercel.app/",
      featured: true,
      image: "",
    },
    {
      id: "proj-3",
      title: "Dev Orbit",
      description: "A developer-focused platform for tracking daily coding progress and project management.",
      tech: ["React", "Firebase", "CSS"],
      github: "https://github.com/princegajera1/dev-orbit",
      demo: "",
      featured: true,
      image: "",
    },
    {
      id: "proj-4",
      title: "Portfolio Admin Panel",
      description: "A secure backend dashboard built to manage portfolio projects and view contact messages dynamically.",
      tech: ["React", "Node.js", "Express", "MongoDB"],
      github: "https://github.com/princegajera1/portfolio-admin",
      demo: "",
      featured: true,
      image: "",
    },
    {
      id: "proj-5",
      title: "GP Web Chat",
      description: "A production-grade, real-time chat application with WhatsApp-like features, presence, and multimedia.",
      tech: ["React", "Firebase", "WebRTC"],
      github: "https://github.com/princegajera1/gp",
      demo: "",
      featured: true,
      image: "",
    },
    {
      id: "proj-6",
      title: "Theme Nest",
      description: "A dynamic theme configuration tool allowing users to preview and export beautiful UI themes.",
      tech: ["React", "Context API", "TailwindCSS"],
      github: "https://github.com/princegajera1/theme-nest",
      demo: "",
      featured: true,
      image: "",
    },
    {
      id: "proj-7",
      title: "DailyBite",
      description: "A modern food delivery and recipe tracking application with a clean, appetizing interface.",
      tech: ["React", "Redux", "CSS"],
      github: "https://github.com/princegajera1/dailybite",
      demo: "https://dailybite-delta.vercel.app/",
      featured: false,
      image: "",
    },
    {
      id: "proj-8",
      title: "AI Chatbot Interface",
      description: "An intelligent conversational interface integrated with AI models for seamless user interaction.",
      tech: ["React", "OpenAI API", "TailwindCSS"],
      github: "https://github.com/princegajera1/chatbot",
      demo: "https://chatbot-one-rho-74.vercel.app/",
      featured: false,
      image: "",
    },
    {
      id: "proj-9",
      title: "Gurukul Educational Platform",
      description: "An online learning management system with course tracking and student dashboards.",
      tech: ["React", "Node.js", "MongoDB"],
      github: "https://github.com/princegajera1/gurukul1",
      demo: "https://gurukul1-five.vercel.app/",
      featured: false,
      image: "",
    },
    {
      id: "proj-10",
      title: "Interactive Quiz App",
      description: "A timed quiz application with dynamic scoring and detailed performance analytics.",
      tech: ["React", "JavaScript", "CSS"],
      github: "https://github.com/princegajera1/quiz_app",
      demo: "https://quiz-app.vercel.app/",
      featured: false,
      image: "",
    },
    {
      id: "proj-11",
      title: "Coffee Shop Website",
      description: "A visually appealing landing page for a boutique coffee shop featuring smooth animations.",
      tech: ["HTML", "CSS", "JavaScript"],
      github: "https://github.com/princegajera1/coffee-website",
      demo: "https://princegajera1.github.io/coffee-website/",
      featured: false,
      image: "",
    },
    {
      id: "proj-12",
      title: "Nike Landing Page",
      description: "A high-performance product landing page clone focusing on modern CSS layout techniques.",
      tech: ["React", "TailwindCSS", "Framer Motion"],
      github: "https://github.com/princegajera1/nike-landing-page",
      demo: "",
      featured: false,
      image: "",
    },
    {
      id: "proj-13",
      title: "Password Generator",
      description: "A secure utility tool to generate complex, customizable passwords instantly.",
      tech: ["React", "TailwindCSS", "Crypto API"],
      github: "https://github.com/princegajera1/Password",
      demo: "",
      featured: false,
      image: "",
    },
    {
      id: "proj-14",
      title: "Prodigy Tasks (GA_01 to GA_05)",
      description: "A collection of task implementations and mini-projects completed during the Prodigy Infotech internship.",
      tech: ["HTML", "CSS", "JavaScript", "React"],
      github: "https://github.com/princegajera1/PRODIGY_GA_01",
      demo: "",
      featured: false,
      image: "",
    },
  ],
  experience: [
    {
      id: "exp-1",
      role: "Software Development Intern",
      company: "Shreeji Software",
      period: "April 2026 – July 2026",
      description: [
        "Built production web applications using React.js and Node.js.",
        "Collaborated in an agile team environment to deliver scalable solutions.",
        "Implemented responsive designs and RESTful API integrations.",
      ],
      initials: "SS",
    },
    {
      id: "exp-2",
      role: "Generative AI Intern",
      company: "Generative AI",
      period: "July 2025",
      description: [
        "Worked extensively with Large Language Models (LLMs) and Prompt Engineering.",
        "Integrated OpenAI API for automated content generation and analysis.",
        "Developed Retrieval-Augmented Generation (RAG) applications.",
        "Achieved certification upon successful completion of the internship program.",
      ],
      initials: "GAI",
    },
  ],
  contact: {
    email: "princegajera.dev@gmail.com",
    phone: "+91 99988 77766",
    location: "Ahmedabad, Gujarat, India",
    linkedin: "https://linkedin.com/in/princegajera1",
    github: "https://github.com/princegajera1",
    twitter: "https://twitter.com/princegajera1",
  },
};

// Helper function to seed the database
async function seedDatabase() {
  await prisma.$transaction([
    prisma.hero.upsert({
      where: { id: "1" },
      update: {},
      create: defaultPortfolioData.hero,
    }),
    prisma.about.upsert({
      where: { id: "1" },
      update: {},
      create: {
        bio: defaultPortfolioData.about.bio,
        avatarUrl: defaultPortfolioData.about.avatarUrl,
        yearsExp: defaultPortfolioData.about.yearsExp,
        projectsDone: defaultPortfolioData.about.projectsDone,
        clients: defaultPortfolioData.about.clients,
        techPills: JSON.stringify(defaultPortfolioData.about.techPills),
      },
    }),
    prisma.contact.upsert({
      where: { id: "1" },
      update: {},
      create: defaultPortfolioData.contact,
    }),
  ]);

  // Seed Skills
  const existingSkills = await prisma.skill.findMany();
  if (existingSkills.length === 0) {
    for (const skill of defaultPortfolioData.skills) {
      await prisma.skill.create({ data: skill });
    }
  }

  // Seed Projects
  const existingProjects = await prisma.project.findMany();
  if (existingProjects.length === 0) {
    for (const project of defaultPortfolioData.projects) {
      await prisma.project.create({
        data: {
          id: project.id,
          title: project.title,
          description: project.description,
          tech: JSON.stringify(project.tech),
          github: project.github,
          demo: project.demo,
          featured: project.featured,
          image: project.image,
        },
      });
    }
  }

  // Seed Experiences
  const existingExperience = await prisma.experience.findMany();
  if (existingExperience.length === 0) {
    for (const exp of defaultPortfolioData.experience) {
      await prisma.experience.create({
        data: {
          id: exp.id,
          role: exp.role,
          company: exp.company,
          period: exp.period,
          description: JSON.stringify(exp.description),
          initials: exp.initials,
        },
      });
    }
  }
}

export async function GET() {
  try {
    let hero = await prisma.hero.findFirst();
    if (!hero) {
      await seedDatabase();
      hero = await prisma.hero.findFirst();
    }

    const about = await prisma.about.findFirst();
    const contact = await prisma.contact.findFirst();
    const skills = await prisma.skill.findMany();
    const projects = await prisma.project.findMany();
    const experiences = await prisma.experience.findMany();

    const formattedAbout = about
      ? {
          ...about,
          techPills: JSON.parse(about.techPills),
        }
      : null;

    const formattedProjects = projects.map((p) => ({
      ...p,
      tech: JSON.parse(p.tech),
    }));

    const formattedExperiences = experiences.map((e) => ({
      ...e,
      description: JSON.parse(e.description),
    }));

    return NextResponse.json({
      hero,
      about: formattedAbout,
      skills,
      projects: formattedProjects,
      experience: formattedExperiences,
      contact,
    });
  } catch (error: any) {
    console.error("GET Portfolio Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Check basic auth simple check (since dashboard credentials is admin@123 we can check if body has user status or save request)
    // We will save changes directly to database
    const { hero, about, skills, projects, experience, contact } = body;

    if (hero) {
      await prisma.hero.upsert({
        where: { id: "1" },
        update: {
          name: hero.name,
          title: hero.title,
          subtitleText: hero.subtitleText,
          resumeUrl: hero.resumeUrl,
        },
        create: {
          id: "1",
          name: hero.name,
          title: hero.title,
          subtitleText: hero.subtitleText,
          resumeUrl: hero.resumeUrl,
        },
      });
    }

    if (about) {
      await prisma.about.upsert({
        where: { id: "1" },
        update: {
          bio: about.bio,
          avatarUrl: about.avatarUrl,
          yearsExp: about.yearsExp,
          projectsDone: about.projectsDone,
          clients: about.clients,
          techPills: JSON.stringify(about.techPills || []),
        },
        create: {
          id: "1",
          bio: about.bio,
          avatarUrl: about.avatarUrl,
          yearsExp: about.yearsExp,
          projectsDone: about.projectsDone,
          clients: about.clients,
          techPills: JSON.stringify(about.techPills || []),
        },
      });
    }

    if (contact) {
      await prisma.contact.upsert({
        where: { id: "1" },
        update: {
          email: contact.email,
          phone: contact.phone,
          location: contact.location,
          linkedin: contact.linkedin,
          github: contact.github,
          twitter: contact.twitter,
        },
        create: {
          id: "1",
          email: contact.email,
          phone: contact.phone,
          location: contact.location,
          linkedin: contact.linkedin,
          github: contact.github,
          twitter: contact.twitter,
        },
      });
    }

    if (skills && Array.isArray(skills)) {
      // Keep skills synced: clear existing and re-insert or upsert.
      // Re-inserting is much cleaner for CRUD syncing where user can add/remove skills.
      await prisma.skill.deleteMany();
      for (const skill of skills) {
        await prisma.skill.create({
          data: {
            id: skill.id || undefined,
            name: skill.name,
            level: Number(skill.level),
            category: skill.category,
          },
        });
      }
    }

    if (projects && Array.isArray(projects)) {
      await prisma.project.deleteMany();
      for (const project of projects) {
        await prisma.project.create({
          data: {
            id: project.id || undefined,
            title: project.title,
            description: project.description,
            tech: JSON.stringify(project.tech || []),
            github: project.github || "",
            demo: project.demo || "",
            featured: !!project.featured,
            image: project.image || "",
          },
        });
      }
    }

    if (experience && Array.isArray(experience)) {
      await prisma.experience.deleteMany();
      for (const exp of experience) {
        await prisma.experience.create({
          data: {
            id: exp.id || undefined,
            role: exp.role,
            company: exp.company,
            period: exp.period,
            description: JSON.stringify(exp.description || []),
            initials: exp.initials || "",
          },
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("POST Portfolio Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    // Delete all records to trigger re-seed
    await prisma.$transaction([
      prisma.hero.deleteMany(),
      prisma.about.deleteMany(),
      prisma.contact.deleteMany(),
      prisma.skill.deleteMany(),
      prisma.project.deleteMany(),
      prisma.experience.deleteMany(),
    ]);

    // Re-seed the database
    await seedDatabase();

    // Fetch and return formatted data
    const hero = await prisma.hero.findFirst();
    const about = await prisma.about.findFirst();
    const contact = await prisma.contact.findFirst();
    const skills = await prisma.skill.findMany();
    const projects = await prisma.project.findMany();
    const experiences = await prisma.experience.findMany();

    const formattedAbout = about
      ? {
          ...about,
          techPills: JSON.parse(about.techPills),
        }
      : null;

    const formattedProjects = projects.map((p) => ({
      ...p,
      tech: JSON.parse(p.tech),
    }));

    const formattedExperiences = experiences.map((e) => ({
      ...e,
      description: JSON.parse(e.description),
    }));

    return NextResponse.json({
      hero,
      about: formattedAbout,
      skills,
      projects: formattedProjects,
      experience: formattedExperiences,
      contact,
    });
  } catch (error: any) {
    console.error("DELETE Reset Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

