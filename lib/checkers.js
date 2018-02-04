
exports.checkString = function checkString(str){
    if(!str || typeof str !== 'string' )
        throw new InvalidInputDataError()
};

exports.checkObject = function checkObject(param){
    if(!param || typeof param !== 'object')
        throw new InvalidInputDataError()
}

const {InvalidInputDataError} = require('../lib/errors');