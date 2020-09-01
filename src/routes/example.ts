// /routes/example.js
module.exports = {
  path: __filename.substring(
    __filename.lastIndexOf('/routes/') + 8,
    __filename.lastIndexOf('.js'),
  ),
  config: router => {
    var exampleCtrl = require('../controllers/example');
    var mongoose = require('mongoose');
    var exampleModel = mongoose.model('example');

    var router = require('../controllers/crud')(exampleModel);

    router.route('/').post(exampleCtrl.example);

    return router;
  },
};
