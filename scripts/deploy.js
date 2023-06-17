const { ethers } = require("hardhat");

async function main() {
  const deCabFactory = await ethers.getContractFactory("deCab");
  console.log("contract depoying...");
  const deCab = await deCabFactory.deploy();
  await deCab.deployed();
  console.log(`Deployed contract to: ${deCab.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
