const csv = require("csvtojson");
const { createObjectCsvWriter } = require("csv-writer");

const inputFileName = process.argv[2];
const outputFileName = process.argv[3];

const INPUT_FILE_PATH = `${__dirname}/data/${inputFileName || "input"}.csv`;
const OUTPUT_FILE_PATH = `${__dirname}/data/${outputFileName || "output"}.csv`;

async function reformatApiCsv() {
  const data = await csv({ flatKeys: true }).fromFile(INPUT_FILE_PATH);

  const outputData = [];
  let outputKeys;

  data.forEach((inputRow, index) => {
    const otherOutputFields = {};
    const categories = {};
    Object.keys(inputRow).forEach(key => {
      if (key.includes("categories")) {
        if (inputRow[key]) {
          const { catNum, catNumInfo } = getCategoryKeyInfo(key);
          if (categories[catNum]) {
            categories[catNum][catNumInfo] = inputRow[key];
          } else {
            categories[catNum] = { [catNumInfo]: inputRow[key] };
          }
        }
      } else {
        otherOutputFields[key] = inputRow[key];
      }
    });
    const {
      pieces: totalPieces,
      details,
      originalUrl: removed,
      ...others
    } = otherOutputFields;
    //TODO: figure out wtf is happening
    const originalUrl = String(inputRow.originalUrl);

    if (Object.values(categories).length) {
      Object.values(categories).forEach(category => {
        outputKeys = { totalPieces, originalUrl, ...others, ...category };
        outputData.push({ totalPieces, ...others, ...category });
      });
    } else {
      outputData.push({ totalPieces, ...others });
    }

    outputData[outputData.length - 1].originalUrl = originalUrl;
  });

  const outputSchema = Object.keys(outputKeys).map(val => ({
    id: val,
    title: val
  }));

  const csvWriter = createObjectCsvWriter({
    path: OUTPUT_FILE_PATH,
    header: outputSchema
  });

  csvWriter.writeRecords(outputData).then(console.log("done"));
}

const getCategoryKeyInfo = key => {
  const splitKey = key.split(".");
  const catNum = splitKey[1];
  const catNumInfo = splitKey[2];

  return { catNum, catNumInfo };
};

function convertToCSV(arrayOfDataObjects) {
  const newLine = "\r\n";
  return arrayOfDataObjects.reduce((csv, rowObject) => {
    const row = Object.values(rowObject);
    csv += row.join(",");
    csv += newLine;
    return csv;
  });
  //, headers.join(",") + newLine);
}

reformatApiCsv();
