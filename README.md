### README.md

# Proje Adı: BlockSupplyTrack

## Kimim:
- **Ad:** Hami KESKİN
- **Yetenekler:** Solidity, Ethereum, React.js
- **E-posta:** hami.kskin@gmail.com

## Proje Detayları:
BlockSupplyTrack, Scroll Blockchain üzerinde uygulanmış bir blockchain tabanlı tedarik zinciri takip sistemidir. Üreticiler, distribütörler ve perakendeciler, ürünlerin tüm tedarik zinciri boyunca kaydını yapabilir, güncelleyebilir ve takip edebilir. Her ürünün konum ve durum değişiklikleri blockchain üzerinde değiştirilemez şekilde kaydedilerek şeffaflık, güvenlik ve izlenebilirlik sağlanır.

## Vizyon:
BlockSupplyTrack ile tedarik zinciri yönetimini blockchain teknolojisi ile devrim niteliğinde değiştirmeyi hedefliyoruz. Ürün hareketlerinin ve durumlarının değiştirilemez, merkeziyetsiz bir kaydını sağlayarak dolandırıcılığı azaltmayı, verimliliği artırmayı ve çeşitli endüstrilerde ürünlerin otantikliğini sağlamayı amaçlıyoruz. Bu proje, global tedarik zincirleri üzerinde büyük bir etki yaratma potansiyeline sahip olup, tüketici güvenini artıracak ve sürdürülebilir iş uygulamalarını teşvik edecektir.

## Yazılım Geliştirme Planı:
1. **Akıllı Kontrat Geliştirme:**
   - **Struct'ları Tanımla:** Ürün ve ÜrünGeçmişi struct'larını tanımlayarak ürün bilgilerini ve geçmiş verilerini sakla.
   - **Fonksiyonları Uygula:**
     - `addProduct(string _name, string _initialLocation)`: Yeni bir ürünü kaydetmek için.
     - `updateLocation(uint256 _productId, string _newLocation, string _status)`: Bir ürünün konumunu ve durumunu güncellemek için.
     - `getProduct(uint256 _productId)`: Belirli bir ürünün detaylarını almak için.
     - `getProductHistory(uint256 _productId)`: Bir ürünün geçmişini almak için.
   - **Event Tetiklemeleri:** İlgili işlemlerde `ProductAdded` ve `ProductTransferred` event'lerini tetikle.

2. **Frontend Geliştirme:**
   - **React.js Entegrasyonu:** React.js kullanarak kullanıcı arayüzü geliştirildi. Bu arayüz, kullanıcıların akıllı kontrat ile etkileşim kurmasına olanak tanır. MetaMask gibi bir cüzdan ile bağlantı sağlanarak blockchain'deki verilere erişim sağlanır.
   - **Kullanıcı Girdileri:** Ürün ekleme ve ürün lokasyonunu güncelleme için formlar oluşturuldu. Kullanıcılar, ürün bilgilerini girip bu bilgileri blockchain'e kaydedebilir.
   - **Veri Gösterimi:** Ürün detaylarını, geçmişini ve kayıtlı tüm ürünleri görüntüleme imkanı sunuldu. Tüm ürünler tablo şeklinde listelenir ve her bir ürünün adı, ID'si, üreticisi, sahibi, mevcut lokasyonu, durumu ve zaman damgası gösterilir.

3. **Test Geliştirme:**
   - Proje kapsamında, geliştirilen akıllı kontratın işlevselliğini ve güvenilirliğini sağlamak için kapsamlı testler yazıldı. Bu testler, farklı senaryolar altında kontratın doğru çalışıp çalışmadığını doğrulamak amacıyla geliştirilmiştir.
   - **Test Senaryoları:**
     - **Ürün Ekleme Testi:** Yeni bir ürün eklendiğinde, ürünün doğru şekilde kaydedildiğini doğrulayan ve event tetiklenip tetiklenmediğini kontrol eden testler.
     - **Ürün Güncelleme Testi:** Ürünün lokasyonu ve durumunun güncellenmesini ve güncelleme sırasında event'in doğru şekilde emit edilip edilmediğini doğrulayan testler.
     - **Geçersiz İşlemler Testi:** Var olmayan bir ürünü güncellemeye çalışmanın ve aynı lokasyon ile duruma sahip bir ürünü güncellemeye çalışmanın başarısız olacağını doğrulayan testler.
     - **Çoklu Ürün Yönetimi Testi:** Birden fazla ürün ekleyip, her birini ayrı ayrı izleyebilme kapasitesini ve doğru üretici adresleriyle kaydedildiğini doğrulayan testler.
     - **Boş İsim ve Lokasyon Testleri:** Boş isim veya lokasyon ile ürün eklemeye çalışıldığında hatalı işlemin engellendiğini doğrulayan testler.
     - **Büyük Ölçekli Ürün Yönetimi Testi:** Çok sayıda ürünün eklenip, sorunsuz şekilde takip edilip edilemeyeceğini test eden senaryolar.
   - Tüm testler `Mocha` ve `Chai` kullanılarak Hardhat ortamında çalıştırılmıştır.

4. **Dağıtım:**
   - **Test Dağıtımı:** Akıllı kontrat Scroll Testnet'e dağıtıldı.
   - **Frontend Dağıtımı:** React uygulaması Vercel veya GitHub Pages gibi bir platformda barındırıldı.

## Projeyi Kurma ve Çalıştırma Talimatları

### Gereksinimler:
- **Node.js:** Makinenizde Node.js yüklü olduğundan emin olun.
- **MetaMask:** Tarayıcınıza MetaMask uzantısını kurun.
- **Scroll Testnet:** MetaMask'ı Scroll Testnet için yapılandırın.

### Kurulum Adımları:
1. **Depoyu Klonlayın:**
   ```bash
   git clone https://github.com/hami-keskin/zk-challenge.git
   cd zk-challenge
   ```

2. **Bağımlılıkları Yükleyin:**
   ```bash
   npm install
   ```

3. **Çevresel Değişkenleri Yapılandırın:**
   - Proje kök dizininde bir `.env` dosyası oluşturun.
   - Scroll Testnet özel anahtarınızı ekleyin:
     ```env
     PRIVATE_KEY=scroll_testnet_private_keyiniz
     ```

4. **Akıllı Kontratı Derleyin:**
   ```bash
   npx hardhat compile
   ```

5. **Akıllı Kontratı Dağıtın:**
   ```bash
   npx hardhat run scripts/deploy.js --network scrollTestnet
   ```

6. **Frontend'i Çalıştırın:**
   ```bash
   npm start
   ```

### Kullanım:
- **Ürün Ekle:** Ön yüzü kullanarak yeni ürünleri blockchain'e kaydedin. Girdiğiniz ürün adı ve başlangıç lokasyonu blockchain'e kaydedilir.
- **Lokasyonu Güncelle:** Ürün hareketlerini takip ederek konum ve durumu güncelleyin. Ürün ID'sini girerek, yeni lokasyonu ve durumu belirleyebilirsiniz.
- **Ürünleri Görüntüle:** Kayıtlı tüm ürünleri ve detaylarını tablo şeklinde görüntüleyin.