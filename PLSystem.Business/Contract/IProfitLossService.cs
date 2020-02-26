using PLSystem.DAL.DomainModels;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace PLSystem.Business.Contract
{
    public interface IProfitLossService
    {
        Task<List<DeskDm>> GetDesksAsync(List<string> roles);
        Task<PLDeskDm> GetDailyPLTradeAsync(string deskId, DateTime businessDate);
        Task<string> GetComments();
        Task<bool> UpdateAndApprove(PLDeskDm pLDeskDm);
        Task<List<DesksPortfolioViewDm>> GetAllDeskDetails(List<string> roles);
    }
}
