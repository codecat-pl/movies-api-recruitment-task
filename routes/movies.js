const Router = require('express-promise-router');
const {MovieNotFoundError, MissingApiParameterError} = require('../lib/errors');
const OMDB = require('../lib/omdb');
const Movies = require('../model/movies');

const router = Router();
router.get('/', getMovies);
router.post('/', createMovieEntry);
module.exports = router;


async function getMovies(req, res){
    const movies = await Movies.find(req.query);
    res.json(movies);
}

async function createMovieEntry(req, res){
    checkIfExist('Title', req.body);
    const movieData = await findOrFetchMovie(req.body.Title);
    res.json(movieData);
}

async function findOrFetchMovie(movieTitle){
    const movieData = await Movies.findOneByTitle(movieTitle);
    if(!movieData) {
        return await fatchFromOmdbAndSave(movieTitle);
    }
    return movieData;
}

function checkIfExist(name, body){
    if(!body || !body[name])
        throw new MissingApiParameterError();
}

async function fatchFromOmdbAndSave(title){
    const data = await OMDB.findMovie(title);
    await Movies.create(data);
    return data;
}
