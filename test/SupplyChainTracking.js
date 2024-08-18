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

        it("Should update the product's location and status", async function () {
            await supplyChainTracking.addProduct("Laptop", "Factory");

            await supplyChainTracking.updateLocation(1, "Warehouse", "In Transit");

            const product = await supplyChainTracking.getProduct(1);
            expect(product[3]).to.equal("Warehouse");
            expect(product[4]).to.equal("In Transit");
        });

        it("Should fail to update a non-existent product", async function () {
            await expect(
                supplyChainTracking.updateLocation(2, "Warehouse", "In Transit")
            ).to.be.revertedWith("Product does not exist");
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
    });
});
