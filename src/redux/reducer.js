import apiProxy from './api-proxy';

import defaultBranch from './route/default-branch';
import alertBranch from './route/alert-branch';

import lang from './configs/lang'
import functions from './configs/functions'
import Alert from './configs/alert'

const currentLang = localStorage.getItem('lang')



const initialState = {
    proxy: apiProxy,
    signed: false,
    Alert: Alert,
    lang: lang[currentLang] ?  lang[currentLang] : lang['vi'],
    functions,
}


export default ( state = initialState, action ) => {
    switch (action.branch) {

        case 'alert':
            return alertBranch( state, action );
            break;
        default: /* The branch always goes here */
            return defaultBranch( state, action )
            break;
    }
}
