using Microsoft.EntityFrameworkCore;
using NSubstitute;
using System.Collections.Generic;
using System.Net.Sockets;
using System.Reflection.Metadata;
using TaskSystem.Server.BusinessLayer;
using TaskSystem.Server.BusinessLayer.Interfaces;
using TaskSystem.Server.Data;
using TaskSystem.Server.Data.Interfaces;
using TaskSystem.Server.Models;

namespace TaskSystem.Test;

[TestClass]
public sealed class TaskManagerBLTest
{
    private ITaskManagerBL _taskManagerBL;
    private IValidateDataBL _validateDataBL;
    private ITaskManagerContext _taskManagerContext;

    [TestInitialize]
    public void TestInitialize()
    {
        var data = new List<TaskData>
        {
        new TaskData { Id = 1, Title = "test 1", Description= "D", UserId = 1, IsCompleted = true },
        new TaskData { Id = 2, Title = "test 2", Description= "D", UserId = 1 , Priority = PriorityLevel.Low},
        new TaskData { Id = 3, Title = "test 3", Description= "D", UserId = 1 },
        new TaskData { Id = 4, Title = "test 4", Description= "D", UserId = 3 },
        new TaskData { Id = 5, Title = "test 5", Description= "D", UserId = 3, Date = DateTime.Now },
        }.AsAsyncQueryable();

        var mockTaskSet = Substitute.For<DbSet<TaskData>, IQueryable<TaskData>>();
        ((IQueryable<TaskData>)mockTaskSet).Provider.Returns(data.Provider);
        ((IQueryable<TaskData>)mockTaskSet).Expression.Returns(data.Expression);
        ((IQueryable<TaskData>)mockTaskSet).ElementType.Returns(data.ElementType);
        ((IQueryable<TaskData>)mockTaskSet).GetEnumerator().Returns(data.GetEnumerator());

        _taskManagerContext = Substitute.For<ITaskManagerContext>();
        _taskManagerContext.Tasks.Returns(mockTaskSet);

        _validateDataBL = new ValidateDataBL();
        _taskManagerBL = new TaskManagerBL(_taskManagerContext, _validateDataBL);
    }

    #region GetAllTasksByUser

    [TestMethod]
    public async Task GetAllTasksByUser_success()
    {
        var testresponse = await _taskManagerBL.GetAllTasksByUser(1);

        Assert.IsNotNull(testresponse);
        Assert.AreEqual(0, testresponse.ErrorCode);
        Assert.AreEqual("", testresponse.ErrorMessage);
        Assert.IsTrue(testresponse.Data.Any());
    }

    [TestMethod]
    public async Task GetAllTasksByUser_zero_id_error()
    {
        var testresponse = await _taskManagerBL.GetAllTasksByUser(0);

        Assert.IsNotNull(testresponse);
        Assert.AreEqual(1, testresponse.ErrorCode);
        Assert.AreEqual("Missing user ID", testresponse.ErrorMessage);
    }

    [TestMethod]
    public async Task GetAllTasksByUser_task_null_error()
    {
        var testresponse = await _taskManagerBL.GetAllTasksByUser(2);

        Assert.IsNotNull(testresponse);
        Assert.AreEqual(2, testresponse.ErrorCode);
        Assert.AreEqual("No user tasks", testresponse.ErrorMessage);
    }

    #endregion

    #region GetTaskById

    [TestMethod]
    public async Task GetTaskById_success()
    {
        var testresponse = await _taskManagerBL.GetTaskById(1);

        Assert.IsNotNull(testresponse);
        Assert.AreEqual(0, testresponse.ErrorCode);
        Assert.AreEqual("", testresponse.ErrorMessage);
    }

    [TestMethod]
    public async Task GetTaskById_zero_id_error()
    {
        var testresponse = await _taskManagerBL.GetTaskById(0);

        Assert.IsNotNull(testresponse);
        Assert.AreEqual(1, testresponse.ErrorCode);
        Assert.AreEqual("Missing task", testresponse.ErrorMessage);
    }

    [TestMethod]
    public async Task GetTaskById_task_null_error()
    {
        var testresponse = await _taskManagerBL.GetTaskById(99);

        Assert.IsNotNull(testresponse);
        Assert.AreEqual(2, testresponse.ErrorCode);
        Assert.AreEqual("Task not found", testresponse.ErrorMessage);
    }

    #endregion

    #region DeleteTask

    [TestMethod]
    public async Task DeleteTask_success()
    {
        _taskManagerContext.SaveChangesAsync().ReturnsForAnyArgs(1);

        var testresponse = await _taskManagerBL.DeleteTask(1);

        Assert.IsNotNull(testresponse);
        Assert.AreEqual(0, testresponse.ErrorCode);
        Assert.AreEqual("", testresponse.ErrorMessage);
    }

    [TestMethod]
    public async Task DeleteTask_zero_id_error()
    {
        var testresponse = await _taskManagerBL.DeleteTask(0);

        Assert.IsNotNull(testresponse);
        Assert.AreEqual(1, testresponse.ErrorCode);
        Assert.AreEqual("Task not found", testresponse.ErrorMessage);
    }

    [TestMethod]
    public async Task DeleteTask_task_null_error()
    {
        _taskManagerContext.SaveChangesAsync().ReturnsForAnyArgs(-1);

        var testresponse = await _taskManagerBL.DeleteTask(1);

        Assert.IsNotNull(testresponse);
        Assert.AreEqual(2, testresponse.ErrorCode);
        Assert.AreEqual("Error deleting task", testresponse.ErrorMessage);
    }

    #endregion

    #region InsertTask

    [TestMethod]
    public async Task InsertTask_success()
    {
        _taskManagerContext.SaveChangesAsync().ReturnsForAnyArgs(1);
        TaskData newTaskData = new TaskData { Title = "new test ", Description = "D", UserId = 1, Priority = PriorityLevel.Low };

        var testresponse = await _taskManagerBL.InsertTask(newTaskData);

        Assert.IsNotNull(testresponse);
        Assert.AreEqual(0, testresponse.ErrorCode);
        Assert.AreEqual("", testresponse.ErrorMessage);
    }

    [TestMethod]
    public async Task InsertTask_EmptyTask_error()
    {
        var testresponse = await _taskManagerBL.InsertTask(null);

        Assert.IsNotNull(testresponse);
        Assert.AreEqual(1, testresponse.ErrorCode);
        Assert.AreEqual("Empty task data", testresponse.ErrorMessage);
    }

    [TestMethod]
    public async Task InsertTask_Task_null_error()
    {
        _taskManagerContext.SaveChangesAsync().ReturnsForAnyArgs(-1);
        TaskData newTaskData = new TaskData { Title = "new test ", Description = "D", UserId = 1, Priority = PriorityLevel.Low };

        var testresponse = await _taskManagerBL.InsertTask(newTaskData);

        Assert.IsNotNull(testresponse);
        Assert.AreEqual(2, testresponse.ErrorCode);
        Assert.AreEqual("Error inserting task", testresponse.ErrorMessage);
    }
    #endregion
    
    #region InsertTask

    [TestMethod]
    public async Task UpdateTask_success()
    {
        _taskManagerContext.SaveChangesAsync().ReturnsForAnyArgs(1);
        TaskData newTaskData = new TaskData { Id = 1,Title = "new test ", Description = "D", UserId = 1, Priority = PriorityLevel.Low };

        var testresponse = await _taskManagerBL.UpdateTask(newTaskData);

        Assert.IsNotNull(testresponse);
        Assert.AreEqual(0, testresponse.ErrorCode);
        Assert.AreEqual("", testresponse.ErrorMessage);
    }

    [TestMethod]
    public async Task UpdateTask_EmptyTask_error()
    {
        var testresponse = await _taskManagerBL.UpdateTask(null);

        Assert.IsNotNull(testresponse);
        Assert.AreEqual(1, testresponse.ErrorCode);
        Assert.AreEqual("Empty task data", testresponse.ErrorMessage);
    }

    [TestMethod]
    public async Task UpdateTask_DiferentUserID_error()
    {
        _taskManagerContext.SaveChangesAsync().ReturnsForAnyArgs(-1);
        TaskData newTaskData = new TaskData { Id = 1, Title = "new test ", Description = "D", UserId = 3, Priority = PriorityLevel.Low };

        var testresponse = await _taskManagerBL.UpdateTask(newTaskData);

        Assert.IsNotNull(testresponse);
        Assert.AreEqual(3, testresponse.ErrorCode);
        Assert.AreEqual("Error Updating task", testresponse.ErrorMessage);
    }

    [TestMethod]
    public async Task UpdateTask_Task_null_error()
    {
        _taskManagerContext.SaveChangesAsync().ReturnsForAnyArgs(-1);
        TaskData newTaskData = new TaskData {Id = 1, Title = "new test ", Description = "D", UserId = 1, Priority = PriorityLevel.Low };

        var testresponse = await _taskManagerBL.UpdateTask(newTaskData);

        Assert.IsNotNull(testresponse);
        Assert.AreEqual(4, testresponse.ErrorCode);
        Assert.AreEqual("Error updating task", testresponse.ErrorMessage);
    }
    #endregion

}
