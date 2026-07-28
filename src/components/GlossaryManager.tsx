import React, { useState } from "react";
import { Plus, Search, Edit2, Trash2, BookOpen, AlertCircle, X, Check, Save } from "lucide-react";
import { GlossaryItem } from "../types";

interface GlossaryManagerProps {
  glossary: GlossaryItem[];
  onRefreshStats: () => void;
}

export default function GlossaryManager({ glossary, onRefreshStats }: GlossaryManagerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCat, setSelectedCat] = useState("All");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<GlossaryItem> | null>(null);

  // Form states
  const [term, setTerm] = useState("");
  const [termEn, setTermEn] = useState("");
  const [termAr, setTermAr] = useState("");
  const [defId, setDefId] = useState("");
  const [defEn, setDefEn] = useState("");
  const [defAr, setDefAr] = useState("");
  const [category, setCategory] = useState("Kecerdasan Buatan");
  const [pronounceAr, setPronounceAr] = useState("");
  const [contextId, setContextId] = useState("");
  const [contextEn, setContextEn] = useState("");
  const [contextAr, setContextAr] = useState("");
  const [keywords, setKeywords] = useState("");

  const handleOpenAdd = () => {
    setEditingItem(null);
    setTerm("");
    setTermEn("");
    setTermAr("");
    setDefId("");
    setDefEn("");
    setDefAr("");
    setCategory("Kecerdasan Buatan");
    setPronounceAr("");
    setContextId("");
    setContextEn("");
    setContextAr("");
    setKeywords("");
    setIsFormOpen(true);
  };

  const handleOpenEdit = (item: GlossaryItem) => {
    setEditingItem(item);
    setTerm(item.term || "");
    setTermEn(item.term_en || "");
    setTermAr(item.term_ar || "");
    setDefId(item.definition_id || "");
    setDefEn(item.definition_en || "");
    setDefAr(item.definition_ar || "");
    setCategory(item.category || "Kecerdasan Buatan");
    setPronounceAr(item.pronunciation_ar || "");
    setContextId(item.context_id || "");
    setContextEn(item.context_en || "");
    setContextAr(item.context_ar || "");
    setKeywords(item.keywords ? item.keywords.join(", ") : "");
    setIsFormOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!term || !termEn || !termAr || !defId || !defEn || !defAr) {
      alert("Please fill in term names and definitions in all 3 languages.");
      return;
    }

    const payload: Partial<GlossaryItem> = {
      term,
      term_en: termEn,
      term_ar: termAr,
      definition_id: defId,
      definition_en: defEn,
      definition_ar: defAr,
      category,
      pronunciation_ar: pronounceAr || undefined,
      context_id: contextId || undefined,
      context_en: contextEn || undefined,
      context_ar: contextAr || undefined,
      keywords: keywords ? keywords.split(",").map(k => k.trim()).filter(Boolean) : []
    };

    if (editingItem && editingItem.id) {
      payload.id = editingItem.id;
      payload.createdAt = editingItem.createdAt;
      payload.sourceUrl = editingItem.sourceUrl;
    }

    try {
      const response = await fetch("/api/glossary/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        setIsFormOpen(false);
        onRefreshStats();
      }
    } catch (err) {
      console.error("Save glossary failed:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus istilah ini dari glosarium?")) return;
    try {
      const response = await fetch(`/api/glossary/delete/${id}`, {
        method: "DELETE"
      });
      if (response.ok) {
        onRefreshStats();
      }
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const safeGlossary = glossary || [];
  const categories = ["All", ...Array.from(new Set(safeGlossary.map(g => g.category)))];

  const filteredGlossary = safeGlossary.filter(g => {
    const termLower = searchTerm.toLowerCase();
    const matchesSearch = g.term.toLowerCase().includes(termLower) ||
                          g.term_en.toLowerCase().includes(termLower) ||
                          g.term_ar.includes(searchTerm) ||
                          g.category.toLowerCase().includes(termLower);
    const matchesCat = selectedCat === "All" || g.category === selectedCat;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6 relative">
      {/* Table control bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
        <div className="flex flex-1 gap-3 max-w-xl">
          <div className="relative flex-1">
            <Search className="absolute top-1/2 left-3.5 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Cari istilah glosarium..."
              className="w-full bg-white border border-slate-200 focus:border-indigo-500 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none"
            />
          </div>
          <select
            value={selectedCat}
            onChange={e => setSelectedCat(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-sm focus:outline-none"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat === "All" ? "Semua Kategori" : cat}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-xl shadow-md shadow-indigo-100 flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Istilah Baru</span>
        </button>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredGlossary.length === 0 ? (
          <div className="md:col-span-2 bg-white rounded-3xl border border-slate-100 py-16 text-center text-slate-500">
            <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm">Glosarium kosong atau pencarian tidak mencocokkan hasil apa pun.</p>
          </div>
        ) : (
          filteredGlossary.map(item => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-100 hover:border-slate-200 p-5 shadow-sm hover:shadow flex gap-4 items-start justify-between transition-all"
            >
              <div className="space-y-3 flex-1">
                <div>
                  <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    {item.category}
                  </span>
                  <div className="flex flex-wrap gap-x-2 items-baseline mt-1.5">
                    <h4 className="font-extrabold text-slate-800 text-base">{item.term}</h4>
                    <span className="text-slate-400 text-xs font-medium">({item.term_en})</span>
                  </div>
                </div>

                <p className="text-slate-600 text-xs leading-relaxed line-clamp-2">
                  {item.definition_id}
                </p>

                {/* Arabic mini term */}
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-50 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">Arab:</span>
                  <span className="font-sans font-bold text-slate-800 text-sm">{item.term_ar}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2 shrink-0">
                <button
                  onClick={() => handleOpenEdit(item)}
                  className="p-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-indigo-600 rounded-lg transition-colors border border-slate-100/50 cursor-pointer"
                  title="Edit Istilah"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors border border-red-100/50 cursor-pointer"
                  title="Hapus Istilah"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Slide-over Form panel */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex justify-end">
          <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col animate-slide-in p-6 overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-lg">
                  {editingItem ? "Edit Istilah Glosarium" : "Tambah Istilah Baru"}
                </h3>
              </div>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSave} className="flex-1 space-y-6">
              {/* Category */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Kategori</label>
                <input
                  type="text"
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl px-3.5 py-2 text-sm focus:outline-none"
                  placeholder="Kecerdasan Buatan / Kesehatan Holistik / dll"
                  required
                />
              </div>

              {/* Row 1: Indonesian Term */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Istilah (Indonesia)</label>
                  <input
                    type="text"
                    value={term}
                    onChange={e => setTerm(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl px-3.5 py-2 text-sm focus:outline-none"
                    placeholder="Contoh: Pembelajaran Mesin"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Istilah (English)</label>
                  <input
                    type="text"
                    value={termEn}
                    onChange={e => setTermEn(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl px-3.5 py-2 text-sm focus:outline-none"
                    placeholder="Contoh: Machine Learning"
                    required
                  />
                </div>
              </div>

              {/* Arabic Term & Pronunciation */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5 text-right md:text-left">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block">Istilah (Arab)</label>
                  <input
                    type="text"
                    value={termAr}
                    onChange={e => setTermAr(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl px-3.5 py-2 text-sm focus:outline-none text-right"
                    placeholder="مثال: تعلم الآلة"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Pelafalan Arab (Fonetis)</label>
                  <input
                    type="text"
                    value={pronounceAr}
                    onChange={e => setPronounceAr(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl px-3.5 py-2 text-sm focus:outline-none"
                    placeholder="Contoh: ta'allum al-alah"
                  />
                </div>
              </div>

              {/* Definitions in 3 Languages */}
              <div className="space-y-4 border-t border-slate-100 pt-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Definisi (Indonesia)</label>
                  <textarea
                    rows={2}
                    value={defId}
                    onChange={e => setDefId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl px-3.5 py-2 text-xs focus:outline-none leading-relaxed"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Definisi (English)</label>
                  <textarea
                    rows={2}
                    value={defEn}
                    onChange={e => setDefEn(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl px-3.5 py-2 text-xs focus:outline-none leading-relaxed"
                    required
                  />
                </div>
                <div className="space-y-1.5 text-right md:text-left">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block">Definisi (Arab)</label>
                  <textarea
                    rows={2}
                    value={defAr}
                    onChange={e => setDefAr(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl px-3.5 py-2 text-xs focus:outline-none leading-relaxed text-right"
                    required
                  />
                </div>
              </div>

              {/* Contextual Examples in 3 Languages */}
              <div className="space-y-4 border-t border-slate-100 pt-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Konteks Kalimat Penggunaan (Opsional)</span>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Konteks (Indonesia)</label>
                  <input
                    type="text"
                    value={contextId}
                    onChange={e => setContextId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl px-3.5 py-2 text-xs focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Konteks (English)</label>
                  <input
                    type="text"
                    value={contextEn}
                    onChange={e => setContextEn(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl px-3.5 py-2 text-xs focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5 text-right md:text-left">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">Konteks (Arab)</label>
                  <input
                    type="text"
                    value={contextAr}
                    onChange={e => setContextAr(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl px-3.5 py-2 text-xs focus:outline-none text-right"
                  />
                </div>
              </div>

              {/* Keywords tags */}
              <div className="space-y-1.5 border-t border-slate-100 pt-4">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Keywords (Dipisah Koma)</label>
                <input
                  type="text"
                  value={keywords}
                  onChange={e => setKeywords(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl px-3.5 py-2 text-xs focus:outline-none"
                  placeholder="Contoh: machine learning, AI, data, model"
                />
              </div>

              {/* Submit panel */}
              <div className="pt-6 border-t border-slate-100 flex justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-semibold rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-xl shadow-md shadow-indigo-100 flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingItem ? "Perbarui Istilah" : "Simpan Istilah"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
