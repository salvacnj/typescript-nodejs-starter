import { CrudMongoDb } from '../crudMongoDB'
import * as mongoose from 'mongoose';


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

export default new CrudMongoDb(mongoose.model('greet'));

exports.create = function e(context){
  console.log("EE");
  
  context.statusCoe
  .set('content-type', 'application/json')        
  .setBody({code: 404, message: e});   

  return context.res;
};

exports.readMany = function e(context, callback){
  console.log("EE");
};

exports.readOne = function e(context, callback){
  console.log("EE");
};

exports.update = function e(context, callback){
  console.log("EE");
};

exports.remove = function e(context, callback){
  console.log("EE");
};


