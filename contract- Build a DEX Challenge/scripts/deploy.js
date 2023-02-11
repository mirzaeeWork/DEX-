const hre = require("hardhat");

async function main() {
  const ExampBalloons = await hre.ethers.getContractFactory("Balloons");
  const exampleBalloons = await ExampBalloons.deploy("Balloons", "BAL");

  await exampleBalloons.deployed();

  console.log("Balloons deployed to:", exampleBalloons.address);

  const ExampleDEX = await hre.ethers.getContractFactory("DEX");
  const exampleDEX = await ExampleDEX.deploy(exampleBalloons.address);

  await exampleDEX.deployed();
  console.log("DEX deployed to:", exampleDEX.address);

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
