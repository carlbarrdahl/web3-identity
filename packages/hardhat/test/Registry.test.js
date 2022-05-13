const { ethers } = require("hardhat");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");

use(solidity);

describe("Registry", function () {
  let registry;

  let owner;
  let user;
  let owners;
  // quick fix to let gas reporter fetch data from gas station & coinmarketcap
  before((done) => {
    setTimeout(done, 2000);
  });

  beforeEach(async () => {
    const Registry = await ethers.getContractFactory("Registry");

    registry = await Registry.deploy();
    [owner, user] = await ethers.getSigners();
    owners = [owner.address, user.address];
  });

  it("should create Identity contracts", async function () {
    await expect(registry.create(owners, [80, 20])).to.emit(
      registry,
      "IdentityCreated"
    );
  });
});
