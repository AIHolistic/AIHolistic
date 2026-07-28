import React, { useState } from "react";
import { Check, Sparkles, ExternalLink, Zap, ShieldCheck, HelpCircle, Code, Server, Send, Mail, Copy, CheckCircle2, Bot } from "lucide-react";

interface PricingPlan {
  id: string;
  name: string;
  tagline: string;
  price: string;
  period: string;
  badge?: string;
  popular?: boolean;
  features: string[];
  ctaText: string;
  ctaType: "ai_studio" | "contact" | "download";
  aiStudioPrompt?: string;
}

export default function PricelistModule() {
  const [selectedCategory, setSelectedCategory] = useState<"all" | "diy" | "managed" | "synergy">("all");
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);
  const [showOfferModal, setShowOfferModal] = useState<PricingPlan | null>(null);

  const plans: PricingPlan[] = [
    {
      id: "diy-script",
      name: "Paket DIY & AI Studio Template",
      tagline: "Untuk Pemilik Web & Publisher Mandiri",
      price: "Gratis / Donasi",
      period: "Lisensi Terbuka",
      badge: "Siap Pakai",
      popular: false,
      features: [
        "Script Cloudflare Worker.js Full Source Code",
        "Template Google Sheet AppScript Siap Clone",
        "Prompt AI Studio untuk Kustomisasi Cepat",
        "Dokumentasi & SOP Migrasi Lengkap",
        "Mendukung Custom Domain & Multi-Niche"
      ],
      ctaText: "Buka di AI Studio / Salin Prompt",
      ctaType: "ai_studio",
      aiStudioPrompt: "Build a high-performance Cloudflare Worker and Google Sheets CMS app for dynamic glossary and extreme SEO optimization."
    },
    {
      id: "managed-setup",
      name: "Paket Managed Setup & Custom Domain",
      tagline: "Setting Lengkap & Dampingan Penuh",
      price: "Rp 350.000",
      period: "Sekali Bayar / Domain",
      badge: "Paling Diminati",
      popular: true,
      features: [
        "Semua Fitur Paket DIY",
        "Seting Penuh Cloudflare DNS & Worker di Akun Klien",
        "Koneksi Google Sheets & Cloudflare D1/KV",
        "Garansi Bebas Conflict Origin / SSL Fast Proxy",
        "Optimasi Extreme SEO Schema.org & Sitemap XML"
      ],
      ctaText: "Minta Penawaran Setup",
      ctaType: "contact"
    },
    {
      id: "network-synergy",
      name: "Kemitraan Akomoda Network Synergy",
      tagline: "Sinergi Trafik & Joint SEO Publisher",
      price: "Bagi Hasil / Revenue Share",
      period: "Kerjasama Berkelanjutan",
      badge: "Sinergi SEO",
      popular: false,
      features: [
        "Infrastruktur Hosting & Worker Ditanggung Akomoda",
        "Cross-Link & Injeksi Trafik dari Akomoda Network",
        "Integrasi Otomatis dengan AI Holistic & Knowledge Hub",
        "Monetisasi Bersama via Web2.5 Gateway & Iklan",
        "Dukungan Pemeliharaan Rutin dari Product Expert"
      ],
      ctaText: "Ajukan Kerjasama Sinergi",
      ctaType: "contact"
    },
    {
      id: "enterprise-custom",
      name: "Enterprise & Custom Solution",
      tagline: "Pengembangan Khusus & Integrasi Khusus",
      price: "Custom Price",
      period: "Berdasarkan Scope",
      badge: "Enterprise",
      popular: false,
      features: [
        "Arsitektur Web2.5 & Multi-tenant Headless CMS",
        "Integrasi Custom API Gemini / LLM Enterprise",
        "Audit SEO Ekstrim & Skalabilitas Jutaan Halaman",
        "Dampingi Konsultasi oleh Jim Koto (Google Product Expert)",
        "SLA Support & Prioritas Konsultasi"
      ],
      ctaText: "Hubungi Tim Enterprise",
      ctaType: "contact"
    }
  ];

  const handleCopyPrompt = (plan: PricingPlan) => {
    if (plan.aiStudioPrompt) {
      navigator.clipboard.writeText(plan.aiStudioPrompt);
      setCopiedPromptId(plan.id);
      setTimeout(() => setCopiedPromptId(null), 3000);
    }
  };

  const filteredPlans = plans.filter(plan => {
    if (selectedCategory === "diy") return plan.id.includes("diy");
    if (selectedCategory === "managed") return plan.id.includes("managed");
    if (selectedCategory === "synergy") return plan.id.includes("synergy") || plan.id.includes("enterprise");
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Module */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-indigo-500/20 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Modul Pricelist & Skema Penawaran Kerjasama</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Pilihan Paket Layanan & Sinergi Akomoda Network
            </h3>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Dapat dikelola langsung dari Dashboard Admin & Google Sheets Akomoda. Klien dapat memilih paket DIY mandiri dengan template AI Studio atau mengajukan kerjasama setup profesional.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800 text-xs font-bold">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                selectedCategory === "all" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
              }`}
            >
              Semua Paket
            </button>
            <button
              onClick={() => setSelectedCategory("diy")}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                selectedCategory === "diy" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
              }`}
            >
              DIY Template
            </button>
            <button
              onClick={() => setSelectedCategory("managed")}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                selectedCategory === "managed" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
              }`}
            >
              Managed Setup
            </button>
            <button
              onClick={() => setSelectedCategory("synergy")}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                selectedCategory === "synergy" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
              }`}
            >
              Kerjasama
            </button>
          </div>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredPlans.map((plan) => (
          <div
            key={plan.id}
            className={`rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 relative overflow-hidden ${
              plan.popular
                ? "bg-slate-900 text-white border-2 border-amber-400/80 shadow-2xl scale-[1.02]"
                : "bg-white text-slate-800 border border-slate-200 shadow-sm hover:shadow-md"
            }`}
          >
            {plan.popular && (
              <div className="absolute top-0 right-0 bg-amber-400 text-slate-950 font-black text-[10px] uppercase tracking-widest px-4 py-1 rounded-bl-2xl shadow-md">
                Paling Diminati
              </div>
            )}

            <div className="space-y-4">
              <div>
                <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2 ${
                  plan.popular ? "bg-amber-400/20 text-amber-300 border border-amber-400/30" : "bg-slate-100 text-slate-600 border border-slate-200"
                }`}>
                  {plan.badge}
                </span>
                <h4 className="text-lg font-black tracking-tight">{plan.name}</h4>
                <p className={`text-xs mt-1 ${plan.popular ? "text-slate-300" : "text-slate-500"}`}>
                  {plan.tagline}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200/40">
                <div className="text-2xl sm:text-3xl font-black">{plan.price}</div>
                <div className={`text-[11px] font-semibold ${plan.popular ? "text-amber-300" : "text-indigo-600"}`}>
                  {plan.period}
                </div>
              </div>

              {/* Feature List */}
              <ul className="space-y-2.5 pt-2">
                {plan.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs leading-snug">
                    <Check className={`w-4 h-4 shrink-0 mt-0.5 ${plan.popular ? "text-amber-400" : "text-emerald-500"}`} />
                    <span className={plan.popular ? "text-slate-200" : "text-slate-700"}>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA Buttons */}
            <div className="pt-6 space-y-2">
              {plan.ctaType === "ai_studio" ? (
                <div className="space-y-2">
                  <a
                    href="https://ai.studio/build"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs rounded-xl shadow-md transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Bot className="w-4 h-4" />
                    <span>Buka Google AI Studio</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    onClick={() => handleCopyPrompt(plan)}
                    className="w-full py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[11px] rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer border border-slate-200"
                  >
                    {copiedPromptId === plan.id ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Prompt Terkoip!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-500" />
                        <span>Salin Prompt Launch AI Studio</span>
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowOfferModal(plan)}
                  className={`w-full py-3 px-4 font-extrabold text-xs rounded-xl shadow-md transition-all text-center flex items-center justify-center gap-2 cursor-pointer ${
                    plan.popular
                      ? "bg-amber-400 hover:bg-amber-300 text-slate-950"
                      : "bg-slate-900 hover:bg-slate-800 text-white"
                  }`}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{plan.ctaText}</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Offer Modal Form */}
      {showOfferModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900">
                  Formulir Penawaran: {showOfferModal.name}
                </h3>
                <p className="text-xs text-indigo-600 font-semibold">
                  Estimasi Biaya: {showOfferModal.price} ({showOfferModal.period})
                </p>
              </div>
              <button
                onClick={() => setShowOfferModal(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Silakan kirimkan nama domain/niche Anda dan opsi kerjasama yang diinginkan. Tim kami akan menghubungi Anda melalui Email atau Telegram.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Nama Anda / Perusahaan
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Budi Santoso (PT Akomoda Solusi)"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Domain Target / URL Niche
                </label>
                <input
                  type="text"
                  placeholder="Contoh: mybrand.com atau catalog.mybrand.com"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Kontak WhatsApp / Telegram / Email
                </label>
                <input
                  type="text"
                  placeholder="Contoh: @username atau support@mybrand.com"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                onClick={() => setShowOfferModal(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Batal
              </button>
              <a
                href={`mailto:support@akomodanetwork.com?subject=Penawaran%20Paket%20${encodeURIComponent(showOfferModal.name)}&body=Halo%20Tim%20Akomoda,%20Saya%20tertarik%20dengan%20${encodeURIComponent(showOfferModal.name)}.`}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Kirim via Email</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
