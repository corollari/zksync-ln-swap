import { privateKeyFromSeed, private_key_to_pubkey } from "zksync-crypto";
import * as crypto from "crypto";
import {NUM_BYTES} from './utils'

const privkey = privateKeyFromSeed(new Uint8Array(Buffer.from(crypto.randomBytes(NUM_BYTES))));
const pubkey = private_key_to_pubkey(privkey);

console.log(privkey, pubkey)