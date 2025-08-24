import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchWrapper, history } from '../_helpers';
import toast from "react-hot-toast";

const name = 'task';
const initialState = createInitialState();
const reducers : any = () =>{ };
const extraActions = createExtraActions();
const extraReducers = createExtraReducers();
const slice = createSlice({
    name, initialState, reducers, extraReducers
});

export const taskActions = { ...slice.actions, ...extraActions };
export const taskReducer = slice.reducer;

function createInitialState() {
    return {
        tasksData: [],
        singleTask:null,
        loading: false
    }
}

function createExtraActions() {
   const target = import.meta.env.VITE_APP_API_URL as string;

    const baseUrl = `${target}/taskManager`;

    return {
        GetAllTasksByUser: GetAllTasksByUser(),
        GetTask:GetTask(),
        InsertTask: InsertTask(),
        UpdateTask:UpdateTask(),
        DeleteTask:DeleteTask()
    };    

    function GetAllTasksByUser() {
        return createAsyncThunk(
            `${name}/GetAllTasksByUser`,
            async () => await fetchWrapper.get(baseUrl +'/GetAllTasksByUser', null)
        );
    }

    function GetTask() {
        return createAsyncThunk(
            `${name}/GetTask`,
            async (id: number) => await fetchWrapper.get(baseUrl +'/GetTask/'+ id, null)
        );
    }

    function InsertTask() {
        return createAsyncThunk(
            `${name}/InsertTask`,
            async ({title, description, date, isCompleted, priority, userId} :any) => await fetchWrapper.post(baseUrl +'/InsertTask', {title, description, date, isCompleted, priority, userId})
        );
    }

    function UpdateTask() {
        return createAsyncThunk(
            `${name}/UpdateTask`,
            async ({id, title, description, date, isCompleted, priority, userId, updatedFrom} :any) => {await fetchWrapper.put(baseUrl +'/UpdateTask', {id, title, description, date, isCompleted, priority, userId, updatedFrom})}
        );
    }

    function DeleteTask() {
        return createAsyncThunk(
            `${name}/DeleteTask`,
            async (id :any) => await fetchWrapper.post(baseUrl +'/DeleteTask/' + id, null)
        );
    }
}

function createExtraReducers() {
    return (builder : any) => {
            GetAllTasksByUser();
            GetTask();
            InsertTask();
            UpdateTask();
            DeleteTask();

            function GetAllTasksByUser() {
                var { pending, fulfilled, rejected} = extraActions.GetAllTasksByUser;
                builder
                .addCase(pending, (state: any) => {
                    state.loading = true;                    
                })
                .addCase(fulfilled, (state: any, action: any) => {
                    const response = action.payload;                   
                    
                    if (response.errorCode !== 0 ) {
                        toast.error(response.errorMessage);
                        return;
                    }
                    
                    state.tasksData = action.payload.data;
                    state.singleTask = null;
                })
                .addCase(rejected, (action: any) => {
                    toast.error(action.error);                           
                });
            } 
            
            function GetTask() {
                var { pending, fulfilled, rejected} = extraActions.GetTask;
                builder
                .addCase(pending, (state: any) => {                    
                    state.loading = true;
                })
                .addCase(fulfilled, (state: any, action: any) => {
                    const response = action.payload;
                    

                    if (response.errorCode !== 0 ) {
                        toast.error(response.errorMessage);
                        return;
                    }

                    state.singleTask = action.payload.data;
                })
                .addCase(rejected, (state: any, action: any) => {
                    state.singleTask = null;
                    toast.error(action.error);                       
                });
            }

            function InsertTask(){
                var { pending, fulfilled, rejected} = extraActions.InsertTask;
                builder
                .addCase(pending, (state: any) => {
                    
                    state.loading = true;
                })
                .addCase(fulfilled, (state: any, action: any) => {
                    const response = action.payload;
                    

                    if (response.errorCode !== 0 ) {
                        toast.error(response.errorMessage);
                        return;
                    }

                    if (response.isSuccessful) {                      
                        state.singleTask = null;
                        toast.success('Task Created')
                        history.navigate('/')
                    }
                })
                .addCase(rejected, (action: any) => {
                    toast.error(action.error.message);                     
                });
            }

            function UpdateTask(){
                var { pending, fulfilled, rejected} = extraActions.UpdateTask;
                builder
                .addCase(pending, (state: any) => {
                    state.loading = true ;
                    
                })
                .addCase(fulfilled, (state: any, action: any) => {
                    const response = action.payload;
                    
                    if (response.errorCode !== 0 ) {
                        toast.error(response.errorMessage);
                        return;
                    }

                    if(response.isSuccessful){
                        if (action.meta.arg.updatedFrom === 'page') {
                            state.singleTask = null;
                            toast.success('Task Created');
                            history.navigate('/')
                        }
                        else{
                            const id = action.meta.arg.id;
                            const taskDataUpdated = action.meta.arg;
                            const tasksDataUpdated = state.tasksData.map((t:any) => (t.id === id ? taskDataUpdated : t ))                       
                            state.tasksData = tasksDataUpdated;
                        }                        
                    }                      
                })
                .addCase(rejected, (action: any) => {
                    toast.error(action.error.message);                  
                });
            }

            function DeleteTask(){
                var { pending, fulfilled, rejected} = extraActions.DeleteTask;
                builder
                .addCase(pending, (state: any) => {
                    state.loading = true;
                    
                })
                .addCase(fulfilled, (state: any, action: any) => {
                    const response = action.payload;
                                        
                    if (response.errorCode !== 0 ) {
                        toast.error(response.errorMessage);
                        return;
                    }

                    if(response.isSuccessful){
                        const id = action.meta.arg;
                        const indexToRemove = state.tasksData.findIndex((c:any) => {return c.id == id;});
                        const tasksDataUpdated =  [...state.tasksData.slice(0, indexToRemove), ...state.tasksData.slice( indexToRemove + 1)];
                        state.tasksData = tasksDataUpdated;
                    }                      
                })
                .addCase(rejected, (action: any) => {
                    toast.error(action.error.message);                
                });
            }
        };
}
