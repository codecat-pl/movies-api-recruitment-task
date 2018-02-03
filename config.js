


module.exports = {
    port: process.env.PORT || 8000,
    omdbapi_key: 'b381b55a',

    production:{
        db: 'mongo',
    },

    test: {
        db: 'mongo',
        url: 'mongodb://localhost/movies_test'
    }
};