
let express = require('express');
const fs = require('fs');
const { SECTOR_SIZE, GIGABIT_SIZE, bytesString, byteArrayToLong, byteToBit } = require('./libs/binary');
const app = express();

// Insert CSS into the HTML view
app.use(express.static(__dirname + '/public'));

// Handle GET request
app.get('/', (request, response) => {
  console.log('GET /');
  response.sendFile('views/index.html', { root: __dirname });
});

// Handle POST request
const handlePost = (err, data) => {
  if (err) {
    console.error(err);
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
  const diskSize = addressableSectors * SECTOR_SIZE / GIGABIT_SIZE
  
  return { model: modelNumber.trim(), serial: serialNumber.trim(), address: addressSupport, sectors: new Intl.NumberFormat('en-GB').format(addressableSectors), diskSize: diskSize };
}

app.post('/', (request, response) => {
  console.log('POST /');
  fs.readFile('data/binary.dat', 'binary' , (err, data) => response.send(handlePost(err,data)));
});

// Launch listener on port 8123
const port = 8123;
app.listen(port);
console.log(`Listening at http://localhost:${port}`);