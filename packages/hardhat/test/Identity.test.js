const { ethers } = require("hardhat");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");

use(solidity);

describe("Identity", function () {
  let identity;
  let tokenA;
  let tokenB;
  let nft;

  let owner;
  let user;
  let nonowner;
  let owners;
  const NFT_TOKEN_ID = 0;
  // quick fix to let gas reporter fetch data from gas station & coinmarketcap
  before((done) => {
    setTimeout(done, 2000);
  });

  beforeEach(async () => {
    const Identity = await ethers.getContractFactory("Identity");
    [owner, user, nonowner] = await ethers.getSigners();
    owners = [owner.address, user.address];

    identity = await Identity.deploy();

    const Token = await ethers.getContractFactory("ERC20Token");
    tokenA = await Token.deploy("Token");
    await tokenA.mint(owners[0], 10);
    tokenB = await Token.deploy("Token");
    await tokenB.mint(owners[1], 4);

    const NFT = await ethers.getContractFactory("ERC721Token");
    nft = await NFT.deploy("NFT");

    await nft.approve(identity.address, NFT_TOKEN_ID);
  });

  describe("Initialize", function () {
    it("should initialize only once", async function () {
      await identity.initialize(owners, [80, 20]);

      await expect(identity.initialize(owners, [80, 20])).to.be.revertedWith(
        "Initializable: contract is already initialized"
      );
    });
    it("should have equal owners and equities", async function () {
      await expect(identity.initialize(owners, [80])).to.be.revertedWith(
        "OwnerEquitiesIncorrect()"
      );
    });
    it("should have sum equities to exactly 100", async function () {
      await expect(
        identity.initialize(owners, [80, 20, 100])
      ).to.be.revertedWith("OwnerEquitiesIncorrect()");
    });
    it("should set owners and equities", async function () {
      await identity.initialize(owners, [80, 20]);

      expect(await identity.owners()).to.have.members(owners);
      expect(
        (await identity.equities()).map((x) => +x.toString())
      ).to.have.members([80, 20]);
    });
  });
  describe("Accepted Tokens", () => {
    it("should add acceptedERC20s", async () => {
      expect(await identity.acceptedERC20s()).to.have.members([]);
      await identity.acceptERC20(tokenA.address);
      await identity.acceptERC20(tokenB.address);

      expect(await identity.acceptedERC20s()).to.have.members([
        tokenA.address,
        tokenB.address,
      ]);
    });
    it("should only add token once", async () => {
      await identity.acceptERC20(tokenA.address);
      await expect(identity.acceptERC20(tokenA.address)).to.revertedWith(
        "ERC20AlreadyAdded()"
      );
      expect(await identity.acceptedERC20s()).to.have.members([tokenA.address]);
    });
  });
  describe("Transfer NFT", () => {
    beforeEach(async () => {
      await identity.initialize(owners, [80, 20]);
    });
    it("should receive an NFT and emit event", async () => {
      expect(await identity.transferNFT(nft.address, NFT_TOKEN_ID))
        .to.emit(identity, "NFTTransfered")
        .withArgs(nft.address, NFT_TOKEN_ID, owners[0]);
    });

    it("should only be called by owners", async () => {
      await expect(
        identity.connect(nonowner).transferNFT(nft.address, NFT_TOKEN_ID)
      ).to.be.revertedWith("MustBeOwner()");
    });
  });
  describe("Has NFT", () => {
    it("should check if contract has an NFT", async () => {
      await identity.initialize(owners, [80, 20]);
      await identity.transferNFT(nft.address, NFT_TOKEN_ID);

      const [tokenId, since] = await identity.hasNFT(nft.address);
      expect(tokenId.toNumber()).to.equal(NFT_TOKEN_ID);
      expect(since.toString().slice(0, 4)).to.equal("1652");
    });
  });
  describe("Withdraw", async () => {
    beforeEach(async () => {
      await identity.initialize(owners, [80, 20]);
      await identity.acceptERC20(tokenA.address);
      await identity.acceptERC20(tokenB.address);
    });

    it("should withdraw all ERC20 tokens", async () => {
      // Transfer tokens
      await tokenA.transfer(identity.address, ethers.utils.parseEther("1"));
      await tokenB
        .connect(user)
        .transfer(identity.address, ethers.utils.parseEther("0.1"));

      expect(await identity.withdraw()).to.emit(identity, "WithdrawERC20");

      // 80% of tokenA should be sent to owner 1
      expect((await tokenA.balanceOf(owners[0])).toString()).to.equal(
        ethers.utils.parseEther("9.8")
      );
      // 20% of tokenA should be sent to owner B
      expect((await tokenA.balanceOf(owners[1])).toString()).to.equal(
        ethers.utils.parseEther("0.2")
      );

      // Verify tokenB is also distributed
      expect((await tokenB.balanceOf(owners[0])).toString()).to.equal(
        ethers.utils.parseEther("0.08")
      );
      expect((await tokenB.balanceOf(owners[1])).toString()).to.equal(
        ethers.utils.parseEther("3.92")
      );
    });
    it("should withdraw all ETH", async () => {
      const amount = "100.0";

      await owner.sendTransaction({
        to: identity.address,
        value: ethers.utils.parseEther(amount),
      });

      expect(
        ethers.utils.formatEther(
          await ethers.provider.getBalance(identity.address)
        )
      ).to.equal(amount);

      expect(await identity.withdraw()).to.emit(identity, "WithdrawETH");

      expect(
        ethers.utils.formatEther(
          await ethers.provider.getBalance(identity.address)
        )
      ).to.equal("0.0");
    });
    it("should split between owners according to equity", async () => {
      // Deposit 100 and 50 eth
      const values = [
        [owner, "1000"],
        [user, "1000"],
      ];

      await Promise.all(
        values.map(([account, val]) =>
          account.sendTransaction({
            to: identity.address,
            value: ethers.utils.parseEther(val),
          })
        )
      );

      await identity.withdraw();

      // TODO: improve these tests
      const balancesAfter = (
        await Promise.all(
          owners.map((address) => ethers.provider.getBalance(address))
        )
      ).map((balance) => ethers.utils.formatEther(balance).split(".")[0]);

      expect(balancesAfter[0]).to.equal("10579");
      expect(balancesAfter[1]).to.equal("9419");
    });
    it("should only be called by owners", async () => {
      await expect(identity.connect(nonowner).withdraw()).to.be.revertedWith(
        "MustBeOwner()"
      );
    });
  });
  describe("Disintegrate", () => {
    beforeEach(async () => {
      await identity.initialize(owners, [80, 20]);
    });
    it("should return all NFTs to their original holders", async () => {
      await identity.transferNFT(nft.address, NFT_TOKEN_ID);

      await expect(await identity.disintegrate()).to.emit(
        identity,
        "Disintegrate"
      );
      expect(await nft.balanceOf(owner.address)).to.equal(1);
      expect((await identity.nfts()).length).to.equal(0);
    });

    it("should only be called by owners", async () => {
      await expect(
        identity.connect(nonowner).disintegrate()
      ).to.be.revertedWith("MustBeOwner()");
    });
  });
});
