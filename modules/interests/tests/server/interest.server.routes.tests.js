'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Interest = mongoose.model('Interest'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, interest;

/**
 * Interest routes tests
 */
describe('Interest CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Interest
    user.save(function () {
      interest = {
        name: 'Interest name'
      };

      done();
    });
  });

  it('should be able to save a Interest if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Interest
        agent.post('/api/interests')
          .send(interest)
          .expect(200)
          .end(function (interestSaveErr, interestSaveRes) {
            // Handle Interest save error
            if (interestSaveErr) {
              return done(interestSaveErr);
            }

            // Get a list of Interests
            agent.get('/api/interests')
              .end(function (interestsGetErr, interestsGetRes) {
                // Handle Interest save error
                if (interestsGetErr) {
                  return done(interestsGetErr);
                }

                // Get Interests list
                var interests = interestsGetRes.body;

                // Set assertions
                (interests[0].user._id).should.equal(userId);
                (interests[0].name).should.match('Interest name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Interest if not logged in', function (done) {
    agent.post('/api/interests')
      .send(interest)
      .expect(403)
      .end(function (interestSaveErr, interestSaveRes) {
        // Call the assertion callback
        done(interestSaveErr);
      });
  });

  it('should not be able to save an Interest if no name is provided', function (done) {
    // Invalidate name field
    interest.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Interest
        agent.post('/api/interests')
          .send(interest)
          .expect(400)
          .end(function (interestSaveErr, interestSaveRes) {
            // Set message assertion
            (interestSaveRes.body.message).should.match('Please fill Interest name');

            // Handle Interest save error
            done(interestSaveErr);
          });
      });
  });

  it('should be able to update an Interest if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Interest
        agent.post('/api/interests')
          .send(interest)
          .expect(200)
          .end(function (interestSaveErr, interestSaveRes) {
            // Handle Interest save error
            if (interestSaveErr) {
              return done(interestSaveErr);
            }

            // Update Interest name
            interest.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Interest
            agent.put('/api/interests/' + interestSaveRes.body._id)
              .send(interest)
              .expect(200)
              .end(function (interestUpdateErr, interestUpdateRes) {
                // Handle Interest update error
                if (interestUpdateErr) {
                  return done(interestUpdateErr);
                }

                // Set assertions
                (interestUpdateRes.body._id).should.equal(interestSaveRes.body._id);
                (interestUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Interests if not signed in', function (done) {
    // Create new Interest model instance
    var interestObj = new Interest(interest);

    // Save the interest
    interestObj.save(function () {
      // Request Interests
      request(app).get('/api/interests')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Interest if not signed in', function (done) {
    // Create new Interest model instance
    var interestObj = new Interest(interest);

    // Save the Interest
    interestObj.save(function () {
      request(app).get('/api/interests/' + interestObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', interest.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Interest with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/interests/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Interest is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Interest which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Interest
    request(app).get('/api/interests/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Interest with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Interest if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Interest
        agent.post('/api/interests')
          .send(interest)
          .expect(200)
          .end(function (interestSaveErr, interestSaveRes) {
            // Handle Interest save error
            if (interestSaveErr) {
              return done(interestSaveErr);
            }

            // Delete an existing Interest
            agent.delete('/api/interests/' + interestSaveRes.body._id)
              .send(interest)
              .expect(200)
              .end(function (interestDeleteErr, interestDeleteRes) {
                // Handle interest error error
                if (interestDeleteErr) {
                  return done(interestDeleteErr);
                }

                // Set assertions
                (interestDeleteRes.body._id).should.equal(interestSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Interest if not signed in', function (done) {
    // Set Interest user
    interest.user = user;

    // Create new Interest model instance
    var interestObj = new Interest(interest);

    // Save the Interest
    interestObj.save(function () {
      // Try deleting Interest
      request(app).delete('/api/interests/' + interestObj._id)
        .expect(403)
        .end(function (interestDeleteErr, interestDeleteRes) {
          // Set message assertion
          (interestDeleteRes.body.message).should.match('User is not authorized');

          // Handle Interest error error
          done(interestDeleteErr);
        });

    });
  });

  it('should be able to get a single Interest that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Interest
          agent.post('/api/interests')
            .send(interest)
            .expect(200)
            .end(function (interestSaveErr, interestSaveRes) {
              // Handle Interest save error
              if (interestSaveErr) {
                return done(interestSaveErr);
              }

              // Set assertions on new Interest
              (interestSaveRes.body.name).should.equal(interest.name);
              should.exist(interestSaveRes.body.user);
              should.equal(interestSaveRes.body.user._id, orphanId);

              // force the Interest to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Interest
                    agent.get('/api/interests/' + interestSaveRes.body._id)
                      .expect(200)
                      .end(function (interestInfoErr, interestInfoRes) {
                        // Handle Interest error
                        if (interestInfoErr) {
                          return done(interestInfoErr);
                        }

                        // Set assertions
                        (interestInfoRes.body._id).should.equal(interestSaveRes.body._id);
                        (interestInfoRes.body.name).should.equal(interest.name);
                        should.equal(interestInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Interest.remove().exec(done);
    });
  });
});
