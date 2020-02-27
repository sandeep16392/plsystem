using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using PLSystem.Common;
using PLSystem.DAL.Contracts;
using PLSystem.DAL.DomainModels;
using PLSystem.DAL.EntityModels;

namespace PLSystem.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthRepository _authRepository;
        private readonly IMapper _mapper;
        private readonly ICommonConfigurations _config;
        public AuthController(IAuthRepository authRepository, ICommonConfigurations config, IMapper mapper)
        {
            _authRepository = authRepository;
            _config = config;
            _mapper = mapper;
        }
        [HttpPost("register")]
        public async Task<IActionResult> Register(UserDm user)
        {
            //validate request

            user.UserName = user.UserName.ToLower();

            if (await _authRepository.UserExists(user.UserName))
                return BadRequest("Username already exists.");

            var userToCreate = _mapper.Map<User>(user);
            userToCreate.UserGroups = user.UserGroup.Select(x => new UserUserGroup
            {
                UserGroup = new UserGroup { Id = x },
                User = userToCreate
            }).ToList();
            await _authRepository.Register(userToCreate, user.Password);

            var userToReturn = _mapper.Map<UserDetailsDm>(userToCreate);

            return Ok(userToReturn);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginUserDm loginUser)
        {
            var userFromRepo = await _authRepository.Login(loginUser.Username.ToLower(), loginUser.Password);

            if (userFromRepo == null)
                return Unauthorized(new ResponseDm
                {
                    IsSuccess = false,
                    Message = "User not Authorized."
                });

            var roles = userFromRepo.UserGroups.Select(x => x.UserGroupId).ToArray();
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, userFromRepo.UserName.ToString()),
                new Claim(ClaimTypes.Name, $"{userFromRepo.FirstName} {userFromRepo.LastName}"),
                new Claim(ClaimTypes.Role, string.Join(",",roles))
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config.Token));

            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(1),
                SigningCredentials = credentials
            };
            var userToReturn = _mapper.Map<UserListDm>(userFromRepo);
            var tokenHandler = new JwtSecurityTokenHandler();

            var token = tokenHandler.CreateToken(tokenDescriptor);

            return Ok(new
            {
                token = tokenHandler.WriteToken(token),
                user = userToReturn
            });
        }
    }
}