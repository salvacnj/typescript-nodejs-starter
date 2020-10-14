/**
 * This comment _supports_ [Markdown](https://marked.js.org/)
 *
 * https://typedoc.org/guides/doccomments/
 *
 */

import * as dotenv from 'dotenv';
import {AddressInfo} from 'net';
import * as path from 'path';
import app from './app';
import * as openapiMongoose from './helpers/openapi-mongoose';

let yaml = require('js-yaml');
let fs = require('fs');
let mongoose = require('mongoose');


let mongooseUtils = require('./helpers/mongoose');
var mongoseDebug = require('debug')('mogoose');

const OPEN_API_FOLDER = path.resolve(process.cwd(), 'openapi.yaml');

/**
 * Load shared and specifics environments
 */
dotenv.config({path: path.join(process.cwd(), '/environments/.env')});
dotenv.config({
  path: path.join(process.cwd(), `/environments/${process.env.NODE_ENV}.env`),
});


/**
 * Load openapi document
 */
var openApiDocument = yaml.safeLoad(fs.readFileSync(OPEN_API_FOLDER, 'utf8'));

/**
* Load models from open api
*/
var openApiModels = openapiMongoose.compile(openApiDocument);

mongoseDebug('Open Api models: ');
mongoseDebug(JSON.stringify(openApiModels));


/**
 * Load models from folder
 */
//var folderModels = require('./models/index')();
var folderModels = require('./models/index');
mongoseDebug('Folder models: ');
mongoseDebug(JSON.stringify(folderModels));

console.log(openApiModels.models);
//console.log(folderModels);

//let Inheritance = mongoose.model('Inheritance');
//let Greets = mongoose.model('Greet');
//let User = mongoose.model('User');


const server = new app()
  .createServer()
  .then(server => {
    server.listen(process.env.PORT || 3000);
    const {port} = server.address() as AddressInfo;
    console.log(`[SERVER]: Listening on port ${port}`);
    console.log(`[SERVER]: Swagger documentation http://localhost:${port}/swagger/`);
    console.log(`[SERVER]: Swagger documentation https://localhost:${port}/swagger/`);
  })
  .catch(err => {
    console.error(err.stack);
    process.exit(1);
  });

/**
 * Data base connections
 */
var mongo_uri =
  process.env.MONGO_URL ||
  `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}`;

mongooseUtils.connect(mongo_uri);
