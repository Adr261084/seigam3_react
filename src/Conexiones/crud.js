import back from "./back";
import base64 from 'base-64';

class crud {

    async GET_Init(resource, auth) {

        var myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('x-pass', `${base64.encode(auth.password)}`);

        var requestOptions = {
            method: 'GET',
            headers: myHeaders
        };

        const url = `${back.api.baseURL}${resource}${auth.user}`;

        const response = await (fetch(url, requestOptions).then(response => response.json()));
        //console.log(response.sigam3_login_Name_R || 'X');
        return response.sigam3_login_Name_R.NOMBRES || 'Error';
    }

    async GET(resource) {

        const data = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        }
        const url = `${back.api.baseURL}${resource}`;
        let response = await (await fetch(url, data)).json();
        return response;
    }

    async POST(resource, body) {

        const data = {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const url = `${back.api.baseURL}${resource}`;
        let response = await (await fetch(url, data)).json();
        return response;
    }

    async POST_reg(resource, body) {

        const data = {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json'
            }
        }
        console.log(data);
        const url = `${back.api.baseURL}${resource}`;
        let response = (await (await fetch(url, data)).json());
        console.log(response.sigam3_crear_usuario_Crear_R[0].TEXT);
        return response.sigam3_crear_usuario_Crear_R[0].TEXT;
    }

    async PUT(resource, body) {

        const data = {
            method: 'PUT',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const url = `${back.api.baseURL}${resource}`;

        let response = (await (await fetch(url, data)).status);
        return response;
    }

    async DELETE(resource) {
        const data = {
            method: 'DELETE',
        }
        const url = `${back.api.baseURL}${resource}`;
        console.log("CRUD DELETE");
        console.log(url);
        console.log(resource);
        return (await (await fetch(url, data)).json());
    }
}

export default new crud();