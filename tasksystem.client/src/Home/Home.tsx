import { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { taskActions } from '../_store';
import { history, PageStyled} from "../_helpers";
import { TaskItem } from "../_components";
import { closestCorners, DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, rectSortingStrategy, SortableContext, sortableKeyboardCoordinates } from '@dnd-kit/sortable';

export { Home };
 
function Home() {
  const dispatch = useDispatch<any>();
  const authUser = useSelector(( x : any ) => x.auth.user);
  const userTasksNumber = useSelector((x:any) => x.task.userTasksNumber);
  const tasksData = useSelector((x:any) => x.task.tasksData);
  const completedTasks = useSelector((x:any) => x.task.completedTasks);
  const incompleteTasks = useSelector((x:any) => x.task.incompleteTasks);

  const [selectFilteredTasks, setSelectFilteredTasks] = useState('0');
  const [filteredtasks, setFilterTasks] = useState([]); 
  
  const plus = <i className="fa-solid fa-plus"></i>

  if (!authUser) return null;

  useEffect(() => {    
    dispatch(taskActions.GetAllTasksByUser()); 
  }, []);

  useEffect(() => {
    if(userTasksNumber >= 0){
      switch(selectFilteredTasks) {
        case '1': setFilterTasks(completedTasks);
        break;
        case '2': setFilterTasks(incompleteTasks);
        break;
        default: setFilterTasks(tasksData);
      };
    }  
  }, [tasksData,selectFilteredTasks]);

  useEffect(() => {
    if (filteredtasks.length > 0) {
      if(filteredtasks.every((t:any) => {t.userId !== authUser.id})){
        setFilterTasks([]);
        return;
      }      
    }   
   }, [filteredtasks]);

  const createTask = () => {
    history.navigate('/CreateTask')
  };

  const filterTasks = useCallback((event: React.FormEvent<HTMLSelectElement>) => {
    setSelectFilteredTasks(event?.currentTarget?.value);
  }, [filteredtasks]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  
  const handleDragEnd = (event: any) => {
    const { active, over }: any= event;

    if (active.id !== over.id) {     
      setFilterTasks((t :any) => {
        const oldIndex = t.findIndex((c:any) => {return c.order == active.id;});       
        const newIndex = t.findIndex((c:any) => {return c.order == over.id;});

        return arrayMove(filteredtasks, oldIndex, newIndex);
      });
    }
  };

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
            <DndContext
              sensors={sensors}
              collisionDetection={closestCorners}
              onDragEnd={handleDragEnd}              
            >            
              <SortableContext items={filteredtasks.map((t:any) => t.order)} strategy={rectSortingStrategy}>
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
                    order={task.order}
                  />
                ))}
              </SortableContext>
            </DndContext>
            <button className="create-task" onClick={createTask}>
              {plus}
              Add New Task
            </button>
        </div>
    </PageStyled>)
  }
