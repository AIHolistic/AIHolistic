import React, { useState, useEffect, useRef } from "react";
import { Terminal, Shield, RefreshCw, Layers, Sliders, Play, CheckCircle, Database, Award, HelpCircle, Activity } from "lucide-react";
import { motion } from "motion/react";
import { CrawlerSettings, SystemStats } from "../types";

interface CrawlerDashboardProps {
  stats: SystemStats | null;
  onRefreshStats: () => void;
}

export default function CrawlerDashboard({ stats, onRefreshStats }: CrawlerDashboardProps) {
  const [seedUrl, setSeedUrl] = useState("https://aiholistic.xyz/glossarium/");
  const [maxDepth, setMaxDepth] = useState(2);
  const [delayMs, setDelayMs] = useState(1000);
  const [respectRobots, setRespectRobots] = useState(true);
  const [aiExtraction, setAiExtraction] = useState(true);
  const [isCrawling, setIsCrawling] = useState(false);
  const [liveLogs, setLiveLogs] = useState<string[]>([]);
  const terminalEndRef = useRef<HTMLDivElement | null>(null);

  // Poll logs when crawling is in progress
  useEffect(() => {
    let intervalId: any;
    if (isCrawling) {
      intervalId = setInterval(async () => {
        try {
          const res = await fetch("/api/crawler/logs");
          if (res.ok) {
            const data = await res.json();
            setLiveLogs(data.logs);
          }
        } catch (err) {
          console.error("Failed to fetch crawl logs:", err);
        }
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [isCrawling]);

  // Scroll to bottom of terminal
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [liveLogs]);

  // Load initial settings
  useEffect(() => {
    if (stats && stats.crawlerSettings) {
      setSeedUrl(stats.crawlerSettings.seedUrls[0] || "https://aiholistic.xyz/glossarium/");
      setMaxDepth(stats.crawlerSettings.maxDepth || 2);
      setDelayMs(stats.crawlerSettings.delayMs || 1000);
      setRespectRobots(stats.crawlerSettings.respectRobots !== false);
    }
  }, [stats]);

  const handleStartCrawl = async () => {
    setIsCrawling(true);
    setLiveLogs(["[SYSTEM] Menyiapkan modul crawler web...", "[SYSTEM] Menghubungi REST server..."]);
    
    try {
      // First save settings
      await fetch("/api/settings/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          crawlerSettings: {
            seedUrls: [seedUrl],
            maxDepth,
            delayMs,
            respectRobots,
            userAgent: "HolisticDigitalBot/2.0 (compatible; Extreme SEO Web Crawler; serverless)"
          }
        })
      });

      // Trigger crawl job
      const response = await fetch("/api/crawler/crawl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: seedUrl,
          maxDepth,
          delayMs,
          respectRobots,
          aiExtraction
        })
      });

      const data = await response.json();
      if (data.logs) {
        setLiveLogs(data.logs);
      }
      onRefreshStats();
    } catch (err) {
      console.error("Crawl error:", err);
      setLiveLogs(prev => [...prev, `[ERROR] Gagal menjalankan crawl: ${err}`]);
    } finally {
      setIsCrawling(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Settings Panel */}
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Crawler Admin Panel</h3>
              <p className="text-xs text-slate-400">Peninggalan Sphider.eu / Modernized AI</p>
            </div>
          </div>

          {/* Seed URL input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
              Seed URL / Target Fiksasi
            </label>
            <input
              type="url"
              value={seedUrl}
              onChange={e => setSeedUrl(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none transition-colors"
              placeholder="https://aiholistic.xyz/glossarium/"
            />
            <p className="text-[10px] text-slate-400">
              Crawler akan memulai rekursi URL dari target fiksasi Glosarium Digital ini.
            </p>
          </div>

          {/* Max Depth */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
              Kedalaman Rambat (Max Depth)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3].map(depth => (
                <button
                  key={depth}
                  type="button"
                  onClick={() => setMaxDepth(depth)}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                    maxDepth === depth
                      ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-100"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  Level {depth}
                </button>
              ))}
            </div>
          </div>

          {/* Throttling Delay */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wide flex justify-between">
              <span>Jeda Tarik (Crawl Delay)</span>
              <span className="font-mono text-indigo-600">{delayMs}ms</span>
            </label>
            <input
              type="range"
              min="500"
              max="5000"
              step="500"
              value={delayMs}
              onChange={e => setDelayMs(Number(e.target.value))}
              className="w-full accent-indigo-600"
            />
            <p className="text-[10px] text-slate-400">
              Semakin lambat semakin ramah ("polite crawler") untuk mematuhi pembatasan rate server target.
            </p>
          </div>

          {/* Toggle Respect Robots.txt */}
          <div className="flex items-center justify-between p-3 bg-slate-50/50 rounded-2xl border border-slate-100">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-slate-700 block">Patuhi Robots.txt</span>
              <span className="text-[10px] text-slate-400 block">Identifikasi & lewati Disallow</span>
            </div>
            <button
              onClick={() => setRespectRobots(!respectRobots)}
              className={`w-11 h-6 rounded-full p-1 transition-all ${
                respectRobots ? "bg-indigo-600 flex justify-end" : "bg-slate-300 flex justify-start"
              }`}
            >
              <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
            </button>
          </div>

          {/* Toggle Gemini AI extraction */}
          <div className="flex items-center justify-between p-3 bg-indigo-50/30 rounded-2xl border border-indigo-50/50">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-indigo-950 block">Ekstraksi Glosarium AI</span>
              <span className="text-[10px] text-indigo-500 block">Gunakan Gemini untuk ekstrak arti</span>
            </div>
            <button
              onClick={() => setAiExtraction(!aiExtraction)}
              className={`w-11 h-6 rounded-full p-1 transition-all ${
                aiExtraction ? "bg-indigo-600 flex justify-end" : "bg-slate-300 flex justify-start"
              }`}
            >
              <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
            </button>
          </div>

          {/* Trigger button */}
          <button
            onClick={handleStartCrawl}
            disabled={isCrawling}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.01]"
          >
            {isCrawling ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Play className="w-4 h-4 fill-current" />
            )}
            <span>{isCrawling ? "Sedang Merayap..." : "Jalankan Crawler Sekarang"}</span>
          </button>
        </div>
      </div>

      {/* Terminal Log Console */}
      <div className="lg:col-span-2 flex flex-col space-y-4">
        {/* Terminal frame */}
        <div className="flex-1 bg-slate-950 text-emerald-400 font-mono text-xs rounded-3xl p-6 shadow-2xl border border-slate-900 flex flex-col min-h-[400px]">
          {/* Header bar */}
          <div className="flex items-center justify-between border-b border-slate-900 pb-3 mb-4 shrink-0 text-slate-500">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-500" />
              <span className="font-bold text-slate-300">Crawler Terminal Log Console</span>
            </div>
            <div className="flex gap-1.5">
              <span className="w-3.5 h-3.5 rounded-full bg-red-500/20" />
              <span className="w-3.5 h-3.5 rounded-full bg-yellow-500/20" />
              <span className="w-3.5 h-3.5 rounded-full bg-green-500/20" />
            </div>
          </div>

          {/* Log Lines Area */}
          <div className="flex-1 overflow-y-auto space-y-1.5 pr-2 max-h-[350px]">
            {liveLogs.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-600 space-y-2">
                <Terminal className="w-8 h-8 opacity-40 animate-pulse" />
                <p>Terminal siap. Masukkan seed URL dan jalankan crawler untuk melihat log data.</p>
              </div>
            ) : (
              liveLogs.map((log, index) => {
                let colorClass = "text-emerald-400";
                if (log.includes("[ERROR]")) colorClass = "text-red-400 font-bold";
                if (log.includes("[SYSTEM]")) colorClass = "text-blue-400";
                if (log.includes("PERINGATAN:")) colorClass = "text-yellow-500";
                
                return (
                  <div key={index} className={`${colorClass} leading-relaxed`}>
                    {log}
                  </div>
                );
              })
            )}
            <div ref={terminalEndRef} />
          </div>
        </div>

        {/* Dynamic indexing stats widgets */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Page count */}
          <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm flex items-center gap-3">
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                Halaman Terindeks
              </span>
              <span className="text-xl font-black text-slate-800">
                {stats ? stats.totalPagesCrawled : 0}
              </span>
            </div>
          </div>

          {/* Terms count */}
          <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm flex items-center gap-3">
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                Glosari Terindeks
              </span>
              <span className="text-xl font-black text-slate-800">
                {stats ? stats.totalIndexedTerms : 0}
              </span>
            </div>
          </div>

          {/* Languages stats */}
          <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm flex items-center gap-3">
            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
              <Award className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                Indeks 3 Bahasa
              </span>
              <div className="flex items-center gap-2 mt-0.5 font-mono text-[11px] text-slate-600">
                <span>ID:{stats?.languagesIndexed?.id || 0}</span>
                <span>•</span>
                <span>EN:{stats?.languagesIndexed?.en || 0}</span>
                <span>•</span>
                <span>AR:{stats?.languagesIndexed?.ar || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
