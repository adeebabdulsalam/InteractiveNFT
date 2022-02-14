// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Interactive is ERC721{
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    mapping(uint256=>string) tokenurl;

    constructor() ERC721("Skulls", "SKUL"){}

    function mint(string memory metadataURI) public payable{
        _tokenIds.increment();

        uint256 id = _tokenIds.current();
        _safeMint(msg.sender, id);
        tokenurl[id] = metadataURI;
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");

        return tokenurl[tokenId];
    }

}