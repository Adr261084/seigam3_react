import React, {useEffect, useLayoutEffect, useState} from "react";
import Header from "./Header";
import {Link, useNavigate} from "react-router-dom";
import swal from "sweetalert";
import crud from "../Conexiones/crud";
import base64 from "base-64";

const CrearUsuario = () => {

    const navigate = useNavigate();

    const [usuario, setUsuario] = useState({
        user: '', password: '', passwordConf: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const {user, password, passwordConf} = usuario;

    const onChange = (event) => {
        setUsuario({
            ...usuario, [event.target.name]: event.target.value
        });
    }

    const registrarUsuario = async () => {
        setIsLoading(true);
        if (usuario.password === usuario.passwordConf) {
            const data = {
                user: usuario.user, pass: base64.encode(usuario.password)
            }
            const response = await crud.POST_reg(`/sigam3_crear_usuario`, data);
            var error = response.substring(0, 5);
            console.log(error);
            if (error === 'Error') {
                const mensaje = response;
                sessionStorage.removeItem('token');
                swal({
                    title: 'error', text: mensaje, icon: 'error', buttons: {
                        confirm: {
                            text: 'Error', value: true, visible: true, className: 'btn btn-danger', closeModal: true
                        }
                    }
                });
            } else {
                const mensaje = "Felicitaciones " + response;
                swal({
                    title: 'Exito', text: mensaje, icon: 'success', buttons: {
                        confirm: {
                            text: 'Ok', value: true, visible: true, className: 'btn btn-primary', closeModal: true
                        }
                    }
                });
                navigate("/login");
            }
        } else {
            const mensaje = 'Confirmación de password no coincidente';
            sessionStorage.removeItem('token');
            swal({
                title: 'error', text: mensaje, icon: 'error', buttons: {
                    confirm: {
                        text: 'Error', value: true, visible: true, className: 'btn btn-danger', closeModal: true
                    }
                }
            });
        }
        setIsLoading(false);
    }

    const onSubmit = (evento) => {
        evento.preventDefault();
        registrarUsuario();
    }

    useLayoutEffect(() => {
        sessionStorage.setItem("PATH", "CREAR_CUENTA");
    }, [])

    return (
        <>
            <Header/>
            <div style={{ display: isLoading ? 'flex' : 'none' }} className='modal'>
                <div className='modal-content'>
                    <div className='loader'></div>
                    <div className='modal-text'>Loading...</div>
                </div>
            </div>
            <h1 className="text-5xl bg-gray-200 p-5 text-center text-black bold">
                Aqui puedes registrar tu usuario como administrador de la configuracion
            </h1>
            <div className="md:flex md:min-h-screen justify-center text-center">
                <form
                    onSubmit={onSubmit}
                    className="my-10 bg-white shadow-orange-500 rounded-lg p-10">
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
                        <input type="password"
                               placeholder="Confirmar password"
                               id="passwordConf"
                               name="passwordConf"
                               value={passwordConf}
                               onChange={onChange}
                               className="w-full mt-3 p-3 rounded-lg bg-gray-50"
                               required
                        />
                        <br/>
                        <input
                            type="submit"
                            value="Registrar Usuario"
                            className="bg-gray-600 mb-5 w-full py-3 text-white
                            uppercase font-bold rounded hover:cursor-pointer
                            hover:bg-blue-400 transition-colors"
                        />
                        <Link
                            to={"/login"}
                            className="block text-center my-5 text-blue-600 uppercase text-sm hover:text-black"
                        >Regresar
                        </Link>
                    </div>
                </form>
            </div>
        </>
    );
}

export default CrearUsuario;