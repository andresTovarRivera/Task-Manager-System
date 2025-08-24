namespace TaskSystem.Server.Models.Base;

public class _BaseModel
{
    public int ErrorCode { get; set; }
    public string ErrorMessage { get; set; }
    public _BaseModel()
    {
        ErrorCode = -1;
        ErrorMessage = "An error has ocurred, please try again.";
    }
}
