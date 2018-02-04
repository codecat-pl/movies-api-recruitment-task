const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config');
const routes = require('./routes');
const DB = require('./lib/mongo');

const app = express();
const port = config.port || 8000;


app.use(bodyParser.json());

app.use(routes);


const server = app.listen(port, ()=>{
    console.log(`App started at port ${port}`);
    server.on('close', ()=>{
        DB.close();
        console.log('shutting down...');
    })
});

module.exports = server;