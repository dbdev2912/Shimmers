const { Testing } = require('../config/Testing')
const { APIController } = require('../config/APIController')

class AuthTest extends Testing {
    API = new APIController()

    constructor(){
        super()
    }

    test = async () => {
        const URL   = "/api/auth/sign-in"
        const BODY  = {
            "username": "administrator",
            "password": "1"
        }
        const signIn = await this.API.PostUnauthorized( URL, BODY )
        console.log(signIn)
    }
}

module.exports = {
    AuthTest: new AuthTest()
}