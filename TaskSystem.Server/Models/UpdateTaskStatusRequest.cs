namespace TaskSystem.Server.Models;

public class UpdateTaskStatusRequest
{
    public int TaskId { get; set; }
    public bool IsCompleted { get; set; }
}
