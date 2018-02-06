const ObjectID = require('mongodb').ObjectID;
const {checkObject, checkString, checkId} = require('../../lib/checkers');

module.exports = class MongoQueryBuilder{
    constructor(){
        this.query = {};
        this.sortQuery = null;
    }

    byId(id){
        this.query = {_id: ObjectID(id)};
    }

    search(field, query){
        if(!this.query['$and']){
            this.query['$and'] = [];
        }
        query.split(' ').map(word=>({
            [field]: {
                "$regex": ".*"+word+".*",
                '$options' : 'i'
            }
        })).forEach(exp=>{
            this.query['$and'].push(exp);
        })
    }

    sort(query) {
        this.sortQuery = {};
        Object.keys(query).forEach(key=>{
            if(this.constructor.isSortValue(query[key])){
                this.sortQuery[key] = query[key]==='asc'?1:-1;
            }
        })
    }

    configure(config){
        const {id, search, sort} = this.checkConfig(config);
        if(id) this.byId(id);
        else {
            if (search) this.search('Title', search);
            if (sort) this.sort(sort);
        }
    }

    checkConfig({id, search, sort}={}){
        if(id) checkId(id);
        if(search) checkString(search);
        if(sort) checkObject(sort);
        return {id, search, sort};
    }

    exec(col){
        const cursor = col.find(this.query);
        if(this.sort) cursor.sort(this.sortQuery);
        return cursor.toArray();
    }

    static isSortValue(val){
        return ~['asc', 'desc'].indexOf(val);
    }
}
