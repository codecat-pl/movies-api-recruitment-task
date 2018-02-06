const Router = require('express-promise-router');
const debug = require('debug')('routes:movieAPI');


const router = Router();
router.get('/', sendGithubLink);
router.use('/movies', require('./movies'));
router.use('/comments', require('./comments'));
router.use(handleErrors);
module.exports = router;


function handleErrors(err, req, res, next){
    //console.error(err);
    debug(err);
    res.status(err.statusCode || 500)
        .json({Error: err.message});
}


function sendGithubLink(req,res){
    res.send("<a href='https://github.com/codecat-pl/movies-api-recruitment-task'>Visit github for more info</a>");
}