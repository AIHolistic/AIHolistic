import React from "react";
import { Search, Sliders, BookOpen, Globe, Award, HelpCircle, Code, Network, Briefcase, Heart, Coins, Wallet, ExternalLink, ChevronDown, FileText, Download, CheckCircle2, Zap, Database, ArrowRight, ShieldCheck, Sparkles, Cpu, Mail, Send } from "lucide-react";
import { motion } from "motion/react";
import SearchPortal from "./SearchPortal";
import CrawlerDashboard from "./CrawlerDashboard";
import GlossaryManager from "./GlossaryManager";
import SeoAuditPanel from "./SeoAuditPanel";
import Web3Gateway from "./Web3Gateway";
import AdminDashboard from "./AdminDashboard";
import PricelistModule from "./PricelistModule";
import { SystemStats } from "../types";

interface MainLandingPageProps {
  stats: SystemStats | null;
  onRefreshStats: () => void;
  onOpenSupportModal: () => void;
  onOpenInvestorHub: () => void;
}

export default function MainLandingPage({
  stats,
  onRefreshStats,
  onOpenSupportModal,
  onOpenInvestorHub,
}: MainLandingPageProps) {

  const scrollToContainer = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="space-y-16 pb-12">
      {/* KONTAINER 1: BERANDA (HERO SECTION & OVERVIEW) */}
      <section id="beranda" className="scroll-mt-24">
        <div className="relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 text-white p-6 sm:p-10 md:p-12 shadow-2xl">
          {/* Subtle Ambient Lighting Effects */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
            {/* Domain Apex Badge */}
            <div className="inline-flex flex-wrap items-center justify-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Official Apex Domain:</span>
              <span className="text-white font-mono font-black">akomodanetwork.com</span>
              <span className="text-slate-500">|</span>
              <span>Connect:</span>
              <span className="text-amber-300 font-mono font-black">kata.jimkoto.my.id</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-tight">
              Akomoda Glosarium Digital <br />
              <span className="bg-gradient-to-r from-indigo-400 via-amber-300 to-indigo-200 bg-clip-text text-transparent">
                & Mesin Pencari AI Multibahasa
              </span>
            </h1>

            {/* Description */}
            <p className="text-sm sm:text-base md:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Sistem crawler web mandiri, mesin pencari semantik cerdas berbasis <strong className="text-white">Gemini AI</strong>, dan portal glosarium 4 bahasa (Indonesia, Inggris, Arab, Jerman). Diarsitekturi khusus untuk efisiensi komputasi, Extreme SEO Schema, dan integrasi Web2.5.
            </p>

            {/* CTA Anchor Nav Buttons */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => scrollToContainer("pencarian")}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-indigo-600/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Search className="w-4 h-4" />
                <span>Cari Istilah (#pencarian)</span>
              </button>

              <button
                onClick={() => scrollToContainer("crawler")}
                className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs uppercase tracking-wider rounded-2xl border border-slate-700 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Sliders className="w-4 h-4 text-indigo-400" />
                <span>Buka Crawler (#crawler)</span>
              </button>

              <button
                onClick={() => scrollToContainer("glosarium")}
                className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs uppercase tracking-wider rounded-2xl border border-slate-700 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-amber-400" />
                <span>Kelola Glosarium (#glosarium)</span>
              </button>

              <a
                href="/documents/SOP_MIGRASI_FAILOVER_CLOUD_RUN_CLOUDFLARE.md"
                target="_blank"
                rel="noreferrer"
                className="px-5 py-3 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold text-xs rounded-2xl transition-all flex items-center gap-2 cursor-pointer"
              >
                <FileText className="w-4 h-4 text-amber-400" />
                <span>Dokumen SOP Cloudflare</span>
              </a>
            </div>

            {/* Quick Live Stats Matrix */}
            <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
              <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                  <Database className="w-3 h-3 text-indigo-400" />
                  <span>Total Istilah</span>
                </div>
                <div className="text-xl sm:text-2xl font-black text-white mt-1">
                  {stats ? (stats.glossary ? stats.glossary.length : stats.totalIndexedTerms) : "40+"}
                </div>
                <div className="text-[10px] text-emerald-400 font-medium">Synced with Gemini</div>
              </div>

              <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                  <Globe className="w-3 h-3 text-amber-400" />
                  <span>URL Terindeks</span>
                </div>
                <div className="text-xl sm:text-2xl font-black text-white mt-1">
                  {stats ? stats.totalPagesCrawled : "120+"}
                </div>
                <div className="text-[10px] text-indigo-300 font-medium">Automatic Crawler</div>
              </div>

              <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                  <Zap className="w-3 h-3 text-amber-300" />
                  <span>Latency Respon</span>
                </div>
                <div className="text-xl sm:text-2xl font-black text-emerald-400 mt-1">
                  &lt; 75 ms
                </div>
                <div className="text-[10px] text-slate-400 font-medium">Cloud Run Serverless</div>
              </div>

              <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>Extreme SEO</span>
                </div>
                <div className="text-xl sm:text-2xl font-black text-amber-300 mt-1">
                  100%
                </div>
                <div className="text-[10px] text-slate-400 font-medium">JSON-LD & Sitemap</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* KONTAINER 2: MESIN PENCARI (SEARCH PORTAL) */}
      <section id="pencarian" className="scroll-mt-24 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600 text-white rounded-2xl shadow-md shadow-indigo-600/20">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
                Kontainer Mesin Pencari AI (#pencarian)
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Pencarian semantik instant dengan filter sumber data dan dukungan AI Gemini
              </p>
            </div>
          </div>
          <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
            Container Live
          </span>
        </div>

        <SearchPortal stats={stats} onRefreshStats={onRefreshStats} />
      </section>

      {/* KONTAINER 3: CRAWLER WEB CONSOLE */}
      <section id="crawler" className="scroll-mt-24 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-slate-900 text-amber-400 rounded-2xl shadow-md">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
                Kontainer Crawler Web Otomatis (#crawler)
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Pindai halaman web secara langsung, ekstrak metadata SEO, dan masukkan ke indeks
              </p>
            </div>
          </div>
          <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
            Crawler Engine Active
          </span>
        </div>

        <CrawlerDashboard stats={stats} onRefreshStats={onRefreshStats} />
      </section>

      {/* KONTAINER 4: KELOLA GLOSARIUM DIGITAL */}
      <section id="glosarium" className="scroll-mt-24 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-600 text-white rounded-2xl shadow-md shadow-emerald-600/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
                Kontainer Kelola Glosarium 4 Bahasa (#glosarium)
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Manajemen data glosarium istilah (Indonesia, Inggris, Arab, Jerman) berbasis AI Gemini
              </p>
            </div>
          </div>
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Multilingual Matrix
          </span>
        </div>

        <GlossaryManager
          glossary={stats ? stats.glossary : []}
          onRefreshStats={onRefreshStats}
        />
      </section>

      {/* KONTAINER 5: ARSITEKTUR & EXTREME SEO PANEL */}
      <section id="fitur" className="scroll-mt-24 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-purple-600 text-white rounded-2xl shadow-md shadow-purple-600/20">
              <Code className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
                Kontainer Extreme SEO & Arsitektur System (#fitur)
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Analisis schema JSON-LD, kustomisasi sitemap.xml, robots.txt, dan audit indeks Google
              </p>
            </div>
          </div>
          <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
            Schema.org Standard
          </span>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Sintesis AI Gemini 2.5</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Kueri yang tidak ditemukan di indeks lokal otomatis disintesis secara real-time oleh model cerdas Gemini lengkap dengan terjemahan 4 bahasa.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Extreme SEO Optimization</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Menghasilkan microdata JSON-LD (DefinedTermSet & DefinedTerm) secara otomatis agar terindeks sempurna di Google Search Console.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Cpu className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Infrastruktur Failover Cloud</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Dukungan integrasi Cloudflare Workers & Cloud Run serverless menjamin ketersediaan tinggi (High Availability) tanpa jeda downtime.
            </p>
          </div>
        </div>

        <SeoAuditPanel stats={stats} onRefreshStats={onRefreshStats} />
      </section>

      {/* KONTAINER 6: GATEWAY WEB2.5 & TRANSACTION ENGINE */}
      <section id="web3" className="scroll-mt-24 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-900 text-amber-300 rounded-2xl shadow-md">
              <Network className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
                Kontainer Gateway Web2.5 & Transaksi (#web3)
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Simulasi transaksi koin Web3 (Pi Network, Stellar XLM, XEN) dan Rupiah IDR
              </p>
            </div>
          </div>
          <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            Pi & Stellar Supported
          </span>
        </div>

        <Web3Gateway stats={stats} onRefreshStats={onRefreshStats} />
      </section>

      {/* KONTAINER ADMIN: DASHBOARD ADMIN & INTEGRASI GOOGLE SHEETS */}
      <section id="admin" className="scroll-mt-24 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-slate-900 text-indigo-400 rounded-2xl shadow-md border border-slate-800">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
                Kontainer Dashboard Admin & Google Sheets (#admin)
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Sistem manajemen terproteksi PIN/Password, editor spreadsheet live, dan sinkronisasi Google Sheets
              </p>
            </div>
          </div>
          <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
            PIN Protected
          </span>
        </div>

        <AdminDashboard stats={stats} onRefreshStats={onRefreshStats} />
      </section>

      {/* KONTAINER 7: INVESTOR DECK & PROPOSAL KERJASAMA */}
      <section id="investor" className="scroll-mt-24 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500 text-slate-950 rounded-2xl shadow-md shadow-amber-500/20">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
                Kontainer Proposal Kerjasama & Investor Deck (#investor)
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Peluang ekspansi ekosistem Akomoda Network & model monetisasi SaaS Hibrida
              </p>
            </div>
          </div>
          <button
            onClick={onOpenInvestorHub}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
          >
            <span>Buka Investor Hub Modal</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 text-white rounded-3xl p-6 sm:p-8 border border-indigo-500/20 shadow-xl space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-2">
              <div className="text-amber-400 font-black text-sm uppercase tracking-wider">1. Monetisasi SaaS</div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Paket API Search Engine & Crawler untuk perusahaan, portal berita, dan pengembang aplikasi yang membutuhkan mesin pencari kustom 4 bahasa.
              </p>
            </div>

            <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-2">
              <div className="text-indigo-400 font-black text-sm uppercase tracking-wider">2. Web2.5 Gateway Fee</div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Komisi transaksi mikropembayaran on-chain (Pi Network, Stellar Lumens) melalui portal gate.akomodanetwork.com.
              </p>
            </div>

            <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-2">
              <div className="text-emerald-400 font-black text-sm uppercase tracking-wider">3. Joint Venture & SEO</div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Layanan Extreme SEO & AI Knowledge Integration untuk brand global yang ingin mendominasi kata kunci teknologi dan kesehatan holistik.
              </p>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-slate-800/80">
            <div className="text-xs text-slate-400">
              Tertarik melakukan investasi atau kemitraan strategis dengan <strong className="text-white">Akomoda Network</strong>?
            </div>
            <button
              onClick={onOpenInvestorHub}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all cursor-pointer flex items-center gap-2"
            >
              <Briefcase className="w-4 h-4" />
              <span>Lihat Detail Proposal Investor</span>
            </button>
          </div>
        </div>

        {/* Modul Pricelist & Penawaran Kerjasama */}
        <div className="pt-6">
          <PricelistModule />
        </div>
      </section>

      {/* KONTAINER 8: PROFIL KEMITRAAN & LEAD DEVELOPER */}
      <section id="mitra" className="scroll-mt-24 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-600 text-white rounded-2xl shadow-md shadow-blue-600/20">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
                Kontainer Kemitraan IT & Profil Pengembang (#mitra)
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Infrastruktur dikelola secara profesional oleh Jim Koto (Verified Google Product Expert)
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm flex flex-col items-center text-center max-w-3xl mx-auto space-y-6">
          {/* Logo & Avatar Cluster */}
          <div className="relative inline-flex items-center justify-center">
            {/* Akomoda Brand Logo */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1 bg-gradient-to-tr from-amber-400 via-indigo-600 to-blue-500 shadow-xl">
              <img
                src="/src/assets/images/akomoda_logo_1784806358181.jpg"
                alt="Akomoda Glosarium Digital & Jim Koto"
                className="w-full h-full rounded-full object-cover border-2 border-white bg-slate-900"
                referrerPolicy="no-referrer"
              />
            </div>
            {/* Verified Google Product Expert Badge Ribbon */}
            <div className="absolute -bottom-2 bg-blue-600 text-white p-1.5 rounded-full shadow-lg border-2 border-white" title="Verified Google Product Expert">
              <Award className="w-4 h-4 text-amber-300" />
            </div>
          </div>

          {/* Profile Details */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className="font-black text-slate-950 text-2xl tracking-tight">Jim Koto</span>
              <span className="px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-[11px] font-black uppercase tracking-wider border border-amber-300 shadow-xs">
                IT & Publisher Partner
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2">
              <a
                href="https://productexperts.withgoogle.com/profile"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold border border-blue-200/80 transition-colors shadow-2xs"
              >
                <Award className="w-3.5 h-3.5 text-blue-600" />
                <span>Verified Google Product Expert</span>
              </a>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
              Spesialis Extreme SEO, Arsitektur Web2.5 Hibrida, dan Integrasi Google Cloud. Mengelola infrastruktur Akomoda Glosarium Digital secara langsung untuk performa maksimal.
            </p>
          </div>

          {/* CTA Action Buttons - Centered and fully responsive */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 w-full pt-2">
            <a
              href="mailto:support@akomodanetwork.com"
              className="px-4 py-2.5 bg-indigo-50 hover:bg-indigo-100 active:bg-indigo-200 text-indigo-700 font-bold text-xs rounded-xl transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer border border-indigo-200 shadow-2xs min-h-[40px]"
            >
              <Mail className="w-3.5 h-3.5 text-indigo-600" />
              <span>Email Admin</span>
            </a>
            <a
              href="https://t.me/jimkoto"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 bg-sky-50 hover:bg-sky-100 active:bg-sky-200 text-sky-700 font-bold text-xs rounded-xl transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer border border-sky-200 shadow-2xs min-h-[40px]"
            >
              <Send className="w-3.5 h-3.5 text-sky-600" />
              <span>Telegram</span>
            </a>
            <a
              href="https://Jimkoto.my.id"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white font-bold text-xs rounded-xl transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer shadow-sm min-h-[40px]"
            >
              <span>JimKoto.my.id</span>
              <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
            </a>
            <button
              onClick={onOpenSupportModal}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer shadow-md min-h-[40px]"
            >
              <Heart className="w-3.5 h-3.5 fill-slate-950" />
              <span>Donasi</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
