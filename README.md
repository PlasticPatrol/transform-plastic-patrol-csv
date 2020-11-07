## Data transform script

This script will fetch the latest copy of the data available on the plastic patrol api link and perform a couple of small transformations.

Transformations:

- Flatten the data by categories

Additional output fields given:

- thumbnailUrl, url of thumbnail size copy of the image
- orignalPhotoUrl, url of the photo uploaded by the user
- photoSize1024Url, url of the photo at a size of 1024x1024px

To use:

1.  Install [nodejs](https://nodejs.org/en/download/)
2.  Clone this [git repository](https://help.github.com/en/github/creating-cloning-and-archiving-repositories/cloning-a-repository)
3.  type `cd ./transform-plastic-patrol-csv` (or whatever you have called the folder) into the terminal and then press enter
4.  type `npm init` into the terminal and press enter again (this downloads all the node modules you might need)
5.  Run `npm run transform-data **nameOfFileYouWantToSaveTransformationTo**` and then press enter. You don't need to add .csv to the end as it will do it automatically. If you don't give an output file it will default to `output.csv`
