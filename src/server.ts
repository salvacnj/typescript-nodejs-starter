

/**
 * This comment _supports_ [Markdown](https://marked.js.org/)
 * 
 * https://typedoc.org/guides/doccomments/ 
 * 
 */

import * as path from 'path';
import * as dotenv from "dotenv";
import * as openapiMongoose from 'openapi-mongoose';
import * as mongoose from 'mongoose';
import * as yaml from 'js-yaml';
import * as fs from 'fs';
import app from './app'


dotenv.config({ path: `${__dirname}/../.env`});

console.log(process.env.DEBUG);


const OPEN_API_FOLDER = 'src/openapi.yaml';

var oasDoc = yaml.safeLoad(fs.readFileSync(path.join(OPEN_API_FOLDER), 'utf8'));

var mongo_uri = process.env.MONGO_URL || `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}`;

var results = openapiMongoose.compile(oasDoc);

console.log(JSON.stringify(results));

mongoose.connect(mongo_uri, {useNewUrlParser: true, useUnifiedTopology:true}, (err) => {
    if(err) throw err;
        console.log('[MONGODB]: Connected to Database');
});

const server = new app().createServer()
.then(server => {
    server.listen(process.env.PORT);
    console.log("Listening on port 3000");
    console.log("Try visiting http://localhost:3000/greet?name=Jason");
    console.log("Docs http://localhost:3000/swagger/")
})
.catch(err => {
    console.error(err.stack);
    process.exit(1);
});


