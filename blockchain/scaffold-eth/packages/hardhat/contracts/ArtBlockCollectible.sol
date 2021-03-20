pragma solidity >=0.6.0 <0.7.0;
//SPDX-License-Identifier: MIT

//import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
//learn more: https://docs.openzeppelin.com/contracts/3.x/erc721

// GET LISTED ON OPENSEA: https://testnets.opensea.io/get-listed/step-two


// The Curator owns the contract
// The Artist can modify the uri, only after the funding goal is reached
// curator set as owner
// artist
// gallery
// pledge state
    // pledging: mint edition 0 to artist
    // baking: mint 1, 2, 3, etc -> collectors
    // collecting:  mint (AP1 -> artist, AP2 -> Gallery)
// limits: start time, end time, min goal, (optional) max goal, max edition = 1..100
// ipfs uri for pledge
// ipfs uri for baked stage

contract ArtBlockCollectible is ERC721, Ownable {  // the curator owns the contract

    // The contract can be in any of these states
    // Each state can be an end state
    // The transition can only happen this way: Pledging -> Baking -> Collecting
    enum PledgeState { Pledging, Baking, Collecting }
    PledgeState private _pledgeState;

    // The artist can modify the URIs of all the minted tokens only after the pledge enters the Baking state
    // AP1 token belongs to the Artist
    address public artistAddress;

    // AP2 token belongs to the Gallery
    address public galleryAddress;

    uint256 public startTime;
    uint256 public endTime;

    uint256 public minGoal;      // TODO: maybe use uint32, dunno
    uint256 public maxEditions;  // TODO: maybe use uint32, dunno

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    string public pledgeBaseUri;
    string public bakeBaseUri;

    constructor(
        address curatorAddress_,
        address artistAddress_,
        address galleryAddress_,
        uint256 startTime_,
        uint256 endTime_,
        uint256 minGoal_,
        uint256 maxEditions_,
        string  pledgeBaseUri_,
        string  bakeBaseUri_
    )
    public
    ERC721("ArtBlockCampaign", "ABLK") {
        artistAddress = artistAddress_;
        galleryAddress = galleryAddress_;

        require(now < startTime_, "ArtBlockCollectible: start time cannot occur in the past");
        require(startTime_ < endTime_, "ArtBlockCollectible: start time needs to occur before the end time");
        startTime = startTime_;
        endTime = endTime_;

        require(minGoal_ > 0, "ArtBlockCollectible: min goal should be greater than 0");
        minGoal = minGoal_;

        require(maxEditions > 0, "ArtBlockCollectible: max editions should be greater than 0");
        maxEditions = maxEditions_;

        pledgeBaseUri = pledgeBaseUri_;
        bakeBaseUri = bakeBaseUri_;
        // TODO: make sure the strings are not empty and they are valid URLs

        _pledgeState = PledgeState.Pledging;
        _setBaseURI(pledgeBaseUri);

        // transfer the ownership to the curator right away
        transferOwnership(curatorAddress_);
    }

    function mintItem(address to, string memory tokenURI)
    public
    onlyOwner
    returns (uint256)
    {
        _tokenIds.increment();

        uint256 id = _tokenIds.current();
        _mint(to, id);
        _setTokenURI(id, tokenURI);

        return id;
    }
}
