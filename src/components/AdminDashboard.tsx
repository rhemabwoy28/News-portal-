import { useState, useEffect, useRef } from "react";
import React from "react";
import { Plus, LayoutDashboard, FileText, Users, LogOut, Save, X, Trash2, Menu, Copy, Check, Bot, Settings, CheckCircle, Clock, RefreshCw, Globe } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { getArticles, saveArticle, deleteArticle, getSubscribers } from "../services/storageService";
import { ArticleData } from "../types";
import { syncToGithub, GithubConfig } from "../services/githubService";

// Bots & Sync Imports
import PENDING_DATA from "../data/pending.json";
import SETTINGS_DATA from "../data/settings.json";

export default function AdminDashboard({ onLogout, onUpdate }: { onLogout: () => void, onUpdate: () => void }) {
  const [articles, setArticles] = useState<ArticleData[]>([]);
  const [pendingArticles, setPendingArticles] = useState<ArticleData[]>(PENDING_DATA as ArticleData[]);
  const [subscribers, setSubscribers] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"articles" | "subscribers" | "bot" | "settings">("articles");
  const [activeArticleSubTab, setActiveArticleSubTab] = useState<"live" | "queue">("live");
  const [editingArticle, setEditingArticle] = useState<ArticleData | null>(null);
  
  // Settings & Automation
  const [autoPublish, setAutoPublish] = useState(SETTINGS_DATA.autoPublish);
  const [isSyncing, setIsSyncing] = useState(false);
  const [ghConfig, setGhConfig] = useState<GithubConfig>({
    owner: "",
    repo: "",
    branch: "main",
    token: ""
  });
  const [isCreating, setIsCreating] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    setArticles(getArticles());
    setSubscribers(getSubscribers());
    
    // Load local GH config if exists
    const saved = localStorage.getItem("gnn_gh_config");
    if (saved) setGhConfig(JSON.parse(saved));
  }, []);

  const handleGHConfigSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const config: GithubConfig = {
      owner: formData.get("owner") as string,
      repo: formData.get("repo") as string,
      branch: formData.get("branch") as string,
      token: formData.get("token") as string,
    };
    setGhConfig(config);
    localStorage.setItem("gnn_gh_config", JSON.stringify(config));
    alert("System Configuration Updated Locally");
  };

  const toggleAutoPublish = async () => {
    if (!ghConfig.token) return alert("Please set GitHub Token in Settings first.");
    setIsSyncing(true);
    const newVal = !autoPublish;
    const result = await syncToGithub(ghConfig, "src/data/settings.json", { autoPublish: newVal }, "Toggle Auto-Publish");
    if (result.success) {
      setAutoPublish(newVal);
    } else {
      alert("Sync Failed: " + result.error);
    }
    setIsSyncing(false);
  };

  const approveStory = async (article: ArticleData) => {
    if (!ghConfig.token) return alert("Please configure GitHub settings first.");
    setIsSyncing(true);
    
    const newPublished = [article, ...articles];
    const newPending = pendingArticles.filter(p => p.id !== article.id);

    // 1. Update Published list on GitHub
    const pubResult = await syncToGithub(ghConfig, "src/data/published.json", newPublished, `Publish: ${article.title}`);
    
    if (pubResult.success) {
      // 2. Update Pending list on GitHub
      await syncToGithub(ghConfig, "src/data/pending.json", newPending, `Clean queue: ${article.title}`);
      
      setArticles(newPublished);
      setPendingArticles(newPending);
      alert("Dispatch Published Successfully! Vercel will rebuild the site in 2 minutes.");
    } else {
      alert("Sync Failed: " + pubResult.error);
    }
    setIsSyncing(false);
  };

  const stats = [
    { label: "Live Dispatches", value: articles.length, icon: FileText },
    { label: "Pending Queue", value: pendingArticles.length, icon: Clock },
    { label: "Bot Status", value: autoPublish ? "ACTIVE" : "STANDBY", icon: Bot },
  ];

  const handleCopyForCMS = (article: ArticleData) => {
    const htmlString = `
      <h1>${article.title}</h1>
      <p><em>By ${article.author} • ${article.date}</em></p>
      <img src="${article.image}" alt="${article.title}" />
      <p><strong>${article.caption}</strong></p>
      ${article.content.map(p => `<p>${p}</p>`).join('\n')}
      <hr />
      <p>Filed under: ${article.category}, ${article.tags.join(', ')}</p>
    `;
    navigator.clipboard.writeText(htmlString.trim());
    setCopiedId(article.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newArticle: ArticleData = {
      id: editingArticle?.id || Date.now().toString(),
      category: (formData.get("category") as string).toUpperCase(),
      author: formData.get("author") as string,
      title: formData.get("title") as string,
      image: formData.get("image") as string,
      date: editingArticle?.date || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      readTime: editingArticle?.readTime || "5 Min Read",
      content: (formData.get("content") as string).split("\n\n"),
      tags: editingArticle?.tags || ["News", "GNN"],
      caption: editingArticle?.caption || "Dispatch image",
    };

    const updated = saveArticle(newArticle);
    setArticles(updated);
    setIsCreating(false);
    setEditingArticle(null);
    onUpdate();
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this dispatch? This action is irreversible.")) {
      const updated = deleteArticle(id);
      setArticles(updated);
      onUpdate();
    }
  };

  const SidebarContent = () => (
    <>
      <div className="p-4 md:p-8 border-b border-outline-variant/30 flex justify-between items-center bg-surface-container-high">
        <div>
          <h2 className="font-headline font-black text-xl md:text-2xl uppercase tracking-tighter text-primary">GNN Dispatch</h2>
          <p className="font-label text-xs uppercase tracking-widest text-on-surface-variant mt-1 font-bold">Editor's Portal</p>
        </div>
        <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 text-on-surface hover:text-primary active:scale-95">
          <X className="w-6 h-6" />
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        <button 
          onClick={() => { setActiveTab("articles"); setIsSidebarOpen(false); }}
          className={`w-full flex items-center gap-3 px-4 py-3 font-label text-xs uppercase tracking-widest font-bold transition-all ${activeTab === "articles" ? "bg-primary text-white" : "text-on-surface hover:bg-surface-container"}`}
        >
          <FileText className="w-4 h-4" />
          Articles
        </button>
        <button 
          onClick={() => { setActiveTab("bot"); setIsSidebarOpen(false); }}
          className={`w-full flex items-center gap-3 px-4 py-3 font-label text-xs uppercase tracking-widest font-bold transition-all ${activeTab === "bot" ? "bg-primary text-white" : "text-on-surface hover:bg-surface-container"}`}
        >
          <RefreshCw className={`w-4 h-4 ${isSyncing ? "animate-spin" : ""}`} />
          Automation
        </button>
        <button 
          onClick={() => { setActiveTab("settings"); setIsSidebarOpen(false); }}
          className={`w-full flex items-center gap-3 px-4 py-3 font-label text-xs uppercase tracking-widest font-bold transition-all ${activeTab === "settings" ? "bg-primary text-white" : "text-on-surface hover:bg-surface-container"}`}
        >
          <Settings className="w-4 h-4" />
          System Settings
        </button>
      </nav>

      <div className="p-4 border-t border-outline-variant/30">
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 font-label text-xs uppercase tracking-widest font-bold text-on-surface hover:text-primary transition-all"
        >
          <LogOut className="w-4 h-4" />
          Exit Portal
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-surface-bright flex flex-col lg:flex-row">
      <div className="lg:hidden bg-surface-container-highest border-b border-outline-variant/30 p-4 flex justify-between items-center sticky top-0 z-50">
        <h2 className="font-headline font-black text-xl uppercase tracking-tighter text-primary">GNN Portal</h2>
        <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-on-surface hover:text-primary bg-surface-bright border border-outline-variant/30">
          <Menu className="w-6 h-6" />
        </button>
      </div>

      <aside className="hidden lg:flex w-64 bg-surface-container-highest border-r border-outline-variant/30 flex-col h-screen sticky top-0">
        <SidebarContent />
      </aside>

      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-on-surface/40 backdrop-blur-sm z-[60] lg:hidden"
            />
            <motion.aside 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-64 bg-surface-container-highest border-r border-outline-variant/30 flex flex-col z-[70] lg:hidden"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <main className="flex-1 bg-surface-dim/30">
        <header className="bg-surface-bright p-4 md:p-8 border-b border-outline-variant/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="font-headline font-black text-2xl md:text-4xl uppercase tracking-tight text-on-surface">
              {activeTab === "articles" ? "News Management" : 
               activeTab === "bot" ? "GNN Harvester" :
               activeTab === "settings" ? "Engine Settings" : "Distribution List"}
            </h1>
          </div>
          {activeTab === "articles" && (
            <div className="flex gap-2 w-full sm:w-auto">
               <button 
                onClick={() => setActiveArticleSubTab("live")}
                className={`flex-1 sm:flex-none px-4 py-2 font-label text-[10px] uppercase tracking-widest font-bold border ${activeArticleSubTab === "live" ? "bg-on-surface text-surface border-on-surface" : "border-outline-variant text-on-surface-variant hover:bg-surface-dim"}`}
              >
                Live Feed
              </button>
              <button 
                onClick={() => setActiveArticleSubTab("queue")}
                className={`flex-1 sm:flex-none px-4 py-2 font-label text-[10px] uppercase tracking-widest font-bold border flex items-center justify-center gap-2 ${activeArticleSubTab === "queue" ? "bg-primary text-white border-primary" : "border-outline-variant text-on-surface-variant hover:bg-surface-dim"}`}
              >
                <Clock className="w-3 h-3" />
                Queue ({pendingArticles.length})
              </button>
            </div>
          )}
        </header>

        <div className="p-4 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
            {stats.map((stat, i) => (
              <div key={i} className="bg-surface-bright p-4 md:p-6 border-l-4 border-primary shadow-[0_10px_40px_rgba(0,0,0,0.03)]">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-label text-[10px] md:text-xs uppercase tracking-widest text-on-surface-variant font-black">{stat.label}</span>
                  <stat.icon className="w-4 h-4 md:w-5 md:h-5 text-primary opacity-20" />
                </div>
                <div className="font-headline font-black text-2xl md:text-3xl text-on-surface">{stat.value}</div>
              </div>
            ))}
          </div>

          {activeTab === "articles" && (
            <div className="space-y-6">
              {activeArticleSubTab === "live" && (
                <button 
                  onClick={() => setIsCreating(true)}
                  className="w-full bg-primary text-white px-6 py-4 font-headline font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-primary-container transition-all active:scale-95 shadow-xl mb-6"
                >
                  <Plus className="w-5 h-5" />
                  Manual File Dispatch
                </button>
              )}

              <div className="bg-surface-bright border border-outline-variant/30 shadow-xl overflow-hidden">
                <div className="overflow-x-auto w-full border-t border-outline-variant/30">
                  <table className="w-full text-left min-w-[600px] lg:min-w-0">
                    <thead className="bg-surface-container font-label text-[10px] uppercase tracking-widest font-black text-on-surface-variant">
                      <tr>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Title</th>
                        <th className="px-6 py-4 hidden md:table-cell">Category</th>
                        <th className="px-6 py-4 hidden lg:table-cell">Date</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/20">
                      {(activeArticleSubTab === "live" ? articles : pendingArticles).map((article) => (
                        <tr key={article.id} className="hover:bg-surface-container-low transition-colors group">
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <span className={`inline-block w-2 h-2 rounded-full mr-2 ${activeArticleSubTab === "live" ? "bg-green-500 animate-pulse" : "bg-primary"}`}></span>
                              <span className="font-label text-[10px] md:text-xs uppercase tracking-wider font-bold">
                                {activeArticleSubTab === "live" ? "Published" : "Pending"}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-headline font-bold text-sm text-on-surface group-hover:text-primary transition-colors line-clamp-1">{article.title}</div>
                            <div className="md:hidden mt-1 flex gap-2">
                               <span className="font-label text-[8px] uppercase tracking-widest px-1 bg-tertiary-container text-on-tertiary-container font-black">{article.category}</span>
                               <span className="font-body italic text-[10px] text-on-surface-variant">{article.date}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 hidden md:table-cell">
                            <span className="font-label text-[10px] uppercase tracking-widest px-2 py-1 bg-tertiary-container text-on-tertiary-container font-black">{article.category}</span>
                          </td>
                          <td className="px-6 py-4 hidden lg:table-cell font-body italic text-sm text-on-surface-variant">{article.date}</td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                              {activeArticleSubTab === "queue" && (
                                <button 
                                  onClick={() => approveStory(article)}
                                  disabled={isSyncing}
                                  className="p-2 text-primary hover:bg-primary-container transition-all flex items-center gap-1"
                                  title="Approve & Publish"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                  <span className="hidden sm:inline font-label text-[10px] uppercase font-black">Publish</span>
                                </button>
                              )}
                              <button 
                                onClick={() => setEditingArticle(article)}
                                className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container transition-all"
                                title="Edit Story"
                              >
                                <FileText className="w-4 h-4" />
                              </button>
                              <button 
                                 onClick={() => handleCopyForCMS(article)}
                                 className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container transition-all"
                                 title="Copy for WordPress/CMS"
                               >
                                 {copiedId === article.id ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                               </button>
                              <button 
                                onClick={() => handleDelete(article.id)}
                                className="p-2 text-on-surface-variant hover:text-red-600 hover:bg-red-50 transition-all"
                                title="Delete Dispatch"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === "bot" && (
            <div className="space-y-8">
               <div className="bg-surface-bright p-8 border border-outline-variant/30 shadow-lg">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className={`p-4 rounded-full ${autoPublish ? "bg-green-100 text-green-700" : "bg-primary/10 text-primary"}`}>
                      <Bot className={`w-8 h-8 ${autoPublish ? "animate-bounce" : ""}`} />
                    </div>
                    <div>
                      <h3 className="font-headline font-black text-xl uppercase tracking-tighter">GNN Editorial Bot</h3>
                      <p className="font-body italic text-sm text-on-surface-variant/70">Autonomous content harvester & social distributor</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <label className="font-label text-[10px] uppercase tracking-widest font-black">Auto-Publish State</label>
                    <button 
                      onClick={toggleAutoPublish}
                      disabled={isSyncing}
                      className={`relative w-16 h-8 rounded-full transition-all flex items-center p-1 ${autoPublish ? "bg-green-600" : "bg-outline-variant"}`}
                    >
                      <div 
                        className={`w-6 h-6 bg-white rounded-full shadow-lg flex items-center justify-center transition-all ${autoPublish ? "translate-x-8" : "translate-x-0"}`}
                      >
                        {isSyncing && <RefreshCw className="w-3 h-3 animate-spin text-primary" />}
                      </div>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8 border-t border-b border-outline-variant/30">
                  <div className="space-y-4">
                    <h4 className="font-label text-xs uppercase tracking-widest font-black flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      Ingestion Sources
                    </h4>
                    <ul className="space-y-2">
                      {["Joy News RSS", "Daily Graphic RSS", "Gemini Real-time Search"].map((src, i) => (
                        <li key={i} className="flex items-center gap-2 font-body text-sm text-on-surface-variant">
                          <Check className="w-3 h-3 text-green-600" />
                          {src}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-4">
                     <h4 className="font-label text-xs uppercase tracking-widest font-black flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Distribution Nodes
                    </h4>
                    <ul className="space-y-2">
                       <li className="flex items-center gap-2 font-body text-sm text-on-surface-variant">
                          <Check className="w-3 h-3 text-green-600" />
                          GNN Production Branch (GitHub)
                        </li>
                        <li className="flex items-center gap-2 font-body text-sm text-on-surface-variant">
                          <Check className="w-3 h-3 text-green-600" />
                          Vercel Deploy Webhook
                        </li>
                        <li className="flex items-center gap-2 font-body text-sm text-on-surface-variant">
                          <Check className="w-3 h-3 text-green-600" />
                          Facebook Page API
                        </li>
                    </ul>
                  </div>
                </div>

                <div className="mt-8">
                  <p className="font-body text-sm leading-relaxed text-on-surface-variant italic">
                    The GNN Editorial Bot scans local and national feeds every 60 minutes. It generates authoritative rewrites using Gemini 3 Flash, pulls subject-accurate photography from Google Images, and queues them for your review.
                  </p>
                </div>
               </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="max-w-2xl mx-auto">
               <form onSubmit={handleGHConfigSave} className="bg-surface-bright p-8 border border-outline-variant/30 shadow-lg space-y-6">
                 <div className="flex items-center gap-3 mb-6">
                    <Settings className="w-6 h-6 text-primary" />
                    <h3 className="font-headline font-black text-xl uppercase tracking-tighter">Engine Configuration</h3>
                 </div>
                 
                 <div className="space-y-2">
                    <label className="font-label text-[10px] uppercase tracking-widest font-black">GitHub Repository Owner</label>
                    <input name="owner" required defaultValue={ghConfig.owner} placeholder="e.g. gnn-admin" className="w-full bg-surface-container-low border border-outline-variant/30 p-4 font-body" />
                 </div>

                 <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="font-label text-[10px] uppercase tracking-widest font-black">Repository Name</label>
                        <input name="repo" required defaultValue={ghConfig.repo} placeholder="gnn-portal" className="w-full bg-surface-container-low border border-outline-variant/30 p-4 font-body" />
                    </div>
                    <div className="space-y-2">
                        <label className="font-label text-[10px] uppercase tracking-widest font-black">Active Branch</label>
                        <input name="branch" required defaultValue={ghConfig.branch} placeholder="main" className="w-full bg-surface-container-low border border-outline-variant/30 p-4 font-body" />
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="font-label text-[10px] uppercase tracking-widest font-black">Secure GitHub Access Token (PAT)</label>
                    <input name="token" required type="password" defaultValue={ghConfig.token} placeholder="ghp_****************" className="w-full bg-surface-container-low border border-outline-variant/30 p-4 font-mono text-xs" />
                    <p className="font-body text-[10px] text-on-surface-variant/60 italic mt-1 uppercase tracking-tighter">* Stored locally in your browser for secure session management</p>
                 </div>

                 <button type="submit" className="w-full bg-on-surface text-surface py-4 font-headline font-bold uppercase tracking-widest hover:bg-primary transition-all flex items-center justify-center gap-2">
                    <Save className="w-5 h-5" />
                    Initialize Engine
                 </button>
               </form>

               <div className="mt-8 p-6 bg-primary/5 border border-primary/20">
                  <h4 className="font-headline font-bold text-sm uppercase text-primary mb-2">Integration Requirements</h4>
                  <ul className="space-y-2 text-xs font-body text-on-surface-variant">
                    <li>• Google Search API Key (for real images)</li>
                    <li>• Gemini API Key (for content rewriting)</li>
                    <li>• Vercel Deploy Hook (for scheduled builds)</li>
                  </ul>
               </div>
            </div>
          )}

          {activeTab === "subscribers" && (
            <div className="bg-surface-bright p-8 md:p-12 border border-dashed border-outline-variant text-center">
              <Users className="w-10 h-10 md:w-12 md:h-12 text-on-surface-variant mx-auto mb-4 opacity-20" />
              <h3 className="font-headline font-bold text-lg md:text-xl uppercase text-on-surface-variant">Active distribution list pending synchronization</h3>
              <p className="font-body italic text-sm md:text-base text-on-surface-variant/60 mt-2">Connecting to secure transmission grid...</p>
            </div>
          )}
        </div>
      </main>

      {/* Slide-over Form Overlay */}
      <AnimatePresence>
        {(isCreating || editingArticle) && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setIsCreating(false); setEditingArticle(null); }}
              className="fixed inset-0 bg-on-surface/40 backdrop-blur-sm z-[100]"
            />
            <motion.form 
              ref={formRef}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 200 }}
              onSubmit={handleSave}
              className="fixed top-0 right-0 w-full sm:max-w-2xl h-screen bg-surface-bright z-[110] shadow-2xl flex flex-col"
            >
              <div className="p-4 md:p-8 border-b border-outline-variant/30 flex justify-between items-center bg-surface-container-highest">
                <h2 className="font-headline font-black text-xl md:text-2xl uppercase tracking-tighter">
                  {isCreating ? "Draft New Dispatch" : "Edit Dispatch"}
                </h2>
                <div className="flex gap-2">
                  <button 
                    type="button"
                    onClick={() => { setIsCreating(false); setEditingArticle(null); }}
                    className="p-2 text-on-surface-variant hover:text-primary transition-all"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 md:space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div className="space-y-2">
                    <label className="font-label text-[10px] uppercase tracking-[0.2em] font-black text-on-surface-variant">Category</label>
                    <input name="category" required type="text" defaultValue={editingArticle?.category} className="w-full bg-surface-container-low border border-outline-variant/30 p-3 md:p-4 font-label text-sm uppercase focus:outline-none focus:border-primary focus:bg-white transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="font-label text-[10px] uppercase tracking-[0.2em] font-black text-on-surface-variant">Author</label>
                    <input name="author" required type="text" defaultValue={editingArticle?.author || "GNN Staff Reporter"} className="w-full bg-surface-container-low border border-outline-variant/30 p-3 md:p-4 font-label text-sm focus:outline-none focus:border-primary focus:bg-white transition-all" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="font-label text-[10px] uppercase tracking-[0.2em] font-black text-on-surface-variant">Headline</label>
                  <textarea name="title" required defaultValue={editingArticle?.title} rows={2} className="w-full bg-surface-container-low border border-outline-variant/30 p-3 md:p-4 font-headline font-bold text-xl md:text-2xl focus:outline-none focus:border-primary focus:bg-white transition-all italic resize-none" />
                </div>

                <div className="space-y-2">
                  <label className="font-label text-[10px] uppercase tracking-[0.2em] font-black text-on-surface-variant">Featured Image URL</label>
                  <input name="image" type="text" defaultValue={editingArticle?.image} placeholder="https://..." className="w-full bg-surface-container-low border border-outline-variant/30 p-3 md:p-4 font-mono text-xs focus:outline-none focus:border-primary focus:bg-white transition-all" />
                </div>

                <div className="space-y-2">
                  <label className="font-label text-[10px] uppercase tracking-[0.2em] font-black text-on-surface-variant">Article Body (Raw Text)</label>
                  <textarea name="content" required defaultValue={editingArticle?.content.join("\n\n")} rows={10} className="w-full bg-surface-container-low border border-outline-variant/30 p-3 md:p-4 font-body text-base md:text-lg focus:outline-none focus:border-primary focus:bg-white transition-all leading-relaxed resize-none" />
                </div>
              </div>

              <div className="p-4 md:p-8 border-t border-outline-variant/30 bg-surface-container-highest flex flex-col sm:flex-row gap-2 md:gap-4">
                <button type="submit" className="flex-1 bg-primary text-white py-4 font-headline font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-primary-container transition-all active:scale-95 order-1 sm:order-2">
                  <Save className="w-5 h-5" />
                  Transmit Story
                </button>
                <button 
                  type="button"
                  onClick={() => { setIsCreating(false); setEditingArticle(null); }}
                  className="px-8 py-4 sm:py-0 border border-outline-variant text-on-surface-variant font-headline font-bold uppercase tracking-widest hover:bg-surface-dim transition-all order-2 sm:order-1"
                >
                  Discard
                </button>
              </div>
            </motion.form>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
