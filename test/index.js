require('dotenv').config()

const { AuthTest } = require('./auth')
const { Testing }  = require('./config/Testing')
const Main = async () => {
    /**
     * 
     * Initialize database
     * 
     */
    
    await Testing.truncate()

    
    /* ============================
     * SECTION 1: Authentication
     *============================== */

    /** 
     * SIGN UP TEST 
     * 
     * 1. Sign Up Successfully
     * 2. Failed due to wrong data format
     * 3. Failed due to username already existed
     * 4. Failed due to wrong request body
     * 
     */


    /* 1 */        
    await AuthTest.SignUp_CaseSuccess()

    /* 2 */
    await AuthTest.SignUp_CaseFailed_Wrongformat()

    /* 3 */
    await AuthTest.SignUp_CaseFailed_UserExisted()

    /* 4 */
    await AuthTest.SignUp_CaseFailed_WrongBody()

    /**
     * 
     * SIGN IN TEST
     * 
     * 1. Sign in with random, invalid and non-existence username - password
     * 2. Sign in with user which recently sign up above
     * 
     * Note: After successfully testing at step 2 -> Set token to Auth.TOKEN for futhur uses.
     * 
     */


    /* 1 */
    await AuthTest.SignIn_CaseFailed_WrongCredential()
    
    /* 2 */
    await AuthTest.SignIn_CaseSuccess()



    /**
     * 
     * UPDATE User Infor
     * 
     * 1. Failed due to invalid token
     * 2. Failed due to wrong body 
     * 3. Successfully update
     * 
     */

    /* 1 */
    await AuthTest.Update_CaseFailed_InvalidToken()

    /* 2 */
    await AuthTest.Update_CaseFailed_InvalidBody()

    /* 3 */
    await AuthTest.Update_CaseSuccess()


    /**
     * 
     * UPDATE user avatar -> skip for now
     * 
     */


    /**
     * 
     * Sign out
     * 1. Success 
     * 2. Failed due to invalid token
     * 
     */

    /* 1 */
    await AuthTest.SignOut_CaseSuccess()

    /* 2 */
    await AuthTest.SignOut_CaseFailed()



    /* ============================
     * SECTION 2: SCHEDULED REMINDER
     *============================== */
}

const isTestingENV = process.env.TEST;
const envStatus = isTestingENV && isTestingENV == "true" 
if( envStatus ){
    Main()
}else{
    console.log('\x1b[33m%s\x1b[0m',`[DANGER] STOP RIGHT THERE!`)
    console.log(`
Your enviroment is set [production] mode now. 
This will cause your data be purged entirely.

Go to .env and switch TEST=true on, restart server and try again`)

}