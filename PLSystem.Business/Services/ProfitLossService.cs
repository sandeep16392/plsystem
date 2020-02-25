using PLSystem.Business.Contract;
using PLSystem.DAL.Common;
using PLSystem.DAL.Contracts;
using PLSystem.DAL.DomainModels;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace PLSystem.Business.Services
{
    public class ProfitLossService : IProfitLossService
    {
        private readonly IProfitLossRepository _profitLossRepository;
        private readonly IConfigurationRepository _configurationRepository;

        public ProfitLossService(IProfitLossRepository profitLossRepository, IConfigurationRepository configurationRepository)
        {
            this._profitLossRepository = profitLossRepository;
            this._configurationRepository = configurationRepository;
        }
        public async Task<PLDeskDm> GetDailyPLTradeAsync(string deskId, DateTime businessDate)
        {
            try
            {
                var dailyPLInfos = await _profitLossRepository.GetDailyPLTradeAsync(deskId, businessDate);
                if (dailyPLInfos == null)
                    return dailyPLInfos;
                foreach (var tradeDm in dailyPLInfos.DailyPLTrades)
                {
                    dailyPLInfos.TotalCleanPL += tradeDm.CleanPL;
                }
                return dailyPLInfos;
            }
            catch (CustomDataException ex)
            {
                throw ex;
            }
            catch(InvalidOperationException ex)
            {
                throw ex;
            }
            catch(Exception ex)
            {
                throw ex;
            }
        }

        public async Task<bool> UpdateAndApprove(PLDeskDm pLDeskDm)
        {
            var isUpdated = await _profitLossRepository.UpdateAndApprove(pLDeskDm);
            return isUpdated;
        }

        public async Task<List<DeskDm>> GetDesksAsync(List<string> roles)
        {
            var desks = await _configurationRepository.GetDesksAsync(roles);

            return desks;
        }

        public async Task<string> GetComments()
        {
            var comments = await _configurationRepository.GetComments();
            return comments;
        }
    }
}
