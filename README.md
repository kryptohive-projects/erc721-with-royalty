# ERC721WithRoyalty

## Overview

`ERC721WithRoyalty` is an Ethereum smart contract that extends the ERC721 standard to include royalty functionality. This contract allows the owner to mint NFTs, set royalty percentages, and transfer tokens while handling royalties for creators.

## Features

- **Minting Tokens**: Only the contract owner can mint new tokens.
- **Royalty Handling**: Allows setting a royalty percentage and calculates royalties on sales.
- **Token Transfer with Royalty**: Transfers tokens and pays royalties to the creators.
- **Receive Ether**: The contract can receive Ether via a fallback function.

## Contract Functions

### `constructor(string memory name, string memory symbol, uint256 _royaltyPercentage)`

- **Parameters**:
  - `name`: The name of the NFT collection.
  - `symbol`: The symbol of the NFT collection.
  - `_royaltyPercentage`: Initial royalty percentage (0-100%).

### `function mint(address recipient) public onlyOwner returns (uint256)`

- **Parameters**:
  - `recipient`: Address to receive the newly minted token.
- **Returns**: `uint256` - The ID of the newly minted token.

### `function setRoyaltyPercentage(uint256 _royaltyPercentage) public onlyOwner`

- **Parameters**:
  - `_royaltyPercentage`: New royalty percentage (0-100%).

### `function getCreator(uint256 tokenId) public view returns (address)`

- **Parameters**:
  - `tokenId`: ID of the token.
- **Returns**: `address` - The creator address of the token.

### `function calculateRoyalty(uint256 salePrice) public view returns (uint256)`

- **Parameters**:
  - `salePrice`: Sale price of the token.
- **Returns**: `uint256` - Calculated royalty amount based on the royalty percentage.

### `function transferWithRoyalty(address from, address to, uint256 tokenId, uint256 salePrice) public`

- **Parameters**:
  - `from`: Address of the seller.
  - `to`: Address of the buyer.
  - `tokenId`: ID of the token being transferred.
  - `salePrice`: Sale price of the token.
- **Functionality**: Transfers the token to the buyer, pays the royalty to the creator, and the remaining amount to the seller.

### `receive() external payable`

- **Functionality**: Fallback function to receive Ether. Allows the contract to accept Ether transfers.

## Usage

1. **Deploy the Contract**: Deploy the `ERC721WithRoyalty` contract with the desired name, symbol, and initial royalty percentage.
   
2. **Mint Tokens**: Use the `mint` function to create new tokens and assign them to recipients.

3. **Set Royalty Percentage**: Change the royalty percentage using the `setRoyaltyPercentage` function.

4. **Transfer Tokens with Royalty**: Use the `transferWithRoyalty` function to transfer tokens while handling royalties.

5. **Receive Ether**: The contract can receive Ether via the fallback function, which can be useful for receiving payments or donations.

## Example

```javascript
// Example in JavaScript using ethers.js

const { ethers } = require("ethers");
const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545");
const signer = provider.getSigner();

const ERC721WithRoyalty = await ethers.getContractFactory("ERC721WithRoyalty");
const contract = await ERC721WithRoyalty.deploy("MyNFT", "MNFT", 5);
await contract.deployed();

// Mint a new token
const tx = await contract.mint(signer.address);
const receipt = await tx.wait();
const tokenId = receipt.events[0].args[2];

// Set new royalty percentage
await contract.setRoyaltyPercentage(10);

// Transfer token with royalty
await contract.transferWithRoyalty(signer.address, "0xAddressToTransferTo", tokenId, ethers.utils.parseEther("1"));
