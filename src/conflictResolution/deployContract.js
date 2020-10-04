const {
    ethers,
    deployContract,
} = require("solidity-create2-deployer");
const {
    salt,
    bytecode,
    constructorTypes,
    constructorArgs
} = require("./params")

const privateKey = "0x...";
const provider = ethers.getDefaultProvider();
const signer = new ethers.Wallet(privateKey, provider);

const { txHash, address, receipt } = await deployContract({
    salt,
    contractBytecode: bytecode,
    constructorTypes,
    constructorArgs,
    signer
});

console.log(txHash, address, receipt);