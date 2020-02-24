using System;
using System.Collections.Generic;
using System.Text;

namespace PLSystem.DAL.DomainModels
{
    public class DailyPLDM
    {
        public DateTime Business_Date { get; set; }
        public int PortfolioId { get; set; }
        public string Portfolio_Name { get; set; }
        public double Daily_PL { get; set; }
        public bool IsApproved { get; set; }
        public bool IsReviewed { get; set; }
        public int ApprovedBy { get; set; }
        public DateTime ApprovedDate { get; set; }
        public DateTime LastUpdated { get; set; }
        public bool Sent_To_FO_Flag { get; set; }
        public string Commentary1 { get; set; }
        public string Commentary2 { get; set; }
    }
}
