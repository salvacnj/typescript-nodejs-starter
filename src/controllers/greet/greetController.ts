import { CrudMongoDb } from '../crudMongoDB'
import * as mongoose from 'mongoose';
import {ObjectID} from 'mongodb';


import { ExegesisContext, ExegesisResponse  } from 'exegesis'

/**
 * Here a simple function is exported.
 * 
 * If you wanted a class with its own state and functions you will need something like:
 * 
 * class GreetController {
 * 
 * }
 * export default GreetController;
 */

//Export the getGreeting function to be used by the API.
//All controllers will be imported meaning this exported function will be put into scope.
// exports.getGreeting = function getGreeting(context) {
//     const name = context.params.query.name;
//     return {message: `Helse ${name}`};
// }


// exports.createGreeting = function createGreeting(context) {
//     const newEntry = context.req.body;

//   console.log(`NEW Entry ${JSON.stringify(newEntry)}`);
//     return {message: `Nuevo ${JSON.stringify(newEntry)}`};
// } 

let mongoController = new CrudMongoDb(mongoose.model('greet'));

export function create(context : ExegesisContext){
  console.log()
  mongoController.create(context.req.body).then( 
    result => context.res.setStatus(200).setBody(result), 
    e => context.res.setStatus(404).setBody({code: 404, message: e})
  );
   return context.res;
};

export async function readMany(context : ExegesisContext){
  await mongoController.readMany().then( 
    result => context.res.setStatus(200).setBody(result), 
    e => context.res.setStatus(404).setBody({code: 404, message: e})
  );
   return context.res;
};

export async function readOne(context: ExegesisContext){
  await mongoController.readOne(context.params.path).then( 
    result => context.res.setStatus(200).setBody(result), 
    e => context.res.setStatus(404).setBody({code: 404, message: e})
  );
   return context.res;
};

export async function update(context: ExegesisContext){
  await mongoController.update(context.params.path, context.req.body).then( 
    result => context.res.setStatus(200).setBody(result), 
    e => context.res.setStatus(404).setBody({code: 404, message: e})
  );
   return context.res;
};

export async function remove(context: ExegesisContext){
  await mongoController.remove(context.params.path).then( 
    result => context.res.setStatus(200).setBody(result), 
    e => context.res.setStatus(404).setBody({code: 404, message: e})
  );
  return context.res;
};


