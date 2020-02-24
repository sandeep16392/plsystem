using PLSystem.DAL.DomainModels;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace PLSystem.DAL.Contracts
{
    public interface IConfigurationRepository
    {
        Task<List<DeskDm>> GetDesksAsync();
        Task<string> GetComments();
    }
}
