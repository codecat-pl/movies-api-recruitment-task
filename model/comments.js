const DB = require('../lib/mongo');
const {MovieAlreadyExistError, MovieNotFoundError} = require('../lib/errors');
const {checkObject, checkString, checkId} = require('../lib/checkers');
const Movies = require('./movies');

module.exports = class MoviesModel{
    static async find(){
        const col = await this.getCollection('comments');
        return await col.find({}).sort({creation_date: -1}).toArray();
    }

    static async findByMovieId(movieId){
        const col = await this.getCollection('comments');
        return await col.find({movie: movieId}).sort({creation_date: -1}).toArray();
    }

    static async create(comment){
        checkObject(comment);
        checkString(comment.body);

        const movie = await Movies.findOneById(comment.movie);
        if(!movie)
            throw new MovieNotFoundError();

        comment.creation_date = Date.now()

        const col = await this.getCollection('comments');
        const ret = await col.insert(comment);
        comment.id = DB.getInsertedId(ret);
        return comment;
    }

    static async getCollection(name){
        const db = await DB.connect();
        return db.collection(name);
    }
};