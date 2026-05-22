"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Image as ImageIcon,
  Award,
  Briefcase,
  Mail,
  Home,
  LogOut,
  Save,
  RotateCcw,
  Plus,
  Trash2,
  Edit2,
  Menu,
  X,
  Move,
  ChevronRight,
  CheckCircle,
  AlertTriangle,
  Loader2,
  MessageSquare,
  Upload,
} from "lucide-react";
import { usePortfolioData, PortfolioData, Skill, Project, Experience } from "@/context/PortfolioDataContext";

export default function AdminDashboard() {
  const router = useRouter();
  const { portfolioData, saveChanges, resetToDefault, loading } = usePortfolioData();

  // Local state to manage forms before clicking save
  const [localData, setLocalData] = useState<PortfolioData | null>(null);
  const [activeTab, setActiveTab] = useState<string>("hero");
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [toast, setToast] = useState<{ message: string; type: "success" | "info" | "error" } | null>(null);
  const [showResetModal, setShowResetModal] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  // CRUD Temp States for Projects
  const [editingProject, setEditingProject] = useState<(Project & { techString: string }) | null>(null);
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    tech: "",
    github: "",
    demo: "",
    featured: true,
    image: "",
  });

  // CRUD Temp States for Experiences
  const [editingExp, setEditingExp] = useState<(Experience & { descriptionString: string }) | null>(null);
  const [newExp, setNewExp] = useState({
    role: "",
    company: "",
    period: "",
    description: "",
    initials: "",
  });

  // Skills input state
  const [newSkill, setNewSkill] = useState({ name: "", level: 80, category: "frontend" });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, targetField: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingField(targetField);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        const uploadedUrl = data.url;

        if (targetField === "heroResume") {
          setLocalData((prev) => {
            if (!prev) return prev;
            return {
              ...prev,
              hero: { ...prev.hero, resumeUrl: uploadedUrl },
            };
          });
          showToastMsg("Resume file uploaded successfully!");
        } else if (targetField === "aboutAvatar") {
          setLocalData((prev) => {
            if (!prev) return prev;
            return {
              ...prev,
              about: { ...prev.about, avatarUrl: uploadedUrl },
            };
          });
          showToastMsg("Avatar image uploaded successfully!");
        } else if (targetField === "newProjectImage") {
          setNewProject((prev) => ({ ...prev, image: uploadedUrl }));
          showToastMsg("Project showcase image uploaded successfully!");
        } else if (targetField === "editProjectImage") {
          setEditingProject((prev) => {
            if (!prev) return prev;
            return { ...prev, image: uploadedUrl };
          });
          showToastMsg("Project showcase image uploaded successfully!");
        }
      } else {
        const errData = await res.json().catch(() => ({}));
        showToastMsg(errData.error || "Failed to upload file", "error");
      }
    } catch (err) {
      showToastMsg("Error uploading file", "error");
    } finally {
      setUploadingField(null);
      e.target.value = "";
    }
  };

  // Message Inbox State
  const [messages, setMessages] = useState<any[]>([]);
  const [messagesLoading, setMessagesLoading] = useState<boolean>(false);

  const fetchMessages = async () => {
    setMessagesLoading(true);
    try {
      const res = await fetch("/api/messages");
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      } else {
        showToastMsg("Failed to fetch messages", "error");
      }
    } catch (err) {
      showToastMsg("Error loading messages", "error");
    } finally {
      setMessagesLoading(false);
    }
  };

  const handleDeleteMessage = async (id: string) => {
    try {
      const res = await fetch(`/api/messages?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        showToastMsg("Message deleted successfully!");
        setMessages(messages.filter((m) => m.id !== id));
      } else {
        showToastMsg("Failed to delete message", "error");
      }
    } catch (err) {
      showToastMsg("Error deleting message", "error");
    }
  };

  useEffect(() => {
    if (activeTab === "messages") {
      fetchMessages();
    }
  }, [activeTab]);

  // Security Check
  useEffect(() => {
    const isAuth = localStorage.getItem("adminAuth") === "true";
    if (!isAuth) {
      router.push("/admin");
    }
  }, [router]);

  // Load context data into local state
  useEffect(() => {
    if (portfolioData) {
      setLocalData(JSON.parse(JSON.stringify(portfolioData)));
    }
  }, [portfolioData]);

  if (loading || !localData) {
    return (
      <div className="h-screen bg-[#0a0a0f] flex flex-col items-center justify-center text-white">
        <Loader2 className="w-10 h-10 text-custom-carrotOrange animate-spin" />
        <span className="mt-4 font-mono text-xs text-gray-500 uppercase tracking-widest">Loading database console...</span>
      </div>
    );
  }

  // Toast trigger
  const showToastMsg = (msg: string, type: "success" | "info" | "error" = "success") => {
    setToast({ message: msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Save changes to context + database
  const handleSaveAll = async () => {
    if (!localData) return;
    setIsSaving(true);
    const success = await saveChanges(localData);
    setIsSaving(false);
    if (success) {
      showToastMsg("All portfolio modifications saved successfully!");
    } else {
      showToastMsg("Failed to save changes to database.", "error");
    }
  };

  // Reset to default
  const handleResetToDefault = async () => {
    setShowResetModal(false);
    await resetToDefault();
    showToastMsg("Portfolio restored to default sample state.", "info");
  };

  // Admin Logout
  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    router.push("/");
  };

  // Skills handlers
  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.name.trim()) return;

    const id = Date.now().toString();
    const addedSkill: Skill = {
      id,
      name: newSkill.name,
      level: newSkill.level,
      category: newSkill.category,
    };

    const updatedSkills = [...localData.skills, addedSkill];
    const updatedData = { ...localData, skills: updatedSkills };
    setLocalData(updatedData);
    await saveChanges(updatedData);
    setNewSkill({ name: "", level: 80, category: "frontend" });
    showToastMsg(`Added skill "${addedSkill.name}" and saved successfully!`);
  };

  const handleDeleteSkill = async (id: string) => {
    const updatedSkills = localData.skills.filter((s) => s.id !== id);
    const updatedData = { ...localData, skills: updatedSkills };
    setLocalData(updatedData);
    await saveChanges(updatedData);
    showToastMsg("Removed skill and saved changes successfully!", "info");
  };

  // Simple HTML5 Drag-and-Drop for Reordering Skills
  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData("text/plain", index.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, targetIndex: number) => {
    const sourceIndexStr = e.dataTransfer.getData("text/plain");
    const sourceIndex = parseInt(sourceIndexStr, 10);
    if (isNaN(sourceIndex) || sourceIndex === targetIndex) return;

    const updatedSkills = [...localData.skills];
    const [removed] = updatedSkills.splice(sourceIndex, 1);
    updatedSkills.splice(targetIndex, 0, removed);

    const updatedData = { ...localData, skills: updatedSkills };
    setLocalData(updatedData);
    await saveChanges(updatedData);
    showToastMsg("Skills reordered and saved successfully!");
  };

  // Project CRUD handlers
  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.title.trim()) return;

    const techArray = newProject.tech
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const added: Project = {
      id: "proj-" + Date.now(),
      title: newProject.title,
      description: newProject.description,
      tech: techArray,
      github: newProject.github,
      demo: newProject.demo,
      featured: newProject.featured,
      image: newProject.image || "",
    };

    const updatedData = {
      ...localData,
      projects: [added, ...localData.projects],
    };
    setLocalData(updatedData);
    await saveChanges(updatedData);
    setNewProject({ title: "", description: "", tech: "", github: "", demo: "", featured: true, image: "" });
    showToastMsg("New project added and saved successfully!");
  };

  const handleDeleteProject = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    const updated = localData.projects.filter((p) => p.id !== id);
    const updatedData = { ...localData, projects: updated };
    setLocalData(updatedData);
    await saveChanges(updatedData);
    showToastMsg("Project deleted and saved successfully!", "info");
  };

  const handleEditProjectClick = (proj: Project) => {
    setEditingProject({
      ...proj,
      techString: proj.tech.join(", "),
    });
  };

  const handleSaveProjectEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    const techArray = editingProject.techString
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const updated = localData.projects.map((p) => {
      if (p.id === editingProject.id) {
        const { techString, ...rest } = editingProject;
        return {
          ...rest,
          tech: techArray,
        };
      }
      return p;
    });

    const updatedData = { ...localData, projects: updated };
    setLocalData(updatedData);
    await saveChanges(updatedData);
    setEditingProject(null);
    showToastMsg("Project details updated and saved successfully!");
  };

  // Experience CRUD handlers
  const handleAddExp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExp.role.trim() || !newExp.company.trim()) return;

    const descArray = newExp.description
      .split("\n")
      .map((d) => d.trim())
      .filter(Boolean);
    const added: Experience = {
      id: "exp-" + Date.now(),
      role: newExp.role,
      company: newExp.company,
      period: newExp.period,
      description: descArray,
      initials: newExp.initials || newExp.company.substring(0, 3).toUpperCase(),
    };

    const updatedData = {
      ...localData,
      experience: [added, ...localData.experience],
    };
    setLocalData(updatedData);
    await saveChanges(updatedData);
    setNewExp({ role: "", company: "", period: "", description: "", initials: "" });
    showToastMsg("New experience added and saved successfully!");
  };

  const handleDeleteExp = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this experience record?")) return;
    const updated = localData.experience.filter((ex) => ex.id !== id);
    const updatedData = { ...localData, experience: updated };
    setLocalData(updatedData);
    await saveChanges(updatedData);
    showToastMsg("Experience record deleted and saved successfully!", "info");
  };

  const handleEditExpClick = (exp: Experience) => {
    setEditingExp({
      ...exp,
      descriptionString: exp.description.join("\n"),
    });
  };

  const handleSaveExpEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExp) return;

    const descArray = editingExp.descriptionString
      .split("\n")
      .map((d) => d.trim())
      .filter(Boolean);

    const updated = localData.experience.map((ex) => {
      if (ex.id === editingExp.id) {
        const { descriptionString, ...rest } = editingExp;
        return {
          ...rest,
          description: descArray,
        };
      }
      return ex;
    });

    const updatedData = { ...localData, experience: updated };
    setLocalData(updatedData);
    await saveChanges(updatedData);
    setEditingExp(null);
    showToastMsg("Experience updated and saved successfully!");
  };

  const navItems = [
    { id: "hero", name: "Hero Banner", icon: <Home size={18} /> },
    { id: "about", name: "About & Marquee", icon: <User size={18} /> },
    { id: "skills", name: "Skills & Levels", icon: <Award size={18} /> },
    { id: "projects", name: "Projects CRUD", icon: <ImageIcon size={18} /> },
    { id: "experience", name: "Experience Timeline", icon: <Briefcase size={18} /> },
    { id: "contact", name: "Contact Info", icon: <Mail size={18} /> },
    { id: "messages", name: "Inbox Messages", icon: <MessageSquare size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-gray-200 font-sans flex flex-col md:flex-row relative">
      {/* Floating Toast Notification */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-6 py-4 rounded-xl border shadow-2xl transition-all duration-300 font-mono text-sm max-w-sm animate-fade-in ${
            toast.type === "success"
              ? "bg-[#0f1b14] border-green-500/40 text-green-400 shadow-green-950/20"
              : toast.type === "info"
              ? "bg-[#0d1620] border-blue-500/40 text-blue-400 shadow-blue-950/20"
              : "bg-[#201010] border-red-500/40 text-red-400 shadow-red-950/20"
          }`}
        >
          <CheckCircle size={20} className="flex-shrink-0" />
          <span>{toast.message}</span>
        </div>
      )}

      {/* Mobile Sidebar Header */}
      <div className="md:hidden bg-black/90 px-4 py-3 flex justify-between items-center border-b border-white/5 relative z-30">
        <span className="font-heading font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-custom-midnightGreen to-custom-carrotOrange uppercase tracking-widest text-lg">
          Console
        </span>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 bg-white/5 rounded-lg border border-white/10 text-gray-300 hover:text-white"
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* COLLAPSIBLE SIDEBAR */}
      <aside
        className={`w-full md:w-64 flex-shrink-0 bg-black/80 border-r border-white/5 flex flex-col justify-between transition-all duration-300 relative z-20 ${
          isSidebarOpen ? "block" : "hidden md:flex"
        }`}
      >
        <div className="p-6">
          <div className="hidden md:block mb-8">
            <h1 className="font-heading font-extrabold text-xl tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-custom-midnightGreen to-custom-carrotOrange uppercase">
              Admin Console
            </h1>
            <p className="text-[10px] text-gray-500 font-mono tracking-widest mt-1">v2.0 PRODUCTION</p>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (window.innerWidth < 768) setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all duration-200 border text-left ${
                  activeTab === item.id
                    ? "bg-custom-carrotOrange/10 border-custom-carrotOrange/30 text-custom-carrotOrange font-medium shadow-md shadow-custom-carrotOrange/5"
                    : "bg-transparent border-transparent text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
                {activeTab === item.id && <ChevronRight size={14} className="ml-auto" />}
              </button>
            ))}
          </nav>
        </div>

        {/* Global Sidebar Buttons */}
        <div className="p-6 border-t border-white/5 space-y-3 bg-black/40">
          <button
            onClick={() => setShowResetModal(true)}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-red-950/20 border border-red-900/40 text-xs font-mono text-red-400 hover:bg-red-950/40 transition-colors"
          >
            <RotateCcw size={14} />
            Reset Defaults
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <LogOut size={14} />
            Logout Session
          </button>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <main className="flex-grow p-6 md:p-10 md:max-h-screen overflow-y-auto relative z-10 flex flex-col">
        {/* Dashboard Top bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-4 border-b border-white/5">
          <div>
            <span className="text-xs font-mono text-custom-carrotOrange tracking-widest uppercase">Database Panel</span>
            <h2 className="text-3xl font-heading font-extrabold text-white">
              {navItems.find((n) => n.id === activeTab)?.name}
            </h2>
          </div>

          <button
            onClick={handleSaveAll}
            disabled={isSaving}
            className="flex items-center gap-2 py-3 px-6 rounded-lg font-bold text-white bg-gradient-to-r from-custom-midnightGreen to-custom-carrotOrange hover:brightness-110 shadow-lg shadow-custom-carrotOrange/10 hover:shadow-custom-carrotOrange/20 hover:-translate-y-0.5 disabled:opacity-50 disabled:pointer-events-none transition-all duration-300 text-sm tracking-wider uppercase"
          >
            {isSaving ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}
            Save Database
          </button>
        </div>

        {/* ACTIVE TAB CONTENT AREAS */}
        <div className="flex-grow pb-12">
          {/* TAB: HERO */}
          {activeTab === "hero" && (
            <div className="glass rounded-xl border border-white/10 p-6 md:p-8 space-y-6 bg-black/30">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-mono tracking-wider uppercase text-gray-400 mb-2">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={localData.hero.name}
                    onChange={(e) =>
                      setLocalData({
                        ...localData,
                        hero: { ...localData.hero, name: e.target.value },
                      })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:border-custom-carrotOrange/60 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono tracking-wider uppercase text-gray-400 mb-2">
                    Profession Title
                  </label>
                  <input
                    type="text"
                    value={localData.hero.title}
                    onChange={(e) =>
                      setLocalData({
                        ...localData,
                        hero: { ...localData.hero, title: e.target.value },
                      })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:border-custom-carrotOrange/60 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono tracking-wider uppercase text-gray-400 mb-2">
                  Typewriter Subtitle Sentences (comma-separated)
                </label>
                <input
                  type="text"
                  value={localData.hero.subtitleText}
                  onChange={(e) =>
                    setLocalData({
                      ...localData,
                      hero: { ...localData.hero, subtitleText: e.target.value },
                    })
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:border-custom-carrotOrange/60 transition-colors"
                />
                <span className="text-[10px] text-gray-500 font-mono block mt-1">
                  Example: &quot;React Developer, Node.js Expert, AI Enthusiast&quot;
                </span>
              </div>

              <div>
                <label className="block text-xs font-mono tracking-wider uppercase text-gray-400 mb-2">
                  Resume Image or PDF URL
                </label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={localData.hero.resumeUrl}
                    onChange={(e) =>
                      setLocalData({
                        ...localData,
                        hero: { ...localData.hero, resumeUrl: e.target.value },
                      })
                    }
                    className="flex-grow bg-white/5 border border-white/10 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:border-custom-carrotOrange/60 transition-colors text-sm font-mono"
                  />
                  <div className="relative">
                    <input
                      type="file"
                      id="upload-resume-input"
                      className="hidden"
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={(e) => handleFileUpload(e, "heroResume")}
                    />
                    <label
                      htmlFor="upload-resume-input"
                      className="flex items-center justify-center gap-2 h-full px-4 py-2.5 rounded-lg bg-custom-carrotOrange/10 border border-custom-carrotOrange/30 text-custom-carrotOrange hover:bg-custom-carrotOrange hover:text-white transition-all text-xs font-mono uppercase cursor-pointer select-none whitespace-nowrap min-w-[140px]"
                    >
                      {uploadingField === "heroResume" ? (
                        <>
                          <Loader2 size={14} className="animate-spin" />
                          <span>Uploading...</span>
                        </>
                      ) : (
                        <>
                          <Upload size={14} />
                          <span>Upload PC</span>
                        </>
                      )}
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: ABOUT */}
          {activeTab === "about" && (
            <div className="glass rounded-xl border border-white/10 p-6 md:p-8 space-y-6 bg-black/30">
              <div>
                <label className="block text-xs font-mono tracking-wider uppercase text-gray-400 mb-2">
                  Detailed Biography
                </label>
                <textarea
                  rows={5}
                  value={localData.about.bio}
                  onChange={(e) =>
                    setLocalData({
                      ...localData,
                      about: { ...localData.about, bio: e.target.value },
                    })
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-custom-carrotOrange/60 transition-colors leading-relaxed font-sans"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-mono tracking-wider uppercase text-gray-400 mb-2">
                    Profile Image Path
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={localData.about.avatarUrl}
                      onChange={(e) =>
                        setLocalData({
                          ...localData,
                          about: { ...localData.about, avatarUrl: e.target.value },
                        })
                      }
                      className="flex-grow bg-white/5 border border-white/10 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:border-custom-carrotOrange/60 transition-colors text-sm font-mono"
                    />
                    <div className="relative">
                      <input
                        type="file"
                        id="upload-avatar-input"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, "aboutAvatar")}
                      />
                      <label
                        htmlFor="upload-avatar-input"
                        className="flex items-center justify-center gap-2 h-full px-4 py-2.5 rounded-lg bg-custom-carrotOrange/10 border border-custom-carrotOrange/30 text-custom-carrotOrange hover:bg-custom-carrotOrange hover:text-white transition-all text-xs font-mono uppercase cursor-pointer select-none whitespace-nowrap min-w-[140px]"
                      >
                        {uploadingField === "aboutAvatar" ? (
                          <>
                            <Loader2 size={14} className="animate-spin" />
                            <span>Uploading...</span>
                          </>
                        ) : (
                          <>
                            <Upload size={14} />
                            <span>Upload PC</span>
                          </>
                        )}
                      </label>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-mono tracking-wider uppercase text-gray-400 mb-2">
                      Projects
                    </label>
                    <input
                      type="text"
                      value={localData.about.projectsDone}
                      onChange={(e) =>
                        setLocalData({
                          ...localData,
                          about: {
                            ...localData.about,
                            projectsDone: e.target.value,
                          },
                        })
                      }
                      className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 px-2 text-center text-white focus:outline-none focus:border-custom-carrotOrange/60 transition-colors font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono tracking-wider uppercase text-gray-400 mb-2">
                      Clients
                    </label>
                    <input
                      type="text"
                      value={localData.about.clients}
                      onChange={(e) =>
                        setLocalData({
                          ...localData,
                          about: {
                            ...localData.about,
                            clients: e.target.value,
                          },
                        })
                      }
                      className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 px-2 text-center text-white focus:outline-none focus:border-custom-carrotOrange/60 transition-colors font-mono"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono tracking-wider uppercase text-gray-400 mb-2">
                  Marquee Tech Pills (comma-separated list)
                </label>
                <input
                  type="text"
                  value={localData.about.techPills.join(", ")}
                  onChange={(e) =>
                    setLocalData({
                      ...localData,
                      about: {
                        ...localData.about,
                        techPills: e.target.value
                          .split(",")
                          .map((s) => s.trim())
                          .filter(Boolean),
                      },
                    })
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:border-custom-carrotOrange/60 transition-colors"
                />
                <span className="text-[10px] text-gray-500 font-mono block mt-1">
                  Pills animate infinitely inside the About section marquee grid.
                </span>
              </div>
            </div>
          )}

          {/* TAB: SKILLS */}
          {activeTab === "skills" && (
            <div className="space-y-6">
              {/* Form to add a new skill */}
              <form
                onSubmit={handleAddSkill}
                className="glass rounded-xl border border-white/10 p-6 bg-black/30 grid grid-cols-1 sm:grid-cols-4 gap-4 items-end"
              >
                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-mono tracking-wider uppercase text-gray-400 mb-1.5">
                    Skill Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Next.js, GraphQL"
                    value={newSkill.name}
                    onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-custom-carrotOrange/60 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono tracking-wider uppercase text-gray-400 mb-1.5">
                    Proficiency: {newSkill.level}%
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="5"
                    value={newSkill.level}
                    onChange={(e) => setNewSkill({ ...newSkill, level: parseInt(e.target.value) })}
                    className="w-full accent-custom-carrotOrange"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono tracking-wider uppercase text-gray-400 mb-1.5">
                    Category
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={newSkill.category}
                      onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-2 text-white focus:outline-none focus:border-custom-carrotOrange/60 text-xs font-mono"
                    >
                      <option value="frontend" className="bg-[#0a0a0f]">
                        Frontend
                      </option>
                      <option value="backend" className="bg-[#0a0a0f]">
                        Backend
                      </option>
                      <option value="tools" className="bg-[#0a0a0f]">
                        Tools/Other
                      </option>
                    </select>
                    <button
                      type="submit"
                      className="p-2 rounded-lg bg-custom-carrotOrange hover:brightness-110 text-white flex-shrink-0"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                </div>
              </form>

              {/* Skills Reorder / View List */}
              <div className="glass rounded-xl border border-white/10 p-6 bg-black/30">
                <div className="flex items-center gap-2 mb-4">
                  <Move size={16} className="text-custom-carrotOrange" />
                  <h3 className="text-base font-heading font-bold text-white">Skills Sorting & Management</h3>
                </div>
                <p className="text-xs text-gray-500 font-mono mb-4 leading-relaxed">
                  Drag and drop skills using the <Move size={12} className="inline mx-1" /> handle to change their
                  sequence. Reordering impacts rendering order in category tabs.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {["frontend", "backend", "tools"].map((cat) => {
                    const catSkills = localData.skills.filter((s) => s.category === cat);
                    return (
                      <div key={cat} className="space-y-2">
                        <span className="text-[10px] font-mono tracking-wider uppercase text-custom-carrotOrange border-b border-custom-carrotOrange/20 pb-1.5 block">
                          {cat} ({catSkills.length})
                        </span>

                        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                          {catSkills.length === 0 ? (
                            <div className="text-xs font-mono text-gray-600 p-4 border border-dashed border-white/5 rounded-lg text-center">
                              Empty category
                            </div>
                          ) : (
                            localData.skills.map((skill, index) => {
                              if (skill.category !== cat) return null;
                              return (
                                <div
                                  key={skill.id}
                                  draggable
                                  onDragStart={(e) => handleDragStart(e, index)}
                                  onDragOver={handleDragOver}
                                  onDrop={(e) => handleDrop(e, index)}
                                  className="flex items-center justify-between p-2.5 bg-white/[0.03] border border-white/5 hover:border-white/15 rounded-lg transition-all text-xs font-mono group"
                                >
                                  <div className="flex items-center gap-2 cursor-grab active:cursor-grabbing text-gray-500 hover:text-white">
                                    <Move size={14} className="flex-shrink-0" />
                                    <span className="font-semibold text-gray-200">{skill.name}</span>
                                    <span className="text-[10px] text-gray-500 font-light">({skill.level}%)</span>
                                  </div>
                                  <button
                                    onClick={() => handleDeleteSkill(skill.id)}
                                    className="p-1 rounded bg-red-950/20 text-red-500 border border-red-900/30 hover:bg-red-50 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                                    title="Delete skill"
                                  >
                                    <Trash2 size={12} />
                                  </button>
                                </div>
                              );
                            })
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB: PROJECTS */}
          {activeTab === "projects" && (
            <div className="space-y-6">
              {/* Form to Add New Project */}
              {!editingProject && (
                <form
                  onSubmit={handleAddProject}
                  className="glass rounded-xl border border-white/10 p-6 bg-black/30 space-y-4"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Plus size={16} className="text-custom-carrotOrange" />
                    <h3 className="text-base font-heading font-bold text-white">Add New Project</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono tracking-wider uppercase text-gray-400 mb-1">
                        Project Name
                      </label>
                      <input
                        type="text"
                        required
                        value={newProject.title}
                        onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-custom-carrotOrange/60 text-sm"
                        placeholder="e.g. Dev Orbit"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono tracking-wider uppercase text-gray-400 mb-1">
                        Tech Stack (comma-separated)
                      </label>
                      <input
                        type="text"
                        value={newProject.tech}
                        onChange={(e) => setNewProject({ ...newProject, tech: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-custom-carrotOrange/60 text-sm"
                        placeholder="React, Firebase, Tailwind"
                      />
                    </div>
                    <div className="flex items-center gap-4 py-6">
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newProject.featured}
                          onChange={(e) => setNewProject({ ...newProject, featured: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="relative w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-custom-carrotOrange"></div>
                        <span className="ms-3 text-xs font-mono uppercase tracking-wide text-gray-400">
                          Featured Card
                        </span>
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono tracking-wider uppercase text-gray-400 mb-1">
                        GitHub URL
                      </label>
                      <input
                        type="url"
                        value={newProject.github}
                        onChange={(e) => setNewProject({ ...newProject, github: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-custom-carrotOrange/60 text-sm font-mono"
                        placeholder="https://github.com/..."
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono tracking-wider uppercase text-gray-400 mb-1">
                        Live Demo URL
                      </label>
                      <input
                        type="url"
                        value={newProject.demo}
                        onChange={(e) => setNewProject({ ...newProject, demo: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-custom-carrotOrange/60 text-sm font-mono"
                        placeholder="https://..."
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono tracking-wider uppercase text-gray-400 mb-1">
                      Project Showcase Image (URL or direct PC Upload)
                    </label>
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={newProject.image}
                        onChange={(e) => setNewProject({ ...newProject, image: e.target.value })}
                        className="flex-grow bg-white/5 border border-white/10 rounded-lg py-2.5 px-3 text-white focus:outline-none focus:border-custom-carrotOrange/60 text-sm font-mono"
                        placeholder="e.g. /uploads/image.png or external URL"
                      />
                      <div className="relative">
                        <input
                          type="file"
                          id="upload-newproj-image"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, "newProjectImage")}
                        />
                        <label
                          htmlFor="upload-newproj-image"
                          className="flex items-center justify-center gap-2 h-full px-4 py-2.5 rounded-lg bg-custom-carrotOrange/10 border border-custom-carrotOrange/30 text-custom-carrotOrange hover:bg-custom-carrotOrange hover:text-white transition-all text-xs font-mono uppercase cursor-pointer select-none whitespace-nowrap min-w-[140px]"
                        >
                          {uploadingField === "newProjectImage" ? (
                            <>
                              <Loader2 size={12} className="animate-spin" />
                              <span>Uploading...</span>
                            </>
                          ) : (
                            <>
                              <Upload size={12} />
                              <span>Upload PC</span>
                            </>
                          )}
                        </label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono tracking-wider uppercase text-gray-400 mb-1">
                      Short Description
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={newProject.description}
                      onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-custom-carrotOrange/60 text-sm"
                      placeholder="Enter details..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-custom-carrotOrange/10 border border-custom-carrotOrange/30 text-custom-carrotOrange font-mono rounded-lg hover:bg-custom-carrotOrange hover:text-white transition-all text-xs tracking-wider uppercase"
                  >
                    Add Project record
                  </button>
                </form>
              )}

              {/* Edit Project Form Modal (renders inline when editing) */}
              {editingProject && (
                <form
                  onSubmit={handleSaveProjectEdit}
                  className="glass rounded-xl border border-custom-carrotOrange/30 p-6 bg-black/40 space-y-4 animate-fade-in ring-1 ring-custom-carrotOrange/30"
                >
                  <div className="flex justify-between items-center pb-2 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <Edit2 size={16} className="text-custom-carrotOrange" />
                      <h3 className="text-base font-heading font-bold text-white">Edit: {editingProject.title}</h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setEditingProject(null)}
                      className="p-1 rounded hover:bg-white/10 text-gray-400 hover:text-white text-xs font-mono"
                    >
                      Cancel Edit
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono tracking-wider uppercase text-gray-400 mb-1">
                        Project Name
                      </label>
                      <input
                        type="text"
                        required
                        value={editingProject.title}
                        onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                        className="w-full bg-white/10 border border-white/20 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-custom-carrotOrange text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono tracking-wider uppercase text-gray-400 mb-1">
                        Tech Stack (comma-separated)
                      </label>
                      <input
                        type="text"
                        value={editingProject.techString}
                        onChange={(e) => setEditingProject({ ...editingProject, techString: e.target.value })}
                        className="w-full bg-white/10 border border-white/20 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-custom-carrotOrange text-sm"
                      />
                    </div>
                    <div className="flex items-center gap-4 py-6">
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingProject.featured}
                          onChange={(e) => setEditingProject({ ...editingProject, featured: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="relative w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-custom-carrotOrange"></div>
                        <span className="ms-3 text-xs font-mono uppercase tracking-wide text-gray-400">
                          Featured Card
                        </span>
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono tracking-wider uppercase text-gray-400 mb-1">
                        GitHub URL
                      </label>
                      <input
                        type="url"
                        value={editingProject.github}
                        onChange={(e) => setEditingProject({ ...editingProject, github: e.target.value })}
                        className="w-full bg-white/10 border border-white/20 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-custom-carrotOrange text-sm font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono tracking-wider uppercase text-gray-400 mb-1">
                        Live Demo URL
                      </label>
                      <input
                        type="url"
                        value={editingProject.demo}
                        onChange={(e) => setEditingProject({ ...editingProject, demo: e.target.value })}
                        className="w-full bg-white/10 border border-white/20 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-custom-carrotOrange text-sm font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono tracking-wider uppercase text-gray-400 mb-1">
                      Project Showcase Image (URL or direct PC Upload)
                    </label>
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={editingProject.image}
                        onChange={(e) => setEditingProject({ ...editingProject, image: e.target.value })}
                        className="flex-grow bg-white/10 border border-white/20 rounded-lg py-2.5 px-3 text-white focus:outline-none focus:border-custom-carrotOrange text-sm font-mono"
                      />
                      <div className="relative">
                        <input
                          type="file"
                          id="upload-editproj-image"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, "editProjectImage")}
                        />
                        <label
                          htmlFor="upload-editproj-image"
                          className="flex items-center justify-center gap-2 h-full px-4 py-2.5 rounded-lg bg-custom-carrotOrange/10 border border-custom-carrotOrange/30 text-custom-carrotOrange hover:bg-custom-carrotOrange hover:text-white transition-all text-xs font-mono uppercase cursor-pointer select-none whitespace-nowrap min-w-[140px]"
                        >
                          {uploadingField === "editProjectImage" ? (
                            <>
                              <Loader2 size={12} className="animate-spin" />
                              <span>Uploading...</span>
                            </>
                          ) : (
                            <>
                              <Upload size={12} />
                              <span>Upload PC</span>
                            </>
                          )}
                        </label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono tracking-wider uppercase text-gray-400 mb-1">
                      Short Description
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={editingProject.description}
                      onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                      className="w-full bg-white/10 border border-white/20 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-custom-carrotOrange text-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-custom-carrotOrange text-white font-mono rounded-lg hover:brightness-110 shadow-md shadow-custom-carrotOrange/20 transition-all text-xs tracking-wider uppercase"
                  >
                    Save Changes to project
                  </button>
                </form>
              )}

              {/* Projects List Dashboard */}
              <div className="glass rounded-xl border border-white/10 p-6 bg-black/30">
                <h3 className="text-base font-heading font-bold text-white mb-4">
                  Project Archive Database ({localData.projects.length})
                </h3>

                <div className="space-y-3">
                  {localData.projects.map((proj) => (
                    <div
                      key={proj.id}
                      className={`flex flex-col sm:flex-row justify-between sm:items-center gap-4 p-4 border rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-300 ${
                        proj.featured
                          ? "border-custom-carrotOrange/30 shadow-md shadow-custom-carrotOrange/5"
                          : "border-white/5"
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-gray-100">{proj.title}</span>
                          {proj.featured && (
                            <span className="text-[9px] font-mono font-semibold px-2 py-0.5 rounded bg-custom-carrotOrange/20 text-custom-carrotOrange tracking-widest uppercase">
                              FEATURED
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 font-light line-clamp-1 max-w-xl">{proj.description}</p>
                        <div className="flex gap-1.5 flex-wrap">
                          {proj.tech.map((t, idx) => (
                            <span
                              key={idx}
                              className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-gray-400"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <button
                          onClick={() => handleEditProjectClick(proj)}
                          className="p-2 rounded bg-white/5 text-gray-400 hover:text-white border border-white/10 hover:border-white/20 transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteProject(proj.id)}
                          className="p-2 rounded bg-red-950/20 text-red-500 hover:text-white border border-red-900/30 hover:bg-red-50 hover:text-white transition-all"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: EXPERIENCE */}
          {activeTab === "experience" && (
            <div className="space-y-6">
              {/* Form to Add New Experience */}
              {!editingExp && (
                <form
                  onSubmit={handleAddExp}
                  className="glass rounded-xl border border-white/10 p-6 bg-black/30 space-y-4"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Plus size={16} className="text-custom-carrotOrange" />
                    <h3 className="text-base font-heading font-bold text-white">Add New Professional Role</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono tracking-wider uppercase text-gray-400 mb-1">
                        Role Title
                      </label>
                      <input
                        type="text"
                        required
                        value={newExp.role}
                        onChange={(e) => setNewExp({ ...newExp, role: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-custom-carrotOrange/60 text-sm"
                        placeholder="e.g. Software Engineer"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono tracking-wider uppercase text-gray-400 mb-1">
                        Company / Institution
                      </label>
                      <input
                        type="text"
                        required
                        value={newExp.company}
                        onChange={(e) => setNewExp({ ...newExp, company: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-custom-carrotOrange/60 text-sm"
                        placeholder="e.g. Google"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono tracking-wider uppercase text-gray-400 mb-1">
                        Duration / Period
                      </label>
                      <input
                        type="text"
                        required
                        value={newExp.period}
                        onChange={(e) => setNewExp({ ...newExp, period: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-custom-carrotOrange/60 text-sm"
                        placeholder="e.g. Jan 2026 – Present"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-1">
                      <label className="block text-[10px] font-mono tracking-wider uppercase text-gray-400 mb-1">
                        Initials (For Timeline Icon)
                      </label>
                      <input
                        type="text"
                        value={newExp.initials}
                        onChange={(e) => setNewExp({ ...newExp, initials: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-custom-carrotOrange/60 text-sm font-mono"
                        placeholder="e.g. G (Leave empty for default)"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-mono tracking-wider uppercase text-gray-400 mb-1">
                        Description Bullet Points (One per line)
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={newExp.description}
                        onChange={(e) => setNewExp({ ...newExp, description: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-custom-carrotOrange/60 text-sm font-sans"
                        placeholder="Built web tools in React&#10;Integrated LLMs to power dashboards&#10;Boosted Lighthouse scores by 20%"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-custom-carrotOrange/10 border border-custom-carrotOrange/30 text-custom-carrotOrange font-mono rounded-lg hover:bg-custom-carrotOrange hover:text-white transition-all text-xs tracking-wider uppercase"
                  >
                    Add Experience record
                  </button>
                </form>
              )}

              {/* Edit Experience Modal (inline replacement) */}
              {editingExp && (
                <form
                  onSubmit={handleSaveExpEdit}
                  className="glass rounded-xl border border-custom-carrotOrange/30 p-6 bg-black/40 space-y-4 animate-fade-in ring-1 ring-custom-carrotOrange/30"
                >
                  <div className="flex justify-between items-center pb-2 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <Edit2 size={16} className="text-custom-carrotOrange" />
                      <h3 className="text-base font-heading font-bold text-white">
                        Edit: {editingExp.role} @ {editingExp.company}
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setEditingExp(null)}
                      className="p-1 rounded hover:bg-white/10 text-gray-400 hover:text-white text-xs font-mono"
                    >
                      Cancel Edit
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono tracking-wider uppercase text-gray-400 mb-1">
                        Role Title
                      </label>
                      <input
                        type="text"
                        required
                        value={editingExp.role}
                        onChange={(e) => setEditingExp({ ...editingExp, role: e.target.value })}
                        className="w-full bg-white/10 border border-white/20 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-custom-carrotOrange text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono tracking-wider uppercase text-gray-400 mb-1">
                        Company / Institution
                      </label>
                      <input
                        type="text"
                        required
                        value={editingExp.company}
                        onChange={(e) => setEditingExp({ ...editingExp, company: e.target.value })}
                        className="w-full bg-white/10 border border-white/20 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-custom-carrotOrange text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono tracking-wider uppercase text-gray-400 mb-1">
                        Duration / Period
                      </label>
                      <input
                        type="text"
                        required
                        value={editingExp.period}
                        onChange={(e) => setEditingExp({ ...editingExp, period: e.target.value })}
                        className="w-full bg-white/10 border border-white/20 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-custom-carrotOrange text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono tracking-wider uppercase text-gray-400 mb-1">
                        Initials (Icon)
                      </label>
                      <input
                        type="text"
                        value={editingExp.initials}
                        onChange={(e) => setEditingExp({ ...editingExp, initials: e.target.value })}
                        className="w-full bg-white/10 border border-white/20 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-custom-carrotOrange text-sm font-mono"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-mono tracking-wider uppercase text-gray-400 mb-1">
                        Description Bullet Points (One per line)
                      </label>
                      <textarea
                        rows={4}
                        required
                        value={editingExp.descriptionString}
                        onChange={(e) =>
                          setEditingExp({ ...editingExp, descriptionString: e.target.value })
                        }
                        className="w-full bg-white/10 border border-white/20 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-custom-carrotOrange text-sm font-sans"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-custom-carrotOrange text-white font-mono rounded-lg hover:brightness-110 shadow-md shadow-custom-carrotOrange/20 transition-all text-xs tracking-wider uppercase"
                  >
                    Save Changes to experience
                  </button>
                </form>
              )}

              {/* Experience List View */}
              <div className="glass rounded-xl border border-white/10 p-6 bg-black/30">
                <h3 className="text-base font-heading font-bold text-white mb-4">
                  Professional Roles Timeline ({localData.experience.length})
                </h3>

                <div className="space-y-3">
                  {localData.experience.map((ex) => (
                    <div
                      key={ex.id}
                      className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 p-4 border border-white/5 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-all"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-custom-carrotOrange/10 border border-custom-carrotOrange/30 text-custom-carrotOrange flex items-center justify-center font-mono font-bold text-xs uppercase tracking-widest">
                            {ex.initials}
                          </div>
                          <div>
                            <span className="font-bold text-sm text-gray-100 block">{ex.role}</span>
                            <span className="text-[10px] text-gray-400 font-mono tracking-wide">
                              {ex.company} • {ex.period}
                            </span>
                          </div>
                        </div>
                        <ul className="list-disc list-inside pl-1 text-[11px] text-gray-400 space-y-1 font-light pt-2 max-w-2xl leading-relaxed">
                          {ex.description.map((desc, idx) => (
                            <li key={idx} className="line-clamp-1">
                              {desc}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <button
                          onClick={() => handleEditExpClick(ex)}
                          className="p-2 rounded bg-white/5 text-gray-400 hover:text-white border border-white/10 hover:border-white/20 transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteExp(ex.id)}
                          className="p-2 rounded bg-red-950/20 text-red-500 hover:text-white border border-red-900/30 hover:bg-red-50 hover:text-white transition-all"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: CONTACT */}
          {activeTab === "contact" && (
            <div className="glass rounded-xl border border-white/10 p-6 md:p-8 space-y-6 bg-black/30">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-mono tracking-wider uppercase text-gray-400 mb-2">
                    Public Contact Email
                  </label>
                  <input
                    type="email"
                    value={localData.contact.email}
                    onChange={(e) =>
                      setLocalData({
                        ...localData,
                        contact: { ...localData.contact, email: e.target.value },
                      })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:border-custom-carrotOrange/60 transition-colors font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono tracking-wider uppercase text-gray-400 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={localData.contact.phone}
                    onChange={(e) =>
                      setLocalData({
                        ...localData,
                        contact: { ...localData.contact, phone: e.target.value },
                      })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:border-custom-carrotOrange/60 transition-colors font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono tracking-wider uppercase text-gray-400 mb-2">
                    Location City
                  </label>
                  <input
                    type="text"
                    value={localData.contact.location}
                    onChange={(e) =>
                      setLocalData({
                        ...localData,
                        contact: { ...localData.contact, location: e.target.value },
                      })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:border-custom-carrotOrange/60 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-white/5 pt-6">
                <div>
                  <label className="block text-xs font-mono tracking-wider uppercase text-gray-400 mb-2">
                    GitHub Profile Link
                  </label>
                  <input
                    type="url"
                    value={localData.contact.github}
                    onChange={(e) =>
                      setLocalData({
                        ...localData,
                        contact: { ...localData.contact, github: e.target.value },
                      })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:border-custom-carrotOrange/60 transition-colors font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono tracking-wider uppercase text-gray-400 mb-2">
                    LinkedIn Profile Link
                  </label>
                  <input
                    type="url"
                    value={localData.contact.linkedin}
                    onChange={(e) =>
                      setLocalData({
                        ...localData,
                        contact: { ...localData.contact, linkedin: e.target.value },
                      })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:border-custom-carrotOrange/60 transition-colors font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono tracking-wider uppercase text-gray-400 mb-2">
                    Twitter Profile Link
                  </label>
                  <input
                    type="url"
                    value={localData.contact.twitter}
                    onChange={(e) =>
                      setLocalData({
                        ...localData,
                        contact: { ...localData.contact, twitter: e.target.value },
                      })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:border-custom-carrotOrange/60 transition-colors font-mono text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "messages" && (
            <div className="space-y-6 animate-fade-in select-none">
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <div>
                  <h2 className="text-xl font-heading font-black text-white uppercase tracking-wider">
                    Inbox Messages
                  </h2>
                  <p className="text-[10px] text-gray-500 font-mono tracking-widest uppercase mt-1">
                    Manage contact form submissions stored in your local database
                  </p>
                </div>
                <button
                  onClick={fetchMessages}
                  disabled={messagesLoading}
                  className="px-4 py-2 border border-white/10 rounded-lg text-xs font-mono tracking-wider uppercase text-gray-400 hover:text-white hover:border-[#00f0ff] transition-all bg-white/[0.02]"
                >
                  {messagesLoading ? "Refreshing..." : "Refresh Inbox"}
                </button>
              </div>

              {messagesLoading ? (
                <div className="py-20 flex flex-col items-center justify-center text-gray-500">
                  <Loader2 className="w-8 h-8 text-custom-carrotOrange animate-spin" />
                  <span className="mt-4 font-mono text-xs uppercase tracking-widest">Scanning inbox...</span>
                </div>
              ) : messages.length === 0 ? (
                <div className="glass rounded-2xl border border-white/5 p-12 text-center text-gray-500">
                  <Mail className="w-12 h-12 mx-auto text-gray-600 mb-4 animate-bounce" />
                  <h3 className="text-sm font-heading font-bold text-white uppercase tracking-wider">No Messages Yet</h3>
                  <p className="text-[10px] font-mono tracking-widest mt-1">
                    When visitors submit the contact form on your portfolio page, they will show up here.
                  </p>
                </div>
              ) : (
                <div className="glass rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs sm:text-sm">
                      <thead>
                        <tr className="border-b border-white/5 bg-white/[0.02] text-[10px] font-mono tracking-wider text-gray-400 uppercase select-none">
                          <th className="py-4 px-6 font-bold">Visitor Details</th>
                          <th className="py-4 px-6 font-bold">Message Details</th>
                          <th className="py-4 px-6 font-bold">Received Date</th>
                          <th className="py-4 px-6 font-bold text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {messages.map((msg) => (
                          <tr
                            key={msg.id}
                            className="border-b border-white/5 hover:bg-white/[0.01] transition-colors"
                          >
                            <td className="py-4 px-6 font-sans">
                              <div className="font-bold text-white">{msg.name}</div>
                              <div className="text-[10px] text-gray-400 font-mono mt-0.5">{msg.email}</div>
                            </td>
                            <td className="py-4 px-6 text-gray-300 font-sans max-w-md break-words whitespace-pre-wrap leading-relaxed">
                              {msg.message}
                            </td>
                            <td className="py-4 px-6 text-gray-400 font-mono text-xs">
                              {new Date(msg.createdAt).toLocaleString()}
                            </td>
                            <td className="py-4 px-6 text-center select-none">
                              <button
                                onClick={() => handleDeleteMessage(msg.id)}
                                className="p-2 border border-red-500/10 hover:border-red-500/40 text-red-500 hover:text-white bg-red-950/10 hover:bg-red-500/20 rounded-lg transition-all"
                                title="Delete Message"
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* CONFIRM RESET MODAL */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="glass rounded-2xl border border-red-500/20 max-w-sm w-full bg-[#0a0a0f] p-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-red-500"></div>

            <div className="flex items-center gap-3 text-red-400 mb-4">
              <AlertTriangle size={24} className="flex-shrink-0" />
              <h3 className="text-lg font-heading font-bold text-white">Reset Database?</h3>
            </div>

            <p className="text-xs text-gray-400 font-mono mb-6 leading-relaxed">
              This will completely wipe out any edits, additions, or skills drag orders, reverting the database back to
              Prince&apos;s initial portfolio template. This cannot be undone.
            </p>

            <div className="flex justify-end gap-3 font-mono text-xs">
              <button
                onClick={() => setShowResetModal(false)}
                className="px-4 py-2 rounded bg-white/5 border border-white/10 text-gray-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleResetToDefault}
                className="px-4 py-2 rounded bg-red-950/40 border border-red-500/30 text-red-400 hover:bg-red-600 hover:text-white transition-all"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
