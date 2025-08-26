using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using TaskSystem.Server.BusinessLayer.Interfaces;
using TaskSystem.Server.Data.Interfaces;
using TaskSystem.Server.Models;
using TaskSystem.Server.Models.Authenticate;
using TaskSystem.Server.Models.Base;

namespace TaskSystem.Server.BusinessLayer;

public class UserBL(ITaskManagerContext taskManagerContext, IOptions<AppSettings> appSettings) : IUserBL
{
    private readonly AppSettings _appSettings = appSettings.Value;

    public async Task<GenericGetResponse<AuthenticateResponse>> Authenticate(AuthenticateRequest request)
    {
        if (string.IsNullOrWhiteSpace(request?.UserName) || string.IsNullOrWhiteSpace(request?.Password))
        {
            return new GenericGetResponse<AuthenticateResponse>()
            {
                ErrorCode = 1,
                ErrorMessage = "Username or password is incorrect"
            };
        }

        var user = await taskManagerContext.Users.SingleOrDefaultAsync(x => string.Equals(x.Name, request.UserName) && string.Equals(x.Password, request.Password));

        if (user is null)
        {
            return new GenericGetResponse<AuthenticateResponse>()
            {
                ErrorCode = 2,
                ErrorMessage = "Username or password is incorrect"
            };
        };

        var token = generateJwtToken(user);

        return new GenericGetResponse<AuthenticateResponse>()
        {
            ErrorCode = 0,
            ErrorMessage = "",
            Data = new()
            {
                Id = user.Id,
                UserName = user.Name,
                Token = token
            }
        };
    }

    public async Task<GenericResponse> CreateAccount(User newUser)
    {
        if (string.IsNullOrWhiteSpace(newUser?.Name) || string.IsNullOrWhiteSpace(newUser?.Password))
        {
            return new GenericResponse()
            {
                ErrorCode = 1,
                ErrorMessage = "Error creating User"
            };
        }

        if (taskManagerContext.Users.Any((u) => string.Equals(u.Name, newUser.Name)))
        {
            return new GenericResponse()
            {
                ErrorCode = 2,
                ErrorMessage = "User Already Exist",
                IsSuccessful = false
            };
        }

        taskManagerContext.Users.Add(newUser);
        int row = await taskManagerContext.SaveChangesAsync();

        if (row <= 0)
        {
            return new GenericResponse()
            {
                ErrorCode = 3,
                ErrorMessage = "Error creating User",
                IsSuccessful = false
            };
        }

        return new GenericResponse()
        {
            ErrorCode = 0,
            ErrorMessage = "",
            IsSuccessful = true
        };
    }

    public User GetById(int id) => taskManagerContext?.Users?.FirstOrDefault(x => x.Id == id);

    private string generateJwtToken(User user)
    {
        // token valid for 7 days
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(_appSettings.Secret);
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[] { new Claim("id", user.Id.ToString()) }),
            Expires = DateTime.UtcNow.AddDays(7),
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };
        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }
}
