/***
 * DEVELOPING NOT FINISHED
 */

import {ExegesisContext} from 'exegesis';
import * as mongoose from 'mongoose';


let mongooseUtils = require('../helpers/mongoose');

export async function create(context: ExegesisContext) {
  let modelName = context.api.operationObject.tags[0];
  let mongoController = new mongooseUtils.CrudMongoDb(mongoose.model(modelName));
  mongoController.create(context.req.body).then(
    result => context.res.setBody(result),
    e => context.res.setBody({code: 404, message: e}),
  );
  return context.res;
}

export async function readMany(context: ExegesisContext) {
  let modelName = context.api.operationObject.tags[0];
  let mongoController = new mongooseUtils.CrudMongoDb(mongoose.model(modelName));
  await mongoController.readMany().then(
    result => context.res.setStatus(200).setBody(result),
    e => context.res.setStatus(404).setBody({code: 404, message: e}),
  );
  return context.res;
}

export async function readOne(context: ExegesisContext) {
  let modelName = context.api.operationObject.tags[0];
  let mongoController = new mongooseUtils.CrudMongoDb(mongoose.model(modelName));
  await mongoController.readOne(context.params.path).then(
    result => context.res.setStatus(200).setBody(result),
    e => context.res.setStatus(404).setBody({code: 404, message: e}),
  );
  return context.res;
}

export async function update(context: ExegesisContext) {
  let modelName = context.api.operationObject.tags[0];
  let mongoController = new mongooseUtils.CrudMongoDb(mongoose.model(modelName));
  await mongoController.update(context.params.path, context.req.body).then(
    result => context.res.setStatus(200).setBody(result),
    e => context.res.setStatus(404).setBody({code: 404, message: e}),
  );
  return context.res;
}

export async function remove(context: ExegesisContext) {
  let modelName = context.api.operationObject.tags[0];
  let mongoController = new mongooseUtils.CrudMongoDb(mongoose.model(modelName));
  await mongoController.remove(context.params.path).then(
    result => context.res.setStatus(200).setBody(result),
    e => context.res.setStatus(404).setBody({code: 404, message: e}),
  );
  return context.res;
}
