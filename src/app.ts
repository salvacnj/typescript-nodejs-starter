import * as bodyParser from 'body-parser';
import * as exegesisExpress from 'exegesis-express';
import * as express from 'express';
import * as fs from 'fs';
//You may choose HTTP or HTTPS, if HTTPS you need a SSL Cert
import * as http from 'http';
import * as yaml from 'js-yaml';
import * as path from 'path';
import * as swaggerUi from 'swagger-ui-express';
let jwt = require('jsonwebtoken');


async function jwtAuthenticator(pluginContext, info) {
  let token = pluginContext.req.headers['authorization'];
  const tokenPrefix = 'Bearer ';
  let payload;

  try {
    payload = await jwt.verify(token.substring(tokenPrefix.length), "miclaveultrasecreta123");
  } catch (e) {
    if (e instanceof jwt.JsonWebTokenError) {
      return {type: 'invalid', status: 401, message: e.message};
    }
    return {type: 'invalid', status: 400, message: e.message};
  }
  return {type: "success", user: {}, roles: [], scopes: []};
}

const OPEN_API_FOLDER = path.resolve(process.cwd(), 'openapi.yaml');
const SWAGGER_URI = '/swagger';
const EXEGESIS_OPTIONS: exegesisExpress.ExegesisOptions = {
  controllers: path.resolve(__dirname, './controllers'),
  ignoreServers: true,
  authenticators: {
    bearerAuth: jwtAuthenticator
  },
  allowMissingControllers: true,
  controllersPattern: "**/*.@(ts|js)"
};

class App {
  private app: any;

  constructor() {
    this.app = express();

    /**
     * JWT
     */
    //this.app.set('llave', require('./configs/config'));
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

    } catch (error) {
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
