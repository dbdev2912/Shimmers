import React, { useEffect } from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
} from "react-router-dom";


import './css/index.scss';


import { SignIn, SignUp, Home, Reminders, ReminderCreator } from './routes'
import Alert from './cpn/moc-alert';

import Navigator from './cpn/navigator';

function App() {

    useEffect(() => {
        
    }, [])
    
        return (
            <>
                <Router>
                    <Routes>                    
                        <Route exac path="/signin" element={<SignIn />} />
                        <Route exac path="/signup" element={<SignUp />} />
                        <Route exac path="/" element={<Navigator><Home /></Navigator>} />    
                        <Route exac path="/section/reminders" element={<Navigator><Reminders /></Navigator>} />  
                        <Route exac path="/section/reminders/create" element={<Navigator><ReminderCreator /></Navigator>} />                  
                    </Routes>
                </Router>
                <Alert />
            </>

        )
}

export default App;
