const hre = require("hardhat");

async function main() {
  console.log("Deploying BlockVote contract...");

  const Voting = await hre.ethers.getContractFactory("BlockVote");
  const voting = await Voting.deploy();

  await voting.waitForDeployment();

  const address = await voting.getAddress();
  console.log(`BlockVote successfully deployed to: ${address}`);
  
  console.log("\nNext Steps:");
  console.log(`1. Copy the address above.`);
  console.log(`2. Paste it as CONTRACT_ADDRESS in frontend/src/pages/Vote.jsx`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
