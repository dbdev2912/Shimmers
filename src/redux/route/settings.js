export default ( state, action ) => {
    switch (action.type) {
        case "appmode":
            return swicthAppMode(state, action);
            break;
        
        case "setUserData":
            return saveUserData(state, action);
            break

        case "destroyUserData":
            return destroyUserData(state, action);
            break;
        default:
            return { ...state }
            break;
    }
}


const swicthAppMode = ( state, action ) => {
    /**
     * 
     * Switch appmode
     * 
     * True     => Light
     * False    => Dark
     * 
     */
    state.appMode = !state.appMode 
    return { ...state }
}

const saveUserData = ( state, action ) => {
    /**
     * 
     * Set user data include these infors:
     * 
     * "username" : <String>,
     * "fullname" : <String>,
     * "email"    : <String> => Email format,
     * "phone"    : <String> => Phone format,
     * "avatar"   : <String> => URL,
     * 
     */

    state.user = action.payload.user
    return { ...state }
}

const destroyUserData = ( state, action ) => {
    /**
     * 
     * Completely destroy user data from store
     * 
     */
    delete state.user;
    return { ...state }
}