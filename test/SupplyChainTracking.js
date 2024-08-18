const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SupplyChainTracking", function () {
    let SupplyChainTracking;
    let supplyChainTracking;
    let owner, addr1, addr2;

    beforeEach(async function () {
        SupplyChainTracking = await ethers.getContractFactory("SupplyChainTracking");
        [owner, addr1, addr2] = await ethers.getSigners();
        supplyChainTracking = await SupplyChainTracking.deploy();
    });

    describe("Product Management", function () {
        it("Should add a new product", async function () {
            await supplyChainTracking.addProduct("Laptop", "Factory");

            const product = await supplyChainTracking.getProduct(1);
            expect(product[0]).to.equal("Laptop");
            expect(product[1]).to.equal(1);
            expect(product[2]).to.equal(owner.address);
            expect(product[3]).to.equal("Factory");
            expect(product[4]).to.equal("Manufactured");
        });

        it("Should emit an event when a product is added", async function () {
            await expect(supplyChainTracking.addProduct("Smartphone", "Warehouse"))
                .to.emit(supplyChainTracking, "ProductAdded")
                .withArgs(1, "Smartphone", owner.address);
        });

        it("Should update the product's location and status", async function () {
            await supplyChainTracking.addProduct("Laptop", "Factory");

            await supplyChainTracking.updateLocation(1, "Warehouse", "In Transit");

            const product = await supplyChainTracking.getProduct(1);
            expect(product[3]).to.equal("Warehouse");
            expect(product[4]).to.equal("In Transit");
        });

        it("Should emit an event when product location and status are updated", async function () {
            await supplyChainTracking.addProduct("Tablet", "Factory");

            await expect(supplyChainTracking.updateLocation(1, "Retail Store", "Delivered"))
                .to.emit(supplyChainTracking, "ProductTransferred")
                .withArgs(1, "Retail Store", "Delivered", owner.address);
        });

        it("Should fail to update a non-existent product", async function () {
            await expect(
                supplyChainTracking.updateLocation(2, "Warehouse", "In Transit")
            ).to.be.revertedWith("Product does not exist");
        });

        it("Should allow another address to update a product's location", async function () {
            await supplyChainTracking.addProduct("Laptop", "Factory");

            await supplyChainTracking.connect(addr1).updateLocation(1, "Warehouse", "In Transit");

            const product = await supplyChainTracking.getProduct(1);
            expect(product[3]).to.equal("Warehouse");
            expect(product[4]).to.equal("In Transit");
        });

        it("Should retrieve product details", async function () {
            await supplyChainTracking.addProduct("Laptop", "Factory");

            const product = await supplyChainTracking.getProduct(1);
            expect(product[0]).to.equal("Laptop");
            expect(product[1]).to.equal(1);
            expect(product[2]).to.equal(owner.address);
            expect(product[3]).to.equal("Factory");
            expect(product[4]).to.equal("Manufactured");
        });

        it("Should revert when retrieving a non-existent product", async function () {
            await expect(supplyChainTracking.getProduct(2)).to.be.revertedWith("Product does not exist");
        });

        it("Should increment product count correctly", async function () {
            await supplyChainTracking.addProduct("Laptop", "Factory");
            await supplyChainTracking.addProduct("Smartphone", "Warehouse");

            expect(await supplyChainTracking.productCount()).to.equal(2);
        });

        it("Should not allow product IDs to start from zero", async function () {
            await supplyChainTracking.addProduct("Laptop", "Factory");

            await expect(supplyChainTracking.getProduct(0)).to.be.revertedWith("Product does not exist");
        });
    });
});
