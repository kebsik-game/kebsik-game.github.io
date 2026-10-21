# Test opt-in → Play Store erişimi (2026-10-21)

Yeni yardım bölümü PL/TR/EN/DE, 360/390 px'te **8/8** görünümde doğrulandı (`checks.json`, aynı klasörde PNG'ler). İki katılım adımı korundu; ayrı doğrudan mağaza bağlantısı var. Yatay taşma, dış ağ isteği ve JavaScript hatası yok. Form/iframe, analitik veya yeni script eklenmedi.

Videoda web katılımı tamamlanmışken native Play Store “Öğe bulunamadı” gösteriyordu. Yardım, Play Store uygulamasındaki hesap seçimini tarayıcı oturumundan ayrı açıklar; Google'ın erişim yayılma süresini ve model/Android/ülke kontrolünü belirtir. Başarı garantisi vermez, kişisel e-posta/şifre toplamaz. Bu statik test, sorun yaşayan arkadaşın telefonunda indirmeyi doğrulamaz.

Canlı Console kontrolü: 1.0.5 (59) %100 selected-testers rollout; Türkiye hedefli; API24+; dört ABI (arm64-v8a, armeabi-v7a, x86, x86_64). Sahibin mevcut hesabıyla gerçek mağaza sayfası açıldı. Yayın/ülke/grup izinleri değiştirilmedi. Video/özel hesap ekranı bu depoda yok.

Taslak PR onaylanıp birleştirilmeden bu yardım canlı `/test/` sayfasında değildir.
