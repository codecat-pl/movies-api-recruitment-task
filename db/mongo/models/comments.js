const DB = require('../../index');
const {MovieNotFoundError} = require('../../../lib/errors');
const {checkObject, checkString} = require('../../../lib/checkers');
const Movies = require('./movies');
const Serializer = require('./detail/serialize');

module.exports = class CommentsModel{
    static async find(){
        const col = await this.getCollection('comments');
        const comments = await col.find({}).sort({creation_date: -1}).toArray();
        return Serializer.serialize(comments);
    }

    static async findByMovieId(movieId){
        const col = await this.getCollection('comments');
        const comments = await col.find({movie: movieId}).sort({creation_date: -1}).toArray();
        return Serializer.serialize(comments);
    }

    static async create(comment){
        checkObject(comment);
        checkString(comment.body);
        await CommentsModel.checkMovieExistance(comment.movie);
        const col = await this.getCollection('comments');

        comment.creation_date = Date.now();
        const ret = await col.insert(comment);
        comment.id = DB.getInsertedId(ret);
        return Serializer.serialize(comment);
    }

    static async checkMovieExistance(movieId){
        const movie = await Movies.findOneById(movieId);
        if(!movie)
            throw new MovieNotFoundError();
    }

    static async getCollection(name){
        const db = await DB.connect();
        return db.collection(name);
    }
};