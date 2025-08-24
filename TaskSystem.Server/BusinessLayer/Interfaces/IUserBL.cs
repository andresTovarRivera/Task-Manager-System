using TaskSystem.Server.Models;
using TaskSystem.Server.Models.Authenticate;
using TaskSystem.Server.Models.Base;

namespace TaskSystem.Server.BusinessLayer.Interfaces;

public interface IUserBL
{
    public Task<GenericGetResponse<AuthenticateResponse>> Authenticate(AuthenticateRequest request);
    public Task<GenericResponse> CreateAccount(User newUser);
    public User GetById(int id);
}
