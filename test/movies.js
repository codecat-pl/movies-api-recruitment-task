process.env.PORT = 0;
const chai = require('chai');
const chaiHttp = require('chai-http');
const nock = require('nock');
const app = require('../app');
const config = require('../config');
const Tools = require('./detail/tools');
const DB = require('../lib/mongo');
chai.use(chaiHttp);

describe('API endpoints for movies', ()=>{
    let http, movies, db;
    before(async ()=>{
        http = chai.request.agent(app);
        db = await DB.connect();
        movies = db.collection('movies');
    });

    beforeEach(()=>{
        movies.remove({});
    });

    after(()=>{
        http.app.close();
        DB.close();
    });

    describe('GET /', async ()=>{
        const res = await http.get('/');
        res.should.have.status(200);
        res.body.should.equal("<a href='https://github.com/codecat-pl/movies-api-recruitment-task'>Visit github for more info</a>");
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

        it('post of title should return object with title', async ()=>{
            mockApiRequestMatrix();
            const res = await requestPostMovies();
            res.should.have.status(200);
            res.body.should.have.property('Title', 'The Matrix');
        });

        it('when posting the title server should query omdbapi.com', async ()=>{
            const apiRequest = mockApiRequestMatrix();
            const res = await requestPostMovies();
            res.should.have.status(200);
            apiRequest.done();
        });

        it('post title should return data from omdbapi', async ()=>{
            mockApiRequestMatrix();
            const res = await requestPostMovies();
            res.body.should.have.property('other', 'data');
        });

        it('post if title not exist should return error ', async ()=>{
            const err = await Tools.expectFail(()=>{
                return requestPostMovies({})
            });
            err.should.have.status(400);
            err.response.body.Error.should.be.equal('Invalid request: Missing parameter')
        });

        it('post title not found by omdbapi', async ()=>{
            const apiRequest = mockApiRequestNotFound();
            const err = await Tools.expectFail(()=>{
                return requestPostMovies({Title: 'SomeNotExistingMovie'})
            });
            apiRequest.done();
            err.should.have.status(404);
            err.response.body.Error.should.be.equal('Movie not found!')
        });

        it('post should return data from database if exist (not omdbapi)', async ()=>{
            await createMovieInDB();
            const res = await requestPostMovies();
            res.should.have.status(200);
            res.body.should.have.property('Title', 'The Matrix');
        });

        it('post should return data from database if exist but with id', async ()=>{
            await createMovieInDB();
            const res = await requestPostMovies();
            res.body.should.have.property('id');
        });

        function requestPostMovies(query){
            return http
                .post('/movies')
                .send(query || {Title: 'The Matrix'});
        }

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
