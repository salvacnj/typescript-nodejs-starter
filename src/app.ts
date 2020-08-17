import * as express from 'express'
import * as swaggerUi from 'swagger-ui-express'
import * as bodyParser from 'body-parser'
import * as exegesisExpress from 'exegesis-express';
import * as path from 'path';
import {Controllers} from 'exegesis'
import { AddressInfo } from 'net'


//You may choose HTTP or HTTPS, if HTTPS you need a SSL Cert
import * as http from 'http';
import * as https from 'https';
import * as fs from 'fs';
import * as yaml from 'js-yaml';


var controllers: Controllers = Map['greetController'] = Map['create'] ; 


async function sessionAuthenticator(pluginContext, info) {
  const session = pluginContext.req.headers.api_key;
  if (!session) {
    return { type: 'missing', statusCode: 401, message: 'Session key required' };
  } else if (session === 'secret') {
    return { type: 'success', user: { name: 'jwalton', roles: ['read', 'write'] } };
  } else {
    // Session was supplied, but it's invalid.
    return { type: 'invalid', statusCode: 401, message: 'Invalid session key' };
  }
}

const OPEN_API_FOLDER =  path.resolve(process.cwd(), 'openapi.yaml');
const SWAGGER_URI = '/swagger';
const EXEGESIS_OPTIONS: exegesisExpress.ExegesisOptions = {
  controllers: path.resolve(__dirname, './controllers'),
  ignoreServers: true,
  authenticators: {
    sessionKey: sessionAuthenticator,
  },
  allowMissingControllers: false,
  controllersPattern: "**/*.@(ts|js)"
};

class App {
  private app: any; 

  constructor() {
    this.app = express();
    this.app.use(bodyParser.urlencoded({
      extended: true
    }));
    this.app.use(bodyParser.json());

    var oasDoc = yaml.safeLoad(fs.readFileSync(path.join(OPEN_API_FOLDER), 'utf8'));

    this.app.use(SWAGGER_URI, swaggerUi.serve, swaggerUi.setup(oasDoc));
  }

  public async createServer() {
    // See https://github.com/exegesis-js/exegesis/blob/master/docs/Options.md

    // This creates an exgesis middleware, which can be used with express,
    // connect, or even just by itself.

    try {
      const exegesisMiddleware = await exegesisExpress.middleware(
        OPEN_API_FOLDER,
        EXEGESIS_OPTIONS
      );

      // If you have any body parsers, this should go before them.
      this.app.use(exegesisMiddleware);

    } catch(error){
      console.error(error);
    }

    // Return a 404
    this.app.use((req, res) => {
      res.status(404).json({
        message: `Not found`
      });
    });

    // Handle any unexpected errors
    this.app.use((err, req, res, next) => {
      res.status(500).json({
        message: `Internal error: ${err.message}`
      });
    });

    const server = http.createServer(this.app);
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
}

export default App;