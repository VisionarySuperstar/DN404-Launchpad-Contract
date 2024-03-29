
// Importing necessary functionalities from the Hardhat package.
import { ethers } from 'hardhat'

async function main() {
    // Retrieve the first signer, typically the default account in Hardhat, to use as the deployer.
    const [deployer] = await ethers.getSigners()

    console.log('Contract is deploying...')
    // Deploying the My404 contract, passing the deployer's address as a constructor argument.
    const myDN404 = await ethers.deployContract('MyDN404')

    // Waiting for the contract deployment to be confirmed on the blockchain.
    await myDN404.waitForDeployment()

    // Logging the address of the deployed My404 contract.
    console.log(`MyDN404 contract is deployed. Token address: ${myDN404.target}`)

    const implementation = myDN404.getAddress() ;
    const launchpadFactory = await ethers.deployContract('LaunchpadFactory', [implementation])
    await launchpadFactory.waitForDeployment() ;
    console.log(`LaunchpadFactory is deployed. ${launchpadFactory.target}`);
}

// This pattern allows the use of async/await throughout and ensures that errors are caught and handled properly.
main().catch(error => {
    console.error(error)
    process.exitCode = 1
})