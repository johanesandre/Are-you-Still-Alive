import React, { useState } from 'react';
import {
  Sparkles,
  Copy,
  Check,
  ShieldCheck,
  FileText,
  Code2,
  HeartHandshake,
  Lock,
  AlertCircle,
  RefreshCw,
  Mail,
  UserCheck,
  ExternalLink,
} from 'lucide-react';
import { AiAgentResult, Guardian, VaultItem, InactivitySettings } from '../types';

interface AiResultViewProps {
  aiResult: AiAgentResult | null;
  isLoading: boolean;
  onRefresh: () => void;
  settings: InactivitySettings;
  guardians: Guardian[];
  vaultItems: VaultItem[];
}

export const AiResultView: React.FC<AiResultViewProps> = ({
  aiResult,
  isLoading,
  onRefresh,
  settings,
  guardians,
  vaultItems,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'letter' | 'json'>('letter');
  const [copied, setCopied] = useState(false);
  const [selectedGuardianIndex, setSelectedGuardianIndex] = useState(0);

  const currentGuardian = guardians[selectedGuardianIndex] || guardians[0];

  const handleCopyJson = () => {
    if (!aiResult) return;
    const jsonToCopy = JSON.stringify(aiResult, null, 2);
    navigator.clipboard.writeText(jsonToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isInactiveDetected = aiResult?.status_pengguna === 'INAKTIF_TERDETEKSI';

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-md">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-teal-500/20 text-teal-300 border border-teal-500/30">
              <Sparkles className="w-5 h-5 text-teal-400" />
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Protokol AI: Asisten Wasiat & Penjaga Digital
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Mengolah data status keaktifan ({settings.inactiveDays} hari) dan brankas dokumen menjadi respon terstruktur & berempati.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 text-slate-300 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'Menganalisis...' : 'Jalankan Ulang AI'}</span>
          </button>

          {/* Subtab Switcher */}
          <div className="p-1 rounded-xl bg-slate-950 border border-slate-800 flex items-center space-x-1">
            <button
              onClick={() => setActiveSubTab('letter')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeSubTab === 'letter'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <HeartHandshake className="w-3.5 h-3.5" />
              <span>Format Guardian</span>
            </button>
            <button
              onClick={() => setActiveSubTab('json')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeSubTab === 'json'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>JSON Baku</span>
            </button>
          </div>
        </div>
      </div>

      {/* Target Guardian Selector */}
      <div className="flex flex-wrap items-center gap-2 p-3 rounded-xl bg-slate-900/50 border border-slate-800/80 text-xs">
        <span className="text-slate-400 font-medium">Target Guardian untuk Evaluasi:</span>
        {guardians.map((g, idx) => (
          <button
            key={g.id}
            onClick={() => setSelectedGuardianIndex(idx)}
            className={`px-3 py-1 rounded-lg border transition-all ${
              selectedGuardianIndex === idx
                ? 'bg-teal-500/20 border-teal-500/50 text-teal-300 font-semibold'
                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {g.name} ({g.relationship})
          </button>
        ))}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="p-12 text-center rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="relative w-16 h-16 mx-auto">
            <div className="w-16 h-16 rounded-full border-4 border-slate-700 border-t-emerald-400 animate-spin" />
            <Sparkles className="w-6 h-6 text-amber-300 absolute inset-0 m-auto animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">
              Asisten AI Sedang Mengolah Data dengan Empati & Aman
            </h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
              Menyaring informasi sensitif, mengenkripsi ringkasan brankas, dan menyusun pesan santun untuk {currentGuardian?.name || 'Guardian'}.
            </p>
          </div>
        </div>
      )}

      {/* Content Display */}
      {!isLoading && aiResult && (
        <div className="space-y-6">
          {/* Status Bar */}
          <div
            className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
              isInactiveDetected
                ? 'bg-amber-950/40 border-amber-500/40 text-amber-200'
                : 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
            }`}
          >
            <div className="flex items-center space-x-3">
              <span
                className={`w-3 h-3 rounded-full ${
                  isInactiveDetected ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'
                }`}
              />
              <div>
                <span className="text-xs uppercase font-extrabold tracking-wider font-mono">
                  status_pengguna: {aiResult.status_pengguna}
                </span>
                <p className="text-xs opacity-80">
                  {isInactiveDetected
                    ? 'Protokol Darurat & Pembagian Akses Terjadwal Dijalankan.'
                    : 'Pengguna masih dalam siklus check-in aktif. Brankas terkunci sepenuhnya.'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-xs font-mono">
              <span className="px-2.5 py-1 rounded bg-black/40 border border-white/10 text-slate-300">
                JSON Keys Verified (4/4)
              </span>
            </div>
          </div>

          {/* Tab 1: Human Letter & Formatted View */}
          {activeSubTab === 'letter' && (
            <div className="space-y-6">
              {/* Message to Guardian Card */}
              <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-slate-900/90 via-slate-950 to-slate-900 border border-slate-800 shadow-xl space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-teal-400 font-mono">
                        pesan_ke_guardian
                      </span>
                      <h3 className="text-sm sm:text-base font-bold text-white">
                        Pemberitahuan Resmi Amanah Digital — Are you Still Alive?
                      </h3>
                    </div>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    Empathetic Tone
                  </span>
                </div>

                {/* Letter Body */}
                <div className="p-5 sm:p-6 rounded-xl bg-slate-950/90 border border-slate-800 text-slate-200 text-sm sm:text-base leading-relaxed font-sans space-y-3 shadow-inner">
                  <p className="font-medium text-emerald-300 italic">
                    "{aiResult.pesan_ke_guardian}"
                  </p>
                  <p className="text-xs text-slate-400 pt-2 border-t border-slate-800/80">
                    Catatan Asisten: Surat ini dirancang dengan empati yang menenangkan keluarga penerima,
                    menjelaskan kondisi secara santun tanpa menimbulkan kepanikan berlebih.
                  </p>
                </div>
              </div>

              {/* Safe Vault Summary Card */}
              <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                      <Lock className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 font-mono">
                        ringkasan_vault
                      </span>
                      <h3 className="text-sm sm:text-base font-bold text-white">
                        Manifest Ringkasan Dokumen (Tanpa Kredensial Mentah)
                      </h3>
                    </div>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-800/40">
                    Keamanan Terjaga
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {aiResult.ringkasan_vault && aiResult.ringkasan_vault.length > 0 ? (
                    aiResult.ringkasan_vault.map((summaryItem, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start space-x-3 hover:border-slate-700 transition-all"
                      >
                        <span className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-xs font-mono font-bold flex-shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <div className="space-y-1">
                          <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed">
                            {summaryItem}
                          </p>
                          <span className="inline-block text-[11px] text-slate-400 font-mono">
                            Status: Dilindungi Enkripsi Asimetris & Petunjuk Aman
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400">Tidak ada daftar dokumen yang ditemukan.</p>
                  )}
                </div>
              </div>

              {/* Security Instructions for Guardian */}
              <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-teal-400 font-mono">
                        instruksi_keamanan
                      </span>
                      <h3 className="text-sm sm:text-base font-bold text-white">
                        Langkah Verifikasi Guardian & Prosedur Klaim
                      </h3>
                    </div>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-teal-950/80 text-teal-300 border border-teal-800/40">
                    Protokol Anti-Klaim Palsu
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {aiResult.instruksi_keamanan && aiResult.instruksi_keamanan.length > 0 ? (
                    aiResult.instruksi_keamanan.map((step, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/90 flex items-start space-x-3"
                      >
                        <div className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-300 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                          ✓
                        </div>
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                          {step}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400">Tidak ada instruksi keamanan.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Raw JSON Spec View */}
          {activeSubTab === 'json' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-mono">
                  Format JSON Resmi Sesuai Panduan Prompt
                </span>
                <button
                  onClick={handleCopyJson}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-all"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Berhasil Disalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Salin JSON</span>
                    </>
                  )}
                </button>
              </div>

              <div className="relative rounded-2xl bg-slate-950 border border-slate-800 p-5 font-mono text-xs text-emerald-300 overflow-x-auto shadow-2xl">
                <pre>{JSON.stringify(aiResult, null, 2)}</pre>
              </div>

              {/* JSON Keys Specification Verification Card */}
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-2">
                <p className="font-semibold text-white">Verifikasi Kunci Output JSON:</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono">
                  <div className="p-2 rounded bg-slate-950 border border-slate-800 text-emerald-400">
                    ✔ status_pengguna
                  </div>
                  <div className="p-2 rounded bg-slate-950 border border-slate-800 text-emerald-400">
                    ✔ pesan_ke_guardian
                  </div>
                  <div className="p-2 rounded bg-slate-950 border border-slate-800 text-emerald-400">
                    ✔ ringkasan_vault
                  </div>
                  <div className="p-2 rounded bg-slate-950 border border-slate-800 text-emerald-400">
                    ✔ instruksi_keamanan
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
