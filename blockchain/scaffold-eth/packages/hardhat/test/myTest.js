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
    let pledger2;
    let pledger3;
    let pledger4;
    let pledger5;
    let others;

    before(async function () {
        console.log('executing this');

        [curator, artist, gallery, pledger1, pledger2, pledger3, pledger4, pledger5,...others] = await ethers.getSigners();

        const ArtBlockCollectible = await ethers.getContractFactory("ArtBlockCollectible");

        theContract = await ArtBlockCollectible.deploy(
            curator.address,
            artist.address,
            gallery.address,
            1616393579,
            1616479979,
            ethers.utils.parseEther("20.01"),
            ethers.utils.parseEther("4.00"),
            4,
            "uri1",
            "uri2"
        );
    });

    describe("ArtBlockCollectible Test Suite", function () {
        it("The owner of the contract is correct", async function () {
            expect(await theContract.owner()).to.equal(curator.address);
        });

        it("Pledger 1 should be able make a pledge", async function () {
            let tokenId = await theContract.connect(pledger1).pledge({value: ethers.utils.parseEther("5.2")});
            expect(await theContract.balanceOf(pledger1.address)).to.equal(1);
            expect(await theContract.pledgeState()).to.equal(0, "The expected state is pledging");
        });

        it("Pledger 2 should be able make a pledge", async function () {
            let tokenId = await theContract.connect(pledger2).pledge({value: ethers.utils.parseEther("6.3")});
            expect(await theContract.balanceOf(pledger2.address)).to.equal(1);
            expect(await theContract.pledgeState()).to.equal(0, "The expected state is pledging");
        });

        it("Pledger 3 should NOT be able make a pledge", async function () {
            expect(await theContract.connect(pledger3).pledge({value: ethers.utils.parseEther("1")})).to.be.rejected
        });

        it("Pledger 4 should be able make a pledge", async function () {
            let tokenId = await theContract.connect(pledger4).pledge({value: ethers.utils.parseEther("10.5")});
            expect(await theContract.balanceOf(pledger4.address)).to.equal(1);
            expect(await theContract.pledgeState()).to.equal(0, "The expected state is pledging");
        });

        it("The state should be baking now", async function () {
            await theContract.refreshState();
            expect(await theContract.pledgeState()).to.equal(1, "The expected state is baking");
        });
    });
});
