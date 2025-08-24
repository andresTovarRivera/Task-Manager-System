using System.ComponentModel.DataAnnotations;

namespace TaskSystem.Server.Models.Authenticate;

public class AuthenticateRequest
{
    [Required]
    public string UserName { get; set; }

    [Required]
    public string Password { get; set; }
}
