'use strict';

/**
 * Module dependencies
 */
var interestsPolicy = require('../policies/interests.server.policy'),
  interests = require('../controllers/interests.server.controller');

module.exports = function(app) {
  // Interests Routes
  app.route('/api/interests').all(interestsPolicy.isAllowed)
    .get(interests.list)
    .post(interests.create);

  app.route('/api/interests/:interestId').all(interestsPolicy.isAllowed)
    .get(interests.read)
    .put(interests.update)
    .delete(interests.delete);

  // Finish by binding the Interest middleware
  app.param('interestId', interests.interestByID);
};
