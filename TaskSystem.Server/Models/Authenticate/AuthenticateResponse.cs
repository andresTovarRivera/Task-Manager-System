namespace TaskSystem.Server.Models.Authenticate;

public class AuthenticateResponse
{
    public int Id { get; set; }
    public string UserName { get; set; }
    public string Token { get; set; }
}
