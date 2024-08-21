// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Supply Chain Tracking isimli kontrat
contract SupplyChainTracking {
    // Ürün bilgilerini tutan yapı (struct)
    struct Product {
        string name;               // Ürünün adı
        uint256 productId;         // Ürün kimlik numarası
        address manufacturer;      // Üreticinin adresi
        address owner;             // Ürünün mevcut sahibi
        string currentLocation;    // Ürünün mevcut lokasyonu
        string status;             // Ürünün durumu (örneğin, Üretildi, Sevk Edildi, vb.)
        uint256 timestamp;         // Ürünün oluşturulma veya güncellenme zamanı
    }

    // Ürün geçmişini tutan yapı (struct)
    struct ProductHistory {
        string location;           // Ürünün bulunduğu lokasyon
        string status;             // Ürünün o andaki durumu
        uint256 timestamp;         // Geçmiş kaydının oluşturulma zamanı
    }

    // Ürünleri ID ile eşleştiren bir mapping (hash tablosu)
    mapping(uint256 => Product) public products;
    
    // Ürün geçmişlerini ID ile eşleştiren bir mapping (hash tablosu)
    mapping(uint256 => ProductHistory[]) public productHistories;
    
    // Toplam ürün sayısını tutan sayaç
    uint256 public productCount;

    // Yeni bir ürün eklendiğinde tetiklenen event
    event ProductAdded(uint256 productId, string name, address manufacturer);
    
    // Ürün transferi olduğunda tetiklenen event
    event ProductTransferred(uint256 productId, string newLocation, string status, address transferredBy);

    // Yeni bir ürün ekleyen fonksiyon
    function addProduct(string memory _name, string memory _initialLocation) public {
        // Ürün adı ve lokasyonunun boş olmadığını kontrol et
        require(bytes(_name).length > 0, "Invalid product name");
        require(bytes(_initialLocation).length > 0, "Invalid location");

        // Ürün sayacını artır ve yeni ürün ekle
        productCount++;
        products[productCount] = Product({
            name: _name,
            productId: productCount,
            manufacturer: msg.sender,
            owner: msg.sender,
            currentLocation: _initialLocation,
            status: "Manufactured",       // Varsayılan durum: Üretildi
            timestamp: block.timestamp    // Şu anki zaman damgası
        });

        // Ürün geçmişine başlangıç kaydını ekle
        productHistories[productCount].push(ProductHistory({
            location: _initialLocation,
            status: "Manufactured",
            timestamp: block.timestamp
        }));

        // Ürün eklendiğini belirten event yayınla
        emit ProductAdded(productCount, _name, msg.sender);
    }

    // Ürünün lokasyonunu güncelleyen fonksiyon
    function updateLocation(uint256 _productId, string memory _newLocation, string memory _status) public {
        // Geçerli bir ürün ID'si olup olmadığını kontrol et
        require(_productId > 0 && _productId <= productCount, "Product does not exist");

        // Ürünü memory'den al
        Product storage product = products[_productId];

        // Lokasyonun veya durumun değiştiğini kontrol et
        require(
            keccak256(bytes(product.currentLocation)) != keccak256(bytes(_newLocation)) || 
            keccak256(bytes(product.status)) != keccak256(bytes(_status)),
            "Cannot revert to previous state"
        );

        // Ürünün yeni lokasyonunu, durumunu ve zaman damgasını güncelle
        product.currentLocation = _newLocation;
        product.status = _status;
        product.timestamp = block.timestamp;

        // Ürün geçmişine yeni bir kayıt ekle
        productHistories[_productId].push(ProductHistory({
            location: _newLocation,
            status: _status,
            timestamp: block.timestamp
        }));

        // Ürün transferini belirten event yayınla
        emit ProductTransferred(_productId, _newLocation, _status, msg.sender);
    }

    // Ürün bilgilerini getiren fonksiyon
    function getProduct(uint256 _productId) public view returns (string memory, uint256, address, address, string memory, string memory, uint256) {
        // Geçerli bir ürün ID'si olup olmadığını kontrol et
        require(_productId > 0 && _productId <= productCount, "Product does not exist");

        // Ürünün bilgilerini döndür
        Product memory product = products[_productId];
        return (
            product.name,
            product.productId,
            product.manufacturer,
            product.owner,
            product.currentLocation,
            product.status,
            product.timestamp
        );
    }

    // Ürün geçmişini getiren fonksiyon
    function getProductHistory(uint256 _productId) public view returns (ProductHistory[] memory) {
        // Geçerli bir ürün ID'si olup olmadığını kontrol et
        require(_productId > 0 && _productId <= productCount, "Product does not exist");
        
        // Ürün geçmişini döndür
        return productHistories[_productId];
    }
}
