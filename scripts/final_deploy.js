const { ethers } = require("hardhat");
async function main() {

    const Pizza = await ethers.getContractFactory("Pizza");
    const contract = await Pizza.deploy();
  
    await contract.deployed();
    console.log("Address of contract:", contract.address);
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });