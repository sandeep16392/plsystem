using System;
using System.Collections.Generic;
using System.Text;

namespace PLSystem.DAL.DomainModels
{
    public class PLDeskDm
    {
        public PLDeskDm()
        {
            DailyPLTrades = new List<DailyPLTradeDm>();
        }
        public string HeirarchyId { get; set; }
        public string Desk { get; set; }
        public DateTime BusinessDate { get; set; }
        public string Currency { get; set; }
        public List<DailyPLTradeDm> DailyPLTrades { get; set; }
        public double TotalNewTrades { get; set; }
        public double TotalAmmendments { get; set; }
        public double TotalAdjustments { get; set; }
        public double TotalCleanPL { get; set; }
        public double TotalUnexplained { get; set; }
        public double TotalPL { get; set; }
        public double DealerEstimate { get; set; }
        public double Variance { get; set; }
        public double ExplainedVariance { get; set; }
        public double UnExplainedVariance { get; set; }
        public string PLCommentary { get; set; }
        public string VarianceComentary { get; set; }
        public bool IsApproved { get; set; }
        public bool IsReviewed { get; set; }
        public bool Sent_To_FO_Flag { get; set; }
    }
}
