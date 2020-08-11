"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index = require("../index");
const chai_1 = require("chai");
// if you used the '@types/mocha' method to install mocha type definitions, uncomment the following line
// import 'mocha';
describe('Walk Sync Test', () => {
    it('should return files and subfolders of docs', () => {
        const folder = process.cwd() + '/docs';
        let files = index.walkSync(folder);
        let filesAll = index.walkSyncAll(folder);
        chai_1.expect(files).to.be.an('array');
        chai_1.expect(filesAll).to.be.an('array');
    });
});
//# sourceMappingURL=walksync.spec.js.map