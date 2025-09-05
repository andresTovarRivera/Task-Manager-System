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
    const regex = new RegExp('https?:\/\/(?:w{1,3}\.)?[^\s.]+(?:\.[a-z]+)*(?::\d+)?(?![^<]*(?:<\/\w+>|\/?>))');
    const isApiUrl = regex.test(url);
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