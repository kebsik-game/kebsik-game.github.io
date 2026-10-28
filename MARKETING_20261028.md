# Mağaza kampanyası ve arama bilgileri — 28 Ekim

Bu dal, yeni mağaza görselleriyle aynı marka çizgisini ve doğru kapalı test durumunu hazırlar. Ana dal veya Pages yayını otomatik değiştirilmez.

- Mevcut `/`, `/tr/`, `/en/`, `/de/` ve karşılıklı canonical/hreflang korunur.
- Yerel başlıklar, 1200×630 OG/Twitter görselleri, görünür cevaplarla eşleşen FAQ/JSON-LD; Android paket kimliği ve Beta bilgisi günceldir. Sahte puan, kullanıcı sayısı veya gelir iddiası eklenmez.
- Kapak ve sosyal görsellerin JPEG web sürümleri toplam yaklaşık 1,1 MB; Play için hazırlanan yüksek çözünürlüklü PNG'ler ayrı pakettedir. Kaynak marka ikonuna dokunulmadı; favicon mevcut onaylı 512 px dosyadır.
- `/test/` ve `/test/tr/`, `/test/en/`, `/test/de/`: gerçek Alpha grubuna katıl → Play'de tester ol → indir. Android kısıtı, aynı Google hesabı,14gün ricası, gerçek parayla satın almama ve geri bildirim adresi açıkça yazılıdır. Grup bağlantısı, 28 Ekim kaynak raporundaki Alpha testçi grubuyla aynıdır; yeni grup açılmadı.
- Yeni çerez, form, analitik veya üçüncü taraf kaynak yok. Mevcut `#tr/#en/#de` dil geçişi uyumluluğu korunur. `?z=ulotka` QR'ı test sayfasına yönlendirilmez.
- Sponsor katalogları/imzaları, app-ads.txt, uzak reklam ayarı ve hukuk sayfaları değişmez.

`llms.txt` yalnız mevcut resmi sayfalara ve gerçek ürün bilgisine işaret eder. Bunun veya JSON-LD'nin arama/yanıt motorlarında yer alma garantisi yoktur. Gerçek arama terimi/dönüşüm verisi olmadan artış iddiası yapılmaz.

Kontroller:

```sh
python3 tools/check_site.py
# Var olan Playwright kurulumu kullanılır; yeni paket/ücretli hizmet gerekmez.
NODE_PATH=/path/to/kebsik/node_modules CHROMIUM=/usr/bin/chromium SITE_CHECK_OUT=/tmp/kebsik-site-proof node tools/check_browser.cjs
```

Yapısal 8 sayfa,360/390 px'te 16 mobil durum; CTA kontrastı, taşma, kaynak hatası, dış ağ isteği ve QR/dil bağlantı uyumluluğu kontrol edilir. Testler Google hesabında gerçekten katılma, Play yayın izni veya AdMob gelir kabulü değildir. Ana sayfa yayın durumunu yalnız gerçek üretim erişimi doğrulandığında genel yayına çevirmek gerekir.

İnceleme: mağaza paketi https://github.com/kayaci325/deneme/pull/106 · bu site https://github.com/kebsik-game/kebsik-game.github.io/pull/4.
