import React, { useState } from 'react';
import {
  Heart,
  ShieldCheck,
  Mail,
  Lock,
  KeyRound,
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  ExternalLink,
  Download,
  Eye,
  EyeOff,
} from 'lucide-react';
import { Guardian, VaultItem, InactivitySettings, AiAgentResult } from '../types';

interface GuardianPortalSimulationProps {
  guardians: Guardian[];
  vaultItems: VaultItem[];
  settings: InactivitySettings;
  aiResult: AiAgentResult | null;
}

export const GuardianPortalSimulation: React.FC<GuardianPortalSimulationProps> = ({
  guardians,
  vaultItems,
  settings,
  aiResult,
}) => {
  const [selectedGuardian, setSelectedGuardian] = useState<Guardian>(guardians[0]);
  const [verificationCode, setVerificationCode] = useState('784-219');
  const [isVerified, setIsVerified] = useState(false);
  const [revealedKeys, setRevealedKeys] = useState<{ [id: string]: boolean }>({});

  const assignedItems = vaultItems.filter((item) =>
    item.recipient_guardian.toLowerCase().includes(selectedGuardian.name.toLowerCase())
  );

  const toggleKey = (id: string) => {
    setRevealedKeys((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (verificationCode.trim()) {
      setIsVerified(true);
    }
  };

  return (
    <div className="space-y-6">
      {/* Simulation Header */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-teal-500/20 text-teal-300 border border-teal-500/30">
              <Eye className="w-5 h-5 text-teal-400" />
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Simulasi Portal Penerima Amanah (Guardian View)
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Merasakan antarmuka yang akan dilihat oleh keluarga atau wali saat menerima pemberitahuan resmi dari Are you Still Alive?.
          </p>
        </div>

        {/* Guardian Switcher */}
        <div className="flex items-center space-x-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
          <span className="text-xs text-slate-400 pl-2">Lihat sebagai:</span>
          <select
            value={selectedGuardian.id}
            onChange={(e) => {
              const found = guardians.find((g) => g.id === e.target.value);
              if (found) {
                setSelectedGuardian(found);
                setIsVerified(false);
              }
            }}
            className="bg-slate-900 text-xs font-semibold text-emerald-300 px-3 py-1.5 rounded-lg border border-slate-700 focus:outline-none"
          >
            {guardians.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name} ({g.relationship})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Experience Container */}
      <div className="max-w-4xl mx-auto rounded-3xl bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 border border-slate-800 shadow-2xl p-6 sm:p-10 space-y-8">
        {/* Applet Header inside Guardian View */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-5">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-extrabold text-xs">
              AYA?
            </div>
            <div>
              <span className="text-sm font-bold text-white tracking-tight">
                Are you Still Alive? Safe Guardian Portal
              </span>
              <p className="text-[11px] text-slate-400">
                Pusat Penyampaian Amanah Terpercaya
              </p>
            </div>
          </div>
          <span className="text-xs px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300 font-mono">
            Protokol ID: #HDP-2026-904
          </span>
        </div>

        {/* Warm Message Card */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-950/20 via-slate-900 to-slate-900 border border-emerald-500/30 space-y-4">
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            <Heart className="w-4 h-4 text-emerald-400" />
            <span>Pesan Santun & Pendampingan</span>
          </div>

          <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
            {aiResult?.pesan_ke_guardian ||
              `Halo ${selectedGuardian.name}, kami dari aplikasi HIDUP? memberi tahu bahwa ${settings.userName} sudah tidak melakukan check-in selama ${settings.inactiveDays} hari. Sesuai amanah beliau, berikut kami lampirkan panduan akses untuk beberapa dokumen penting yang telah disiapkan khusus untuk Anda.`}
          </h3>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Kami memahami bahwa situasi ini mungkin membawa kekhawatiran dan duka bagi Anda dan keluarga.
            Sistem kami dirancang untuk memastikan Anda didampingi dengan rasa hormat, ketenangan, serta prosedur yang jelas dan aman.
          </p>
        </div>

        {/* Verification Stage */}
        {!isVerified ? (
          <div className="p-6 sm:p-8 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-5 text-center max-w-md mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-teal-400 mx-auto flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h4 className="text-sm sm:text-base font-bold text-white">
                Verifikasi Identitas Guardian
              </h4>
              <p className="text-xs text-slate-400">
                Masukkan kode otentikasi darurat yang telah dikirimkan ke <strong>{selectedGuardian.email}</strong> atau WhatsApp Anda.
              </p>
            </div>

            <form onSubmit={handleVerify} className="space-y-4">
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Contoh: 784-219"
                className="w-full text-center tracking-widest font-mono text-lg font-bold py-3 rounded-xl bg-slate-900 border border-slate-700 text-teal-300 focus:outline-none focus:border-teal-500"
              />

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-teal-950/60 transition-all"
              >
                Verifikasi & Buka Amanah Terenkripsi
              </button>
            </form>

            <p className="text-[11px] text-slate-500">
              Masa sanggah 48 jam tetap berlaku untuk mencegah pembukaan prematur jika pemilik akun sekadar lupa mengisi check-in.
            </p>
          </div>
        ) : (
          /* Verified State: Documents Unlocked with Safe Hints */
          <div className="space-y-6 animate-fadeIn">
            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between text-xs text-emerald-200">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>
                  Identitas Guardian <strong>{selectedGuardian.name}</strong> berhasil diverifikasi.
                </span>
              </div>
              <span className="font-mono text-[11px] text-emerald-400">Status: Sah Terbuka</span>
            </div>

            {/* List of Documents Assigned to Guardian */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Daftar Dokumen & Amanah Khusus untuk {selectedGuardian.name} ({assignedItems.length} Dokumen)
                </h4>
              </div>

              {assignedItems.length > 0 ? (
                assignedItems.map((item) => {
                  const isRevealed = revealedKeys[item.id];
                  return (
                    <div
                      key={item.id}
                      className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400">
                            {item.category}
                          </span>
                          <h5 className="text-sm font-bold text-white mt-0.5">{item.title}</h5>
                          <p className="text-xs text-slate-300 mt-1">{item.description}</p>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-slate-800 text-slate-300">
                          {item.importance}
                        </span>
                      </div>

                      {/* Safe Decrypted Hint */}
                      <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2">
                        <div className="flex items-center justify-between text-[11px] text-slate-400">
                          <span className="font-mono text-emerald-400 flex items-center space-x-1.5">
                            <KeyRound className="w-3.5 h-3.5" />
                            <span>Petunjuk Pembukaan Brankas:</span>
                          </span>
                          <button
                            onClick={() => toggleKey(item.id)}
                            className="text-slate-400 hover:text-white flex items-center space-x-1 text-[11px]"
                          >
                            {isRevealed ? (
                              <>
                                <EyeOff className="w-3 h-3" />
                                <span>Tutup</span>
                              </>
                            ) : (
                              <>
                                <Eye className="w-3 h-3" />
                                <span>Lihat Petunjuk</span>
                              </>
                            )}
                          </button>
                        </div>

                        <p className="font-mono text-slate-200">
                          {isRevealed
                            ? item.encrypted_hint_or_key
                            : '•••••••••••••••••••••••• [Klik Lihat Petunjuk Aman]'}
                        </p>
                      </div>

                      {item.notes && (
                        <div className="text-[11px] text-slate-400 border-t border-slate-800/80 pt-2">
                          Pesan Pribadi: <span className="text-slate-300">{item.notes}</span>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="p-8 text-center rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400">
                  Tidak ada dokumen khusus yang dialokasikan kepada wali ini.
                </div>
              )}
            </div>

            {/* Assistance hotline */}
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-slate-400 space-y-2">
              <p className="font-semibold text-white">Butuh Bimbingan Langsung?</p>
              <p className="leading-relaxed">
                Tim Pendamping Amanah HIDUP? siap memfasilitasi komunikasi keluarga dan membantu langkah pengurusan berkas ke bank atau notaris rekanan.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
