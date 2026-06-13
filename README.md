# Frawell — Anket + Dashboard

Kullanıcı yönelim anketi & gerçek zamanlı kurucu dashboard'u.

## Yığın
- **Next.js** (App Router, TypeScript)
- **Tailwind CSS** + **Framer Motion**
- **Supabase** (PostgreSQL + Realtime)
- **@dnd-kit** (drag & drop sıralama)
- **Recharts** (grafik)

---

## Kurulum

### 1. Bağımlılıklar
```bash
npm install
```

### 2. Supabase Kurulumu
1. [supabase.com](https://supabase.com) → New Project
2. **SQL Editor** → `supabase-schema.sql` dosyasının içeriğini yapıştır → Run
3. **Project Settings > API** → URL ve anon key'i kopyala

### 3. .env.local
```
NEXT_PUBLIC_SUPABASE_URL=https://PROJE_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=ANON_KEY
```

### 4. Geliştirme
```bash
npm run dev
```

- **Anket:** http://localhost:3000
- **Dashboard:** http://localhost:3000/dashboard

---

## Vercel Deploy
1. GitHub'a push et
2. [vercel.com](https://vercel.com) → Import repo
3. Environment Variables bölümüne `.env.local`'daki değerleri ekle
4. Deploy

Supabase + Vercel birlikte çalışmak için tasarlanmış — sıfır ek konfig.
