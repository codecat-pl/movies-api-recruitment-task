const chai = require('chai');
const chaiHttp = require('chai-http');
const nock = require('nock');
const app = require('../app');
const config = require('../config');
const Movies = require('../model/movies');
const Tools = require('./detail/tools');

const MongoClient = require('mongodb').MongoClient;


const should = chai.should();
chai.use(chaiHttp);


describe('Movies', ()=>{
    let db, movies;
    before(async ()=>{
        db = await MongoClient.connect(config.db.url);
        movies = db.collection('movies');

    });
    beforeEach(async ()=>{
        await movies.remove({});
    });

    after(()=>{
        db.close();
    });

    it('findOneByTitle should return null if not exist in db', async ()=>{
        const ret = await Movies.findOneByTitle('NotExistingMovie');
        should.equal(ret, null);
    });

    it('findOneByTitle should return object from db', async ()=>{
        await movies.insert({Title: 'The Matrix'});
        const ret = await Movies.findOneByTitle('The Matrix');
        ret.Title.should.be.equal('The Matrix');
    });

    it('findOneByTitle should throw if param is not a string', async ()=>{
        const err = await Tools.expectFail(()=>Movies.findOneByTitle(132));
        err.message.should.be.equal("Invalid request: Invalid input data");
    });

    it('create should add movie to database', async ()=>{
        await Movies.create({Title: 'The Matrix'});
        const ret = await movies.findOne({Title: 'The Matrix'});
        ret.Title.should.be.equal('The Matrix');
    });

    it('create should throw if input is null', async ()=>{
        const err = await Tools.expectFail(()=>Movies.create(null));
        err.message.should.be.equal("Invalid request: Invalid input data");
    });

    it('create should throw if object don\'t have title', async ()=>{
        const err = await Tools.expectFail(()=>Movies.create({some: 'data'}));
        err.message.should.be.equal("Invalid request: Invalid input data");
    });

    it('create should throw if title already exist', async ()=>{
        await movies.insert({Title: 'The Matrix'});
        const err = await Tools.expectFail(()=>Movies.create({Title: 'The Matrix'}));
        err.message.should.be.equal("Movie already exist!");
    });

    it('find should return all elements if no params supplied', async ()=>{
        await movies.insert({Title: 'The Matrix'});
        await movies.insert({Title: 'Back to the Future'});
        const list = await Movies.find();
        list.length.should.equal(2);
    })

});