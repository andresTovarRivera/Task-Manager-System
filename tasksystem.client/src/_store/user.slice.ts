import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { history, fetchWrapper } from '../_helpers';
import toast from "react-hot-toast";

const name = 'user';
const initialState = createInitialState();
const reducers = createReducers();
const extraActions = createExtraActions();
const extraReducers = createExtraReducers();
const slice = createSlice({ name, initialState, reducers, extraReducers });

export const userActions = { ...slice.actions, ...extraActions };
export const userReducer = slice.reducer;

function createInitialState() {
    return {
        errorMSg:''
    }
}

function createReducers() {
    return {};
}

function createExtraActions() {
    const target:string = import.meta.env?.VITE_APP_API_URL ?? 'http://localhost:8080/';
    const baseUrl = `${target}api/user`;

    return {
        CreateAccount: CreateAccount()
    };    

    function CreateAccount() {
        return createAsyncThunk(
            `${name}/CreateAccount`,
            async ({ name, password, email}:any) => await fetchWrapper.post(`${baseUrl}/CreateAccount`, { name, password, email })
        );
    }
}

function createExtraReducers() {
    return (builder : any) => {
        CreateAccount();

        function CreateAccount() {
            var { pending, fulfilled, rejected } = extraActions.CreateAccount;
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

                if (response.isSuccessful) {
                    toast.success('User Registred')
                    history.navigate('/');
                }  
            })
            .addCase(rejected, (state: any, action: any) => {
                state.error = action.error;                
            });
        }
    };
}
