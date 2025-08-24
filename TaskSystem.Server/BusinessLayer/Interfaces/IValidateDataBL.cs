using TaskSystem.Server.Models;

namespace TaskSystem.Server.BusinessLayer.Interfaces;

public interface IValidateDataBL
{
    public bool IsTaskValid(TaskData task, out string errorMsg);
    public bool IsUpdateTaskValid(TaskData oldTaskData, TaskData newTaskData, out string errorMsg);
}
