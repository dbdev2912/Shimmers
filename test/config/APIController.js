class APIController {
    DOMAIN  = "http://127.0.0.1:5000";

    PERMANENT_TOKEN = ""
    TEMP_TOKEN      = ""
    constructor(){

    }

    setPermanentToken = ( token ) => {
        this.PERMANENT_TOKEN = token
    }

    setToken = ( token ) => {
        this.TEMP_TOKEN = token
    }

    getToken = () => {
        return this.TEMP_TOKEN
    }

    destroyToken = () => {
        this.TOKEN = ""
    }

    makeURL = ( url ) => {
        return `${this.DOMAIN}${ url }`
    }

    GetAuthorized = async ( url ) => {
        const request = await fetch( this.makeURL(url), { headers: { Authorization: this.getToken() } } )
        const response = await request.json()

        return response;
    }

    GetUnauthorized = async ( url ) => {
        const request   = await fetch( this.makeURL(url) )
        const response  = await request.json()

        return response;
    }

    makeRequestWithBody = async ( method, url, body, options = {} ) => {
        const { isAuthorized } = options;

        try{
            const request   = await fetch( this.makeURL(url), {
                method,
                headers:  isAuthorized ? {
                    "content-type": "application/json",
                    "Authorization": this.getToken()
                }: {
                    "content-type": "application/json"             
                },
                body: JSON.stringify({ ...body })
            })
            const response = await request.json()
            return response;

        }catch(err){
            return {
                "success": false,
                "content": "500 - INTERNAL SERVER ERROR"
            }
        }
        
    }

    PostAuthorized = async ( url, body ) => {
        return this.makeRequestWithBody( "POST", url, body, { isAuthorized: true } )
    }

    PostUnauthorized = async (url, body) => {
        return this.makeRequestWithBody( "POST", url, body )
    }

    PutAuthorized = async ( url, body ) => {
        return this.makeRequestWithBody( "PUT", url, body, { isAuthorized: true } )
    }

    PutUnauthorized = async (url, body) => {
        return this.makeRequestWithBody( "PUT", url, body )
    }

    DeleteAuthorized = async ( url, body ) => {
        return this.makeRequestWithBody( "DELETE", url, body, { isAuthorized: true } )
    }

    DeleteUnauthorized = async (url, body) => {
        return this.makeRequestWithBody( "DELETE", url, body )
    }

    PatchAuthorized = async ( url, body ) => {
        return this.makeRequestWithBody( "PATCH", url, body, { isAuthorized: true } )
    }

    PatchUnauthorized = async (url, body) => {
        return this.makeRequestWithBody( "PATCH", url, body )
    }
}

module.exports = {
    APIController
}