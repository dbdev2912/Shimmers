const sessionEstablish = ( token ) => {

    /**
     * 
     * Establish connection by setting a token to local storage
     * 
     * There is a special structure for this type of token, 
     * we will add TOKEN as the prefix because of API server requirements
     * 
     * 
     * @params 
     *      - token <String>
     * 
     */

    localStorage.setItem('_token', `TOKEN ${ token }`)
}

const sessionCheck = () => {

    /**
     * 
     * Check if localstorage has _token item or not,
     * 
     * The validation is not important, just check and return,
     * the validating job will be performed in Homepage
     * 
     */

    const token = localStorage.getItem('_token')
    if( token != undefined && typeof(token) == 'string'){
        return true 
    }
    return false 
}

const sessionDestroy = () => {

    /**
     * 
     * Destroy connection by removin' _token from localstorage,
     * with no _token, the routing will automatically redirect to sign in page
     * 
     */

    localStorage.removeItem('_token')
}

const getToken = () => {

    /**
     * 
     * Get _token from localstorage
     * 
     */
    return localStorage.getItem('_token')
}



export default {
    sessionEstablish,
    sessionCheck,
    sessionDestroy,
    getToken
}

