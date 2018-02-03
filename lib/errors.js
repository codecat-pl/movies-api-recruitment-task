

class MoviesApiError extends Error{
    constructor(msg){
        super(msg);
        this.code = "ERR_MOVIES_API";
        this.statusCode = 500;
    }
}
exports.MoviesApiError = MoviesApiError;

class MovieNotFoundError extends MoviesApiError{
    constructor(){
        super("Movie not found!");
        this.statusCode = 404;
    }
}

exports.MovieNotFoundError =  MovieNotFoundError;

class MissingApiParameterError extends MoviesApiError{
    constructor() {
        super("Invalid request: Missing parameter");
        this.statusCode = 400;
    }
}

exports.MissingApiParameterError =  MissingApiParameterError;