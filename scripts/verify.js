const { ethers } = require("hardhat");
const hre = require("hardhat");
const fs = require('fs');
async function main() {
    // We get contract addresses from address.json
    let address = JSON.parse(fs.readFileSync(__dirname + '/address.json'));
    console.log('Verifying addresses...', address)

    // token
    await hre.run("verify:verify", {
        address: address.token.hash,
    })

    // masterchef
    await hre.run("verify:verify", {
        address: address.masterChef.hash,
        constructorArguments: [
            address.token.hash,
            8251590, // timeblock
        ],
    })

    // referral (tochange)
    await hre.run("verify:verify", {
        address: address.referral.hash,
        contract: "contracts/LynxReferral.sol:LynxReferral"
    })

    // timeLock
    await hre.run("verify:verify", {
        address: address.timeLock.hash,
        constructorArguments: [
            address.dev,
            86400, // delay in seconds
        ],
    })
    console.log('All contracts verified.')
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
