'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Interest = mongoose.model('Interest'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Interest
 */
exports.create = function(req, res) {
  var interest = new Interest(req.body);
  interest.user = req.user;

  interest.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(interest);
    }
  });
};

/**
 * Show the current Interest
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var interest = req.interest ? req.interest.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  interest.isCurrentUserOwner = req.user && interest.user && interest.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(interest);
};

/**
 * Update a Interest
 */
exports.update = function(req, res) {
  var interest = req.interest ;

  interest = _.extend(interest , req.body);

  interest.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(interest);
    }
  });
};

/**
 * Delete an Interest
 */
exports.delete = function(req, res) {
  var interest = req.interest ;

  interest.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(interest);
    }
  });
};

/**
 * List of Interests
 */
exports.list = function(req, res) { 
  Interest.find().sort('-created').populate('user', 'displayName').exec(function(err, interests) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(interests);
    }
  });
};

/**
 * Interest middleware
 */
exports.interestByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Interest is invalid'
    });
  }

  Interest.findById(id).populate('user', 'displayName').exec(function (err, interest) {
    if (err) {
      return next(err);
    } else if (!interest) {
      return res.status(404).send({
        message: 'No Interest with that identifier has been found'
      });
    }
    req.interest = interest;
    next();
  });
};
