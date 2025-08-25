import { useDispatch } from 'react-redux';

import { taskActions } from '../_store';
import moment from "moment/moment";
import { DivStyled, history } from "../_helpers";

interface Props {
  title: string;
  description: string;
  date: string;
  isCompleted: boolean;
  priority: number;
  userId: number;
  id: number;
}
export { TaskItem };

function TaskItem({ title, description, date, isCompleted, priority, userId, id }: Props) {

    const dispatch = useDispatch<any>();
      
    const edit = <i className="fa-solid fa-pen"></i>;
    const trash = <i className="fa fa-trash"></i>;
    const exclamation = <i className="fa-solid fa-triangle-exclamation"></i>

    const PriorityStatus= (priority:number)  => {
        switch(priority) {
            case 1: return 'low';
            case 2: return 'medium';
            case 3: return 'high';
            default: return 'none';
        };
    }

    const formatDate = (date :any) => {
      return moment(date).format("DD/MM/YYYY");
    };

    const deleteTask = async (id : number) => {
        return dispatch(taskActions.DeleteTask(id));
    };

    const editTask = async (id : number) => {
         history.navigate('/updatetask/' + id )
    };

    const updateTask = async (task : Props) => {
        return dispatch(taskActions.UpdateTask(task));
    };

  return (
    <DivStyled>
        <div className="task-header">
            <h1 className='task-title'>{title}</h1>
            <p className={'priority-icon ' + PriorityStatus(priority)}>{exclamation}</p>
        </div>
        <p className='task-description'>{description}</p>
        <p className="date">{formatDate(date)}</p>
        <div className="task-footer">
        {isCompleted ? (
          <button
            className="completed"
            onClick={() => {
              const task = {
                id,
                isCompleted: !isCompleted,
                title: title,
                description: description,
                date: date,
                priority:priority,
                userId:userId,
                requestType:'component'
              };

              updateTask(task);
            }}
          >
            Completed
          </button>
        ) : (
          <button
            className="incomplete"
            onClick={() => {
              const task = {
                id,
                isCompleted: !isCompleted,
                title: title,
                description: description,
                date: date,
                priority:priority,
                userId:userId,
                requestType:'component'
              };

              updateTask(task);
            }}
          >
            Incomplete
          </button>
        )}
        <div>
          <button className="btn-edit"
            onClick={() => {
            editTask(id);
          }}>{edit}</button>
          <button
            className="btn-delete"
            onClick={() => {
            deleteTask(id);
          }}>{trash}</button>
        </div>        
      </div>
    </DivStyled>
  );
}
