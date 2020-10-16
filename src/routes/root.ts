module.exports = (router) => {

  router.route('/')
    .get((req, res) => res.send('Hello Word'))

  return router;
};
