const { Memoria } = require("./daos/memoria");
const MongoDbDao = require("./daos/monogoDbDao");
const MysqlDao = require("./daos/mysqlDbDao");



class DaoFactory {
    constructor(){
    }
    getDao(number){
        switch(number){
            case 1:
                return new Memoria();
            case 2:
                return new MysqlDao();
            case 3:
                return new MongoDbDao();
        }
    }
}

module.exports = DaoFactory