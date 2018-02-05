const DB = require('../lib/mongo');
const {MovieAlreadyExistError} = require('../lib/errors');
const {checkObject, checkString,checkId} = require('../lib/checkers');

class MongoQueryBuilder{
    constructor(){
        this.query = {};
        this.sortQuery = null;
    }

    byId(id){
        this.query = {_id: DB.Id(id)};
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


    exec(col){
        const cursor = col.find(this.query);
        if(this.sort) cursor.sort(this.sortQuery);
        return cursor.toArray();
    }

    static isSortValue(val){
        return ~['asc', 'desc'].indexOf(val);
    }
}

module.exports = class MoviesModel{
    static async find({id, search, sort}={}){
        if(id) checkId(id);
        if(search) checkString(search);
        if(sort) checkObject(sort);

        const col = await this.getMoviesCollection();
        const query = new MongoQueryBuilder();
        if(id) query.byId(id);
        else {
            if (search) query.search('Title', search);
            if (sort) query.sort(sort);
        }
        const data = await query.exec(col);
        return this.serialize(data);
    }

    static async findOneByTitle(title){
        checkString(title);

        const col = await this.getMoviesCollection();
        const data = await col.findOne({Title: title});
        return this.serialize(data);
    }

    static async findOneById(id){
        checkId(id);
        const col = await this.getMoviesCollection();
        const data = await col.findOne({_id: new DB.Id(id)});
        return this.serialize(data);
    }

    static async create(data){
        checkObject(data);
        checkString(data.Title);

        const col = await this.getMoviesCollection();
        try{
            const ret = await col.insert(data);
            return DB.getInsertedId(ret);
        }catch(err){
            throw new MovieAlreadyExistError()
        }
    }

    static async getMoviesCollection(){
        const db = await DB.connect();
        return db.collection('movies');
    }

    static serialize(res){
        if (!res) return null;
        if(Array.isArray(res)){
            return res.map(this.serializeItem)
        }
        return this.serializeItem(res);
    }

    static serializeItem(item){
        item.id = item._id;
        delete item._id;
        return item;
    }
};