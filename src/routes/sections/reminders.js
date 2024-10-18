import { useNavigate } from "react-router-dom";
import SearchBar from "../../cpn/search-bar"
import SectionHeader from "../../cpn/section-header";
const Reminders = () => {

    const navigator = useNavigate()

    const searchFunction = ( pattern ) => {
        console.log(pattern)
    }

    const AddTrigger = () => {
        navigator('/section/reminders/create')
    }

    return(
        <div>
            <SearchBar func = { searchFunction }/>            
            <SectionHeader 
                title = "NHẮC NHỞ"
                func  = { AddTrigger }
            />
        </div>
    )
}

export default Reminders;