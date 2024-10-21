const defaultResponseBody = {
    "success": true,
    "data": {
        "success": true,
        "content": "",
        "code": ""
    }
}

const emailRegEx = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

const getDefaultResponseObject = () => {
    /**
     * CREATE A CLONE OF DEFAULT_RESPONSE_BODY AND RETURN
     */
    return { ...defaultResponseBody }
}

const logger = ( ...data ) => {
    console.log( ...data )
}

const maximumDataInASingleQuest = 4;

module.exports = {
    getDefaultResponseObject,
    defaultResponseBody,
    emailRegEx,
    maximumDataInASingleQuest,
    logger,
}