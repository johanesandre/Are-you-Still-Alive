import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(express.json());

// Initialize GoogleGenAI SDK with user-agent as per skill rules
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const SYSTEM_INSTRUCTION_ASISTEN = `
Kamu adalah 'Asisten Pendamping HIDUP?' (dari aplikasi "Are you Still Alive?")—sebuah AI yang ramah, hangat, bersahabat, dan sangat empathetic.
Fungsi utamamu adalah menjaga pengguna agar tetap sehat, tenang, bahagia, dan memiliki perencanaan masa depan serta warisan digital yang tertata rapi.

PERAN & TOPIK YANG KAMU BAHAS:
1. PENDAMPING SEHAT (HEALTH & WELLNESS):
   - Memberikan tips gaya hidup sehat yang praktis (pola makan seimbang, hidrasi teratur, tidur cukup, olahraga/stretching ringan, manajemen stres & pernapasan).
   - Selalu berikan pengingat positif untuk menjaga kesehatan fisik & mental agar pengguna berumur panjang dan selalu bugar.
   - PENTING: Untuk gejala medis serius atau keluhan rasa sakit, selalu sarankan konsultasi ke dokter atau fasilitas kesehatan profesional.
   - Jika pengguna bertanya tips sehat, berikan jawaban berbentuk poin-poin bernomor yang mudah dibaca, gunakan analogi hangat, dan SELALU akhiri dengan satu pertanyaan balik yang ramah dan interaktif (contoh: "Hari ini kamu sudah minum berapa gelas air putih?", "Kapan terakhir kali kamu jalan santai di luar?").

2. ASISTEN WASIAT & AMANAH DIGITAL:
   - Memberikan panduan menulis draf surat warisan/pesan hangat untuk keluarga tercinta.
   - Menjelaskan cara kerja Brankas (Vault) Warisan, enkripsi aman tanpa membuka PIN/kunci mentah, dan penunjukan Wali (Guardian).
   - Tetap menjaga keamanan data: jangan pernah meminta atau menampilkan password/seed phrase mentah (gunakan pola terenkripsi/petunjuk aman).

3. GAYA BAHASA & NADA BICARA:
   - Gunakan bahasa Indonesia yang santai, bersahabat, hangat, dan penuh rasa peduli layaknya sahabat dekat yang bijak.
   - Jangan kaku seperti robot.
   - Saat berbicara dengan Guardian jika pengguna berhalangan/meninggal, gunakan nada empati yang sopan dan menenangkan.

FUNGSI EVALUASI INAKTIVITAS (Output JSON jika memproses data status):
- "status_pengguna": "AKTIF" atau "INAKTIF_TERDETEKSI"
- "pesan_ke_guardian": Teks pesan hangat yang menjelaskan kondisi dan cara mengakses data.
  Contoh: "Halo [Nama Guardian], kami dari aplikasi Are you Still Alive? memberi tahu bahwa [Nama Pengguna] sudah tidak melakukan check-in selama [X] hari. Sesuai amanah beliau, berikut kami lampirkan panduan akses untuk beberapa dokumen penting yang telah disiapkan khusus untuk Anda."
- "ringkasan_vault": Ringkasan aman daftar dokumen yang diwariskan (tanpa membuka isi sensitifnya).
- "instruksi_keamanan": Langkah-langkah verifikasi yang harus dilakukan Guardian.
`;

// Endpoint: Process Inactivity & Vault Data
app.post('/api/agent/process-wills', async (req: Request, res: Response) => {
  try {
    const {
      user_name = 'Budi Santoso',
      guardian_name = 'Ratna Dewi',
      guardian_relationship = 'Istri & Wali Utama',
      inactive_days = 30,
      threshold_days = 14,
      is_inactive = true,
      vault_items = [],
      personal_note = '',
    } = req.body;

    const userStatus = is_inactive || inactive_days >= threshold_days ? 'INAKTIF_TERDETEKSI' : 'AKTIF';

    const promptText = `
DATA PEMERIKSAAN SISTEM "Are you Still Alive?":
- Nama Pemilik Akun: ${user_name}
- Nama Guardian (Penerima): ${guardian_name} (${guardian_relationship})
- Jumlah Hari Tidak Check-in: ${inactive_days} hari (Ambang Batas: ${threshold_days} hari)
- Status Inaktivitas Terdeteksi: ${userStatus}
- Pesan Pribadi Tersimpan dari Pemilik: ${personal_note || 'Tidak ada pesan khusus tambahan.'}
- Daftar Brankas Digital (Vault) yang Didaftarkan:
${JSON.stringify(vault_items, null, 2)}

Tolong proses data di atas sesuai peranmu sebagai Asisten Pendamping "Are you Still Alive?".
Pastikan menjaga empati mendalam, menghormati privasi, dan TIDAK MEMBEBERKAN kredensial mentah/password secara eksplisit.
Hasilkan JSON sesuai skema yang telah ditentukan.
`;

    // Attempt Gemini 3.8 Flash model execution
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: promptText,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION_ASISTEN,
          temperature: 0.4,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              status_pengguna: {
                type: Type.STRING,
                description: '"AKTIF" atau "INAKTIF_TERDETEKSI"',
              },
              pesan_ke_guardian: {
                type: Type.STRING,
                description: 'Teks pesan hangat dan empathetic kepada Guardian sesuai gaya Are you Still Alive?',
              },
              ringkasan_vault: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Ringkasan aman daftar dokumen/aset digital yang diwariskan tanpa kredensial mentah',
              },
              instruksi_keamanan: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Langkah verifikasi identitas dan keamanan bagi Guardian',
              },
            },
            required: ['status_pengguna', 'pesan_ke_guardian', 'ringkasan_vault', 'instruksi_keamanan'],
          },
        },
      });

      const text = response.text;
      if (text) {
        const parsed = JSON.parse(text);
        return res.json({ success: true, data: parsed });
      }
    } catch (aiErr) {
      console.warn('AI call fallback to structured generator:', aiErr);
    }

    // High quality empathetic fallback if API key is pending or offline
    const fallbackResponse = {
      status_pengguna: userStatus,
      pesan_ke_guardian:
        userStatus === 'INAKTIF_TERDETEKSI'
          ? `Halo ${guardian_name}, kami dari aplikasi Are you Still Alive? memberi tahu bahwa ${user_name} sudah tidak melakukan check-in selama ${inactive_days} hari. Sesuai amanah beliau, berikut kami lampirkan panduan akses untuk beberapa dokumen penting yang telah disiapkan khusus untuk Anda.`
          : `Halo ${guardian_name}, kami dari aplikasi Are you Still Alive? menginformasikan bahwa ${user_name} saat ini masih dalam status AKTIF (check-in berkala terpenuhi). Brankas digital dan amanah beliau tetap tersimpan aman dalam enkripsi.`,
      ringkasan_vault: vault_items.map(
        (item: { title: string; category?: string; recipient_guardian?: string }) =>
          `Dokumen: ${item.title} (Kategori: ${item.category || 'Penting'}) - Ditujukan khusus untuk ${item.recipient_guardian || guardian_name}. Isi dilindungi enkripsi brankas tingkat tinggi.`
      ),
      instruksi_keamanan: [
        'Verifikasi Identitas Guardian melalui tautan otentikasi resmi berenkripsi Are you Still Alive?.',
        'Masukkan Kode Otentikasi Ganda (2FA) dan unggah dokumen verifikasi kekerabatan.',
        'Kunci pembuka brankas akan diuraikan secara aman setelah masa sanggah 48 jam berakhir tanpa ada pembatalan.',
        'Hubungi Layanan Pendampingan keluarga jika membutuhkan panduan langsung dalam suasana berduka.',
      ],
    };

    return res.json({ success: true, data: fallbackResponse });
  } catch (error: any) {
    console.error('Error processing wills:', error);
    return res.status(500).json({ error: error?.message || 'Gagal memproses wasiat digital.' });
  }
});

// Endpoint: Consultation with Asisten Pendamping Sehat & Wasiat
app.post('/api/agent/consult', async (req: Request, res: Response) => {
  try {
    const { question = '' } = req.body;

    const chatPrompt = `
Pengguna menyapa atau bertanya kepada Asisten Pendamping "Are you Still Alive?":
Pertanyaan Pengguna: "${question}"

Instruksi Khusus:
- Balas dengan bahasa Indonesia yang santai, bersahabat, hangat, penuh rasa peduli, dan tidak kaku seperti robot.
- Jika pengguna bertanya tentang kesehatan/kebugaran/tidak gampang capek/tips tidur/manajemen stres:
  * Berikan jawaban berbentuk poin-poin bernomor yang simpel dan mudah dipraktikkan.
  * Sertakan catatan ramah: untuk keluhan fisik yang berat, tetap periksakan ke dokter.
  * Akhiri dengan pertanyaan balik yang ramah dan interaktif (misalnya menanyakan kebiasaan air minum, waktu tidur, atau olahraga harian).
- Jika pengguna bertanya tentang wasiat, surat perpisahan, atau brankas digital:
  * Berikan panduan yang menenangkan hati, jelaskan cara kerja Vault, pentingnya petunjuk aman tanpa membocorkan PIN mentah, dan penunjukan Guardian.
`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: chatPrompt,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION_ASISTEN,
          temperature: 0.65,
        },
      });

      const reply = response.text || 'Hai! Senang bisa mendampingi kamu hari ini. Ada yang bisa kita obrolkan?';
      return res.json({ success: true, reply });
    } catch (err) {
      // Smart contextual fallback
      const qLower = question.toLowerCase();
      if (qLower.includes('capek') || qLower.includes('lelah') || qLower.includes('kerja') || qLower.includes('energi')) {
        return res.json({
          success: true,
          reply: `Boleh banget! Biar energi kamu tetap terjaga seharian dan gak gampang tumbang, coba 3 langkah simpel ini yuk:
1. Terapkan Aturan 20-20-20: Tiap 20 menit menatap layar, tatap area sejauh 6 meter selama 20 detik biar mata gak lelah.
2. Minum segelas air putih tiap 1-2 jam sekali: Dehidrasi ringan sering kali jadi biang kerok utama tubuh terasa lemas tanpa disadari.
3. Luangkan jeda 5 menit buat stretching ringan: Putar bahu, renggangkan leher dan punggung agar aliran darah kembali lancar.

(Catatan kecil: Kalau rasa lelahnya berkepanjangan dan disertai gejala fisik lain, jangan ragu untuk periksa ke dokter ya!)

Hari ini kamu sudah minum berapa gelas air putih?`,
        });
      }

      return res.json({
        success: true,
        reply: `Hai! Senang banget bisa ngobrol sama kamu. Di Are you Still Alive?, fokus utamaku adalah nemenin kamu tetap sehat, panjang umur, dan punya perencanaan hidup yang tenang. Kita bisa bahas tips bugar harian, cara ngatur stres, sampai panduan bikin surat pesan hangat buat keluarga di brankas digital.

Hari ini badan dan pikiranmu rasanya gimana, segar atau lagi butuh rehat sejenak?`,
      });
    }
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || 'Gagal memproses konsultasi.' });
  }
});

// Vite Middleware & Static Serving
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (isProd) {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  const PORT = process.env.PORT || 3000;
  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`HIDUP? Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
