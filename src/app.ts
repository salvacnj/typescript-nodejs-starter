import * as bodyParser from 'body-parser';
import * as exegesisExpress from 'exegesis-express';
import * as express from 'express';
import * as fs from 'fs';
import * as yaml from 'js-yaml';
import * as path from 'path';
import * as swaggerUi from 'swagger-ui-express';
import {TOKE_SECRET} from '../configs/config';
import * as jwt from 'jsonwebtoken';
import * as cors from 'cors';
import * as helmet from 'helmet';


async function jwtAuthenticator(pluginContext, info) {
  if (!pluginContext.req.headers['authorization']) {
    return {type: 'missing', status: 400, message: 'Authorization header not included'};
  }
  let token = pluginContext.req.headers['authorization'].split(" ")[1];

  try {
    let payload = await jwt.verify(token, TOKE_SECRET);
  } catch (e) {
    if (e instanceof jwt.JsonWebTokenError) {
      return {type: 'invalid', status: 401, message: e.message};
    }
    return {type: 'invalid', status: 400, message: e.message};
  }
  return {type: "success", user: {}, roles: [], scopes: []};

  /**
   * Añadir fecha expiración
   */
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

      this.app.use(helmet());

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


    /**
     * Return server
     */
    const keyPath = path.resolve(__dirname, '../configs/server.key');
    const certPath = path.resolve(__dirname, '../configs/server.cert');

    if (existSSLFiles(certPath, keyPath)) {
      const httpsOptions = {
        key: fs.readFileSync(keyPath),
        cert: fs.readFileSync(certPath)
      }
      return require('https').createServer(httpsOptions, this.app);
    } else {
      return require('http').createServer(this.app);
    }
  }
}

export default App;


/**
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
