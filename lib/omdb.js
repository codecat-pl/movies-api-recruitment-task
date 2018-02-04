const request = require('request-promise-native');
const config = require('../config');
const {MovieNotFoundError} = require('../lib/errors');
const {checkString} = require('../lib/checkers');

module.exports = {
    async findMovie(title){
        checkString(title);

        const data = await request.get({
            url: 'http://www.omdbapi.com/',
            qs:{
                t: title,
                apikey: config.omdbapi_key
            },
            json: true
        });

        if(data.Error)
            throw new MovieNotFoundError();

        return data;
    }
};