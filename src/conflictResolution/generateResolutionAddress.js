const {
    getCreate2Address,
} = require("solidity-create2-deployer");
const {
    salt,
    bytecode,
    constructorTypes,
    constructorArgs
} = require("./params")

const computedAddress = getCreate2Address({
    salt: salt,
    contractBytecode: bytecode,
    constructorTypes: constructorTypes,
    constructorArgs: constructorArgs
});

console.log(`Contract would be instantiated at ${computedAddress}`);