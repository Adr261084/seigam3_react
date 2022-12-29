import React from "react";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import './App.css';
import Home from "./Components/Home";
import Login from "./Components/Login";


function App() {
    return (
        <div className="App">
            <header className="App-header">
                <Router>
                    <Routes>
                        <Route path="/" exact element={<Home/>}/>
                        <Route path="/login" exact element={<Login/>}/>
                    </Routes>
                </Router>
            </header>
        </div>
    );
}

export default App;
