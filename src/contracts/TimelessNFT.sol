// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import "./ERC721.sol";
import "./ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TimelessNFT is ERC721Enumerable, Ownable {
    using Strings for uint256;

    mapping(string => uint8) existingURIs;
    uint256 public maxSupply = 100;
    address public artist;
    uint256 public royalityFee;
    uint256 public supply;
    uint256 public cost = 0.01 ether;

    event Sale(
        uint256 id,
        address indexed from,
        address indexed to,
        uint256 cost,
        string metadataURI,
        uint256 timestamp
    );

    struct TransactionStruct {
        uint256 id;
        address from;
        address to;
        uint256 cost;
        string title;
        string description;
        string metadataURI;
        uint256 timestamp;
    }

    TransactionStruct[] transactions;
    TransactionStruct[] minted;

    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _royalityFee,
        address _artist
    ) ERC721(_name, _symbol) {
        royalityFee = _royalityFee;
        artist = _artist;
        supply = totalSupply();
    }

    function isNFTOwned(string memory uri) public view returns (bool) {
        return existingURIs[uri] == 1;
    }

    function payToMint(
        string memory title,
        string memory description,
        string memory metadataURI
    ) public payable {
        require(supply <= maxSupply, "Sorry, all NFTs have been minted!");
        require(msg.value >= cost, "Ether too low for minting!");
        require(existingURIs[metadataURI] == 0, "This NFT is already minted!");
        require(msg.sender != owner(), "Sales not allowed!");

        supply += 1;
        existingURIs[metadataURI] = 1;

        uint256 royality = (msg.value * royalityFee) / 100;

        payTo(artist, royality);
        payTo(owner(), (msg.value - royality));

        minted.push(
            TransactionStruct(
                supply,
                owner(),
                msg.sender,
                msg.value,
                title,
                description,
                metadataURI,
                block.timestamp
            )
        );

        emit Sale(
            supply,
            owner(),
            msg.sender,
            msg.value,
            metadataURI,
            block.timestamp
        );

        _safeMint(msg.sender, supply);
    }

    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public payable override {
        require(
            _isApprovedOrOwner(_msgSender(), tokenId),
            "ERC721: transfer caller is not owner nor approved"
        );
        // require(msg.value >= cost, "Ether too low for minting!");

        uint256 royality = (msg.value * royalityFee) / 100;
        payTo(artist, royality);
        payTo(from, (msg.value - royality));

        transactions.push(
            TransactionStruct(
                tokenId,
                from,
                to,
                msg.value,
                minted[tokenId].title,
                minted[tokenId].description,
                minted[tokenId].metadataURI,
                block.timestamp
            )
        );

        emit Sale(
            tokenId,
            from,
            to,
            msg.value,
            minted[tokenId].metadataURI,
            block.timestamp
        );

        _transfer(from, to, tokenId);
    }

    function payTo(address to, uint256 amount) internal {
        (bool success1, ) = payable(to).call{value: amount}("");
        require(success1);
    }

    function getAllNFTs() public view returns (TransactionStruct[] memory) {
        return minted;
    }

    function getAllTransactions() public view returns (TransactionStruct[] memory) {
        return transactions;
    }
}
