const csv = require("csvtojson");
const { createObjectCsvWriter } = require("csv-writer");

const inputFileName = process.argv[2];
const outputFileName = process.argv[3];

const INPUT_FILE_PATH = `${__dirname}/data/${inputFileName || "input"}.csv`;
const OUTPUT_FILE_PATH = `${__dirname}/data/${outputFileName || "output"}.csv`;

async function reformatApiCsv() {
  let photosWithoutOriginalUrl = 0;
  let photosWithOriginalUrl = 0;
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
      originalUrl,
      ...others
    } = otherOutputFields;

    const photoUrls = makePhotoUrls(others.id);

    if (Object.values(categories).length) {
      Object.values(categories).forEach(category => {
        outputKeys = { totalPieces, ...others, ...category, ...photoUrls };
        outputData.push({ totalPieces, ...others, ...category, ...photoUrls });
      });
    } else {
      outputData.push({ totalPieces, ...others, ...photoUrls });
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

function makePhotoUrls(id) {
  const thumbnailUrl = `https://storage.googleapis.com/plastic-patrol-fd3b3.appspot.com/photos/${id}/thumbnail.jpg`;
  const orignalPhotoUrl = `https://storage.googleapis.com/plastic-patrol-fd3b3.appspot.com/photos/${id}/original.jpg`;
  const photoSize1024Url = ` https://storage.googleapis.com/plastic-patrol-fd3b3.appspot.com/photos/${id}/1024.jpg`;

  return {
    thumbnailUrl,
    orignalPhotoUrl,
    photoSize1024Url
  };
}
reformatApiCsv();
