"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

export interface Hero {
  name: string;
  title: string;
  subtitleText: string;
  resumeUrl: string;
}

export interface About {
  bio: string;
  avatarUrl: string;
  yearsExp: string;
  projectsDone: string;
  clients: string;
  techPills: string[];
}

export interface Skill {
  id: string;
  name: string;
  level: number;
  category: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  tech: string[];
  github: string;
  demo: string;
  featured: boolean;
  image: string;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string[];
  initials: string;
}

export interface Contact {
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  twitter: string;
}

export interface PortfolioData {
  hero: Hero;
  about: About;
  skills: Skill[];
  projects: Project[];
  experience: Experience[];
  contact: Contact;
}

interface PortfolioContextType {
  portfolioData: PortfolioData | null;
  loading: boolean;
  saveChanges: (newData: PortfolioData) => Promise<boolean>;
  resetToDefault: () => Promise<void>;
}

const PortfolioDataContext = createContext<PortfolioContextType | undefined>(undefined);

export const usePortfolioData = () => {
  const context = useContext(PortfolioDataContext);
  if (!context) {
    throw new Error("usePortfolioData must be used within a PortfolioDataProvider");
  }
  return context;
};

export const PortfolioDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/portfolio");
        if (res.ok) {
          const data = await res.json();
          setPortfolioData(data);
          localStorage.setItem("portfolioData", JSON.stringify(data));
        } else {
          throw new Error("Failed to fetch from API");
        }
      } catch (err) {
        console.warn("Fallback to localStorage due to API fetch failure:", err);
        const stored = localStorage.getItem("portfolioData");
        if (stored) {
          setPortfolioData(JSON.parse(stored));
        }
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const saveChanges = async (newData: PortfolioData): Promise<boolean> => {
    try {
      setPortfolioData(newData);
      localStorage.setItem("portfolioData", JSON.stringify(newData));

      const res = await fetch("/api/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newData),
      });

      if (!res.ok) {
        throw new Error("Failed to save to database");
      }
      toast.success("Portfolio saved successfully");
      return true;
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to sync changes with server");
      return false;
    }
  };

  const resetToDefault = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/portfolio", {
        method: "DELETE"
      });
      if (res.ok) {
        const data = await res.json();
        setPortfolioData(data);
        localStorage.setItem("portfolioData", JSON.stringify(data));
        toast.success("Reset successfully");
      } else {
        throw new Error("Failed to reset database");
      }
    } catch (err) {
      toast.error("Failed to reset");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PortfolioDataContext.Provider value={{ portfolioData, loading, saveChanges, resetToDefault }}>
      {children}
    </PortfolioDataContext.Provider>
  );
};
