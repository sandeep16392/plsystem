using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace PLSystem.DAL.EntityModels
{
    public class DailyPL
    {
        public int Id { get; set; }
        public DateTime Business_Date { get; set; }
        public double Daily_PL { get; set; }
        public bool IsApproved { get; set; }
        public bool IsReviewed { get; set; }
        public DateTime ApprovedDate { get; set; }
        public DateTime LastUpdated { get; set; }
        public bool Sent_To_FO_Flag { get; set; }
        public string Commentary1 { get; set; }
        public string Commentary2 { get; set; }
        public int PortfolioId { get; set; }
        public Portfolio Portfolio { get; set; }
        public string UserId { get; set; }
        public User User { get; set; }
    }
}
