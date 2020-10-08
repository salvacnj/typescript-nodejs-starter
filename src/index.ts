/**
 * This comment _supports_ [Markdown](https://marked.js.org/)
 *
 * https://typedoc.org/guides/doccomments/
 *
 */

import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as yaml from 'js-yaml';
import {AddressInfo} from 'net';
import * as openapiMongoose from 'openapi-mongoose';
import * as path from 'path';
import app from './app';
import utils = require('utils-nodejs-scr');


var mongoseDebug = require('debug')('mogoose');

const OPEN_API_FOLDER = path.resolve(process.cwd(), 'openapi.yaml');

/**
 * Load shared and specifics environments
 */
dotenv.config({path: path.join(process.cwd(), '/environments/.env')});
dotenv.config({
  path: path.join(process.cwd(), `/environments/${process.env.NODE_ENV}.env`),
});

var oasDoc = yaml.safeLoad(fs.readFileSync(OPEN_API_FOLDER, 'utf8'));

/**
 * Load models from open api
 */
var openApiModels = openapiMongoose.compile(oasDoc);

mongoseDebug('Open Api models: ');
mongoseDebug(JSON.stringify(openApiModels));

/**
 * Load models from folder
 */
var folderModels = require('./models/index')();
mongoseDebug('Folder models: ');
mongoseDebug(JSON.stringify(folderModels));


const server = new app()
  .createServer()
  .then(server => {
    server.listen(process.env.PORT || 3000);
    const {port} = server.address() as AddressInfo;
    console.log(`Listening on port ${port}`);
    console.log(`Docs http://localhost:${port}/swagger/`);
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

utils.mongoose.connect(mongo_uri);
