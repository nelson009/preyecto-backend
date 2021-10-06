
const FireBaseDao = require("./daos/firebase_Dao");
const { Memoria } = require("./daos/memoria");
const MongoDBaaSDao = require("./daos/MongoDBaaSDao");
const MongoDbDao = require("./daos/monogoDbDao");
const MysqlDao = require("./daos/mysqlDbDao");
const Sqlite3Dao = require("./daos/sqlite3");

class DaoFactory {
    constructor(){
    }
    getDao(number){
        switch(number){
            case 0:
                return new Memoria();
            case 1:
                return new MysqlDao();
            case 2:
                return new MongoDbDao();
            case 3:
                return new MongoDBaaSDao();
            case 4:
                return new FireBaseDao()
            case 5:
                return new Sqlite3Dao()
        }
    }
}
module.exports = DaoFactory