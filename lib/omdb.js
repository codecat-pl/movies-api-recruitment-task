const request = require('request-promise-native');
const config = require('../config');

module.exports = {
    findMovie(title){
        return request.get({
            url: 'http://www.omdbapi.com/',
            qs:{
                t: title,
                apikey: config.omdbapi_key
            },
            json: true
        });
    }
};