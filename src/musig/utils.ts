export const NUM_BYTES = 32;
export const number_of_participants = 2;

export function merge_array(elements: Uint8Array[], isSig = false): Uint8Array {
    let buffer_size = isSig ? 2 * NUM_BYTES : NUM_BYTES;
    let buffer = new Uint8Array(number_of_participants * buffer_size);
    for (let i = 0; i < elements.length; i++) {
        buffer.set(elements[i], i * elements[i].length);
    }
    return buffer;
}