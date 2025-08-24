using Microsoft.AspNetCore.Mvc;
using TaskSystem.Server.Models.Base;

namespace TaskSystem.Server.Controllers;

[ApiController]
[Route("api/[controller]/[action]")]
public abstract class _BaseController : ControllerBase
{
    protected IActionResult CreateResponse(_BaseModel response)
    {
        if (response == null) return new BadRequestResult();
        if (response.ErrorCode != 0) return new BadRequestObjectResult(response);
        return new OkObjectResult(response);
    }
}
