import React, {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import swal from "sweetalert";

const Header = () => {
    const navigate = useNavigate();

    const [opcion, setOpcion] = useState();

    useEffect (() => {
      setOpcion("Login")
      var logueado = sessionStorage.getItem("token") || "";
      if (logueado === "") {
          var path = sessionStorage.getItem("PATH") || "";
          if (path != "CREAR_CUENTA"){
              console.log(sessionStorage.getItem("PATH"))
            navigate("/login");
          } else {
              console.log("No es crear cuenta")
          }
      } else {
          setOpcion("Cerrar sesion")
      }
    }, [navigate]);

    const onClick = (evento) => {
        evento.preventDefault();
        sessionStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <div className="md:flex md:justify-between p-8 bg-gradient-to-r from-orange-700 via-red-900 to-orange-700 ">
            <div className="md:flex md:justify-between ">
                <h2 className="text-4xl text-black font-bold text-center mb-5 md:mb-0 hover:text-red-900 ">
                    Sigam 3
                </h2>
            </div>
            <h2 className="text-2xl text-gray-200 font-bold text-center mb-5 md:mb-0 hover:text-gray-100 ">
                {sessionStorage.getItem('token') || ''}
            </h2>
                <div >
                <Link to="/" className="py-2 px-5 text-blue-900 text-xl border-2 rounded bg-gray-300 hover:bg-gray-400 hover:cursor-pointer">Home</Link>
                    <span className="px-3"></span>
                    <button onClick={onClick} value={opcion} className="py-2 px-5 text-blue-900 text-xl border-2 rounded bg-gray-300 hover:bg-gray-400 hover:cursor-pointer">{opcion}</button>
                </div>
        </div>
    );
}

export default Header;