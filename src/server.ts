//Import librarys used 
import * as express from 'express';
import * as exegesisExpress from 'exegesis-express';
import * as path from 'path';
import * as dotenv from "dotenv";


dotenv.config({ path: `${__dirname}/../.env`});


//You may choose HTTP or HTTPS, if HTTPS you need a SSL Cert
import * as http from 'http';
import * as https from 'https';
import * as oasTools from 'oas-tools';
import * as fs from 'fs';
import * as jsyaml from 'js-yaml';


const PORT = 3000;

const options_object = {
  controllers: path.join(__dirname, './controllers'),
  checkControllers: false,
  loglevel: 'info',
  strict: false,
  router: true,
  validator: true,
  docs: {
    apiDocs: '/api-docs',
    apiDocsPrefix: '',
    swaggerUi: '/docs',
    swaggerUiPrefix: ''
  }
};

async function createServer() {
    // See https://github.com/exegesis-js/exegesis/blob/master/docs/Options.md

    const app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));


    const options = {
        controllers: path.resolve(__dirname, './controllers'),
        //ignorePaths: true,
        allowMissingControllers: false,
        controllersPattern: "**/*.@(ts|js)"
    };

    // This creates an exgesis middleware, which can be used with express,
    // connect, or even just by itself.
    const exegesisMiddleware = await exegesisExpress.middleware(
        path.resolve(__dirname, './openapi.yaml'),
        options
    );


    
    var spec = fs.readFileSync(path.join('src/openapi.yaml'), 'utf8');
    var oasDoc = jsyaml.safeLoad(spec);


       
    oasTools.configure(options_object);

    // Return a 404
    app.use((req, res) => {
        res.status(404).json({message: `Not found`});
    });

    // Handle any unexpected errors
    app.use((err, req, res, next) => {
        res.status(500).json({message: `Internal error: ${err.message}`});
    });
    //Used to create a HTTP Server
    await resolveAfter2Seconds(oasDoc, app);


    //app.use(exegesisMiddleware);


    // If you have any body parsers, this should go before them.
    //app.use(exegesisMiddleware);


    const server = http.createServer(app);
    /**
     * If you want to run a HTTPS server instead you must:
     * + Get a SSL Cert and Key to use 
     * + Change the server type from http to https as shown below
     *
     
    const httpsOptions = {
        key: fs.readFileSync('./config/key.pem'),
        cert: fs.readFileSync('./config/cert.pem')
    }
    const server = https.createServer(httpsOptions,app);

    */
    return server;
}
//Run our createServer function
createServer()
.then(server => {
    server.listen(PORT);
    console.log("Listening on port 3000");
    console.log("Try visiting http://localhost:3000/v1/greet?name=Jason");
    console.log('API docs (Swagger UI) available on http://localhost:' + PORT + '/docs');
    console.log("________________________________________________________________");
})
.catch(err => {
    console.error(err.stack);
    process.exit(1);
});


function resolveAfter2Seconds(oasDoc,app) {  
    return new Promise(resolve => {
      oasTools.initialize(oasDoc, app, function() {
          console.log("OAS")
          resolve('resolved');
        });
      });
  
  }
