import { useEffect } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

export default () => {
    const functions = useSelector(state => state.functions)
    const navigator = useNavigate()
    useEffect(() => {
        const sessionCheck = functions.sessionCheck()
        if( !sessionCheck ){
            navigator('/signin')
        }
    })

    const signout = () => {
        functions.sessionDestroy()
        navigator('/signin')
    }

    

    return(
        <div>
            <h1>Home</h1>
            <button onClick={ signout }>sign out</button>
        </div>
    )
}