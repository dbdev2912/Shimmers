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
    }, [])

        

    return(
        <div>
            <div className="main-app">
                <h1>Home</h1>
                
            </div>
            <div className="main-app-bg"/>
        </div>
    )
}