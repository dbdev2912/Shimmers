const { Testing } = require('../config/Testing')

class AuthTest extends Testing {

    USERNAME = ""
    PASSWORD = ""

    constructor(){
        super()
    }

    setCredential = (username, password) => {
        this.USERNAME = username
        this.PASSWORD = password

    }

    // testSignInFailedDueToWrongInformation = async () => {
    //     /**
    //      * 
    //      * Testing if current credential is valid or not,
    //      * Because this method test Wrong information, so, data.success has to be false to pass
    //      * 
    //      */
    //     const response = await this.signIn( this.USERNAME, this.PASSWORD )
    //     const { data } = response
    //     const { success, content, code } = data;

    //     if( !success ){
    //         this.log("AUTH - SIGN IN", true, "WRONG INFORMATION SIGN IN", code )
    //     }else{
    //         this.log("AUTH - SIGN IN", false, "WRONG INFORMATION SIGN IN", code, "The current credential is passed signin check, somehow." )
    //     }
    // }

    SignUp = async ( userObject ) => {
        const URL   = "/api/auth/sign-up"
        const BODY  = userObject
        const signUpFunc = ( response ) => {
            return response.data
        }

        const result = await this.Decorator(signUpFunc, "PostUnauthorized", URL, { body: BODY } )
        return result
    }

    SignIn = async ({ username, password }) => {
        const URL   = "/api/auth/sign-in"
        const BODY  = { username, password }
     
        const signInFunc = (response) => {            
            return response;
        }
        const result = await this.Decorator(signInFunc, "PostUnauthorized", URL, { body: BODY } )
        return result
    }

    Update = async ( userObject ) => {
        const URL   = "/api/auth/infors"
        const BODY  = userObject 

        const UpdateFunc = ( response ) => {
            return response.data
        }

        const result = await this.Decorator( UpdateFunc, "PutAuthorized", URL, { body: BODY } )
        return result
    }

    SignOut = async () => {
        const URL   = "/api/auth/sign-out"

        const SignOutFunc = (response) => {
            return response.data
        }
        const result = await this.Decorator( SignOutFunc, "PostAuthorized", URL )
        return result;
    }


    SignUp_CaseSuccess = async () => {
        const user = {
            "username": "rastisumoon",
            "password": "1",
            "email": "rastisumoon@gmail.com",
            "phone": "0368474601",
            "fullname": "rastisumoon"            
        }
        const response = await this.SignUp( user )
        const { success, content, code } = response;
        this.log("AUTH - SIGN UP", success , content, code, `New user created: ${ user.username } - ${ user.password }`)        
    }

    SignUp_CaseFailed_Wrongformat = async () => {
        const user = {
            "username": "1234567",
            "password": "1",
            "email": "rastisumoon@gmail.com",
            "phone": "0368474601",
            "fullname": "rastisumoon"            
        }

        const response = await this.SignUp( user )
        const { success, content, code } = response;
        this.log("AUTH - SIGN UP", !success, content, code, `Test with username "1234567" which is length of 7 \n( min length required is 8 )`)        
    }

    SignUp_CaseFailed_UserExisted = async () => {
        const user = {
            "username": "rastisumoon",
            "password": "1",
            "email": "rastisumoon@gmail.com",
            "phone": "0368474601",
            "fullname": "rastisumoon"            
        }
        const response = await this.SignUp( user )
        const { success, content, code } = response;
        this.log("AUTH - SIGN UP", !success, content, code, `Re-create user "rastisumoon" -> Failed `)        
    }

    SignUp_CaseFailed_WrongBody = async () => {
        const user = {
            "username": "rastisumoon",
            "password": "1",
            "weirdfield": "err"         
        }
        const response = await this.SignUp( user )
        const { success, content, code } = response;
        this.log("AUTH - SIGN UP",  !success, content, code, `Field which is not included in permitted fields, will cause error`)        
    }

    SignIn_CaseSuccess = async () => {
        const user = {
            username: "rastisumoon",
            password: "1"
        }
        const response = await this.SignIn(user)
        const { data } = response;
        const { success, content, code, token } = data;
        
        this.log("AUTH - SIGN IN",  success, content, code, `Successfully signed in with { username: ${ user.username }, password: ${ user.password } }\n-> Set token to AuthTest.TOKEN` )
        this.API.setPermanentToken( token )        
    }

    SignIn_CaseFailed_WrongCredential = async () => {
        const user = {
            username: "raftafaloon",
            password: "1"
        }
        const response = await this.SignIn(user)
        const { data } = response;
        const { success, content, code } = data;
        
        this.log("AUTH - SIGN IN",  !success, content, code, `Signed in with { username: ${ user.username }, password: ${ user.password } }->Failed` )        
    }

    Update_CaseFailed_InvalidToken = async () => {
        this.API.setToken( "INVALID TOKEN" )

        const newUser = {                      
            "email": "rastisumoon-updated@gmail.com",
            "phone": "0368474601",
            "fullname": "rastisumoon - updated"
        }

        const response = await this.Update( newUser )
        const { success, code, content } = response;
        this.log("AUTH - UPDATE", !success, content, code, "Pass random token to headers.authorization -> Failed")        
    }


    Update_CaseFailed_InvalidBody = async () => {
        this.API.setToken( this.API.PERMANENT_TOKEN )

        const newUser = {                
            "email": "rastisumoon-updated@gmail.com",
            "phone": "0368474601",
            "fullname": "rastisumoon - updated",
            "weird_field": "kkk"
        }

        const response = await this.Update( newUser )
        const { success, code, content } = response;

        this.log("AUTH - UPDATE", !success, content, code, "Pass a field which is not permitted -> Failed")
        
    }

    Update_CaseSuccess = async () => {
        this.API.setToken( this.API.PERMANENT_TOKEN )

        const newUser = {                   
            "email": "rastisumoon-updated@gmail.com",
            "phone": "0368474601",
            "fullname": "rastisumoon - updated"            
        }

        const response = await this.Update( newUser )
        const { success, code, content } = response;
        
        this.log("AUTH - UPDATE", success, content, code)        
    }

    SignOut_CaseSuccess = async () => {
        this.API.setToken( this.API.PERMANENT_TOKEN )        
        const response = await this.SignOut()
        const { success, content, code } = response 

        this.log( "AUTH - SIGN OUT", success, content, code, "After this, the token was revoked -> Automatically sign again and reset token" )            
        await this.SignIn_CaseSuccess()        
    }

    SignOut_CaseFailed = async () => {
        this.API.setToken( "Random token" )        
        const response = await this.SignOut()
        const { success, code, content } = response;

        this.log("AUTH - SIGN OUT", !success, content, code, "Sign out failed due to invalid token")        
    }
}

module.exports = {
    AuthTest: new AuthTest()
}