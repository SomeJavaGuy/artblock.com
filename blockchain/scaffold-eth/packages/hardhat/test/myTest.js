const {ethers} = require("hardhat");
const {use, expect} = require("chai");
const {solidity} = require("ethereum-waffle");

use(solidity);

describe("ArtBlockCollectible Test", function () {
    let theContract;
    let curator;
    let artist;
    let gallery;
    let pledger1;
    let others;

    beforeEach(async function () {
        [curator, artist, gallery, pledger1, ...others] = await ethers.getSigners();

        const ArtBlockCollectible = await ethers.getContractFactory("ArtBlockCollectible");

        theContract = await ArtBlockCollectible.deploy(
            curator.address,
            artist.address,
            gallery.address,
            1616393579,
            1616479979,
            200,
            10,
            "uri1",
            "uri2"
        );
    });

    describe("ArtBlockCollectible Test Suite", function () {
        it("The owner of the contract is correct", async function () {
            expect(await theContract.owner()).to.equal(curator.address);
        });

        it("Should be able make a pledge", async function () {
            let tokenId = await theContract.connect(pledger1).pledge();
            expect(await theContract.balanceOf(pledger1.address)).to.equal(1)
        });
    });
});
