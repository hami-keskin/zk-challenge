### README.md

# Proje Adı: BlockSupplyTrack

## Kimim:
- **Ad:** Hami KESKİN
- **Yetenekler:** Solidity, Ethereum, Scroll Blockchain, React.js
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

2. **Ön Yüz Geliştirme:**
   - **React.js Entegrasyonu:** React.js kullanarak kullanıcı arayüzü geliştirildi.
   - **Kullanıcı Girdileri:** Ürün ekleme ve ürün lokasyonunu güncelleme için formlar oluşturuldu.
   - **Veri Gösterimi:** Ürün detaylarını, geçmişini ve kayıtlı tüm ürünleri görüntülendi.

3. **Dağıtım:**
   - **Test Dağıtımı:** Akıllı kontratı Scroll Testnet'e dağıt.
   - **Frontend Dağıtımı:** React uygulamasını Vercel veya GitHub Pages gibi bir platformda barındır.

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
- **Ürün Ekle:** Ön yüzü kullanarak yeni ürünleri blockchain'e kaydedin.
- **Lokasyonu Güncelle:** Ürün hareketlerini takip ederek konum ve durumu güncelleyin.
- **Ürünleri Görüntüle:** Kayıtlı tüm ürünleri ve detaylarını görüntüleyin.
