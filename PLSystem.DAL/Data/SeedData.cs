using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;
using Newtonsoft.Json;
using PLSystem.DAL.EntityModels;
using Newtonsoft.Json.Converters;
using Microsoft.EntityFrameworkCore;

namespace PLSystem.DAL.Data
{
    public class SeedData
    {
        private readonly DataContext _context;
        public SeedData(DataContext dataContext)
        {
            _context = dataContext;
        }

        public void Seed()
        {
            if (_context.Hierarchies.Any())
            {
                return;
            }
            var format = "dd-MM-yyyy"; // your datetime format
            var dateTimeConverter = new IsoDateTimeConverter { DateTimeFormat = format };

            var hierarchyData = System.IO.File.ReadAllText("../PLSystem.DAL/Data/hierarchy.json");
            var portfolioData = System.IO.File.ReadAllText("../PLSystem.DAL/Data/portfolio.json");
            var estimatesData = System.IO.File.ReadAllText("../PLSystem.DAL/Data/estimates.json");
            var dailyPlData = System.IO.File.ReadAllText("../PLSystem.DAL/Data/dailypl.json");
            var dailyTradesData = System.IO.File.ReadAllText("../PLSystem.DAL/Data/dailyTrades.json");
            var groups = System.IO.File.ReadAllText("../PLSystem.DAL/Data/usergroups.json");
            var usergroups = JsonConvert.DeserializeObject<List<UserGroup>>(groups);
            var hierarchy = JsonConvert.DeserializeObject<List<Hierarchy>>(hierarchyData);
            var portfolios = JsonConvert.DeserializeObject<List<Portfolio>>(portfolioData, dateTimeConverter);
            var estimates = JsonConvert.DeserializeObject<List<Estimate>>(estimatesData, dateTimeConverter);
            var dailyPLs = JsonConvert.DeserializeObject<List<DailyPL>>(dailyPlData, dateTimeConverter);
            var dailyTrades = JsonConvert.DeserializeObject<List<DailyTrade>>(dailyTradesData, dateTimeConverter);


            using (var transaction = _context.Database.BeginTransaction())
            {
                _context.Hierarchies.AddRange(hierarchy);
                _context.Portfolios.AddRange(portfolios);
                _context.Estimates.AddRange(estimates);
                _context.DailyPLs.AddRange(dailyPLs);
                _context.DailyTrades.AddRange(dailyTrades);
                _context.UserGroups.AddRange(usergroups);

                _context.Database.ExecuteSqlCommand("SET IDENTITY_INSERT [PLSystemDb].[dbo].[Portfolios] ON;");
                _context.SaveChanges();
                _context.Database.ExecuteSqlCommand("SET IDENTITY_INSERT [PLSystemDb].[dbo].[Portfolios] OFF;");

                transaction.Commit();
            }
        }

        public void SeedUserGroups()
        {
            if (_context.UserGroupHierarchies.Any())
            {
                return;
            }
            var mapping = System.IO.File.ReadAllText("../PLSystem.DAL/Data/groupHierarchyMapping.json");
            var uGrps = JsonConvert.DeserializeObject<List<UserGroupHierarchy>>(mapping);

            foreach (var grp in uGrps)
            {
                var hierarchyEntity = _context.Hierarchies.Where(x => x.DEPT_LEAF_NODE == grp.HierarchyId).FirstOrDefault();
                var userGroup = _context.UserGroups.Where(x => x.Id == grp.UserGroupId).FirstOrDefault();
                _context.UserGroupHierarchies.Add(new UserGroupHierarchy
                {
                    Hierarchy = hierarchyEntity,
                    UserGroup = userGroup
                });
            }

            _context.SaveChanges();
        }
    }
}
