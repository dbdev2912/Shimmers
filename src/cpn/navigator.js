import { useSelector } from "react-redux";
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

    return(
        <div className={ appMode ?  "light-theme": "dark-theme"}>
            <NavigationBar />
            <Sidebar />
            { children }
        </div>
    )
}

export default Navigator