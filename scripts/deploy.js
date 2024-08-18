const { ethers } = require("hardhat");

async function main() {
    const Contract = await ethers.getContractFactory("SupplyChainTracking");
    const contract = await Contract.deploy();

    console.log("Deploy transaction:", contract.deployTransaction); // Deploy işlem nesnesini yazdır

    // İşlem onayını bekle
    await contract.deployTransaction.wait();

    console.log("Contract deployed to:", contract.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
