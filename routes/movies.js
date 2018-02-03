const Router = require('express-promise-router');
const {MovieNotFoundError, MissingApiParameterError} = require('../lib/errors');
const OMDB = require('../lib/omdb');


const router = Router();
router.get('/', getMovies);
router.post('/', checkCreateMovieParameters, createMovieEntry);
module.exports = router;


function getMovies(req, res){
    res.send("OK");
}

async function createMovieEntry(req, res){
    const data = await OMDB.findMovie(req.body.Title);

    if(data.Error)
        throw new MovieNotFoundError();

    res.json(data);
}

function checkCreateMovieParameters(req, res, next){
    if(!req.body.Title) throw new MissingApiParameterError();
    next();
}