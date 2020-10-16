/***
 * DEVELOPING NOT FINISHED
 */

import {ExegesisContext} from 'exegesis';
import * as mongoose from 'mongoose';


export async function create(context: ExegesisContext) {
  let model = mongoose.model(context.api.operationObject.tags[0]);
  return await model.create(context.req.body);
}

export async function readMany(context: ExegesisContext) {
  let model = mongoose.model(context.api.operationObject.tags[0]);
  return await model.find();
}

export async function readOne(context: ExegesisContext) {
  let model = mongoose.model(context.api.operationObject.tags[0]);
  return await model.find(context.params.path);
}

export async function update(context: ExegesisContext) {
  let model = mongoose.model(context.api.operationObject.tags[0]);
  return await model.update(context.params.path, context.req.body, {upsert: true})['ok'];
}

export async function remove(context: ExegesisContext) {
  let model = mongoose.model(context.api.operationObject.tags[0]);
  return await model.remove(context.params.path)['ok'];
}
