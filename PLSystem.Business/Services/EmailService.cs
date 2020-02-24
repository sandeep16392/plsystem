using System;
using System.Collections.Generic;
using System.Text;
using System.Net;
using System.Net.Mail;
using PLSystem.Business.Contract;
using System.Threading.Tasks;
using PLSystem.DAL.Contracts;
using PLSystem.Business.Common;
using PLSystem.DAL.DomainModels;

namespace PLSystem.Business.Services
{
    public class EmailService : IEmailService
    {
        private readonly IProfitLossRepository _profitLossRepository;

        public EmailService(IProfitLossRepository profitLossRepository)
        {
            this._profitLossRepository = profitLossRepository;
        }
        public async Task<EmailResponseDm> SendEmail(string deskId, DateTime businessDate)
        {
            bool isUpdated = false;
            string toEmail = "acc.sandeep.16392@gmail.com";
            try
            {
                var plDetail = await _profitLossRepository.GetDailyPLTradeAsync(deskId, businessDate);
                var body = string.Format(Constants.EmailTemplate, plDetail.TotalPL, plDetail.DealerEstimate, 
                    plDetail.Variance, plDetail.ExplainedVariance, plDetail.UnExplainedVariance, plDetail.PLCommentary, 
                    plDetail.VarianceComentary);
                MailMessage mail = new MailMessage()
                {
                    From = new MailAddress("sandeepkumar16392@gmail.com", "Sandeep")
                };
                mail.To.Add(new MailAddress(toEmail));
                //mail.CC.Add(new MailAddress(_emailSettings.CcEmail));

                mail.Subject = $"[{plDetail.BusinessDate.ToString("dd-MMM-yyyy")}]: P&L Report - {plDetail.Desk}";
                mail.Body = body;
                mail.IsBodyHtml = true;
                mail.Priority = MailPriority.High;

                using (SmtpClient smtp = new SmtpClient("smtp.gmail.com", 587))
                {
                    smtp.Credentials = new NetworkCredential("sandeepkumar16392@gmail1.com", "rooosgggrglsltmi");
                    smtp.EnableSsl = true;
                    await smtp.SendMailAsync(mail);
                }

                isUpdated = await _profitLossRepository.UpdateFOEmail(deskId, businessDate);
                var emailresp = new EmailResponseDm
                {
                    Message = "Email Sent Successfully!",
                    To = toEmail,
                    IsSuccess = true
                };

                return emailresp;
            }
            catch (Exception ex)
            {
                //do something here
                var emailresp = new EmailResponseDm
                {
                    Message = "Email Failure!",
                    To = toEmail,
                    IsSuccess = false
                };
                return emailresp;
            }
        }

    }
}
