'use strict';


/**
 * puts comment into database
 * By calling this operation you can search for movies in the system. 
 *
 * movie String pass an optional movie id to get comments only for specific movie (optional)
 * returns List
 **/
exports.addComment = function(movie) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = [ {
  "movie" : "movie",
  "body" : "body"
}, {
  "movie" : "movie",
  "body" : "body"
} ];
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * adds movies to database
 * Adds movies to database
 *
 * title MovieQuery Movie title to add - more informations will be fetched from OMDB API. (optional)
 * no response value expected for this operation
 **/
exports.addMovie = function(title) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * returns list of comments
 * By calling this operation you can search for movies in the system. 
 *
 * movie String pass an optional movie id to get comments only for specific movie (optional)
 * returns List
 **/
exports.findComments = function(movie) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = [ {
  "movie" : "movie",
  "body" : "body"
}, {
  "movie" : "movie",
  "body" : "body"
} ];
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * searches for movies in database
 * By calling this operation you can search for movies in the system. 
 *
 * id String Pass an optional movie id for looking up for specific movie. (optional)
 * search String This param can be used for searching. All words will be tested against movie title. (optional)
 * limit Integer maximum number of records to return (optional)
 * returns List
 **/
exports.findMovies = function(id,search,limit) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = [ {
  "Year" : 2016.0,
  "Title" : "Widget Adapter",
  "id" : "d290f1ee-6c54-4b01-90e6-d701748f0851"
}, {
  "Year" : 2016.0,
  "Title" : "Widget Adapter",
  "id" : "d290f1ee-6c54-4b01-90e6-d701748f0851"
} ];
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}

