import {ExegesisContext} from 'exegesis';

import * as mongoose from 'mongoose';

export async function listNested(context: ExegesisContext) {
  console.log("HOLAA");
  let model = mongoose.model('Greet');
  return await model.find(context.params.path).populate({});

}
