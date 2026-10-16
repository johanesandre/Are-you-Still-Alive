import React, { useState } from 'react';
import {
  Heart,
  Droplets,
  Smile,
  Moon,
  Wind,
  Coffee,
  Sparkles,
  Activity,
  AlertCircle,
  CheckCircle2,
  Play,
  RotateCcw,
  MessageSquareHeart,
  ArrowRight,
} from 'lucide-react';

interface WellnessCompanionProps {
  onAskAi: (question: string) => void;
}

export const WellnessCompanion: React.FC<WellnessCompanionProps> = ({ onAskAi }) => {
  // Hydration state
  const [glasses, setGlasses] = useState<number>(4);
  const targetGlasses = 8;

  // Mood / Vitality state
  const [selectedVitality, setSelectedVitality] = useState<string>('fokus');

  // Breathing exercise state
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'Tarik Napas (4s)' | 'Tahan (7s)' | 'Hembuskan (8s)' | 'Siap'>('Siap');

  const handleStartBreathing = () => {
    if (isBreathing) return;
    setIsBreathing(true);
    setBreathPhase('Tarik Napas (4s)');

    let cycle = 0;
    const runCycle = () => {
      setBreathPhase('Tarik Napas (4s)');
      setTimeout(() => {
        setBreathPhase('Tahan (7s)');
        setTimeout(() => {
          setBreathPhase('Hembuskan (8s)');
          setTimeout(() => {
            cycle++;
            if (cycle < 2) {
              runCycle();
            } else {
              setIsBreathing(false);
              setBreathPhase('Siap');
            }
          }, 8000);
        }, 7000);
      }, 4000);
    };

    runCycle();
  };

  const vitalityOptions = [
    { id: 'berenergi', label: '⚡ Berenergi', desc: 'Siap menuntaskan target hari ini' },
    { id: 'fokus', label: '🌿 Tenang & Fokus', desc: 'Pikiran jernih dan ritme stabil' },
    { id: 'capek', label: '😴 Agak Capek', desc: 'Mata lelah atau duduk terlalu lama' },
    { id: 'stres', label: '🌧️ Butuh Rehat', desc: 'Perlu jeda untuk bernapas lega' },
  ];

  return (
    <div className="space-y-8">
      {/* Top Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-emerald-950/40 via-slate-900 to-teal-950/30 p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
            <Heart className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>Pendamping Sehat & Panjang Umur</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Rawat Tubuh & Pikiranmu, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-200">
              Karena Hidupmu Begitu Berharga
            </span>
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Menjaga kebiasaan kecil setiap hari adalah cara terbaik merawat masa depan. 
            Bersama Asisten Pendamping, luangkan sejenak waktu untuk minum air, rilekskan mata, dan atur napas.
          </p>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -top-12 -right-12 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Grid: Hydration & Breathing & Mood */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Hydration Tracker (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center">
                <Droplets className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white">Log Hidrasi Harian</h3>
            </div>
            <span className="text-xs font-mono font-bold text-teal-300">
              {glasses} / {targetGlasses} Gelas
            </span>
          </div>

          {/* Progress bar */}
          <div className="space-y-2">
            <div className="w-full bg-slate-950 rounded-full h-3 p-0.5 border border-slate-800">
              <div
                className="bg-gradient-to-r from-teal-500 to-emerald-400 h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (glasses / targetGlasses) * 100)}%` }}
              />
            </div>
            <p className="text-xs text-slate-400">
              {glasses >= targetGlasses
                ? 'Luar biasa! Target 2 liter air putihmu hari ini sudah tercapai. Tubuhmu berterima kasih!'
                : `Masih butuh ${targetGlasses - glasses} gelas lagi untuk menjaga energi & metabolisme prima.`}
            </p>
          </div>

          {/* Glass icons interactive */}
          <div className="grid grid-cols-8 gap-1.5 pt-1">
            {Array.from({ length: targetGlasses }).map((_, i) => (
              <button
                key={i}
                onClick={() => setGlasses(i + 1)}
                className={`py-2.5 rounded-lg border flex flex-col items-center justify-center transition-all ${
                  i < glasses
                    ? 'bg-teal-500/20 border-teal-500/50 text-teal-300'
                    : 'bg-slate-950 border-slate-800 text-slate-600 hover:text-slate-400'
                }`}
                title={`Gelas ke-${i + 1}`}
              >
                <Droplets className="w-3.5 h-3.5" />
                <span className="text-[10px] font-mono mt-0.5">{i + 1}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
            <button
              onClick={() => setGlasses((prev) => Math.max(0, prev - 1))}
              className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200"
            >
              -1 Gelas
            </button>
            <button
              onClick={() => setGlasses((prev) => prev + 1)}
              className="px-4 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-semibold transition-all shadow-sm"
            >
              + Minum Air Sekarang
            </button>
          </div>
        </div>

        {/* Right: Guided Breath & Vitality (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Daily Vitality Check */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <Smile className="w-4 h-4 text-emerald-400" />
                <span>Bagaimana Kondisi Tubuh & Pikiranmu Hari Ini?</span>
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {vitalityOptions.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVitality(v.id)}
                  className={`p-3 rounded-xl text-left border transition-all ${
                    selectedVitality === v.id
                      ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-200 shadow-md'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <p className="font-semibold text-xs text-white">{v.label}</p>
                  <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">{v.desc}</p>
                </button>
              ))}
            </div>

            {selectedVitality === 'capek' && (
              <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-600/30 text-amber-200 text-xs flex items-center justify-between">
                <span>Tubuhmu memberi sinyal butuh rehat. Mau tips cepat biar gak gampang capek saat kerja?</span>
                <button
                  onClick={() => onAskAi('Bisa kasih tips biar gak gampang capek pas kerja?')}
                  className="px-3 py-1 rounded-lg bg-amber-600 text-white font-semibold text-[11px] hover:bg-amber-500 ml-2 whitespace-nowrap"
                >
                  Tanya Asisten AI
                </button>
              </div>
            )}
          </div>

          {/* Calming Breath 4-7-8 */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-5">
            <div className="space-y-1.5 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start space-x-2 text-teal-400 text-xs font-semibold">
                <Wind className="w-4 h-4" />
                <span>Relaksasi Kilat: Teknik Pernapasan 4-7-8</span>
              </div>
              <h4 className="text-sm font-bold text-white">Tenangkan Saraf & Jernihkan Kepala</h4>
              <p className="text-xs text-slate-400 max-w-sm">
                Tarik napas lembut (4s), tahan (7s), lalu hembuskan perlahan (8s). Terbukti menurunkan detak jantung dan meredakan stres.
              </p>
            </div>

            <div className="flex flex-col items-center space-y-2">
              <button
                onClick={handleStartBreathing}
                disabled={isBreathing}
                className={`relative w-28 h-28 rounded-full border flex flex-col items-center justify-center transition-all ${
                  isBreathing
                    ? 'border-emerald-400 bg-emerald-500/20 text-emerald-200 shadow-lg shadow-emerald-950/60 scale-105'
                    : 'border-slate-700 bg-slate-950 hover:border-emerald-500/50 text-slate-300'
                }`}
              >
                {isBreathing ? (
                  <span className="text-xs font-bold text-center px-2 animate-pulse">{breathPhase}</span>
                ) : (
                  <>
                    <Play className="w-5 h-5 text-emerald-400 mb-1" />
                    <span className="text-[11px] font-semibold">Mulai Bernapas</span>
                  </>
                )}
              </button>
              {isBreathing && (
                <span className="text-[11px] text-teal-400 font-mono">Siklus Relaksasi Berjalan...</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Practical Lifestyle Habit Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Kiat Sehat Harian yang Praktis & Mudah Diterapkan</span>
          </h3>
          <span className="text-xs text-slate-400 hidden sm:inline">Pilih kiat untuk berdiskusi dengan AI</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all space-y-3">
            <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
              <Activity className="w-4 h-4" />
              <span>Aturan 20-20-20</span>
            </div>
            <h4 className="text-sm font-bold text-white">Lindungi Mata dari Kelelahan Layar</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Tiap 20 menit menatap laptop/HP, palingkan pandangan ke objek sejauh 20 kaki (6 meter) selama 20 detik. Mengistirahatkan otot siliaris mata secara instan.
            </p>
            <button
              onClick={() => onAskAi('Bisa kasih tips biar gak gampang capek pas kerja?')}
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center space-x-1 pt-1"
            >
              <span>Pelajari Tips Energi Seharian</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all space-y-3">
            <div className="flex items-center space-x-2 text-teal-400 font-bold text-xs uppercase tracking-wider">
              <Moon className="w-4 h-4" />
              <span>Sanitasi Tidur Malam</span>
            </div>
            <h4 className="text-sm font-bold text-white">Tidur Berkualitas Tanpa Begadang</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Jauhkan gawai 45 menit sebelum tidur. Suhu ruangan yang sejuk dan cahaya redup membantu pelepasan hormon melatonin alami untuk regenerasi sel tubuh.
            </p>
            <button
              onClick={() => onAskAi('Bagaimana cara tidur lebih nyenyak dan bangun segar besok pagi?')}
              className="text-xs font-semibold text-teal-400 hover:text-teal-300 flex items-center space-x-1 pt-1"
            >
              <span>Tanya Kiat Tidur Nyenyak</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all space-y-3">
            <div className="flex items-center space-x-2 text-rose-400 font-bold text-xs uppercase tracking-wider">
              <Heart className="w-4 h-4" />
              <span>Peregangan 5 Menit</span>
            </div>
            <h4 className="text-sm font-bold text-white">Rilekskan Otot Leher & Bahu</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Duduk tegak, tarik bahu ke belakang, dan miringkan leher lembut ke kiri dan kanan. Membantu pasokan oksigen ke otak kembali lancar.
            </p>
            <button
              onClick={() => onAskAi('Bisa ajarkan gerakan stretching simpel 5 menit di meja kerja?')}
              className="text-xs font-semibold text-rose-400 hover:text-rose-300 flex items-center space-x-1 pt-1"
            >
              <span>Minta Panduan Stretching</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Medical Disclaimer Banner */}
      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/90 text-xs text-slate-400 flex items-start space-x-3">
        <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-slate-300">Catatan Peduli dari Asisten Pendamping:</strong> Seluruh panduan kesehatan di sini bertujuan untuk mendukung gaya hidup sehat harian. Jika kamu mengalami keluhan medis serius, rasa sakit berkepanjangan, atau gejala akut, pastikan untuk segera memeriksakan diri ke dokter atau fasilitas kesehatan resmi terdekat.
        </p>
      </div>
    </div>
  );
};
