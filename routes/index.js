const Router = require('express-promise-router');
const debug = require('debug')('routes:movieAPI');


const router = Router();
router.use('/movies', require('./movies'));
router.use(handleErrors);
module.exports = router;


function handleErrors(err, req, res, next){
    debug(err);
    res.status(err.statusCode || 500)
        .json({Error: err.message});
}
