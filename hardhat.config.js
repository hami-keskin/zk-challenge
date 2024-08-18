require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.24",
  networks: {
    scrollTestnet: {
      url: "https://scroll-public.scroll-testnet.quiknode.pro", // Scroll Testnet RPC URL'si
      accounts: [process.env.PRIVATE_KEY], // .env dosyasından private key'i alıyoruz
    },
  },
};
