// We require the Hardhat Runtime Environment explicitly here. This is optional 
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const { ethers } = require("hardhat");
const hre = require("hardhat");
const fs = require('fs');
async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile 
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const deployer = await ethers.getSigner();
  console.log(`Deploying contracts with the account: ${deployer.address}`)

  const balance = await deployer.getBalance();
  console.log(`Account balance: ${balance.toString()}`)

  //Token
  const Token = await ethers.getContractFactory('NeuToken');
  token = await Token.deploy();
  console.log(`Token address: ${token.address}`)
  //MasterChef
  const MasterChef = await ethers.getContractFactory('MasterChef');
  masterChef = await MasterChef.deploy(token.address,8050564);
  console.log(`MasterChef address: ${masterChef.address}`)
  //Referrals
  const NeuReferral = await ethers.getContractFactory('NeuReferral');
  neuReferral = await NeuReferral.deploy();
  console.log(`neuReferral address: ${neuReferral.address}`)
  //TimeLock
  const TimeLock = await ethers.getContractFactory('Timelock');
  timeLock = await TimeLock.deploy(deployer.address,86400);
  console.log(`TimeLock address: ${timeLock.address}`)
  
  //Mint
  await token["mint(address,uint256)"](token.operator(), ethers.utils.parseEther("500"));
  console.log('Minted 500 tokens to dev address')
  await token["transferOwnership(address)"](masterChef.address);
  console.log('Ownership transferred to MasterChef')
  await masterChef["setNeuReferral(address)"](neuReferral.address);
  console.log('Set Referral contract in MasterChef')
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
