async function main() {
  const MetaTokenSender = await ethers.getContractFactory("MetaTokenSender");
  const metaTokenSender = await MetaTokenSender.deploy();

  console.log("MetaTokenSender deployed to:", metaTokenSender.address);

  const MockToken = await ethers.getContractFactory("MockToken");
  const mockToken = await MockToken.deploy();

  console.log("MockToken deployed to:", mockToken.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
