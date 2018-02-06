process.env.PORT = 0;
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const Tools = require('./detail/tools');
const DB = require('../db/index');
chai.use(chaiHttp);

describe('API endpoints for comments', ()=>{
    let http, movies, db, comments;
    before(async ()=>{
        http = chai.request.agent(app);
        db = await DB.connect();
        comments = db.collection('comments');
        movies = db.collection('movies');
    });

    beforeEach(async ()=>{
        await comments.remove({});
        await movies.remove({});
    });

    afterEach(async ()=>{
        await comments.remove({});
        await movies.remove({});
    });

    after(async ()=>{
        await http.app.close();
        await DB.close();
    });

    describe('GET /comments', ()=>{
        it('should return status 200', async ()=>{
            const res = await http.get('/comments');
            res.should.have.status(200);
        });

        it('should return empty array if no comments in database', async ()=>{
            const res = await http.get('/comments');
            res.body.should.be.an('array').that.is.empty;
        });

        it('should return all comments from database', async ()=>{
            await createCommentInDb('asd', 'text1');
            await createCommentInDb('qwe', 'text2');
            const res = await http.get('/comments');
            res.body.should.be.an('array');
            res.body.length.should.equal(2);
        });

        it('should return all comments from database for movie specified in query', async ()=>{
            await createCommentInDb('asd', 'text1');
            await createCommentInDb('qwe', 'text2');
            await createCommentInDb('qwe', 'text3');
            const res = await http.get('/comments').query({movie: 'qwe'});
            res.body.should.be.an('array');
            res.body.length.should.equal(2);
        });

    });

    describe('POST /comments', ()=>{
        let movieId;

        beforeEach(async ()=>{
            const ret = await movies.insert({Title: 'The Matrix', other: 'data'});
            movieId = Tools.getInsertedId(ret);
        });

        afterEach(()=>{
            movieId = null;
        });

        it('should return created comment', async ()=>{
            const comment = {movie: movieId, body: 'some test comment'};
            const res = await http.post('/comments').send(comment);
            res.should.have.status(200);
            res.body.should.include(comment);
        });

        it('should return object with new id', async ()=>{
            const comment = {movie: movieId, body: 'some test comment'};
            const ret = await http.post('/comments').send(comment);
            ret.body.should.have.property('id');
            ret.body.should.include(comment);
        });

        it('should create comment in database', async ()=>{
            const comment = {movie: movieId, body: 'some test comment'};
            await http.post('/comments').send(comment);
            const ret = await comments.find({}).toArray();
            ret.length.should.equal(1);
            ret[0].should.include(comment);
        });

        it('should return error if movie id is missing', async ()=>{
            const comment = { body: 'some test comment'};
            const err = await Tools.expectFail(()=>http.post('/comments').send(comment));
            err.response.body.Error.should.equal("Invalid request: Invalid ID type");
        });
    });

    function createCommentInDb(movie, body){
        return comments.insert({movie: movie, body: body});
    }
});


