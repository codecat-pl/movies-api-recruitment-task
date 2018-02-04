const Router = require('express-promise-router');
const {MovieNotFoundError, MissingApiParameterError} = require('../lib/errors');
const OMDB = require('../lib/omdb');
const Movies = require('../model/movies');

const router = Router();
router.get('/', getMovies);
router.post('/', createMovieEntry);
module.exports = router;


async function getMovies(req, res){
    const movies = await Movies.find();
    res.json(movies);
}

async function createMovieEntry(req, res){
    if(!req.body || !req.body.Title) throw new MissingApiParameterError();
    const movieTitle = req.body.Title;
    let movieData = await Movies.findOneByTitle(movieTitle);
    if(!movieData){
        movieData = await fatchFromOmdbAndSave(movieTitle);
    }
    res.json(movieData);
}

async function fatchFromOmdbAndSave(title){
    const data = await OMDB.findMovie(title);
    await Movies.create(data);
    return data;
}
