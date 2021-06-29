// Constants for conversion computing
const BUFFER_SIZE = 256;
exports.SECTOR_SIZE = 512;
exports.GIGABIT_SIZE = 1024**3;

// Get ASCII string from byte subarray
exports.bytesString = (byteArray, startWord, endWord) => {
  return String.fromCharCode(...byteArray.slice(startWord * 2, (endWord + 1) * 2));
};

// Convert a byte array into an integer
exports.byteArrayToLong = (byteArray) => {
  let numericalValue = 0;
  for ( let i = byteArray.length - 1; i >= 0; i--) {
    numericalValue = (numericalValue * BUFFER_SIZE) + byteArray[i];
  };
  return numericalValue;
};

// Split byte into bits
exports.byteToBit = (byte) => {
  let bitArray = new Array;
  for (let i = 7; i >= 0; i--) {
    let bit = byte & (1 << i) ? 1 : 0;
    bitArray.push(bit);
  };
  return bitArray;
};