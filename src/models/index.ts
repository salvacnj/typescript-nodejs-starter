
import * as openapiMongoose from '../helpers/openapi-mongoose';
import { OPEN_API_DOCUMENT } from '../../configs/openapi';

require('../helpers/utils').walkSync(__dirname).forEach(loc => {
  let extension  = loc.split('.').pop()
  if ( extension === 'ts' || extension === 'js' ){
    require(loc);
  }
});

var openApiModels = openapiMongoose.compile(OPEN_API_DOCUMENT);

//console.log(openApiModels.schemas['Measure']['obj']['names']);





