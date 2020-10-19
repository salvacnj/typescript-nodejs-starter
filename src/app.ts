import * as bodyParser from 'body-parser';
import * as exegesisExpress from 'exegesis-express';
import * as express from 'express';
import * as fs from 'fs';
import * as path from 'path';
import * as swaggerUi from 'swagger-ui-express';
import * as cors from 'cors';
import * as helmet from 'helmet';
import { jwtAuthenticator } from './controllers/authController'
import {SSL_KEY_PATH,  SSL_CERT_PATH} from '../configs/ssl/config'


// TODO: Configure LOGS Enviroments
var appLog = require('debug')('app');

import { OPEN_API_DOCUMENT,OPEN_API_FOLDER } from '../configs/openapi';

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
    // Remove the X-Powered-By headers.
    this.app.disable('x-powered-by');

    /**
     * EXPRESS Configuration
     */
    this.app.use(cors());
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({
      extended: true
    }));

    this.app.use(process.env.SWAGGER_URL || 'api-docs', swaggerUi.serve, swaggerUi.setup(OPEN_API_DOCUMENT));
  }

  public async createServer() {
    // See https://github.com/exegesis-js/exegesis/blob/master/docs/Options.md
    // This creates an exgesis middleware, which can be used with express,
    // connect, or even just by itself.

    try {
      const exegesisMiddleware = await exegesisExpress.middleware(OPEN_API_FOLDER,EXEGESIS_OPTIONS);

      /**
       * MIDDELWARES AN BODY PARSERS GO HERE
       */
      this.app.use(helmet());

      // If you have any body parsers, this should go before them.
      this.app.use(exegesisMiddleware);

      /**
       * LOAD ROUTES
       */
      require("./routes/index").loadRoutes(this.app);

    } catch (error) {
      console.error(error);
    }

    /**
     * ERROR MESSAGES
     */

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

    /**
     * Return server
     */
    if (existSSLFiles(SSL_CERT_PATH, SSL_KEY_PATH)) {
      const httpsOptions = {
        key: fs.readFileSync(SSL_KEY_PATH),
        cert: fs.readFileSync(SSL_CERT_PATH)
      }
      console.log("[SERVER]: Using SSL/TLS Certificate\n\r");
      return require('https').createServer(httpsOptions, this.app);
    } else {
      return require('http').createServer(this.app);
    }
  }
}

export default App;


/**
 * TODO: move this configuration to configs/ssl
 * Check if './config/key.pem' and './config/cert.pem' exits
 */
function existSSLFiles(certPath, keyPath): boolean {
  try {
    if (!fs.existsSync(keyPath) || !fs.existsSync(certPath)) {
      return false;
    }
    return true;

  } catch (err) {
    console.error(err)
  };
}
