pragma solidity 0.6.7;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

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

contract ArtBlockCollectible is ERC721, Ownable, ReentrancyGuard {  // the curator owns the contract

    // The contract can be in any of these states
    // Each state can be an end state
    // The transition can only happen this way: Pledging -> Baking -> Collecting
    enum PledgeState { Pledging, Baking, Collecting }
    PledgeState public pledgeState;
    // TODO: Sandu to define the refunding state (what happens if the goal is not reached or the work is not delivered)

    // The artist can modify the URIs of all the minted tokens only after the pledge enters the Baking state
    // AP1 token belongs to the Artist
    address payable public artistAddress;

    // AP2 token belongs to the Gallery
    address public galleryAddress;

    uint256 public startTime;
    uint256 public endTime;

    uint256 public minGoal;      // all amounts are in WEI
    uint256 public minPledge;      // all amounts are in WEI
    uint256 public maxEditions;  // TODO: maybe use uint32, dunno

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    string public pledgeBaseUri;
    string public bakeBaseUri;

    mapping(address => uint256) private _pledgedBalance;

    constructor(
        address curatorAddress_,
        address payable artistAddress_,
        address galleryAddress_,
        uint256 startTime_,
        uint256 endTime_,
        uint256 minGoal_,
        uint256 minPledge_,
        uint256 maxEditions_,
        string memory pledgeBaseUri_,
        string memory bakeBaseUri_
    )
    public
    ERC721("ArtBlockCampaign", "ABLK") {

        // transfer the ownership to the curator right away
        transferOwnership(curatorAddress_);

        require(artistAddress_ != address(0), "ArtBlockCollectible: invalid artist address");
        artistAddress = artistAddress_;

        require(galleryAddress_ != address(0), "ArtBlockCollectible: invalid gallery address");
        galleryAddress = galleryAddress_;

        require(now < startTime_, "ArtBlockCollectible: start time cannot occur in the past");
        require(startTime_ < endTime_, "ArtBlockCollectible: start time needs to occur before the end time");
        startTime = startTime_;
        endTime = endTime_;

        require(minGoal_ > 0, "ArtBlockCollectible: min goal should be greater than 0");
        minGoal = minGoal_;

        require(minGoal_ > 0, "ArtBlockCollectible: min pledge should be greater than 0");
        minPledge = minPledge_;

        require(maxEditions_ > 0, "ArtBlockCollectible: max editions should be greater than 0");
        maxEditions = maxEditions_;

        pledgeBaseUri = pledgeBaseUri_;
        bakeBaseUri = bakeBaseUri_;
        _setBaseURI(pledgeBaseUri);
        // TODO: make sure the strings are not empty and they are valid URLs

        pledgeState = PledgeState.Pledging;
        LogStateChanged(pledgeState);

        // mint edition 0 to artist
        _mint(artistAddress, _tokenIdCounter.current());
        _setTokenURI(_tokenIdCounter.current(), pledgeBaseUri);
    }

    // EVENTS
    event LogCollectorPledged(address pledger, uint256 amount);
    event LogTokenBaseUriUpdated(string newUri);
    event LogStateChanged(PledgeState newPledgeState);

    // MODIFIERS
    modifier whilePledging() {
        require(pledgeState == PledgeState.Pledging, "Contract does not accept pledges");
        require(startTime >= now, "Wait until the start date");
        require(now <= endTime, "The pledge window is over");
        _;
    }

    modifier whileBaking() {
        require(pledgeState == PledgeState.Baking, "Contract does not accept pledges");
        require(now > endTime, "The pledge window is open");
        _;
    }

    modifier onlyArtist() {
        require(msg.sender == artistAddress, "Only the artist can do this");
        _;
    }

    modifier onlyCurator() {
        require(msg.sender == owner(), "Only the curator can do this");
        _;
    }

    // anyone can call this
    function refreshState() public {
        if (pledgeState == PledgeState.Pledging) {
            if ( address(this).balance >= minGoal && now > endTime) {
                pledgeState = PledgeState.Baking;  // transition to baking
                LogStateChanged(pledgeState);
            }
        }
    }

    // the collector
    function pledge() whilePledging payable public returns (uint256) {

        require(msg.value >= minPledge, "The pledge needs to be greater or equal to the min pledge");

        _tokenIdCounter.increment();
        require(_tokenIdCounter.current() <= maxEditions, "Number of NFTs exceeded the max number of editions");

        _mint(msg.sender, _tokenIdCounter.current());
        _setTokenURI(_tokenIdCounter.current(), pledgeBaseUri);

        // record who pledged and how much (accumulate if the same user pledged again)
        _pledgedBalance[msg.sender] = _pledgedBalance[msg.sender] + msg.value;
        LogCollectorPledged(msg.sender, msg.value);

        // return the token id so the backend can use it
        return _tokenIdCounter.current();
    }

    // the artist - only during the baking state
    function updateTokenUri() onlyArtist whileBaking public {
        _setBaseURI(bakeBaseUri);
        LogTokenBaseUriUpdated(bakeBaseUri);
    }

    // the curator - this is the final state
    function markAsCollecting(string memory ap1Uri, string memory ap2Uri) onlyCurator whileBaking nonReentrant public {
        // mint ap1
        _tokenIdCounter.increment();
        _mint(artistAddress, _tokenIdCounter.current());
        _setTokenURI(_tokenIdCounter.current(), ap1Uri);

        // mint ap2
        _tokenIdCounter.increment();
        _mint(galleryAddress, _tokenIdCounter.current());
        _setTokenURI(_tokenIdCounter.current(), ap2Uri);

        // transfer the pledged amount to the artist
        artistAddress.transfer(address(this).balance);

        pledgeState = PledgeState.Collecting;
        LogStateChanged(pledgeState);
    }
}
