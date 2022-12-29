import React, {useEffect, useState} from "react";
import Header from "./Header";
import {Link, useNavigate} from "react-router-dom";
import swal from "sweetalert";
import crud from "../Conexiones/crud";

const Login = () => {

    const navigate = useNavigate();

    const [usuario, setUsuario] = useState({
        user: '', password: ''
    });

    const {user, password} = usuario;

    const onChange = (event) => {
        setUsuario({
            ...usuario, [event.target.name]: event.target.value
        });
    }

    const autenticarUsuario = async () => {
        const data = {
            user: usuario.user, password: usuario.password
        }
        const response = await crud.GET_Init(`/sigam3_login/?usuario=`, data);
        if (data.user === 'X') {
            const mensaje = "No se ha logrado iniciar sesion";
            localStorage.removeItem('token');
            swal({
                title: 'error', text: mensaje, icon: 'error', buttons: {
                    confirm: {
                        text: 'Ok', value: true, visible: true, className: 'btn btn-danger', closeModal: true
                    }
                }
            });
        } else {
            localStorage.setItem('token', 'logueado');
            const mensaje = "Bienvenido " + response;
            swal({
                title: 'Saludo', text: mensaje, icon: 'success', buttons: {
                    confirm: {
                        text: 'Ok', value: true, visible: true, className: 'btn btn-primary', closeModal: true
                    }
                }
            });
            navigate("/");
        }
    }

    const onSubmit = (evento) => {
        evento.preventDefault();
        autenticarUsuario();
    }

    useEffect(() => {
        const logueado = localStorage.getItem("token") || "";
        if (logueado !== "") {
            navigate("/");
        }
    }, [])

    return (
        <>
            <Header/>
            <div className="md:flex md:min-h-screen ">
                <h1 className="p-3 text-black ">Bienvenido al sistema de gestion de ambientes</h1>

                <form
                    onSubmit={onSubmit}
                    className="my-10 bg-white shadow-orange-500 rounded-lg p-10"
                >
                    <div className="my-5">
                        <label className="uppercase text-gray-600 block text-xl font-bold">Usuario
                        </label>
                        <input type="text" placeholder="usuario AS400"
                               id="user" name="user" value={user} onChange={onChange}
                               className="w-full mt-3 p-3 rounded-lg bg-gray-50"
                               required
                        />
                        <br/>
                        <label className="uppercase text-gray-600 block text-xl font-bold">password
                        </label>
                        <input type="password"
                               placeholder="password de registro"
                               id="password"
                               name="password"
                               value={password}
                               onChange={onChange}
                               className="w-full mt-3 p-3 rounded-lg bg-gray-50"
                               required
                        />
                        <br/>
                        <input
                            type="submit"
                            value="Iniciar Sesión"
                            className="bg-gray-600 mb-5 w-full py-3 text-white
                            uppercase font-bold rounded hover:cursor-pointer
                            hover:bg-blue-400 transition-colors"
                        />
                        <Link
                            to={"/"}
                            className="block text-center my-5 text-blue-600 uppercase text-sm hover:text-black"
                        >Regresar</Link>
                    </div>
                </form>
            </div>
        </>
    );
}

export default Login;