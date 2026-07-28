import React, { useState, useEffect } from "react";
import {
  Lock, Key, ShieldCheck, FileSpreadsheet, RefreshCw, Save, Plus, Trash2,
  Download, Upload, ExternalLink, Copy, Check, Sparkles, Settings, Eye,
  EyeOff, Search, Table, Sliders, CheckCircle2, AlertCircle, LogOut, Code,
  Layers, Database, ArrowRight, Palette, Globe, Server, Cpu
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { SystemStats, GlossaryItem } from "../types";

interface AdminDashboardProps {
  stats: SystemStats | null;
  onRefreshStats: () => void;
}

export default function AdminDashboard({ stats, onRefreshStats }: AdminDashboardProps) {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>("");
  const [pinError, setPinError] = useState<string | null>(null);
  const [showPin, setShowPin] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  // Admin PIN Settings
  const [newPin, setNewPin] = useState<string>("");
  const [confirmNewPin, setConfirmNewPin] = useState<string>("");
  const [pinChangeMsg, setPinChangeMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Session Timeout State (in minutes: 15, 30, 60, or 0 for session-only/on tab close)
  const [sessionTimeout, setSessionTimeout] = useState<number>(() => {
    const saved = localStorage.getItem("akomoda_session_timeout");
    return saved ? parseInt(saved, 10) : 30; // default 30 minutes
  });

  // Active Admin Sub-tab
  const [activeAdminTab, setActiveAdminTab] = useState<"sheets" | "editor" | "searchlogs" | "appscript" | "settings">("sheets");
  const [logFilter, setLogFilter] = useState<string>("");
  const [isClearingLogs, setIsClearingLogs] = useState<boolean>(false);

  const handleClearLogs = async () => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus seluruh riwayat log pencarian pengunjung?")) return;
    setIsClearingLogs(true);
    try {
      const res = await fetch("/api/admin/logs", { method: "DELETE" });
      if (res.ok) {
        onRefreshStats();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsClearingLogs(false);
    }
  };

  // Google Sheets Integration State
  const [sheetUrl, setSheetUrl] = useState<string>(stats?.web3Config?.googleSheetUrl || "");
  const [autoSync, setAutoSync] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncResult, setSyncResult] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Spreadsheet Live Editor State
  const [items, setItems] = useState<GlossaryItem[]>(stats?.glossary || []);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [draftRow, setDraftRow] = useState<Partial<GlossaryItem>>({});
  const [saveStatus, setSaveStatus] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isSavingRows, setIsSavingRows] = useState<boolean>(false);

  // New Item Row Modal/Form
  const [showAddRowModal, setShowAddRowModal] = useState<boolean>(false);
  const [newItem, setNewItem] = useState<Partial<GlossaryItem>>({
    term: "",
    term_en: "",
    term_ar: "",
    definition_id: "",
    definition_en: "",
    definition_ar: "",
    category: "Kecerdasan Buatan",
    keywords: []
  });

  // AppScript Code Copy Helper
  const [copiedScript, setCopiedScript] = useState<boolean>(false);

  // Verify PIN on load from localStorage and check session timestamp
  useEffect(() => {
    const savedPin = localStorage.getItem("akomoda_admin_pin");
    const lastActive = localStorage.getItem("akomoda_admin_last_active");
    const savedTimeout = parseInt(localStorage.getItem("akomoda_session_timeout") || "30", 10);

    if (savedPin) {
      if (savedTimeout > 0 && lastActive) {
        const elapsedMinutes = (Date.now() - parseInt(lastActive, 10)) / (1000 * 60);
        if (elapsedMinutes > savedTimeout) {
          // Session expired
          localStorage.removeItem("akomoda_admin_pin");
          localStorage.removeItem("akomoda_admin_last_active");
          setPinError(`Sesi Anda telah berakhir secara otomatis setelah ${savedTimeout} menit. Silakan masukkan PIN kembali.`);
          return;
        }
      }
      verifyPin(savedPin, true);
    }
  }, []);

  useEffect(() => {
    if (stats?.glossary) {
      setItems(stats.glossary);
    }
    if (stats?.web3Config?.googleSheetUrl) {
      setSheetUrl(stats.web3Config.googleSheetUrl);
    }
  }, [stats]);

  const verifyPin = async (pinToVerify: string, isAutoCheck = false) => {
    setIsVerifying(true);
    setPinError(null);
    try {
      const res = await fetch("/api/admin/verify-pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: pinToVerify })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsAuthenticated(true);
        localStorage.setItem("akomoda_admin_pin", pinToVerify);
        localStorage.setItem("akomoda_admin_last_active", Date.now().toString());
      } else {
        if (!isAutoCheck) {
          setPinError(data.error || "PIN/Password salah. Silakan coba lagi.");
        }
        localStorage.removeItem("akomoda_admin_pin");
        localStorage.removeItem("akomoda_admin_last_active");
      }
    } catch (err) {
      if (!isAutoCheck) {
        setPinError("Gagal menghubungkan ke server verifikasi.");
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pinInput.trim()) {
      setPinError("Masukkan PIN atau Password Admin!");
      return;
    }
    verifyPin(pinInput);
  };

  const handleLogout = () => {
    localStorage.removeItem("akomoda_admin_pin");
    localStorage.removeItem("akomoda_admin_last_active");
    setIsAuthenticated(false);
    setPinInput("");
  };

  const handleChangePin = async (e: React.FormEvent) => {
    e.preventDefault();
    setPinChangeMsg(null);

    if (newPin.length < 4) {
      setPinChangeMsg({ type: "error", text: "PIN/Password minimal 4 karakter!" });
      return;
    }
    if (newPin !== confirmNewPin) {
      setPinChangeMsg({ type: "error", text: "Konfirmasi PIN tidak cocok!" });
      return;
    }

    try {
      const currentPin = localStorage.getItem("akomoda_admin_pin") || pinInput;
      const res = await fetch("/api/admin/change-pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPin, newPin })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setPinChangeMsg({ type: "success", text: "PIN Admin berhasil diperbarui!" });
        localStorage.setItem("akomoda_admin_pin", newPin);
        setNewPin("");
        setConfirmNewPin("");
      } else {
        setPinChangeMsg({ type: "error", text: data.error || "Gagal memperbarui PIN." });
      }
    } catch (err) {
      setPinChangeMsg({ type: "error", text: "Terjadi kesalahan sistem saat memperbarui PIN." });
    }
  };

  const handleSaveSheetUrl = async () => {
    try {
      const res = await fetch("/api/settings/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          web3Config: {
            googleSheetUrl: sheetUrl,
            piAppId: stats?.web3Config?.piAppId || "",
            stellarNetwork: stats?.web3Config?.stellarNetwork || "testnet",
            xenMintTerm: stats?.web3Config?.xenMintTerm || 100
          }
        })
      });
      if (res.ok) {
        setSyncResult({ type: "success", text: "URL Google Sheets berhasil disimpan!" });
        onRefreshStats();
      } else {
        setSyncResult({ type: "error", text: "Gagal menyimpan URL Google Sheets." });
      }
    } catch (err) {
      setSyncResult({ type: "error", text: "Koneksi terputus saat menyimpan URL." });
    }
  };

  const handleSyncFromSheet = async () => {
    if (!sheetUrl) {
      setSyncResult({ type: "error", text: "Masukkan URL Google Sheets terlebih dahulu!" });
      return;
    }
    setIsSyncing(true);
    setSyncResult(null);

    try {
      const res = await fetch("/api/web3/sync-sheets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: sheetUrl })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSyncResult({ type: "success", text: data.message });
        onRefreshStats();
      } else {
        setSyncResult({ type: "error", text: data.error || "Gagal sinkronisasi data dari Google Sheets." });
      }
    } catch (err) {
      setSyncResult({ type: "error", text: "Kesalahan jaringan saat melakukan sinkronisasi." });
    } finally {
      setIsSyncing(false);
    }
  };

  // Live Spreadsheet Row Editing Functions
  const handleStartEdit = (item: GlossaryItem) => {
    setEditingRowId(item.id);
    setDraftRow({ ...item });
  };

  const handleCancelEdit = () => {
    setEditingRowId(null);
    setDraftRow({});
  };

  const handleSaveRow = async (id: string) => {
    setIsSavingRows(true);
    setSaveStatus(null);
    try {
      const updatedItems = items.map(item => (item.id === id ? ({ ...item, ...draftRow } as GlossaryItem) : item));
      const res = await fetch("/api/admin/save-glossary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: updatedItems })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setItems(updatedItems);
        setEditingRowId(null);
        setSaveStatus({ type: "success", text: "Baris data berhasil disimpan!" });
        onRefreshStats();
      } else {
        setSaveStatus({ type: "error", text: data.error || "Gagal menyimpan baris data." });
      }
    } catch (err) {
      setSaveStatus({ type: "error", text: "Terjadi kesalahan saat menyimpan data." });
    } finally {
      setIsSavingRows(false);
    }
  };

  const handleDeleteRow = async (id: string) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus istilah ini dari database?")) return;
    setIsSavingRows(true);
    try {
      const updatedItems = items.filter(item => item.id !== id);
      const res = await fetch("/api/admin/save-glossary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: updatedItems })
      });
      if (res.ok) {
        setItems(updatedItems);
        setSaveStatus({ type: "success", text: "Istilah berhasil dihapus." });
        onRefreshStats();
      }
    } catch (err) {
      setSaveStatus({ type: "error", text: "Gagal menghapus baris." });
    } finally {
      setIsSavingRows(false);
    }
  };

  const handleAddNewItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.term || !newItem.definition_id) {
      alert("Istilah (ID) dan Definisi (ID) wajib diisi!");
      return;
    }

    setIsSavingRows(true);
    try {
      const createdItem: GlossaryItem = {
        id: newItem.term.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
        term: newItem.term,
        term_en: newItem.term_en || newItem.term,
        term_ar: newItem.term_ar || newItem.term,
        definition_id: newItem.definition_id,
        definition_en: newItem.definition_en || newItem.definition_id,
        definition_ar: newItem.definition_ar || newItem.definition_id,
        category: newItem.category || "Kecerdasan Buatan",
        keywords: typeof newItem.keywords === "string" ? (newItem.keywords as string).split(",").map(k => k.trim()) : [newItem.term],
        createdAt: new Date().toISOString(),
        sourceUrl: "https://akomodanetwork.com"
      };

      const updatedItems = [createdItem, ...items];
      const res = await fetch("/api/admin/save-glossary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: updatedItems })
      });
      if (res.ok) {
        setItems(updatedItems);
        setShowAddRowModal(false);
        setNewItem({
          term: "",
          term_en: "",
          term_ar: "",
          definition_id: "",
          definition_en: "",
          definition_ar: "",
          category: "Kecerdasan Buatan",
          keywords: []
        });
        setSaveStatus({ type: "success", text: "Istilah baru berhasil ditambahkan!" });
        onRefreshStats();
      }
    } catch (err) {
      setSaveStatus({ type: "error", text: "Gagal menambahkan istilah baru." });
    } finally {
      setIsSavingRows(false);
    }
  };

  const handleExportCSV = () => {
    const headers = ["id", "term", "term_en", "term_ar", "definition_id", "definition_en", "definition_ar", "category", "keywords", "createdAt"];
    const csvRows = [headers.join(",")];

    items.forEach(item => {
      const row = [
        `"${item.id}"`,
        `"${(item.term || "").replace(/"/g, '""')}"`,
        `"${(item.term_en || "").replace(/"/g, '""')}"`,
        `"${(item.term_ar || "").replace(/"/g, '""')}"`,
        `"${(item.definition_id || "").replace(/"/g, '""')}"`,
        `"${(item.definition_en || "").replace(/"/g, '""')}"`,
        `"${(item.definition_ar || "").replace(/"/g, '""')}"`,
        `"${(item.category || "").replace(/"/g, '""')}"`,
        `"${(item.keywords || []).join("; ").replace(/"/g, '""')}"`,
        `"${item.createdAt || ""}"`
      ];
      csvRows.push(row.join(","));
    });

    const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `akomoda_glossary_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const appsScriptCode = `// GOOGLE APPS SCRIPT DUA ARAH (AKOMODA NETWORK <-> GOOGLE SHEETS)
// Salin kode ini ke Google Sheets: Extensions > Apps Script

function doGet() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var rows = sheet.getDataRange().getValues();
  if (rows.length < 2) return ContentService.createTextOutput(JSON.stringify([])).setMimeType(ContentService.MimeType.JSON);
  
  var headers = rows[0];
  var data = [];
  
  for (var i = 1; i < rows.length; i++) {
    var row = rows[i];
    var record = {};
    for (var j = 0; j < headers.length; j++) {
      var headerKey = String(headers[j]).trim().toLowerCase();
      record[headerKey] = row[j];
    }
    data.push(record);
  }
  
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var payload = JSON.parse(e.postData.contents);
    
    // Jika format membawa 'items' array
    var items = payload.items || payload;
    if (!Array.isArray(items)) items = [items];
    
    sheet.clear();
    var headers = ["id", "term", "term_en", "term_ar", "definition_id", "definition_en", "definition_ar", "category"];
    sheet.appendRow(headers);
    
    items.forEach(function(item) {
      sheet.appendRow([
        item.id || "",
        item.term || "",
        item.term_en || "",
        item.term_ar || "",
        item.definition_id || "",
        item.definition_en || "",
        item.definition_ar || "",
        item.category || ""
      ]);
    });
    
    return ContentService.createTextOutput(JSON.stringify({ status: "success", count: items.length }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}`;

  const copyScript = () => {
    navigator.clipboard.writeText(appsScriptCode);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  // Categories list
  const categories = Array.from(new Set(items.map(i => i.category || "Umum")));

  // Filtered rows
  const filteredItems = items.filter(item => {
    const matchesCategory = selectedCategory === "ALL" || item.category === selectedCategory;
    const matchesSearch =
      searchTerm === "" ||
      item.term?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.definition_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.term_en?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // PIN Lock Authentication Gateway View
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-12 bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-indigo-50 border border-indigo-200 rounded-2xl flex items-center justify-center mx-auto text-indigo-600 shadow-inner">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Dashboard Admin & Management
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Proteksi Akses PIN/Password untuk Pengaturan Google Sheets, Live Editor Spreadsheet, dan Konfigurasi Sistem.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              PIN / Password Admin
            </label>
            <div className="relative">
              <input
                type={showPin ? "text" : "password"}
                value={pinInput}
                onChange={e => setPinInput(e.target.value)}
                placeholder="Masukkan PIN (Default: 2211)"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono text-sm tracking-widest focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              *PIN bawaan sistem: <strong className="font-mono text-slate-700">2211</strong> (Dapat diubah setelah masuk)
            </p>
          </div>

          {pinError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{pinError}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isVerifying}
            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl text-xs uppercase tracking-wider transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {isVerifying ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Memverifikasi PIN...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Buka Dashboard Admin</span>
              </>
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-slate-100 text-center">
          <span className="text-[11px] text-slate-400 font-mono">
            Akomoda Network Control Hub • Cloud Run Protected
          </span>
        </div>
      </div>
    );
  }

  // Logged-in Admin Dashboard View
  return (
    <div className="space-y-6">
      {/* Top Admin Header Bar */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-indigo-500/20 text-indigo-300 font-extrabold text-[10px] rounded-full border border-indigo-500/30 uppercase tracking-widest flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-indigo-400" />
              <span>Session Terverifikasi</span>
            </span>
            <span className="text-slate-500 text-xs">•</span>
            <span className="text-emerald-400 text-xs font-mono font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Admin State
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <FileSpreadsheet className="w-6 h-6 text-indigo-400" />
            <span>Dashboard Admin & Integrasi Google Sheets</span>
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            Kelola sinkronisasi Google Sheets, editor data langsung (Spreadsheet Grid), konfigurasi webhook, dan proteksi akun Akomoda Network.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
            title="Unduh Database sebagai File CSV"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleLogout}
            className="px-3.5 py-2.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-rose-500/30"
          >
            <LogOut className="w-4 h-4 text-rose-400" />
            <span>Kunci / Logout</span>
          </button>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveAdminTab("sheets")}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
            activeAdminTab === "sheets"
              ? "bg-indigo-600 text-white shadow-md"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Pengaturan Google Sheets</span>
        </button>

        <button
          onClick={() => setActiveAdminTab("editor")}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
            activeAdminTab === "editor"
              ? "bg-indigo-600 text-white shadow-md"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <Table className="w-4 h-4" />
          <span>Live Spreadsheet Editor ({filteredItems.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab("searchlogs")}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
            activeAdminTab === "searchlogs"
              ? "bg-indigo-600 text-white shadow-md"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <Search className="w-4 h-4 text-sky-400" />
          <span>Log Pencarian Pengunjung ({stats?.logs?.length || stats?.searchQueriesLogged || 0})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab("appscript")}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
            activeAdminTab === "appscript"
              ? "bg-indigo-600 text-white shadow-md"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <Code className="w-4 h-4 text-amber-500" />
          <span>Google Apps Script Sync</span>
        </button>

        <button
          onClick={() => setActiveAdminTab("settings")}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
            activeAdminTab === "settings"
              ? "bg-indigo-600 text-white shadow-md"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <Key className="w-4 h-4 text-emerald-500" />
          <span>Ubah PIN / Keamanan</span>
        </button>
      </div>

      {/* TAB 1: GOOGLE SHEETS SETUP */}
      {activeAdminTab === "sheets" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
            <div className="space-y-1 border-b border-slate-100 pb-4">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                <span>Koneksi Google Sheets Endpoint</span>
              </h3>
              <p className="text-xs text-slate-500">
                Hubungkan tautan Google Spreadsheet publik / Apps Script Web App URL untuk mengimpor dan menyinkronkan data glosarium secara otomatis.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  URL Google Sheets / Apps Script Endpoint
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="url"
                    value={sheetUrl}
                    onChange={e => setSheetUrl(e.target.value)}
                    placeholder="https://docs.google.com/spreadsheets/d/... atau https://script.google.com/macros/s/..."
                    className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                  />
                  <button
                    onClick={handleSaveSheetUrl}
                    className="px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0"
                  >
                    <Save className="w-4 h-4" />
                    <span>Simpan URL</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                  Format yang didukung: <br />
                  1. <strong>Tautan Google Sheets Publik (CSV Publish)</strong>: File &gt; Share &gt; Publish to web &gt; Pilih CSV. <br />
                  2. <strong>Apps Script Web App URL</strong>: Web App URL hasil deployment kode Apps Script.
                </p>
              </div>

              {syncResult && (
                <div
                  className={`p-4 rounded-2xl border text-xs flex items-start gap-3 ${
                    syncResult.type === "success"
                      ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                      : "bg-rose-50 border-rose-200 text-rose-800"
                  }`}
                >
                  {syncResult.type === "success" ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  )}
                  <div className="leading-relaxed">
                    <p className="font-bold">{syncResult.type === "success" ? "Sinkronisasi Berhasil!" : "Gagal Sinkronisasi"}</p>
                    <p className="mt-0.5 text-xs">{syncResult.text}</p>
                  </div>
                </div>
              )}

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="autoSyncToggle"
                    checked={autoSync}
                    onChange={e => setAutoSync(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500 border-slate-300"
                  />
                  <label htmlFor="autoSyncToggle" className="text-xs font-bold text-slate-700 cursor-pointer">
                    Aktifkan Auto-Sync Otomatis
                  </label>
                </div>

                <button
                  onClick={handleSyncFromSheet}
                  disabled={isSyncing}
                  className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs uppercase tracking-wider transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  <RefreshCw className={`w-4 h-4 ${isSyncing ? "animate-spin" : ""}`} />
                  <span>{isSyncing ? "Menyinkronkan Data..." : "Tarik Data Sekarang (Sync Now)"}</span>
                </button>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-4 border border-slate-800 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="px-2.5 py-1 bg-amber-500/20 text-amber-300 font-extrabold text-[10px] rounded-full border border-amber-500/30 uppercase tracking-widest flex items-center gap-1 w-max">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Fitur Otomatis AI Gemini</span>
              </span>
              <h4 className="text-base font-bold text-white">
                Penerjemah & Enrichment AI Otomatis
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Saat Anda menarik data dari Google Sheets, AI Gemini secara otomatis melengkapi penerjemahan 3 bahasa (ID, EN, AR), menyusun Schema JSON-LD, dan generate konteks kalimat jika kolom kosong!
              </p>
            </div>

            <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-400 font-mono text-[11px]">
                <span>Status Google Sheets API:</span>
                <span className="text-emerald-400 font-bold">TERHUBUNG</span>
              </div>
              <div className="flex items-center justify-between text-slate-400 font-mono text-[11px]">
                <span>Total Data Tersedia:</span>
                <span className="text-white font-bold">{items.length} Istilah</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: LIVE SPREADSHEET EDITOR TABLE */}
      {activeAdminTab === "editor" && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Table className="w-5 h-5 text-indigo-600" />
                <span>Live Spreadsheet Grid Editor</span>
              </h3>
              <p className="text-xs text-slate-500">
                Edit cell data secara langsung seperti di Google Sheets. Perubahan akan langsung tersimpan di database Akomoda.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setShowAddRowModal(true)}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Baris Baru</span>
              </button>
            </div>
          </div>

          {/* Search & Category Filter */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Cari istilah, kosa kata, atau definisi di spreadsheet..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="w-full sm:w-auto px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="ALL">Semua Kategori ({items.length})</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {saveStatus && (
            <div
              className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                saveStatus.type === "success"
                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                  : "bg-rose-50 text-rose-800 border border-rose-200"
              }`}
            >
              {saveStatus.type === "success" ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              <span>{saveStatus.text}</span>
            </div>
          )}

          {/* Interactive Table Grid */}
          <div className="overflow-x-auto border border-slate-200 rounded-2xl shadow-inner max-h-[500px]">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-100 text-slate-700 font-extrabold uppercase text-[10px] tracking-wider sticky top-0 z-10 border-b border-slate-200">
                <tr>
                  <th className="p-3 border-r border-slate-200 w-12 text-center">No</th>
                  <th className="p-3 border-r border-slate-200 min-w-[160px]">Istilah (ID)</th>
                  <th className="p-3 border-r border-slate-200 min-w-[140px]">Term (EN)</th>
                  <th className="p-3 border-r border-slate-200 min-w-[140px]">Term (AR)</th>
                  <th className="p-3 border-r border-slate-200 min-w-[140px]">Kategori</th>
                  <th className="p-3 border-r border-slate-200 min-w-[280px]">Definisi (ID)</th>
                  <th className="p-3 text-center min-w-[100px]">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {filteredItems.map((item, idx) => {
                  const isEditing = editingRowId === item.id;
                  return (
                    <tr key={item.id} className={isEditing ? "bg-amber-50/60" : "hover:bg-slate-50/80 transition-colors"}>
                      <td className="p-3 border-r border-slate-200 text-center font-mono text-slate-400 text-[11px]">
                        {idx + 1}
                      </td>

                      <td className="p-2 border-r border-slate-200">
                        {isEditing ? (
                          <input
                            type="text"
                            value={draftRow.term || ""}
                            onChange={e => setDraftRow({ ...draftRow, term: e.target.value })}
                            className="w-full p-1.5 bg-white border border-indigo-300 rounded font-bold text-slate-900 text-xs focus:ring-2 focus:ring-indigo-500"
                          />
                        ) : (
                          <span className="font-extrabold text-slate-900">{item.term}</span>
                        )}
                      </td>

                      <td className="p-2 border-r border-slate-200">
                        {isEditing ? (
                          <input
                            type="text"
                            value={draftRow.term_en || ""}
                            onChange={e => setDraftRow({ ...draftRow, term_en: e.target.value })}
                            className="w-full p-1.5 bg-white border border-indigo-300 rounded text-slate-800 text-xs"
                          />
                        ) : (
                          <span className="text-slate-600 font-medium">{item.term_en}</span>
                        )}
                      </td>

                      <td className="p-2 border-r border-slate-200">
                        {isEditing ? (
                          <input
                            type="text"
                            value={draftRow.term_ar || ""}
                            onChange={e => setDraftRow({ ...draftRow, term_ar: e.target.value })}
                            className="w-full p-1.5 bg-white border border-indigo-300 rounded text-slate-800 text-xs font-serif"
                            dir="rtl"
                          />
                        ) : (
                          <span className="text-slate-700 font-serif font-bold">{item.term_ar}</span>
                        )}
                      </td>

                      <td className="p-2 border-r border-slate-200">
                        {isEditing ? (
                          <input
                            type="text"
                            value={draftRow.category || ""}
                            onChange={e => setDraftRow({ ...draftRow, category: e.target.value })}
                            className="w-full p-1.5 bg-white border border-indigo-300 rounded text-slate-800 text-xs"
                          />
                        ) : (
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-700 font-semibold rounded text-[10px] border border-slate-200">
                            {item.category}
                          </span>
                        )}
                      </td>

                      <td className="p-2 border-r border-slate-200">
                        {isEditing ? (
                          <textarea
                            value={draftRow.definition_id || ""}
                            onChange={e => setDraftRow({ ...draftRow, definition_id: e.target.value })}
                            className="w-full p-1.5 bg-white border border-indigo-300 rounded text-slate-800 text-xs h-16"
                          />
                        ) : (
                          <p className="text-slate-600 line-clamp-2 text-xs leading-relaxed">{item.definition_id}</p>
                        )}
                      </td>

                      <td className="p-2 text-center">
                        {isEditing ? (
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => handleSaveRow(item.id)}
                              disabled={isSavingRows}
                              className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors cursor-pointer"
                              title="Simpan Baris Ini"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="p-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg transition-colors cursor-pointer"
                              title="Batal"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => handleStartEdit(item)}
                              className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-lg text-[10px] border border-indigo-200 transition-colors cursor-pointer"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteRow(item.id)}
                              className="p-1 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition-colors cursor-pointer border border-rose-200"
                              title="Hapus"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2.5: VISITOR SEARCH LOGS */}
      {activeAdminTab === "searchlogs" && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Search className="w-5 h-5 text-sky-500" />
                <span>Log Akses & Pencarian Pengunjung</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Memantau setiap kata kunci yang dicari oleh pengunjung secara real-time, bahasa terdeteksi, jumlah hasil, dan penjelasan AI.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onRefreshStats}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Segarkan Log</span>
              </button>
              <button
                onClick={handleClearLogs}
                disabled={isClearingLogs || !stats?.logs?.length}
                className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-rose-200 disabled:opacity-50"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                <span>Hapus Semua Log</span>
              </button>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={logFilter}
                onChange={e => setLogFilter(e.target.value)}
                placeholder="Cari log berdasarkan kata kunci, penjelasan AI, atau bahasa..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            {logFilter && (
              <button
                onClick={() => setLogFilter("")}
                className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold"
              >
                Reset
              </button>
            )}
          </div>

          {/* Log Table / List */}
          {(!stats?.logs || stats.logs.length === 0) ? (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <Search className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-700">Belum Ada Log Pencarian Pengunjung</p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                Log pencarian akan tercatat secara otomatis saat pengunjung mengetik dan melakukan pencarian kata kunci di menu #pencarian.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-white font-extrabold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3">Waktu Akses</th>
                    <th className="p-3">Kata Kunci / Query</th>
                    <th className="p-3 text-center">Bahasa</th>
                    <th className="p-3 text-center">Hasil</th>
                    <th className="p-3">Ringkasan / Penjelasan AI Gemini</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {stats.logs
                    .filter(log => {
                      if (!logFilter) return true;
                      const q = logFilter.toLowerCase();
                      return (
                        log.query.toLowerCase().includes(q) ||
                        log.languageDetected?.toLowerCase().includes(q) ||
                        log.aiExplanation?.toLowerCase().includes(q)
                      );
                    })
                    .map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3 whitespace-nowrap font-mono text-[11px] text-slate-500">
                          {new Date(log.timestamp).toLocaleString("id-ID", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit"
                          })}
                        </td>
                        <td className="p-3 font-bold text-slate-900">
                          <span className="px-2.5 py-1 bg-indigo-50 text-indigo-800 rounded-lg border border-indigo-200/80 font-semibold">
                            "{log.query}"
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-700 font-extrabold rounded-md text-[10px] uppercase border border-slate-200">
                            {log.languageDetected || "id"}
                          </span>
                        </td>
                        <td className="p-3 text-center font-bold">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                            log.resultsCount > 0 ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                          }`}>
                            {log.resultsCount} item
                          </span>
                        </td>
                        <td className="p-3 text-slate-600 text-xs max-w-md">
                          {log.aiExplanation ? (
                            <p className="line-clamp-2 leading-relaxed">{log.aiExplanation}</p>
                          ) : (
                            <span className="text-slate-400 italic">Pencarian Rule-based (Standar)</span>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: GOOGLE APPS SCRIPT TUTORIAL & CODE */}
      {activeAdminTab === "appscript" && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="space-y-1 border-b border-slate-100 pb-4">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Code className="w-5 h-5 text-amber-500" />
              <span>Panduan Kode Google Apps Script (2-Way Auto Sync)</span>
            </h3>
            <p className="text-xs text-slate-500">
              Gunakan skrip di bawah ini untuk membuat endpoint API Google Sheets sendiri agar perubahan di Google Sheets langsung terhubung 2 arah dengan Akomoda.
            </p>
          </div>

          <div className="space-y-4">
            <ol className="list-decimal list-inside space-y-2 text-xs text-slate-700 leading-relaxed font-medium">
              <li>Buka Google Spreadsheet milik Anda.</li>
              <li>Klik menu <strong>Extensions &gt; Apps Script</strong>.</li>
              <li>Hapus semua kode lama, lalu tempelkan (paste) kode di bawah ini.</li>
              <li>
                Klik <strong>Deploy &gt; New deployment</strong>, pilih type <strong>Web app</strong>, atur <em>"Who has access"</em> ke <strong>Anyone</strong>.
              </li>
              <li>Salin URL Web App hasil deploy dan masukkan di tab <strong>Pengaturan Google Sheets</strong> di atas!</li>
            </ol>

            <div className="relative">
              <pre className="bg-slate-950 text-emerald-400 p-4 rounded-2xl text-[11px] font-mono overflow-x-auto max-h-72 border border-slate-800 leading-relaxed">
                {appsScriptCode}
              </pre>

              <button
                onClick={copyScript}
                className="absolute top-3 right-3 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700 shadow-sm"
              >
                {copiedScript ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedScript ? "Tersalin!" : "Salin Skrip"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: CHANGE PIN & SECURITY */}
      {activeAdminTab === "settings" && (
        <div className="max-w-xl mx-auto space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
            <div className="space-y-1 border-b border-slate-100 pb-4">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Key className="w-5 h-5 text-emerald-600" />
                <span>Ganti PIN / Password Admin</span>
              </h3>
              <p className="text-xs text-slate-500">
                Perbarui PIN keamanan untuk melindungi akses kontrol Akomoda Network.
              </p>
            </div>

            <form onSubmit={handleChangePin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  PIN / Password Baru
                </label>
                <input
                  type="password"
                  value={newPin}
                  onChange={e => setNewPin(e.target.value)}
                  placeholder="Masukkan PIN baru"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Konfirmasi PIN Baru
                </label>
                <input
                  type="password"
                  value={confirmNewPin}
                  onChange={e => setConfirmNewPin(e.target.value)}
                  placeholder="Ketik ulang PIN baru"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>

              {pinChangeMsg && (
                <div
                  className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                    pinChangeMsg.type === "success"
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                      : "bg-rose-50 text-rose-800 border border-rose-200"
                  }`}
                >
                  {pinChangeMsg.type === "success" ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                  <span>{pinChangeMsg.text}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
              >
                Simpan PIN Baru
              </button>
            </form>
          </div>

          {/* Session Timeout / Auto-Lock Duration Settings */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-4">
            <div className="space-y-1 border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Lock className="w-5 h-5 text-indigo-600" />
                <span>Pengaturan Auto-Lock & Durasi Sesi</span>
              </h3>
              <p className="text-xs text-slate-500">
                Pilih berapa lama sesi admin aktif sebelum sistem otomatis mengunci (logout) kembali.
              </p>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Batas Waktu Sesi (Session Timeout)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { value: 15, label: "15 Menit" },
                  { value: 30, label: "30 Menit" },
                  { value: 60, label: "1 Jam" },
                  { value: 0, label: "Manual Logout" }
                ].map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      setSessionTimeout(opt.value);
                      localStorage.setItem("akomoda_session_timeout", opt.value.toString());
                    }}
                    className={`py-3 px-3 rounded-xl font-bold text-xs border transition-all cursor-pointer ${
                      sessionTimeout === opt.value
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Sesi saat ini diset:{" "}
                  <strong className="text-slate-900">
                    {sessionTimeout === 0 ? "Manual Logout (Mengunci saat tombol logout diklik)" : `Auto-Lock setelah ${sessionTimeout} Menit`}
                  </strong>
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD NEW ROW */}
      {showAddRowModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 border border-slate-200 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-indigo-600" />
                <span>Tambah Istilah Baru ke Spreadsheet</span>
              </h3>
              <button onClick={() => setShowAddRowModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddNewItem} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Istilah (Bahasa Indonesia) *
                </label>
                <input
                  type="text"
                  value={newItem.term || ""}
                  onChange={e => setNewItem({ ...newItem, term: e.target.value })}
                  placeholder="Contoh: Komputasi Awan"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Term (Bahasa Inggris)</label>
                  <input
                    type="text"
                    value={newItem.term_en || ""}
                    onChange={e => setNewItem({ ...newItem, term_en: e.target.value })}
                    placeholder="Contoh: Cloud Computing"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Term (Bahasa Arab)</label>
                  <input
                    type="text"
                    value={newItem.term_ar || ""}
                    onChange={e => setNewItem({ ...newItem, term_ar: e.target.value })}
                    placeholder="الحوسبة السحابية"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-serif focus:ring-2 focus:ring-indigo-500"
                    dir="rtl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Kategori</label>
                <input
                  type="text"
                  value={newItem.category || ""}
                  onChange={e => setNewItem({ ...newItem, category: e.target.value })}
                  placeholder="Contoh: Kecerdasan Buatan / Web3 / Kesehatan"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Definisi Lengkap (Indonesia) *</label>
                <textarea
                  value={newItem.definition_id || ""}
                  onChange={e => setNewItem({ ...newItem, definition_id: e.target.value })}
                  placeholder="Tuliskan penjelasan definisi istilah secara lengkap..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs h-24 focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddRowModal(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSavingRows}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl text-xs transition-all shadow-md cursor-pointer"
                >
                  {isSavingRows ? "Menyimpan..." : "Simpan Istilah"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
