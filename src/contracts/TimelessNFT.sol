// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import "./ERC721.sol";
import "./ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TimelessNFT is ERC721Enumerable, Ownable {
    using Strings for uint256;

    mapping(string => uint8) existingURIs;
    uint256 private maxSupply = 114;
    address public deployer;
    address public artist;
    uint256 public royalityFee;
    uint256 private supply;

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
        string metadataURI;
        uint256 timestamp;
    }

    TransactionStruct[] transactions;
    TransactionStruct[] minted;

    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _royalityFee,
        address _deployer,
        address _artist
    ) ERC721(_name, _symbol) {
        royalityFee = _royalityFee;
        deployer = _deployer;
        artist = _artist;
        supply = totalSupply();
    }

    function isNFTOwned(string memory uri) public view returns (bool) {
        return existingURIs[uri] == 1;
    }

    function payToMint(address to, string memory metadataURI) public payable {
        require(supply <= maxSupply, "Sorry, all NFTs have been minted!");
        require(msg.value > 0 ether, "Ether too low for minting!");
        require(existingURIs[metadataURI] != 1, "This NFT is already minted!");

        if (to != owner()) {
            supply += 1;
            existingURIs[metadataURI] = 1;

            uint256 royality = (msg.value * royalityFee) / 100;

            _payRoyality(artist, royality);
            _payRoyality(deployer, (msg.value - royality));

            minted.push(
                TransactionStruct(
                    supply,
                    owner(),
                    to,
                    msg.value,
                    metadataURI,
                    block.timestamp
                )
            );

            _performSales(
                supply,
                owner(),
                to,
                msg.value,
                metadataURI,
                block.timestamp
            );
        }

        _safeMint(to, supply);
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

        if (msg.value > 0) {
            uint256 royality = (msg.value * royalityFee) / 100;
            _payRoyality(artist, royality);
            _payRoyality(from, (msg.value - royality));

            _performSales(
                tokenId,
                from,
                to,
                msg.value,
                "Transfered ownership",
                block.timestamp
            );
        }

        _transfer(from, to, tokenId);
    }

    function getTransactions()
        public
        view
        returns (TransactionStruct[] memory)
    {
        return transactions;
    }

    function getMintedNFTs() public view returns (TransactionStruct[] memory) {
        return minted;
    }

    function _performSales(
        uint256 id,
        address from,
        address to,
        uint256 cost,
        string memory metadataURI,
        uint256 timestamp
    ) internal {
        transactions.push(
            TransactionStruct(id, from, to, cost, metadataURI, timestamp)
        );

        emit Sale(id, from, to, cost, metadataURI, timestamp);
    }

    function _payRoyality(address stakeholder, uint256 _royalityFee) internal {
        (bool success1, ) = payable(stakeholder).call{value: _royalityFee}("");
        require(success1);
    }

    function count() public view returns (uint256) {
        return supply;
    }
}
