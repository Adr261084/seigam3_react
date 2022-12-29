import React, {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";

const Header = () => {
    const navigate = useNavigate();

    const [opcion, setOpcion] = useState();

    useEffect (() => {
        setOpcion("Login")
      var logueado = localStorage.getItem("token") || "";
      if (logueado === "") {
          navigate("/login");
      } else {
          setOpcion("Cerrar sesion")
      }
    }, [navigate]);

    const onClick = (evento) => {
        evento.preventDefault();
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <div className="md:flex md:justify-between p-8 bg-gradient-to-r from-orange-700 via-red-900 to-orange-700 ">
            <div className="md:flex md:justify-between ">
                <h2 className="text-4xl text-black font-bold text-center mb-5 md:mb-0 hover:text-red-900 ">
                    Sigam 3
                </h2>
            </div>
                <div >
                <Link to="/" className="py-2 px-5 text-blue-900 text-xl border-2 rounded bg-gray-300 hover:bg-gray-400 hover:cursor-pointer">Home</Link>
                    <span className="px-3"></span>
                    <button onClick={onClick} value={opcion} className="py-2 px-5 text-blue-900 text-xl border-2 rounded bg-gray-300 hover:bg-gray-400 hover:cursor-pointer">{opcion}</button>
                </div>
        </div>
    );
}

export default Header;