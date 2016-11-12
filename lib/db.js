var execute = function(db, query){
  var knex = require('knex')(db);
  return knex.raw(query);
}
module.exports = {
  execute: execute
};
