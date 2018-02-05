# MoviesApi.PublicApi

All URIs are relative to *http://moviesapi.codecat.pl*

Method | HTTP request | Description
------------- | ------------- | -------------
[**addComment**](PublicApi.md#addComment) | **POST** /comments | puts comment into database
[**addMovie**](PublicApi.md#addMovie) | **POST** /movies | adds movies to database
[**findComments**](PublicApi.md#findComments) | **GET** /comments | returns list of comments
[**findMovies**](PublicApi.md#findMovies) | **GET** /movies | searches for movies in database


<a name="addComment"></a>
# **addComment**
> [Comment] addComment(opts)

puts comment into database

By calling this operation you can search for movies in the system. 

### Example
```javascript
import MoviesApi from 'movies_api';

let apiInstance = new MoviesApi.PublicApi();

let opts = { 
  'movie': "movie_example" // String | pass an optional movie id to get comments only for specific movie
};

apiInstance.addComment(opts, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **movie** | **String**| pass an optional movie id to get comments only for specific movie | [optional] 

### Return type

[**[Comment]**](Comment.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="addMovie"></a>
# **addMovie**
> addMovie(opts)

adds movies to database

Adds movies to database

### Example
```javascript
import MoviesApi from 'movies_api';

let apiInstance = new MoviesApi.PublicApi();

let opts = { 
  'title': new MoviesApi.MovieQuery() // MovieQuery | Movie title to add - more informations will be fetched from OMDB API.
};

apiInstance.addMovie(opts, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **title** | [**MovieQuery**](MovieQuery.md)| Movie title to add - more informations will be fetched from OMDB API. | [optional] 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="findComments"></a>
# **findComments**
> [Comment] findComments(opts)

returns list of comments

By calling this operation you can search for movies in the system. 

### Example
```javascript
import MoviesApi from 'movies_api';

let apiInstance = new MoviesApi.PublicApi();

let opts = { 
  'movie': "movie_example" // String | pass an optional movie id to get comments only for specific movie
};

apiInstance.findComments(opts, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **movie** | **String**| pass an optional movie id to get comments only for specific movie | [optional] 

### Return type

[**[Comment]**](Comment.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="findMovies"></a>
# **findMovies**
> [Movie] findMovies(opts)

searches for movies in database

By calling this operation you can search for movies in the system. 

### Example
```javascript
import MoviesApi from 'movies_api';

let apiInstance = new MoviesApi.PublicApi();

let opts = { 
  'id': "id_example", // String | Pass an optional movie id for looking up for specific movie.
  'search': "search_example", // String | This param can be used for searching. All words will be tested against movie title.
  'limit': 56 // Number | maximum number of records to return
};

apiInstance.findMovies(opts, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**| Pass an optional movie id for looking up for specific movie. | [optional] 
 **search** | **String**| This param can be used for searching. All words will be tested against movie title. | [optional] 
 **limit** | **Number**| maximum number of records to return | [optional] 

### Return type

[**[Movie]**](Movie.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

