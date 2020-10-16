
export function loadRoutes(app) {
  require('../helpers/utils').walkSync(__dirname).forEach(loc => {
    let extension = loc.split('.').pop();
    if (extension === 'ts' || extension === 'js') {
      addRoute(loc, app);
    }
  });
};

function addRoute(location, app) {
  const router = require("express").Router();
  const routeModule = require(location);
  const file = location.substring(location.lastIndexOf("/routes/") + 8);

  var path = routeModule.path || "/" + (file !== "root.ts" ? file.replace(".ts", "") : "");

  // TODO: Insertar version
  // const version = routeModule.version || 'v0';
  // var pos = path.lastIndexOf("/");
  // path = path.slice(0, pos) + '/' + version + path.slice(pos);

  const route = routeModule.config ? routeModule.config(router) : routeModule(router);

  app.use(`${path}`, route);
  console.log(`${path}`);

}
