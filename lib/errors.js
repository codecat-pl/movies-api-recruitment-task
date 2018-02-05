

class MoviesApiError extends Error{
    constructor(msg){
        super(msg);
        this.code = "ERR_MOVIES_API";
        this.statusCode = 500;
    }
}
exports.MoviesApiError = MoviesApiError;
exports.MovieNotFoundError = createErrorType(404, "Movie not found!");
exports.MissingApiParameterError = createErrorType(400, "Invalid request: Missing parameter");
exports.InvalidInputDataError = createErrorType(400, "Invalid request: Invalid input data");
exports.MovieAlreadyExistError = createErrorType(400, "Movie already exist!");
exports.InvalidIdType = createErrorType(400, "Invalid request: Invalid ID type");


function createErrorType(status, message){
    return class extends MoviesApiError{
        constructor(){
            super(message);
            this.statusCode = status;
        }
    }
}