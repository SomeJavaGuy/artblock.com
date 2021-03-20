const { ethers } = require("hardhat");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");

use(solidity);

describe("Art Block Dapp", function () {
  let myContract;

  describe("ArtBlockCollectible Test Suite", function () {
    it("Should deploy ArtBlockCollectible", async function () {
      const YourContract = await ethers.getContractFactory("ArtBlockCollectible");

      myContract = await YourContract.deploy();
    });

    // describe("setPurpose()", function () {
    //   it("Should be able to set a new purpose", async function () {
    //     const newPurpose = "Test Purpose";
    //
    //     await myContract.setPurpose(newPurpose);
    //     expect(await myContract.purpose()).to.equal(newPurpose);
    //   });
    // });
  });
});
