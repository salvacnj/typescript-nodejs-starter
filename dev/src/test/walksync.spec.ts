import * as index from '../index';
import { expect } from 'chai';

// if you used the '@types/mocha' method to install mocha type definitions, uncomment the following line
// import 'mocha';

describe('Walk Sync Test', () => {
  it('should return files and subfolders of docs', () => {  
    const folder =  process.cwd() +'/docs';
    let files = index.walkSync(folder);
    let filesAll = index.walkSyncAll(folder);
 
    expect(files).to.be.an('array');
    expect(filesAll).to.be.an('array');

  });
});