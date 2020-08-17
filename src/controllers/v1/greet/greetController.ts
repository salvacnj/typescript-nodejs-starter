import {ExegesisContext} from 'exegesis';
import * as mongoose from 'mongoose';
let utils = require('utils-nodejs-scr');

let mongoController = new utils.mongoose.CrudMongoDb(mongoose.model('greet'));

export function create(context: ExegesisContext) {
  mongoController.create(context.req.body).then(
    result => context.res.setStatus(200).setBody(result),
    e => context.res.setStatus(404).setBody({code: 404, message: e}),
  );
  return context.res;
}

export async function readMany(context: ExegesisContext) {
  await mongoController.readMany().then(
    result => context.res.setStatus(200).setBody(result),
    e => context.res.setStatus(404).setBody({code: 404, message: e}),
  );
  return context.res;
}

export async function readOne(context: ExegesisContext) {
  await mongoController.readOne(context.params.path).then(
    result => context.res.setStatus(200).setBody(result),
    e => context.res.setStatus(404).setBody({code: 404, message: e}),
  );
  return context.res;
}

export async function update(context: ExegesisContext) {
  await mongoController.update(context.params.path, context.req.body).then(
    result => context.res.setStatus(200).setBody(result),
    e => context.res.setStatus(404).setBody({code: 404, message: e}),
  );
  return context.res;
}

export async function remove(context: ExegesisContext) {
  await mongoController.remove(context.params.path).then(
    result => context.res.setStatus(200).setBody(result),
    e => context.res.setStatus(404).setBody({code: 404, message: e}),
  );
  return context.res;
}
