// ethers kütüphanesi Hardhat üzerinden import ediliyor. 
// ethers, Ethereum ile etkileşim için kullanılan bir kütüphanedir.
const { ethers } = require("hardhat");

// Asenkron bir main fonksiyonu tanımlanıyor, bu fonksiyon içinde kontrat dağıtımı yapılacak.
async function main() {
    // SupplyChainTracking kontratını temsil eden bir factory (üretici) oluşturuluyor.
    const Contract = await ethers.getContractFactory("SupplyChainTracking");
    
    // Kontratın blockchain'e dağıtımı gerçekleştiriliyor ve kontrat örneği döndürülüyor.
    const contract = await Contract.deploy();

    // Kontratın dağıtım işlemi sırasında oluşan işlem nesnesi konsola yazdırılıyor.
    console.log("Deploy transaction:", contract.deployTransaction); // Deploy işlem nesnesini yazdır

    // İşlemin blockchain üzerinde onaylanmasını bekliyoruz.
    await contract.deployTransaction.wait();

    // Kontratın başarılı bir şekilde dağıtıldığı adres konsola yazdırılıyor.
    console.log("Contract deployed to:", contract.address);
}

// main fonksiyonu çalıştırılıyor ve ardından process.exit(0) ile süreç sonlandırılıyor.
// Eğer bir hata oluşursa, hata yakalanıp konsola yazdırılır ve process.exit(1) ile süreç hata koduyla sonlandırılır.
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
