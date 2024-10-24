const { APIController } = require('./APIController')

class Testing {
    API = new APIController()

    constructor(){
        
    }

    static truncate = async () => {
        const API = new APIController();
        await API.DeleteUnauthorized('/api/test/truncate')        
    }


    log = ( modulename, pass, message, code, note="" ) => {
        code = code || "ER_UN103";
        console.log('\x1b[33m%s\x1b[0m', `[MODULE]: ${ modulename }`)

        if( pass ){
            console.log('\x1b[32m%s\x1b[0m', `[PASSED][${ code }]: \t${ message }`)            
        }else{
            console.log('\x1b[31m%s\x1b[0m',`[ERRORED][${ code }]: \t${ message }`)
        }
        if( note.length > 0 ){
            console.log('[NOTE]', note, '\n')
        }
    }

    InternalServerErrorCheckDec = async ( func, callMethodName, url, ...kwargs ) => {         
        
        /**
         * 
         * Basic decorator for checking if this request cause the server to stop 
         * due to Syntax Error or something else
         * 
         * @params
         * 
         *  - function          => The child function which will be executed next
         *  - callMethodName    => The method to be called for this request
         *  - url:              => Request URL
         *  - kwargs            => Container for body and other future properties, for now kwargs[0] = { body: <Object> }
         * 
         */

        const { body }  = kwargs[0]|| {} ;   

        let response;
        if( body === undefined ){
            response = await this.API[callMethodName]( url )        
        }else{
            response = await this.API[callMethodName]( url, body )        
        }

        const { success, content } = response;
        if( !success ){
            this.log(false, content )
            return false
        }else{            
            return func( response )
        }
    }

    Decorator = async ( func, APIController, callMethodName, url, ...kwargs ) => {
        const decorator = async ( response ) => {                    
            return await func( response )
        }
        return await this.InternalServerErrorCheckDec( decorator, APIController, callMethodName, url, ...kwargs )
    }
}

module.exports = {
    Testing
}