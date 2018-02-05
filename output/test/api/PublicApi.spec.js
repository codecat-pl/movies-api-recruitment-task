/**
 * MoviesAPI
 * This is a simple API for recruitment purposes
 *
 * OpenAPI spec version: 1.0.0
 * Contact: mateusz@russak.biz
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD.
    define(['expect.js', '../../src/index'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    factory(require('expect.js'), require('../../src/index'));
  } else {
    // Browser globals (root is window)
    factory(root.expect, root.MoviesApi);
  }
}(this, function(expect, MoviesApi) {
  'use strict';

  var instance;

  beforeEach(function() {
    instance = new MoviesApi.PublicApi();
  });

  var getProperty = function(object, getter, property) {
    // Use getter method if present; otherwise, get the property directly.
    if (typeof object[getter] === 'function')
      return object[getter]();
    else
      return object[property];
  }

  var setProperty = function(object, setter, property, value) {
    // Use setter method if present; otherwise, set the property directly.
    if (typeof object[setter] === 'function')
      object[setter](value);
    else
      object[property] = value;
  }

  describe('PublicApi', function() {
    describe('addComment', function() {
      it('should call addComment successfully', function(done) {
        //uncomment below and update the code to test addComment
        //instance.addComment(function(error) {
        //  if (error) throw error;
        //expect().to.be();
        //});
        done();
      });
    });
    describe('addMovie', function() {
      it('should call addMovie successfully', function(done) {
        //uncomment below and update the code to test addMovie
        //instance.addMovie(function(error) {
        //  if (error) throw error;
        //expect().to.be();
        //});
        done();
      });
    });
    describe('findComments', function() {
      it('should call findComments successfully', function(done) {
        //uncomment below and update the code to test findComments
        //instance.findComments(function(error) {
        //  if (error) throw error;
        //expect().to.be();
        //});
        done();
      });
    });
    describe('findMovies', function() {
      it('should call findMovies successfully', function(done) {
        //uncomment below and update the code to test findMovies
        //instance.findMovies(function(error) {
        //  if (error) throw error;
        //expect().to.be();
        //});
        done();
      });
    });
  });

}));
