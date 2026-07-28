import React, { useState } from "react";
import { 
  Cpu, Coins, Layers, ExternalLink, Copy, Check, CheckCircle2, 
  RefreshCw, FileSpreadsheet, Server, Zap, Shield, Sparkles, BookOpen
} from "lucide-react";
import { motion } from "motion/react";
import { SystemStats } from "../types";

interface Web3GatewayProps {
  stats: SystemStats | null;
  onRefreshStats: () => void;
}

export default function Web3Gateway({ stats, onRefreshStats }: Web3GatewayProps) {
  const [copiedScript, setCopiedScript] = useState(false);
  const [copiedSheetCode, setCopiedSheetCode] = useState(false);
  const [googleSheetUrl, setGoogleSheetUrl] = useState(stats?.web3Config?.googleSheetUrl || "");
  const [piAppId, setPiAppId] = useState(stats?.web3Config?.piAppId || "");
  const [stellarNetwork, setStellarNetwork] = useState<"testnet" | "public">(stats?.web3Config?.stellarNetwork || "testnet");
  const [xenMintTerm, setXenMintTerm] = useState(stats?.web3Config?.xenMintTerm || 100);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  
  // Simulator State
  const [selectedNetwork, setSelectedNetwork] = useState<"xlm" | "pi" | "xen">("xlm");
  const [simulateAmount, setSimulateAmount] = useState<number>(100);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState<any>(null);

  // Sheets Sync simulation
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  const appsScriptCode = `// Google Apps Script untuk merilis data Google Sheets sebagai JSON API
function doGet() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var rows = sheet.getDataRange().getValues();
  var data = [];
  
  // Baris pertama diasumsikan sebagai Header (term, term_en, term_ar, definition_id, category, dll)
  var headers = rows[0];
  
  for (var i = 1; i < rows.length; i++) {
    var row = rows[i];
    var record = {};
    for (var j = 0; j < headers.length; j++) {
      record[headers[j]] = row[j];
    }
    data.push(record);
  }
  
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}`;

  const copyToClipboard = (text: string, isScript: boolean) => {
    navigator.clipboard.writeText(text);
    if (isScript) {
      setCopiedScript(true);
      setTimeout(() => setCopiedScript(false), 2000);
    } else {
      setCopiedSheetCode(true);
      setTimeout(() => setCopiedSheetCode(false), 2000);
    }
  };

  const handleSaveSettings = async () => {
    setSaveStatus("saving");
    try {
      const response = await fetch("/api/settings/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          web3Config: {
            googleSheetUrl,
            piAppId,
            stellarNetwork,
            xenMintTerm: Number(xenMintTerm)
          }
        })
      });
      if (response.ok) {
        setSaveStatus("success");
        setTimeout(() => setSaveStatus("idle"), 3000);
        onRefreshStats();
      } else {
        setSaveStatus("error");
      }
    } catch (err) {
      setSaveStatus("error");
    }
  };

  const handleSimulate = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      if (selectedNetwork === "xlm") {
        setSimulationResult({
          cost: "0.00001 XLM (~$0.000002 USD)",
          speed: "2.5 detik (Instan)",
          protocol: "Stellar Consensus Protocol (SCP)",
          advantage: "Biaya hampir nihil, dirancang untuk transaksi mikro global dan e-commerce UKM."
        });
      } else if (selectedNetwork === "pi") {
        setSimulationResult({
          cost: "0.01 Pi (~Internal Ecosystem Value)",
          speed: "3.2 detik",
          protocol: "Federated Byzantine Agreement (FBA) - Modifikasi Stellar",
          advantage: "Distribusi massa global dengan akses ramah seluler tanpa menyedot baterai."
        });
      } else {
        setSimulationResult({
          cost: "0.00 ETH (Hanya Gas Fee Minting)",
          speed: "Tergantung Ethereum Mainnet Congestion",
          protocol: "Proof of Participation (Adil Tanpa Investor Awal)",
          advantage: "Kedaulatan digital murni di mana tingkat kesulitan minting terus bertambah seiring waktu."
        });
      }
    }, 800);
  };

  const handleTestSync = async () => {
    if (!googleSheetUrl) {
      setSyncMessage("Silakan masukkan URL API Google Sheets Anda terlebih dahulu.");
      return;
    }
    setIsSyncing(true);
    setSyncMessage(null);
    
    try {
      const response = await fetch("/api/web3/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: googleSheetUrl })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setIsSyncing(false);
        setSyncMessage(data.message);
        onRefreshStats();
      } else {
        setIsSyncing(false);
        setSyncMessage(`Gagal sinkronisasi: ${data.error || "Terjadi kesalahan server."}`);
      }
    } catch (err: any) {
      setIsSyncing(false);
      setSyncMessage(`Koneksi terputus: ${err.message || "Gagal menghubungi API."}`);
    }
  };

  return (
    <div className="space-y-8" id="web3-gateway-root">
      
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 md:p-10 shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent pointer-events-none" />
        
        <div className="relative max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-xs font-bold border border-indigo-500/30 mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Gateway To Web2.5 & Web3 Authority Portal</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
            Menghubungkan Kecepatan Web2 dengan Kedaulatan Web3
          </h1>
          <p className="mt-4 text-slate-300 text-sm md:text-base leading-relaxed">
            Paradoks era digital saat ini adalah teknologinya semakin canggih berkat AI, tetapi perhatian manusia semakin terfragmentasi. 
            Sebagai solopreneur dan praktisi UKM, kita harus beralih dari mode "memonitor" menjadi "mengeksekusi" dengan mengintegrasikan 
            tiga jangkar Web3 utama: <span className="text-indigo-300 font-bold">Pi Network</span>, <span className="text-indigo-300 font-bold">Stellar (XLM)</span>, dan <span className="text-indigo-300 font-bold">XEN Network</span>.
          </p>
        </div>
      </div>

      {/* Grid: 3 Jangkar Web3 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Pi Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-black text-lg shadow-inner mb-4">
              Pi
            </div>
            <h3 className="text-lg font-bold text-slate-900">Pi Network</h3>
            <p className="text-xs text-slate-400 font-medium tracking-wide uppercase mt-1">Jalur Gerakan Massa (Mass Capture)</p>
            <p className="text-xs text-slate-500 leading-relaxed mt-3">
              Fokus pada adopsi seluler dan ramah pengguna. Pendekatan mobile-first berhasil mendobrak barikade psikologis masyarakat awam terhadap kripto. Ekosistem utilitas yang matang adalah gerbang masuk UKM.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between text-xs font-semibold text-amber-600">
            <span>SCP Consensus Derivative</span>
            <span className="bg-amber-50 px-2 py-0.5 rounded-full text-[10px]">Mobile-First</span>
          </div>
        </div>

        {/* Stellar Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-lg shadow-inner mb-4">
              XLM
            </div>
            <h3 className="text-lg font-bold text-slate-900">Stellar Lumens</h3>
            <p className="text-xs text-slate-400 font-medium tracking-wide uppercase mt-1">Jalur Rel Kereta Digital (Infrastructure)</p>
            <p className="text-xs text-slate-500 leading-relaxed mt-3">
              Fondasi teknis di balik Pi. Stellar Consensus Protocol (SCP) menghadirkan kecepatan super cepat, biaya transaksi mikro yang sangat murah (dekat nol), dan kestabilan global untuk e-commerce modern.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between text-xs font-semibold text-blue-600">
            <span>Federated Byzantine (FBA)</span>
            <span className="bg-blue-50 px-2 py-0.5 rounded-full text-[10px]">Instant Settlement</span>
          </div>
        </div>

        {/* XEN Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-black text-lg shadow-inner mb-4">
              XEN
            </div>
            <h3 className="text-lg font-bold text-slate-900">XEN Network</h3>
            <p className="text-xs text-slate-400 font-medium tracking-wide uppercase mt-1">Prinsip Keadilan Murni (First Principles)</p>
            <p className="text-xs text-slate-500 leading-relaxed mt-3">
              Dirancang oleh mantan engineer awal Google (Jack Levin). XEN adalah representasi desentralisasi murni karena tidak memiliki pre-mint atau modal kapitalis sentral. Waktu dan partisipasi adalah raja.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between text-xs font-semibold text-purple-600">
            <span>Proof of Participation</span>
            <span className="bg-purple-50 px-2 py-0.5 rounded-full text-[10px]">Fair Allocation</span>
          </div>
        </div>

      </div>

      {/* Simulator Web3 Interaktif */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Smart Web2.5 Transaction & Consensus Simulator</h2>
            <p className="text-xs text-slate-400">Mensimulasikan performa arsitektur jaringan terpilih untuk efisiensi transaksi UKM</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Controls */}
          <div className="md:col-span-5 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Pilih Arsitektur Jaringan</label>
              <div className="grid grid-cols-3 gap-2">
                <button 
                  onClick={() => setSelectedNetwork("xlm")}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-bold text-center cursor-pointer transition-all ${
                    selectedNetwork === "xlm" 
                      ? "border-blue-500 bg-blue-50 text-blue-700" 
                      : "border-slate-150 hover:bg-slate-50 text-slate-600"
                  }`}
                >
                  Stellar XLM
                </button>
                <button 
                  onClick={() => setSelectedNetwork("pi")}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-bold text-center cursor-pointer transition-all ${
                    selectedNetwork === "pi" 
                      ? "border-amber-500 bg-amber-50 text-amber-700" 
                      : "border-slate-150 hover:bg-slate-50 text-slate-600"
                  }`}
                >
                  Pi Network
                </button>
                <button 
                  onClick={() => setSelectedNetwork("xen")}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-bold text-center cursor-pointer transition-all ${
                    selectedNetwork === "xen" 
                      ? "border-purple-500 bg-purple-50 text-purple-700" 
                      : "border-slate-150 hover:bg-slate-50 text-slate-600"
                  }`}
                >
                  XEN Protocol
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                Volume Transaksi Simulasi
              </label>
              <span className="text-xs text-slate-400">Berapa banyak transaksi harian e-commerce UKM?</span>
              <input 
                type="range" 
                min="10" 
                max="5000" 
                value={simulateAmount}
                onChange={(e) => setSimulateAmount(Number(e.target.value))}
                className="w-full mt-2 h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between text-[11px] font-bold text-slate-400 mt-1">
                <span>10 Transaksi</span>
                <span className="text-indigo-600 font-extrabold">{simulateAmount} Transaksi</span>
                <span>5000 Transaksi</span>
              </div>
            </div>

            <button
              onClick={handleSimulate}
              disabled={isSimulating}
              className="w-full py-3 bg-slate-900 hover:bg-slate-950 text-white rounded-xl text-xs font-bold cursor-pointer flex items-center justify-center gap-2 transition-all shadow-md shadow-slate-100 disabled:opacity-50"
            >
              {isSimulating ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Menganalisis Konsensus...</span>
                </>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5" />
                  <span>Kalkulasikan Efisiensi</span>
                </>
              )}
            </button>
          </div>

          {/* Result Terminal */}
          <div className="md:col-span-7 bg-slate-950 rounded-2xl p-5 font-mono text-xs text-emerald-400 flex flex-col justify-between border border-slate-800 shadow-inner min-h-[220px]">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Consensus Simulation Output</span>
                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
              </div>

              {simulationResult ? (
                <div className="space-y-3">
                  <p><span className="text-slate-500">{"$"} network_cost:</span> <span className="text-white font-semibold">{simulationResult.cost}</span></p>
                  <p><span className="text-slate-500">{"$"} average_speed:</span> <span className="text-white font-semibold">{simulationResult.speed}</span></p>
                  <p><span className="text-slate-500">{"$"} protocol_type:</span> <span className="text-indigo-300">{simulationResult.protocol}</span></p>
                  <p className="text-slate-300 leading-relaxed mt-2 pt-2 border-t border-slate-900">
                    <span className="text-emerald-500 font-bold">Kelebihan UKM:</span> {simulationResult.advantage}
                  </p>
                </div>
              ) : (
                <div className="text-slate-500 h-full flex flex-col items-center justify-center py-6 text-center">
                  <Sparkles className="w-8 h-8 text-slate-700 animate-bounce mb-2" />
                  <p>Tekan tombol "Kalkulasikan Efisiensi" untuk mensimulasikan biaya transaksi mikro dan kecepatan konsensus blockchain di atas.</p>
                </div>
              )}
            </div>
            
            <div className="text-[10px] text-slate-600 mt-4 pt-2 border-t border-slate-900 text-right">
              Powered by SCP & Proof-of-Participation First Principles
            </div>
          </div>

        </div>
      </div>

      {/* Database Google Sheets Integrator */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Google Sheets Setup Form */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Integrasi Database Google Sheets</h3>
              <p className="text-xs text-slate-400">Sinkronisasikan glosarium dan konten edukasi langsung dari cloud sheet spreadsheet</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                Google Sheets Webhook / API URL
              </label>
              <input 
                type="text"
                placeholder="https://script.google.com/macros/s/AKfycb.../exec"
                value={googleSheetUrl}
                onChange={(e) => setGoogleSheetUrl(e.target.value)}
                className="w-full text-xs font-mono py-2.5 px-3 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 bg-slate-50/50"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Masukkan URL hasil 'Deploy as Web App' dari Apps Script Anda. Isikan data glosarium di sana agar ter-sync otomatis.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Pi Application App ID
                </label>
                <input 
                  type="text"
                  placeholder="pi-app-sandbox-id"
                  value={piAppId}
                  onChange={(e) => setPiAppId(e.target.value)}
                  className="w-full text-xs font-mono py-2.5 px-3 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 bg-slate-50/50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Stellar Network Mode
                </label>
                <select
                  value={stellarNetwork}
                  onChange={(e) => setStellarNetwork(e.target.value as any)}
                  className="w-full text-xs font-semibold py-2.5 px-3 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 bg-slate-50/50"
                >
                  <option value="testnet">Testnet (Uji Coba)</option>
                  <option value="public">Public (Mainnet Stellar)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleSaveSettings}
                disabled={saveStatus === "saving"}
                className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center justify-center gap-1.5"
              >
                {saveStatus === "saving" ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <span>Simpan Konfigurasi</span>
                )}
              </button>

              <button
                onClick={handleTestSync}
                className="py-2.5 px-4 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin" : ""}`} />
                <span>Sync Now</span>
              </button>
            </div>

            {saveStatus === "success" && (
              <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-xl text-xs font-semibold flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Konfigurasi Web2.5 & Google Sheets berhasil disimpan ke database lokal!</span>
              </div>
            )}

            {syncMessage && (
              <div className="p-3.5 bg-blue-50 border border-blue-100 text-blue-800 rounded-xl text-xs leading-relaxed">
                {syncMessage}
              </div>
            )}

          </div>
        </div>

        {/* Copyable Guide for Apps Script */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-500" />
              <h4 className="font-bold text-slate-900 text-sm">Panduan Apps Script 3 Langkah</h4>
            </div>
            <button
              onClick={() => copyToClipboard(appsScriptCode, true)}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 cursor-pointer"
            >
              {copiedScript ? (
                <>
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span className="text-emerald-600">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy Script</span>
                </>
              )}
            </button>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            Ikuti petunjuk di bawah ini untuk menjadikan Google Sheets Anda sebagai API Endpoint gratis tanpa perlu server backend berbayar:
          </p>

          <ol className="text-xs text-slate-600 space-y-3 list-decimal list-inside pl-1 leading-relaxed">
            <li>
              Buat Google Sheet baru dan isikan baris pertama dengan kolom header: <br />
              <code className="bg-slate-100 px-1 py-0.5 rounded text-[10px] font-mono text-indigo-600">term, term_en, term_ar, definition_id, category</code>.
            </li>
            <li>
              Pilih menu <span className="font-bold text-slate-800">Extensions (Ekstensi) &gt; Apps Script</span> di Google Sheets Anda.
            </li>
            <li>
              Hapus kode default, paste skrip Apps Script yang telah Anda copy di atas, lalu klik tombol <span className="font-bold text-slate-800">Deploy &gt; New Deployment</span>. Pilih jenis <span className="font-bold text-slate-800">Web App</span>, atur akses "Who has access" ke <span className="font-bold text-slate-800">Anyone</span>, lalu salin URL Web App yang dihasilkan ke input form di samping.
            </li>
          </ol>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 font-mono text-[10px] overflow-x-auto text-slate-600 max-h-[120px] scrollbar-thin">
            <pre>{appsScriptCode}</pre>
          </div>
        </div>

      </div>

      {/* Panduan Deployment Multi-Host */}
      <div className="bg-slate-50 rounded-3xl p-6 md:p-8 border border-slate-200/40 space-y-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Server className="w-5 h-5 text-indigo-600" />
            <span>Panduan Deployment Multi-Host & Folder Subdirektori</span>
          </h3>
          <p className="text-xs text-slate-500 mt-1">Opsi langkah demi langkah yang cepat, efisien, dan ramah biaya solopreneur</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          <div className="bg-white p-4 rounded-xl border border-slate-200/50 space-y-2">
            <h4 className="font-bold text-xs text-indigo-600 uppercase">1. Hostinger</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Sangat cocok untuk folder <code className="bg-slate-100 px-1 rounded text-red-500">aiholistic.xyz/se/</code>. 
              Cukup build aplikasi, zip folder <code className="bg-indigo-50 px-1 rounded font-mono">dist/</code>, dan upload melalui File Manager Hostinger di direktori tersebut. Aset akan termuat secara relatif sempurna berkat konfigurasi base path kita.
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200/50 space-y-2">
            <h4 className="font-bold text-xs text-blue-600 uppercase">2. Domainesia</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Pilihan hosting lokal yang andal dengan cPanel terintegrasi. Anda dapat mengunggah file static ke folder <code className="bg-slate-100 px-1 rounded text-red-500">public_html/se/</code>. Gunakan node.js application manager jika ingin menjalankan server dinamis Express.
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200/50 space-y-2">
            <h4 className="font-bold text-xs text-sky-600 uppercase">3. IDCloudHost</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Mendukung deployment satu klik App Catalog untuk Node.js atau Docker. Anda dapat meluncurkan backend server dalam hitungan detik dengan integrasi database terpisah yang terjangkau bagi pelaku UKM di Indonesia.
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200/50 space-y-2">
            <h4 className="font-bold text-xs text-orange-600 uppercase">4. Cloudflare Pages</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Tercepat untuk Web Static! Hubungkan repository GitHub Anda, dan Cloudflare akan melakukan build & deploy secara otomatis secara gratis dengan perlindungan DDoS terkemuka dan jaringan edge server instan di seluruh dunia.
            </p>
          </div>

        </div>

        <div className="p-4 bg-indigo-50 border border-indigo-100/70 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-indigo-600 text-white rounded-xl mt-0.5">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <h5 className="font-bold text-xs text-indigo-950">Vite Base-Path Telah Dioptimalkan</h5>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Kami telah mengkonfigurasi file <code className="font-mono text-indigo-700 bg-indigo-100/50 px-1 rounded">vite.config.ts</code> dengan <code className="font-mono text-indigo-700 bg-indigo-100/50 px-1 rounded">base: './'</code> agar aset CSS/JS dapat termuat secara relatif sempurna tanpa memandang folder target tempat Anda meletakkan script.
              </p>
            </div>
          </div>
          <div className="text-right whitespace-nowrap">
            <span className="text-[10px] font-black uppercase text-indigo-600 tracking-wider bg-white border border-indigo-200 px-2 py-1 rounded-lg">Ready to build</span>
          </div>
        </div>

      </div>

    </div>
  );
}
