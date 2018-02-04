const config = require('../config');
const MongoClient = require('mongodb').MongoClient;


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

    async close(){
        const db = this.db;
        this.db = null;
        await db.close();
    }
})();