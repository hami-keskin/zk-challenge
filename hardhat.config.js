// .env dosyasındaki çevresel değişkenleri (environment variables) yüklemek için dotenv kütüphanesi kullanılıyor.
// Bu dosya, gizli bilgilerin (örneğin, API anahtarları, özel anahtarlar) kod içinde doğrudan bulunmasını önlemek için kullanılır.
require("dotenv").config();

// Hardhat için gerekli araçları sağlayan @nomicfoundation/hardhat-toolbox kütüphanesi import ediliyor.
// Bu kütüphane, testler, dağıtım (deployment) işlemleri ve akıllı sözleşmelerle ilgili diğer işlevler için gerekli araçları içerir.
require("@nomicfoundation/hardhat-toolbox");

// Hardhat yapılandırma dosyası, bu modül aracılığıyla dışa aktarılıyor.
// Bu dosya, Hardhat'ın nasıl çalışacağını tanımlayan ayarları içerir.
module.exports = {
  // Kullanılacak Solidity derleyici sürümü belirtiliyor.
  solidity: "0.8.24",
  
  // Ağlarla ilgili ayarlar yapılandırılıyor.
  networks: {
    // Scroll Testnet ağı için ayarlar yapılıyor.
    scrollTestnet: {
      // Scroll Testnet'in RPC URL'si belirtiliyor.
      url: "https://scroll-public.scroll-testnet.quiknode.pro", // Scroll Testnet RPC URL'si
      
      // Özel anahtar, .env dosyasından alınıyor ve hesap bilgisi olarak ayarlanıyor.
      // Bu özel anahtar, akıllı sözleşmeleri dağıtmak ve işlemler gerçekleştirmek için kullanılır.
      accounts: [process.env.PRIVATE_KEY], // .env dosyasından private key'i alıyoruz
    },
  },
};
