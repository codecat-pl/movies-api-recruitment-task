const DB = require('../../index');
const {MovieAlreadyExistError} = require('../../../lib/errors');
const {checkObject, checkString,checkId} = require('../../../lib/checkers');
const MongoQueryBuilder = require('../query_builder');
const Serializer = require('./detail/serialize');


module.exports = class MoviesModel{
    static async find(opts){
        const col = await this.getMoviesCollection();
        const query = new MongoQueryBuilder();
        query.configure(opts);
        const data = await query.exec(col);
        return Serializer.serialize(data);
    }

    static async findOneByTitle(title){
        checkString(title);

        const col = await this.getMoviesCollection();
        const data = await col.findOne({Title: title});
        return Serializer.serialize(data);
    }

    static async findOneById(id){
        checkId(id);
        const col = await this.getMoviesCollection();
        const data = await col.findOne({_id: new DB.Id(id)});
        return Serializer.serialize(data);
    }

    static async create(data){
        checkObject(data);
        checkString(data.Title);

        const col = await this.getMoviesCollection();
        try{
            const ret = await col.insert(data);
            data.id = DB.getInsertedId(ret);
            return Serializer.serialize(data);
        }catch(err){
            throw new MovieAlreadyExistError()
        }
    }

    static async getMoviesCollection(){
        const db = await DB.connect();
        return db.collection('movies');
    }
};