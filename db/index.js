const Driver = require('./mongo/index');

class Database{
    static connect() {
        return this.driver.connect();
    }

    static close(){
        return this.driver.close();
    }

    static get Id(){
        return this.driver.Id;
    }


    static getInsertedId(ret){
        return this.driver.getInsertedId(ret);
    }

    static model(name){
        return this.driver.model(name);
    }
}

Database.driver = new Driver();
module.exports = Database;