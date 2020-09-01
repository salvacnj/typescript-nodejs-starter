import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as fs from 'fs';
//You may choose HTTP or HTTPS, if HTTPS you need a SSL Cert
import * as http from 'http';
import * as yaml from 'js-yaml';
import * as path from 'path';
import * as swaggerUi from 'swagger-ui-express';

const OPEN_API_FOLDER = path.resolve(process.cwd(), 'openapi.yaml');
const SWAGGER_URI = '/swagger';

class App {
  private app: any;

  constructor() {
    this.app = express();

    this.app.use(express.static(__dirname + '/public'));
    this.app.use(
      '/css',
      express.static(__dirname + '/node_modules/bootstrap/dist/css'),
    );
    this.app.use(
      '/js',
      express.static(__dirname + '/node_modules/jquery/dist'),
    );
    this.app.use(
      '/js',
      express.static(__dirname + '/node_modules/popper.js/dist'),
    );
    this.app.use(
      '/js',
      express.static(__dirname + '/node_modules/bootstrap/dist/js'),
    );

    //this.app.engine('ejs', require('ejs-locals'));
    this.app.set('views', __dirname + '/public/views');
    this.app.set('view engine', 'ejs');

    this.app.use(
      bodyParser.urlencoded({
        extended: true,
      }),
    );
    this.app.use(bodyParser.json());

    var oasDoc = yaml.safeLoad(
      fs.readFileSync(path.join(OPEN_API_FOLDER), 'utf8'),
    );

    this.app.use(SWAGGER_URI, swaggerUi.serve, swaggerUi.setup(oasDoc));

    /**
     * ROUTES
     */

    require('./routes')(this.app); // Cargamos las rutas
  }

  public async createServer() {
    // Return a 404
    this.app.use((req, res) => {
      res.status(404).json({
        message: `Not found`,
      });
    });

    // Handle any unexpected errors
    this.app.use((err, req, res, next) => {
      res.status(500).json({
        message: `Internal error: ${err.message}`,
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
