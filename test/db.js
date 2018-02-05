const chai = require('chai');
const chaiHttp = require('chai-http');
const nock = require('nock');
const app = require('../app');
const config = require('../config');
const Movies = require('../model/movies');
const Comments = require('../model/comments');
const Tools = require('./detail/tools');
const DB = require('../lib/mongo');

const MongoClient = require('mongodb').MongoClient;


const should = chai.should();
chai.use(chaiHttp);

describe('Data access objects',()=>{
    let db, movies,comments;
    before(async ()=>{
        db = await MongoClient.connect(config.db.url);
        movies = db.collection('movies');
        comments = db.collection('comments');

    });
    beforeEach(async ()=>{
        await movies.remove({});
        await comments.remove({});
    });

    after(()=>{
        db.close();
    });
    describe('Movies', ()=>{
        it('#findOneByTitle() should return null if not exist in db', async ()=>{
            const ret = await Movies.findOneByTitle('NotExistingMovie');
            should.equal(ret, null);
        });

        it('#findOneByTitle() should return object from db', async ()=>{
            await movies.insert({Title: 'The Matrix'});
            const ret = await Movies.findOneByTitle('The Matrix');
            ret.Title.should.be.equal('The Matrix');
        });

        it('#findOneByTitle() should throw if param is not a string', async ()=>{
            const err = await Tools.expectFail(()=>Movies.findOneByTitle(132));
            err.message.should.be.equal("Invalid request: Invalid input data");
        });

        it('#findOneById() should return object from db', async ()=>{
            const a = await movies.insert({Title: 'The Matrix'});
            const ret = await Movies.findOneById(a.insertedIds[0].toString());
            ret.Title.should.be.equal('The Matrix');
        });

        it('#findOneById() should throw if param is not a string', async ()=>{
            const err = await Tools.expectFail(()=>Movies.findOneByTitle(132));
            err.message.should.be.equal("Invalid request: Invalid input data");
        });


        it('#create() should add movie to database', async ()=>{
            await Movies.create({Title: 'The Matrix'});
            const ret = await movies.findOne({Title: 'The Matrix'});
            ret.Title.should.be.equal('The Matrix');
        });

        it('#create() should throw if input is null', async ()=>{
            const err = await Tools.expectFail(()=>Movies.create(null));
            err.message.should.be.equal("Invalid request: Invalid input data");
        });

        it('#create() should throw if object don\'t have title', async ()=>{
            const err = await Tools.expectFail(()=>Movies.create({some: 'data'}));
            err.message.should.be.equal("Invalid request: Invalid input data");
        });

        it('#create() should throw if title already exist', async ()=>{
            await movies.insert({Title: 'The Matrix'});
            const err = await Tools.expectFail(()=>Movies.create({Title: 'The Matrix'}));
            err.message.should.be.equal("Movie already exist!");
        });

        it('#find() should return all elements if no params supplied', async ()=>{
            await movies.insert({Title: 'The Matrix'});
            await movies.insert({Title: 'Back to the Future'});
            const list = await Movies.find();
            list.length.should.equal(2);
        });

        it('#find() should return empty array if nothing in database', async ()=>{
            const list = await Movies.find();
            list.should.be.an('array');
            list.length.should.equal(0);
        });
    });

    describe('Comments', ()=>{
        it('#find() should return empty array if no comments in database', async ()=>{
            const ret = await Comments.find();
            ret.should.be.an('array').that.is.empty;
        });
        it('#find() should return all comments', async ()=>{
            await comments.insert({movie: 'asd', body:"test"});
            await comments.insert({movie: '321', body:"test2"});
            const ret = await Comments.find();
            ret.should.be.an('array');
            ret.length.should.equal(2);
        });

        it('#findByMovieId() should return empty array if movie don\'t have comments', async ()=>{
            await comments.insert({movie: 'asd', body:"test"});
            const ret = await Comments.findByMovieId('qwe');
            ret.should.be.an('array').that.is.empty;
        });

        it('#findByMovieId() should return all comments from specific movie', async ()=>{
            await comments.insert({movie: 'asd', body:"test"});
            await comments.insert({movie: 'qwe', body:"test2"});
            await comments.insert({movie: 'qwe', body:"test3"});
            const ret = await Comments.findByMovieId('qwe');
            ret.should.be.an('array');
            ret.length.should.equal(2);
        });


        it('#create() should throw if input object don\'t have movie property ', async ()=>{
            const err = await Tools.expectFail(()=>Comments.create({body: 'data'}));
            err.message.should.be.equal("Invalid request: Invalid ID type");
        });

        it('#create() should throw if input object don\'t have body property ', async ()=>{
            const err = await Tools.expectFail(()=>Comments.create({movie: new DB.Id()}));
            err.message.should.be.equal("Invalid request: Invalid input data");
        });

        it('#create() should throw if movie is not id', async ()=>{
            const err = await Tools.expectFail(()=>Comments.create({movie: 'asd', body: 'text'}));
            err.message.should.be.equal("Invalid request: Invalid ID type");
        });

        it('#create() should throw if movie not exist', async ()=>{
            const op = await movies.insert({Title: 'The Matrix'});
            const movieId = op.insertedIds[0].toString();
            await movies.remove({});
            const err = await Tools.expectFail(()=>Comments.create({movie: movieId, body: 'text'}));
            err.message.should.be.equal("Movie not found!");
        });

        it('#create() should add object to database', async ()=>{
            const a = await movies.insert({Title: 'The Matrix'});
            const movieId = a.insertedIds[0].toString();
            const ret = await Comments.create({movie: movieId, body: 'text'});
            ret.should.include({movie: movieId, body: 'text'});
        });
    })
});