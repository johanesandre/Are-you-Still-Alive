import React from 'react';
import { ShieldCheck, HeartPulse, Lock, Users, Sparkles, MessageSquareHeart, Eye } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isInactive: boolean;
  inactiveDays: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isInactive,
  inactiveDays,
}) => {
  const tabs = [
    { id: 'dashboard', label: 'Denyut Keaktifan', icon: HeartPulse },
    { id: 'wellness', label: 'Pendamping Sehat', icon: HeartPulse, badge: 'Sehat' },
    { id: 'ai-protocol', label: 'Protokol AI Asisten', icon: Sparkles, badge: 'Inti' },
    { id: 'vault', label: 'Brankas Wasiat', icon: Lock },
    { id: 'guardians', label: 'Wali Guardian', icon: Users },
    { id: 'guardian-portal', label: 'Simulasi Wali', icon: Eye },
    { id: 'chat', label: 'Konsultasi Asisten', icon: MessageSquareHeart },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 text-emerald-400 shadow-sm shadow-emerald-950">
              <HeartPulse className="w-5 h-5 text-emerald-400 animate-pulse" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-white font-sans">
                  Are you Still Alive<span className="text-emerald-400">?</span>
                </span>
                <span className="text-[10px] sm:text-[11px] px-2 py-0.5 rounded-full font-medium bg-emerald-950/80 border border-emerald-600/30 text-emerald-300 whitespace-nowrap">
                  Pendamping Sehat & Wasiat
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Kesehatan Harian & Protokol Amanah Keluarga
              </p>
            </div>
          </div>

          {/* Status Badge in Header */}
          <div className="hidden md:flex items-center space-x-3 text-xs">
            <div
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-full border ${
                isInactive
                  ? 'bg-amber-950/50 border-amber-500/40 text-amber-300'
                  : 'bg-emerald-950/50 border-emerald-500/40 text-emerald-300'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isInactive ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'
                }`}
              />
              <span className="font-medium">
                {isInactive
                  ? `Simulasi: Inaktif ${inactiveDays} Hari (Protokol Terpicu)`
                  : 'Status: Pemilik Aktif Terverifikasi'}
              </span>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex items-center space-x-1 sm:space-x-1.5 overflow-x-auto py-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all relative ${
                    isActive
                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-inner'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span className="whitespace-nowrap">{tab.label}</span>
                  {tab.badge && (
                    <span className="hidden lg:inline-block ml-1 text-[10px] uppercase font-bold px-1.5 py-0.2 bg-teal-500/20 text-teal-300 rounded border border-teal-500/30">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};
