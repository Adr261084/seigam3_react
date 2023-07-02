import React, {useEffect, useLayoutEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import crud from "../Conexiones/crud";
import Header from "./Header";
import swal from "sweetalert";


const Requerimiento = () => {

    const navigate = useNavigate();
    const location = useLocation();

    var paramSel = {};
    var paramConf = {};

    const [listaPaso, setListaPaso] = useState(
        []
    )
    const [isLoading, setIsLoading] = useState(false);
    const [arrayPaso, setArrayPaso] = useState({});
    try {
        paramSel = location.state.sel;
        paramConf = location.state.conf;
    } catch (e) {
        navigate("/");
    }
    useLayoutEffect(() => {
        var estaLogueado = sessionStorage.getItem('token');
        if (!estaLogueado) {
            navigate('/login');
        } else {
            setListaProgramas([]);
            cargarProgramas();
            setListaEntidades([]);
            cargarEntidades();
        }
    }, []);

    const {cliente, descripcion} = paramConf;
    const {selSistema, selVersion, selRequerimiento} = paramSel;
    const [listaProgramas, setListaProgramas] = useState([]);
    const [listaEntidades, setListaEntidades] = useState([]);
    const [itemsSeleccionados, setItemsSeleccionados] = useState(0);


    const [estado, setEstado] = useState(paramConf.estado);

    const [estadoRB, setEstadoRB] = useState(estado);
    const [origenRB, setOrigenRB] = useState("DES");
    const [destinoRB, setDestinoRB] = useState("SOP");

    const onOrigenChange = evento => {
        setOrigenRB(evento.target.value);
    }
    const onEstadoChange = evento => {
        setEstadoRB(evento.target.value);
    }
    const onDestinoChange = evento => {
        setDestinoRB(evento.target.value);
    }

    function onClickRegresar() {
        navigate('/');
    }

    async function cargarProgramas() {
        const data = {
            sistema: selSistema,
            version: selVersion,
            requerimiento: selRequerimiento
        }
        await crud.POST('/listarProgramas', data)
            .then(response => response)
            .then(data => {
                const respProgramas = data.listarProgramas_Programas_R;
                for (let i = 0; i < respProgramas.length; i++) {
                    setListaProgramas(listaProgramas => [...listaProgramas, {
                        PROGRAMA: respProgramas[i].PROPRO,
                        DESCRIPCION: respProgramas[i].PRODES,
                        TIPO_1: respProgramas[i].PROCOD,
                        TIPO_2: respProgramas[i].PROTIP,
                        TIENE_PANTALLA: respProgramas[i].PROIN2,
                        PANTALLA: respProgramas[i].PRONO1,
                        SELECCIONADO: false
                    }]);
                }
            })
            .catch(err => {
                console.log(err);
            });
    }

    async function cargarEntidades() {
        setIsLoading(true);
        setListaEntidades([]);
        const data = {
            sistema: selSistema,
            version: selVersion,
            requerimiento: selRequerimiento
        }
        await crud.POST('/listarEntidades', data)
            .then(response => response)
            .then(data => {
                const respEntidades = data.listarEntidades_Entidades_R;
                for (let i = 0; i < respEntidades.length; i++) {
                    setListaEntidades(listaEntidades => [...listaEntidades, {
                        ENTIDAD: respEntidades[i].ENTENT,
                        DESCRIPCION: respEntidades[i].ENTDES,
                        JOURNAL: respEntidades[i].ENTR10,
                        ENTREGA: respEntidades[i].ENTFUE,
                        TIPO: respEntidades[i].ENTCOD,
                        SELECCIONADO: false
                    }]);
                }
            })
            .catch(err => {
                console.log(err);
            });
        setIsLoading(false);

    }

    function cambiarEstado(evento) {
        setIsLoading(true);
        evento.preventDefault();
        var estados = ['ENS', 'PAC', 'ENT', 'RCH', 'CER']
        if (!estados.includes(estadoRB) || estado == estadoRB) {
            var mensaje = '';
            if (!estados.includes(estadoRB)) {
                mensaje = 'Debe seleccionar nuevo estado';
            } else {
                mensaje = 'Debe seleccionar un estado diferente al actual';
            }
            swal({
                title: 'Error!',
                text: mensaje,
                icon: 'error'
            });
        } else {
            const data = {
                sistema: selSistema,
                requerimiento: selRequerimiento,
                estado: estadoRB
            }
            swal({
                title: "Está seguro de cambiar el estado?",
                text: "Si cambia a Cerrado o Rechazado no podrá deshacer el cambio",
                icon: "warning",
                buttons: [
                    'Cancelar',
                    'Continuar'
                ],
                dangerMode: true,
            }).then(async function (isConfirm) {
                if (isConfirm) {
                    const response = await crud.PUT('/actualizarEstadoRequerimiento', data);
                    if (response === 200) {
                        setEstado(estadoRB);
                        swal({
                            title: 'Enviado!',
                            text: 'Se ha cambiado el estado del requerimiento. Status:' + response,
                            icon: 'success'
                        });
                    } else {
                        swal({
                            title: 'Error!',
                            text: 'Ha fallado la peticion. ' + response,
                            icon: 'error'
                        });
                    }
                } else {
                    swal("Cancelado", "No se realizó cambio en estado de requerimiento", "error");
                }
            })
        }
        setIsLoading(false);

    }

    const actualizaEstadoPrograma = async index => {
        setIsLoading(true);
        setListaProgramas(
            listaProgramas.map((programa, currentIndex) => {
                    if (currentIndex === index) {
                        if (!programa.SELECCIONADO === true) {
                            setItemsSeleccionados(itemsSeleccionados + 1)
                            setListaPaso(listaPaso => [...listaPaso, {
                                    tipo: 'PROGRAMA',
                                    nombre: programa.PROGRAMA
                                }]
                            )
                        } else {
                            setItemsSeleccionados(itemsSeleccionados - 1)
                            setListaPaso((current) =>
                                current.filter((listaPaso) => listaPaso.nombre !== programa.PROGRAMA))
                        }
                        return {...programa, SELECCIONADO: !programa.SELECCIONADO}
                    } else {
                        return programa
                    }
                }
            )
        )
        setIsLoading(false);
    }

    const actualizaEstadoEntidad = index => {
        setIsLoading(true);
        setListaEntidades(
            listaEntidades.map((entidad, currentIndex) => {
                    if (currentIndex === index) {
                        if (!entidad.SELECCIONADO === true) {
                            setItemsSeleccionados(itemsSeleccionados + 1)
                            setListaPaso(listaPaso => [...listaPaso, {
                                    tipo: 'ENTIDAD',
                                    nombre: entidad.ENTIDAD
                                }]
                            )
                        } else {
                            setItemsSeleccionados(itemsSeleccionados - 1)
                            setListaPaso((current) =>
                                current.filter((listaPaso) => listaPaso.nombre !== entidad.ENTIDAD))
                        }
                        return {...entidad, SELECCIONADO: !entidad.SELECCIONADO}
                    } else {
                        return entidad
                    }
                }
            )
        )
        setIsLoading(false);

    }

    const selectAllProgramas = () => {
        setListaProgramas(listaProgramas.map(programa => ({...programa, SELECCIONADO: true})))
        var cant = 0;
        listaProgramas.map((itemPrograma) => {
            var aux = 0;
            listaPaso.map((itemPaso) => {
                if (itemPrograma.PROGRAMA === itemPaso.nombre) {
                    aux = 1;
                }
            })
            if (aux === 0) {
                setListaPaso(listaPaso => [...listaPaso, {
                    tipo: 'PROGRAMA',
                    nombre: itemPrograma.PROGRAMA
                }])
                cant++
            }
        })
        setItemsSeleccionados(itemsSeleccionados + cant)
    }

    const unSelectAllProgramas = () => {
        setListaProgramas(
            listaProgramas.map(programa => ({...programa, SELECCIONADO: false}))
        )
        var cant = 0
        listaProgramas.map((itemPrograma) => {
            var aux = 0;
            listaPaso.map((itemPaso) => {
                if (itemPrograma.PROGRAMA === itemPaso.nombre) {
                    aux = 1
                    cant++
                }
            })
            if (aux === 1) {
                setListaPaso(
                    (current) => current.filter(
                        (listaPaso) => listaPaso.nombre !== itemPrograma.PROGRAMA))
            }
        })
        setItemsSeleccionados(itemsSeleccionados - cant)
    }

    const selectAllEntidades = () => {
        setListaEntidades(listaEntidades.map(entidad => ({...entidad, SELECCIONADO: true})))
        var cant = 0
        listaEntidades.map((itemEntidad) => {
            var aux = 0;
            listaPaso.map((itemPaso) => {
                if (itemEntidad.ENTIDAD === itemPaso.nombre) {
                    aux = 1;
                }
            })
            if (aux === 0) {
                setListaPaso(listaPaso => [...listaPaso, {
                    tipo: 'ENTIDAD',
                    nombre: itemEntidad.ENTIDAD
                }])
                cant++
            }
        })
        setItemsSeleccionados(itemsSeleccionados + cant)
    }

    const unSelectAllEntidades = () => {
        setListaEntidades(
            listaEntidades.map(entidad => ({...entidad, SELECCIONADO: false}))
        )
        var cant = 0;
        listaEntidades.map((itemEntidad) => {
            var aux = 0;
            listaPaso.map((itemPaso) => {
                if (itemEntidad.ENTIDAD === itemPaso.nombre) {
                    aux = 1;
                }
            })
            if (aux === 1) {
                setListaPaso(
                    (current) => current.filter(
                        (listaPaso) => listaPaso.nombre !== itemEntidad.ENTIDAD))
                cant++
            }
        })
        setItemsSeleccionados(itemsSeleccionados - cant)
    }


    async function onClickPasar() {
        console.log(listaPaso)
        if (itemsSeleccionados === 0) {
            const mensaje = 'Debe seleccionar almenos un Programa o Entidad';
            swal({
                title: 'Error!',
                text: mensaje,
                icon: 'error'
            });
        } else {
            //Buscar y llamar si hay fuentes entidades
            var biblioteca = '';
            var consecutivo = 0
            var tipo = ''
            listaPaso.map(
                (itemPaso) => {
                    if (itemPaso.tipo === 'ENTIDAD') {
                        listaEntidades.map((itemEntidad) => {
                            if (itemEntidad.ENTIDAD === itemPaso.nombre) {
                                if (itemEntidad.FUENTE === 'F' || itemEntidad.FUENTE === 'A') {

                                }
                            }
                        })
                    }
                }
            );
            setArrayPaso({
                biblioteca: biblioteca,
                listaFuentes: {
                    archivo: "fuente",
                    fuentes: []
                },
                consecutivoSavf: consecutivo,
                tipoEntrega: tipo
            });
            setIsLoading(true);
            crud.POST('/crearSavefileOrigen', arrayPaso)
            setIsLoading(false);

            //Buscar y llamar si hay fuentes programas
            var biblioteca = '';
            var consecutivo = 0
            var tipo = ''
            setArrayPaso({
                BIBLIOTECA: biblioteca,
                LISTA_FTES: {
                    FUENTE: []
                },
                CONSECUTIVO: consecutivo,
                TIPO: tipo
            });
            setIsLoading(true);
            crud.POST('/crearSavefileOrigen', arrayPaso)
            setIsLoading(false);
            //Buscar y llamar si hay objetos con contenido entidades
            var biblioteca = '';
            var consecutivo = 0
            var tipo = ''
            setArrayPaso({
                BIBLIOTECA: biblioteca,
                LISTA_FTES: {
                    FUENTE: []
                },
                CONSECUTIVO: consecutivo,
                TIPO: tipo
            });
            crud.POST('/crearSavefileOrigen', arrayPaso)

            //Buscar y llamar si hay objetos programas
            var biblioteca = '';
            var consecutivo = 0
            var tipo = ''
            setArrayPaso({
                BIBLIOTECA: biblioteca,
                LISTA_FTES: {
                    FUENTE: []
                },
                CONSECUTIVO: consecutivo,
                TIPO: tipo
            });
            setIsLoading(true);
            crud.POST('/crearSavefileOrigen', arrayPaso)
            setIsLoading(false);
            //buscar y llamar si hay objetos script
            var biblioteca = '';
            var consecutivo = 0
            var tipo = ''
            setArrayPaso({
                BIBLIOTECA: biblioteca,
                LISTA_FTES: {
                    FUENTE: []
                },
                CONSECUTIVO: consecutivo,
                TIPO: tipo
            });
            crud.POST('/crearSavefileOrigen', arrayPaso)

            console.log("<-------->")
            listaPaso.map((elemento) => {
                console.log(elemento.tipo, elemento.nombre)
            })
        }
    }

    useLayoutEffect(() => {
        sessionStorage.setItem("PATH", "REQUERIMIENTOS");
    }, [])


    return (<>
        <Header/>
        <div style={{display: isLoading ? 'flex' : 'none'}} className='modal'>
            <div className='modal-content'>
                <div className='loader'></div>
                <div className='modal-text'>Loading...</div>
            </div>
        </div>
    <div className="p-5 bg-gray-100">
        <h1 className="text-5xl bg-gray-200 p-5 text-center text-black bold">
            Opciones de trabajo con requerimiento</h1>
        <br/>
        <div
            className="text-xl text-indigo-900 justify-start flex">
            <div className="p-2">
                <label className="px-1 font-bold">Sistema: </label>
                <label className="px-1">{selSistema}</label>
            </div>
            <div className="p-2">
                <label className="px-1 font-bold">Version: </label>
                <label className="px-1">{selVersion}</label>
            </div>
            <div className="p-2">
                <label className="px-1 font-bold">Requerimiento: </label>
                <label className="px-1">{selRequerimiento}</label>
            </div>
        </div>
        <div
            className="text-xl text-indigo-900 justify-start flex ">
            <div className="p-2">
                <label className="px-1 font-bold">Cliente: </label>
                <label className="px-1">{cliente}</label>
            </div>
            <div className="p-2">
                <label className="px-1 font-bold">Descripción: </label>
                <label className="px-1">{descripcion}</label>
            </div>
        </div>
        <div className="border-black border-2 p-1">
            <label className="text-xl p-2 flex place-content-between font-bold">
                Estado actual requerimiento: {estado}</label>
            <input
                type="radio"
                name="cambioEstado"
                value="ENS"
                id="ENS"
                className="p-2"
                checked={estadoRB === "ENS"}
                onChange={onEstadoChange}
            />
            <label htmlFor="ENS" className="text-xl p-1">Entrega a Soporte</label><br/>
            <input
                type="radio"
                name="cambioEstado"
                value="PAC"
                id="PAC"
                className="p-2"
                checked={estadoRB === "PAC"}
                onChange={onEstadoChange}
            />
            <label htmlFor="PAC" className="text-xl p-1">Paso a Cliente</label><br/>
            <input
                type="radio"
                name="cambioEstado"
                value="ENT"
                id="ENT"
                className="p-2"
                checked={estadoRB === "ENT"}
                onChange={onEstadoChange}
            />
            <label htmlFor="ENT" className="text-xl p-1">Entrega</label><br/>
            <input
                type="radio"
                name="cambioEstado"
                value="CER"
                id="CER"
                className="p-2"
                checked={estadoRB === "CER"}
                onChange={onEstadoChange}
            />
            <label htmlFor="CER" className="text-xl p-1">Cerrar</label><br/>
            <input
                type="radio"
                value="RCH"
                id="RCH"
                className="p-2"
                checked={estadoRB === "RCH"}
                onChange={onEstadoChange}
            />
            <label htmlFor="RCH" className="text-xl p-1">Rechazar</label><br/>
            <br/>
            <input type="button" value="Actualizar estado" onClick={cambiarEstado}
                   className="border-lg border-2 rounded p-2 bg-red-400 text-white border-black hover:bg-red-500"/>
        </div>
        <br/>
        <div className="border-black border-2 flex justify-start">
            <div className="p-1">
                <label className="text-xl p-2 flex place-content-between font-bold">
                    Origen
                </label>
                <input
                    type="radio"
                    name="Origen"
                    id="DES_O"
                    value="DES"
                    className="p-2"
                    checked={origenRB === "DES"}
                    onChange={onOrigenChange}
                /><label htmlFor="DES_O" className="text-xl p-1">Desarrollo</label><br/>
                <input
                    type="radio"
                    name="Origen"
                    id="SOP_O"
                    value="SOP"
                    className="p-2"
                    checked={origenRB === "SOP"}
                    onChange={onOrigenChange}
                /><label htmlFor="SOP_O" className="text-xl p-1">Soporte</label><br/>
                <input
                    type="radio"
                    name="Origen"
                    id="CLI_O"
                    value="CLI"
                    className="p-2"
                    checked={origenRB === "CLI"}
                    onChange={onOrigenChange}
                /><label htmlFor="CLI_O" className="text-xl p-1">Cliente</label>
            </div>
            <div className="px-5"></div>
            <div className="p-1">
                <label className="text-xl p-2 flex place-content-between font-bold">
                    Destino
                </label>
                <input
                    type="radio"
                    name="Destino"
                    id="SOP_D"
                    value="SOP"
                    className="p-2"
                    checked={destinoRB === "SOP"}
                    onChange={onDestinoChange}
                /><label htmlFor="SOP_D" className="text-xl p-1">Soporte</label><br/>
                <input
                    type="radio"
                    name="Destino"
                    id="CLI_D"
                    value="CLI"
                    className="p-2"
                    checked={destinoRB === "CLI"}
                    onChange={onDestinoChange}
                /><label htmlFor="CLI_D" className="text-xl p-1">Cliente</label><br/>
                <input
                    type="radio"
                    name="Destino"
                    id="GIT_D"
                    value="GIT"
                    className="p-2"
                    checked={destinoRB === "GIT"}
                    onChange={onDestinoChange}
                /><label htmlFor="GIT_D" className="text-xl p-1">Despliegue</label><br/>
            </div>
        </div>
        <br/>
        <h4>{itemsSeleccionados}</h4>
        <br/>
        <div className="border-2 p-2 border-black columns-1 justify-items-between ">
            <label className="text-xl p-2 flex place-content-between font-bold">Lista Programas</label>
            <input type="submit" onClick={selectAllProgramas} value="Todos"
                   className="border-lg border-2 rounded p-2 bg-blue-300 text-white border-black hover:bg-blue-400"/>
            <span> </span>
            <input type="submit" onClick={unSelectAllProgramas} value="Ninguno"
                   className="border-lg border-2 rounded p-2 bg-blue-300 text-white border-black hover:bg-blue-400"/>
            <br/>
            <table className="border-collapse border border-slate-500">
                <thead>
                <tr>
                    <th className="border border-slate-600 text-xl px-1">Programa</th>
                    <th className="border border-slate-600 text-xl px-1">Pantalla</th>
                    <th className="border border-slate-600 text-xl px-1">Tipo Programa</th>
                    <th className="border border-slate-600 text-xl px-1">Descripción</th>
                </tr>
                </thead>
                <tbody>
                {
                    listaProgramas.map(
                        (item, index) =>
                            <tr key={index}>
                                <td className="justify-between px-1">
                                    <input
                                        type="checkbox"
                                        index={index}
                                        checked={item.SELECCIONADO}
                                        onChange={async () => await actualizaEstadoPrograma(index)}
                                        id={item.PROGRAMA}
                                    />
                                    <label htmlFor={item.PROGRAMA} className="text-xl px-1">
                                        {item.PROGRAMA}
                                    </label>
                                </td>
                                <td className="justify-between text-xl px-1">
                                    <label htmlFor={item.PROGRAMA} className="text-xl px-1">
                                        {item.PANTALLA}
                                    </label>
                                </td>
                                <td className="justify-between text-xl px-1">
                                    <label htmlFor={item.PROGRAMA} className="text-xl px-1">
                                        {item.TIPO_1}
                                    </label>
                                </td>
                                <td className="justify-between text-xl px-1">
                                    <label htmlFor={item.PROGRAMA} className="text-xl px-1">
                                        {item.DESCRIPCION}
                                    </label>
                                </td>
                            </tr>
                    )
                }
                </tbody>
            </table>
        </div>
        <br/>
        <div className="border-2 p-2 border-black columns-1 justify-items-between ">
            <label className="text-xl p-2 flex place-content-between font-bold">Lista Entidades </label>
            <input type="submit" onClick={selectAllEntidades} value="Todos"
                   className="border-lg border-2 rounded p-2 bg-blue-300 text-white border-black hover:bg-blue-400"/>
            <span> </span>
            <input type="submit" onClick={unSelectAllEntidades} value="Ninguno"
                   className="border-lg border-2 rounded p-2 bg-blue-300 text-white border-black hover:bg-blue-400"/>
            <br/>
            <table className="border-collapse border border-slate-500">
                <thead>
                <tr>
                    <th className="border border-slate-600 text-xl px-1">Entidad</th>
                    <th className="border border-slate-600 text-xl px-1">Tipo</th>
                    <th className="border border-slate-600 text-xl px-1">Entrega</th>
                    <th className="border border-slate-600 text-xl px-1">Journal</th>
                    <th className="border border-slate-600 text-xl px-1">Descripción</th>
                </tr>
                </thead>
                <tbody>
                {
                    listaEntidades.map(
                        (item, index) =>
                            <tr key={index}>
                                <td className="justify-between px-1">
                                    <input
                                        type="checkbox"
                                        index={index}
                                        checked={item.SELECCIONADO}
                                        onChange={async () => await actualizaEstadoEntidad(index)}
                                        id={item.ENTIDAD}
                                    />
                                    <label htmlFor={item.ENTIDAD} className="text-xl px-1">
                                        {item.ENTIDAD}
                                    </label>
                                </td>
                                <td className="justify-between text-xl px-1">
                                    <label htmlFor={item.ENTIDAD} className="text-xl px-1">
                                        {item.TIPO}
                                    </label>
                                </td>
                                <td className="justify-between text-xl px-1">
                                    <label htmlFor={item.ENTIDAD} className="text-xl px-1">
                                        {item.ENTREGA}
                                    </label>

                                </td>
                                <td className="justify-between text-xl px-1">
                                    <label htmlFor={item.ENTIDAD} className="text-xl px-1">
                                        {item.JOURNAL}
                                    </label>

                                </td>
                                <td className="justify-between text-xl px-1">
                                    <label htmlFor={item.ENTIDAD} className="text-xl px-1">
                                        {item.DESCRIPCION}
                                    </label>
                                </td>
                            </tr>
                    )
                }
                </tbody>
            </table>
        </div>
        <br/>
        <button onClick={onClickPasar} className="bordered rounded border-2 bg-red-400 text-white border-black hover:bg-red-500
                p-2 grid cols-1 place-items-center text-xl p-2">Ejecutar paso
        </button>
        <br/>
        <button onClick={onClickRegresar} className="bordered rounded border-2 bg-red-400 text-white border-black hover:bg-red-500
                p-2 grid cols-1 place-items-center text-xl p-2">Regresar
        </button>

        <br/>
        <p>Valide las opciones seleccionadas cuidadosamente, una vez enviado el proceso no puede deshacerse</p>
    </div>
    </>)
        ;
}

export default Requerimiento