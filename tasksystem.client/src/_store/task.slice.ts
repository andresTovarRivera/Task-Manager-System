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
        userTasksNumber: -1,
        singleTask: null,
        loading: false, tasksData: [],
        completedTasks: [],  
        incompleteTasks: []
    }
}

function createExtraActions() {
     const target:string = import.meta.env?.VITE_APP_API_URL ?? 'http://localhost:8080/';
    const baseUrl = `${target}api/taskManager`;

    return {
        GetAllTasksByUser: GetAllTasksByUser(),
        GetTask:GetTask(),
        InsertTask: InsertTask(),
        UpdateTask:UpdateTask(),
        UpdateTaskStatus:UpdateTaskStatus(),
        UpdateTaskOrder:UpdateTaskOrder(),        
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
            async ({id, title, description, date, isCompleted, priority, order, userId, requestType} :any) => await fetchWrapper.put(baseUrl +'/UpdateTask', {id, title, description, date, isCompleted, priority, order, userId,requestType})
            
        );
    }

    function UpdateTaskStatus() {
        return createAsyncThunk(
            `${name}/UpdateTaskStatus`,
            async ({taskId, isCompleted} :any) => await fetchWrapper.put(baseUrl +'/UpdateTaskStatus', {taskId, isCompleted})
            
        );
    }

    function UpdateTaskOrder() {
        return createAsyncThunk(
            `${name}/UpdateTaskOrder`,
            async ({taskId, oldOrder, newOrder} :any) => await fetchWrapper.put(baseUrl +'/UpdateTaskOrder', {taskId, oldOrder, newOrder})
            
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
            UpdateTaskStatus();
            UpdateTaskOrder();
            DeleteTask();

            function GetAllTasksByUser() {
                var { pending, fulfilled, rejected} = extraActions.GetAllTasksByUser;
                builder
                .addCase(pending, (state: any) => {
                    state.loading = true;                    
                })
                .addCase(fulfilled, (state: any, action: any) => {
                    const response = action.payload;                   
                    
                    if (response.errorCode !== 0) {
                        toast.error(response.errorMessage);
                        return;
                    }
                    
                    const userTasksNumber = action.payload.data.length;

                    if (userTasksNumber <= 0) {
                        toast('No Tasks Found');  
                    }else{
                        toast('Tasks found: '+ userTasksNumber);       
                    }

                    state.userTasksNumber = userTasksNumber;
                    state.tasksData = action.payload.data;
                    state.completedTasks = action.payload.data?.filter((t : any) => t.isCompleted === true);
                    state.incompleteTasks = action.payload.data?.filter((t :any) => t.isCompleted === false);
                    state.singleTask = null;
                    
                })
                .addCase(rejected, (state:any, action: any) => {
                    toast.error(action.error.message);
                    state.userTasksNumber = 0;
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
                        state.singleTask = null;
                        toast.error(response.errorMessage);
                        history.navigate('/')
                    }

                    state.singleTask = action.payload.data;
                })
                .addCase(rejected, (state: any, action: any) => {
                    state.singleTask = null;
                    toast.error(action.error.message);
                    history.navigate('/')                   
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
                        if (action.meta.arg.requestType  === 'page') {
                            state.singleTask = null;
                            toast.success('Task Updated');
                            history.navigate('/')
                        }
                        else{
                            const id = action.meta.arg.id;
                            const taskDataUpdated = action.meta.arg;
                            const tasksDataUpdated = state.tasksData.map((t:any) => (t.id === id ? taskDataUpdated : t ))  
                            state.userTasksNumber  = tasksDataUpdated.length;                   
                            state.tasksData = tasksDataUpdated;
                            state.completedTasks = tasksDataUpdated?.filter((t : any) => t.isCompleted === true);
                            state.incompleteTasks = tasksDataUpdated?.filter((t :any) => t.isCompleted === false);
                        }                        
                    }                      
                })
                .addCase(rejected, (action: any) => {
                    toast.error(action.error.message);                  
                });
            }

            function UpdateTaskStatus(){
                var { pending, fulfilled, rejected} = extraActions.UpdateTaskStatus;
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
                        const id = action.meta.arg.taskId;
                        const taskStatusDataUpdated = action.meta.arg;
                        const tasksDataUpdated = state.tasksData.map((t:any) => (t.id === id ?  {...t, isCompleted : taskStatusDataUpdated.isCompleted} : t  ))  
                        state.userTasksNumber  = tasksDataUpdated.length;                   
                        state.tasksData = tasksDataUpdated;
                        state.completedTasks = tasksDataUpdated?.filter((t : any) => t.isCompleted === true);
                        state.incompleteTasks = tasksDataUpdated?.filter((t :any) => t.isCompleted === false);                                                
                    }                      
                })
                .addCase(rejected, (action: any) => {
                    toast.error(action.error.message);                  
                });
            }
            
            function UpdateTaskOrder(){
                var { pending, fulfilled, rejected} = extraActions.UpdateTaskOrder;
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
                        const tasksDataUpdated = state.tasksData;
                        state.userTasksNumber  = tasksDataUpdated.length;                   
                        state.tasksData = tasksDataUpdated;
                        state.completedTasks = tasksDataUpdated?.filter((t : any) => t.isCompleted === true);
                        state.incompleteTasks = tasksDataUpdated?.filter((t :any) => t.isCompleted === false);                                      
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
                        state.userTasksNumber  = tasksDataUpdated.length;   
                        state.tasksData = tasksDataUpdated;
                        state.completedTasks = tasksDataUpdated?.filter((t : any) => t.isCompleted === true);
                        state.incompleteTasks = tasksDataUpdated?.filter((t :any) => t.isCompleted === false);
                    }                      
                })
                .addCase(rejected, (action: any) => {
                    toast.error(action.error.message);                
                });
            }
        };
}
