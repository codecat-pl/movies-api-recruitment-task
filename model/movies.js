const DB = require('../lib/mongo');
const {MovieAlreadyExistError} = require('../lib/errors');
const {checkObject, checkString} = require('../lib/checkers');

module.exports = class Movies{
    static async find(){
        const col = await this.getMoviesCollection();
        return col.find({}).toArray();
    }

    static async findOneByTitle(title){
        checkString(title);

        const col = await this.getMoviesCollection();
        return col.findOne({Title: title});
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
};