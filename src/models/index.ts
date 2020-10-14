
// module.exports = () => {
//   require('../helpers/uitls').walkSync(__dirname).forEach(loc => {
//     var x = require(loc);
//     console.log(x);
//   });
// };


require('../helpers/uitls').walkSync(__dirname).forEach(loc => {
  require(loc);
});





