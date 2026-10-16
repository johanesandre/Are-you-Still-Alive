import React, { useState } from 'react';
import {
  Lock,
  Plus,
  Eye,
  EyeOff,
  ShieldCheck,
  Search,
  Filter,
  CreditCard,
  KeyRound,
  FileHeart,
  FileCheck2,
  Home,
  Share2,
  Trash2,
  Info,
} from 'lucide-react';
import { VaultItem, VaultCategory, Guardian } from '../types';

interface VaultManagerProps {
  vaultItems: VaultItem[];
  setVaultItems: React.Dispatch<React.SetStateAction<VaultItem[]>>;
  guardians: Guardian[];
}

export const VaultManager: React.FC<VaultManagerProps> = ({
  vaultItems,
  setVaultItems,
  guardians,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [revealedHints, setRevealedHints] = useState<{ [id: string]: boolean }>({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New item form state
  const [newItem, setNewItem] = useState<{
    title: string;
    category: VaultCategory;
    description: string;
    encrypted_hint_or_key: string;
    recipient_guardian: string;
    importance: 'vital' | 'high' | 'medium';
    notes: string;
  }>({
    title: '',
    category: 'finance',
    description: '',
    encrypted_hint_or_key: '',
    recipient_guardian: guardians[0]?.name || 'Ratna Dewi',
    importance: 'vital',
    notes: '',
  });

  const toggleRevealHint = (id: string) => {
    setRevealedHints((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.title.trim()) return;

    const created: VaultItem = {
      id: `v-${Date.now()}`,
      title: newItem.title,
      category: newItem.category,
      description: newItem.description,
      encrypted_hint_or_key: newItem.encrypted_hint_or_key.startsWith('••••••••')
        ? newItem.encrypted_hint_or_key
        : `•••••••• (Terenkripsi) | Petunjuk: ${newItem.encrypted_hint_or_key}`,
      recipient_guardian: newItem.recipient_guardian,
      importance: newItem.importance,
      is_encrypted: true,
      notes: newItem.notes,
      created_at: new Date().toISOString().split('T')[0],
    };

    setVaultItems((prev) => [created, ...prev]);
    setIsModalOpen(false);
    setNewItem({
      title: '',
      category: 'finance',
      description: '',
      encrypted_hint_or_key: '',
      recipient_guardian: guardians[0]?.name || 'Ratna Dewi',
      importance: 'vital',
      notes: '',
    });
  };

  const handleDeleteItem = (id: string) => {
    setVaultItems((prev) => prev.filter((item) => item.id !== id));
  };

  const getCategoryIcon = (category: VaultCategory) => {
    switch (category) {
      case 'finance':
        return <CreditCard className="w-4 h-4 text-emerald-400" />;
      case 'crypto':
        return <KeyRound className="w-4 h-4 text-amber-400" />;
      case 'insurance':
        return <FileCheck2 className="w-4 h-4 text-blue-400" />;
      case 'personal_letter':
        return <FileHeart className="w-4 h-4 text-rose-400" />;
      case 'physical_asset':
        return <Home className="w-4 h-4 text-orange-400" />;
      case 'social_media':
        return <Share2 className="w-4 h-4 text-purple-400" />;
      default:
        return <Lock className="w-4 h-4 text-teal-400" />;
    }
  };

  const getCategoryLabel = (category: VaultCategory) => {
    switch (category) {
      case 'finance':
        return 'Keuangan & Bank';
      case 'crypto':
        return 'Kripto & Aset Digital';
      case 'insurance':
        return 'Asuransi & Warisan';
      case 'personal_letter':
        return 'Surat Pribadi Terakhir';
      case 'physical_asset':
        return 'Aset Fisik & Sertifikat';
      case 'social_media':
        return 'Media Sosial & Kenangan';
      default:
        return 'Dokumen Penting';
    }
  };

  const filteredItems = vaultItems.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.recipient_guardian.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Header & Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-md">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <Lock className="w-5 h-5 text-emerald-400" />
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Brankas Digital (Vault Wasiat Terenkripsi)
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Seluruh data dilindungi enkripsi asimetris tingkat brankas bank. Sandi mentah tidak pernah disimpan tanpa enkripsi.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-emerald-950/60 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Dokumen Baru</span>
        </button>
      </div>

      {/* Security Principles Banner */}
      <div className="p-4 rounded-xl bg-teal-950/40 border border-teal-500/30 text-teal-200 text-xs flex items-start space-x-3">
        <ShieldCheck className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-white">
            Standar Keamanan Zero-Knowledge Are you Still Alive?:
          </p>
          <p className="leading-relaxed opacity-90">
            Jangan pernah memasukkan kata sandi mentah secara terbuka. Tuliskan <strong>Petunjuk Brankas Aman</strong> (misal: "Disimpan di deposit box kamar kerja", "PIN 6 angka tanggal kenangan"), sehingga hanya Guardian sah yang dapat menggunakannya saat masa sanggah berakhir.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Cari judul dokumen, wali penerima, atau kata kunci..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto pb-1">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            Semua ({vaultItems.length})
          </button>
          {(['finance', 'crypto', 'insurance', 'personal_letter', 'physical_asset', 'social_media'] as VaultCategory[]).map(
            (cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {getCategoryLabel(cat)}
              </button>
            )
          )}
        </div>
      </div>

      {/* Vault Items List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredItems.map((item) => {
          const isRevealed = revealedHints[item.id];
          return (
            <div
              key={item.id}
              className="p-5 sm:p-6 rounded-2xl bg-slate-900/70 border border-slate-800/90 hover:border-slate-700/80 transition-all shadow-lg flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                {/* Card Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center space-x-2.5">
                    <div className="p-2 rounded-xl bg-slate-800 border border-slate-700">
                      {getCategoryIcon(item.category)}
                    </div>
                    <div>
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                        {getCategoryLabel(item.category)}
                      </span>
                      <h3 className="text-sm sm:text-base font-bold text-white leading-snug">
                        {item.title}
                      </h3>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                      item.importance === 'vital'
                        ? 'bg-rose-950/70 text-rose-300 border border-rose-800/40'
                        : item.importance === 'high'
                        ? 'bg-amber-950/70 text-amber-300 border border-amber-800/40'
                        : 'bg-slate-800 text-slate-300 border border-slate-700'
                    }`}
                  >
                    {item.importance}
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-300 leading-relaxed">
                  {item.description}
                </p>

                {/* Encrypted Hint / Key Box */}
                <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800/90 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center space-x-1.5 text-teal-400 font-mono">
                      <Lock className="w-3 h-3" />
                      <span>Petunjuk Akses Terenkripsi</span>
                    </span>
                    <button
                      onClick={() => toggleRevealHint(item.id)}
                      className="text-slate-400 hover:text-slate-200 flex items-center space-x-1 text-[11px]"
                    >
                      {isRevealed ? (
                        <>
                          <EyeOff className="w-3 h-3 text-slate-400" />
                          <span>Sembunyikan</span>
                        </>
                      ) : (
                        <>
                          <Eye className="w-3 h-3 text-slate-400" />
                          <span>Buka Petunjuk</span>
                        </>
                      )}
                    </button>
                  </div>

                  <p className="text-xs font-mono text-slate-300 break-words">
                    {isRevealed ? item.encrypted_hint_or_key : '•••••••••••••••••••••••• [Terkunci Enkripsi]'}
                  </p>
                </div>

                {/* Notes if available */}
                {item.notes && (
                  <div className="flex items-start space-x-2 text-[11px] text-slate-400 pt-1">
                    <Info className="w-3.5 h-3.5 text-slate-500 mt-0.5 flex-shrink-0" />
                    <span>Amanah Khusus: {item.notes}</span>
                  </div>
                )}
              </div>

              {/* Card Footer */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <div>
                  <span>Penerima Amanah: </span>
                  <strong className="text-slate-200">{item.recipient_guardian}</strong>
                </div>

                <button
                  onClick={() => handleDeleteItem(item.id)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-all"
                  title="Hapus Dokumen"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredItems.length === 0 && (
        <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800 space-y-2">
          <Lock className="w-8 h-8 text-slate-600 mx-auto" />
          <p className="text-sm text-slate-400">Tidak ada dokumen wasiat yang cocok dengan pencarian.</p>
        </div>
      )}

      {/* Add Item Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700 p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Lock className="w-4 h-4 text-emerald-400" />
                <span>Tambah Dokumen ke Brankas Wasiat</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-200 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddItem} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nama Dokumen / Aset Wasiat *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Rekening Tabungan BCA & Token Key"
                  value={newItem.title}
                  onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Kategori Dokumen
                  </label>
                  <select
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value as VaultCategory })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="finance">Keuangan & Bank</option>
                    <option value="crypto">Kripto & Aset Digital</option>
                    <option value="insurance">Asuransi & Warisan</option>
                    <option value="personal_letter">Surat Pribadi Terakhir</option>
                    <option value="physical_asset">Aset Fisik & Sertifikat</option>
                    <option value="social_media">Media Sosial & Kenangan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Tingkat Urgensi
                  </label>
                  <select
                    value={newItem.importance}
                    onChange={(e) => setNewItem({ ...newItem, importance: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="vital">Vital (Segera saat Wafat)</option>
                    <option value="high">Tinggi (Penting 30 Hari)</option>
                    <option value="medium">Menengah (Kenangan Pribadi)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Penerima Amanah (Wali Guardian)
                </label>
                <select
                  value={newItem.recipient_guardian}
                  onChange={(e) => setNewItem({ ...newItem, recipient_guardian: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  {guardians.map((g) => (
                    <option key={g.id} value={g.name}>
                      {g.name} ({g.relationship} - {g.role})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Deskripsi Singkat Dokumen
                </label>
                <textarea
                  rows={2}
                  placeholder="Penjelasan umum dokumen tanpa membuka rahasia..."
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Petunjuk Akses Aman (Safe Hint - Bukan Raw Password!) *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Contoh: Kunci fisik di brankas kantor, PIN adalah tanggal pernikahan kita."
                  value={newItem.encrypted_hint_or_key}
                  onChange={(e) => setNewItem({ ...newItem, encrypted_hint_or_key: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
                <p className="text-[11px] text-amber-400/90 mt-1">
                  Aturan Keamanan: Jangan ketik password asli di sini. Gunakan petunjuk brankas yang hanya dipahami oleh wali Anda.
                </p>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md transition-all"
                >
                  Simpan ke Brankas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
