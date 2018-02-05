const {InvalidInputDataError,InvalidIdType} = require('../lib/errors');
const DB = require('./mongo');

exports.checkId = function checkId(val){
    if(!val)
        throw new InvalidIdType();
    try {
        DB.Id(val);
    }catch(err){
        throw new InvalidIdType();
    }
};


exports.checkString = function checkString(str){
    if(!str || typeof str !== 'string' )
        throw new InvalidInputDataError()
};

exports.checkObject = function checkObject(param){
    if(!param || typeof param !== 'object')
        throw new InvalidInputDataError()
};