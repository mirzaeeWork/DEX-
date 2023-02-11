const { expect } = require("chai");

const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("DEX&BalloonsContract", function () {
  async function deployTwoContract() {
    const ExampBalloons = await hre.ethers.getContractFactory("Balloons");
    const exampleBalloons = await ExampBalloons.deploy();

    await exampleBalloons.deployed();

    console.log("YourToken deployed to:", exampleBalloons.address);

    const ExampleDEX = await hre.ethers.getContractFactory("DEX");
    const exampleDEX = await ExampleDEX.deploy(exampleBalloons.address);

    await exampleDEX.deployed();
    console.log("Vendor deployed to:", exampleDEX.address);

    const [addr1, addr2] = await ethers.getSigners();
    await exampleBalloons.approve(exampleDEX.address, ethers.utils.parseEther("100"));
    const owner = await exampleDEX.init(ethers.utils.parseEther("5"), { value: ethers.utils.parseEther("5") });
    console.log('------------------------------------------')
    return { exampleBalloons, exampleDEX, addr1, addr2 };
  }

  it("should be able approve & init", async function () {
    console.log('------------------------------------------')
    const { exampleBalloons, exampleDEX, addr1, addr2 } = await loadFixture(deployTwoContract);
    const token_Reserves = await exampleBalloons.balanceOf(exampleDEX.address)
    expect(token_Reserves.toString()).to.equal(ethers.utils.parseEther("5").toString());
    const ETH_Reserves = await exampleDEX.getBalanceSmartContract();
    expect(ETH_Reserves.toString()).to.equal(ethers.utils.parseEther("5").toString());

  });

  it("should be able to sends Ether to DEX in exchange for $BAL", async function () {
    console.log('------------------------------------------')
    const { exampleBalloons, exampleDEX, addr1, addr2 } = await loadFixture(deployTwoContract);
    const token_Reserves = await exampleBalloons.balanceOf(exampleDEX.address)
    const ETH_Reserves = await exampleDEX.getBalanceSmartContract();
    const tokenOutput = await exampleDEX.price(ethers.utils.parseEther("7"), ETH_Reserves, token_Reserves)
    await expect(exampleDEX.connect(addr2).ethToToken({ value: ethers.utils.parseEther("7") }))
      .to.emit(exampleDEX, "EthToTokenSwap")
      .withArgs(addr2.address, "Eth to Balloons", ethers.utils.parseEther("7"), tokenOutput);

  });

  it("should be able to sends $BAL tokens to DEX in exchange for Ether", async function () {
    console.log('------------------------------------------')
    const { exampleBalloons, exampleDEX, addr1, addr2 } = await loadFixture(deployTwoContract);
    await exampleDEX.connect(addr2).ethToToken({ value: ethers.utils.parseEther("7") })
    const token_Reserves = await exampleBalloons.balanceOf(exampleDEX.address)
    const ETH_Reserves = await exampleDEX.getBalanceSmartContract();
    const token_Input = await exampleBalloons.balanceOf(addr2.address)
    // console.log(token_Input.toString())
    const ETH_Output = await exampleDEX.price(token_Input, token_Reserves, ETH_Reserves)
    console.log(ETH_Output)
    await exampleBalloons.connect(addr2).approve(exampleDEX.address, token_Input);
    await expect(exampleDEX.connect(addr2).tokenToEth(token_Input))
      .to.emit(exampleDEX, "TokenToEthSwap")
      .withArgs(addr2.address, "Balloons to ETH", ETH_Output, token_Input);
  });

  it("should be able to allows deposits of $BAL and $ETH to liquidity pool", async function () {
    console.log('------------------------------------------')
    const { exampleBalloons, exampleDEX, addr1, addr2 } = await loadFixture(deployTwoContract);
    await exampleDEX.connect(addr2).ethToToken({ value: ethers.utils.parseEther("7") })
    const token_Input = await exampleBalloons.balanceOf(addr2.address)
    await exampleBalloons.connect(addr2).approve(exampleDEX.address, token_Input);
    const ETH_Reserves = await exampleDEX.getBalanceSmartContract();
    const ETH_Amount = await exampleDEX.connect(addr2).takeOnMsgValueForDeposit();
    const sum = Number(ETH_Reserves) + Number(ETH_Amount);
    await exampleDEX.connect(addr2).deposit({ value: ETH_Amount })
    const ETH_OutPut = await exampleDEX.getBalanceSmartContract();
    expect(Number(ETH_OutPut)).to.equal(sum);
  });

  it("should be able to allows withdrawal of $BAL and $ETH from liquidity pool", async function () {
    console.log('------------------------------------------')
    const { exampleBalloons, exampleDEX, addr1, addr2 } = await loadFixture(deployTwoContract);
    await exampleDEX.connect(addr2).ethToToken({ value: ethers.utils.parseEther("7") })
    const token_Input = await exampleBalloons.balanceOf(addr2.address)
    await exampleBalloons.connect(addr2).approve(exampleDEX.address, token_Input);
    const ETH_Amount = await exampleDEX.connect(addr2).takeOnMsgValueForDeposit();
    await exampleDEX.connect(addr2).deposit({ value: ETH_Amount })
    const token_withdraw = await exampleDEX.getLiquidity(addr2.address);
    await exampleDEX.connect(addr2).withdraw(token_withdraw)
    expect(await exampleDEX.getLiquidity(addr2.address)).to.equal(0);
  });

});























