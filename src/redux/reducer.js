import apiProxy from './api-proxy';

import defaultBranch from './route/default-branch';
import alertBranch from './route/alert-branch';
import settingsBranch from './route/settings';

import lang from './configs/lang'
import functions from './configs/functions'
import Alert from './configs/alert'

const currentLang = localStorage.getItem('lang')



const initialState = {
    proxy: apiProxy,
    appMode: true,
    signed: false,
    Alert: Alert,
    lang: lang[currentLang] ?  lang[currentLang] : lang['vi'],
    functions,
}


const RootRuducer = ( state = initialState, action ) => {
    switch (action.branch) {

        case 'alert':
            return alertBranch( state, action );


        case 'setting':
            return settingsBranch( state, action );

        default: /* The branch always goes here */
            return defaultBranch( state, action )

    }
}


export default RootRuducer;