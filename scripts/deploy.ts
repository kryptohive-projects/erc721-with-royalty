import { ethers } from "hardhat";

async function main() {
    const name = "name";
    const symbol = "symbol";
    const royaltyPercentage = 2;

    const contract = await ethers.deployContract("ERC721WithRoyalty", [name, symbol, royaltyPercentage]);

    await contract.waitForDeployment();

    console.log(
        `Contract deployed to ${contract.target}`
    );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
