using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PLSystem.Business.Contract;

namespace PLSystem.Controllers
{
    [Authorize]
    [Route("api/[controller]/{userId}")]
    [ApiController]
    public class ConfigurationController : ControllerBase
    {
        private readonly IProfitLossService _profitLossService;

        public ConfigurationController(IProfitLossService profitLossService)
        {
            this._profitLossService = profitLossService;
        }

        [HttpGet("desks")]
        public async Task<IActionResult> GetDesks(string userId)
        {
            if (userId != User.FindFirst(ClaimTypes.NameIdentifier).Value)
                return Unauthorized();

            var roles = User.FindFirst(ClaimTypes.Role).Value.Split(",").ToList();

            var desks = await _profitLossService.GetDesksAsync(roles);

            return Ok(desks);
        }

        [HttpGet("comments")]
        public async Task<IActionResult> GetComments(string userId)
        {
            if (userId != User.FindFirst(ClaimTypes.NameIdentifier).Value)
                return Unauthorized();

            var comments = await _profitLossService.GetComments();
            return Ok(comments);
        }
    }
}