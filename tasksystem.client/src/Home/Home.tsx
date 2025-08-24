import { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { taskActions, authActions } from '../_store';
import { history, PageStyled} from "../_helpers";
import { TaskItem } from "../_components";
export { Home };

function Home() {
  const dispatch = useDispatch<any>();
  const authUser = useSelector(( x : any ) => x.auth.user);
  const tasksData = useSelector((x:any) => x.task.tasksData);
   
  const [selectFilteredTasks, setSelectFilteredTasks] = useState('0');
  const [filteredtasks, setFilterTasks] = useState([]);
   
  const completedTasks = tasksData?.filter((t : any) => t.isCompleted === true);
  const incompleteTasks = tasksData?.filter((t :any) => t.isCompleted === false);
  const plus = <i className="fa-solid fa-plus"></i>

  if (!authUser) return null;

  useEffect(() => {   
      if (!authUser) {
        setFilterTasks([]);
        dispatch(authActions.logout())
      }
    }, [authUser]);   

    useEffect(() => {
      if(filteredtasks.length == 0){  
        dispatch(taskActions.GetAllTasksByUser()); 
      } 
     
      if(tasksData.length > 0){
        switch(selectFilteredTasks) {
            case '1':  setFilterTasks(completedTasks);
            break;
            case '2': setFilterTasks(incompleteTasks);
            break;
            default: setFilterTasks(tasksData);
        };
      }  

    }, [tasksData,selectFilteredTasks]);

    const createTask = () => {
        history.navigate('/CreateTask')
    };

    const filterTasks = useCallback((event: React.FormEvent<HTMLSelectElement>) => {
      setSelectFilteredTasks(event?.currentTarget?.value);
      
      
    }, [filteredtasks]);

  return(<PageStyled>
        <div className='home-header'>
          <h1 className='home-title'>
            <select name='filter' className='filter-tasks' onChange={ e => filterTasks(e) } >
              <option className='filter-tasks-option' value={0}>All Tasks</option>
              <option className='filter-tasks-option' value={1}>Completed Tasks</option>
              <option className='filter-tasks-option' value={2}>Incomplete Tasks</option>
            </select> 
          </h1>
       <button className="btn-rounded" onClick={createTask}>{plus}</button>
        </div>            
         <div className="tasks grid">          
            {filteredtasks.length > 0 && filteredtasks.map((task :any) => (
              <TaskItem 
                key={task.id}
                title={task.title}
                description={task.description}
                date={task.date}
                isCompleted={task.isCompleted}
                priority={task.priority}
                userId = {task.userId}
                id={task.id}
              />
            ))}
            <button className="create-task" onClick={createTask}>
              +
              Add New Task
            </button>
        </div>
    </PageStyled>)
  }

