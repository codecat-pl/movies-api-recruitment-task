const Router = require('express-promise-router');
const debug = require('debug')('routes:movieAPI');
const path = require('path');

const router = Router();
router.get('/', sendIndex);
router.use('/movies', require('./movies'));
router.use('/comments', require('./comments'));
router.use(handleErrors);
module.exports = router;


function handleErrors(err, req, res, next){
    debug(err);
    res.status(err.statusCode || 500)
        .json({Error: err.message});
}


function sendIndex(req,res){
    res.sendFile(path.join(__dirname,'../public/index.html'));
}