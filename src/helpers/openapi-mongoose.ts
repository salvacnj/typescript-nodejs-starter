/**
 * Use to convert the open api models to mongoose models
 */

'use strict';
import * as fs from 'fs';
import * as YAML from 'js-yaml';
import * as _ from 'lodash';
import * as mongoose from 'mongoose';
import * as path from 'path';

var Schema = mongoose.Schema;

//var encrypt = require('mongoose-encryption');
var allowedTypes = ['number', 'integer', 'string', 'boolean'];
var allowedFormats = ['number', 'integer', 'long', 'float', 'double', 'string', 'password', 'boolean', 'date', 'dateTime', 'array'];
var schemasOpenApi = null;

const v2MongooseProperty = 'x-openapi-mongoose';

var xOpenapiMongoose = {
  schemaOptions: {},
  additionalProperties: {},
  excludeSchema: {},
  documentIndex: {},
};

export function compile(file) {
  let refFile = isPropertyHasRef(file.components.schemas);
  (refFile ? schemasOpenApi = loadFile(refFile) : schemasOpenApi = file.components.schemas)

  if (file.components[v2MongooseProperty]) {
    processMongooseDefinition(v2MongooseProperty, file.components[v2MongooseProperty]);
  }

  let schemas = {};

  _.forEach(schemasOpenApi, function (schemaOpenApi, modelName) {
    var object;
    var options = xOpenapiMongoose.schemaOptions;
    var excludedSchema = xOpenapiMongoose.excludeSchema;
    var documentIndex = xOpenapiMongoose.documentIndex[modelName];

    if (schemaOpenApi[v2MongooseProperty]) {
      processMongooseDefinition(modelName, schemaOpenApi[v2MongooseProperty]);
    }

    if (excludedSchema[modelName]) {
      return;
    }

    // If model has been registered skip
    try {
      if (mongoose.model(modelName)) {
        return;
      }
    } catch (error) {
    }

    object = getSchema(modelName, schemaOpenApi.properties);

    if (options) {
      options = _.extend({}, options[v2MongooseProperty], options[modelName]);
    }

    if (typeof excludedSchema === 'object') {
      excludedSchema = excludedSchema[v2MongooseProperty] || excludedSchema[modelName];
    }

    if (object && !excludedSchema) {
      var additionalProperties = _.extend({}, xOpenapiMongoose.additionalProperties[v2MongooseProperty], xOpenapiMongoose.additionalProperties[modelName]);
      additionalProperties = processAdditionalProperties(additionalProperties, modelName)
      object = _.extend(object, additionalProperties);
      var schema = new mongoose.Schema(object, options);

      if (JSON.stringify(object).includes('autopopulate')) {
        schema.plugin(require('mongoose-autopopulate'));
      }

      processDocumentIndex(schema, documentIndex);
      schemas[modelName] = schema
    }
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
  /*
    switch (property.type) {
    case 'number':
      switch (property.format) {
        case 'float':
        case 'double':
          return Number;
        default:
          throw new Error('Unrecognised schema format: ' + property.format);
      }
    case 'integer':
      switch (property.format) {
        case 'int32':
        case 'int64':
          return Number;
        default:
          throw new Error('Unrecognised schema format: ' + property.format);
      }
    case 'string':
      switch (property.format) {
        case undefined:
        case 'byte':
        case 'password':
        case 'binary':
          return String;
        case 'date':
        case 'date-time':
          return Date;
        default:
          throw new Error('Unrecognised schema format: ' + property.format);
      }
    case 'boolean':
      return Boolean;
    default:
      throw new Error('Unrecognized schema type: ' + property.type);
  }*/
};


var processDocumentIndex = function (schema, index) {
  //TODO: check indicies are numbers
  var isUniqueIndex = false;
  if (_.isEmpty(index)) {
    return;
  }
  if (index.unique) {
    isUniqueIndex = true;
  }
  delete index.unique;
  if (isUniqueIndex) {
    schema.index(index, {unique: true})
  } else {
    schema.index(index)
  }
};

var getSchema = function (objectName, fullObject) {
  var props = {};
  var required = fullObject.required || [];
  var object = fullObject['properties'] ? fullObject['properties'] : fullObject;

  _.forEach(object, function (property, key) {
    var schemaProperty = getSchemaProperty(property, key, required, objectName, object);
    props = _.extend(props, schemaProperty);
  });

  return props;
};


var isPropertyHasRef = function (property) {
  return property['$ref'] || ((property['type'] == 'array') && (property['items']['$ref']));
};

function loadFile(file) {
  return YAML.safeLoad(fs.readFileSync(file, 'utf8'));
}

var isAllowedType = function (type) {
  return allowedTypes.indexOf(type) != -1;
};

var isSimpleSchema = function (schema) {
  return schema.type && isAllowedType(schema.type);
};

var processMongooseDefinition = function (modelName, customOptions) {
  if (customOptions) {
    if (customOptions['schema-options']) {
      xOpenapiMongoose.schemaOptions[modelName] = customOptions['schema-options'];
    }
    if (customOptions['exclude-schema']) {
      xOpenapiMongoose.excludeSchema[modelName] = customOptions['exclude-schema'];
    }
    if (customOptions['additional-properties']) {
      xOpenapiMongoose.additionalProperties[modelName] = customOptions['additional-properties'];
    }
    if (customOptions['index']) {
      xOpenapiMongoose.documentIndex[modelName] = customOptions['index'];
    }
  }
};

var isMongodbReserved = function (fieldKey) {
  return fieldKey === '_id' || fieldKey === '__v';
};

var isMongooseProperty = function (property) {
  return !!property[v2MongooseProperty];
};

var isMongooseArray = function (property) {
  return property.items && property.items[v2MongooseProperty];
};

var processAdditionalProperties = function (additionalProperties, objectName) {
  var props = {};

  _.each(additionalProperties, function (property, key) {
    var modifiedProperty = {};
    modifiedProperty[v2MongooseProperty] = property;
    props = _.extend(props, getSchemaProperty(modifiedProperty, key, property.required, objectName, null));
  });
  return props;
};


var getSchemaProperty = function (property, key, required, objectName, object) {
  var props = {};
  if (isMongodbReserved(key) === true) {
    return;
  }

  console.log(property);

  if (isMongooseProperty(property)) {
    props[key] = getMongooseSpecific(props, property);
  }
  else if (isMongooseArray(property)) {
    props[key] = [getMongooseSpecific(props, property)];
  }
  else if (isPropertyHasRef(property)) {
    props[key] = processRef(property, objectName, props, key, required);
  }
  else if (property.type !== 'object') {
    var type = propertyMap(property);
    if (property.enum && _.isArray(property.enum)) {
      props[key] = {type: type, enum: property.enum};
    } else {
      props[key] = {type: type};
    }

    if (property['uniqueItems'] === true) {
      props[key] = Object.assign(props[key], {unique: true});
    }

    if (Number(property['maxLength'])) {
      props[key] = Object.assign(props[key], {maxlength: property['maxLength']});
    }

    if (Number(property['minLength'])) {
      props[key] = Object.assign(props[key], {minlength: property['minLength']});
    }
  }
  else if (property.type === 'object') {
    props[key] = getSchema(key, property);
  }
  else if (isSimpleSchema(object)) {
    props = {type: propertyMap(object)};
  }

  if (required) {
    fillRequired(props, key, required);
  }

  return props;
};

var fillRequired = function (object, key, template) {
  if (template && Array.isArray(template) && template.indexOf(key) >= 0) {
    object[key].required = true;
  } else if (typeof template === 'boolean') {
    object[key].required = template;
  }
};

var getMongooseSpecific = function (props, property) {
  var mongooseSpecific = property[v2MongooseProperty];
  var ref = (mongooseSpecific) ? mongooseSpecific.$ref : property.$ref;

  if (!mongooseSpecific && isMongooseArray(property)) {
    mongooseSpecific = property.items[v2MongooseProperty];
    ref = mongooseSpecific.$ref;
  }

  if (!mongooseSpecific) {
    return props;
  }

  var ret = {};
  if (ref) {
    ret = {
      type: Schema.Types.ObjectId,
      ref: ref.replace('#/components/schemas/', ''),
      autopopulate: true
    }
  } else {
    ret = _.extend(ret, property, mongooseSpecific);
    delete ret[v2MongooseProperty];
    if (isSimpleSchema(ret)) {
      ret['type'] = propertyMap(ret);
    }
  }
  return ret;
};



var processRef = function (property, objectName, props, key, required) {
  var refRegExp = /^#\/components\/schemas\/(\w*)$/;
  var refString = property['$ref'] ? property['$ref'] : property['items']['$ref'];
  var propType = refString.match(refRegExp)[1];


  if (propType && propType === objectName) { // circular reference
    return {type: Schema.Types.ObjectId, ref: propType, autopopulate: true};
  }

  if (property['type'] && property['type'] === 'string') { // Reference by Id
    return {type: Schema.Types.ObjectId, ref: propType, autopopulate: true};
  }

  // NOT circular reference
  var object = schemasOpenApi[propType];
  if (~['array', 'object'].indexOf(object.type)) {
    var schema = getSchema(propType, object['properties'] ? object['properties'] : object);
    return property['items'] || object.type === 'array' ? [schema] : schema;
  } else {
    var clone = _.extend({}, object);
    delete clone[v2MongooseProperty];
    var schemaProp = getSchemaProperty(clone, key, null, null, null);
    return property['items'] ? [schemaProp] : schemaProp;
  }

  fillRequired(props, key, required);
};




