// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SupplyChainTracking {
    struct Product {
        string name;
        uint256 productId;
        address manufacturer;
        string currentLocation;
        string status;
    }

    mapping(uint256 => Product) public products;
    uint256 public productCount;

    event ProductAdded(uint256 productId, string name, address manufacturer);
    event ProductTransferred(uint256 productId, string newLocation, string status, address transferredBy);

    function addProduct(string memory _name, string memory _initialLocation) public {
        require(bytes(_name).length > 0, "Invalid product name");
        require(bytes(_initialLocation).length > 0, "Invalid location");

        productCount++;
        products[productCount] = Product({
            name: _name,
            productId: productCount,
            manufacturer: msg.sender,
            currentLocation: _initialLocation,
            status: "Manufactured"
        });

        emit ProductAdded(productCount, _name, msg.sender);
    }

    function updateLocation(uint256 _productId, string memory _newLocation, string memory _status) public {
        require(_productId > 0 && _productId <= productCount, "Product does not exist");

        Product storage product = products[_productId];

        // Aynı konuma ve aynı duruma geri dönmeyi engelleme
        require(
            keccak256(bytes(product.currentLocation)) != keccak256(bytes(_newLocation)) || 
            keccak256(bytes(product.status)) != keccak256(bytes(_status)),
            "Cannot revert to previous state"
        );

        product.currentLocation = _newLocation;
        product.status = _status;

        emit ProductTransferred(_productId, _newLocation, _status, msg.sender);
    }

    function getProduct(uint256 _productId) public view returns (string memory, uint256, address, string memory, string memory) {
        require(_productId > 0 && _productId <= productCount, "Product does not exist");

        Product memory product = products[_productId];
        return (
            product.name,
            product.productId,
            product.manufacturer,
            product.currentLocation,
            product.status
        );
    }
}
