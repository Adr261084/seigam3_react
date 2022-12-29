import back from "./back";
import base64 from 'base-64';

class crud {

    async GET_Init(resource, auth) {

        var myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', `Basic ${base64.encode(auth.user + ":" + auth.password)}`);
        myHeaders.append('Access-Control-Allow-Origin', '*');

        var requestOptions = {
            method: 'GET',
            mode: 'cors',
            headers: myHeaders,
            credentials: 'include'
        };

        const url = `${back.api.baseURL}${resource}${auth.user}`;
        console.log(url);
        console.log(requestOptions.headers.get('Authorization'))

        const response = await (fetch(url, requestOptions));
        console.log(response);
        return response.body || 'X';
    }

    async GET(resource) {
        const token = localStorage.getItem("token");
        let bearer;
        if (token === " ") {
            bearer = " ";
        } else {
            bearer = `${token}`
        }

        const data = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': bearer
            }
        }
        const url = `${back.api.baseURL}${resource}`;
        let response = await (await fetch(url, data)).json();
        return response;
    }

    async POST(resource, body) {

        const token = localStorage.getItem("token");
        let bearer;
        if (token === " ") {
            bearer = " ";
        } else {
            bearer = `${token}`
        }

        const data = {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': bearer
            }
        }
        const url = `${back.api.baseURL}${resource}`;
        let response = (await (await fetch(url, data)).json());
        return response;
    }

    async PUT(resource, body) {

        const token = localStorage.getItem("token");
        let bearer;
        if (token === " ") {
            bearer = " ";
        } else {
            bearer = `${token}`
        }
        const data = {
            method: 'PUT',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': bearer
            }
        }
        const url = `${back.api.baseURL}${resource}`;

        let response = (await (await fetch(url, data)).json());
        return response;
    }

    async DELETE(resource) {
        const token = localStorage.getItem("token");
        let bearer;
        if (token === " ") {
            bearer = " ";
        } else {
            bearer = `${token}`
        }

        const data = {
            method: 'DELETE',
            headers: {
                'x-auth-token': bearer
            }
        }
        const url = `${back.api.baseURL}${resource}`;
        console.log("CRUD DELETE");
        console.log(url);
        console.log(resource);
        let response = (await (await fetch(url, data)).json());
        return response;
    }
}

export default new

crud();