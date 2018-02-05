
const common = {
    port: process.env.PORT || 8000,
    omdbapi_key: 'b381b55a',
};

const envs = {
    production:{
        db: 'mongo',
        url: process.env.DATABASE_URL
    },

    development: {
        db: {
            type: 'mongo',
            url: 'mongodb://localhost/movies_test'
        }
    }
};

module.exports = Object.assign({},common, getCurrentEnv());

function getCurrentEnv(){
    const envName = process.env.NODE_ENV || 'development';
    return envs[envName];
}