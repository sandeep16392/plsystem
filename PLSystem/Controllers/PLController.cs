using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PLSystem.Business.Common;
using PLSystem.Business.Contract;
using PLSystem.DAL.Common;
using PLSystem.DAL.DomainModels;

namespace PLSystem.Controllers
{
    [Route("api/[controller]/{userId}")]
    [ApiController]
    public class PLController : ControllerBase
    {
        private readonly IProfitLossService _profitLossService;
        private readonly IEmailService _emailService;
        private readonly IFileDownloadService _fileDownloadService;

        public PLController(IProfitLossService profitLossService, IEmailService emailService, IFileDownloadService fileDownloadService)
        {
            this._profitLossService = profitLossService;
            this._emailService = emailService;
            this._fileDownloadService = fileDownloadService;
        }


        [HttpGet("dailyPLTrades/{deskId}")]
        public async Task<IActionResult> GetDailyPLTrades(string userId, string deskId, [FromQuery]DateTime businessDate)
        {
            if (userId != User.FindFirst(ClaimTypes.NameIdentifier).Value)
                return Unauthorized(new ResponseDm
                {
                    IsSuccess = false,
                    Errors = new List<string>
                    {
                        $"UserId - {userId}"
                    },
                    Message = $"Invalid UserId - {userId}"
                });

            var roles = User.FindFirst(ClaimTypes.Role).Value.Split(",").ToList();

            var accessDetails = await _profitLossService.GetDesksAsync(roles);

            if (!accessDetails.Any(x => x.DeskId == deskId))
                return Unauthorized(new ResponseDm
                {
                    IsSuccess = false,
                    Message = $"User Not Authorized access this Desk",
                    Errors = new List<string>
                    {
                        $"DeskId - {deskId}"
                    }
                });

            PLDeskDm dailyPlInfos = null;
            try
            {
                dailyPlInfos = await _profitLossService.GetDailyPLTradeAsync(deskId, businessDate);
                if (dailyPlInfos == null)
                {
                    return NotFound("No Trades found.");
                }
            }
            catch (CustomDataException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (InvalidOperationException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
            return Ok(dailyPlInfos);
        }

        [HttpPost]
        public async Task<IActionResult> UpdateAndApprove(PLDeskDm plDesk, string userId)
        {
            if (userId != User.FindFirst(ClaimTypes.NameIdentifier).Value)
                return Unauthorized();

            var roles = User.FindFirst(ClaimTypes.Role).Value.Split(",").ToList();

            var accessDetails = await _profitLossService.GetDesksAsync(roles);

            if (!accessDetails.Any(x => x.DeskId == plDesk.Desk))
                return Unauthorized(new ResponseDm
                {
                    IsSuccess = false,
                    Message = $"User Not Authorized access this Desk",
                    Errors = new List<string>
                    {
                        $"DeskId - {plDesk.Desk}"
                    }
                });

            var isUpdated = await _profitLossService.UpdateAndApprove(plDesk);
            if (!isUpdated)
                return NotFound(plDesk);

            return Ok(plDesk);
        }

        [HttpPost("email/{deskId}")]
        public async Task<IActionResult> SendEmail(string userId, string deskId, [FromQuery]DateTime businessDate)
        {
            if (userId != User.FindFirst(ClaimTypes.NameIdentifier).Value)
                return Unauthorized();

            var roles = User.FindFirst(ClaimTypes.Role).Value.Split(",").ToList();

            var accessDetails = await _profitLossService.GetDesksAsync(roles);

            if (!accessDetails.Any(x => x.DeskId == deskId))
                return Unauthorized(new ResponseDm
                {
                    IsSuccess = false,
                    Message = $"User Not Authorized access this Desk",
                    Errors = new List<string>
                    {
                        $"DeskId - {deskId}"
                    }
                });

            var res = await _emailService.SendEmail(deskId, businessDate);

            if (res.IsSuccess)
                return Ok(res);
            else
                return StatusCode(StatusCodes.Status403Forbidden, res);
        }
        [HttpGet("file/{deskId}/{type}")]
        public async Task<IActionResult> DownloadFile(int type, string deskId, [FromQuery]DateTime businessDate)
        {
            var contentType = string.Empty;
            var resp = await _fileDownloadService.DownloadCsv(deskId, businessDate);
            var result = new FileContentResult(Encoding.UTF8.GetBytes(resp), "application/octet-stream");

            if (type == (int)FileType.CSV)
            {
                contentType = "text/csv";
                result.FileDownloadName = $"{deskId}-{businessDate.ToString("dd-MM-yyyy")}.csv";
                //result.ContentType = contentType;
            }

            return result;//File(Encoding.UTF8.GetBytes(resp), "text/csv", "desk.csv");
        }
    }
}