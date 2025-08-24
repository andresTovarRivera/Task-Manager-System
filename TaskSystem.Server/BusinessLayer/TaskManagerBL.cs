using Microsoft.EntityFrameworkCore;
using TaskSystem.Server.BusinessLayer.Interfaces;
using TaskSystem.Server.Data.Interfaces;
using TaskSystem.Server.Models;
using TaskSystem.Server.Models.Base;

namespace TaskSystem.Server.BusinessLayer;

public class TaskManagerBL(ITaskManagerContext taskManagerContext, IValidateDataBL validate) : ITaskManagerBL
{
    public async Task<GenericGetResponse<IEnumerable<TaskData>>> GetAllTasksByUser(int userID)
    {
        if (userID <= 0)
        {
            return new GenericGetResponse<IEnumerable<TaskData>>()
            {
                ErrorCode = 1,
                ErrorMessage = "Missing user ID"
            };
        }

        IEnumerable<TaskData> tasks = await taskManagerContext.Tasks.Where(t => t.UserId == userID).ToListAsync();

        if (tasks is null || !tasks.Any())
        {
            return new GenericGetResponse<IEnumerable<TaskData>>()
            {
                ErrorCode = 2,
                ErrorMessage = "No user tasks"
            };
        }

        return new GenericGetResponse<IEnumerable<TaskData>>()
        {
            ErrorCode = 0,
            ErrorMessage = "",
            Data = tasks
        };
    }

    public async Task<GenericGetResponse<TaskData>> GetTaskById(int taskId, int userID)
    {
        if (taskId <= 0)
        {
            return new GenericGetResponse<TaskData>()
            {
                ErrorCode = 1,
                ErrorMessage = "Missing task"
            };
        }

        var task = await taskManagerContext.Tasks.FirstOrDefaultAsync(t => t.Id == taskId && t.UserId == userID);

        if (task is null)
        {
            return new GenericGetResponse<TaskData>()
            {
                ErrorCode = 2,
                ErrorMessage = "Task not found"
            };
        }

        return new GenericGetResponse<TaskData>()
        {
            ErrorCode = 0,
            ErrorMessage = "",
            Data = task
        };
    }

    public async Task<GenericResponse> InsertTask(TaskData newTaskData, int userID)
    {
        if (!validate.IsTaskValid(newTaskData, out string errorMsg))
        {
            return new GenericResponse()
            {
                ErrorCode = 1,
                ErrorMessage = errorMsg,
                IsSuccessful = false
            };
        }

        newTaskData.UserId = userID;

        taskManagerContext.Tasks.Add(newTaskData);
        int row = await taskManagerContext.SaveChangesAsync();

        if (row <= 0)
        {
            return new GenericResponse()
            {
                ErrorCode = 2,
                ErrorMessage = "Error inserting task",
                IsSuccessful = false
            };
        }

        return new GenericResponse()
        {
            ErrorCode = 0,
            ErrorMessage = "",
            IsSuccessful = true
        };
    }

    public async Task<_BaseModel> UpdateTask(TaskData updateTaskData, int userID)
    {
        if (!validate.IsTaskValid(updateTaskData, out string errorMsg))
        {
            return new _BaseModel()
            {
                ErrorCode = 1,
                ErrorMessage = errorMsg
            };
        }

        var currentTaskData = await taskManagerContext.Tasks.FirstOrDefaultAsync(t => t.Id == updateTaskData.Id && t.UserId == userID);

        if (currentTaskData is null)
        {
            return new GenericResponse()
            {
                ErrorCode = 2,
                ErrorMessage = "Task not found"
            };
        }

        if (!validate.IsUpdateTaskValid(currentTaskData, updateTaskData, out string errorUpdateMsg))
        {
            return new GenericResponse()
            {
                ErrorCode = 3,
                ErrorMessage = errorUpdateMsg
            };
        }

        MapTaskDataToUpdate(currentTaskData, updateTaskData);

        taskManagerContext.Tasks.Update(currentTaskData);
        int row = await taskManagerContext.SaveChangesAsync();

        if (row <= 0)
        {
            return new GenericResponse()
            {
                ErrorCode = 4,
                ErrorMessage = "Error updating task"
            };
        }

        return new GenericResponse()
        {
            ErrorCode = 0,
            ErrorMessage = "",
            IsSuccessful = true
        };
    }

    public async Task<_BaseModel> DeleteTask(int taskId, int userId)
    {        
        var taskData = await taskManagerContext.Tasks.FirstOrDefaultAsync(t => t.Id == taskId && t.UserId == userId);

        if (taskData is null)
        {
            return new GenericResponse()
            {
                ErrorCode = 1,
                ErrorMessage = "Task not found",
                IsSuccessful = false
            };
        }

        taskManagerContext.Tasks.Remove(taskData);
        int row = await taskManagerContext.SaveChangesAsync();

        if (row <= 0)
        {
            return new GenericResponse()
            {
                ErrorCode = 2,
                ErrorMessage = "Error deleting task",
                IsSuccessful = false
            };
        }

        return new GenericResponse()
        {
            ErrorCode = 0,
            ErrorMessage = "",
            IsSuccessful = true
        };
    }

    private static TaskData MapTaskDataToUpdate(TaskData currentTaskData, TaskData newTaskData)
    {
        currentTaskData.Title = newTaskData.Title;
        currentTaskData.Description = newTaskData.Description;
        currentTaskData.Date = newTaskData.Date;
        currentTaskData.IsCompleted = newTaskData.IsCompleted;
        currentTaskData.Priority = newTaskData.Priority;
        currentTaskData.UpdatedDate = DateTime.Now;

        return currentTaskData;
    }
}
