import { store, authActions } from '../_store';

export const fetchWrapper = {
    get: request('GET'),
    post: request('POST'),
    put: request('PUT'),
    delete: request('DELETE')
};

function request(method : any) {
    return (url:string, body: any ) => {
        const requestOptions : any= {
            method,
            headers: authHeader(url)
        };
        if (body) {
            requestOptions.headers['Content-Type'] = 'application/json';
            requestOptions.body = JSON.stringify(body);
        }
        return fetch(url, requestOptions).then(handleResponse);
    }
}

function authHeader(url:any) {
    const token = authToken();
    const isLoggedIn = !!token;
    const uri = import.meta.env.VITE_APP_API_URL as string
    const isApiUrl = url.startsWith(uri);
    if (isLoggedIn && isApiUrl) {
        return { Authorization: `Bearer ${token}` };
    } else {
        return {};
    }
}

function authToken() {
    return store.getState().auth.user?.token;
}

function handleResponse(response: any) {
    return response.text().then((text : any) => {
        const data = text && JSON.parse(text);

        if (!response.ok) {
            if ([401, 403].includes(response.status) && authToken()) {
                const logout = () => store.dispatch(authActions.logout());
                logout();
            }

            const error = (data && data.errorMessage) || response.statusText;
            return Promise.reject(error);
        }

        return data;
    });
}