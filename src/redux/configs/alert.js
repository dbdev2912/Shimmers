import store from '../store'

const Alert = {

    /**
     * state: <Bool> => Alert visible state 
     * type: Enum<String>['success', 'warning', 'error'] => Decides which set of title and icon will be chose
     * message: The message that appears in the middle of the alert box
     * 
     */
    state: false,    
    type: 'success',
    message: '',


    types: {
        success: 'success',
        warning: 'warning',
        error  : 'error',
    },
    
    ClassesTypeName: {
        /**
         * 
         * These are scss class in which the icon was define. See more in /src/css/alert/index.scss
         * 
         */
        'success': 'alert-success',
        'warning': 'alert-warning',
        'error'  : 'alert-error',
    },

    TitleName: {
        'success': 'Succeed',
        'warning': 'Warning',
        'error'  : 'Error',
    },

    commandHide: () => {
        /**
         * 
         * Dispatch new state to Alert, this function causes the Alert to disappear
         * 
         */
        store.dispatch({
            branch: 'alert',
            type: 'alert-switch',
            payload: {
                state: false
            }
        })
    },

    commandShow: () => {

        /**
         * 
         * Dispatch new state to Alert, this function causes the Alert to appear
         * 
         */
        
        store.dispatch({
            branch: 'alert',
            type: 'alert-switch',
            payload: {
                state: true
            }
        })
    },

    getTitleName: () => {
        /**
         * Get title based on Alert current type
         * 
         */

        return Alert.TitleName[Alert.type]
    },

    getTypeName: () => {
        /**
         * Get icon classname based on Alert current type
         * 
         */
        return Alert.ClassesTypeName[ Alert.type ]
    },


    throwSuccess: ( message = "Action succeeded") => {
        /**
         * 
         * Automatecally set Alert to success state with given message and show it
         * 
         * @params
         * message <String>
         * 
         */
        Alert.type      = Alert.types.success
        Alert.message   = message 
        Alert.commandShow()
    },

    throwWarning: ( message = "Danger!") => {

        /**
         * 
         * Automatecally set Alert to warning state with given message and show it
         * 
         * @params
         * message <String>
         * 
         */

        Alert.type      = Alert.types.warning
        Alert.message   = message 
        Alert.commandShow()
    },

    throwError: ( message = "Something went wrong!!") => {

        /**
         * 
         * Automatecally set Alert to error state with given message and show it
         * 
         * @params
         * message <String>
         * 
         */

        Alert.type      = Alert.types.error
        Alert.message   = message 
        Alert.commandShow()
    },
}

export default Alert