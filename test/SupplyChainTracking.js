// Chai kütüphanesinden 'expect' fonksiyonu import ediliyor, bu fonksiyon testlerde kullanılan doğrulama işlemleri için kullanılır.
const { expect } = require("chai");

// Hardhat'tan 'ethers' nesnesi import ediliyor, bu nesne Ethereum ile ilgili çeşitli fonksiyonları sağlar.
const { ethers } = require("hardhat");

describe("SupplyChainTracking", function () {
    let SupplyChainTracking;
    let supplyChainTracking;
    let owner, addr1, addr2;

    // Her testten önce çalıştırılacak olan 'beforeEach' bloğu
    beforeEach(async function () {
        // 'SupplyChainTracking' isimli kontratın örneği oluşturuluyor.
        SupplyChainTracking = await ethers.getContractFactory("SupplyChainTracking");

        // Farklı adresler için imzalar alınıyor (sözleşme sahibi ve diğer iki adres).
        [owner, addr1, addr2] = await ethers.getSigners();

        // Kontrat blockchain üzerinde dağıtılıyor (deploy ediliyor).
        supplyChainTracking = await SupplyChainTracking.deploy();
    });

    describe("Product Management", function () {
        // Yeni bir ürün eklenmesi ve doğrulanması ile ilgili test
        it("Should add a new product", async function () {
            // 'Laptop' isimli bir ürün ekleniyor.
            await supplyChainTracking.addProduct("Laptop", "Factory");

            // Ürün bilgileri alınıyor ve doğrulama yapılıyor.
            const product = await supplyChainTracking.getProduct(1);
            expect(product[0]).to.equal("Laptop");              // Ürün adı kontrolü
            expect(product[1]).to.equal(1);                     // Ürün ID'si kontrolü
            expect(product[2]).to.equal(owner.address);         // Üretici adresi kontrolü
            expect(product[3]).to.equal(owner.address);         // Sahip adresi kontrolü
            expect(product[4]).to.equal("Factory");             // Ürün lokasyonu kontrolü
            expect(product[5]).to.equal("Manufactured");        // Ürün durumu kontrolü
        });

        // Yeni bir ürün eklendiğinde event'in emit edilmesi gerektiği test ediliyor
        it("Should emit an event when a product is added", async function () {
            // 'Smartphone' ürünü eklenirken 'ProductAdded' event'inin emit edildiği doğrulanıyor.
            await expect(supplyChainTracking.addProduct("Smartphone", "Warehouse"))
                .to.emit(supplyChainTracking, "ProductAdded")
                .withArgs(1, "Smartphone", owner.address);
        });

        // Ürünün lokasyonunu ve durumunu güncelleme testi
        it("Should update the product's location and status", async function () {
            // Önce 'Laptop' ürünü ekleniyor.
            await supplyChainTracking.addProduct("Laptop", "Factory");

            // Ürünün lokasyonu ve durumu güncelleniyor.
            await supplyChainTracking.updateLocation(1, "Warehouse", "In Transit");

            // Güncellenen ürün bilgileri doğrulanıyor.
            const product = await supplyChainTracking.getProduct(1);
            expect(product[4]).to.equal("Warehouse");           // Yeni lokasyon kontrolü
            expect(product[5]).to.equal("In Transit");          // Yeni durum kontrolü
        });

        // Ürünün lokasyonu ve durumu güncellendiğinde event'in emit edilmesi gerektiği test ediliyor
        it("Should emit an event when product location and status are updated", async function () {
            // Önce 'Tablet' ürünü ekleniyor.
            await supplyChainTracking.addProduct("Tablet", "Factory");

            // Lokasyon ve durum güncellenirken 'ProductTransferred' event'inin emit edildiği doğrulanıyor.
            await expect(supplyChainTracking.updateLocation(1, "Retail Store", "Delivered"))
                .to.emit(supplyChainTracking, "ProductTransferred")
                .withArgs(1, "Retail Store", "Delivered", owner.address);
        });

        // Var olmayan bir ürünü güncellemeye çalışmanın başarısız olacağı test ediliyor
        it("Should fail to update a non-existent product", async function () {
            // Ürün ID'si 999 olan bir ürün güncellenmeye çalışılıyor, başarısız olmalı.
            await expect(
                supplyChainTracking.updateLocation(999, "Warehouse", "In Transit")
            ).to.be.revertedWith("Product does not exist");
        });

        // Başka bir adresin bir ürünün lokasyonunu güncelleyebilmesi testi
        it("Should allow another address to update a product's location", async function () {
            // Önce 'Laptop' ürünü ekleniyor.
            await supplyChainTracking.addProduct("Laptop", "Factory");
        
            // addr1 adresi ürünü güncelliyor.
            await supplyChainTracking.connect(addr1).updateLocation(1, "Warehouse", "In Transit");
        
            // Güncellenen ürün bilgileri doğrulanıyor.
            const product = await supplyChainTracking.getProduct(1);
            expect(product[4]).to.equal("Warehouse");           // Yeni lokasyon kontrolü
            expect(product[5]).to.equal("In Transit");          // Yeni durum kontrolü
        });

        // Bir ürünün detaylarının doğru şekilde alınabildiğini test eden fonksiyon
        it("Should retrieve product details", async function () {
            // Önce 'Laptop' ürünü ekleniyor.
            await supplyChainTracking.addProduct("Laptop", "Factory");

            // Ürün bilgileri alınıyor ve doğrulama yapılıyor.
            const product = await supplyChainTracking.getProduct(1);
            expect(product[0]).to.equal("Laptop");              // Ürün adı kontrolü
            expect(product[1]).to.equal(1);                     // Ürün ID'si kontrolü
            expect(product[2]).to.equal(owner.address);         // Üretici adresi kontrolü
            expect(product[3]).to.equal(owner.address);         // Sahip adresi kontrolü
            expect(product[4]).to.equal("Factory");             // Ürün lokasyonu kontrolü
            expect(product[5]).to.equal("Manufactured");        // Ürün durumu kontrolü
        });

        // Var olmayan bir ürünün detaylarının alınmaya çalışıldığında başarısız olacağı test ediliyor
        it("Should revert when retrieving a non-existent product", async function () {
            // Ürün ID'si 2 olan bir ürün alınıyor, ama var olmadığı için hata dönecek.
            await expect(supplyChainTracking.getProduct(2)).to.be.revertedWith("Product does not exist");
        });

        // Birden fazla ürünün eklenip, ayrı ayrı izlenebileceğini test eden fonksiyon
        it("Should add multiple products and track them separately", async function () {
            // 'Laptop' ve 'Smartphone' ürünleri ekleniyor.
            await supplyChainTracking.addProduct("Laptop", "Factory");
            await supplyChainTracking.addProduct("Smartphone", "Warehouse");

            // Ürün bilgileri alınıyor ve doğrulama yapılıyor.
            const product1 = await supplyChainTracking.getProduct(1);
            const product2 = await supplyChainTracking.getProduct(2);

            // Her bir ürünün ayrı ayrı bilgileri doğrulanıyor.
            expect(product1[0]).to.equal("Laptop");
            expect(product1[4]).to.equal("Factory");

            expect(product2[0]).to.equal("Smartphone");
            expect(product2[4]).to.equal("Warehouse");
        });

        // Ürünün durumu güncellenmediğinde durumu koruduğunu test eden fonksiyon
        it("Should maintain product status if not updated", async function () {
            // 'Laptop' ürünü ekleniyor ve ardından iki kez güncelleniyor.
            await supplyChainTracking.addProduct("Laptop", "Factory");

            await supplyChainTracking.updateLocation(1, "Warehouse", "In Transit");

            // Durum değişmeden lokasyon güncelleniyor.
            await supplyChainTracking.updateLocation(1, "Retail Store", "In Transit"); // Status remains "In Transit"

            // Ürün durumu ve lokasyonu doğrulanıyor.
            const product = await supplyChainTracking.getProduct(1);
            expect(product[4]).to.equal("Retail Store");
            expect(product[5]).to.equal("In Transit");
        });

        // Aynı lokasyon ve durum ile yapılan güncellemenin başarısız olacağını test eden fonksiyon
        it("Should handle update to the same location and status", async function () {
            // 'Laptop' ürünü ekleniyor.
            await supplyChainTracking.addProduct("Laptop", "Factory");
        
            // Aynı lokasyon ve durum ile güncelleme yapılıyor, bu durumda hata bekleniyor.
            await expect(supplyChainTracking.updateLocation(1, "Factory", "Manufactured"))
                .to.be.revertedWith("Cannot revert to previous state");
        });

        // Birden fazla ürün için üreticinin doğru şekilde izlendiğini test eden fonksiyon
        it("Should correctly track manufacturer for multiple products", async function () {
            // Farklı adreslerden iki farklı ürün ekleniyor.
            await supplyChainTracking.addProduct("Laptop", "Factory");
            await supplyChainTracking.connect(addr1).addProduct("Smartphone", "Warehouse");

            // Ürün bilgileri alınıyor ve üretici adresleri doğrulanıyor.
            const product1 = await supplyChainTracking.getProduct(1);
            const product2 = await supplyChainTracking.getProduct(2);

            expect(product1[2]).to.equal(owner.address);  // İlk ürünün üreticisi owner
            expect(product2[2]).to.equal(addr1.address);  // İkinci ürünün üreticisi addr1
        });

        // Ürün eklenmeden önce güncelleme yapmaya çalışmanın başarısız olacağını test eden fonksiyon
        it("Should revert if attempting to update without adding a product", async function () {
            // Eklenmemiş bir ürün güncellenmeye çalışılıyor, hata bekleniyor.
            await expect(supplyChainTracking.updateLocation(999, "Factory", "Manufactured")).to.be.revertedWith("Product does not exist");
        });

        // Aynı isimde birden fazla ürün eklenebilmesi testi
        it("Should allow adding products with the same name", async function () {
            // Aynı isimde iki 'Laptop' ürünü ekleniyor.
            await supplyChainTracking.addProduct("Laptop", "Factory");
            await expect(supplyChainTracking.addProduct("Laptop", "Factory")).to.not.be.reverted;
        });

        // Sadece lokasyon güncellendiğinde diğer bilgilerin değişmediğini doğrulayan test
        it("Should not change other details when updating only the location", async function () {
            // 'Laptop' ürünü ekleniyor.
            await supplyChainTracking.addProduct("Laptop", "Factory");

            // Lokasyon güncelleniyor, diğer bilgiler doğrulanıyor.
            await supplyChainTracking.updateLocation(1, "Warehouse", "In Transit");

            const product = await supplyChainTracking.getProduct(1);
            expect(product[0]).to.equal("Laptop");
            expect(product[2]).to.equal(owner.address);
        });

        // Çok sayıda ürün eklenmesi ve takibi test eden fonksiyon
        it("Should correctly handle a large number of products", async function () {
            // 100 adet ürün ekleniyor.
            for (let i = 0; i < 100; i++) {
                await supplyChainTracking.addProduct(`Product ${i}`, "Factory");
            }

            // Toplam ürün sayısı kontrol ediliyor.
            expect(await supplyChainTracking.productCount()).to.equal(100);

            // Her bir ürünün doğru şekilde alınıp alınmadığı kontrol ediliyor.
            for (let i = 1; i <= 100; i++) {
                const product = await supplyChainTracking.getProduct(i);
                expect(product[0]).to.equal(`Product ${i-1}`);
            }
        });

        // Boş isimli ürün eklemeye çalışmanın başarısız olacağını test eden fonksiyon
        it("Should fail to add a product with an empty name", async function () {
            await expect(supplyChainTracking.addProduct("", "Factory")).to.be.revertedWith("Invalid product name");
        });

        // Boş lokasyonla ürün eklemeye çalışmanın başarısız olacağını test eden fonksiyon
        it("Should fail to add a product with an empty location", async function () {
            await expect(supplyChainTracking.addProduct("Laptop", "")).to.be.revertedWith("Invalid location");
        });

        // Bir ürün üzerinde birden fazla güncellemenin doğru şekilde çalıştığını test eden fonksiyon
        it("Should handle multiple updates correctly", async function () {
            // 'Laptop' ürünü ekleniyor.
            await supplyChainTracking.addProduct("Laptop", "Factory");

            // Lokasyon ve durum art arda güncelleniyor.
            await supplyChainTracking.updateLocation(1, "Warehouse", "In Transit");
            await supplyChainTracking.updateLocation(1, "Retail Store", "On Shelf");
            await supplyChainTracking.updateLocation(1, "Customer", "Delivered");

            // Ürünün son durumu ve lokasyonu doğrulanıyor.
            const product = await supplyChainTracking.getProduct(1);
            expect(product[4]).to.equal("Customer");
            expect(product[5]).to.equal("Delivered");
        });

        // Farklı adreslerin aynı ürünü güncelleyebilmesini test eden fonksiyon
        it("Should allow different addresses to update the same product", async function () {
            // 'Laptop' ürünü ekleniyor.
            await supplyChainTracking.addProduct("Laptop", "Factory");
        
            // addr1 ürünü güncelliyor.
            await supplyChainTracking.connect(addr1).updateLocation(1, "Warehouse", "In Transit");
        
            // addr2 ürünü tekrar güncelliyor.
            await supplyChainTracking.connect(addr2).updateLocation(1, "Retail Store", "Delivered");
        
            // Ürünün son durumu ve lokasyonu doğrulanıyor.
            const product = await supplyChainTracking.getProduct(1);
            expect(product[4]).to.equal("Retail Store");
            expect(product[5]).to.equal("Delivered");
        });

        // Aynı ürün üzerinde büyük çaplı güncellemelerin doğru çalıştığını test eden fonksiyon
        it("Should handle large scale updates on the same product", async function () {
            // 'Laptop' ürünü ekleniyor.
            await supplyChainTracking.addProduct("Laptop", "Factory");

            // Lokasyon ve durum art arda güncelleniyor.
            for (let i = 0; i < 10; i++) {
                await supplyChainTracking.updateLocation(1, `Location ${i}`, `Status ${i}`);
            }

            // Ürünün son durumu ve lokasyonu doğrulanıyor.
            const product = await supplyChainTracking.getProduct(1);
            expect(product[4]).to.equal("Location 9");
            expect(product[5]).to.equal("Status 9");
        });

        // Ürün sayısı sıfır olduğunda bunun doğru bir şekilde izlendiğini test eden fonksiyon
        it("Should revert if the product count is zero", async function () {
            expect(await supplyChainTracking.productCount()).to.equal(0);
        });
    });
});
