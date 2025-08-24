using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaskSystem.Server.BusinessLayer.Interfaces;
using TaskSystem.Server.Models;
using TaskSystem.Server.Models.Authenticate;

namespace TaskSystem.Server.Controllers;

public class UserController(ILogger<UserController> log, IUserBL userBL ) : _BaseController
{
    [HttpPost]
    [AllowAnonymous]
    public async Task<IActionResult> Authenticate(AuthenticateRequest request)
    {
        return CreateResponse(await userBL.Authenticate(request));       
    }

    [HttpPost]
    [AllowAnonymous]
    public async Task<IActionResult> CreateAccount([FromBody] User newUser)
    {
        return CreateResponse(await userBL.CreateAccount(newUser));       
    }
}
