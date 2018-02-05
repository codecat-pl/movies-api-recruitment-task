const config = require('../config');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

module.exports = new (class MongoConnector{
    constructor(){
        this.db = null;
    }
    async connect() {
        if (!this.db) {
            this.db = await MongoClient.connect(config.db.url);
        }
        return Promise.resolve(this.db);
    }

    get Id(){
        return ObjectID;
    }

    async close(){
        const db = this.db;
        this.db = null;
        if(db) await db.close();
    }

    getInsertedId(ret){
        return ret.insertedIds[0].toString();
    }
})();