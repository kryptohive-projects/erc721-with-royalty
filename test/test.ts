import { ethers } from "hardhat";
import { expect } from "chai";
import { ContractFactory, Signer } from "ethers";
import { ERC721WithRoyalty } from "../typechain-types";

describe("ERC721WithRoyalty", function () {
  let ERC721WithRoyaltyFactory: ContractFactory;
  let erc721WithRoyalty: ERC721WithRoyalty;
  let owner: Signer;
  let addr1: Signer;
  let addr2: Signer;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    ERC721WithRoyaltyFactory = await ethers.getContractFactory("ERC721WithRoyalty");
    erc721WithRoyalty = (await ERC721WithRoyaltyFactory.deploy("TestToken", "TTK", 10)) as ERC721WithRoyalty;
    await erc721WithRoyalty.deployed();
  });

  it("Should mint a new token", async function () {
    await erc721WithRoyalty.mint(await addr1.getAddress());
    expect(await erc721WithRoyalty.ownerOf(1)).to.equal(await addr1.getAddress());
    expect(await erc721WithRoyalty.getCreator(1)).to.equal(await owner.getAddress());
  });

  it("Should set royalty percentage correctly", async function () {
    await erc721WithRoyalty.setRoyaltyPercentage(20);
    expect(await erc721WithRoyalty.royaltyPercentage()).to.equal(20);
  });

  it("Should calculate royalty correctly", async function () {
    const salePrice = ethers.utils.parseEther("1");
    expect(await erc721WithRoyalty.calculateRoyalty(salePrice)).to.equal(ethers.utils.parseEther("0.1")); // 10% of 1 ETH
  });

  it("Should transfer token with royalty", async function () {
    await erc721WithRoyalty.mint(await addr1.getAddress());

    const salePrice = ethers.utils.parseEther("1");

    await addr2.sendTransaction({
      to: erc721WithRoyalty.address,
      value: salePrice
    })

    // Check initial balances
    const initialBalanceCreator = await ethers.provider.getBalance(await owner.getAddress());
    const initialBalanceSeller = await ethers.provider.getBalance(await addr1.getAddress());

    // Transfer token with royalty
    await erc721WithRoyalty.connect(addr1).transferWithRoyalty(await addr1.getAddress(), await addr2.getAddress(), 1, salePrice);

    // Check final balances
    const finalBalanceCreator = await ethers.provider.getBalance(await owner.getAddress());
    const finalBalanceSeller = await ethers.provider.getBalance(await addr1.getAddress());

    expect((Number(finalBalanceCreator) / 1e18 - Number(initialBalanceCreator) / 1e18)).to.approximately(0.1, 2); // Creator receives 10%
    expect((Number(finalBalanceSeller) / 1e18 - Number(initialBalanceSeller) / 1e18)).to.approximately(0.9, 2); // Creator receives 10%

    // Check token ownership
    expect(await erc721WithRoyalty.ownerOf(1)).to.equal(await addr2.getAddress());
  });

  it("Should revert if royalty percentage is more than 100", async function () {
    await expect(erc721WithRoyalty.setRoyaltyPercentage(101)).to.be.revertedWith("Royalty percentage cannot be more than 100");
  });
});
