const DB = require('../lib/mongo');
const {MovieAlreadyExistError} = require('../lib/errors');
const {checkObject, checkString,checkId} = require('../lib/checkers');

module.exports = class MoviesModel{
    static async find(){
        const col = await this.getMoviesCollection();
        const data = await col.find({}).toArray();
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
            await col.insert(data);
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