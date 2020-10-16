

require('../helpers/utils').walkSync(__dirname).forEach(loc => {
  let extension  = loc.split('.').pop()
  if ( extension === 'ts' || extension === 'js' ){
    require(loc);
  }
});





