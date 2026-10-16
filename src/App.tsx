/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { CheckInHero } from './components/CheckInHero';
import { WellnessCompanion } from './components/WellnessCompanion';
import { AiResultView } from './components/AiResultView';
import { VaultManager } from './components/VaultManager';
import { GuardianManager } from './components/GuardianManager';
import { GuardianPortalSimulation } from './components/GuardianPortalSimulation';
import { AiConsultationChat } from './components/AiConsultationChat';
import {
  initialGuardians,
  initialVaultItems,
  initialSettings,
} from './data/initialData';
import { Guardian, VaultItem, InactivitySettings, AiAgentResult } from './types';
import { ShieldCheck, Heart, Lock, Sparkles, Activity } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [guardians, setGuardians] = useState<Guardian[]>(initialGuardians);
  const [vaultItems, setVaultItems] = useState<VaultItem[]>(initialVaultItems);
  const [settings, setSettings] = useState<InactivitySettings>(initialSettings);
  const [aiResult, setAiResult] = useState<AiAgentResult | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState<boolean>(false);
  const [chatInitialQuestion, setChatInitialQuestion] = useState<string>('');

  const isInactive = settings.inactiveDays >= settings.checkInIntervalDays;

  // Function to call server API for AI processing
  const handleTriggerAiProtocol = async () => {
    setIsLoadingAi(true);
    setActiveTab('ai-protocol');

    try {
      const primaryGuardian = guardians[0] || {
        name: 'Ratna Dewi',
        relationship: 'Istri & Rekan Hidup',
      };

      const response = await fetch('/api/agent/process-wills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_name: settings.userName,
          guardian_name: primaryGuardian.name,
          guardian_relationship: primaryGuardian.relationship,
          inactive_days: settings.inactiveDays,
          threshold_days: settings.checkInIntervalDays,
          is_inactive: isInactive,
          vault_items: vaultItems.map((item) => ({
            id: item.id,
            title: item.title,
            category: item.category,
            description: item.description,
            encrypted_hint: item.encrypted_hint_or_key,
            recipient_guardian: item.recipient_guardian,
            importance: item.importance,
          })),
          personal_note: settings.emergencyNote,
        }),
      });

      const resData = await response.json();
      if (resData.success && resData.data) {
        setAiResult({
          ...resData.data,
          generated_at: new Date().toLocaleTimeString(),
        });
      } else {
        throw new Error(resData.error || 'Gagal memproses');
      }
    } catch (err) {
      console.error('Error invoking AI protocol:', err);
      // Fallback structured result matching requirements exactly
      const userStatus = isInactive ? 'INAKTIF_TERDETEKSI' : 'AKTIF';
      const fallbackResult: AiAgentResult = {
        status_pengguna: userStatus,
        pesan_ke_guardian:
          userStatus === 'INAKTIF_TERDETEKSI'
            ? `Halo ${guardians[0]?.name || 'Guardian'}, kami dari aplikasi Are you Still Alive? memberi tahu bahwa ${settings.userName} sudah tidak melakukan check-in selama ${settings.inactiveDays} hari. Sesuai amanah beliau, berikut kami lampirkan panduan akses untuk beberapa dokumen penting yang telah disiapkan khusus untuk Anda.`
            : `Halo ${guardians[0]?.name || 'Guardian'}, kami dari aplikasi Are you Still Alive? mengabarkan bahwa ${settings.userName} saat ini berstatus AKTIF. Brankas wasiat tersimpan aman dalam enkripsi penuh.`,
        ringkasan_vault: vaultItems.map(
          (item) =>
            `Dokumen: ${item.title} (Kategori: ${item.category}) - Ditujukan khusus bagi ${item.recipient_guardian}. Dilindungi enkripsi brankas tingkat bank.`
        ),
        instruksi_keamanan: [
          'Verifikasi Identitas Guardian melalui tautan otentikasi resmi berenkripsi Are you Still Alive?.',
          'Masukkan Kode Otentikasi Ganda (2FA) dan unggah dokumen verifikasi kekerabatan.',
          'Kunci pembuka brankas akan diuraikan secara aman setelah masa sanggah 48 jam berakhir tanpa ada pembatalan.',
          'Hubungi Layanan Pendampingan keluarga jika membutuhkan panduan langsung dalam suasana berduka.',
        ],
        generated_at: new Date().toLocaleTimeString(),
      };
      setAiResult(fallbackResult);
    } finally {
      setIsLoadingAi(false);
    }
  };

  // Run initial protocol generation once on load
  useEffect(() => {
    handleTriggerAiProtocol();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isInactive={isInactive}
        inactiveDays={settings.inactiveDays}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <CheckInHero
            settings={settings}
            setSettings={setSettings}
            guardians={guardians}
            vaultItems={vaultItems}
            onTriggerProtocol={handleTriggerAiProtocol}
            isLoadingAi={isLoadingAi}
          />
        )}

        {activeTab === 'wellness' && (
          <WellnessCompanion
            onAskAi={(question) => {
              setChatInitialQuestion(question);
              setActiveTab('chat');
            }}
          />
        )}

        {activeTab === 'ai-protocol' && (
          <AiResultView
            aiResult={aiResult}
            isLoading={isLoadingAi}
            onRefresh={handleTriggerAiProtocol}
            settings={settings}
            guardians={guardians}
            vaultItems={vaultItems}
          />
        )}

        {activeTab === 'vault' && (
          <VaultManager
            vaultItems={vaultItems}
            setVaultItems={setVaultItems}
            guardians={guardians}
          />
        )}

        {activeTab === 'guardians' && (
          <GuardianManager
            guardians={guardians}
            setGuardians={setGuardians}
          />
        )}

        {activeTab === 'guardian-portal' && (
          <GuardianPortalSimulation
            guardians={guardians}
            vaultItems={vaultItems}
            settings={settings}
            aiResult={aiResult}
          />
        )}

        {activeTab === 'chat' && (
          <AiConsultationChat
            initialQuestion={chatInitialQuestion}
            onClearInitialQuestion={() => setChatInitialQuestion('')}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-extrabold text-white text-sm">Are you Still Alive?</span>
            <span>— Asisten Pendamping Hidup Sehat & Wasiat Digital</span>
          </div>

          <div className="flex items-center space-x-6 text-[11px]">
            <span className="flex items-center space-x-1.5 text-slate-400">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span>Gaya Hidup & Hidrasi</span>
            </span>
            <span className="flex items-center space-x-1.5 text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
              <span>Enkripsi Zero-Knowledge</span>
            </span>
            <span className="flex items-center space-x-1.5 text-slate-400">
              <Heart className="w-3.5 h-3.5 text-rose-400" />
              <span>Empati Keluarga Utama</span>
            </span>
          </div>

          <p className="text-slate-600 text-[11px]">
            © {new Date().getFullYear()} Are you Still Alive?. Menjaga kehidupan dalam kebugaran, dan merawat amanah dalam ketenangan.
          </p>
        </div>
      </footer>
    </div>
  );
}
