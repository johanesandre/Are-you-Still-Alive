export type VaultCategory =
  | 'finance'
  | 'crypto'
  | 'social_media'
  | 'personal_letter'
  | 'insurance'
  | 'physical_asset';

export interface VaultItem {
  id: string;
  title: string;
  category: VaultCategory;
  description: string;
  encrypted_hint_or_key: string;
  recipient_guardian: string;
  importance: 'vital' | 'high' | 'medium';
  is_encrypted: boolean;
  notes?: string;
  created_at: string;
}

export interface Guardian {
  id: string;
  name: string;
  relationship: string;
  email: string;
  phone: string;
  role: 'Kuasa Utama' | 'Kuasa Sekunder' | 'Kuasa Kenangan';
  status: 'Terverifikasi' | 'Menunggu Konfirmasi';
  assigned_vault_count?: number;
}

export interface InactivitySettings {
  userName: string;
  userEmail: string;
  checkInIntervalDays: number;
  gracePeriodDays: number;
  lastCheckInDate: string;
  inactiveDays: number;
  channels: {
    whatsapp: boolean;
    email: boolean;
    sms: boolean;
  };
  emergencyNote: string;
}

export interface AiAgentResult {
  status_pengguna: 'AKTIF' | 'INAKTIF_TERDETEKSI';
  pesan_ke_guardian: string;
  ringkasan_vault: string[];
  instruksi_keamanan: string[];
  generated_at?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: string;
}
