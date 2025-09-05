import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { history, fetchWrapper } from '../_helpers';

const name = 'auth';
const initialState = createInitialState();
const reducers = createReducers();
const extraActions = createExtraActions();
const extraReducers = createExtraReducers();
const slice = createSlice({ name, initialState, reducers, extraReducers });

export const authActions = { ...slice.actions, ...extraActions };
export const authReducer = slice.reducer;

function createInitialState() {
    const user = localStorage.getItem('currentUser');

    if(!user){
        return {
            user: null,
            error: null
        }
    }

    return {
        user: JSON.parse(localStorage.getItem('currentUser') || '{}'),
        error: null
    }
}

function createReducers() {
    return {
        logout
    };

    function logout(state: any) {
        state.user = null;
        localStorage.removeItem('currentUser');
        history.navigate('/login');
    }
}

function createExtraActions() {
    const target:string = import.meta.env?.VITE_APP_API_URL ?? 'http://localhost:8080/';
    const baseUrl = `${target}api/user`;

    return {
        login: login()
    };    

    function login() {
        return createAsyncThunk(
            `${name}/login`,
            async ({ username, password}:any) => await fetchWrapper.post(`${baseUrl}/authenticate`, { username, password })
        );
    }
}

function createExtraReducers() {
    return (builder : any) => {
        login();

        function login() {
            var { pending, fulfilled, rejected } = extraActions.login;
            builder
            .addCase(pending, (state: any) => {
                state.error = null;
            })
            .addCase(fulfilled, (state: any, action: any) => {
                const response = action.payload;

                if (response.errorCode !== 0 ) {
                    state.error = response.errorMessage;
                    return;
                }

                const user = action.payload.data;

                if (!user) {
                    state.error = 'Empty user';
                    return;
                }

                localStorage.setItem('currentUser', JSON.stringify(user));
                state.user = user;

                const { from } = history.location.state || { from: { pathname: '/' } };
                history.navigate(from);
            })
            .addCase(rejected, (state: any, action: any) => {
                state.error = action.error;
            });
        }
    };
}
