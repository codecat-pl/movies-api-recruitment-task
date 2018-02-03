const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config');
const routes = require('./routes');

const app = express();
const port = config.port || 8000;


app.use(bodyParser.json());

app.use(routes);


if(isEntryPoint()) {
    app.listen(port, ()=>{
        console.log(`App started at port ${port}`);
    });
}

module.exports = app;



function isEntryPoint(){
    return require.main === module
}