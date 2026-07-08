# EduFuture AI  — Platform Diagnostik & Konsultasi Karir Berbasis AI

EduFuture AI adalah platform edutech pintar yang dirancang untuk membantu siswa sekolah menengah mengidentifikasi keselarasan minat, gaya belajar, dan nilai akademis mereka dengan pilihan jurusan kuliah serta prospek karir masa depan. 

Menggunakan mesin klasifikasi **XGBoost** untuk prediksi keselarasan jurusan, model regresi untuk estimasi gaji, serta asisten AI interaktif bertenaga **Llama 3.1** (via Groq API) sebagai mentor karir personal. Seluruh data autentikasi dan riwayat prediksi terintegrasi secara aman menggunakan **Supabase**.

---

## 🛠️ Stack Teknologi

Platform ini dibangun menggunakan arsitektur **Monorepo** yang memisahkan aplikasi Frontend dan Backend Service secara modular:

### 1. Frontend (Client-side)
- **Core:** React.js (Vite) & JavaScript (ES6+)
- **Styling:** Tailwind CSS & Custom CSS variables (Vercel-inspired clean light-theme)
- **Icons:** Lucide React
- **State Management & Routing:** Native React state & localStorage draft preservation

### 2. Backend (Server-side & ML)
- **Framework:** FastAPI (Python 3.10+)
- **Machine Learning:** XGBoost (eXtreme Gradient Boosting) & Scikit-Learn (untuk encoding fitur & prediksi)
- **Database & Auth:** Supabase Client Python SDK
- **LLM Integration:** Groq SDK (Llama 3.1 8B Instant) untuk asisten konsultasi interaktif

---

## 📂 Struktur Folder Monorepo

```text
EduFuture/
├── FE/                     # Aplikasi Client React
│   ├── public/             # Aset publik statis (favicon, icons)
│   ├── src/
│   │   ├── assets/         # Ilustrasi & gambar UI
│   │   ├── components/     # Komponen UI modular (Navbar, LandingPage, PredictionForm, dll.)
│   │   ├── utils/          # API client fetcher & wrapper
│   │   ├── App.jsx         # App shell & router state
│   │   └── main.jsx        # Entry point React
│   ├── package.json        # Dependensi npm & scripts
│   └── vite.config.js      # Konfigurasi Vite bundler
│
├── Backend/                # FastAPI Machine Learning Service
│   ├── models/             # File pkl model ML hasil training & career mapping JSON
│   ├── routers/            # Endpoint modular (auth, predict, mentor)
│   ├── database.py         # Inisialisasi Supabase client
│   ├── dependencies.py     # Middleware otentikasi token
│   ├── main.py             # Entry point FastAPI & lifespan model loader
│   ├── schemas.py          # Validasi tipe request/response Pydantic
│   └── requirements.txt    # Dependensi Python pip
│
└── .gitignore              # Abaikan file build, virtualenv, env secrets, & logs tingkat root
```

---

## Panduan Instalasi & Menjalankan Aplikasi

### Langkah 1: Persiapan Environment Variables (`.env`)

#### 1. Konfigurasi Backend
Untuk memudahkan penilaian oleh Juri/Reviewer, kami menyediakan berkas sandbox testing credentials **`.env.example`** di dalam folder `Backend/` yang sudah terisi kredensial aktif Supabase dan Groq API. 

Juri hanya perlu menyalin atau mengubah nama berkas tersebut menjadi **`.env`** di dalam folder `Backend/`:
```bash
# Salin berkas .env.example menjadi .env
cp Backend/.env.example Backend/.env
```

Atau jika ingin menggunakan akun Supabase & Groq API Anda sendiri, silakan buat berkas `.env` secara manual di dalam folder `Backend/` dengan kunci berikut:
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-supabase-service-role-key
GROQ_API_KEY=gsk_your_groq_api_key_here
```

---

### Langkah 2: Menjalankan Backend Service

1. Buka terminal baru dan masuk ke folder `Backend`:
   ```bash
   cd Backend
   ```
2. Buat dan aktifkan virtual environment Python:
   ```bash
   # Windows
   python -m venv venv
   venv\Scripts\activate
   
   # Linux / macOS
   python3 -m venv venv
   source venv/bin/activate
   ```
3. Instal seluruh dependensi pustaka:
   ```bash
   pip install -r requirements.txt
   ```
4. Jalankan server FastAPI menggunakan Uvicorn:
   ```bash
   uvicorn main:app --reload --port 8000
   ```
   *Backend kini berjalan pada URL: `http://localhost:8000`*

---

### Langkah 3: Menjalankan Frontend Application

1. Buka terminal baru dan masuk ke folder `FE`:
   ```bash
   cd FE
   ```
2. Instal semua paket npm:
   ```bash
   npm install
   ```
3. Jalankan aplikasi web lokal:
   ```bash
   npm run dev
   ```
   *Frontend kini dapat diakses melalui browser di: `http://localhost:5173`*

---

## 📋 Fitur Utama Aplikasi

1. **Dashboard & Peta Jalan Karir**: Menganalisis nilai rapor (Matematika, Sains, Bahasa, Logika) dan gaya belajar untuk menghasilkan visualisasi top-3 skenario karir (Utama, Alternatif, Aman) lengkap dengan estimasi gaji.
2. **AI Mentor Chatbot**: Konsultasi kelanjutan karir interaktif berbasis konteks nilai rapor siswa yang dijawab secara langsung oleh Llama 3.1.
3. **Sistem Riwayat**: Menyimpan hasil prediksi secara historis ke database Supabase sehingga dapat ditinjau kembali di kemudian hari melalui dashboard siswa.
4. **Autentikasi Aman**: Fitur login & register gratis yang terhubung langsung dengan Supabase Auth Guard.

---

## ⚖️ Pernyataan Keaslian Karya & Lisensi
Karya software ini dibuat secara orisinal oleh tim pengembang dalam ajang kompetisi **CODE 6.0 Software Development 2026**. Seluruh kode sumber dilindungi oleh lisensi kepemilikan tim dan tidak diperkenankan untuk disalin tanpa izin tertulis.
