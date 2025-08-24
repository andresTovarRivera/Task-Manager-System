using TaskSystem.Server.Models;
using TaskSystem.Server.Models.Base;

namespace TaskSystem.Server.BusinessLayer.Interfaces
{
    public interface ITaskManagerBL
    {
        public Task<GenericGetResponse<IEnumerable<TaskData>>> GetAllTasksByUser(int userID);
        public Task<GenericGetResponse<TaskData>> GetTaskById(int taskId, int userID);
        public Task<GenericResponse> InsertTask(TaskData newTaskData, int userID);
        public Task<_BaseModel> UpdateTask(TaskData updateTaskData, int userID);
        public Task<_BaseModel> DeleteTask(int taskId, int userId);
    }
}
