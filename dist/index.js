"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.walkSyncAll = exports.walkSync = void 0;
/*******
 * NPM PACKET STARTER TEMPLATE
 */
const fs = require("fs");
function walkSync(dir) {
    let files = fs.readdirSync(dir);
    let fileList = [];
    files.forEach(function (file) {
        if (fs.statSync(dir + '/' + file).isDirectory()) {
            fileList = fileList.concat(walkSync(dir + '/' + file), fileList);
        }
        else {
            if (file !== 'index.js')
                fileList.push(dir + '/' + file);
        }
    });
    return fileList;
}
exports.walkSync = walkSync;
;
/**
 * Return all the files of folder and subfolders
 *
 * @param {*} dir
 */
function walkSyncAll(dir) {
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
}
exports.walkSyncAll = walkSyncAll;
;
//exports.sistraHidrobus = require('./sistra-hidrobus.js');
/*walkSync(__dirname).forEach( loc => {
    require(loc);
});*/
//# sourceMappingURL=index.js.map