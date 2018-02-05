'use strict';

var utils = require('../utils/writer.js');
var Public = require('../service/PublicService');

module.exports.addComment = function addComment (req, res, next) {
  var movie = req.swagger.params['Movie'].value;
  Public.addComment(movie)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.addMovie = function addMovie (req, res, next) {
  var title = req.swagger.params['Title'].value;
  Public.addMovie(title)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.findComments = function findComments (req, res, next) {
  var movie = req.swagger.params['Movie'].value;
  Public.findComments(movie)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.findMovies = function findMovies (req, res, next) {
  var id = req.swagger.params['id'].value;
  var search = req.swagger.params['search'].value;
  var limit = req.swagger.params['limit'].value;
  Public.findMovies(id,search,limit)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
