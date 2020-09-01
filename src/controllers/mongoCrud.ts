/***
 * DEVELOPING NOT FINISHED
 */

import {ExegesisContext} from 'exegesis';
import * as mongoose from 'mongoose';

let utils = require('utils-nodejs-scr');

export class MongoCrud {

  mongoController;

  /**
   *
   * @param collection collention name in singular
   */

  constructor(collection: string) {
    this.mongoController = new utils.mongoose.CrudMongoDb(mongoose.model(collection));
  }

  public async create(context: ExegesisContext) {
    this.mongoController.create(context.req.body).then(
      result => context.res.setBody(result),
      e => context.res.setBody({code: 404, message: e}),
    );
    return context.res;
  }

  public async readMany(context: ExegesisContext) {
    await this.mongoController.readMany().then(
      result => context.res.setStatus(200).setBody(result),
      e => context.res.setStatus(404).setBody({code: 404, message: e}),
    );
    return context.res;
  }

  public async readOne(context: ExegesisContext) {
    await this.mongoController.readOne(context.params.path).then(
      result => context.res.setStatus(200).setBody(result),
      e => context.res.setStatus(404).setBody({code: 404, message: e}),
    );
    return context.res;
  }

  public async update(context: ExegesisContext) {
    await this.mongoController.update(context.params.path, context.req.body).then(
      result => context.res.setStatus(200).setBody(result),
      e => context.res.setStatus(404).setBody({code: 404, message: e}),
    );
    return context.res;
  }

  public async remove(context: ExegesisContext) {
    await this.mongoController.remove(context.params.path).then(
      result => context.res.setStatus(200).setBody(result),
      e => context.res.setStatus(404).setBody({code: 404, message: e}),
    );
    return context.res;
  }

}
