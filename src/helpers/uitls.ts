import * as fs from 'fs';

export function walkSync(dir: string): Array<string> {
  let files = fs.readdirSync(dir);
  let fileList = [];

  files.forEach(function (file) {
    if (fs.statSync(dir + '/' + file).isDirectory()) {
      fileList = fileList.concat(walkSync(dir + '/' + file), fileList);
    }
    else {
      if (file !== 'index.js' && file !== 'index.ts')
        fileList.push(dir + '/' + file);
    }
  });
  return fileList;
};

/**
 * Return all the files of folder and subfolders
 *
 * @param {*} dir
 */
export function walkSyncAll(dir: string): Array<string> {
  let files = fs.readdirSync(dir);
  let fileList = [];
  files.forEach(function (file) {
    if (fs.statSync(dir + '/' + file).isDirectory()) {
      fileList = fileList.concat(walkSyncAll(dir + '/' + file), fileList);
    }
    else {
      fileList.push(dir + '/' + file);
    }
  });
  return fileList;
};