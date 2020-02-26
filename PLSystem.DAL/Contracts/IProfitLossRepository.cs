using PLSystem.DAL.DomainModels;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace PLSystem.DAL.Contracts
{
    public interface IProfitLossRepository
    {
        Task<PLDeskDm> GetDailyPLTradeAsync(string deskId, DateTime date);
        Task<List<DeskDm>> GetDesksAsync(List<string> roles);
        Task<List<DesksPortfolioViewDm>> GetAllDeskDetails(List<string> roles);
        Task<bool> UpdateAndApprove(PLDeskDm pLDeskDm);
        Task<bool> UpdateFOEmail(string deskId, DateTime businessDate);
    }
}
