async function main() {
  const [deployer, feeAccount] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Assigning Fee Account with:", feeAccount.address);
  console.log("Deployer balance:", (await deployer.getBalance()).toString());
  console.log("FeeAccount balance:", (await feeAccount.getBalance()).toString());

  // Get the ContractFactories and Signers here.
  const Store = await ethers.getContractFactory("Store");

  // deploy contracts
  const store = await Store.deploy('Freshers', feeAccount, 10);

  // Save copies of each contracts abi and address to the frontend.
  saveFrontendUtils(store , "Store");
}

function saveFrontendUtils(contract, name) {
  const fs = require("fs");
  const utilsDir = __dirname + "./src/utils";

  if (!fs.existsSync(utilsDir)) {
    fs.mkdirSync(utilsDir);
  }

  fs.writeFileSync(
    utilsDir + `/${name}-address.json`,
    JSON.stringify({ address: contract.address }, undefined, 2)
  );

  const contractArtifact = artifacts.readArtifactSync(name);

  fs.writeFileSync(
    utilsDir + `/${name}.json`,
    JSON.stringify(contractArtifact, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });