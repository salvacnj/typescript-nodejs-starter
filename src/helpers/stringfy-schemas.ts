const { map, omit, isPlainObject, isArray, findKey, isString } = require('lodash');

const wrapIfArray = (type, parsedType) => (isArray(type) ? `[${parsedType}]` : parsedType);
const isSchema = val => val.constructor.name === 'Schema';

const stringifySchemas = schemas =>
`{${map(schemas, (schema, schemaName) => {
  const json = JSON.stringify(omit(schema.tree, ['_id', 'id']), (key, value) => {
    if (isPlainObject(value) || (isArray(value) && isSchema(value[0]))) {
      if (isArray(value) || (value.type && !value.type.type && !isString(value.type))) {
        let type = (isArray(value) && value[0]) || (isArray(value.type) ? value.type[0] : value.type);

        if (isSchema(type)) {
          type = wrapIfArray(value.type || value, findKey(  schemas, type)) || 'unnamedSchema';
        } else {
          type = ((isArray(value.type) && value.type[0] && `[${value.type[0].name}]`) || value.type.name).replace('Schema', '');
        }

        return isArray(value) ? type : { ...value, type };
      }
    } else if (key === 'insert_ts' || key === 'update_ts') {
      return 'Date';
    }

    return value;
  });

  return `"${schemaName}": ${json}`;
}).join(',')}}`;

module.exports = stringifySchemas;
