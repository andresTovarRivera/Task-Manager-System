using Microsoft.AspNetCore.Mvc;
using TaskSystem.Server.BusinessLayer.Interfaces;
using TaskSystem.Server.Middleware;
using TaskSystem.Server.Models;
using TaskSystem.Server.Models.Authenticate;

namespace TaskSystem.Server.Controllers;

public class TaskManagerController(ILogger<TaskManagerController> log, ITaskManagerBL taskManagerBL) : _BaseController
{
    [HttpGet]
    [Authorize]
    public async Task<IActionResult> GetAllTasksByUser()
    {
        AuthenticateResponse? user = Request?.HttpContext?.Items["User"] as AuthenticateResponse;

        if (user is null)
        {
            return CreateResponse(new Models.Base._BaseModel());
        }

        return CreateResponse(await taskManagerBL.GetAllTasksByUser(user.Id));
    }

    [HttpGet, Route("{id}")]
    [Authorize]
    public async Task<IActionResult> GetTask(int id)
    {
        AuthenticateResponse? user = Request?.HttpContext?.Items["User"] as AuthenticateResponse;

        if (user is null)
        {
            return CreateResponse(new Models.Base._BaseModel());
        }
        return CreateResponse(await taskManagerBL.GetTaskById(id, user.Id));
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> InsertTask([FromBody] TaskData newTaskData)
    {
        AuthenticateResponse? user = Request?.HttpContext?.Items["User"] as AuthenticateResponse;

        if (user is null)
        {
            return CreateResponse(new Models.Base._BaseModel());
        }

        return CreateResponse(await taskManagerBL.InsertTask(newTaskData, user.Id));
    }

    [HttpPut]
    [Authorize]
    public async Task<IActionResult> UpdateTask([FromBody] TaskData updateTaskData)
    {
        AuthenticateResponse? user = Request?.HttpContext?.Items["User"] as AuthenticateResponse;

        if (user is null)
        {
            return CreateResponse(new Models.Base._BaseModel());
        }

        return CreateResponse(await taskManagerBL.UpdateTask(updateTaskData, user.Id));
    }

    [HttpPut]
    [Authorize]
    public async Task<IActionResult> UpdateTaskStatus([FromBody] UpdateTaskStatusRequest updateTaskData)
    {
        AuthenticateResponse? user = Request?.HttpContext?.Items["User"] as AuthenticateResponse;

        if (user is null)
        {
            return CreateResponse(new Models.Base._BaseModel());
        }

        return CreateResponse(await taskManagerBL.UpdateTaskStatus(updateTaskData, user.Id));
    }

    [HttpPut]
    [Authorize]
    public async Task<IActionResult> UpdateTaskOrder([FromBody] UpdateTaskOrderRequest updateTaskData)
    {
        AuthenticateResponse? user = Request?.HttpContext?.Items["User"] as AuthenticateResponse;

        if (user is null)
        {
            return CreateResponse(new Models.Base._BaseModel());
        }

        return CreateResponse(await taskManagerBL.UpdateTaskOrder(updateTaskData, user.Id));
    }

    [HttpPost, Route("{id}")]
    [Authorize]
    public async Task<IActionResult> DeleteTask(int id)
    {
        AuthenticateResponse? user = Request?.HttpContext?.Items["User"] as AuthenticateResponse;
        
        if (user is null)
        {
            return CreateResponse(new Models.Base._BaseModel());
        }

        return CreateResponse(await taskManagerBL.DeleteTask(id,user.Id));
    }
}
