import { useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

const SignUp = () => {    
    const proxy = useSelector( state => state.proxy )
    const Alert = useSelector( state => state.Alert )
    const functions = useSelector( state => state.functions )

    const navigate = useNavigate()

    const [ username, setUsername ] = useState('')
    const [ password, setPassword ] = useState('')
    const [ confirm,  setConfirm ]  = useState('')

    const [ fullname, setFullname ] = useState('')
    const [ email, setEmail ]       = useState('')
    const [ phone, setPhone ]       = useState('')


    const [ step, setStep ] = useState(0)

    const NextStepCheck = async () => {

        /**
         * 
         * Send sign in request to server with body contains username & password
         * 
         */
        if( !username || !password || !confirm){

            /**
             * 
             * If neither username or password is blank, throw Alert warning
             * 
             */
            if( !username ){
                Alert.throwWarning("Username cannot be blank!")
            }else{
                if( !password ){
                    Alert.throwWarning("Password cannot be blank!")
                }else{
                    Alert.throwWarning("Password confirm cannot be blank!")
                }
            }
        }else{            

            if( password !== confirm ){
                /**
                 * 
                 * Confirm password check. No need to talk about this section is you are a normal hooman
                 * 
                 */

                Alert.throwError("Password and password confirm don't match!")

            }else{               
                
                /**
                 * 
                 * Set next page
                 * 
                 */

                setStep(1)

            }


        }
    }

    const SignUpRequest = async () => {

        /**
         * 
         * Not servere like previous step, the information step only focuses on Fullname field,
         * Ensure fullname is not blank before sending request is enough
         * 
         */


        if( !fullname ){
            /**
             * 
             * If fullname was leaf blank, throw error
             * 
             */
            Alert.throwWarning("Fullname cannot be blank!")
        }else{

            /**
             * 
             * Try to call request, if the connection was lost or bad things happened, catch the error and throw it
             * 
             */

            try{

                const response = await fetch(`${ proxy }/api/auth/sign-up`, {
                    method: "POST",
                    headers: {
                        "content-type": "application/json"
                    },
                    body: JSON.stringify({ username, password, fullname, email, phone })
                })

                const serialized_data = await response.json()
                const { data } = serialized_data                
                const { success } = data;

                if( success ){

                    /**
                     * 
                     * If  request success with new user created, set session token and redirect
                     * 
                     */

                    const { token } = data;
                    functions.sessionEstablish( token )

                    navigate('/')
                }else{

                    /**
                     * 
                     * Extract error code and give it a title. 
                     * 
                     * This will be replaced in the future when multi-langs applied
                     * 
                     */

                    const { code } = data;
                    const error_codes = {
                        "ER_UN102": "Username already existed!",
                        "ER_UN101": "Wrong data format!"
                    }

                    Alert.throwError(error_codes[code])
                }

            }catch(err){

                /**
                 * 
                 * Error catched
                 * 
                 */
                Alert.throwError("Cannot connect to the server!!!")
            }
        }
    }

    const FirstStepEnterTrigger = (e) => {

        /**
         * 
         * Trigger input fields if there is an Enter button press,
         * if so, call sign request above
         * 
         */

        const keycode = e.keyCode;
        if(keycode === 13){
            NextStepCheck()
        }

    }

    const LastStepEnterTrigger = (e) => {
        /**
         * 
         * Trigger input fields if there is an Enter button press,
         * if so, call sign request above
         * 
         */

        const keycode = e.keyCode;
        if(keycode === 13){
            SignUpRequest()
        }
    }

    return(
        <div className="sign-bg">
            <div className ="sign-box">
                <div className="sign-box-content">

                    <div className="header-icon">
                        <i className="img-icon"/>
                    </div>
                    {/** Input fields  */}
                    <div className="fields" style={{ display: step === 0 ? "block": "none" }}>


                         {/** Username  */}
                        <div className="field">
                            <input 
                                type="text" placeholder="Username" spellCheck="false"
                                onChange={ (e) => { setUsername(e.target.value) } }
                                onKeyUp = { FirstStepEnterTrigger }    

                            />
                        </div>
                         {/** Password  */}
                        <div className="field">
                            <input 
                                type="password" placeholder="Password" spellCheck="false" 
                                onChange={ (e) => { setPassword(e.target.value) } } 
                                onKeyUp = { FirstStepEnterTrigger }   

                            />
                        </div>  

                        <div className="field">
                            <input 
                                type="password" placeholder="Re-enter password" spellCheck="false" 
                                onChange={ (e) => { setConfirm(e.target.value) } }  
                                onKeyUp = { FirstStepEnterTrigger }    

                            />
                        </div> 


                        {/** Submit button  */}  
                        <div className="field">
                            <button 
                                className="submit-button"                                
                                onClick={ NextStepCheck }
                                >Next</button>
                        </div>
                        
                    </div>

                    <div className="fields" style={{ display: step === 1 ? "block": "none" }}>


                         {/** Username  */}
                        <div className="field">
                            <input 
                                type="text" placeholder="Full name" spellCheck="false"
                                onChange={ (e) => { setFullname(e.target.value) } } 
                                onKeyUp = { LastStepEnterTrigger }                               
                            />
                        </div>
                         {/** Password  */}
                        <div className="field">
                            <input 
                                type="text" placeholder="Email address" spellCheck="false" 
                                onChange={ (e) => { setEmail(e.target.value) } }    
                                onKeyUp = { LastStepEnterTrigger }                            
                            />
                        </div>  

                        <div className="field">
                            <input 
                                type="text" placeholder="Phone number" spellCheck="false" 
                                onChange={ (e) => { setPhone(e.target.value) } }   
                                onKeyUp = { LastStepEnterTrigger }                             
                            />
                        </div> 


                        {/** Submit button  */}  
                        <div className="field field-flex">
                            <button 
                                className="submit-button button-half back-button"                                
                                onClick = { () => { setStep(0) } }
                                >Back</button>
                            <button 
                                className="submit-button button-half"                                
                                onClick={  SignUpRequest }
                                >Sign up</button>
                        </div>
                        
                    </div>


                    <div className="fields">
                        <div className="field field-flex-centre">
                            <i className="or-line"/><span className="or-text">OR</span><i className="or-line"/>
                        </div>

                        {/** Navigate to sign up page */}
                        <div className="field" style={{padding: 0}}>
                            <button 
                                className="submit-button button-not-colored"
                                onClick={ () => { navigate('/signin') } }
                                >sign in</button>
                        </div>

                    </div>

                </div>
                <div className ="sign-box-bg"/>
            </div>
        </div>
    )
}

export default SignUp