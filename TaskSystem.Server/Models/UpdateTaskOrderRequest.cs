namespace TaskSystem.Server.Models;

public class UpdateTaskOrderRequest
{
    public int TaskId { get; set; }
    public int OldOrder { get; set; }
    public int NewOrder { get; set; }
}
