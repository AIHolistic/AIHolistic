import React, { useState, useEffect } from "react";
import { Search, Sliders, BookOpen, Globe, Award, HelpCircle, Server, FileCode2, Code, Network, ArrowUp, Briefcase, Heart, Coins, Wallet, ExternalLink, ChevronDown, FileText, Download, Home, Layout, Mail, Send, MessageSquare, Grid, ChevronRight, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import SearchPortal from "./components/SearchPortal";
import CrawlerDashboard from "./components/CrawlerDashboard";
import GlossaryManager from "./components/GlossaryManager";
import SeoAuditPanel from "./components/SeoAuditPanel";
import Web3Gateway from "./components/Web3Gateway";
import AdminDashboard from "./components/AdminDashboard";
import MainLandingPage from "./components/MainLandingPage";
import { SystemStats } from "./types";

export default function App() {
  const [viewMode, setViewMode] = useState<"landing" | "terminal">("landing");
  const [activeTab, setActiveTab] = useState<"search" | "crawler" | "glossary" | "seo" | "web3" | "admin">("search");
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [footerModal, setFooterModal] = useState<"tos" | "privacy" | "disclaimer" | "cookies" | null>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [showInvestorHub, setShowInvestorHub] = useState(false);
  const [showKnowledgeMenu, setShowKnowledgeMenu] = useState(false);
  const [showMobileNavGrid, setShowMobileNavGrid] = useState(false);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/stats");
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (err) {
      console.error("Failed to load stats:", err);
    }
  };

  useEffect(() => {
    fetchStats();

    const handleScroll = () => {
      if (window.scrollY > 120) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavAnchor = (containerId: string, tabName?: "search" | "crawler" | "glossary" | "seo" | "web3" | "admin") => {
    if (tabName) {
      setActiveTab(tabName);
    }
    if (viewMode !== "landing") {
      setViewMode("landing");
      setTimeout(() => {
        const el = document.getElementById(containerId);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } else {
      const el = document.getElementById(containerId);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-800 flex flex-col font-sans antialiased selection:bg-indigo-500 selection:text-white">
      {/* Header bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-100 shadow-sm sm:bg-white/95 sm:backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
          {/* Logo & Brand Name */}
          <button
            onClick={() => handleNavAnchor("beranda")}
            className="flex items-center gap-2 sm:gap-3 min-w-0 text-left cursor-pointer hover:opacity-90 transition-opacity"
            title="Akomoda Glosarium Digital Beranda Utama"
          >
            <div className="w-9 h-9 sm:w-11 sm:h-11 bg-slate-900 rounded-xl sm:rounded-2xl overflow-hidden shadow-md sm:shadow-lg border border-indigo-500/20 flex items-center justify-center p-0.5 shrink-0">
              <img
                src="/src/assets/images/akomoda_logo_1784806358181.jpg"
                alt="Akomoda Glossary Logo"
                className="w-full h-full object-cover rounded-lg sm:rounded-xl"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="min-w-0">
              <span className="font-black text-slate-950 text-xs sm:text-sm md:text-base tracking-tight block truncate">
                Akomoda Glosarium
              </span>
              <span className="text-[8px] sm:text-[9px] md:text-[10px] text-indigo-600 font-bold tracking-wide uppercase block truncate">
                akomodanetwork.com
              </span>
            </div>
          </button>

          {/* Navigation Bar with Anchor Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/80 p-1 rounded-2xl border border-slate-200/50 text-xs font-bold text-slate-600">
            <button
              onClick={() => handleNavAnchor("beranda")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                viewMode === "landing" ? "bg-white text-indigo-600 shadow-sm" : "hover:text-slate-900"
              }`}
            >
              <Home className="w-3.5 h-3.5 text-indigo-500" />
              <span>Beranda</span>
            </button>

            <button
              onClick={() => handleNavAnchor("pencarian", "search")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-white/80 hover:text-indigo-600 transition-all cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Pencarian</span>
            </button>

            <button
              onClick={() => handleNavAnchor("crawler", "crawler")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-white/80 hover:text-indigo-600 transition-all cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Crawler</span>
            </button>

            <button
              onClick={() => handleNavAnchor("glosarium", "glossary")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-white/80 hover:text-indigo-600 transition-all cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Glosarium</span>
            </button>

            <button
              onClick={() => handleNavAnchor("fitur", "seo")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-white/80 hover:text-indigo-600 transition-all cursor-pointer"
            >
              <Code className="w-3.5 h-3.5" />
              <span>SEO</span>
            </button>

            <button
              onClick={() => handleNavAnchor("web3", "web3")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-white/80 hover:text-indigo-600 transition-all cursor-pointer"
            >
              <Network className="w-3.5 h-3.5 text-amber-500" />
              <span>Web2.5</span>
            </button>

            <button
              onClick={() => handleNavAnchor("admin", "admin")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-all cursor-pointer border border-slate-800 shadow-sm"
              title="Dashboard Admin & Integrasi Google Sheets"
            >
              <Server className="w-3.5 h-3.5 text-emerald-400" />
              <span>Admin & Sheets</span>
            </button>

            <button
              onClick={() => handleNavAnchor("investor")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-white/80 hover:text-indigo-600 transition-all cursor-pointer"
            >
              <Briefcase className="w-3.5 h-3.5 text-indigo-500" />
              <span>Investor</span>
            </button>

            <button
              onClick={() => handleNavAnchor("mitra")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-white/80 hover:text-indigo-600 transition-all cursor-pointer"
            >
              <Award className="w-3.5 h-3.5 text-amber-500" />
              <span>Mitra</span>
            </button>
          </nav>

          {/* Quick System Badge & Support Button */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* View Mode Switcher Toggle */}
            <button
              onClick={() => setViewMode(viewMode === "landing" ? "terminal" : "landing")}
              className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-[10px] sm:text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-sm border border-slate-800"
              title="Ganti Mode Tampilan Beranda vs Single Terminal"
            >
              <Layout className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden md:inline">
                {viewMode === "landing" ? "Terminal View" : "Beranda Utama"}
              </span>
            </button>

            {/* AI Holistic Responsive Dropdown Menu */}
            <div className="relative">
              <button
                onClick={() => setShowKnowledgeMenu(!showKnowledgeMenu)}
                className="px-2 py-1.5 sm:px-3 sm:py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[10px] sm:text-xs rounded-xl transition-all flex items-center gap-1 cursor-pointer border border-slate-200/50"
                id="ai-holistic-dropdown-trigger"
              >
                <Globe className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-indigo-500" />
                <span className="hidden sm:inline">Holistic Hub</span>
                <ChevronDown className={`w-3 h-3 text-slate-500 transition-transform duration-200 ${showKnowledgeMenu ? "rotate-180" : ""}`} />
              </button>
              
              {showKnowledgeMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowKnowledgeMenu(false)} />
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl border border-slate-100 shadow-xl py-1.5 z-20 font-semibold text-xs text-slate-700 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-3.5 py-1 text-[10px] uppercase font-bold text-slate-400 tracking-wider">Artikel Utama</div>
                    <a
                      href="https://aiholistic.xyz/"
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between px-3.5 py-2 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                      onClick={() => setShowKnowledgeMenu(false)}
                      id="link-ai-holistic"
                    >
                      <span>AI Holistic</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </a>
                    <a
                      href="https://aiholistic.xyz/knowledge/"
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between px-3.5 py-2 hover:bg-slate-50 hover:text-indigo-600 transition-colors border-t border-slate-100/50"
                      onClick={() => setShowKnowledgeMenu(false)}
                      id="link-knowledge"
                    >
                      <span>Knowledge</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </a>
                    <a
                      href="https://aiholistic.xyz/knowledge/energi-yang-diperebutkan-semua-entitas.html"
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between px-3.5 py-2 hover:bg-slate-50 hover:text-indigo-600 transition-colors border-t border-slate-100/50"
                      onClick={() => setShowKnowledgeMenu(false)}
                      id="link-energi"
                    >
                      <span className="truncate pr-1">Energi</span>
                      <ExternalLink className="w-3 h-3 text-slate-400 shrink-0" />
                    </a>
                  </div>
                </>
              )}
            </div>

            <button
              onClick={() => setShowSupportModal(true)}
              className="px-2 py-1.5 sm:px-3 sm:py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-[10px] sm:text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-amber-500/10 hover:shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
            >
              <Heart className="w-3.5 h-3.5 fill-slate-950 stroke-slate-950 animate-pulse hidden xs:block" />
              <span>Donasi</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main stage */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Mobile & Sub-Header Responsive Quick Anchor Nav Bar */}
        <div className="lg:hidden mb-6 bg-white p-2 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
          {/* Header Row: Toggle Grid vs Horizontal Touch Row + Ke Atas Button */}
          <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-1.5">
            <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Layout className="w-3.5 h-3.5 text-indigo-600" />
              <span>Navigasi Cepat</span>
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 font-extrabold text-[11px] rounded-xl transition-all flex items-center gap-1 cursor-pointer border border-amber-500/30"
                title="Gulir Langsung ke Atas"
              >
                <ArrowUp className="w-3 h-3 text-amber-600 animate-bounce" />
                <span>Ke Atas</span>
              </button>
              <button
                onClick={() => setShowMobileNavGrid(!showMobileNavGrid)}
                className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-[11px] rounded-xl transition-all flex items-center gap-1 cursor-pointer border border-indigo-200/50"
              >
                <Grid className="w-3 h-3 text-indigo-600" />
                <span>{showMobileNavGrid ? "Baris" : "Grid"}</span>
              </button>
            </div>
          </div>

          {/* Conditional Layout: Full Grid vs Touch Swipe Row without ugly scrollbar */}
          {showMobileNavGrid ? (
            /* 2-3 Column Touch Grid for Easy Smartphone Access */
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-xs font-bold pt-1 animate-in fade-in duration-200">
              <button
                onClick={() => { handleNavAnchor("admin", "admin"); setShowMobileNavGrid(false); }}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-600 active:bg-emerald-700 text-white shadow-sm font-extrabold cursor-pointer min-h-[44px]"
              >
                <Server className="w-4 h-4 text-emerald-200 shrink-0" />
                <span className="truncate">Admin & Sheets</span>
              </button>
              <button
                onClick={() => { handleNavAnchor("beranda"); setShowMobileNavGrid(false); }}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900 active:bg-slate-800 text-white shadow-sm cursor-pointer min-h-[44px]"
              >
                <Home className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="truncate">Beranda</span>
              </button>
              <button
                onClick={() => { handleNavAnchor("pencarian", "search"); setShowMobileNavGrid(false); }}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-100 active:bg-slate-200 text-slate-800 cursor-pointer min-h-[44px]"
              >
                <Search className="w-4 h-4 text-indigo-600 shrink-0" />
                <span className="truncate">Pencarian</span>
              </button>
              <button
                onClick={() => { handleNavAnchor("crawler", "crawler"); setShowMobileNavGrid(false); }}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-100 active:bg-slate-200 text-slate-800 cursor-pointer min-h-[44px]"
              >
                <Sliders className="w-4 h-4 text-indigo-600 shrink-0" />
                <span className="truncate">Crawler</span>
              </button>
              <button
                onClick={() => { handleNavAnchor("glosarium", "glossary"); setShowMobileNavGrid(false); }}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-100 active:bg-slate-200 text-slate-800 cursor-pointer min-h-[44px]"
              >
                <BookOpen className="w-4 h-4 text-indigo-600 shrink-0" />
                <span className="truncate">Glosarium</span>
              </button>
              <button
                onClick={() => { handleNavAnchor("fitur", "seo"); setShowMobileNavGrid(false); }}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-100 active:bg-slate-200 text-slate-800 cursor-pointer min-h-[44px]"
              >
                <Code className="w-4 h-4 text-indigo-600 shrink-0" />
                <span className="truncate">SEO</span>
              </button>
              <button
                onClick={() => { handleNavAnchor("web3", "web3"); setShowMobileNavGrid(false); }}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-100 active:bg-slate-200 text-slate-800 cursor-pointer min-h-[44px]"
              >
                <Network className="w-4 h-4 text-amber-500 shrink-0" />
                <span className="truncate">Web2.5</span>
              </button>
              <button
                onClick={() => { handleNavAnchor("investor"); setShowMobileNavGrid(false); }}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-100 active:bg-slate-200 text-slate-800 cursor-pointer min-h-[44px]"
              >
                <Briefcase className="w-4 h-4 text-indigo-600 shrink-0" />
                <span className="truncate">Investor</span>
              </button>
              <button
                onClick={() => { handleNavAnchor("mitra"); setShowMobileNavGrid(false); }}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-100 active:bg-slate-200 text-slate-800 cursor-pointer min-h-[44px]"
              >
                <Award className="w-4 h-4 text-amber-500 shrink-0" />
                <span className="truncate">Mitra</span>
              </button>
            </div>
          ) : (
            /* Touch Swipe Row with Hidden Scrollbars (no-scrollbar utility) */
            <div className="overflow-x-auto no-scrollbar touch-pan-x whitespace-nowrap flex items-center gap-1.5 text-xs font-bold py-0.5">
              <button
                onClick={() => handleNavAnchor("admin", "admin")}
                className="flex items-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm font-extrabold cursor-pointer shrink-0 min-h-[38px]"
              >
                <Server className="w-3.5 h-3.5 text-emerald-200" />
                <span>Admin & Sheets</span>
              </button>
              <button
                onClick={() => handleNavAnchor("beranda")}
                className="flex items-center gap-1.5 py-2 px-3 rounded-xl bg-slate-900 text-white shadow-sm cursor-pointer shrink-0 min-h-[38px]"
              >
                <Home className="w-3.5 h-3.5 text-amber-400" />
                <span>Beranda</span>
              </button>
              <button
                onClick={() => handleNavAnchor("pencarian", "search")}
                className="flex items-center gap-1.5 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 cursor-pointer shrink-0 min-h-[38px]"
              >
                <Search className="w-3.5 h-3.5 text-indigo-600" />
                <span>Pencarian</span>
              </button>
              <button
                onClick={() => handleNavAnchor("crawler", "crawler")}
                className="flex items-center gap-1.5 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 cursor-pointer shrink-0 min-h-[38px]"
              >
                <Sliders className="w-3.5 h-3.5 text-indigo-600" />
                <span>Crawler</span>
              </button>
              <button
                onClick={() => handleNavAnchor("glosarium", "glossary")}
                className="flex items-center gap-1.5 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 cursor-pointer shrink-0 min-h-[38px]"
              >
                <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                <span>Glosarium</span>
              </button>
              <button
                onClick={() => handleNavAnchor("fitur", "seo")}
                className="flex items-center gap-1.5 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 cursor-pointer shrink-0 min-h-[38px]"
              >
                <Code className="w-3.5 h-3.5 text-indigo-600" />
                <span>SEO</span>
              </button>
              <button
                onClick={() => handleNavAnchor("web3", "web3")}
                className="flex items-center gap-1.5 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 cursor-pointer shrink-0 min-h-[38px]"
              >
                <Network className="w-3.5 h-3.5 text-amber-500" />
                <span>Web2.5</span>
              </button>
              <button
                onClick={() => handleNavAnchor("investor")}
                className="flex items-center gap-1.5 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 cursor-pointer shrink-0 min-h-[38px]"
              >
                <Briefcase className="w-3.5 h-3.5 text-indigo-600" />
                <span>Investor</span>
              </button>
              <button
                onClick={() => handleNavAnchor("mitra")}
                className="flex items-center gap-1.5 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 cursor-pointer shrink-0 min-h-[38px]"
              >
                <Award className="w-3.5 h-3.5 text-amber-500" />
                <span>Mitra</span>
              </button>
            </div>
          )}
        </div>

        {/* Content View: Main Landing Page vs Focused Terminal Mode */}
        {viewMode === "landing" ? (
          <MainLandingPage
            stats={stats}
            onRefreshStats={fetchStats}
            onOpenSupportModal={() => setShowSupportModal(true)}
            onOpenInvestorHub={() => setShowInvestorHub(true)}
          />
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              <div className="mb-4 flex items-center justify-between bg-white p-3 rounded-2xl border border-slate-200/80">
                <span className="text-xs font-bold text-slate-600 flex items-center gap-2">
                  <Layout className="w-4 h-4 text-indigo-600" />
                  <span>Mode Terminal Terfokus: <strong className="text-indigo-600 uppercase">{activeTab}</strong></span>
                </span>
                <button
                  onClick={() => setViewMode("landing")}
                  className="text-xs font-extrabold text-indigo-600 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Home className="w-3.5 h-3.5" />
                  <span>Kembali ke Beranda Utama</span>
                </button>
              </div>

              {activeTab === "search" && (
                <SearchPortal stats={stats} onRefreshStats={fetchStats} />
              )}
              {activeTab === "crawler" && (
                <CrawlerDashboard stats={stats} onRefreshStats={fetchStats} />
              )}
              {activeTab === "glossary" && (
                <GlossaryManager glossary={stats ? stats.glossary : []} onRefreshStats={fetchStats} />
              )}
              {activeTab === "seo" && (
                <SeoAuditPanel stats={stats} onRefreshStats={fetchStats} />
              )}
              {activeTab === "web3" && (
                <Web3Gateway stats={stats} onRefreshStats={fetchStats} />
              )}
              {activeTab === "admin" && (
                <AdminDashboard stats={stats} onRefreshStats={fetchStats} />
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-10 mt-16 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-indigo-400" />
              <span className="font-black text-white text-sm tracking-wide">
                Akomoda Glosarium Digital v2.0
              </span>
            </div>
            <p className="text-xs leading-relaxed text-slate-500">
              Modern web crawler dan semantic search engine berbasis AI yang dioptimalkan khusus untuk domain utama <span className="text-indigo-400 font-bold">akomodanetwork.com</span>. Menghapus ketergantungan PHP/MySQL monolithic tradisional dengan integrasi cloud serverless dan model cerdas Gemini.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">SEO XML & TXT Endpoints</h4>
            <div className="flex flex-col gap-2 font-mono text-[11px]">
              <a href="/sitemap.xml" className="hover:text-white flex items-center gap-1.5">
                <FileCode2 className="w-3.5 h-3.5 text-indigo-400" />
                <span>/sitemap.xml (Dinamis multibahasa)</span>
              </a>
              <a href="/robots.txt" className="hover:text-white flex items-center gap-1.5">
                <FileCode2 className="w-3.5 h-3.5 text-indigo-400" />
                <span>/robots.txt (Editable rules)</span>
              </a>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">Arsip Search Engine Tradisional</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Kami menghargai kontribusi sejarah Sphider.eu. Arsip pencarian tradisional dpt diakses di: <br />
              <a href="http://set.ee/archive/" target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline">
                http://set.ee/archive/
              </a>.
            </p>
          </div>
        </div>

        {/* High-Impact IT & Publisher Partner Profile Block */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          <div className="bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-950 border border-indigo-500/20 rounded-3xl p-6 md:p-8 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
            
            {/* Left: Partner Profile Card */}
            <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
              <div className="relative group shrink-0">
                <div className="absolute -inset-1.5 bg-gradient-to-r from-amber-500 to-indigo-500 rounded-full blur opacity-40 group-hover:opacity-60 transition duration-1000 animate-pulse" />
                <a href="https://gravatar.com/jimkoto" target="_blank" rel="noreferrer" className="relative block w-20 h-20 bg-slate-800 rounded-full overflow-hidden border-2 border-amber-400 shadow-md">
                  <img
                    src="https://www.gravatar.com/avatar/c1f6186b40366eb512b9d217cb3ca4a1?s=150"
                    alt="Jim Koto"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      // Fallback if no gravatar set
                      (e.currentTarget as HTMLImageElement).src = "https://www.gravatar.com/avatar/d89cf494541cb839b207eb300971b305?s=150";
                    }}
                  />
                </a>
              </div>
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <span className="font-black text-white text-lg tracking-tight">Jim Koto</span>
                  <div className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-amber-500/15 text-amber-400 rounded-full text-[10px] font-black uppercase tracking-wider border border-amber-500/20">
                    <Briefcase className="w-2.5 h-2.5" />
                    <span>IT & Publisher Partner</span>
                  </div>
                </div>
                
                {/* Verified Google Product Expert Badge */}
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <a
                    href="https://productexperts.withgoogle.com/profile"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg text-[10px] font-bold border border-blue-500/20 transition-all"
                  >
                    <Award className="w-3 h-3 text-blue-400" />
                    <span>Verified Google Product Expert</span>
                  </a>
                  <a
                    href="https://gravatar.com/jimkoto"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[10px] font-bold border border-slate-700 transition-all"
                  >
                    <span>Gravatar Verified</span>
                  </a>
                </div>

                <p className="text-slate-400 text-xs max-w-xl leading-relaxed">
                  Solopreneur, Spesialis Optimasi Extreme SEO, Arsitektur Web2.5 Hibrida, dan Integrasi Google Cloud Platform. Kami mengelola infrastruktur pencari digital ini secara profesional untuk mendukung skalabilitas ekosistem UKM global.
                </p>
              </div>
            </div>

            {/* Right: Quick Action Buttons */}
            <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-center gap-3 w-full lg:w-auto shrink-0 z-10">
              <a
                href="https://Jimkoto.my.id"
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto lg:w-full xl:w-auto bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-5 py-3 rounded-2xl text-xs uppercase tracking-wider shadow-lg shadow-amber-500/10 hover:shadow-amber-500/20 hover:scale-[1.03] transition-all text-center cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Kunjungi JimKoto.my.id</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://productexperts.withgoogle.com/profile"
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto lg:w-full xl:w-auto bg-slate-850 hover:bg-slate-800 text-indigo-300 border border-indigo-500/30 font-black px-5 py-3 rounded-2xl text-xs uppercase tracking-wider hover:scale-[1.03] transition-all text-center cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Google Profile</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pt-6 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left text-xs text-slate-600">
          <p>© {new Date().getFullYear()} Holistic Digital Glosarium Pencari Mandiri. Dioptimalkan untuk Extreme SEO dan AI Semantic Web.</p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-slate-500 font-semibold">
            <button onClick={() => setFooterModal("tos")} className="hover:text-indigo-400 transition-colors cursor-pointer">Ketentuan Layanan (ToS)</button>
            <span>•</span>
            <button onClick={() => setFooterModal("privacy")} className="hover:text-indigo-400 transition-colors cursor-pointer">Kebijakan Privasi</button>
            <span>•</span>
            <button onClick={() => setFooterModal("disclaimer")} className="hover:text-indigo-400 transition-colors cursor-pointer">Sanggahan</button>
            <span>•</span>
            <button onClick={() => setFooterModal("cookies")} className="hover:text-indigo-400 transition-colors cursor-pointer">Kebijakan Cookie</button>
          </div>
        </div>
      </footer>

      {/* Floating Back to Top Button - Responsive for Smartphones, Tablets & Desktop */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-50 bg-slate-900/95 hover:bg-indigo-600 active:bg-indigo-700 text-white px-3.5 py-3 sm:px-4 sm:py-3.5 rounded-full shadow-2xl hover:scale-105 active:scale-90 transition-all flex items-center justify-center gap-1.5 border-2 border-amber-400/60 backdrop-blur-md cursor-pointer group min-h-[48px]"
            title="Kembali ke Atas"
          >
            <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 group-hover:text-white transition-colors animate-bounce shrink-0" />
            <span className="text-xs font-black tracking-wider uppercase pr-1 text-amber-300 group-hover:text-white">Ke Atas</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Compliance Policies Modal overlay */}
      <AnimatePresence>
        {footerModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-100 overflow-hidden relative"
            >
              {/* Close Button */}
              <button
                onClick={() => setFooterModal(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
              >
                <HelpCircle className="w-5 h-5 rotate-180" />
              </button>

              <div className="space-y-4 text-left">
                {/* Header Icon & Title */}
                <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                  <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900 tracking-tight">
                      {footerModal === "tos" && "Ketentuan Layanan (Terms of Service)"}
                      {footerModal === "privacy" && "Kebijakan Privasi (Privacy Policy)"}
                      {footerModal === "disclaimer" && "Sanggahan Medis & Informasi (Disclaimer)"}
                      {footerModal === "cookies" && "Kebijakan Cookie (Cookies Policy)"}
                    </h3>
                    <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
                      Ditinjau Terakhir: Juli 2026 • Kepatuhan Web2.5 & AI
                    </p>
                  </div>
                </div>

                {/* Content body with scrolling if needed */}
                <div className="max-h-96 overflow-y-auto text-xs text-slate-600 space-y-4 pr-2 leading-relaxed">
                  {footerModal === "tos" && (
                    <>
                      <p className="font-semibold text-slate-800">1. Penerimaan Ketentuan</p>
                      <p>
                        Dengan menggunakan platform **Holistic Digital Glosarium**, Anda menyetujui Ketentuan Layanan ini. Sistem ini menyediakan indeks digital multibahasa (Indonesia, Inggris, Arab, Jerman) yang ditenagai oleh kecerdasan buatan Gemini dan crawler SEO ekstrim.
                      </p>
                      <p className="font-semibold text-slate-800">2. Jatah Kuota & Tambahan Biaya Langganan</p>
                      <p>
                        Setiap pengunjung mendapatkan kuota 5 pencarian gratis secara default. Jika kuota Anda habis atau Anda mencari istilah baru yang memerlukan alokasi komputasi premium, Anda dapat menambah jatah kuota atau membeli paket **Unlimited Web2.5** menggunakan sistem gerbang pembayaran hibrida kami (Kartu Kredit Fiat, Stellar Lumens XLM, atau dompet Pi Network).
                      </p>
                      <p className="font-semibold text-slate-800">3. Aturan Penggunaan Platform</p>
                      <p>
                        Pengguna dilarang keras melakukan aktivitas perusakan seperti serangan penolakan layanan (DDoS), eksploitasi celah keamanan, pengindeksan data secara masif tanpa izin, atau upaya manipulasi koin blockchain on-chain.
                      </p>
                    </>
                  )}

                  {footerModal === "privacy" && (
                    <>
                      <p className="font-semibold text-slate-800">1. Pengumpulan Informasi Anonim</p>
                      <p>
                        Kami berkomitmen penuh untuk melindungi kerahasiaan data pencarian Anda. Kami tidak mengumpulkan data pribadi sensitif seperti nama asli, alamat rumah, atau alamat IP pengunjung. Riwayat kueri pencarian dicatat secara anonim murni untuk meningkatkan kualitas deteksi bahasa AI Gemini.
                      </p>
                      <p className="font-semibold text-slate-800">2. Keamanan Pembayaran On-Chain</p>
                      <p>
                        Transaksi gerbang pembayaran Web2.5 (menggunakan mata uang crypto seperti XLM dan Pi) diproses langsung secara on-chain di blockchain masing-masing. Kami tidak memiliki kendali atas kunci privat Anda dan tidak pernah menyimpan detail wallet Anda di server kami.
                      </p>
                      <p className="font-semibold text-slate-800">3. API Pihak Ketiga</p>
                      <p>
                        Aplikasi ini menggunakan Google Translate API dan model AI Gemini secara server-side. Data kueri yang dikirimkan ke API tersebut aman dan dienkripsi selama transit demi privasi maksimal.
                      </p>
                    </>
                  )}

                  {footerModal === "disclaimer" && (
                    <>
                      <p className="font-semibold text-slate-800">1. Edukasi Istilah Holistik & AI</p>
                      <p>
                        Glosarium ini mengintegrasikan terminologi mutakhir seputar Kecerdasan Buatan (AI), Web3, dan Terapi Kesehatan Holistik (misalnya biofeedback, meditasi, dan frekuensi gelombang otak). Seluruh definisi dan sintesis data yang disajikan murni bertujuan untuk sarana edukasi ilmiah dan referensi umum.
                      </p>
                      <p className="font-semibold text-slate-800">2. Bukan Nasihat Medis Profesional</p>
                      <p className="text-red-600 font-semibold bg-red-50 p-3 rounded-xl border border-red-100">
                        PENTING: Informasi kesehatan holistik di platform ini tidak dapat menggantikan diagnosis medis, saran perawatan, atau terapi dari dokter profesional berlisensi. Jangan pernah mengabaikan nasihat medis profesional karena sesuatu yang Anda baca di glosarium ini.
                      </p>
                      <p className="font-semibold text-slate-800">3. Akurasi Terjemahan Otomatis</p>
                      <p>
                        Terjemahan dinamis selain bahasa default (Indonesia, Inggris, Arab, Jerman) didukung secara eksternal oleh Google Translate API. Walau teknologi ini sangat canggih, deviasi nuansa bahasa bisa terjadi dan kami tidak bertanggung jawab atas kerugian kontekstual yang ditimbulkannya.
                      </p>
                    </>
                  )}

                  {footerModal === "cookies" && (
                    <>
                      <p className="font-semibold text-slate-800">1. Penggunaan Cookie & Penyimpanan Klien</p>
                      <p>
                        Kami menggunakan `localStorage` browser lokal dan cookie minimal untuk menyimpan preferensi bahasa UI Anda (IND, ENG, AR, DEU), sisa saldo kuota gratis Anda, serta status keanggotaan Premium Unlimited Anda.
                      </p>
                      <p className="font-semibold text-slate-800">2. Pengalaman Pengguna Berkinerja Tinggi</p>
                      <p>
                        Penyimpanan cookie lokal ini menjamin platform memuat kueri secara instan (**Fast-Loading**) tanpa harus menunggu sinkronisasi database eksternal yang lambat pada setiap klik tombol.
                      </p>
                      <p className="font-semibold text-slate-800">3. Pengendalian Cookie</p>
                      <p>
                        Anda dapat memilih untuk mematikan atau menghapus data cookie dan LocalStorage ini melalui menu pengaturan browser Anda sewaktu-waktu. Harap dicatat bahwa menghapus data browser akan mengatur ulang jatah kuota gratis Anda ke nilai default sesi.
                      </p>
                    </>
                  )}
                </div>

                {/* Accept Button */}
                <div className="pt-3 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={() => setFooterModal(null)}
                    className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
                  >
                    Saya Mengerti & Setuju
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Support & Web3 Donation Modal */}
      <AnimatePresence>
        {showSupportModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 text-white rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-2xl relative"
            >
              {/* Close Button */}
              <button
                onClick={() => setShowSupportModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 bg-slate-800 hover:bg-slate-700 rounded-full transition-colors cursor-pointer"
              >
                <HelpCircle className="w-5 h-5 rotate-180" />
              </button>

              <div className="space-y-6 text-left">
                {/* Header */}
                <div className="flex items-center gap-3.5 pb-4 border-b border-slate-800">
                  <div className="p-3 bg-amber-500/10 text-amber-400 rounded-2xl border border-amber-500/20">
                    <Heart className="w-6 h-6 fill-amber-400/20 stroke-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
                      Dukung Ekosistem & Gateway Web3
                    </h3>
                    <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mt-0.5">
                      Sinergi Akomoda Network & Jim Koto Pro
                    </p>
                  </div>
                </div>

                <p className="text-slate-300 text-xs leading-relaxed">
                  Platform <strong>Glosarium Hidup</strong> ini menggunakan sistem auto-generasi cerdas (AGC) berbasis AI yang disinergikan dengan Cloudflare Workers, Google Sheets, dan Google Translate API. Dukungan sukarela Anda sangat penting untuk memastikan server tetap aktif berkinerja tinggi, bebas iklan, serta terus melayani para pencari makna secara gratis.
                </p>

                {/* Donation Channels Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Fiat Money channel */}
                  <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider">
                      <Wallet className="w-4 h-4" />
                      <span>1. Donasi Fiat (Rupiah IDR)</span>
                    </div>
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      Mendukung transfer antar bank lokal Indonesia atau sistem pembayaran e-wallet digital instan:
                    </p>
                    <div className="bg-slate-900 border border-slate-800/60 rounded-xl p-3 space-y-2 text-xs">
                      <div>
                        <span className="text-slate-500 font-mono block text-[10px] uppercase">Bank Transfer</span>
                        <span className="font-bold text-slate-200">Bank Jago / Bank Central Asia</span>
                        <span className="text-amber-300 font-mono block mt-0.5">Rek: [Silakan hubungi admin di Jim Koto Pro]</span>
                      </div>
                      <div className="pt-2 border-t border-slate-800/40">
                        <span className="text-slate-500 font-mono block text-[10px] uppercase">E-Wallet Indonesia</span>
                        <span className="font-bold text-slate-200">QRIS / Gopay / OVO / Dana</span>
                        <span className="text-emerald-400 font-semibold block mt-0.5">Tersedia via gateway pembayaran</span>
                      </div>
                    </div>
                  </div>

                  {/* Crypto Currency Channel */}
                  <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                      <Coins className="w-4 h-4" />
                      <span>2. Donasi Crypto (Web3 Layer-1)</span>
                    </div>
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      Kami mendukung sirkulasi aset on-chain lintas blockchain dan token Web3 utama secara desentralisasi:
                    </p>
                    <div className="bg-slate-900 border border-slate-800/60 rounded-xl p-3 space-y-2 text-[11px] font-mono">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-300 font-bold">Pi Network (Pi):</span>
                        <span className="text-amber-400 text-[10px]">Via Akomoda Gate</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-300 font-bold">Stellar (XLM):</span>
                        <span className="text-indigo-300 text-[10px]">GD3Y...XLM</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-300 font-bold">NEAR / SUI / SOL:</span>
                        <span className="text-slate-400 text-[10px]">jimkoto.near</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-300 font-bold">XEN Network / ETH:</span>
                        <span className="text-purple-300 text-[10px]">0x71...XEN</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Direct Contact Channels: Email & Telegram */}
                <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Mail className="w-4 h-4 text-indigo-400" />
                      <span>Kontak Langsung Official (Email & Telegram)</span>
                    </span>
                    <span className="text-[10px] font-bold bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-800/50">
                      Aktif Respon
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <a
                      href="mailto:support@akomodanetwork.com"
                      className="p-2.5 bg-slate-900 hover:bg-slate-800/80 rounded-xl border border-slate-800 flex items-center gap-2 text-slate-200 transition-colors"
                    >
                      <Mail className="w-4 h-4 text-indigo-400 shrink-0" />
                      <div className="truncate">
                        <span className="block text-[10px] text-slate-500 font-mono">Email Utama</span>
                        <span className="font-bold text-xs">support@akomodanetwork.com</span>
                      </div>
                    </a>

                    <a
                      href="https://t.me/jimkoto"
                      target="_blank"
                      rel="noreferrer"
                      className="p-2.5 bg-slate-900 hover:bg-slate-800/80 rounded-xl border border-slate-800 flex items-center gap-2 text-slate-200 transition-colors"
                    >
                      <Send className="w-4 h-4 text-sky-400 shrink-0" />
                      <div className="truncate">
                        <span className="block text-[10px] text-slate-500 font-mono">Telegram Official</span>
                        <span className="font-bold text-xs">@jimkoto</span>
                      </div>
                    </a>
                  </div>
                </div>

                {/* Gateway Integration Notice */}
                <div className="bg-gradient-to-r from-indigo-950/30 to-emerald-950/30 border border-indigo-500/25 rounded-2xl p-4 text-xs space-y-2">
                  <h4 className="font-bold text-white flex items-center gap-1.5 text-xs">
                    <Network className="w-4 h-4 text-emerald-400 animate-pulse" />
                    <span>Sinergi Gateway Akomoda & Web3</span>
                  </h4>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Penggunaan cryptocurrency (Pi Coin, Stellar XLM, XEN) terintegrasi erat dengan portal infrastruktur pembayaran digital kami di <a href="https://gate.akomodanetwork.com" target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline inline-flex items-center gap-0.5 font-bold">gate.akomodanetwork.com <ExternalLink className="w-3 h-3" /></a>, membuka gerbang nyata transaksi Web2.5 hibrida pertama di kelasnya.
                  </p>
                </div>

                {/* Bottom CTA to jimkoto.my.id/pro & Email/Telegram */}
                <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-center sm:text-left">
                    <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Layanan Kemitraan Profesional</p>
                    <p className="text-slate-200 text-xs font-semibold">Butuh integrasi API kustom atau Joint-Venture?</p>
                  </div>
                  <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => setShowSupportModal(false)}
                      className="flex-1 sm:flex-initial px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs transition-colors cursor-pointer text-center"
                    >
                      Tutup
                    </button>
                    <a
                      href="mailto:support@akomodanetwork.com"
                      className="flex-1 sm:flex-initial px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs transition-all hover:scale-105 cursor-pointer text-center flex items-center justify-center gap-1.5"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Email Us</span>
                    </a>
                    <a
                      href="https://t.me/jimkoto"
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 sm:flex-initial px-4 py-2.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-black rounded-xl text-xs transition-all hover:scale-105 cursor-pointer text-center flex items-center justify-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Telegram</span>
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Investor Hub & Executive Proposal Modal */}
        {showInvestorHub && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white text-slate-800 rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl border border-indigo-100 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900 tracking-tight">
                      Proposal Kerjasama & Executive Investor Deck
                    </h3>
                    <p className="text-xs font-semibold text-indigo-600">
                      Akomoda Glosarium Digital • Platform AI, SEO & Web2.5
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowInvestorHub(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="mt-6 space-y-6 text-sm text-slate-600 leading-relaxed">
                {/* Executive Summary */}
                <div className="bg-gradient-to-r from-indigo-50 to-amber-50/50 p-5 rounded-2xl border border-indigo-100/80 space-y-2">
                  <h4 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                    <Award className="w-5 h-5 text-indigo-600" />
                    <span>Ringkasan Eksekutif & Value Proposition</span>
                  </h4>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    <strong>Akomoda Glosarium Digital</strong> (kata.jimkoto.my.id) adalah ekosistem glosarium multibahasa generasi baru yang menggabungkan <strong>Kecerdasan Buatan (Gemini AI)</strong>, <strong>Mesin Perayap Web Otomatis (Web Crawler)</strong>, <strong>SEO Schema Automation (JSON-LD)</strong>, dan <strong>Gerbang Pembayaran Web2.5 (Fiat & Crypto)</strong>. Platform ini didesain untuk menjadi rujukan utama istilah teknologi modern dan kesehatan holistik.
                  </p>
                </div>

                {/* Detail 5 Tab Utama */}
                <div className="space-y-4">
                  <h4 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider text-indigo-600">
                    Mekanisme Kerja & Fungsi 5 Tab Utama
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60 space-y-1.5">
                      <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                        <Search className="w-4 h-4 text-indigo-600" />
                        <span>1. Search Terminal</span>
                      </div>
                      <p className="text-xs text-slate-600">
                        Pencarian semantik cerdas 4 bahasa (ID, EN, AR, DE). Memadukan database lokal, web indexing, serta analisis kecerdasan buatan Gemini AI dengan generator SEO Schema otomatis.
                      </p>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60 space-y-1.5">
                      <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                        <Sliders className="w-4 h-4 text-indigo-600" />
                        <span>2. Crawler Console</span>
                      </div>
                      <p className="text-xs text-slate-600">
                        Mesin perayap web otomatis yang mengekstraksi konten dari URL target, menghitung skor kesehatan SEO, serta mengelompokkan kata kunci baru ke dalam glosarium.
                      </p>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60 space-y-1.5">
                      <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                        <BookOpen className="w-4 h-4 text-indigo-600" />
                        <span>3. Kelola Glosarium</span>
                      </div>
                      <p className="text-xs text-slate-600">
                        CMS Manajemen Konten glosarium untuk menambah, mengedit, dan mengekspor entri data istilah. Terintegrasi dengan Google Sheets & Cloudflare Worker.
                      </p>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60 space-y-1.5">
                      <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                        <Code className="w-4 h-4 text-indigo-600" />
                        <span>4. Extreme SEO</span>
                      </div>
                      <p className="text-xs text-slate-600">
                        Panel otomatisasi file `sitemap.xml`, `robots.txt`, serta audit meta-tag halaman agar website mudah mendominasi peringkat teratas Google Search.
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60 space-y-1.5">
                    <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                      <Network className="w-4 h-4 text-indigo-600" />
                      <span>5. Gateway Web2.5 (Monetisasi & Web3)</span>
                    </div>
                    <p className="text-xs text-slate-600">
                      Infrastruktur transaksi hibrida yang menjembatani mata uang Fiat (QRIS, E-Wallet, Transfer Bank) dengan aset Web3 (Stellar XLM, Pi Network, XEN Fair Mint).
                    </p>
                  </div>
                </div>

                {/* Model Bisnis & Revenue */}
                <div className="bg-slate-900 text-white p-5 rounded-2xl space-y-3">
                  <h4 className="font-extrabold text-amber-400 text-xs uppercase tracking-wider">
                    Model Bisnis & Aliran Pendapatan (Revenue Streams)
                  </h4>
                  <ul className="text-xs space-y-2 text-slate-300">
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span><strong>SaaS Kuota AI Premium:</strong> Pembelian jatah pencarian ($2.99 / 50 query atau $9.99 / unlimited) via Midtrans/Xendit/Stripe.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span><strong>Lisensi API Glosarium:</strong> Perusahaan atau kampus dapat berlangganan data glosarium istilah via REST API.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span><strong>Mikro-transaksi Web3:</strong> Dukungan donasi dan pemrosesan transaksi berbasis Pi Network, Stellar XLM, dan XEN Token.</span>
                    </li>
                  </ul>
                </div>

                {/* Folder Dokumen & SOP Akses Langsung */}
                <div className="bg-indigo-50/70 p-5 rounded-2xl border border-indigo-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-indigo-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-indigo-600" />
                      <span>Folder Dokumen Resmi & SOP Operasional (Folder: /documents)</span>
                    </h4>
                    <span className="text-[10px] font-bold bg-indigo-200/60 text-indigo-800 px-2 py-0.5 rounded-full">
                      8 Dokumen Siap Unduh
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                    <a
                      href="/documents/PROPOSAL_INVESTOR_EXECUTIVE.md"
                      target="_blank"
                      rel="noreferrer"
                      className="p-3 bg-white hover:bg-indigo-50/50 rounded-xl border border-indigo-100 flex items-center justify-between group transition-all"
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        <FileText className="w-4 h-4 text-indigo-600 shrink-0" />
                        <span className="font-semibold text-slate-800 truncate">1. Proposal Investasi Eksekutif</span>
                      </div>
                      <Download className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 shrink-0 transition-colors" />
                    </a>

                    <a
                      href="/documents/STRATEGI_KAMPANYE_DAN_PEMASARAN_B2B.md"
                      target="_blank"
                      rel="noreferrer"
                      className="p-3 bg-white hover:bg-indigo-50/50 rounded-xl border border-indigo-100 flex items-center justify-between group transition-all"
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        <FileText className="w-4 h-4 text-amber-600 shrink-0" />
                        <span className="font-semibold text-slate-800 truncate">2. Strategi Kampanye & Diskon B2B</span>
                      </div>
                      <Download className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 shrink-0 transition-colors" />
                    </a>

                    <a
                      href="/documents/PANDUAN_PENDAFTARAN_GOOGLE_SEARCH_CONSOLE.md"
                      target="_blank"
                      rel="noreferrer"
                      className="p-3 bg-white hover:bg-indigo-50/50 rounded-xl border border-indigo-100 flex items-center justify-between group transition-all"
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="font-semibold text-slate-800 truncate">3. Panduan Google Search Console</span>
                      </div>
                      <Download className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 shrink-0 transition-colors" />
                    </a>

                    <a
                      href="/documents/PANDUAN_INTEGRASI_GOOGLE_TRACKING_DAN_PUBLISHER.md"
                      target="_blank"
                      rel="noreferrer"
                      className="p-3 bg-white hover:bg-indigo-50/50 rounded-xl border border-indigo-100 flex items-center justify-between group transition-all"
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                        <span className="font-semibold text-slate-800 truncate">4. Integrasi GA4, AdSense & Publisher</span>
                      </div>
                      <Download className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 shrink-0 transition-colors" />
                    </a>

                    <a
                      href="/documents/SOP_OPERASIONAL_CRAWLER_GLOSARIUM.md"
                      target="_blank"
                      rel="noreferrer"
                      className="p-3 bg-white hover:bg-indigo-50/50 rounded-xl border border-indigo-100 flex items-center justify-between group transition-all"
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        <FileText className="w-4 h-4 text-indigo-600 shrink-0" />
                        <span className="font-semibold text-slate-800 truncate">5. SOP Crawler & Gemini AI</span>
                      </div>
                      <Download className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 shrink-0 transition-colors" />
                    </a>

                    <a
                      href="/documents/SOP_PEMBAYARAN_DAN_MONETISASI_WEB25.md"
                      target="_blank"
                      rel="noreferrer"
                      className="p-3 bg-white hover:bg-indigo-50/50 rounded-xl border border-indigo-100 flex items-center justify-between group transition-all"
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        <FileText className="w-4 h-4 text-indigo-600 shrink-0" />
                        <span className="font-semibold text-slate-800 truncate">6. SOP Gateway Web2.5 & Fiat</span>
                      </div>
                      <Download className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 shrink-0 transition-colors" />
                    </a>

                    <a
                      href="/documents/PANDUAN_KEMITRAAN_DAN_STAKEHOLDER.md"
                      target="_blank"
                      rel="noreferrer"
                      className="p-3 bg-white hover:bg-indigo-50/50 rounded-xl border border-indigo-100 flex items-center justify-between group transition-all"
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        <FileText className="w-4 h-4 text-indigo-600 shrink-0" />
                        <span className="font-semibold text-slate-800 truncate">7. Panduan Kemitraan Kampus/Sponsor</span>
                      </div>
                      <Download className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 shrink-0 transition-colors" />
                    </a>

                    <a
                      href="/documents/SOP_MIGRASI_FAILOVER_CLOUD_RUN_CLOUDFLARE.md"
                      target="_blank"
                      rel="noreferrer"
                      className="p-3 bg-red-50/60 hover:bg-red-100/50 rounded-xl border border-red-200 flex items-center justify-between group transition-all"
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        <FileText className="w-4 h-4 text-red-600 shrink-0" />
                        <span className="font-semibold text-red-900 truncate">8. SOP Krisis Server Down & Failover</span>
                      </div>
                      <Download className="w-3.5 h-3.5 text-red-400 group-hover:text-red-600 shrink-0 transition-colors" />
                    </a>
                  </div>
                </div>

                {/* CTA Kontak & Closing */}
                <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-xs text-slate-500">
                    <p className="font-bold text-slate-800">Siap Bekerjasama / Pendanaan?</p>
                    <p>Hubungi tim pengembangan resmi di Jim Koto Pro.</p>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => setShowInvestorHub(false)}
                      className="flex-1 sm:flex-initial px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                    >
                      Tutup
                    </button>
                    <a
                      href="https://jimkoto.my.id/pro"
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 sm:flex-initial px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition-all hover:shadow-lg hover:shadow-indigo-500/20 cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <span>Kontak Investor</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
