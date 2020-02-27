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
                BusinessDate = date
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
                dailyDeskDm.Currency = p.Currency;
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
                dailyDeskDm.ApprovedBy = dailyPl.UserId;
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
            var user = await _context.Users.Where(x => x.UserName == pLDeskDm.ApprovedBy).FirstOrDefaultAsync();
            foreach (var trade in pLDeskDm.DailyPLTrades)
            {
                var dailyPl = await _context.DailyPLs.Where(x => x.PortfolioId ==trade.PortfolioId && x.Business_Date == pLDeskDm.BusinessDate).FirstOrDefaultAsync();
                dailyPl.Commentary1 = pLDeskDm.PLCommentary;
                dailyPl.Commentary2 = pLDeskDm.VarianceComentary;
                dailyPl.IsApproved = pLDeskDm.IsApproved;
                dailyPl.IsReviewed = pLDeskDm.IsReviewed;
                dailyPl.ApprovedDate = DateTime.UtcNow;
                dailyPl.LastUpdated = DateTime.UtcNow;
                dailyPl.UserId = user.UserName;
                dailyPl.User = user;
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

        public async Task<List<DesksPortfolioViewDm>> GetAllDeskDetails(List<string> roles)
        {
            var desks = await GetDesksAsync(roles);
            var deskList = new List<DesksPortfolioViewDm>();
            foreach (var desk in desks)
            {
                var deskId = desk.DeskId;

                var portfolios = await _context.Portfolios.Where(x => x.HierarchyId == deskId).ToListAsync();

                if (portfolios == null)
                    throw new InvalidOperationException("No Portfolio's found.");

                var dailyDeskDm = new DesksPortfolioViewDm
                {
                    DeskId = desk.DeskId,
                    Desk = desk.Desk,
                };

                foreach (var p in portfolios)
                {
                    var dailyPls = await _context.DailyPLs.Include(x=>x.User).Where(x => x.PortfolioId == p.PortfolioId).ToListAsync();
                    var dailyTrades = await _context.DailyTrades.Where(x => x.PortfolioId == p.PortfolioId).ToListAsync();
                    
                    foreach (var dp in dailyPls)
                    {
                        dailyDeskDm.PortfolioTrades.Add(new PortfolioTradeDm
                        {
                            PortfolioId = dp.PortfolioId,
                            Portfolio_Name = dp.Portfolio.Portfolio_Name,
                            ApprovalDate = dp.ApprovedDate,
                            ApprovedBy = dp.UserId,
                            BusinessDate = dp.Business_Date,
                            Currency = p.Currency
                        });
                    }
                }
                deskList.Add(dailyDeskDm);
            }

            return deskList;
            
        }

        public async Task<List<DeskDm>> GetDesksAsync(List<string> roles)
        {
            var access = await _context.UserGroupHierarchies.Where(x => roles.Contains(x.UserGroupId)).Select(x => x.HierarchyId).ToListAsync();
            var desks = await _context.Hierarchies.Where(x => access.Contains(x.DEPT_LEAF_NODE)).Select(x => new DeskDm
            {
                Desk = x.DEPT_L6_NODE_M,
                DeskId = x.DEPT_LEAF_NODE
            }).ToListAsync();
            return desks;
        }
    }
}
