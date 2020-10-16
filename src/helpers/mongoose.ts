import * as mongoose from 'mongoose';

/**
 * Connect to database
 *
 * Url pattern: mongodb://[username:password@]host1[:port1][,...hostN[:portN]][/[defaultauthdb][?options]]
 *
 * @param mongo_uri Url to connect
 *
 */
export function connect(mongo_uri): Promise<typeof mongoose> {
  return mongoose.connect(mongo_uri, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});
}

export function autoPopulateAllFields(schema) {
  var paths = '';
  schema.eachPath(function process(pathname, schemaType) {
    if (pathname == '_id') return;
    if (schemaType.options.ref)
      paths += ' ' + pathname;
  });

  schema.pre('find', handler);
  schema.pre('findOne', handler);

  function handler(next) {
    this.populate(paths);
    next();
  }
};
