using System.ComponentModel.DataAnnotations.Schema;

namespace TaskSystem.Server.Models;

public class TaskData
{
    public int  Id { get; set; }
    public string Title { get; set; }
    public string? Description { get; set; }
    public DateTime? Date { get; set; }
    
    [Column("is_completed")]
    public bool IsCompleted { get; set; }
    public PriorityLevel Priority { get; set; }
    
    [Column("user_id")]
    public int UserId { get; set; }
    
    [Column("created_time")]
    public DateTime? CreatedDate { get; set; }
    
    [Column("updated_time")]
    public DateTime? UpdatedDate { get; set; }
}
