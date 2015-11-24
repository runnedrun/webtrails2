var db   = require('../models')
var _ = require('lodash');

exports.index = function(req, res) {
    var limit = req.query.limit || 20;
    db.Note.findAll({where: {UserId: req.user.id, deleted: false}, limit: limit, order: ['createdAt']}).then(function(notes) {
      res.send({notes: notes}, 200);
    })
}

exports.new = function(req, res) {  
  db.Trail.findOne({ where: { name: req.body.name } }).then(function(trail) {
    // the trail exists already, add the note
    if (trail) {

    }
  })
  
  function createNote(trailId) {
    db.Note.create(_.extend(req.body.note, { UserId: req.user.id })).then(function(note) {      
      res.send({ note: note, id: note.id }, 200)        
    })
  }
}

function NoteMissingException() {}
exports.update = function(req, res) {
    db.Note.find({where: {id: req.body.id}})
    .then(function(note) {
        if(note) {
            return note.updateAttributes(req.body)
        } else {
            res.send(404)
            throw NoteMissingException
        }
    })
    .then(function(note) {
        res.send({note: note}, 200);
    })
}

exports.delete = function(req, res) {
  db.Note.find({where: {id: req.body.id}})
  .then(function(note) {
      if(note) {
          return note.updateAttributes({deleted: true})
      } else {
          res.send(404)
        throw NoteMissingException
      }
  })
  .then(function(note) {
      res.send(200)
  })
}