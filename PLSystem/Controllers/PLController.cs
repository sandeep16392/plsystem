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
                    return NotFound(new ResponseDm
                    {
                        IsSuccess = false,
                        Message = "No Trades found."
                    });
                }
            }
            catch (CustomDataException ex)
            {
                return BadRequest(new ResponseDm
                {
                    IsSuccess = false,
                    Message = ex.Message
                });
            }
            catch (InvalidOperationException ex)
            {
                return NotFound(new ResponseDm
                {
                    IsSuccess = false,
                    Message = ex.Message
                });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new ResponseDm
                {
                    IsSuccess = false,
                    Message = "Error occured. Please contact administrator."
                });
            }
            return Ok(dailyPlInfos);
        }

        [HttpPost]
        public async Task<IActionResult> UpdateAndApprove(PLDeskDm plDesk, string userId)
        {
            if (userId != User.FindFirst(ClaimTypes.NameIdentifier).Value)
                return Unauthorized(new ResponseDm
                {
                    IsSuccess = false,
                    Message = "User not Authorized."
                });

            var roles = User.FindFirst(ClaimTypes.Role).Value.Split(",").ToList();

            var accessDetails = await _profitLossService.GetDesksAsync(roles);

            if (!accessDetails.Any(x => x.DeskId == plDesk.HeirarchyId))
                return Unauthorized(new ResponseDm
                {
                    IsSuccess = false,
                    Message = $"User Not Authorized access this Desk",
                    Errors = new List<string>
                    {
                        $"DeskId - {plDesk.Desk}"
                    }
                });
            plDesk.ApprovedBy = userId;
            var isUpdated = await _profitLossService.UpdateAndApprove(plDesk);
            if (!isUpdated)
                return NotFound(new ResponseDm
                {
                    IsSuccess = false,
                    Message = "Unable to update."
                });

            return Ok(plDesk);
        }

        [HttpPost("email/{deskId}")]
        public async Task<IActionResult> SendEmail(string userId, string deskId, [FromQuery]DateTime businessDate)
        {
            if (userId != User.FindFirst(ClaimTypes.NameIdentifier).Value)
                return Unauthorized(new ResponseDm
                {
                    IsSuccess = false,
                    Message = "User not Authorized."
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

            var res = await _emailService.SendEmail(deskId, businessDate);

            if (res.IsSuccess)
                return Ok(res);
            else
                return StatusCode(StatusCodes.Status403Forbidden, new ResponseDm
                {
                    IsSuccess = false,
                    Message = res.Message
                });
        }
        [HttpGet("file/{deskId}/{type}")]
        [Produces("text/csv")]
        public async Task<IActionResult> DownloadFile(string userId, int type, string deskId, [FromQuery]DateTime businessDate)
        {
            if (userId != User.FindFirst(ClaimTypes.NameIdentifier).Value)
                return Unauthorized(new ResponseDm
                {
                    IsSuccess = false,
                    Message = "User not Authorized."
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
            var fileName = $"{deskId}-{businessDate.ToString("dd-MM-yyyy")}.csv";
            var contentType = string.Empty;
            string result="";
            try
            {
                if (type == (int)FileType.CSV)
                {
                    result = await _fileDownloadService.DownloadCsv(deskId, businessDate);
                }
            }
            catch(Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new ResponseDm
                {
                    IsSuccess = false,
                    Message = "Error occured. Please contact administrator."
                });
            }
            

            var resp = new FileContentResult(Encoding.UTF8.GetBytes(result), "application/octet-stream");
            return resp;
        }

        [HttpGet("getall")]
        public async Task<IActionResult> GetAllDeskDetails(string userId)
        {
            if (userId != User.FindFirst(ClaimTypes.NameIdentifier).Value)
                return Unauthorized(new ResponseDm
                {
                    IsSuccess = false,
                    Message = "User not Authorized."
                });

            var roles = User.FindFirst(ClaimTypes.Role).Value.Split(",").ToList();

            try
            {
                var deskLists = await _profitLossService.GetAllDeskDetails(roles);
                return Ok(deskLists);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new ResponseDm
                {
                    IsSuccess = false,
                    Message = "Error occured. Please contact administrator."
                });
            }
        }
    }
}