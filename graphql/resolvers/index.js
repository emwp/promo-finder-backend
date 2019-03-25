const authResolver = require('./auth');
const promosResolver = require('./promos');

const rootResolver = {
  ...authResolver,
  ...promosResolver,
};

module.exports = rootResolver;
