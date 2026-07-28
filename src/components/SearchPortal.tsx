import React, { useState, useEffect } from "react";
import { Search, Globe, Sparkles, BookOpen, Clock, Tag, Code, Eye, ChevronRight, AlertCircle, RefreshCw, CreditCard, X, Smartphone, Network, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { GlossaryItem, CrawledPage } from "../types";

// Dynamic translation of the Search interface itself
const UI_LANG: Record<string, Record<string, string>> = {
  id: {
    title: "Mesin Pencari Glosarium",
    subtitle: "Teknologi AI & Kesehatan Holistik Multibahasa",
    placeholder: "Cari istilah (contoh: kecerdasan buatan, biofeedback)...",
    searchBtn: "Cari AI",
    filters: "Filter Kategori",
    all: "Semua Kategori",
    aiResult: "Analisis Semantik AI",
    glossaryResult: "Hasil Glosarium Digital",
    pageResult: "Halaman Web Terindeks",
    recentSearch: "Pencarian Terbaru",
    schemaView: "Lihat Skema SEO",
    schemaHide: "Sembunyikan Skema",
    noResult: "Tidak ada hasil ditemukan. Silakan gunakan Crawler untuk merayapi konten baru!",
    detected: "Bahasa terdeteksi",
    pronounce: "Pelafalan Arab",
    context: "Konteks Penggunaan",
    score: "Skor SEO",
    loading: "Menganalisis Kueri dengan Gemini..."
  },
  en: {
    title: "Glossary Search Engine",
    subtitle: "Multilingual AI & Holistic Health Terminology",
    placeholder: "Search terms (e.g., artificial intelligence, biofeedback)...",
    searchBtn: "AI Search",
    filters: "Category Filter",
    all: "All Categories",
    aiResult: "AI Semantic Analysis",
    glossaryResult: "Digital Glossary Results",
    pageResult: "Indexed Web Pages",
    recentSearch: "Recent Searches",
    schemaView: "View SEO Schema",
    schemaHide: "Hide Schema",
    noResult: "No results found. Please use the Crawler to index new pages!",
    detected: "Detected language",
    pronounce: "Arabic Pronunciation",
    context: "Contextual Example",
    score: "SEO Score",
    loading: "Analyzing query with Gemini..."
  },
  ar: {
    title: "محرك بحث المصطلحات",
    subtitle: "المصطلحات متعددة اللغات للذكاء الاصطناعي والصحة الشمولية",
    placeholder: "ابحث عن المصطلحات (مثال: الذكاء الاصطناعي، التغذية الراجعة)...",
    searchBtn: "بحث ذكي",
    filters: "تصفية الفئات",
    all: "جميع الفئات",
    aiResult: "التحليل الدلالي بالذكاء الاصطناعي",
    glossaryResult: "نتائج القاموس الرقمي",
    pageResult: "صفحات الويب المؤرشفة",
    recentSearch: "عمليات البحث الأخيرة",
    schemaView: "عرض مخطط SEO",
    schemaHide: "إخفاء المخطط",
    noResult: "لم يتم العثور على نتائج. يرجى استخدام الزاحف لفهرسة صفحات جديدة!",
    detected: "اللغة المكتشفة",
    pronounce: "النطق الصوتي",
    context: "أمثلة السياق",
    score: "درجة السيو",
    loading: "جاري تحليل الاستفسار بواسطة Gemini..."
  },
  de: {
    title: "Glossar-Suchmaschine",
    subtitle: "Mehrsprachige KI & Ganzheitliche Gesundheitsbegriffe",
    placeholder: "Begriffe suchen (z. B. künstliche intelligenz, biofeedback)...",
    searchBtn: "KI Suche",
    filters: "Kategoriefilter",
    all: "Alle Kategorien",
    aiResult: "Semantische KI-Analyse",
    glossaryResult: "Digitale Glossar-Ergebnisse",
    pageResult: "Indizierte Webseiten",
    recentSearch: "Letzte Suchen",
    schemaView: "SEO-Schema anzeigen",
    schemaHide: "Schema ausblenden",
    noResult: "Keine Ergebnisse gefunden. Bitte nutzen Sie den Crawler für neue Inhalte!",
    detected: "Erkannte Sprache",
    pronounce: "Arabische Aussprache",
    context: "Kontextbeispiel",
    score: "SEO-Score",
    loading: "Abfrage wird mit Gemini analysiert..."
  }
};

interface SearchPortalProps {
  stats: any;
  onRefreshStats: () => void;
}

export default function SearchPortal({ stats, onRefreshStats }: SearchPortalProps) {
  const [currentUiLang, setCurrentUiLang] = useState<"id" | "en" | "ar" | "de">("id");
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isLoading, setIsLoading] = useState(false);

  // Cloudflare Worker injected sheet data state
  const [featuredArticle, setFeaturedArticle] = useState<{
    slug?: string;
    title?: string;
    content?: string;
    image?: string;
    finalImage?: string;
    desc?: string;
    kategori?: string;
    domain?: string;
  } | null>(null);

  // Quota states: 5 free searches per session, or top up
  const [remainingQuota, setRemainingQuota] = useState<number>(() => {
    const saved = localStorage.getItem("search_quota");
    return saved !== null ? parseInt(saved, 10) : 5;
  });
  const [isSubscribed, setIsSubscribed] = useState<boolean>(() => {
    return localStorage.getItem("is_subscribed") === "true";
  });
  const [showPayModal, setShowPayModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<"standard" | "unlimited">("standard");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "xlm" | "pi">("card");
  const [paymentSuccessMsg, setPaymentSuccessMsg] = useState("");

  // Other Language Translations State via Google Translate API
  const [otherLangTranslations, setOtherLangTranslations] = useState<Record<string, Record<string, { term: string; definition: string }>>>({});
  const [translatingId, setTranslatingId] = useState<string | null>(null);
  
  // Results
  const [searchResults, setSearchResults] = useState<{
    query: string;
    languageDetected: string;
    aiExplanation: string;
    glossaryResults: GlossaryItem[];
    pageResults: CrawledPage[];
  } | null>(null);

  // Schema viewer expanded IDs
  const [expandedSchemas, setExpandedSchemas] = useState<Record<string, boolean>>({});

  const t = UI_LANG[currentUiLang];
  const isRtl = currentUiLang === "ar";

  // Pre-seed some default autocomplete tags based on stats or default
  const suggestedTags = ["Kecerdasan Buatan", "Machine Learning", "Holistic Health", "Biofeedback", "Neural Network"];

  // Save quota to local storage
  useEffect(() => {
    localStorage.setItem("search_quota", remainingQuota.toString());
  }, [remainingQuota]);

  useEffect(() => {
    localStorage.setItem("is_subscribed", isSubscribed.toString());
  }, [isSubscribed]);

  // Read injected sheet data from Cloudflare Worker
  useEffect(() => {
    const win = window as any;
    if (win.__SHEET_DATA__) {
      setFeaturedArticle(win.__SHEET_DATA__);
      if (win.__SHEET_DATA__.title) {
        setQuery(win.__SHEET_DATA__.title);
      }
    }
  }, []);

  // Translate helper for other languages (Google Translate API proxy)
  const handleOtherLangTranslate = async (item: GlossaryItem, targetLangCode: string) => {
    const key = `${item.id}-${targetLangCode}`;
    if (otherLangTranslations[item.id]?.[targetLangCode]) return; // already translated

    setTranslatingId(key);
    try {
      const termRes = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: item.term, targetLang: targetLangCode })
      });
      const termData = await termRes.json();

      const defRes = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: item.definition_id, targetLang: targetLangCode })
      });
      const defData = await defRes.json();

      setOtherLangTranslations(prev => ({
        ...prev,
        [item.id]: {
          ...(prev[item.id] || {}),
          [targetLangCode]: {
            term: termData.translated,
            definition: defData.translated
          }
        }
      }));
    } catch (err) {
      console.error("Translation error:", err);
    } finally {
      setTranslatingId(null);
    }
  };

  const performLocalFallbackSearch = (searchQuery: string) => {
    const searchLower = searchQuery.toLowerCase().trim();
    const allGlossary: GlossaryItem[] = stats?.glossary || [];
    
    const matchingGlossary = allGlossary.filter(g => {
      const termMatches = (g.term && g.term.toLowerCase().includes(searchLower)) ||
                          (g.term_en && g.term_en.toLowerCase().includes(searchLower)) ||
                          (g.term_ar && g.term_ar.toLowerCase().includes(searchLower)) ||
                          (g.term_de && g.term_de.toLowerCase().includes(searchLower));
      
      const defMatches = (g.definition_id && g.definition_id.toLowerCase().includes(searchLower)) ||
                         (g.definition_en && g.definition_en.toLowerCase().includes(searchLower)) ||
                         (g.definition_ar && g.definition_ar.toLowerCase().includes(searchLower)) ||
                         (g.definition_de && g.definition_de.toLowerCase().includes(searchLower));

      const kwMatches = g.keywords && g.keywords.some(k => k.toLowerCase().includes(searchLower));
      const matchesFilter = !selectedCategory || selectedCategory === "All" || g.category === selectedCategory;

      return (termMatches || defMatches || kwMatches) && matchesFilter;
    });

    setSearchResults({
      query: searchQuery,
      languageDetected: currentUiLang,
      aiExplanation: "Hasil pencarian instan lokal (Mode Offline/Fallback Kategori).",
      glossaryResults: matchingGlossary,
      pageResults: []
    });

    if (!isSubscribed) {
      setRemainingQuota(prev => Math.max(0, prev - 1));
    }
  };

  const handleSearch = async (searchQuery: string = query) => {
    if (!searchQuery.trim()) return;

    // Check if quota has run out and user is not subscribed
    if (remainingQuota <= 0 && !isSubscribed) {
      setShowPayModal(true);
      return;
    }

    setIsLoading(true);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s max client timeout

      const response = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          query: searchQuery,
          language: currentUiLang,
          category: selectedCategory
        })
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        setSearchResults(data);
        
        // Decrement quota if not subscribed
        if (!isSubscribed) {
          setRemainingQuota(prev => Math.max(0, prev - 1));
        }
        
        onRefreshStats();
      } else {
        performLocalFallbackSearch(searchQuery);
      }
    } catch (err) {
      console.warn("Search API network/timeout error, performing local fallback search:", err);
      performLocalFallbackSearch(searchQuery);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSchema = (id: string) => {
    setExpandedSchemas(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const categories = stats ? ["All", ...Object.keys(stats.categoryDistribution || {})] : ["All"];

  return (
    <div className={`space-y-8 ${isRtl ? "text-right" : "text-left"}`} dir={isRtl ? "rtl" : "ltr"}>
      {/* Hero & Header Section (Elegant Light Theme) */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-50/80 via-white to-amber-50/60 text-slate-800 rounded-3xl p-8 sm:p-10 md:p-12 shadow-xl border border-indigo-100/60">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-400/10 rounded-full blur-3xl -z-10 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-emerald-400/5 rounded-full blur-3xl -z-10" />
        
        <div className="flex flex-col items-center text-center space-y-6">
          {/* Top Line Subtitle (Wide tracking, custom colors matching the screenshot) */}
          <div className="text-[10px] sm:text-xs font-mono font-bold tracking-[0.22em] text-slate-500 uppercase">
            Glossarium Hidup <span className="text-indigo-500">•</span> Living Glossary <span className="text-indigo-500">•</span> <span className="font-sans text-emerald-600">قاموس حي</span> <span className="text-indigo-500">•</span> Lebendiges Glossar
          </div>

          {/* Large display Typography (Aesthetic high-contrast slate and emerald text headings) */}
          <div className="space-y-2 max-w-4xl">
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight uppercase text-slate-900">
              Kata-kata bisa membuat sakit, ...
            </h1>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight uppercase text-emerald-600 drop-shadow-[0_2px_10px_rgba(16,185,129,0.05)]">
              Namun bisa juga menyembuhkan.
            </h1>
          </div>

          {/* Poetic description below headings */}
          <div className="space-y-2 max-w-2xl text-slate-600 text-xs sm:text-sm leading-relaxed font-semibold">
            <p className="tracking-wide">
              Setiap kata adalah cahaya. Setiap makna adalah jalan pulang.
            </p>
            <p className="text-slate-500 font-medium">
              Glossarium ini tumbuh bersama mereka yang mencari — tanpa batas, selama ada yang bertanya.
            </p>
            <p className="text-emerald-600 italic text-[11px] sm:text-xs">
              • Seperti lagu yang belum selesai — glossarium ini akan terus ditulis selama masih ada yang mendengarkan.
            </p>
          </div>

          {/* Original design Language switcher Pills directly centered under the text */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
            {[
              { code: "id", label: "Indonesia", flag: "🇮🇩" },
              { code: "en", label: "English", flag: "🇬🇧" },
              { code: "ar", label: "العربية", flag: "🇸🇦" },
              { code: "de", label: "Deutsch", flag: "🇩🇪" }
            ].map((langObj) => (
              <button
                key={langObj.code}
                onClick={() => setCurrentUiLang(langObj.code as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all border cursor-pointer ${
                  currentUiLang === langObj.code
                    ? "bg-amber-500/15 border-amber-500 text-amber-800 shadow-sm scale-105"
                    : "bg-white/90 border-slate-200 text-slate-600 hover:text-slate-800 hover:bg-slate-50 hover:border-slate-300"
                }`}
              >
                <span>{langObj.flag}</span>
                <span>{langObj.label}</span>
              </button>
            ))}
          </div>

          {/* Quota indicator badge aligned dynamically */}
          <div className="flex items-center gap-2 bg-white border border-slate-200/80 rounded-full px-4 py-1.5 text-[11px] text-slate-600 shadow-sm">
            {isSubscribed ? (
              <>
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                <span className="font-black uppercase tracking-wider text-[10px] text-emerald-600">Sesi Premium Aktif (Tanpa Batas)</span>
              </>
            ) : (
              <>
                <span className="font-bold text-[10px] uppercase text-amber-600">Sisa Kuota Pencarian: {remainingQuota}</span>
                <span className="text-slate-300">|</span>
                <button
                  onClick={() => setShowPayModal(true)}
                  className="text-indigo-600 hover:text-indigo-700 font-extrabold transition-colors uppercase tracking-wider text-[10px] cursor-pointer"
                >
                  Tambah Kuota Premium
                </button>
              </>
            )}
          </div>
        </div>

        {/* Big Search Bar Area */}
        <div className="mt-10 max-w-3xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 ${isRtl ? "right-4" : "left-4"}`} />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSearch()}
                placeholder={t.placeholder}
                className={`w-full bg-white text-slate-900 placeholder-slate-400 rounded-2xl border border-slate-200 py-4 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all text-sm md:text-base shadow-sm ${
                  isRtl ? "pr-12 pl-4 text-right" : "pl-12 pr-4 text-left"
                }`}
              />
            </div>
            <button
              onClick={() => handleSearch()}
              disabled={isLoading}
              className="px-6 py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-400 text-white font-medium rounded-2xl shadow-md shadow-indigo-100 hover:shadow-lg hover:shadow-indigo-200/40 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              {isLoading ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              <span>{t.searchBtn}</span>
            </button>
          </div>

          {/* Filters & Autocomplete suggestions */}
          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-600">{t.filters}:</span>
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="bg-white border border-slate-200 text-slate-700 rounded-lg py-1 px-2.5 focus:outline-none text-xs focus:ring-1 focus:ring-indigo-500"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === "All" ? t.all : cat}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-wrap gap-2 items-center">
              {suggestedTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => {
                    setQuery(tag);
                    handleSearch(tag);
                  }}
                  className="bg-slate-100/80 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 px-2.5 py-1 rounded-full border border-slate-200 hover:border-indigo-200 transition-colors cursor-pointer"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Featured Article Reader (Dynamic Cloudflare Edge Injection) */}
      <AnimatePresence>
        {featuredArticle && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className="bg-white rounded-3xl border border-indigo-100/80 shadow-xl overflow-hidden text-left"
            dir="ltr"
          >
            {/* Banner Cover Image */}
            <div className="relative h-48 sm:h-64 md:h-80 w-full overflow-hidden bg-slate-900">
              <img
                src={featuredArticle.finalImage || featuredArticle.image || "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1200"}
                alt={featuredArticle.title || "Featured Article"}
                className="w-full h-full object-cover opacity-85 hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              
              {/* Floating Badge & Category */}
              <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-end justify-between gap-4">
                <div className="space-y-2">
                  <span className="inline-block px-3 py-1 bg-emerald-500/90 text-white font-extrabold text-[10px] tracking-wider uppercase rounded-full backdrop-blur-sm shadow-sm">
                    {featuredArticle.kategori || "Artikel Unggulan"}
                  </span>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight uppercase leading-tight drop-shadow-md">
                    {featuredArticle.title}
                  </h2>
                </div>
                
                {/* Close/Minimize Button inside header */}
                <button
                  onClick={() => {
                    setFeaturedArticle(null);
                    const win = window as any;
                    if (win.__SHEET_DATA__) {
                      delete win.__SHEET_DATA__;
                    }
                  }}
                  className="px-4 py-2 bg-white/20 hover:bg-white text-white hover:text-slate-900 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 backdrop-blur-sm border border-white/10 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                  <span>Selesai Membaca</span>
                </button>
              </div>
            </div>

            {/* Content area */}
            <div className="p-6 sm:p-8 space-y-6">
              {/* Meta details */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 font-medium border-b border-slate-100 pb-4">
                {featuredArticle.domain && (
                  <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 rounded-xl px-3 py-1">
                    <Globe className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
                    <span className="text-slate-600 font-semibold">{featuredArticle.domain}</span>
                  </div>
                )}
                {featuredArticle.slug && (
                  <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 rounded-xl px-3 py-1 font-mono text-[10px]">
                    <span className="text-slate-400">Slug:</span>
                    <span className="text-indigo-600 font-bold">/{featuredArticle.slug}</span>
                  </div>
                )}
                <div className="ml-auto text-[10px] bg-indigo-50 text-indigo-700 px-3 py-1 rounded-xl font-bold uppercase tracking-wider">
                  ⚡ 100% SEO EXTREME Edge Loading
                </div>
              </div>

              {/* Poetic/Informative Description if present */}
              {featuredArticle.desc && (
                <p className="text-slate-500 font-medium text-xs sm:text-sm italic leading-relaxed border-l-4 border-indigo-500/50 pl-4 py-1">
                  {featuredArticle.desc}
                </p>
              )}

              {/* Main Content (Safely render with line breaks) */}
              <div className="text-slate-700 text-sm md:text-base leading-relaxed space-y-4 whitespace-pre-line font-medium">
                {featuredArticle.content}
              </div>

              {/* Footer action / sharing bar */}
              <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Bagikan Artikel:</span>
                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                      `Baca artikel "${featuredArticle.title}" di Akomoda Glosarium Digital: https://${window.location.host}/${featuredArticle.slug}`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-xl transition-all cursor-pointer hover:scale-105"
                    title="Bagikan ke WhatsApp"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.022-.015-.022-.015-.402-.204-.19-.095-1.123-.556-1.3-.618-.178-.063-.308-.094-.44.1-.132.195-.512.645-.626.777-.114.133-.23.148-.423.05-.19-.095-.807-.296-1.536-.948-.567-.506-.95-1.133-1.062-1.32-.113-.193-.011-.298.086-.394.088-.088.195-.23.29-.34.1-.115.132-.193.197-.325.065-.13.032-.245-.015-.34-.047-.097-.408-1.026-.56-1.387-.147-.356-.3-.306-.41-.306-.107-.006-.23-.006-.35-.006-.12 0-.317.045-.483.225-.166.18-.635.62-.635 1.514 0 .894.648 1.757.74 1.879.09.123 1.275 1.947 3.09 2.73.43.187.766.297 1.03.382.43.137.822.117 1.13.072.344-.05 1.123-.46 1.28-1.02.158-.562.158-1.043.11-1.14-.047-.1-.17-.16-.36-.256zM12.016 21c-1.63 0-3.23-.42-4.64-1.2l-.33-.2-3.45.9 1.13-3.36-.21-.34A8.91 8.91 0 013 12.02c0-4.94 4.02-8.96 8.97-8.96 2.4 0 4.65.94 6.34 2.64 1.7 1.69 2.63 3.94 2.63 6.32 0 4.93-4.01 8.96-8.96 8.96zm0-19C6.49 2 2 6.49 2 12.02c0 1.91.53 3.77 1.54 5.38L2 22l4.74-1.24a9.98 9.98 0 005.28 1.48c5.52 0 10-4.49 10-10.02a9.96 9.96 0 00-10-10.26z" />
                    </svg>
                  </a>

                  <button
                    onClick={() => {
                      const link = `https://${window.location.host}/${featuredArticle.slug}`;
                      navigator.clipboard.writeText(link);
                      const btn = document.getElementById("copy-link-btn");
                      if (btn) {
                        const originalText = btn.innerHTML;
                        btn.innerHTML = "<span>Tersalin! ✔️</span>";
                        setTimeout(() => {
                          btn.innerHTML = originalText;
                        }, 2000);
                      }
                    }}
                    id="copy-link-btn"
                    className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs rounded-xl font-bold transition-all flex items-center gap-1 border border-slate-200/50 cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Salin Link</span>
                  </button>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setFeaturedArticle(null);
                      const win = window as any;
                      if (win.__SHEET_DATA__) {
                        delete win.__SHEET_DATA__;
                      }
                    }}
                    className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-extrabold transition-all cursor-pointer uppercase tracking-wider flex items-center gap-1.5"
                  >
                    <span>Cari Istilah Lain</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading state */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-16 space-y-4 bg-white/50 backdrop-blur-sm rounded-3xl border border-slate-200/80 p-8 shadow-sm">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
            <Sparkles className="w-5 h-5 text-indigo-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          </div>
          <p className="text-slate-600 font-medium text-sm animate-pulse">{t.loading}</p>
        </div>
      )}

      {/* Results View */}
      {!isLoading && searchResults && (
        <div className="space-y-8">
          {/* AI Semantic Summarization Header */}
          {searchResults.aiExplanation && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-indigo-50/70 border border-indigo-100 rounded-3xl p-6 shadow-sm flex gap-4 items-start"
            >
              <div className="p-3 bg-indigo-500 text-white rounded-2xl shrink-0 shadow-md shadow-indigo-100">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-indigo-950 text-base">{t.aiResult}</h3>
                  <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-medium">
                    {t.detected}: {searchResults.languageDetected.toUpperCase()}
                  </span>
                </div>
                <p className="text-slate-700 text-sm md:text-base leading-relaxed">
                  {searchResults.aiExplanation}
                </p>
              </div>
            </motion.div>
          )}

          {/* Glossary Matches (3 languages) */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 px-1">
              <BookOpen className="w-5 h-5 text-indigo-500" />
              <span>{t.glossaryResult} ({searchResults.glossaryResults.length})</span>
            </h2>

            {searchResults.glossaryResults.length === 0 ? (
              <div className="bg-slate-50 border border-slate-100 text-center py-10 rounded-2xl text-slate-500 text-sm">
                <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p>{t.noResult}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {searchResults.glossaryResults.map(item => (
                  <motion.div
                    key={item.id}
                    layoutId={item.id}
                    className="bg-white rounded-3xl border border-slate-100 hover:border-indigo-100 shadow-sm hover:shadow-md p-6 transition-all duration-300"
                  >
                    {/* Item header with tags */}
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-50 pb-4 mb-4">
                      <div className="flex items-center gap-2.5">
                        <span className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                          <BookOpen className="w-4 h-4" />
                        </span>
                        <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                          {item.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-slate-400">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* Term Display Bento Grid (4 Languages Side-by-Side/Staggered) */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      {/* Indonesia */}
                      <div className="space-y-2 p-4 bg-slate-50/50 rounded-2xl border border-slate-50">
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold uppercase tracking-wider">
                          <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                          <span>Indonesia</span>
                        </div>
                        <h4 className="text-lg font-bold text-slate-900">{item.term}</h4>
                        <p className="text-slate-600 text-xs leading-relaxed">{item.definition_id}</p>
                        {item.context_id && (
                          <div className="mt-3 pt-2 border-t border-slate-100/60 text-xs text-slate-500">
                            <span className="font-semibold block text-slate-400 mb-0.5">{t.context}:</span>
                            <span className="italic">"{item.context_id}"</span>
                          </div>
                        )}
                      </div>

                      {/* English */}
                      <div className="space-y-2 p-4 bg-slate-50/50 rounded-2xl border border-slate-50">
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold uppercase tracking-wider">
                          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                          <span>English</span>
                        </div>
                        <h4 className="text-lg font-bold text-slate-900">{item.term_en}</h4>
                        <p className="text-slate-600 text-xs leading-relaxed">{item.definition_en}</p>
                        {item.context_en && (
                          <div className="mt-3 pt-2 border-t border-slate-100/60 text-xs text-slate-500">
                            <span className="font-semibold block text-slate-400 mb-0.5">{t.context}:</span>
                            <span className="italic">"{item.context_en}"</span>
                          </div>
                        )}
                      </div>

                      {/* Arabic */}
                      <div className="space-y-2 p-4 bg-slate-50/50 rounded-2xl border border-slate-50 text-right" dir="rtl">
                        <div className="flex items-center justify-end gap-1.5 text-xs text-slate-400 font-semibold uppercase tracking-wider">
                          <span>العربية</span>
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                        </div>
                        <h4 className="text-xl font-bold text-slate-900 font-sans tracking-tight">{item.term_ar}</h4>
                        <p className="text-slate-600 text-xs leading-relaxed font-sans">{item.definition_ar}</p>
                        {item.pronunciation_ar && (
                          <div className="mt-2 text-[10px] text-slate-400">
                            <span className="font-semibold ml-1">{t.pronounce}:</span>
                            <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">{item.pronunciation_ar}</span>
                          </div>
                        )}
                        {item.context_ar && (
                          <div className="mt-3 pt-2 border-t border-slate-100/60 text-xs text-slate-500">
                            <span className="font-semibold block text-slate-400 mb-0.5">{t.context}:</span>
                            <span className="italic">"{item.context_ar}"</span>
                          </div>
                        )}
                      </div>

                      {/* German / Deutsch */}
                      <div className="space-y-2 p-4 bg-slate-50/50 rounded-2xl border border-slate-50">
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold uppercase tracking-wider">
                          <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                          <span>Deutsch</span>
                        </div>
                        <h4 className="text-lg font-bold text-slate-900">{item.term_de || item.term_en || item.term}</h4>
                        <p className="text-slate-600 text-xs leading-relaxed">
                          {item.definition_de || (item.definition_en ? `${item.definition_en} [Automatisch übersetzt]` : "Keine Übersetzung verfügbar.")}
                        </p>
                        {(item.context_de || item.context_en) && (
                          <div className="mt-3 pt-2 border-t border-slate-100/60 text-xs text-slate-500">
                            <span className="font-semibold block text-slate-400 mb-0.5">{t.context}:</span>
                            <span className="italic">"{item.context_de || item.context_en}"</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Other Languages Google Translate Selector */}
                    <div className="mt-4 p-3 bg-slate-50/40 border border-slate-100/80 rounded-2xl flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-600 flex items-center gap-1">
                          <Globe className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
                          <span>Opsi Terjemahan Lain (Google Translate):</span>
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <select
                          onChange={(e) => {
                            if (e.target.value) {
                              handleOtherLangTranslate(item, e.target.value);
                            }
                          }}
                          className="bg-white border border-slate-200 text-slate-700 rounded-lg py-1 px-3 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none cursor-pointer"
                          defaultValue=""
                        >
                          <option value="" disabled>-- Pilih Bahasa Lain --</option>
                          <option value="es">Español (Spanyol)</option>
                          <option value="fr">Français (Prancis)</option>
                          <option value="ja">日本語 (Jepang)</option>
                          <option value="zh">中文 (Tiongkok)</option>
                          <option value="hi">हिन्दी (Hindi)</option>
                          <option value="ru">Русский (Rusia)</option>
                        </select>
                      </div>
                    </div>

                    {/* Dynamic translated results container */}
                    {otherLangTranslations[item.id] && Object.keys(otherLangTranslations[item.id]).map((langCode) => {
                      const trans = otherLangTranslations[item.id][langCode];
                      const langNames: Record<string, string> = {
                        es: "Español",
                        fr: "Français",
                        ja: "日本語",
                        zh: "中文",
                        hi: "हिन्दी",
                        ru: "Русский"
                      };
                      return (
                        <motion.div
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          key={langCode}
                          className="mt-3 p-4 bg-indigo-50/40 border border-indigo-100/50 rounded-2xl space-y-1 text-left"
                          dir="ltr"
                        >
                          <div className="flex items-center gap-2 text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
                            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-ping" />
                            <span>Hasil Terjemahan Google Translate ({langNames[langCode] || langCode})</span>
                          </div>
                          <h5 className="text-sm font-black text-slate-900">{trans.term}</h5>
                          <p className="text-slate-600 text-xs leading-relaxed">{trans.definition}</p>
                        </motion.div>
                      );
                    })}

                    {translatingId === `${item.id}-es` || translatingId === `${item.id}-fr` || translatingId === `${item.id}-ja` || translatingId === `${item.id}-zh` || translatingId === `${item.id}-hi` || translatingId === `${item.id}-ru` ? (
                      <div className="mt-3 flex items-center gap-2 text-xs text-indigo-600 italic font-medium px-2 animate-pulse">
                        <RefreshCw className="w-3 h-3 animate-spin" />
                        <span>Menghubungi Google Translate API...</span>
                      </div>
                    ) : null}

                    {/* SEO schema & Keyword list */}
                    <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      {/* Keywords */}
                      <div className="flex flex-wrap gap-1.5">
                        {item.keywords.map(kw => (
                          <span key={kw} className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-slate-100 text-slate-600 rounded-full text-[10px] font-medium border border-slate-200/50">
                            <Tag className="w-2.5 h-2.5 text-slate-400" />
                            {kw}
                          </span>
                        ))}
                      </div>

                      {/* Schema viewer */}
                      <div>
                        <button
                          onClick={() => toggleSchema(item.id)}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-500 transition-colors cursor-pointer"
                        >
                          <Code className="w-3.5 h-3.5" />
                          <span>{expandedSchemas[item.id] ? t.schemaHide : t.schemaView}</span>
                        </button>
                      </div>
                    </div>

                    {/* Expandable SEO JSON-LD schema markup */}
                    <AnimatePresence>
                      {expandedSchemas[item.id] && item.schema_json_ld && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden mt-4 bg-slate-900 rounded-2xl p-4 border border-slate-800 text-left font-mono text-xs text-indigo-200"
                          dir="ltr"
                        >
                          <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-2 mb-2">
                            <span>JSON-LD SEO Structured Data (DefinedTerm)</span>
                            <Eye className="w-4 h-4 text-slate-500" />
                          </div>
                          <pre className="overflow-x-auto whitespace-pre-wrap">{JSON.stringify(JSON.parse(item.schema_json_ld), null, 2)}</pre>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Crawled Web Page matches */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 px-1">
              <Globe className="w-5 h-5 text-indigo-500" />
              <span>{t.pageResult} ({searchResults.pageResults.length})</span>
            </h2>

            {searchResults.pageResults.length > 0 && (
              <div className="grid grid-cols-1 gap-4">
                {searchResults.pageResults.map((p, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row justify-between gap-4 items-start"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                        <span>{p.url}</span>
                        <span className="w-1 h-1 bg-slate-300 rounded-full" />
                        <span>{p.wordCount} words</span>
                      </div>
                      <h4 className="text-base font-bold text-slate-900 hover:text-indigo-600 transition-colors">
                        {p.title}
                      </h4>
                      <p className="text-slate-600 text-sm leading-relaxed">{p.bodySnippet}</p>
                      
                      {/* Headings detected */}
                      {p.headings && p.headings.h1 && p.headings.h1.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-2 text-[10px]">
                          <span className="font-semibold text-slate-400 uppercase tracking-wide">SEO H1:</span>
                          {p.headings.h1.map((h, i) => (
                            <span key={i} className="bg-slate-50 text-slate-600 px-2 py-0.5 rounded border border-slate-100">"{h}"</span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* SEO Score Circle */}
                    <div className="flex flex-col items-center justify-center bg-indigo-50/50 p-4 rounded-2xl border border-indigo-50 shrink-0 self-stretch sm:self-center">
                      <div className="relative flex items-center justify-center">
                        {/* Circular progress bar */}
                        <svg className="w-14 h-14 transform -rotate-90">
                          <circle cx="28" cy="28" r="24" stroke="#e2e8f0" strokeWidth="4" fill="transparent" />
                          <circle
                            cx="28"
                            cy="28"
                            r="24"
                            stroke={p.seoScore >= 90 ? "#10b981" : p.seoScore >= 75 ? "#f59e0b" : "#ef4444"}
                            strokeWidth="4"
                            fill="transparent"
                            strokeDasharray={`${2 * Math.PI * 24}`}
                            strokeDashoffset={`${2 * Math.PI * 24 * (1 - p.seoScore / 100)}`}
                          />
                        </svg>
                        <span className="absolute font-extrabold text-sm text-slate-800">{p.seoScore}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-semibold mt-1 uppercase tracking-wider">{t.score}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Dynamic Payment / Subscription Modal (Fiat & Crypto Web2.5 Gateway) */}
      <AnimatePresence>
        {showPayModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 overflow-hidden relative"
              dir="ltr"
            >
              {/* Close Button */}
              <button
                onClick={() => {
                  setShowPayModal(false);
                  setPaymentSuccessMsg("");
                }}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-6 text-left">
                {/* Modal Title */}
                <div className="text-center space-y-2">
                  <div className="inline-flex p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                    <CreditCard className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">
                    Tambah Jatah Pencari AI & Premium Crawler
                  </h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Pencarian gratis Anda telah habis atau Anda mencari istilah baru yang memerlukan alokasi daya server premium.
                  </p>
                </div>

                {!paymentSuccessMsg ? (
                  <>
                    {/* Plan Selector */}
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => setSelectedPlan("standard")}
                        className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                          selectedPlan === "standard"
                            ? "border-indigo-600 bg-indigo-50/40 ring-1 ring-indigo-500"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <span className="block font-bold text-slate-800 text-sm">Paket Tambahan</span>
                        <span className="block text-xs text-slate-400 mt-0.5">Sempurna untuk peneliti</span>
                        <span className="block text-lg font-black text-indigo-600 mt-2">$2.99 <span className="text-xs font-normal text-slate-400">/ 50 pencarian</span></span>
                      </button>

                      <button
                        onClick={() => setSelectedPlan("unlimited")}
                        className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                          selectedPlan === "unlimited"
                            ? "border-indigo-600 bg-indigo-50/40 ring-1 ring-indigo-500"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <span className="block font-bold text-slate-800 text-sm">Unlimited Web2.5</span>
                        <span className="block text-xs text-slate-400 mt-0.5">Akses penuh selamanya</span>
                        <span className="block text-lg font-black text-indigo-600 mt-2">$9.99 <span className="text-xs font-normal text-slate-400">/ selamanya</span></span>
                      </button>
                    </div>

                    {/* Method Selector */}
                    <div className="space-y-2">
                      <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Metode Pembayaran</span>
                      <div className="grid grid-cols-3 gap-2 bg-slate-100 p-1 rounded-xl">
                        <button
                          onClick={() => setPaymentMethod("card")}
                          className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                            paymentMethod === "card" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
                          }`}
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          <span>Fiat / CC</span>
                        </button>
                        <button
                          onClick={() => setPaymentMethod("xlm")}
                          className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                            paymentMethod === "xlm" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
                          }`}
                        >
                          <Network className="w-3.5 h-3.5" />
                          <span>XLM (Stellar)</span>
                        </button>
                        <button
                          onClick={() => setPaymentMethod("pi")}
                          className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                            paymentMethod === "pi" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
                          }`}
                        >
                          <Smartphone className="w-3.5 h-3.5" />
                          <span>Pi Wallet</span>
                        </button>
                      </div>
                    </div>

                    {/* Dynamic Inputs */}
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-150 space-y-3">
                      {paymentMethod === "card" && (
                        <div className="space-y-3">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Nomor Kartu Kredit</label>
                            <input
                              type="text"
                              placeholder="4111 2222 3333 4444"
                              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                              defaultValue="4111 2222 3333 4444"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Berlaku Hingga</label>
                              <input
                                type="text"
                                placeholder="12/28"
                                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                                defaultValue="12/28"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">CVC</label>
                              <input
                                type="text"
                                placeholder="123"
                                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                                defaultValue="123"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {paymentMethod === "xlm" && (
                        <div className="space-y-2 text-left">
                          <span className="block text-[10px] font-bold text-slate-400 uppercase">Stellar Wallet Destination</span>
                          <span className="block bg-slate-900 text-indigo-300 font-mono text-[10px] p-2.5 rounded-xl break-all">
                            GD72X2H5F...4MULTILINGUALSTELARKEY
                          </span>
                          <div className="flex justify-between items-center text-xs text-slate-500 pt-1">
                            <span>Kirim senilai:</span>
                            <span className="font-bold text-slate-800">
                              {selectedPlan === "standard" ? "15.5 XLM" : "51.8 XLM"}
                            </span>
                          </div>
                        </div>
                      )}

                      {paymentMethod === "pi" && (
                        <div className="space-y-2 text-left">
                          <span className="block text-[10px] font-bold text-slate-400 uppercase">Pi Network Address (Mainnet)</span>
                          <span className="block bg-slate-900 text-amber-400 font-mono text-[10px] p-2.5 rounded-xl break-all">
                            G-PI-DECIMAL-DIGITAL-GLOSARIUM-GATEWAY
                          </span>
                          <div className="flex justify-between items-center text-xs text-slate-500 pt-1">
                            <span>Kirim senilai:</span>
                            <span className="font-bold text-slate-800">
                              {selectedPlan === "standard" ? "3.0 Pi" : "10.0 Pi"}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => {
                        if (selectedPlan === "unlimited") {
                          setIsSubscribed(true);
                          setPaymentSuccessMsg("Sukses! Anda telah berlangganan Paket UNLIMITED secara permanen. Nikmati akses tanpa batas.");
                        } else {
                          setRemainingQuota(prev => prev + 50);
                          setPaymentSuccessMsg("Sukses! 50 Jatah pencarian baru telah ditambahkan ke kuota Anda.");
                        }
                      }}
                      className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl shadow-lg transition-all text-xs cursor-pointer uppercase tracking-wider text-center"
                    >
                      Bayar Sekarang ({selectedPlan === "standard" ? "$2.99" : "$9.99"})
                    </button>
                  </>
                ) : (
                  <div className="text-center py-6 space-y-4">
                    <div className="inline-flex p-3 bg-emerald-50 text-emerald-600 rounded-full animate-bounce">
                      <Sparkles className="w-8 h-8" />
                    </div>
                    <h4 className="text-lg font-bold text-slate-900">Pembayaran Diterima!</h4>
                    <p className="text-xs text-slate-600 bg-emerald-50 border border-emerald-100 p-4 rounded-2xl leading-relaxed text-center">
                      {paymentSuccessMsg}
                    </p>
                    <button
                      onClick={() => {
                        setShowPayModal(false);
                        setPaymentSuccessMsg("");
                      }}
                      className="px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                    >
                      Kembali ke Pencarian
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
