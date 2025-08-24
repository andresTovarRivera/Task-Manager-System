namespace TaskSystem.Server.Models.Base;

public class GenericGetResponse<T>: _BaseModel
{
    public T Data { get; set; }
}
