using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PLSystem.Business.Contract;
using PLSystem.DAL.Common;
using PLSystem.DAL.DomainModels;

namespace PLSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PLController : ControllerBase
    {
        private readonly IProfitLossService _profitLossService;
        private readonly IEmailService _emailService;

        public PLController(IProfitLossService profitLossService, IEmailService emailService)
        {
            this._profitLossService = profitLossService;
            this._emailService = emailService;
        }


        [HttpGet("dailyPLTrades/{deskId}")]
        public async Task<IActionResult> GetDailyPLTrades(string deskId, [FromQuery]DateTime businessDate)
        {
            PLDeskDm dailyPlInfos = null;
            try
            {
                dailyPlInfos = await _profitLossService.GetDailyPLTradeAsync(deskId, businessDate);
                if(dailyPlInfos == null)
                {
                    return NotFound("No Trades found.");
                }
            }
            catch(CustomDataException ex)
            {
                return BadRequest(ex.Message);
            }
            catch(InvalidOperationException ex)
            {
                return NotFound(ex.Message);
            }
            catch(Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
            return Ok(dailyPlInfos);
        }

        [HttpPost]
        public async Task<IActionResult> UpdateAndApprove(PLDeskDm plDesk)
        {
            var isUpdated = await _profitLossService.UpdateAndApprove(plDesk);
            if (!isUpdated)
                return NotFound(plDesk);

            return Ok(plDesk);
        }

        [HttpPost("email/{deskId}")]
        public async Task<IActionResult> SendEmail(string deskId, [FromQuery]DateTime businessDate)
        {
            var res = await _emailService.SendEmail(deskId, businessDate);

            if (res.IsSuccess)
                return Ok(res);
            else
                return StatusCode(StatusCodes.Status403Forbidden, res);
        }
    }
}