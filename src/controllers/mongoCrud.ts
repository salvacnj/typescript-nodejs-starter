/***
 * DEVELOPING NOT FINISHED
 */

import {ExegesisContext, Callback} from 'exegesis';
import * as mongoose from 'mongoose';


export function create(context: ExegesisContext, callback : Callback<any>) {
  let model = mongoose.model(context.api.operationObject['x-exegesis-collectionName']);
  model.create(context.req.body,(err,data) =>{callback(err,data)});
}

export function readMany(context: ExegesisContext) {
  let model = mongoose.model(context.api.operationObject['x-exegesis-collectionName']);
  return model.find();
}

export function readOne(context: ExegesisContext) {
  let model = mongoose.model(context.api.operationObject['x-exegesis-collectionName']);
  return model.find(context.params.path);
}

export function update(context: ExegesisContext) {
  let model = mongoose.model(context.api.operationObject['x-exegesis-collectionName']);
  return model.update(context.params.path, context.req.body, {upsert: true});
}

export function remove(context: ExegesisContext) {
  let model = mongoose.model(context.api.operationObject['x-exegesis-collectionName']);
  return model.remove(context.params.path);
}
