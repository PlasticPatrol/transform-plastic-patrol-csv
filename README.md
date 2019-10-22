## Data transform script

To use:

1.  Install [nodejs](https://nodejs.org/en/download/)
2.  Clone this [git repository](https://help.github.com/en/github/creating-cloning-and-archiving-repositories/cloning-a-repository)
3.  type `cd ./transform-plastic-patrol-csv` (or whatever you have called the folder) into the terminal and then press enter
4.  type `npm init` into the terminal and press enter again (this downloads all the node modules you might need)
5.  Put the file that want to transform into the `data` folder inside this directory
6.  Run `npm run transform-data **nameOfFileYouWantToTransform** **nameOfFileYouWantToSaveTransformationTo**` and then press enter. You don't need to add .csv to the end as it will do it automatically. If you don't give an input or output file it will default to `input.csv` and `output.csv`
