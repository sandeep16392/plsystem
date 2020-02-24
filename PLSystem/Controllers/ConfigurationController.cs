using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PLSystem.Business.Contract;

namespace PLSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ConfigurationController : ControllerBase
    {
        private readonly IProfitLossService _profitLossService;

        public ConfigurationController(IProfitLossService profitLossService)
        {
            this._profitLossService = profitLossService;
        }

        [HttpGet("desks")]
        public async Task<IActionResult> GetDesks()
        {
            var desks = await _profitLossService.GetDesksAsync();

            return Ok(desks);
        }

        [HttpGet("comments")]
        public async Task<IActionResult> GetComments()
        {
            var comments = await _profitLossService.GetComments();
            return Ok(comments);
        }
    }
}