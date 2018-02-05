const Router = require('express-promise-router');
const {MovieNotFoundError, MissingApiParameterError} = require('../lib/errors');
const Movies = require('../model/movies');
const Comments = require('../model/comments');

const router = Router();

router.get('/', getComments);
router.post('/', createComment);

module.exports = router;

async function getComments(req, res, next){
    const movie = req.query.movie;
    let comments;
    if(!movie)
        comments = await Comments.find();
    else
        comments = await Comments.findByMovieId(movie);
    res.json(comments);
}

async function createComment(req, res, next){
    const comment = req.body;
    const data = await Comments.create(comment);
    res.json(data);
}