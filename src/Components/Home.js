import React, {useEffect, useLayoutEffect, useState} from "react";
import Header from "./Header";
import {useNavigate} from "react-router-dom";
import swal from "sweetalert";
import crud from "../Conexiones/crud";

const seleccion = {selSistema: '', selVersion: '', selRequerimiento: ''};
const setOk = {ok: 'no'};

const Home = () => {

    const navigate = useNavigate();

    const [configuracion, setConfiguracion] = useState([]);
    const [sistemas, setSistemas] = useState([]);
    const [versiones, setVersiones] = useState([]);
    const [requerimientos, setRequerimientos] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const cargarSistemas = async () => {
        setIsLoading(true);
        setConfiguracion([]);
        setSistemas([])
        setVersiones([]);
        setRequerimientos([]);
        const resp = await crud.GET('/sigam3_LIBVER');
        const response = resp.sigam3_LIBVER_Libver_R;
        for (let i = 0; i < response.length; i++) {
            setConfiguracion(configuracion => [...configuracion, response[i]]);
        }
        var aux = "";
        for (let i = 0; i < response.length; i++) {
            if (aux !== response[i].SISTEMA) {
                aux = response[i].SISTEMA
                setSistemas(sistemas => [...sistemas, {SISTEMA: response[i].SISTEMA}])
            }
        }
        setIsLoading(false);
    };
    const cargarVersiones = (sistema) => {
        setIsLoading(true);
        var aux = '';
        for (let i = 0; i < configuracion.length; i++) {
            if (sistema === configuracion[i].SISTEMA) {
                if (aux !== configuracion[i].VERSION) {
                    aux = configuracion[i].VERSION;
                    setVersiones(versiones => [...versiones, {VERSION: configuracion[i].VERSION}])
                }
            }
        }
        setIsLoading(false);
    };
    const cargarRequerimientos = async (sistema, version) => {
        setIsLoading(true);
        const data1 = {
            sistema: sistema,
            version: version
        }
        const resp = await crud.POST(`/listarRequerimientos`, data1);
        const response = resp.listarRequerimientos_ListaReq_R;
        for (let i = 0; i < response.length; i++) {
            setRequerimientos(requerimientos => [...requerimientos, {
                REQUERIMIENTO: response[i].SOLSOL,
                ESTADO: response[i].SOLEST,
                DESCRIPCION: response[i].SOLDES +
                    response[i].SOLDE1 +
                    response[i].SOLDE2 +
                    response[i].SOLDE3 +
                    response[i].SOLDE4 +
                    response[i].SOLDE5,
                CLIENTE: response[i].SOLCLI
            }])
        }
        setIsLoading(false);
    };

    useEffect(() => {
        var estaLogueado = sessionStorage.getItem('token');
        if (!estaLogueado) {
            navigate('/login');
        } else {
            cargarSistemas();
        }
    }, [navigate])

    const agregarSeleccion = async (item, value) => {
        setOk.ok = 'no';
        if (item === 'sistemas') {
            seleccion.selSistema = value;
            if (value !== '') {
                await setVersiones([]);
                await setRequerimientos([{}]);
                cargarVersiones(value)
            }
        } else if (item === 'versiones') {
            seleccion.selVersion = value;
            await setRequerimientos([]);
            cargarRequerimientos(seleccion.selSistema, seleccion.selVersion);
        } else {
            seleccion.selRequerimiento = value;
            setOk.ok = 'ok';
        }
    };

    const onChange = (event) => {
        agregarSeleccion(event.target.id, event.target.value);
    };

    function opcionesRequerimiento() {
        var seleccionSistema = document.getElementById('sistemas').value;
        if (setOk.ok === 'ok' && seleccionSistema != '-- sistema --') {
            let dataEstado = "";
            let dataDescripcion;
            let dataCliente;
            for (let i = 0; i < requerimientos.length; i++) {
                if (requerimientos[i].REQUERIMIENTO == seleccion.selRequerimiento) {
                    dataEstado = requerimientos[i].ESTADO;
                    dataDescripcion = requerimientos[i].DESCRIPCION;
                    dataCliente = requerimientos[i].CLIENTE;
                }
            }
            const data = {
                estado: dataEstado,
                descripcion: dataDescripcion,
                cliente: dataCliente
            };
            const setOk = {ok: 'no'};
            navigate("/requerimiento", {state: {conf: data, sel: seleccion}});
        } else {
            const mensaje = 'Debe seleccionar requerimiento.';
            swal({
                title: 'Error', text: mensaje, icon: 'error', buttons: {
                    confirm: {
                        text: 'Ok', value: true, visible: true, className: 'btn btn-danger', closeModal: true
                    }
                }
            });
        }
    }

    useLayoutEffect(() => {
        sessionStorage.setItem("PATH", "HOME");
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
            <div className="flex justify-start p-3">
                <div className="bordered border-2 border-orange-600 p-2 grid cols-1 place-items-center ">
                    <h1>Selecciona un Sistema</h1>
                    <select name="sistemas"
                            id="sistemas"
                            onChange={onChange}>
                        <option hidden> -- sistema --</option>
                        {sistemas.map(
                            (item, index) =>
                                <option key={index}
                                        value={item.SISTEMA}>{item.SISTEMA}
                                </option>)}
                    </select>
                </div>
                <div className="bordered border-2 border-orange-600 p-2 grid cols-1 place-items-center ">
                    <h1>Selecciona una version</h1>
                    <select name="versiones"
                            id="versiones"
                            onChange={onChange}>
                        <option hidden> -- version --</option>
                        {versiones.map(
                            (item, index) =>
                                <option key={index}
                                        value={item.VERSION}>{item.VERSION}
                                </option>)}
                    </select>
                </div>
                <div className="bordered border-2 border-orange-600 p-2 grid cols-1 place-items-center ">
                    <h1>Selecciona un Requerimiento</h1>
                    <select name="requerimientos"
                            id="requerimientos"
                            onChange={onChange}>
                        <option hidden> -- requerimiento --</option>
                        {requerimientos.map(
                            (item, index) =>
                                <option key={index}
                                        value={item.REQUERIMIENTO}>{item.REQUERIMIENTO}
                                </option>)}
                    </select>
                </div>
                <div className="bordered rounded border-orange-600 border-2 bg-gray-400 hover:bg-gray-300
                p-2 grid cols-1 place-items-center text-xl p-2 ">
                    <button onClick={opcionesRequerimiento}>Validar datos</button>
                </div>
            </div>
        </>
    );
}

export default Home;