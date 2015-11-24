var db   = require('../models')
var _ = require('lodash');


exports.new = function(req, res) {      
  if (req.body.trailName) {
    db.Trail.find({where: { "name": req.body.trailName } }).then(function(trail) {
      if (trail) {
        createSession(trail.id);        
      } else {      
        db.Trail.create({ name: req.trailName }).then(function(trail) {
          createSession(trail.id);
        })
      }
    })    
  } else {
    res.send(400)
  }

  function createSession(trailId) {
    db.Session.create(_.extend(req.body.session, { UserId: req.user.id, TrailId: trailId })).then(function(session) {      
      res.send({ sessionId: session.id }, 200);
    })
  }
}

function SessionMissingException() {}
exports.update = function(req, res) {
    db.session.find({where: {id: req.body.id}})
    .then(function(session) {
        if(session) {
            return Session.updateAttributes(req.body)
        } else {
            res.send(404)
            throw SessionMissingException
        }
    })
    .then(function(session) {
        res.send({session: session}, 200);
    })
}

exports.delete = function(req, res) {
  db.session.find({where: {id: req.body.id}})
  .then(function(session) {
      if(session) {
          return session.destroy()
      } else {
          res.send(404)
          throw SessionMissingException
      }
  })
  .then(function(session) {
      res.send(200)
  })
}