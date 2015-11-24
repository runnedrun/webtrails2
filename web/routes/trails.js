var db   = require('../models')
var _ = require('lodash');

exports.index = function(req, res) {
    var limit = req.query.limit || 20;
    db.Trail.findAll({where: {UserId: req.user.id}, limit: limit, order: ['createdAt']}).then(function(trails) {
      res.send({trails: trails}, 200);
    })
}

exports.new = function(req, res) {  
  db.Trail.create(_.extend(req.body.trail, { UserId: req.user.id })).then(function(trail) {      
    res.send({ trail: trail }, 200)        
  })
}

function TrailMissingException() {}
exports.update = function(req, res) {
    db.Trail.find({where: {id: req.body.id}})
    .then(function(trail) {
        if(trail) {
            return trail.updateAttributes(req.body)
        } else {
            res.send(404)
            throw TrailMissingException
        }
    })
    .then(function(trail) {
        res.send({trail: trail}, 200);
    })
}

exports.delete = function(req, res) {
  db.Trail.find({where: {id: req.body.id}})
  .then(function(trail) {
      if(trail) {
          return trail.destroy()
      } else {
          res.send(404)
          throw TrailMissingException
      }
  })
  .then(function(trail) {
      res.send(200)
  })
}