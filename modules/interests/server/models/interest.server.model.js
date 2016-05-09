'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Interest Schema
 */
var InterestSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Interest name',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Interest', InterestSchema);
