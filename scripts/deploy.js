const { ethers } = require("hardhat");
const hre = require("hardhat");
const fs = require('fs');
// tochange
async function main() {
  // We get the contract to deploy
  const deployer = await ethers.getSigner();
  console.log(`Deploying contracts with the account: ${deployer.address}`)

  const balance = await deployer.getBalance();
  console.log(`Account balance: ${balance.toString()}`)

  //Token
  const Token = await ethers.getContractFactory('LynxToken');
  let token = await Token.deploy();
  console.log(`Token address: ${token.address}`)

  //MasterChef
  const MasterChef = await ethers.getContractFactory('MasterChef');
  let masterChef = await MasterChef.deploy(token.address,8251590);
  console.log(`MasterChef address: ${masterChef.address}`)

  //Referrals
  const Referral = await ethers.getContractFactory('LynxReferral');
  let referral = await Referral.deploy();
  console.log(`lynxReferral address: ${referral.address}`)
  
  //TimeLock
  const TimeLock = await ethers.getContractFactory('Timelock');
  let timeLock = await TimeLock.deploy(deployer.address,86400);
  console.log(`TimeLock address: ${timeLock.address}`)
  
  //Mint
  await token["mint(address,uint256)"](token.operator(), ethers.utils.parseEther("500"));
  console.log('Minted 500 tokens to dev address')
  await token["transferOwnership(address)"](masterChef.address);
  console.log('Ownership transferred to MasterChef')
  await masterChef["setLynxReferral(address)"](referral.address);
  console.log('Set Referral contract in MasterChef')

  //write
  let addresses = { 
    dev: deployer.address,
    token: {
      hash: token.address,
      bscscan: `https://bscscan.com/address/${token.address}#code`
    }, 
    masterChef: {
      hash: masterChef.address,
      bscscan: `https://bscscan.com/address/${masterChef.address}#code`
    }, 
    referral: {
      hash: referral.address,
      bscscan: `https://bscscan.com/address/${referral.address}#code`
    }, 
    timeLock: {
      hash: timeLock.address,
      bscscan: `https://bscscan.com/address/${timeLock.address}#code`
    }
  };
  let writedata = JSON.stringify(addresses);
  fs.writeFileSync(__dirname + '/address.json', writedata);
  console.log('Addresses recorded. Please wait awhile for blocks to be mined before verifying.')
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
