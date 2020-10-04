# zksync-ln-swap
> zkSync <-> LN trustless swapping

## Protocol
At the moment only basic payments are supported on zksync, therefore it's impossible to use the HTLCs that are commonly used to build atomic and/or submarine swaps. However, it's still possible to create multisigs through MPC protocols, which provides us with basic covenant functionality (~same as bitcoin).

More concretely, the idea is that the two parties involved in the swap can create a 2-of-2 multisig and then directly sign a few transactions that spend from it, thus getting an address from which funds can only be spent in a limited number of ways.

To get started, the following setup will be carried out:
1. Exchange the necessary data to form a 2-of-2 multisig address
2. Sign a transaction that withdraws the funds to an onchain contract X

This onchain contract will just send funds to the one paying the LN invoice if that party manages to produce the pre-image within a time limit, if that's not the case funds will be sent to the other party as it is assumed that the invoice was not paid.  
Note: This contract is created counterfactually with CREATE2, but this is not important as it just means that the fees paid will be lower due to the fact that contracts will only be need to be deployed in swaps where there's conflict.

Once the setup has been done, the party providing the LN invoice will send their coins to the musig address. The other party will then check if there's an LN payment route that could pay the invoice with a timeout lower than the one specified on the onchain contract, and, if there is, will pay it to retrieve the preimage once it gets settled.  
If everything has gone well the two parties will then just sign a new tx that sends the tokens to the LN payer, but if a conflict occurs and one of the two parties refuse to sign that tx then the initial tx will need to be broadcast, bringing on-chain resolution based on knowledge of the preimage.

## Usage
### Create resolution contract
1. Replace the address on `contract/contracts/CounterfactualResolution.sol` for the address of the token you want to swap
2. Generate a lightning invoice and extract it's payment hash using [lndecode.com](https://lndecode.com/), `lncli` or another library/client
3. Populate `src/conflictResolution/params.js` with the extracted payment hash and the ethereum addresses of the two parties performing the swap.
4. Run `src/conflictResolution/generateResolutionAddress.js` to get the address where the resolution contract would be instantiated if deployed.

### Musig ceremony
1. 


### Sending txs


### Resolving conflicts
> Break in case of fire!
1. Deploy the conflict resolution contract by running `src/conflictResolution/deployContract.js`
2. If you are the party paying the invoice, get the preimage that was revealed upon payment and call claimBuyer(preimage) on the contract before the expiration deadline (defined as `claimDelay` in the contract)
3. If you are the other party just wait till the `claimDelay` deadline expires and call claimSeller() directly

## A note on griefing
In it's current state, both parties can grief the other (although they won't gain any economical benefit from that) by stopping mid swap. This should be easily preventable by adding some type of punishment deposits, but that's out of the scope of this project.

## Extra verification
- Read the code :)
- Build the contract at `contract/contracts/CounterfactualResolution.sol` and verify that the bytecode in `src/conflictResolution/params.js` matches.

## Future work
zksync is currently working on a smart contracts system that will include both to the sha256 primitive and access to time constants from ethereum (I requested that, yay!) so in the future that seems like it'll be the best way to perform swaps, as it will eliminate the need for this long interactive process between parties while also allowing conflict resolution to be performed off-chain.

## Credits
- Original idea of using a musig for atomic swaps on zksync comes from [this twitter thread](https://twitter.com/zksync/status/1311961510143496192), although the idea of using multisigs for covenants is not new and has been discussed several times in the bitcoin community
- Musig code has been forked from [matter-labs/multisig](https://github.com/matter-labs/multisig)
- Code for CREATE2 Conterfactual contract instantation is based on [thegostep/solidity-create2-deployer](https://github.com/thegostep/solidity-create2-deployer) (dropped a PR :D)
- Code for transaction encoding and signing is forked from [matter-labs/zksync/sdk/zksync.js](https://github.com/matter-labs/zksync/tree/master/sdk/zksync.js)