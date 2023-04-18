const { expect } = require("chai");
const { arrayify, parseEther } = require("ethers/lib/utils");
const { ethers } = require("hardhat");

it("Should let user send tokens through a relayer", async function () {
  // Deploy the contracts
  const TokenFactory = await ethers.getContractFactory("MockToken");
  const tokenContract = await TokenFactory.deploy();
  await tokenContract.deployed();

  const TokenSenderFactory = await ethers.getContractFactory("MetaTokenSender");
  const tokenSenderContract = await TokenSenderFactory.deploy();
  await tokenSenderContract.deployed();

  // Get three addresses, treat one as the user address
  // one as the relayer address, and one as a recipient address
  const [_, userAddress, relayerAddress, recipientAddress] =
    await ethers.getSigners();

  // Mint 10,000 tokens to user address (for testing)
  await tokenContract.connect(userAddress).mint(parseEther("10000"));

  // Have user infinite approve the token sender contract for transferring 'Token'
  await tokenContract
    .connect(userAddress)
    .approve(tokenSenderContract.address, ethers.constants.MaxUint256);

  const transferAmountOfTokens = parseEther("10");
  const nonce = 1;
  const messageHash = await tokenSenderContract.getMessageHash(
    userAddress.address,
    transferAmountOfTokens,
    recipientAddress.address,
    tokenContract.address,
    nonce
  );
  const signature = await userAddress.signMessage(arrayify(messageHash));

  // Have the relayer execute the transaction on behalf of the user
  const relayerSenderContractInstance =
    tokenSenderContract.connect(relayerAddress);
  const metaTxn = await relayerSenderContractInstance.transferWithNonce(
    userAddress.address,
    transferAmountOfTokens,
    recipientAddress.address,
    tokenContract.address,
    nonce,
    signature
  );
  await metaTxn.wait();

  // Check the user's balance decreased, and recipient got 10 tokens
  let userBalance = await tokenContract.balanceOf(userAddress.address);
  let recipientBalance = await tokenContract.balanceOf(
    recipientAddress.address
  );

  expect(userBalance.eq(parseEther("9990"))).to.be.true;
  expect(recipientBalance.eq(parseEther("10"))).to.be.true;
});
