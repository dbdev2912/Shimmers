import React, { useEffect } from 'react';
import { useSelector } from 'react-redux'

import {
    BrowserRouter as Router,
    Routes,
    Route,
} from "react-router-dom";


import './css/index.scss';


import { SignIn, SignUp, Home } from './routes'
import Alert from './cpn/moc-alert';


function App() {

    const vi = useSelector( state => state.lang )
    const functions  = useSelector( state => state.functions )
    useEffect(() => {
        
    }, [])
    
        return (
            <>
                <Router>
                    <Routes>                    
                        <Route exac path="/signin" element={<SignIn />} />
                        <Route exac path="/signup" element={<SignUp />} />
                        <Route exac path="/" element={<Home />} />                    
                    </Routes>
                </Router>
                <Alert />
            </>

        )
}

export default App;
