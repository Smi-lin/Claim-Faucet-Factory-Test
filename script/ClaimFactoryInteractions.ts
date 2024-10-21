import hre from "hardhat";

async function main() {
  const DEPLOYED_FACTORY_CONTRACT =
    "0xA6bF95929E0caCc9bAA443b489AFc6B62257bB83";

  const myAccount = "0xac9535B43e7f652344A158FaB8e44472A1070299";

  const signer = await hre.ethers.getSigner(myAccount);

  const factoryContractInstance = await hre.ethers.getContractAt(
    "ClaimFaucetFactory",
    DEPLOYED_FACTORY_CONTRACT
  );

  // Starting scripting

  console.log(
    "############################ Deploying claim factory ####################"
  );

  const deployClaimFaucetTx1 = await factoryContractInstance
    .connect(signer)
    .deployClaimFaucet("Lisk Token", "LSK");

  deployClaimFaucetTx1.wait();

  console.log({
    "Claim Faucet 1 deployed successfully to": deployClaimFaucetTx1,
  });

  const deployClaimFaucetTx2 = await factoryContractInstance
    .connect(signer)
    .deployClaimFaucet("Smilda Token", "SLT");

  deployClaimFaucetTx2.wait();

  console.log({
    "Claim Faucet 2 deployed successfully to": deployClaimFaucetTx2,
  });

  console.log(
    "############################ Getting the length & data of deployed claim faucet ####################"
  );

  const getLengthOfDeployedContract =
    await factoryContractInstance.getLengthDeployedContract();

  console.log(
    "Length of Claim Faucets",
    getLengthOfDeployedContract.toString()
  );

  const getUserContracts = await factoryContractInstance
    .connect(signer)
    .getUserDeployedContracts();

  console.table(getUserContracts);

  console.log(
    "############################ Getting User Deployed Claim Faucet by Index ####################"
  );

  const { deployer_: deployerA, deployedContract_: deployedContractA } =
    await factoryContractInstance
      .connect(signer)
      .getUserDeployedContractByIndex(0);

  const { deployer_: deployerB, deployedContract_: deployedContractB } =
    await factoryContractInstance
      .connect(signer)
      .getUserDeployedContractByIndex(1);

  console.log([
    { Deployer: deployerA, "Deployed Contract Address": deployedContractA },
    { Deployer: deployerB, "Deployed Contract Address": deployedContractB },
  ]);

  console.log(
    "############################ Getting  Deployed Contract Info ####################"
  );

  const contractInfo = await factoryContractInstance.getInfoFromContract(
    deployedContractA
  );

  console.table(contractInfo);

  const contractInfo2 = await factoryContractInstance.getInfoFromContract(
    deployedContractB
  );

  console.table(contractInfo2);

  console.log(
    "############################ Claiming token and Getting User Balance of the token ####################"
  );

  const claimToenFaucetTx1 = await factoryContractInstance
    .connect(signer)
    .claimFaucetFromFactory(deployedContractA);

  claimToenFaucetTx1.wait();

  const claimToenFaucetTx2 = await factoryContractInstance
    .connect(signer)
    .claimFaucetFromFactory(deployedContractB);

  claimToenFaucetTx2.wait();

  const checkUserBalForToken1 = await factoryContractInstance
    .connect(signer)
    .getBalanceFromDeployedContract(deployedContractA);

  const checkUserBalForToken2 = await factoryContractInstance
    .connect(signer)
    .getBalanceFromDeployedContract(deployedContractB);

  console.log({
    "Faucet 1 Balance ": hre.ethers.formatUnits(checkUserBalForToken1, 18),
    "Faucet 2 Balance ": hre.ethers.formatUnits(checkUserBalForToken2, 18),
  });
}

main().catch((error) => {
  console.error();
  process.exitCode = 1;
});
