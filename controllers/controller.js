const { 
    getDefaultResponseObject, 
    defaultResponseBody 
} = require('../config/enum')

const jwt = require('jsonwebtoken');

const Token = require('../models/token')


require('dotenv').config()
const TOKEN_KEY = process.env.TOKEN_KEY
const TOKEN_DURATION = process.env.TOKEN_DURATION

class Controller {
    validFields     = []
    response        = getDefaultResponseObject()
    responseStatus  = 200
    
    constructor(){

    }

    init = () => {
        this.response = {
            "success": true,
            "data": {
                "success": true,
                "content": "",
                "code": ""
            }
        }        
    }

    asView = (req, res) => {
        /**
         * 
         * Auto return proper method for request, 
         * if the request method does not exist, throw 404 not found
         * 
         */
        const method = req.method;
        try{
            return this[method.toLowerCase()](req, res)
        }catch(err){
            Controller.throw404NotFound(req, res)
        }
    }

    static throw404NotFound = (req, res) => {
        /**
         * 
         * Default not found route
         * 
         */
        const response = getDefaultResponseObject()
        response.data.success = false
        response.data.content = "404 - NOT FOUND"
        delete response.data.code 
        res.send(404, response)
    }

    throw400BadRequest = ( content = "400 - BAD REQUEST", code = "ER_UN101" ) => {
        this.response.data.success = false
        this.response.data.content = content
        this.response.data.code    = code      
        this.responseStatus        = 400  
    }

    throw404NotFound = (content = "404 - NOT FOUND", code = "") => {
        /**
         * 
         * This route not used for now
         * 
         */
        this.response.data.success = false
        this.response.data.content = content
        this.response.data.code    = code      
        this.responseStatus        = 400  
    }

    throw403TokenExpired = () => {
        this.response.data.success = false
        this.response.data.content = "Invalid token"
        this.response.data.code    = "ER_AU102"      
        this.responseStatus        = 403
    }

    validateReqBodyFields = (data = {}) => {
        /**
         * 
         * If any field in data object is not included in this.validFields => return false
         * 
         */

        let  valid = true;
        const keys = Object.keys(data);

        /**
         * Because validFields variable is defined in descendent class, we have to valid it first, 
         * at least ensure it is an array
         */

        const validFields = (this.validFields && Array.isArray(this.validFields)) ? this.validFields : []

        for( let i = 0 ; i < keys.length; i++ ){
            const key = keys[i]
            if( !validFields.includes(key) ){
                valid = false
            }
        }
        return valid
    }

    nullCheck = ( data, fields ) => {
        /**
         * 
         * Check data if all given fields are fulfilled data
         * 
         */

        let valid = true;
        for( let i = 0 ; i < fields.length; i++ ){
            const field = fields[i]
            if( data[field] === undefined ){
                valid = false
            }
        }
        return valid;
    }

    tokenSign = async ( username ) => {  
        /**
         * Create token from username and save to database
         */      
        const token = jwt.sign( { username } , TOKEN_KEY);
        await Token.create({ username, token, created: new Date() })
        return token
    }

    tokenRevoke = async (username) => {
        /**
         * Delete token of specific username
         */
        await Token.destroy({ where: {username} })        
    }

    UnauthorizeRequestDecorator = async ( req, res, func ) => {
        /**
         * 
         * Decorator for all requests which have no token in header 
         *
         */    
        this.init()          
        await func()        
        res.status(this.responseStatus).send( this.response )
    }

    AuthorizedRequestDecorator = async (req, res, func) => {
        /**
         * 
         * Decorator for all requests which have token in Authorization header.
         * Extract token, query from database and call the function which username as argument
         * 
         * If token doesn't exist, response 403 invalid token.
         * 
         * For now, we skip expired state of tokens, soon we will implement it if needed
         * 
         */
        this.init()
        const tokenString = req.header("Authorization");
        const tokenQuery = await Token.findOne({ where: { token: tokenString } })

        if( tokenQuery ){
            const { username } = tokenQuery.dataValues            
            await func( username )
        }else{
            this.throw403TokenExpired()
        }        
        res.status(this.responseStatus).send( this.response )
    }

}

module.exports = Controller