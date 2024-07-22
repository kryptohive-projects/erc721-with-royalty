// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ERC721WithRoyalty is ERC721, Ownable {
    uint256 private _tokenIdCounter;
    uint256 public royaltyPercentage;

    // Mapping from token ID to creator address
    mapping(uint256 => address) private _creators;

    constructor(string memory name, string memory symbol, uint256 _royaltyPercentage) ERC721(name, symbol) Ownable() {
        require(_royaltyPercentage <= 100, "Royalty percentage cannot be more than 100");
        royaltyPercentage = _royaltyPercentage;
        _tokenIdCounter = 0; // Initialize the counter
    }

    function mint(address recipient) public onlyOwner returns (uint256) {
        _tokenIdCounter++;
        uint256 newItemId = _tokenIdCounter;
        _mint(recipient, newItemId);
        _creators[newItemId] = msg.sender;
        return newItemId;
    }

    function setRoyaltyPercentage(uint256 _royaltyPercentage) public onlyOwner {
        require(_royaltyPercentage <= 100, "Royalty percentage cannot be more than 100");
        royaltyPercentage = _royaltyPercentage;
    }

    function getCreator(uint256 tokenId) public view returns (address) {
        return _creators[tokenId];
    }

    function calculateRoyalty(uint256 salePrice) public view returns (uint256) {
        return (salePrice * royaltyPercentage) / 100;
    }

    function transferWithRoyalty(address from, address to, uint256 tokenId, uint256 salePrice) public {
        
        uint256 royaltyAmount = calculateRoyalty(salePrice);
        address creator = getCreator(tokenId);

        // Transfer royalty to creator
        payable(creator).transfer(royaltyAmount);

        // Transfer remaining amount to seller
        payable(from).transfer(salePrice - royaltyAmount);

        // Transfer token to buyer
        _transfer(from, to, tokenId);
    }

    // Fallback function to receive Ether
    receive() external payable {}
}
