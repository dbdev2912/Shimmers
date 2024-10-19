import { useSelector } from "react-redux"

const CustomAlert = () => {
    const Alert = useSelector( state => state.Alert )
    const AlertState = useSelector( state => state.Alert.state )
    
    
    
    return(
        <div className="alert" style={{ display: AlertState ? "flex": "none" }}>
            <div className="alert-content" style={{ display: AlertState ? "block": "none" }}>
                <div className="alert-header">
                    <span>{ Alert.getTitleName()}</span>
                </div>
                <div className="alert-icon">
                    <i className={ Alert.getTypeName() }/>
                </div>
                <div className="alert-message">
                    <span>{ Alert.message }</span>
                </div>
                <div className="alert-button">
                    <button onClick={ Alert.commandHide }>Got it!</button>
                </div>
            </div>
            <div onClick={ Alert.commandHide } className="alert-bg"/>
        </div>
    )
}

export default CustomAlert