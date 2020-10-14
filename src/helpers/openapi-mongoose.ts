/**
 * Use to convert the open api models to mongoose models
 */

'use strict';
import * as fs from 'fs';
import * as YAML from 'js-yaml';
import * as _ from 'lodash';
import * as mongoose from 'mongoose';

var Schema = mongoose.Schema;

//var swaggerMongoose = require('payapi-swagger-mongoose');
//var path = require('path');

//var encrypt = require('mongoose-encryption');
//var debug = require('debug')('payapi:mongoose-encryption');
//var allowedTypes = ['number','integer', 'long', 'float', 'double', 'string', 'password', 'boolean', 'date', 'dateTime', 'array'];
var schemasOpenApi = null;
// var swaggerVersion = null;
// var v2MongooseProperty = 'x-swagger-mongoose';
// var v1MongooseProperty = '_mongoose';
// var xSwaggerMongoose = {
//   schemaOptions: {},
//   additionalProperties: {},
//   excludeSchema: {},
//   documentIndex: {},
// };
// var validators = {};


export function compile(file) {
  let refFile = isPropertyHasRef(file.components.schemas);
  (refFile ? schemasOpenApi = loadRef(refFile) : schemasOpenApi = file.components.schemas)

  let schemas = {};

  _.forEach(schemasOpenApi, function (schemaOpenApi, modelName) {
    let schema = {};
    // If has $ref load file
    let refFileSub = isPropertyHasRef(schemaOpenApi);

    if (refFileSub) {
      let folder = '';

      if (typeof refFile === 'string') {
        folder = refFile.substr(0, refFile.indexOf('/') + 1);
      }
      schemaOpenApi = loadRef(folder + refFileSub);
    }

    _.forEach(schemaOpenApi.properties, function (property, name) {
      let required = false;

      if (typeof schemaOpenApi.required !== 'undefined') {
        if (schemaOpenApi.required.includes(name)) {
          required = true;
        }
      }
      schema[name] = {'type': propertyMap(property), 'required': required};
    })
    schemas[modelName] = schema;
  })

  var models = {};
  _.forEach(schemas, function (schema, key) {
    models[key] = mongoose.model(key, schema);
  });

  return {
    schemas: schemas,
    models: models
  };
}

function propertyMap(property) {
  switch (property.type) {
    case 'number':
      switch (property.format) {
        case 'integer':
        case 'long':
        case 'float':
        case 'double':
          return Number;
        default:
          throw new Error('Unrecognised schema format: ' + property.format);
      }
    case 'integer':
    case 'long':
    case 'float':
    case 'double':
      return Number;
    case 'string':
    case 'password':
      return String;
    case 'boolean':
      return Boolean;
    case 'date':
    case 'dateTime':
      return Date;
    case 'array':
      return [propertyMap(property.items)];
    default:
      throw new Error('Unrecognized schema type: ' + property.type);
  }
};


var isPropertyHasRef = function (property) {
  return property['$ref'] || ((property['type'] == 'array') && (property['items']['$ref']));
};

function loadRef(file) {
  return YAML.safeLoad(fs.readFileSync(file, 'utf8'));
}
