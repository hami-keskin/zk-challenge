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

        it("Should add multiple products and track them separately", async function () {
            await supplyChainTracking.addProduct("Laptop", "Factory");
            await supplyChainTracking.addProduct("Smartphone", "Warehouse");

            const product1 = await supplyChainTracking.getProduct(1);
            const product2 = await supplyChainTracking.getProduct(2);

            expect(product1[0]).to.equal("Laptop");
            expect(product1[3]).to.equal("Factory");

            expect(product2[0]).to.equal("Smartphone");
            expect(product2[3]).to.equal("Warehouse");
        });

        it("Should maintain product status if not updated", async function () {
            await supplyChainTracking.addProduct("Laptop", "Factory");

            await supplyChainTracking.updateLocation(1, "Warehouse", "In Transit");

            await supplyChainTracking.updateLocation(1, "Retail Store", "In Transit"); // Status remains "In Transit"

            const product = await supplyChainTracking.getProduct(1);
            expect(product[3]).to.equal("Retail Store");
            expect(product[4]).to.equal("In Transit");
        });

        it("Should handle update to the same location and status", async function () {
            await supplyChainTracking.addProduct("Laptop", "Factory");
        
            const productBeforeUpdate = await supplyChainTracking.getProduct(1);
            console.log("Before update:", productBeforeUpdate);
        
            // Trying to update with the same location and status
            await expect(supplyChainTracking.updateLocation(1, "Factory", "Manufactured"))
                .to.be.revertedWith("Cannot revert to previous state");
        
            const productAfterUpdate = await supplyChainTracking.getProduct(1);
            console.log("After failed update attempt:", productAfterUpdate);
        });
        

        it("Should correctly track manufacturer for multiple products", async function () {
            await supplyChainTracking.addProduct("Laptop", "Factory");
            await supplyChainTracking.connect(addr1).addProduct("Smartphone", "Warehouse");

            const product1 = await supplyChainTracking.getProduct(1);
            const product2 = await supplyChainTracking.getProduct(2);

            expect(product1[2]).to.equal(owner.address);
            expect(product2[2]).to.equal(addr1.address);
        });

        it("Should revert if attempting to update without adding a product", async function () {
            await expect(supplyChainTracking.updateLocation(1, "Factory", "Manufactured")).to.be.revertedWith("Product does not exist");
        });

        it("Should allow adding products with the same name", async function () {
            await supplyChainTracking.addProduct("Laptop", "Factory");
            await expect(supplyChainTracking.addProduct("Laptop", "Factory")).to.not.be.reverted;
        });

        it("Should not change other details when updating only the location", async function () {
            await supplyChainTracking.addProduct("Laptop", "Factory");

            await supplyChainTracking.updateLocation(1, "Warehouse", "In Transit");

            const product = await supplyChainTracking.getProduct(1);
            expect(product[0]).to.equal("Laptop");
            expect(product[2]).to.equal(owner.address);
        });

        it("Should correctly handle a large number of products", async function () {
            for (let i = 0; i < 100; i++) {
                await supplyChainTracking.addProduct(`Product ${i}`, "Factory");
            }

            expect(await supplyChainTracking.productCount()).to.equal(100);

            for (let i = 1; i <= 100; i++) {
                const product = await supplyChainTracking.getProduct(i);
                expect(product[0]).to.equal(`Product ${i-1}`);
            }
        });

        it("Should fail to add a product with an empty name", async function () {
            await expect(supplyChainTracking.addProduct("", "Factory")).to.be.revertedWith("Invalid product name");
        });

        it("Should fail to add a product with an empty location", async function () {
            await expect(supplyChainTracking.addProduct("Laptop", "")).to.be.revertedWith("Invalid location");
        });

        it("Should handle multiple updates correctly", async function () {
            await supplyChainTracking.addProduct("Laptop", "Factory");

            await supplyChainTracking.updateLocation(1, "Warehouse", "In Transit");
            await supplyChainTracking.updateLocation(1, "Retail Store", "On Shelf");
            await supplyChainTracking.updateLocation(1, "Customer", "Delivered");

            const product = await supplyChainTracking.getProduct(1);
            expect(product[3]).to.equal("Customer");
            expect(product[4]).to.equal("Delivered");
        });

        it("Should allow different addresses to update the same product", async function () {
            await supplyChainTracking.addProduct("Laptop", "Factory");

            await supplyChainTracking.connect(addr1).updateLocation(1, "Warehouse", "In Transit");
            await supplyChainTracking.connect(addr2).updateLocation(1, "Retail Store", "Delivered");

            const product = await supplyChainTracking.getProduct(1);
            expect(product[3]).to.equal("Retail Store");
            expect(product[4]).to.equal("Delivered");
        });

        it("Should handle large scale updates on the same product", async function () {
            await supplyChainTracking.addProduct("Laptop", "Factory");

            for (let i = 0; i < 10; i++) {
                await supplyChainTracking.updateLocation(1, `Location ${i}`, `Status ${i}`);
            }

            const product = await supplyChainTracking.getProduct(1);
            expect(product[3]).to.equal("Location 9");
            expect(product[4]).to.equal("Status 9");
        });

        it("Should revert if the product count is zero", async function () {
            expect(await supplyChainTracking.productCount()).to.equal(0);
        });
    });
});
