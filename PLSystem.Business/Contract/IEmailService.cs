using PLSystem.DAL.DomainModels;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace PLSystem.Business.Contract
{
    public interface IEmailService
    {
        Task<EmailResponseDm> SendEmail(string deskId, DateTime businessDate);
    }
}
