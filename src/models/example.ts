let mongooseExample = require('mongoose');


const ExampleSchema = new mongooseExample.Schema({
  name: {
    type: String,
    trim: true,
  },
  //user : {type: mongooseExample.Schema.Types.ObjectId, ref: 'User'},
  createdAt: {type: Date, default: Date.now},
  updatedAt: {type: Date, default: Date.now}
},
  {
    collection: 'Example'
  }
);

module.exports = mongooseExample.model('Example', ExampleSchema);
