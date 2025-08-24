using TaskSystem.Server.BusinessLayer.Interfaces;
using TaskSystem.Server.Models;

namespace TaskSystem.Server.BusinessLayer;

public class ValidateDataBL : IValidateDataBL
{
    public bool IsTaskValid(TaskData task, out string errorMsg)
    {
        errorMsg = string.Empty;

        if (task is null)
        {
            errorMsg = "Empty task data";
            return false;
        }

        if (task.Id < 0)
        {
            errorMsg = "Empty task ID";
            return false;
        }

        if (task.UserId <= 0)
        {
            errorMsg = "UserId cannot be null or less than 1";
            return false;
        }

        if (string.IsNullOrWhiteSpace(task.Title))
        {
            errorMsg = "Title cannot be null";
            return false;
        }

        if (task.CreatedDate is null)
        {
            task.CreatedDate = DateTime.Now;
        }

        return true;
    }
    public bool IsUpdateTaskValid(TaskData oldTaskData, TaskData newTaskData, out string errorMsg)
    {
        errorMsg = string.Empty;

        if (oldTaskData.UserId != newTaskData.UserId)
        {
            errorMsg = "Error Updating task";
            return false;
        }

        if (string.IsNullOrWhiteSpace(newTaskData.Title))
        {
            errorMsg = "Title cannot be null";
            return false;
        }

        return true;
    }
}
