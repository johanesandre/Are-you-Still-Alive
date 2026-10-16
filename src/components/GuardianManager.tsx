import React, { useState } from 'react';
import {
  Users,
  Plus,
  ShieldCheck,
  Mail,
  Phone,
  UserCheck,
  AlertCircle,
  Lock,
  HeartHandshake,
  Trash2,
} from 'lucide-react';
import { Guardian } from '../types';

interface GuardianManagerProps {
  guardians: Guardian[];
  setGuardians: React.Dispatch<React.SetStateAction<Guardian[]>>;
}

export const GuardianManager: React.FC<GuardianManagerProps> = ({
  guardians,
  setGuardians,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newGuardian, setNewGuardian] = useState<{
    name: string;
    relationship: string;
    email: string;
    phone: string;
    role: 'Kuasa Utama' | 'Kuasa Sekunder' | 'Kuasa Kenangan';
  }>({
    name: '',
    relationship: '',
    email: '',
    phone: '',
    role: 'Kuasa Utama',
  });

  const handleAddGuardian = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuardian.name.trim()) return;

    const created: Guardian = {
      id: `g-${Date.now()}`,
      name: newGuardian.name,
      relationship: newGuardian.relationship || 'Keluarga',
      email: newGuardian.email,
      phone: newGuardian.phone,
      role: newGuardian.role,
      status: 'Terverifikasi',
      assigned_vault_count: 0,
    };

    setGuardians((prev) => [...prev, created]);
    setIsModalOpen(false);
    setNewGuardian({
      name: '',
      relationship: '',
      email: '',
      phone: '',
      role: 'Kuasa Utama',
    });
  };

  const handleDelete = (id: string) => {
    if (guardians.length <= 1) {
      alert('Minimal harus ada 1 wali (Guardian) terdaftar untuk menjaga amanah Anda.');
      return;
    }
    setGuardians((prev) => prev.filter((g) => g.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-md">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-teal-500/20 text-teal-300 border border-teal-500/30">
              <Users className="w-5 h-5 text-teal-400" />
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Daftar Wali Terpercaya (Guardians)
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Orang-orang terkasih yang ditunjuk memegang kunci pembuka amanah dan menerima pemberitahuan santun dari Asisten AI.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-teal-950/60 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Wali Baru</span>
        </button>
      </div>

      {/* Role Explanation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
          <div className="flex items-center space-x-2 text-emerald-400 font-semibold text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Kuasa Utama (Primary Guardian)</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Menerima dokumen hukum, perbankan keluarga, dan asuransi jiwa. Memiliki wewenang eksekutif pertama saat klaim.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
          <div className="flex items-center space-x-2 text-amber-400 font-semibold text-xs">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>Kuasa Sekunder (Dual Control)</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Menjadi saksi verifikasi silang dan mendampingi aset berteknologi tinggi (kunci kripto, server bisnis).
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
          <div className="flex items-center space-x-2 text-rose-400 font-semibold text-xs">
            <span className="w-2 h-2 rounded-full bg-rose-400" />
            <span>Kuasa Kenangan (Memorial Guardian)</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Dipercaya mengelola surat-surat pribadi, arsip kenangan foto keluarga, serta pesan khusus untuk masa depan anak.
          </p>
        </div>
      </div>

      {/* Guardians Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {guardians.map((guardian) => {
          return (
            <div
              key={guardian.id}
              className="p-5 sm:p-6 rounded-2xl bg-slate-900/70 border border-slate-800 shadow-lg flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white">{guardian.name}</h3>
                    <p className="text-xs text-slate-400">{guardian.relationship}</p>
                  </div>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                      guardian.role === 'Kuasa Utama'
                        ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-800/40'
                        : guardian.role === 'Kuasa Sekunder'
                        ? 'bg-amber-950/70 text-amber-300 border border-amber-800/40'
                        : 'bg-rose-950/70 text-rose-300 border border-rose-800/40'
                    }`}
                  >
                    {guardian.role}
                  </span>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-800 text-xs text-slate-300">
                  <div className="flex items-center space-x-2 text-slate-400">
                    <Mail className="w-3.5 h-3.5 text-slate-500" />
                    <span>{guardian.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-400">
                    <Phone className="w-3.5 h-3.5 text-slate-500" />
                    <span>{guardian.phone}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Amanah Dokumen:</span>
                  <span className="font-mono font-bold text-emerald-400">
                    {guardian.assigned_vault_count || 1} Item Brankas
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-1.5 text-emerald-400">
                  <ShieldCheck className="w-4 h-4" />
                  <span>{guardian.status}</span>
                </div>
                <button
                  onClick={() => handleDelete(guardian.id)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 transition-colors"
                  title="Hapus Wali"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Guardian Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-700 p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Users className="w-4 h-4 text-teal-400" />
                <span>Tambah Wali Terpercaya Baru</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-200 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddGuardian} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nama Lengkap Wali *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Siti Rahmah"
                  value={newGuardian.name}
                  onChange={(e) => setNewGuardian({ ...newGuardian, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Hubungan / Kekerabatan *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Istri, Anak Pertama, Saudara Kandung"
                  value={newGuardian.relationship}
                  onChange={(e) => setNewGuardian({ ...newGuardian, relationship: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Peran Kuasa Amanah
                </label>
                <select
                  value={newGuardian.role}
                  onChange={(e) =>
                    setNewGuardian({
                      ...newGuardian,
                      role: e.target.value as any,
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-teal-500"
                >
                  <option value="Kuasa Utama">Kuasa Utama (Keuangan & Hukum)</option>
                  <option value="Kuasa Sekunder">Kuasa Sekunder (Teknis & Aset Digital)</option>
                  <option value="Kuasa Kenangan">Kuasa Kenangan (Surat & Kenangan Pribadi)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Alamat Email *
                </label>
                <input
                  type="email"
                  required
                  placeholder="email.wali@gmail.com"
                  value={newGuardian.email}
                  onChange={(e) => setNewGuardian({ ...newGuardian, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nomor WhatsApp / HP *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+62 812-xxxx-xxxx"
                  value={newGuardian.phone}
                  onChange={(e) => setNewGuardian({ ...newGuardian, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                />
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
                  className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold shadow-md transition-all"
                >
                  Simpan Wali
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
