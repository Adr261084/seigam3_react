import React from "react";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import './App.css';
import Home from "./Components/Home";
import Login from "./Components/Login";
import CrearUsuario from "./Components/CrearUsuario";
import Requerimiento from "./Components/Requerimiento";


function App() {
    return (
        <div className="App">
            <header className="App-header">
                <Router>
                    <Routes>
                        <Route path="/" exact element={<Home/>}/>
                        <Route path="/login" exact element={<Login/>}/>
                        <Route path="/registrar-usuario" exact element={<CrearUsuario/>}/>
                        <Route path="/requerimiento" exact element={<Requerimiento/>}/>
                    </Routes>
                </Router>
            </header>
        </div>
    );
}

export default App;
