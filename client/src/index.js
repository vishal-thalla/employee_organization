import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/main.css'
import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import NavBar from './components/Navbar';

import {
    BrowserRouter as Router,
    Switch,
    Route
} from 'react-router-dom'
import HomePage from './components/Home';
import CRUEmployeePage from './components/CRUEmployee';


export const UserContext = React.createContext(null);

const App=()=>{
    const [employee, setEmployee] = useState(null)
    
    return (
        <Router>
        <div className="">
            <UserContext.Provider value={{employee, setEmployee}}>
                <NavBar/>
                <Switch>
                    <Route path="/add_employee">
                        <CRUEmployeePage readonly={false} employee={null} />
                    </Route>
                    <Route path="/view_employee">
                        <CRUEmployeePage readonly={true} employee={employee}/>
                    </Route>
                    <Route path="/edit_employee">
                        <CRUEmployeePage readonly={false} employee={employee}/>
                    </Route>
                    <Route path="/">
                        <HomePage/>
                    </Route>
                </Switch>
            </UserContext.Provider>
        </div>
        </Router>
    )
}


ReactDOM.render(<App/>,document.getElementById('root'))