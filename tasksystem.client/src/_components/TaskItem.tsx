import { useDispatch } from 'react-redux';
import { taskActions } from '../_store';
import moment from "moment/moment";
import { DivStyled, history } from "../_helpers";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from '@dnd-kit/sortable';

interface Props {
  title: string;
  description: string;
  date: string;
  isCompleted: boolean;
  priority: number;
  id: number;
  order: number;
}
export { TaskItem };

function TaskItem({ title, description, date, isCompleted, priority, id, order }: Props) {

  const dispatch = useDispatch<any>();
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: order });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };
  
  const edit = <i className="fa-solid fa-pen"></i>;
  const trash = <i className="fa fa-trash"></i>;
  const exclamation = <i className="fa-solid fa-triangle-exclamation"></i>
  const dragicon = <i className="fa-solid fa-grip-vertical"></i>

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

  const updateTaskStatus = async (id : number, isCompleted: boolean) => {
    return dispatch(taskActions.UpdateTaskStatus({taskId: id, isCompleted}));
  };

  return (
    <DivStyled  ref={setNodeRef}
      style={style}>
        <div className="task-header">
            <h1 className='task-title'><p className={'priority-icon ' + PriorityStatus(priority)}>{exclamation}</p> {title}</h1>
            <p className='task-drag-icon' {...attributes} {...listeners}>{dragicon}</p>           
        </div>
        <p className='task-description'>{description}</p>
        <p className="date">{formatDate(date)}</p>
        <div className="task-footer">
        <button
            className= { isCompleted ? "completed" : "incomplete"}
            onClick={() => { updateTaskStatus(id, !isCompleted); }}
        >
          { isCompleted ? "Completed" : "Incomplete"}
        </button>
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
