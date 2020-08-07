import * as mongoose from 'mongoose';


export class CrudMongoDb {

  private table : mongoose.Model<mongoose.Document>;


  constructor(table : mongoose.Model<mongoose.Document>) {
    this.table = table;
    
  }

  public create(context, callback) {
    const newEntry = context.req.body;
  
    console.log(`NEW Entry ${JSON.stringify(newEntry)}`);
  
    this.table.create(newEntry, (e,newEntry) => {
      if(e) {
        console.log(e);
        context.res.status(404)
        .set('content-type', 'application/json')        
        .setBody({code: 404, message: e});        
      } else {
        context.res.status(200)
        .set('content-type', 'application/json')        
        .setBody(newEntry);
      }
      callback(null, context.res); 
  
    });
  };
  
  
    // =========
    // Read many
    // =========
    public readMany(context, callback){     
  
      console.log(`Read may`);

      let result = this.table.find({});
  
      /*this.table.find({},(e,result) => {
        if(e) {
          context.res.status(404)
          .set('content-type', 'application/json')        
          .setBody({code: 404, message: e});
        } else {
          context.res.status(200)
          .set('content-type', 'application/json')        
          .setBody(result);      
        }
        callback(null, context.res); 
      });*/
      callback(null, context.res); 
    };
  
    // ========
    // Read one
    // ========
  public readOne(context, callback) {
      const { _id } = context.params.path;
  
      console.log(`Read one ${_id}`);
  
    
      /*this.table.findById(_id, (e,result) => {
        if(e) {
          context.res.status(404)
          .set('content-type', 'application/json')        
          .setBody({code: 404, message: e});  
        } else {
          context.res.status(200)
          .set('content-type', 'application/json')        
          .setBody(result);  
        }
        callback(null, context.res); 
      });*/
    };
    
    // ======
    // Update
    // ======
   public update(context, callback) {
      const changedEntry = context.req.body;
      const { _id } = context.params.path;
  
      console.log(`Update ${_id}\n ${JSON.stringify(changedEntry)}` );
  
      /*this.table.findByIdAndUpdate(_id, changedEntry, (e) => {
        if (e){
          context.res.status(404)
          .set('content-type', 'application/json')        
          .setBody({code: 404, message: e}); 
  
        } else{
          context.res.status(200)
          .set('content-type', 'application/json')
          .setBody(changedEntry);     
        }     
      });*/
      callback(null, {}); 
    };
    
    // ======
    // Remove
    // ======
    public remove(context, callback) {
      const { _id } = context.params.path;
  
      console.log(`Remove ${_id}`);
  
      this.table.remove({ _id: _id}, (e) => {
        if (e){
          context.res.status(404)
          .set('content-type', 'application/json')        
          .setBody({code: 404, message: e}); 
        }else{
          context.res.status(200)
          .set('content-type', 'application/json');      
        }        
      });
      callback(null, context.res); 
    };
}
