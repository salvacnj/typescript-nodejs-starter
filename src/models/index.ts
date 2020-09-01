module.exports = () => {
  require('utils-nodejs-scr').walkSync(__dirname).forEach(loc => {
    require(loc);
  });
};
