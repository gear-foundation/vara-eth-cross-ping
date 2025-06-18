const { ethers } = require("hardhat");

async function main() {
  const PingReceiver = await ethers.getContractFactory("PingReceiver");
  const pingReceiver = await PingReceiver.deploy();
  await pingReceiver.waitForDeployment();
  const address = await pingReceiver.getAddress();
  console.log(`✅ PingReceiver deployed to: ${address}`);
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exitCode = 1;
}); 