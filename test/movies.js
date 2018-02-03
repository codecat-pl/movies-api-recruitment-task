const chai = require('chai');
const chaiHttp = require('chai-http');
const nock = require('nock');
const app = require('../app');
const config = require('../config');

const MongoClient = require('mongodb').MongoClient;


const url = 'mongodb://localhost:27017';
const dbName = 'movies_test';





chai.should();
chai.use(chaiHttp);

describe('API endpoints', ()=>{
    let agent;
    before(()=>{
        agent = chai.request.agent(app);
    });
    after(()=>{
        agent.app.close();
    });

    describe('GET /movies', ()=>{
        it('get status 200', async ()=>{
            const res = await requestGetMovies();
            res.should.have.status(200);
        });

        async function requestGetMovies(){
            return await agent
                .get('/movies');
        }
    });

    describe('POST /movies', ()=>{
        let client, movies;
        before(async ()=>{
            configureNock();
            client = await MongoClient.connect(url);
            movies = client.db(dbName).collection('movies');
            movies.remove({});
        });
        after(()=>{
            nock.restore();
            client.close();
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
            const err = await expectFail(()=>{
                return requestPostMovies({})
            });
            err.should.have.status(400);
            err.response.body.Error.should.be.equal('Invalid request: Missing parameter')
        });

        it('post title not found by omdbapi', async ()=>{
            const apiRequest = mockApiRequestNotFound();
            const err = await expectFail(()=>{
                return requestPostMovies({Title: 'SomeNotExistingMovie'})
            });
            apiRequest.done();
            err.should.have.status(404);
            err.response.body.Error.should.be.equal('Movie not found!')
        });


        function createMovieInDB(){
            return movies.insert({Title: 'The Matrix', other: 'data'})
        }

        function requestPostMovies(query){
            return agent
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

});


function configureNock(){
    if(!nock.isActive())
        nock.activate();
    nock.disableNetConnect();
    nock.enableNetConnect('127.0.0.1');
}

async function expectFail(func){
    try {
        await func();
        return Promise.reject("This line should not be executed.");
    }catch(err){
        return Promise.resolve(err);
    }
}