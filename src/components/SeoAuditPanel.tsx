import React, { useState, useEffect } from "react";
import { ShieldAlert, CheckCircle, AlertTriangle, Play, HelpCircle, Code, Save, FileText, Globe, RefreshCw, Download, ExternalLink } from "lucide-react";
import { motion } from "motion/react";
import { SeoConfig, SystemStats } from "../types";

interface SeoAuditPanelProps {
  stats: SystemStats | null;
  onRefreshStats: () => void;
}

export default function SeoAuditPanel({ stats, onRefreshStats }: SeoAuditPanelProps) {
  const [auditUrl, setAuditUrl] = useState("https://aiholistic.xyz/glossarium/");
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState<{
    score: number;
    checklist: { name: string; status: string; detail: string }[];
    recommendations: string[];
  } | null>(null);

  // Robots.txt editor state
  const [robotsTxt, setRobotsTxt] = useState("");
  const [isSavingRobots, setIsSavingRobots] = useState(false);
  const [robotsSavedMsg, setRobotsSavedMsg] = useState("");

  useEffect(() => {
    if (stats && stats.seoConfig) {
      setRobotsTxt(stats.seoConfig.robotsTxt || "");
    }
  }, [stats]);

  const handleRunAudit = async () => {
    setIsAuditing(true);
    try {
      const res = await fetch("/api/seo-analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: auditUrl })
      });
      if (res.ok) {
        const data = await res.json();
        setAuditResult(data);
      }
    } catch (err) {
      console.error("SEO Audit failed:", err);
    } finally {
      setIsAuditing(false);
    }
  };

  const handleSaveRobots = async () => {
    setIsSavingRobots(true);
    setRobotsSavedMsg("");
    try {
      const res = await fetch("/api/settings/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          seoConfig: {
            robotsTxt,
            sitemapActive: true
          }
        })
      });
      if (res.ok) {
        setRobotsSavedMsg("Robots.txt berhasil diperbarui secara serverless di /robots.txt!");
        setTimeout(() => setRobotsSavedMsg(""), 3000);
        onRefreshStats();
      }
    } catch (err) {
      console.error("Save robots failed:", err);
    } finally {
      setIsSavingRobots(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* SEO Analyzer Tool */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">SEO Auditor & Multi-Language Checker</h3>
              <p className="text-xs text-slate-400">Verifikasi kualitas meta, hreflang, dan densitas kata kunci AI</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="url"
              value={auditUrl}
              onChange={e => setAuditUrl(e.target.value)}
              className="w-full sm:flex-1 bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-none transition-colors min-w-0"
              placeholder="https://aiholistic.xyz/glossarium/"
            />
            <button
              onClick={handleRunAudit}
              disabled={isAuditing}
              className="w-full sm:w-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-700 text-white font-bold rounded-xl shadow-md shadow-indigo-100 flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0 min-h-[42px]"
            >
              {isAuditing ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Play className="w-4 h-4 fill-current" />
              )}
              <span>{isAuditing ? "Auditing..." : "Audit SEO"}</span>
            </button>
          </div>

          {/* Audit Result Display */}
          {auditResult && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6 pt-2 border-t border-slate-50"
            >
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-slate-50 p-6 rounded-3xl border border-slate-100">
                <div className="space-y-1 text-center sm:text-left">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Skor SEO</span>
                  <h4 className="text-4xl font-black text-slate-800">{auditResult.score}/100</h4>
                  <p className="text-xs text-slate-400">Tingkat optimasi ekstrem untuk crawling global</p>
                </div>
                {/* Horizontal Meter */}
                <div className="flex-1 w-full max-w-md h-3 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${
                      auditResult.score >= 90
                        ? "bg-emerald-500"
                        : auditResult.score >= 75
                        ? "bg-amber-500"
                        : "bg-red-500"
                    }`}
                    style={{ width: `${auditResult.score}%` }}
                  />
                </div>
              </div>

              {/* Checklist Grid */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Indikator SEO Teknis</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {auditResult.checklist.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-white border border-slate-100 rounded-2xl flex gap-3 items-start shadow-sm"
                    >
                      {item.status === "pass" ? (
                        <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                      ) : item.status === "warn" ? (
                        <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                      ) : (
                        <ShieldAlert className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <span className="font-bold text-slate-800 text-xs block">{item.name}</span>
                        <span className="text-[10px] text-slate-400 block leading-normal mt-0.5">{item.detail}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Gemini Recommendations list */}
              <div className="space-y-3 bg-indigo-50/50 border border-indigo-100/60 p-5 rounded-3xl">
                <h4 className="text-xs font-bold text-indigo-950 uppercase tracking-widest">Rekomendasi Cerdas Gemini AI</h4>
                <ul className="space-y-2.5 text-xs text-slate-700 leading-relaxed">
                  {auditResult.recommendations.map((rec, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-indigo-600 font-bold">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Robots.txt & Sitemap Side Controls */}
      <div className="space-y-6">
        {/* Robots.txt Widget */}
        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-50">
            <FileText className="w-4 h-4 text-indigo-500" />
            <h4 className="font-bold text-slate-800 text-sm">Robots.txt Editor</h4>
          </div>
          <p className="text-[10px] text-slate-400">
            Kontrol akses crawler mesin pencari luar (Googlebot, Bingbot) ke sistem serverless Anda.
          </p>
          <textarea
            rows={5}
            value={robotsTxt}
            onChange={e => setRobotsTxt(e.target.value)}
            className="w-full bg-slate-900 text-indigo-200 font-mono text-xs rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            placeholder="User-agent: *..."
          />
          <button
            onClick={handleSaveRobots}
            disabled={isSavingRobots}
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSavingRobots ? "Saving..." : "Simpan Robots.txt"}</span>
          </button>
          {robotsSavedMsg && (
            <span className="text-[10px] text-emerald-600 font-semibold block text-center animate-pulse">
              {robotsSavedMsg}
            </span>
          )}
        </div>

        {/* Sitemap.xml Widget */}
        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-50">
            <Code className="w-4 h-4 text-indigo-500" />
            <h4 className="font-bold text-slate-800 text-sm">Dynamic Sitemap.xml</h4>
          </div>
          <p className="text-[10px] text-slate-400">
            Sitemap dinamis yang menyertakan rel="alternate" hreflang (id, en, ar) untuk setiap glossary item. Sangat disukai oleh crawler Google untuk optimasi indeks wilayah internasional.
          </p>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 flex items-center justify-between text-xs font-medium text-slate-600">
            <span>Sitemap Status:</span>
            <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded font-semibold uppercase text-[10px]">
              Active (XML)
            </span>
          </div>

          <div className="flex gap-2.5 pt-1">
            <a
              href="/sitemap.xml"
              target="_blank"
              rel="noreferrer"
              className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Buka Xml</span>
            </a>
            <a
              href="/sitemap.xml"
              download="sitemap.xml"
              className="flex-1 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh Sitemap</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
