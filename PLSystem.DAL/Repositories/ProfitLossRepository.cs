using PLSystem.DAL.Contracts;
using PLSystem.DAL.Data;
using PLSystem.DAL.DomainModels;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using PLSystem.DAL.Common;

namespace PLSystem.DAL.Repositories
{
    public class ProfitLossRepository : IProfitLossRepository
    {
        private readonly DataContext _context;

        public ProfitLossRepository(DataContext dataContext)
        {
            this._context = dataContext;
        }
        public async Task<PLDeskDm> GetDailyPLTradeAsync(string deskId, DateTime date)
        {
            var plData = await _context.Hierarchies.Where(x => x.DEPT_LEAF_NODE == deskId).FirstAsync();

            if (plData == null)
                throw new CustomDataException(deskId);

            var dealEst = await _context.Estimates.Where(x => x.HierarchyId == deskId && x.Date == date).FirstOrDefaultAsync();
            var portfolios = await _context.Portfolios.Include(x => x.DailyPLs).Include(x => x.DailyTrades).Where(x => x.HierarchyId == deskId).ToListAsync();

            if (portfolios == null)
                throw new InvalidOperationException("No Portfolio's found.");

            var dailyDeskDm = new PLDeskDm
            {
                HeirarchyId = plData.DEPT_LEAF_NODE,
                Desk = plData.DEPT_L6_NODE_M,
                BusinessDate = date,
                Currency = "AUD"
            };
            var tradesFound = false;
            foreach (var p in portfolios)
            {
                var dailyPl = await _context.DailyPLs.Where(x => x.PortfolioId == p.PortfolioId && x.Business_Date == date).FirstOrDefaultAsync();
                var dailyTrades = await _context.DailyTrades.Where(x => x.PortfolioId == p.PortfolioId && x.Business_Date == date).FirstOrDefaultAsync();
                if((dailyPl == null || dailyTrades == null) && !tradesFound)
                {
                    tradesFound = false;
                    continue;
                }
                else
                {
                    tradesFound = true;
                }

                dailyDeskDm.DailyPLTrades.Add(new DailyPLTradeDm
                {
                    ActualPL = dailyPl.Daily_PL,
                    PortfolioId = p.PortfolioId,
                    Portfolio_Name = p.Portfolio_Name,
                    NewTrades = dailyTrades.NewTrades,
                    Adjustment = dailyTrades.Adjustment,
                    Ammends = dailyTrades.Ammends,
                });
                dailyDeskDm.TotalPL += dailyPl.Daily_PL;
                dailyDeskDm.TotalNewTrades += dailyTrades.NewTrades;
                dailyDeskDm.TotalAmmendments += dailyTrades.Ammends;
                dailyDeskDm.TotalAdjustments += dailyTrades.Adjustment;
                dailyDeskDm.TotalUnexplained += dailyTrades.Unexplained;
                dailyDeskDm.IsApproved = dailyPl.IsApproved;
                dailyDeskDm.IsReviewed = dailyPl.IsReviewed;
                dailyDeskDm.PLCommentary = dailyPl.Commentary1;
                dailyDeskDm.VarianceComentary = dailyPl.Commentary2;
            }
            if (!tradesFound)
                return null;
            dailyDeskDm.ExplainedVariance = dealEst == null ? 0 : dealEst.ExplainedVariance;
            dailyDeskDm.DealerEstimate = dealEst == null ? 0 : dealEst.EstimateAmount;
            dailyDeskDm.Variance = dailyDeskDm.TotalPL - dailyDeskDm.DealerEstimate;

            return dailyDeskDm;
        }

        public async Task<bool> UpdateAndApprove(PLDeskDm pLDeskDm)
        {
            var plData = await _context.Hierarchies.Where(x => x.DEPT_LEAF_NODE == pLDeskDm.HeirarchyId).FirstAsync();

            if (plData == null)
                throw new CustomDataException(pLDeskDm.HeirarchyId);

            var dealEst = await _context.Estimates
                .Where(x => x.HierarchyId == pLDeskDm.HeirarchyId && x.Date == pLDeskDm.BusinessDate)
                .FirstOrDefaultAsync();

            dealEst.ExplainedVariance = pLDeskDm.ExplainedVariance;

            foreach (var trade in pLDeskDm.DailyPLTrades)
            {
                var dailyPl = await _context.DailyPLs.Where(x => x.PortfolioId ==trade.PortfolioId && x.Business_Date == pLDeskDm.BusinessDate).FirstOrDefaultAsync();
                dailyPl.Commentary1 = pLDeskDm.PLCommentary;
                dailyPl.Commentary2 = pLDeskDm.VarianceComentary;
                dailyPl.IsApproved = pLDeskDm.IsApproved;
                dailyPl.IsReviewed = pLDeskDm.IsReviewed;
                dailyPl.ApprovedDate = DateTime.UtcNow;
                dailyPl.LastUpdated = DateTime.UtcNow;
                //dailyPl.ApprovedBy = ushort   //TODO: add approver when user implemented
            }

            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> UpdateFOEmail(string deskId, DateTime businessDate)
        {
            var plData = await _context.Hierarchies.Where(x => x.DEPT_LEAF_NODE == deskId).FirstAsync();

            if (plData == null)
                throw new CustomDataException(deskId);

            var portfolios = await _context.Portfolios.Include(x => x.DailyPLs).Include(x => x.DailyTrades)
                .Where(x => x.HierarchyId == deskId).ToListAsync();

            foreach (var portfolio in portfolios)
            {
                var dailyPl = await _context.DailyPLs.Where(x => x.PortfolioId == portfolio.PortfolioId && x.Business_Date == businessDate).FirstOrDefaultAsync();
                dailyPl.Sent_To_FO_Flag = true;
                dailyPl.LastUpdated = DateTime.UtcNow;
            }

            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<List<DeskDm>> GetDesksAsync()
        {
            var desks = await _context.Hierarchies.Select(x => new DeskDm
            {
                Desk = x.DEPT_L6_NODE_M,
                DeskId = x.DEPT_LEAF_NODE
            }).ToListAsync();
            return desks;
        }
    }
}
