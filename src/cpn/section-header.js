import { useSelector } from "react-redux"

const SectionHeader = (props) => {
    /**
     * 
     * Custom component for creating header section
     * 
     * @params
     *  - func <Function> : This function will trigger if the button is clicked
     *      -> without func, the button will disappear
     *  - title <String>   : Header title
     */

    const appMode = useSelector(state => state.appMode);    
    const { func, title } = props;

    return(
        <div className="section-header">
            <div className="section-title">
                <span>{ title || "<HEADER TITLE>" }</span>
            </div>
            {
                func ?
                    <div className="add-button">
                        <div className="button-container" onClick={ func }>
                            <div className="button-icon">
                                <i className={`plus ${ appMode ? "": "plus-light" }`}/>
                            </div>
                            <div className="button-content">
                                <span>Tạo việc</span>
                            </div>
                        </div>
                    </div>
                    : null
            }
        </div>
    )
}

export default SectionHeader;