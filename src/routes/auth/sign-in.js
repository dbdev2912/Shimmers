import { useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

export default () => {    
    const proxy = useSelector( state => state.proxy )
    const Alert = useSelector( state => state.Alert )
    const functions = useSelector( state => state.functions )

    const navigate = useNavigate()

    const [ username, setUsername ] = useState('')
    const [ password, setPassword ] = useState('')


    const signRequest = async () => {

        /**
         * 
         * Send sign in request to server with body contains username & password
         * 
         */
        if( !username || !password ){

            /**
             * 
             * If neither username or password is blank, throw Alert warning
             * 
             */
            if( !username ){
                Alert.throwWarning("Username cannot be blank!")
            }else{
                Alert.throwWarning("Password cannot be blank!")
            }
        }else{

            /**
             * 
             * With username and password fulfilled, try sending post request to server.
             * 
             * There are 2 circumstances may reveal.
             * - The indeal one is request was successfully sent to server and get the reponse.
             * - The bad one is to lose connect with the server and get error, just throw Alert error for this
             */


            try{

                const response = await fetch(`${ proxy }/api/auth/sign-in`, {
                    method: "post",
                    headers: {
                        'content-type': "application/json"
                    },
                    body: JSON.stringify({ username, password })
                })
                const serialized_data = await response.json()
                const { data } = serialized_data
                const { success, code, user } = data

                /**
                 * 
                 * Extract success & code from response.data
                 * 
                 * if success then set the token to local storage with name _token, the function will do it job
                 * else throw error, the server won't show what was wrong and we will do the same
                 * 
                 */

                if( success ){
                    functions.sessionEstablish( data.token )
                    functions.saveUserData( user )
                    navigate('/')
                }else{
                    Alert.throwError("Invalid credential!!")
                }
                
            }catch(err){
                Alert.throwError("Cannot connect to the server!!!")
            }
        }
    }

    const EnterTrigger = (e) => {

        /**
         * 
         * Trigger input fields if there is an Enter button press,
         * if so, call sign request above
         * 
         */

        const keycode = e.keyCode;
        if(keycode == 13){
            signRequest()
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
                    <div className="fields">


                         {/** Username  */}
                        <div className="field">
                            <input 
                                type="text" placeholder="Username" spellCheck="false"
                                onChange={ (e) => { setUsername(e.target.value) } }
                                onKeyUp={ EnterTrigger }
                            />
                        </div>
                         {/** Password  */}
                        <div className="field">
                            <input 
                                type="password" placeholder="Password" spellCheck="false" 
                                onChange={ (e) => { setPassword(e.target.value) } }
                                onKeyUp={ EnterTrigger }
                            />
                        </div>  


                        {/** Submit button  */}  
                        <div className="field">
                            <button 
                                className="submit-button"                                
                                onClick={ signRequest }
                                >sign in</button>
                        </div>


                        {/** Remember me will not be config at the momment, just leave it here for now */}

                        <div className="field field-flex">
                            <div className="checkbox-box">
                                <input type="checkbox" />
                            </div>
                            <div className="checkbox-content">
                                <span>Remember me</span>
                            </div>
                        </div>  
                    </div>


                    <div className="fields">
                        <div className="field field-flex-centre">
                            <i className="or-line"/><span className="or-text">OR</span><i className="or-line"/>
                        </div>

                        {/** Navigate to sign up page */}
                        <div className="field" style={{padding: 0}}>
                            <button className="submit-button button-not-colored" onClick={ () => { navigate('/signup') } }>sign up</button>
                        </div>

                    </div>

                </div>
                <div className ="sign-box-bg"/>
            </div>
        </div>
    )
}