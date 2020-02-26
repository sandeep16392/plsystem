using System;

namespace PLSystem.DAL.DomainModels
{
    public class PortfolioTradeDm
    {
        public int PortfolioId { get; set; }
        public string Portfolio_Name { get; set; }
        public DateTime BusinessDate { get; set; }
        public string ApprovedBy { get; set; }
        public DateTime ApprovalDate { get; set; }
        public string Currency { get; set; }
    }
}