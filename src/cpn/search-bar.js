import { useSelector } from "react-redux"
import { useState } from "react"


const SearchBar = ( props ) => {

    const [ pattern, setPattern ] = useState("")

    const appMode = useSelector(state => state.appMode )
    const { func } = props
    const placeHolder = "Tìm kiếm"

    const patternChangeHandler = (e) => {
        setPattern( e.target.value )
    }

    const keyUpHandler = (e) => {
        const { keyCode } = e;
        if( keyCode === 13 ){
            func( pattern )
        } 
    }

    return(
        <div className="search-bar">
            <div className="search-bar-container">
                <div className="search-icon"><i className={ `manifying-glass ${ appMode ? "" :"light-glass" }`}/></div>
                <div className="search-input">
                    <input 
                        type="text" 
                        placeholder = { placeHolder } 
                        spellCheck  = { false } 
                        onChange    = { patternChangeHandler }
                        onKeyUp     = { keyUpHandler }
                    />
                </div>
            </div>
        </div>
    )
}

export default SearchBar