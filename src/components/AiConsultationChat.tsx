import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquareHeart,
  Send,
  Sparkles,
  Bot,
  User,
  Shield,
  HelpCircle,
  Heart,
  Droplets,
  Clock,
  KeyRound,
  Activity,
  ScrollText,
} from 'lucide-react';
import { ChatMessage } from '../types';

interface AiConsultationChatProps {
  initialQuestion?: string;
  onClearInitialQuestion?: () => void;
}

export const AiConsultationChat: React.FC<AiConsultationChatProps> = ({
  initialQuestion,
  onClearInitialQuestion,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-welcome',
      sender: 'agent',
      text: `Halo! Aku 'Asisten Pendamping HIDUP?' dari aplikasi Are you Still Alive?.

Fokus utamaku adalah mendampingi kamu agar senantiasa sehat, bugar, panjang umur, dan punya perencanaan masa depan yang tertata rapi. Kita bisa ngobrol santai seputar:
1. 🌿 Tips Sehat Harian: Biar gak gampang capek pas kerja, hidrasi cukup, tidur nyenyak, dan manajemen stres.
2. 📜 Asisten Wasiat & Amanah: Menulis surat cinta/pesan hangat untuk keluarga, cara kerja Vault terenkripsi, dan penunjukan Guardian.

Kira-kira apa yang ingin kita obrolkan hari ini?`,
      timestamp: 'Baru saja',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeTopic, setActiveTopic] = useState<'all' | 'health' | 'will'>('all');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const healthQuestions = [
    'Bisa kasih tips biar gak gampang capek pas kerja?',
    'Bagaimana cara tidur lebih nyenyak dan bangun segar besok pagi?',
    'Latihan pernapasan cepat untuk redakan stres atau cemas?',
    'Berapa gelas air putih yang ideal agar energi tetap stabil?',
  ];

  const willQuestions = [
    'Bantu saya panduan menulis surat pesan hangat untuk keluarga',
    'Bagaimana cara kerja Vault Warisan dan PIN agar tetap aman?',
    'Bagaimana memilih Wali (Guardian) yang tepat dan bertanggung jawab?',
    'Bagaimana membagikan petunjuk kripto/kunci brankas tanpa risiko dibobol?',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Handle external query trigger from WellnessCompanion
  useEffect(() => {
    if (initialQuestion) {
      handleSendMessage(initialQuestion);
      if (onClearInitialQuestion) {
        onClearInitialQuestion();
      }
    }
  }, [initialQuestion]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isTyping) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/agent/consult', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: text }),
      });
      const data = await response.json();

      const agentReplyText =
        data.reply ||
        'Senang sekali bisa mendampingi kamu. Menjaga tubuh tetap sehat dan merawat amanah masa depan adalah bentuk cinta yang nyata bagi diri sendiri dan keluarga.';

      const agentMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        sender: 'agent',
        text: agentReplyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, agentMsg]);
    } catch (err) {
      const fallbackMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        sender: 'agent',
        text: `Boleh banget! Biar energi kamu tetap terjaga seharian dan gak gampang lelah saat kerja, coba terapkan 3 langkah simpel ini:
1. Terapkan Aturan 20-20-20 (tiap 20 menit, tatap area jauh selama 20 detik biar mata gak lelah).
2. Minum segelas air putih tiap 1-2 jam sekali.
3. Luangkan jeda 5 menit buat stretching ringan leher dan bahu.

(Catatan peduli: Untuk gejala lelah berat atau keluhan fisik yang tak kunjung reda, selalu periksakan ke dokter ya!)

Hari ini kamu sudah minum berapa gelas air putih?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <MessageSquareHeart className="w-5 h-5 text-emerald-400" />
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Asisten Pendamping HIDUP? — Are you Still Alive?
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Teman ngobrol ramah untuk menjaga kebugaran tubuh, ketenangan jiwa, dan perencanaan warisan digital keluarga.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-950/70 border border-emerald-500/30 text-emerald-300 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>AI Empatik & Peduli</span>
          </span>
        </div>
      </div>

      {/* Topic Switcher & Quick Questions */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1 p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs">
            <button
              onClick={() => setActiveTopic('all')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeTopic === 'all' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Semua Topik
            </button>
            <button
              onClick={() => setActiveTopic('health')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeTopic === 'health' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Activity className="w-3 h-3 text-emerald-400" />
              <span>Kesehatan & Bugar</span>
            </button>
            <button
              onClick={() => setActiveTopic('will')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeTopic === 'will' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ScrollText className="w-3 h-3 text-teal-400" />
              <span>Wasiat & Brankas</span>
            </button>
          </div>
          <span className="text-xs text-slate-500 hidden sm:inline">Klik pertanyaan cepat untuk langsung bertanya</span>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex flex-wrap gap-2">
          {(activeTopic === 'all' || activeTopic === 'health') &&
            healthQuestions.map((q, idx) => (
              <button
                key={`h-${idx}`}
                onClick={() => handleSendMessage(q)}
                className="text-left text-xs px-3.5 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-emerald-900/40 hover:border-emerald-500/40 text-emerald-200 transition-all shadow-sm"
              >
                🌿 {q}
              </button>
            ))}

          {(activeTopic === 'all' || activeTopic === 'will') &&
            willQuestions.map((q, idx) => (
              <button
                key={`w-${idx}`}
                onClick={() => handleSendMessage(q)}
                className="text-left text-xs px-3.5 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-teal-900/40 hover:border-teal-500/40 text-teal-200 transition-all shadow-sm"
              >
                📜 {q}
              </button>
            ))}
        </div>
      </div>

      {/* Chat Messages Box */}
      <div className="h-[500px] rounded-2xl bg-slate-950 border border-slate-800 p-4 sm:p-6 overflow-y-auto space-y-4 shadow-inner">
        {messages.map((m) => {
          const isAgent = m.sender === 'agent';
          return (
            <div
              key={m.id}
              className={`flex items-start space-x-3 ${isAgent ? 'justify-start' : 'justify-end'}`}
            >
              {isAgent && (
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0 mt-1 shadow-sm">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-4 sm:p-5 text-xs sm:text-sm leading-relaxed ${
                  isAgent
                    ? 'bg-slate-900/95 border border-slate-800 text-slate-200 shadow-md'
                    : 'bg-emerald-600 text-white font-medium shadow-md shadow-emerald-950'
                }`}
              >
                <div className="flex items-center justify-between space-x-4 mb-2 pb-1 border-b border-slate-800/60">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider ${
                      isAgent ? 'text-emerald-400' : 'text-emerald-200'
                    }`}
                  >
                    {isAgent ? 'Asisten Pendamping HIDUP?' : 'Anda'}
                  </span>
                  <span className="text-[10px] opacity-60 font-mono">{m.timestamp}</span>
                </div>
                <div className="whitespace-pre-line space-y-2">{m.text}</div>
              </div>

              {!isAgent && (
                <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 flex-shrink-0 mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-start space-x-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 text-xs flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.4s]" />
              <span className="text-slate-400 text-xs pl-1">Asisten sedang menyusun jawaban hangat & solutif...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="flex items-center space-x-2"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Tanyakan tips sehat harian, cara biar gak lelah kerja, atau panduan pesan warisan..."
          className="flex-1 px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isTyping}
          className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs sm:text-sm font-semibold flex items-center space-x-1.5 shadow-lg shadow-emerald-950 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <span>Kirim</span>
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
