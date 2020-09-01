module.exports = app => {
  require('utils-nodejs-scr')
    .walkSync(__dirname)
    .forEach(loc => {
      console.log(loc);
      addRoute(loc, app);
    });
};

function addRoute(location, app) {
  const router = require('express').Router();
  const routeModule = require(location);
  const file = location.substring(location.lastIndexOf('/routes/') + 8);

  var path =
    routeModule.path ||
    '/' + (file !== 'root.js' ? file.replace('.js', '') : '');

  const route = routeModule.config
    ? routeModule.config(router)
    : routeModule(router);

  app.use(`${path}`, route);
  console.log(`${path}`);
}
