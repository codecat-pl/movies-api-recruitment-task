process.env.PORT = 0;
const chai = require('chai');
const chaiHttp = require('chai-http');
const nock = require('nock');
const app = require('../app');
const config = require('../config');
const Tools = require('./detail/tools');
const DB = require('../db/index');
const fs = require('fs');
const path = require('path');
chai.use(chaiHttp);

describe('API endpoints for movies', ()=>{
    let http, movies, db;
    before(async ()=>{
        http = chai.request.agent(app);
        db = await DB.connect();
        movies = db.collection('movies');
    });

    beforeEach(async ()=>{
        await movies.remove({});
    });

    afterEach(async ()=>{
        await movies.remove({});
    });

    after(async ()=>{
        await http.app.close();
        await DB.close();
    });

    describe('GET /', ()=>{
        it('should return index.html', async ()=>{
            const res = await http.get('/');
            res.should.have.status(200);
            res.text.should.equal(fs.readFileSync(path.join(__dirname, '../public/index.html')).toString());
        });
    });

    describe('GET /movies', ()=>{
        it('should return status 200', async ()=>{
            const res = await http.get('/movies');
            res.should.have.status(200);
        });

        it('should return empty list if no movies in database', async ()=>{
            const res = await http.get('/movies');
            res.body.should.be.an('array').that.is.empty;
        });

        it('should return list of movies from database with ids', async ()=>{
            await createExampleMovies();
            const res = await http.get('/movies');
            res.body.length.should.equal(4);
            res.body[0].should.have.property('id');
            res.body[3].should.have.property('id');
        });

        it('should return empty array if no movie match to search parameter', async ()=>{
            await createExampleMovies();
            const res = await http.get('/movies').query({search: "Fiction"});
            res.body.should.be.an('array').that.is.empty;
        });

        it('should return movies that match to search parameter', async ()=>{
            await createExampleMovies();
            const res = await http.get('/movies').query({search: "Future"});
            res.body.length.should.equal(2);
        });

        it('should return movies that match to search parameter with 2 ordered words', async ()=>{
            await createExampleMovies();
            const res = await http.get('/movies').query({search: "Back Future"});
            res.body.length.should.equal(2);
        });

        it('should return movies that match to search parameter with 2 unordered words', async ()=>{
            await createExampleMovies();
            const res = await http.get('/movies').query({search: "Future Back"});
            res.body.length.should.equal(2);
        });

        it('should return movies that match to search parameter with case insensitivity', async ()=>{
            await createExampleMovies();
            const res = await http.get('/movies').query({search: "back future"});
            res.body.length.should.equal(2);
        });

        it('should return movies that match to search parameter with case insensitivity', async ()=>{
            await createExampleMovies();
            const res = await http.get('/movies').query({search: "back future"});
            res.body.length.should.equal(2);
        });

        it('should return list of movies sorted by title in ascending order if parameter sort[Title] is set to asc', async ()=>{
            await createExampleMovies();
            const res = await http.get('/movies').query({sort:{Title: 'asc'}});
            res.body[0].Title.should.equal('Back to Burgundy');
            res.body[3].Title.should.equal('The Matrix');
        });

        it('should return list of movies sorted by title in descending order if parameter sort[Title] is set to desc', async ()=>{
            await createExampleMovies();
            const res = await http.get('/movies').query({sort:{Title: 'desc'}});
            res.body[0].Title.should.equal('The Matrix');
            res.body[3].Title.should.equal('Back to Burgundy');
        });

        it('should return list of movies sorted by year in ascending order if parameter sort[Year] is set to asc', async ()=>{
            await createExampleMovies();
            const res = await http.get('/movies').query({sort:{Year: 'asc'}});
            res.body[0].Title.should.equal('Back to the Future');
            res.body[3].Title.should.equal('Back to Burgundy');
        });

        it('should return list of movies sorted by year in descending order if parameter sort[Year] is set to desc', async ()=>{
            await createExampleMovies();
            const res = await http.get('/movies').query({sort:{Year: 'desc'}});
            res.body[0].Title.should.equal('Back to Burgundy');
            res.body[3].Title.should.equal('Back to the Future');
        });

        it('should return movie according to id parameter', async ()=>{
            const ret = await createMovieInDB('Pulp Fiction');
            const movieId = Tools.getInsertedId(ret);
            await createExampleMovies();
            const res = await http.get('/movies').query({id: movieId});
            res.body.length.should.equal(1);
            res.body[0].Title.should.equal('Pulp Fiction')
        });

        it('should return movie according to id parameter', async ()=>{
            const ret = await createMovieInDB('The Matrix');
            const movieId = Tools.getInsertedId(ret);
            const res = await http.get('/movies').query({id: movieId});
            res.body.length.should.equal(1);
            res.body[0].Title.should.equal('The Matrix')
        });

        async function createExampleMovies() {
            await createMovieInDB('The Matrix', 1999);
            await createMovieInDB('Back to the Future', 1985);
            await createMovieInDB('Back to the Future 2', 1989);
            await createMovieInDB('Back to Burgundy', 2017);
        }
    });

    describe('POST /movies', ()=>{
        before(async ()=>{
            configureNock();
        });
        after(()=>{
            nock.restore();
        });
        afterEach(()=>{
            nock.cleanAll();
        });

        it('should return status 200 when title is send', async ()=>{
            mockApiRequestMatrix();
            const res = await http.post('/movies').send({Title: 'The Matrix'});
            res.should.have.status(200);
            res.body.should.have.property('Title', 'The Matrix');
        });

        it('should query omdbapi.com and answer with result when posting the title to server ', async ()=>{
            const apiRequest = mockApiRequestMatrix();
            const res = await http.post('/movies').send({Title: 'The Matrix'});
            res.should.have.status(200);
            apiRequest.done();
        });

        it('should return data from omdbapi with local id', async ()=>{
            mockApiRequestMatrix();
            const res = await http.post('/movies').send({Title: 'The Matrix'});
            res.body.should.have.property('other', 'data');
            res.body.should.have.property('id');
        });

        it('should throw error when title not exist', async ()=>{
            const err = await Tools.expectFail(()=>{
                return http.post('/movies').send({other: 'param'});
            });
            err.should.have.status(400);
            err.response.body.Error.should.be.equal('Invalid request: Missing parameter')
        });

        it('should return error when title is not found in omdbapi', async ()=>{
            const apiRequest = mockApiRequestNotFound();
            const err = await Tools.expectFail(()=>{
                return http.post('/movies').send({Title: 'SomeNotExistingMovie'});
            });
            apiRequest.done();
            err.should.have.status(404);
            err.response.body.Error.should.be.equal('Movie not found!')
        });

        it('should return data from database when title already exist', async ()=>{
            await createMovieInDB();
            const res = await http.post('/movies').send({Title: 'The Matrix'});
            res.should.have.status(200);
            res.body.should.have.property('Title', 'The Matrix');
            res.body.should.have.property('id');
        });

        it('should return data with id when title already exist', async ()=>{
            await createMovieInDB();
            const res = await http.post('/movies').send({Title: 'The Matrix'});
            res.body.should.have.property('id');
        });

        function mockApiRequestMatrix() {
            return nock('http://www.omdbapi.com/')
                .get('/')
                .query({t: 'The Matrix', apikey: config.omdbapi_key})
                .reply(200, {Title: "The Matrix", other: 'data'});
        }

        function mockApiRequestNotFound(){
            return nock('http://www.omdbapi.com/')
                .get('/')
                .query({t: 'SomeNotExistingMovie', apikey: config.omdbapi_key})
                .reply(200, {Response: "False", Error: "Movie not found!"});
        }
    });

    function createMovieInDB(title="The Matrix", year=1999){
        return movies.insert({Title: title, other: 'data', Year: year})
    }

});

function configureNock(){
    if(!nock.isActive())
        nock.activate();
    nock.disableNetConnect();
    nock.enableNetConnect('127.0.0.1');
}
