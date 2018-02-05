/**
 * MoviesAPI - recruitment task
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
    factory(root.expect, root.MoviesApiRecruitmentTask);
  }
}(this, function(expect, MoviesApiRecruitmentTask) {
  'use strict';

  var instance;

  beforeEach(function() {
    instance = new MoviesApiRecruitmentTask.Movie();
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

  describe('Movie', function() {
    it('should create an instance of Movie', function() {
      // uncomment below and update the code to test Movie
      //var instane = new MoviesApiRecruitmentTask.Movie();
      //expect(instance).to.be.a(MoviesApiRecruitmentTask.Movie);
    });

    it('should have the property id (base name: "id")', function() {
      // uncomment below and update the code to test the property id
      //var instane = new MoviesApiRecruitmentTask.Movie();
      //expect(instance).to.be();
    });

    it('should have the property title (base name: "Title")', function() {
      // uncomment below and update the code to test the property title
      //var instane = new MoviesApiRecruitmentTask.Movie();
      //expect(instance).to.be();
    });

    it('should have the property year (base name: "Year")', function() {
      // uncomment below and update the code to test the property year
      //var instane = new MoviesApiRecruitmentTask.Movie();
      //expect(instance).to.be();
    });

  });

}));