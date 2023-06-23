const { ethers } = require("hardhat");

async function getBalances(address) {
  const balanceBigInt = await ethers.provider.getBalance(address);
  return ethers.utils.formatEther(balanceBigInt);
}

async function consoleBalances(addresses) {
  let counter = 0;
  for (const address of addresses) {
    console.log(`Address ${counter} balance:`, await getBalances(address));
    counter++;
  }
}

async function consoleMemos(memos) {
  for (const memo of memos) {
    const timestamp = memo.timestamp;
    const name = memo.name;
    const from = memo.from;
    const pizzaType = memo.pizzaType;
    const pizzaCount = memo.pizzaCount;
    const pizzaSize = memo.pizzaSize;
    console.log(
      `At ${timestamp}, name: ${name}, address: ${from}, pizzaType: ${pizzaType}, pizzaCount: ${pizzaCount}, pizzaSize: ${pizzaSize}`
    );
  }
}

async function main() {
  const [owner, from1, from2, from3] = await ethers.getSigners();
  const Pizza = await ethers.getContractFactory("Pizza");
  const contract = await Pizza.deploy();

  await contract.deployed();
  console.log("Address of contract:", contract.address);

  const addresses = [
    owner.address,
    from1.address,
    from2.address,
    from3.address,
  ];
  console.log("Before buying pizza");
  await consoleBalances(addresses);

  const amount1 = ethers.utils.parseEther("2");
  await contract.connect(from1).buyPizza("from1", "Pepperoni", 2, "Large", {
    value: amount1,
  });

  const amount2 = ethers.utils.parseEther("1.5");
  await contract.connect(from2).buyPizza("from2", "Margherita", 1, "Medium", {
    value: amount2,
  });

  const amount3 = ethers.utils.parseEther("3");
  await contract.connect(from3).buyPizza("from3", "Hawaiian", 3, "Small", {
    value: amount3,
  });

  console.log("After buying pizza");
  await consoleBalances(addresses);

  const memos = await contract.getMemos();
  consoleMemos(memos);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
