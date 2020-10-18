/**
 * This comment _supports_ [Markdown](https://marked.js.org/)
 *
 * https://typedoc.org/guides/doccomments/
 *
 */

import * as dotenv from 'dotenv';
import * as path from 'path';

/**
* Load shared and specifics environments
*/
dotenv.config({path: path.join(process.cwd(), '/environments/.env')});
dotenv.config({
  path: path.join(process.cwd(), `/environments/${process.env.NODE_ENV}.env`),
});



import {AddressInfo} from 'net';
import app from './app';
import * as openapiMongoose from './helpers/openapi-mongoose';

import * as yaml from 'js-yaml';
import * as fs from 'fs';
import * as mongoose from 'mongoose';


let mongooseUtils = require('./helpers/mongoose');
var mongoseDebug = require('debug')('mogoose');

const OPEN_API_FOLDER = path.resolve(process.cwd(), 'openapi.yaml');


/**
 * Load openapi document
 */
var openApiDocument = yaml.safeLoad(fs.readFileSync(OPEN_API_FOLDER, 'utf8'));

/**
 * Load models
 */

var folderModels = require('./models/index');
mongoseDebug('Folder models: ');
mongoseDebug(JSON.stringify(folderModels));


var openApiModels = openapiMongoose.compile(openApiDocument);

console.log(openApiModels.schemas['Measure']['obj']['names']);

//mongoose.models.Variable.create()

mongoseDebug('Open Api models: ');
//mongoseDebug(JSON.stringify(openApiModels));

const server = new app()
  .createServer()
  .then(server => {
    server.listen(process.env.PORT || 3000);
    const {port} = server.address() as AddressInfo;
    const SWAGGER_URL = process.env.SWAGGER_URL || 'api-docs';
    console.log(`[SERVER]: Listening on http://localhost:${port}/`);
    console.log(`[SERVER]: Swagger documentation http://localhost:${port}${SWAGGER_URL}/ or for SSL https://localhost:${port}${SWAGGER_URL}/`);
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
