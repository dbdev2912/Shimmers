export default ( state, action ) => {
    switch (action.type) {
        case "alert-switch":                  
            return AlertSwitch(state, action)            
        default:
            return { ...state }
            break;
    }
}


const AlertSwitch = (state, action) => {

    /**
     * 
     * Switching Alert visible state 
     * 
     */
    state.Alert.state = action.payload.state
    return { ...state }
}