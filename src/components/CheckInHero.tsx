import React, { useState } from 'react';
import {
  Heart,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldAlert,
  Sparkles,
  Calendar,
  BellRing,
  HelpCircle,
  Radio,
  Sliders,
  ArrowRight,
} from 'lucide-react';
import { InactivitySettings, Guardian, VaultItem } from '../types';

interface CheckInHeroProps {
  settings: InactivitySettings;
  setSettings: React.Dispatch<React.SetStateAction<InactivitySettings>>;
  guardians: Guardian[];
  vaultItems: VaultItem[];
  onTriggerProtocol: () => void;
  isLoadingAi: boolean;
}

export const CheckInHero: React.FC<CheckInHeroProps> = ({
  settings,
  setSettings,
  guardians,
  vaultItems,
  onTriggerProtocol,
  isLoadingAi,
}) => {
  const [justCheckedIn, setJustCheckedIn] = useState(false);

  const isOverdue = settings.inactiveDays >= settings.checkInIntervalDays;
  const isCritical = settings.inactiveDays >= settings.checkInIntervalDays + settings.gracePeriodDays;

  const handleCheckInNow = () => {
    setSettings((prev) => ({
      ...prev,
      inactiveDays: 0,
      lastCheckInDate: new Date().toISOString(),
    }));
    setJustCheckedIn(true);
    setTimeout(() => setJustCheckedIn(false), 3500);
  };

  const handleSetSimulationDays = (days: number) => {
    setSettings((prev) => ({
      ...prev,
      inactiveDays: days,
    }));
  };

  return (
    <div className="space-y-8">
      {/* Top Banner Hero */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900/90 via-slate-950/80 to-slate-900/90 p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
        {/* Soft background glow */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Pulse & Switch info */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
              <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>Protokol Perlindungan Hidup & Amanah Digital</span>
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight font-sans">
                Pendamping Hidup Sehat & <br className="hidden sm:inline" />
                Amanah Terakhir dengan <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-200">Ketenangan & Empati</span>
              </h1>
              <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
                Aplikasi <strong>Are you Still Alive?</strong> hadir untuk menjaga kesehatan fisik & mentalmu setiap hari, sekaligus memastikan orang terkasih tidak kesulitan mengakses dokumen penting dan pesan hangatmu di masa depan.
              </p>
            </div>

            {/* Check-In Action Box */}
            <div className="p-4 sm:p-5 rounded-xl bg-slate-900/80 border border-slate-700/60 shadow-lg space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-3.5">
                  <div
                    className={`relative w-12 h-12 rounded-2xl flex items-center justify-center border transition-all ${
                      isCritical
                        ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 shadow-amber-950/50'
                        : isOverdue
                        ? 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                        : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400 shadow-emerald-950/50'
                    }`}
                  >
                    <Heart
                      className={`w-6 h-6 transition-transform ${
                        isCritical ? 'text-amber-400' : 'text-emerald-400 animate-pulse'
                      }`}
                    />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-semibold text-white">
                        Pemilik Akun: {settings.userName}
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          isCritical
                            ? 'bg-rose-950/80 text-rose-300 border border-rose-800/40'
                            : isOverdue
                            ? 'bg-amber-950/80 text-amber-300 border border-amber-800/40'
                            : 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/40'
                        }`}
                      >
                        {isCritical
                          ? 'Inaktif Kritis'
                          : isOverdue
                          ? 'Peringatan Check-in'
                          : 'Sehat & Aktif'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {settings.inactiveDays === 0
                        ? 'Baru saja melakukan check-in hari ini.'
                        : `Sudah ${settings.inactiveDays} hari tanpa konfirmasi hadir (Ambang: ${settings.checkInIntervalDays} hari).`}
                    </p>
                  </div>
                </div>

                {/* Primary Button */}
                <button
                  onClick={handleCheckInNow}
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-sm shadow-lg shadow-emerald-950/60 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                  <span>Saya Sehat & Hadir (Check-In)</span>
                </button>
              </div>

              {justCheckedIn && (
                <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs flex items-center space-x-2 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>
                    Terima kasih, {settings.userName}. Check-in Anda berhasil dicatat. Masa aktif diperpanjang {settings.checkInIntervalDays} hari ke depan.
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Status Card & Trigger to AI Protocol */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-700/80 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                  <Clock className="w-3.5 h-3.5 text-teal-400" />
                  <span>Parameter Siklus Keaktifan</span>
                </span>
                <span className="text-xs text-slate-500">Masa Sanggah: {settings.gracePeriodDays} Hari</span>
              </div>

              {/* Grid counts */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                  <span className="text-2xl font-black text-white font-mono">{settings.inactiveDays}</span>
                  <p className="text-[11px] text-slate-400 mt-1">Hari Inaktif</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                  <span className="text-2xl font-black text-emerald-400 font-mono">{vaultItems.length}</span>
                  <p className="text-[11px] text-slate-400 mt-1">Item Brankas</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                  <span className="text-2xl font-black text-teal-400 font-mono">{guardians.length}</span>
                  <p className="text-[11px] text-slate-400 mt-1">Wali Terpercaya</p>
                </div>
              </div>

              {/* Status Alert description */}
              <div
                className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
                  isCritical
                    ? 'bg-rose-950/30 border-rose-600/40 text-rose-200'
                    : isOverdue
                    ? 'bg-amber-950/30 border-amber-600/40 text-amber-200'
                    : 'bg-emerald-950/30 border-emerald-600/40 text-emerald-200'
                }`}
              >
                <div className="flex items-start space-x-2.5">
                  {isCritical ? (
                    <ShieldAlert className="w-4 h-4 text-rose-400 mt-0.5 flex-shrink-0" />
                  ) : isOverdue ? (
                    <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  )}
                  <div>
                    <p className="font-semibold">
                      {isCritical
                        ? 'Pemicu Protokol Guardian Aktif!'
                        : isOverdue
                        ? 'Peringatan Pra-Aktivasi Diberikan'
                        : 'Sistem Terjaga dalam Kondisi Damai'}
                    </p>
                    <p className="text-[11px] opacity-90 mt-0.5">
                      {isCritical
                        ? 'Pengguna tidak merespons check-in & masa sanggah terlewati. Asisten AI siap mengolah panduan amanah kepada Guardian.'
                        : isOverdue
                        ? 'Sistem mengirimkan notifikasi lembut melalui WhatsApp dan Email sebelum menghubungi wali.'
                        : 'Seluruh brankas terenkripsi dengan aman. Tidak ada data yang dibuka ke siapa pun.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Trigger AI protocol button */}
              <button
                onClick={onTriggerProtocol}
                disabled={isLoadingAi}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl bg-gradient-to-r from-teal-600 via-emerald-600 to-emerald-700 hover:from-teal-500 hover:to-emerald-500 text-white font-medium text-sm shadow-md transition-all disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
                <span>
                  {isLoadingAi
                    ? 'Asisten Wasiat AI Sedang Memproses...'
                    : 'Uji Proses Wasiat & Evaluasi AI (JSON)'}
                </span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Simulator Quick Slider & Presets */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-teal-400" />
            <h2 className="text-sm font-semibold text-white">
              Simulator Kondisi Inaktivitas (Uji Alur Pengguna)
            </h2>
          </div>
          <span className="text-xs text-slate-400">
            Geser atau pilih skenario untuk melihat bagaimana respon Asisten Wasiat AI berubah
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <button
            onClick={() => handleSetSimulationDays(0)}
            className={`p-3 rounded-xl text-left border text-xs transition-all ${
              settings.inactiveDays === 0
                ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-200'
                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <p className="font-semibold text-white">Skenario 1: Aktif</p>
            <p className="text-[11px] mt-0.5">0 Hari Inaktif (Baru Check-in)</p>
          </button>

          <button
            onClick={() => handleSetSimulationDays(7)}
            className={`p-3 rounded-xl text-left border text-xs transition-all ${
              settings.inactiveDays === 7
                ? 'bg-teal-950/60 border-teal-500/60 text-teal-200'
                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <p className="font-semibold text-white">Skenario 2: Normal</p>
            <p className="text-[11px] mt-0.5">7 Hari Inaktif (Dalam Jadwal)</p>
          </button>

          <button
            onClick={() => handleSetSimulationDays(14)}
            className={`p-3 rounded-xl text-left border text-xs transition-all ${
              settings.inactiveDays === 14
                ? 'bg-amber-950/60 border-amber-500/60 text-amber-200'
                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <p className="font-semibold text-white">Skenario 3: Peringatan</p>
            <p className="text-[11px] mt-0.5">14 Hari Inaktif (Ambang Batas)</p>
          </button>

          <button
            onClick={() => handleSetSimulationDays(30)}
            className={`p-3 rounded-xl text-left border text-xs transition-all ${
              settings.inactiveDays === 30
                ? 'bg-rose-950/60 border-rose-500/60 text-rose-200 shadow-sm shadow-rose-950'
                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <p className="font-semibold text-white">Skenario 4: Kritis (30 Hari)</p>
            <p className="text-[11px] mt-0.5">Inaktif Terdeteksi (Kirim ke Wali)</p>
          </button>
        </div>

        {/* Range slider for custom days */}
        <div className="pt-2">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <span>Atur Jumlah Hari Tanpa Check-In Mandiri:</span>
            <span className="font-mono font-bold text-white text-sm bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
              {settings.inactiveDays} Hari
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="60"
            step="1"
            value={settings.inactiveDays}
            onChange={(e) => handleSetSimulationDays(Number(e.target.value))}
            className="w-full accent-emerald-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
          />
        </div>
      </div>

      {/* 3 Golden Rules Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
            1
          </div>
          <h3 className="text-sm font-semibold text-white">Bahasa Hangat & Menenangkan</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Asisten Pendamping AI menggunakan bahasa Indonesia yang santai, bersahabat, hangat, dan mudah dipahami, tanpa terminologi hukum atau medis yang menakutkan.
          </p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-sm">
            2
          </div>
          <h3 className="text-sm font-semibold text-white">Keamanan Tanpa Kredensial Mentah</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Kata sandi, seed phrase, atau PIN tidak pernah ditampilkan polos (raw text). Sistem memakai pola terenkripsi atau petunjuk aman yang hanya bisa diverifikasi wali.
          </p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-sm">
            3
          </div>
          <h3 className="text-sm font-semibold text-white">Empati Mendalam Bagi Guardian</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Menyadari bahwa pemilik akun mungkin sedang berhalangan berat atau telah berpulang, nada bicara kepada Guardian selalu penuh penghormatan dan empati tulus.
          </p>
        </div>
      </div>
    </div>
  );
};
