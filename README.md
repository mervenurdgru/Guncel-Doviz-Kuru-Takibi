# Guncel-Doviz-Kuru-Takibi 
BLM4531


Bu proje, **TCMB (Türkiye Cumhuriyet Merkez Bankası)** verilerini anlık olarak çeken, kullanıcıların döviz kurlarını takip etmesine, favori listeleri oluşturmasına ve geçmişe dönük grafiksel analizler yapmasına olanak tanıyan bir **Web Uygulamasıdır**.

Proje, **Modern Mimari** prensiplerine uygun olarak, Frontend ve Backend'in ayrıldığı (Decoupled) bir yapıda geliştirilmiştir.

## Özellikler

- **Kullanıcı Kimlik Doğrulama (JWT):** Güvenli kayıt olma ve giriş yapma sistemi. Şifreler veritabanında Hash'lenerek (şifrelenerek) saklanır.
- **Canlı Veri Akışı:** TCMB XML servisinden anlık döviz kurları (USD, EUR, GBP vb.) çekilir ve işlenir.
- **Favori Sistemi:** Kullanıcılar takip etmek istedikleri kurları favorilerine ekleyebilir ve çıkarabilir.
- **Grafiksel Analiz:**
  - Ana sayfada **7 Günlük (Haftalık)** değişim grafiği.
  - Detay sayfasında **30 Günlük (Aylık)** detaylı alan grafiği (Area Chart).
- **Geçmiş Veri Listesi:** Detay sayfasında gün gün fiyat değişimlerini gösteren tablo yapısı.
- **Responsive Tasarım:** Hem masaüstü hem mobil cihazlarda düzgün görünen modern arayüz.

## Kullanılan Teknolojiler

### Backend (Sunucu Tarafı)
- **Framework:** ASP.NET Core Web API (.NET 8)
- **Dil:** C#
- **Veritabanı:** MSSQL (Microsoft SQL Server)
- **ORM:** Entity Framework Core (Code First Yaklaşımı)
- **Güvenlik:** JWT (JSON Web Token) Authentication
- **Veri Entegrasyonu:** HttpClient & XML Parsing (TCMB Entegrasyonu)

### Frontend (İstemci Tarafı)
- **Library:** React.js
- **Build Tool:** Vite
- **HTTP İstemcisi:** Axios (Interceptor yapısı ile otomatik Token yönetimi)
- **Grafik Kütüphanesi:** Recharts
- **Routing:** React Router DOM
- **Stil:** Custom CSS (Modern, Dark Mode uyumlu tasarım)

## Proje Mimarisi

Uygulama **Client-Server** mimarisine sahiptir:
1.  **Backend:** TCMB'den veriyi çeker, işler ve kendi API endpoint'leri üzerinden dışarı açar. Ayrıca kullanıcı ve favori işlemlerini SQL veritabanında yönetir.
2.  **Frontend:** Backend API'si ile haberleşir. Kullanıcıdan aldığı verileri API'ye gönderir, API'den gelen verileri görselleştirir.

### Metot,Endpoint,Açıklama
- POST,/api/Auth/register,Yeni kullanıcı kaydı
- POST,/api/Auth/login,Kullanıcı girişi (Token döner)
- GET,/api/Currency/latest,TCMB güncel kurları getirir
- GET,/api/Currency/history/weekly/{code},7 günlük grafik verisi
- GET,/api/Currency/history/monthly/{code},30 günlük grafik verisi
- GET,/api/Favorites,Kullanıcının favorilerini getirir
- POST,/api/Favorites,Favori ekler
- DELETE,/api/Favorites/{code},Favori siler

### Gelecek Planları (Roadmap)
- Kullanıcı profil sayfası (Şifre değiştirme vb.)

- Döviz alarm sistemi (Kur belirli seviyeye gelince bildirim atma).

- Altın (Gram, Çeyrek) fiyatlarının eklenmesi.
