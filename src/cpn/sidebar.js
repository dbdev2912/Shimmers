import { useSelector } from "react-redux"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom" 

const Sidebar = () => {
    /**
     * 
     * RIGHT SIDEBAR 
     *  - Switch UI mode between light and dark
     *  - Show user general information
     *  - Sign out button
     */

    const functions = useSelector(state => state.functions)
    const proxy     = useSelector( state => state.proxy )
    const appMode   = useSelector( state => state.appMode )
    const user      = useSelector( state => state.user ) || {}

    const dispatch  = useDispatch()
    const navigator = useNavigate()
    const switchAppMode = () => {
        /**
         * 
         * Dispatch new mode to reducer
         * 
         */
        dispatch({
            branch: "setting",
            type: "appmode"
        })
    }

    const signOut = () => {
        /**
         * 
         * Remove token and navigate to /signin
         * 
         */
        functions.sessionDestroy()
        navigator('/signin')
    }

    return(
        <div className="side-bar">
            {/**
             * 
             * The top most section for UI mode, user and signout button
             * 
             */}
            <div className="user-bar">
                <div className="app-mode">
                    {appMode ? 
                        <div className= "track" onClick={ switchAppMode }> 
                            <i className="thumb" style={{ backgroundImage: "url(/icons/sun.png)" }}/>
                            <i className="thumb-bg"/>
                        </div>
                    :
                        <div className= "track track-right" onClick={ switchAppMode }> 
                            <i className="thumb" style={{ backgroundImage: "url(/icons/moon.png)" }}/>
                            <i className="thumb-bg"/>
                        </div>
                    }
                </div>
                <div className="avatar">
                    <img src={`${ proxy }${ user.avatar }`}/>
                </div>
                <div className="fullname">
                    <span>{ user.fullname }</span>
                </div>
                <div className="sign-out" onClick={ signOut }>
                    <i className="sign-out-icon"/>
                </div>
            </div>

            {/**
             * 
             * The rest space for flexible views
             * 
             */}
        </div>
    )
}

export default Sidebar