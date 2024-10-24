require('dotenv').config();
const Controller = require('./base/controller.js')
const sequelize = require('../config/db')

const isTestingENV = process.env.TEST;
const envStatus = isTestingENV && isTestingENV == "true" 

class Test extends Controller {
    constructor(){
        super()
    }

    delete = async ( req, res ) => {
        /**
         * 
         * This is an unraveled method for purging ALL data,
         * Only in testing enviroment, this method is able to call
         * 
         */
        const PurgeAllData = async () => {
            if( envStatus ){
                await sequelize.sync({ force: true })
                this.throwResponse(true, 200, "Database truncated", "---")
            }else{
                this.throwResponse(false, 403, "Forbiden request!!", "---")
            }
        }
        this.UnauthorizeRequestDecorator(req, res, PurgeAllData )
    }
}

module.exports = {
    Test: new Test()
}