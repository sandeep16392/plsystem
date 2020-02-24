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
    public class ConfigurationRepository : IConfigurationRepository
    {
        private readonly DataContext _context;

        public ConfigurationRepository(DataContext dataContext)
        {
            this._context = dataContext;
        }
        public async Task<string> GetComments()
        {
            var comments = ConfigHelper.GetCommentaryConfigs();
            await Task.Delay(1);
            return comments;
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
