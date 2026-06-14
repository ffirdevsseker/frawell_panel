# Deploy (Vercel)

Proje GitHub'a push edildiğinde Vercel'in Git entegrasyonu otomatik build/deploy tetiklemiyor olabilir, bu yüzden manuel olarak Vercel CLI ile production'a deploy ediyoruz.

## Adımlar

1. Değişiklikleri commit'le ve `main`'e push et:
   ```bash
   git add <dosyalar>
   git commit -m "..."
   git push origin main
   ```

2. Vercel CLI ile production'a deploy et (proje kökünde, `.vercel/project.json` mevcut olduğu için ek bağlantı kurmaya gerek yok):
   ```bash
   npx vercel deploy --prod --yes
   ```

3. Çıktıda görünen production URL ve `https://frawellpanel.vercel.app` alias'ı güncellenmiş olur.

## Notlar

- Hesap: `frawellcompany-7628` (Vercel'e `npx vercel whoami` ile giriş kontrol edilebilir).
- Proje: `frawell_panel` (team: `frawellcompany-7628s-projects`).
- Deploy öncesi `npx tsc --noEmit` ile tip kontrolü yapmak önerilir.
