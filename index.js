const csv = require("csvtojson");
const { createObjectCsvWriter } = require("csv-writer");
const fetch = require("node-fetch");

const outputFileName = process.argv[2];

const OUTPUT_FILE_PATH = `${__dirname}/${outputFileName || "output"}.csv`;
const API_LINK = "https://api.plasticpatrol.co.uk/photos.json";

async function reformatApiCsv() {
  console.log("fetching photos");
  const response = await fetch(API_LINK).then((res) => {
    console.log("parsing response");

    return res.text();
  });
  const { photos } = JSON.parse(response);
  const outputData = [];
  const outputKeys = {};

  Object.keys(photos).forEach((id) => {
    const photo = photos[id];
    const {
      categories = [],
      pieces: totalPieces,
      details,
      originalUrl,
      location: { _latitude: latitude, _longitude: longitude },
      ...others
    } = photo;

    const photoUrls = makePhotoUrls(id);

    const commonFields = {
      totalPieces,
      latitude,
      longitude,
      ...others,
      ...photoUrls
    };

    Object.keys(commonFields).forEach((key) => {
      outputKeys[key] = key;
    });

    if (Object.values(categories).length) {
      categories.forEach((category) => {
        if (category.leafkey) {
          const splat = { ...category };
          category.leafKey = splat.leafkey;
          delete category.leafkey;
          console.log(category);
        }

        const categoryFields = { ...commonFields, ...category };
        outputData.push(categoryFields);

        Object.keys(categoryFields).forEach((key) => {
          outputKeys[key] = key;
        });
      });
    } else {
      outputData.push(commonFields);
    }
  });

  const outputSchema = Object.keys(outputKeys).map((val) => ({
    id: val,
    title: val
  }));

  const csvWriter = createObjectCsvWriter({
    path: OUTPUT_FILE_PATH,
    header: outputSchema
  });

  csvWriter.writeRecords(outputData).then(console.log("done"));
}

function convertToCSV(arrayOfDataObjects) {
  const newLine = "\r\n";
  return arrayOfDataObjects.reduce((csv, rowObject) => {
    const row = Object.values(rowObject);
    csv += row.join(",");
    csv += newLine;
    return csv;
  });
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
reformatApiCsv().catch((err) => console.error(err));
