
const common = {
    port: process.env.PORT || 8000,
    omdbapi_key: 'b381b55a',
};

const envs = {
     production:{
        db: 'mongo',
    },

    development: {
        db: {
            type: 'mongo',
            url: 'mongodb://localhost/movies_test'
        }
    }
};

module.exports = Object.assign({},common, envs[process.env.NODE_ENV || 'development']);