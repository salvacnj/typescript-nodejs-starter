
const mongoose = require('mongoose');


const exampleSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
  },
  createdAt: {type: Date, default: Date.now},
  updatedAt: {type: Date, default: Date.now}
},
  {
    collection: 'example'
  }
);

module.exports = mongoose.model('example', exampleSchema);
