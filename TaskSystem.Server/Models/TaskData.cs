using System.ComponentModel.DataAnnotations.Schema;

namespace TaskSystem.Server.Models;

public class TaskData
{
    public int  Id { get; set; }
    public required string Title { get; set; }
    public string? Description { get; set; }
    public DateTime? Date { get; set; }
    
    [Column("Is_completed")]
    public bool IsCompleted { get; set; }
    public PriorityLevel Priority { get; set; }
    
    [Column("User_id")]
    public int UserId { get; set; }
    public int Order { get; set; }

    [Column("Created_time")]
    public DateTime? CreatedDate { get; set; }
    
    [Column("Updated_time")]
    public DateTime? UpdatedDate { get; set; }
}
