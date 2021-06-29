
let express = require('express');
const fs = require('fs');
let app = express();

// Insert CSS into the HTML view
app.use(express.static(__dirname + '/public'));

// Get ASCII string from byte subarray
const bytesString = (byteArray, startWord, endWord) => {
  return String.fromCharCode(...byteArray.slice(startWord*2, (endWord+1)*2))
}

// Convert a byte array into an integer
const byteArrayToLong = (byteArray) => {
  let numericalValue = 0;
  for ( let i = byteArray.length - 1; i >= 0; i--) {
    numericalValue = (numericalValue * 256) + byteArray[i];
  }
  return numericalValue;
};

// Split byte into bits
const byteToBit = (byte) => {
  let bitArray = new Array;
  for (let i = 7; i >= 0; i--) {
    let bit = byte & (1 << i) ? 1 : 0;
    bitArray.push(bit);
  }
  return bitArray;
}

// Handle GET and POST requests
app.get('/', (request, response) => {
  console.log('GET /');
  response.sendFile('views/index.html', { root: __dirname });
});

app.post('/', (request, response) => {
  console.log('POST /');
  fs.readFile('data/binary.dat', 'binary' , (err, data) => {
    if (err) {
      console.error(err)
      return "error"
    }
    let parsedData = Buffer.from(data, 'binary').toJSON().data;

    // Get model number from words 27-46
    const modelNumber = bytesString(parsedData, 27, 46)

    // Get serial number from words 10-19
    const serialNumber = bytesString(parsedData, 10, 19)

    // Get 48-bit Address feature set supported from bit 10 of word 83
    const addressSupport = byteToBit(parsedData[166]).concat(byteToBit(parsedData[167]))[10] === 1 ? true : false;

    // Get number of 512-byte user addressable sectors from words 60-61 and convert size to GB
    const addressableSectors = byteArrayToLong(parsedData.slice(120, 124))
    const diskSize = addressableSectors * 512 / 1024 / 1024 / 1024
    
    response.send({ model: modelNumber.trim(), serial: serialNumber.trim(), address: addressSupport, sectors: new Intl.NumberFormat('en-GB').format(addressableSectors), diskSize:  diskSize});
  });
});

// Launch listener on port 8123
const port = 8123;
app.listen(port);
console.log(`Listening at http://localhost:${port}`);