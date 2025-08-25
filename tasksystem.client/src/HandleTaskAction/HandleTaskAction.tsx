import { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

import { FormStyled, PageStyled } from "../_helpers";
import { taskActions } from '../_store';
import moment from 'moment/moment';

export { HandleTaskAction };

interface Props {
  action: string
}

function HandleTaskAction( { action } : Props) {
    const params = useParams<{ id:string }>();

    const dispatch = useDispatch<any>();
    const authUser = useSelector((x:any) => x.auth.user);
    const singleTask = useSelector((x:any) => x.task.singleTask);
    const [taskDataToUpdate, setTaskDataToUpdate] = useState({
        id: 0, 
        title:'', 
        description:'',
        date: new Date(), 
        isCompleted :false, 
        priority:0, 
        userId:authUser.id,
        requestType: 'page'
    });
    useEffect(() => {
        if (params.id) {           
            const id = Number(params.id);
            if (id > 0) {                
                dispatch(taskActions.GetTask(Number(id)));
            }            
        }
    }, []);

    useEffect(() => {
        if (singleTask) {           
            setTaskDataToUpdate({ ...singleTask, date: formatDate(singleTask.date) });  
        }  
    }, [singleTask]);

    const formatDate = (date :any) => {
          return moment(date).format("YYYY-MM-DD");
    };

    const validationSchema = Yup.object().shape({
        id: Yup.number().required(),
        title: Yup.string().required('Title is required'),
        description: Yup.string().nullable(),
        date: Yup.date().nullable(),
        isCompleted: Yup.bool().required('Is Completed is required'),
        priority: Yup.number().min(0).max(3).required('Priority is required'),
        userId: Yup.number().required(),       
        requestType: Yup.string()
    });
    
    const formOptions : any= { resolver: yupResolver(validationSchema), values:taskDataToUpdate};
    
    const { register, handleSubmit, formState } = useForm(formOptions);
    const { errors, isSubmitting } = formState;

    const handleChange = (name: string) => (e: any) => {
        switch (name) {
            case "title":
                setTaskDataToUpdate({ ...taskDataToUpdate, title: e.target.value });
                break;
            case "description":
                setTaskDataToUpdate({ ...taskDataToUpdate, description: e.target.value });
                break;
            case "date":
                setTaskDataToUpdate({ ...taskDataToUpdate, date: e.target.value });
                break;
            case "isCompleted":
                setTaskDataToUpdate({ ...taskDataToUpdate, isCompleted: e.target.checked });
                break;
            case "priority":
                setTaskDataToUpdate({ ...taskDataToUpdate, priority: e.target.value });
                break;
            default:
                break;
        }
    };
    function onSubmit (newData: any) { 
        if (action === 'create') {
            return dispatch(taskActions.InsertTask(newData));
        }

        if (action === 'update') {
            return dispatch(taskActions.UpdateTask(newData));
        }
       
        return;
    }  

    return(
    <PageStyled>
        <FormStyled onSubmit={handleSubmit(onSubmit)}>
            <h1>{ (action === 'create') ? 'Create': 'Update'} Task</h1>
            
            <div className="form-control">
                    <label htmlFor="title">Title</label>
                    <input type="text" 
                        {...register('title')} 
                        className={`input-control ${errors.title ? 'is-invalid' : ''}`}     
                    />
                    <div className="invalid-feedback">{errors.title?.message}</div>
            </div>
            <div className="form-control">                   
                    <label htmlFor="description">Description</label>
                    <textarea {...register('description')} 
                        className={`input-control ${errors.description ? 'is-invalid' : ''}`} 
                        rows={5}
                        />                    
                    <div className="invalid-feedback">{errors.description?.message}</div>
            </div>
            <div className="form-control">
                    <label htmlFor="date">Date</label>
                    <input type="date" {...register('date')} 
                        className={`input-control ${errors.date ? 'is-invalid' : ''}`}
                        value={formatDate(taskDataToUpdate?.date)}
                        onChange={handleChange("date")}
                    />
                    <div className="invalid-feedback">{errors.date?.message}</div>
            </div>            
            <div className="form-control">
                    <label htmlFor="priority">Priority</label>
                    <select {...register('priority')} 
                        className={`input-control ${errors.priority ? 'is-invalid' : ''}`} 
                        value={taskDataToUpdate?.priority}
                        onChange={handleChange("priority")}
                    >
                        <option value={0}>None</option>
                        <option value={1}>Low</option>
                        <option value={2}>Medium</option>
                        <option value={3}>High</option>
                    </select>
                    <div className="invalid-feedback">{errors.priority?.message}</div>
            </div>
            <div className="form-control">
                <label htmlFor="isCompleted">Is Completed</label>
                <label className='switch'>
                    <input type="checkbox"
                    {...register('isCompleted')} 
                    checked = {taskDataToUpdate?.isCompleted} 
                    onChange= {handleChange("isCompleted")}
                    />
                    <span className="slider round"></span>                                       
                </label>
            </div>
            
            <div>   
                <input  type="hidden" {...register('userId')} className={`input-control`} value={authUser.id} />                  
                <input  type="hidden" {...register('id')} className={`input-control`} value={taskDataToUpdate.id} />                  
                <input  type="hidden" {...register('requestType')} className={`input-control`} value={taskDataToUpdate.requestType} />                  
            </div>

            <button disabled={isSubmitting} className="submit-btn">
                {isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                { (action === 'create') ? 'Create': 'Update'}
            </button> 
        </FormStyled>
    </PageStyled>
    );
}
