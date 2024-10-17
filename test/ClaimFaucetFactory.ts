import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";

describe("Claim Faucet Factory Test", function () {
  async function deployClaimFaucetFactoryFixture() {
    const [deployerOwner, otherAccount] = await hre.ethers.getSigners();

    const ClaimFaucetFactory = await hre.ethers.getContractFactory(
      "ClaimFaucetFactory"
    );
    const claimFaucetFactory = await ClaimFaucetFactory.deploy();

    return { claimFaucetFactory, deployerOwner, otherAccount };
  }

  describe("Deployment", () => {
    it("Should check if it deployed ", async function () {
      const { claimFaucetFactory, deployerOwner } = await loadFixture(
        deployClaimFaucetFactoryFixture
      );

      expect(await claimFaucetFactory.getAllContractDeployed());
    });
  });

  it("Should be able to deploy a new Claim Faucet", async function () {
    const { claimFaucetFactory, deployerOwner } = await loadFixture(
      deployClaimFaucetFactoryFixture
    );

    const faucet = await claimFaucetFactory
      .connect(deployerOwner)
      .deployClaimFaucet("Valora Token", "VLT");

    faucet.wait();

    const deployedContracts =
      await claimFaucetFactory.getUserDeployedContracts();
    expect(deployedContracts.length).to.equal(1);
    expect(deployedContracts[0].deployer).to.equal(deployerOwner.address);
  });

  it("Should be able to return all deployed contracts", async function () {
    const { claimFaucetFactory, deployerOwner } = await loadFixture(
      deployClaimFaucetFactoryFixture
    );
    await claimFaucetFactory
      .connect(deployerOwner)
      .deployClaimFaucet("Valora Token", "VLT");
    await claimFaucetFactory
      .connect(deployerOwner)
      .deployClaimFaucet("Jarafi Token", "JFT");

    const allContracts = await claimFaucetFactory.getAllContractDeployed();
    expect(allContracts.length).to.equal(2);
  });

  it("Should be able to retrieve each user deployed contract by index", async function () {
    const { claimFaucetFactory, deployerOwner } = await loadFixture(
      deployClaimFaucetFactoryFixture
    );
    const faucet = await claimFaucetFactory
      .connect(deployerOwner)
      .deployClaimFaucet("Valora Token", "VLT");
    await faucet.wait();

    const deployedContract =
      await claimFaucetFactory.getUserDeployedContractByIndex(0);
    expect(deployedContract.deployer_).to.equal(deployerOwner.address);
  });

  describe("Should Claim faucet from deployed contract and also get user balance", function () {
    it("Should allow a user to claim tokens from the faucet and get their balance", async function () {
      const { claimFaucetFactory, deployerOwner } = await loadFixture(
        deployClaimFaucetFactoryFixture
      );

      const token = await claimFaucetFactory
        .connect(deployerOwner)
        .deployClaimFaucet("Valora Token", "VLT");
      await token.wait();

      const deployedContracts =
        await claimFaucetFactory.getUserDeployedContracts();

      const userBal = await claimFaucetFactory.getBalanceFromDeployedContract(
        deployedContracts[0].deployedContract
      );
      expect(userBal).to.equal(0);

      const claimFaucet = await claimFaucetFactory
        .connect(deployerOwner)
        .claimFaucetFromFactory(deployedContracts[0].deployedContract);
      await claimFaucet.wait();

      const updatedBalance =
        await claimFaucetFactory.getBalanceFromDeployedContract(
          deployedContracts[0].deployedContract
        );
      expect(updatedBalance).to.be.greaterThan(0);
    });
  });

  describe("it Should Get token information from deployed contract", function () {
    it("Should retrieve faucet name and symbol from a deployed contract", async function () {
      const { claimFaucetFactory, deployerOwner } = await loadFixture(
        deployClaimFaucetFactoryFixture
      );

      const faucet = await claimFaucetFactory
        .connect(deployerOwner)
        .deployClaimFaucet("Valora Token", "VLT");
      await faucet.wait();

      const deployedContracts =
        await claimFaucetFactory.getUserDeployedContracts();

      const [faucetName, faucetSymbol] =
        await claimFaucetFactory.getInfoFromContract(
          deployedContracts[0].deployedContract
        );

      expect(faucetName).to.equal("Valora Token");
      expect(faucetSymbol).to.equal("VLT");
    });
  });
});
