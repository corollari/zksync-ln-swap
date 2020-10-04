import {merge_array} from './utils'

const pubkeys = [] as Uint8Array[]

const all_pubkeys = merge_array(pubkeys);
const aggregated_pubkey = compute_aggregated_pubkey(all_pubkeys)

console.log("Global pubkey")