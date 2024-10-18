import { useEffect } from "react"
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"


import NavigationBar from "./navigation-bar"
import Sidebar from "./sidebar"


const Navigator = ( props ) => {
    /**
     * 
     * Highest renderer for general functions which will apply on every UI
     * 
     * 
     */
    const { children } = props;
    const appMode = useSelector(state => state.appMode)


    const functions = useSelector(state => state.functions)
    const proxy     = useSelector(state => state.proxy )
    const navigator = useNavigate()
    useEffect(() => {

        /**
         * 
         * Session check
         * 
         */

        // const sessionCheck = functions.sessionCheck()
        // if( !sessionCheck ){
        //     navigator('/signin')
        // }

        /**
         * 
         * Auto sigin  for testing purpose
         * 
         */
        

        AutoSignIn()

    }, [])

    const AutoSignIn = async () => {
        /**
         * 
         * Set const authen object and send automatically to the server 
         * This damn React will delete all my data every time I save changes 
         * to my file 
         * 
         */
        const authen = {
            username: "administrator",
            password: "1"
        }
        
        const response = await fetch(`${ proxy }/api/auth/sign-in`, {
            method: "post",
            headers: {
                'content-type': "application/json"
            },
            body: JSON.stringify(authen)
        })
        const serialized_data = await response.json()
        const { data } = serialized_data
        const { user } = data

        functions.sessionEstablish( data.token )
        functions.saveUserData( user )
        
    }

    return(
        <div className={ appMode ?  "light-theme": "dark-theme"}>
            <NavigationBar />
            <Sidebar />
            <div>
                <div className="main-app">                
                    { children }                    
                </div>
                <div className="main-app-bg"/>
            </div>
        </div>
    )
}

export default Navigator