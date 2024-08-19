// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SupplyChainTracking {
    struct Product {
        string name;
        uint256 productId;
        address manufacturer;
        address owner;
        string currentLocation;
        string status;
        uint256 timestamp;
    }

    struct ProductHistory {
        string location;
        string status;
        uint256 timestamp;
    }

    mapping(uint256 => Product) public products;
    mapping(uint256 => ProductHistory[]) public productHistories;
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
            owner: msg.sender,
            currentLocation: _initialLocation,
            status: "Manufactured",
            timestamp: block.timestamp
        });

        productHistories[productCount].push(ProductHistory({
            location: _initialLocation,
            status: "Manufactured",
            timestamp: block.timestamp
        }));

        emit ProductAdded(productCount, _name, msg.sender);
    }

    function updateLocation(uint256 _productId, string memory _newLocation, string memory _status) public {
        require(_productId > 0 && _productId <= productCount, "Product does not exist");

        Product storage product = products[_productId];

        require(
            keccak256(bytes(product.currentLocation)) != keccak256(bytes(_newLocation)) || 
            keccak256(bytes(product.status)) != keccak256(bytes(_status)),
            "Cannot revert to previous state"
        );

        product.currentLocation = _newLocation;
        product.status = _status;
        product.timestamp = block.timestamp;

        productHistories[_productId].push(ProductHistory({
            location: _newLocation,
            status: _status,
            timestamp: block.timestamp
        }));

        emit ProductTransferred(_productId, _newLocation, _status, msg.sender);
    }

    function getProduct(uint256 _productId) public view returns (string memory, uint256, address, address, string memory, string memory, uint256) {
        require(_productId > 0 && _productId <= productCount, "Product does not exist");

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

    function getProductHistory(uint256 _productId) public view returns (ProductHistory[] memory) {
        require(_productId > 0 && _productId <= productCount, "Product does not exist");
        return productHistories[_productId];
    }
}
