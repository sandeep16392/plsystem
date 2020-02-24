using System;
using System.Collections.Generic;
using System.Text;

namespace PLSystem.DAL.DomainModels
{
    public class DailyPLTradeDm
    {
        public int PortfolioId { get; set; }
        public string Portfolio_Name { get; set; }
        public double ActualPL { get; set; }
        public double NewTrades { get; set; }
        public double Ammends { get; set; }
        public double Adjustment { get; set; }
        public double Unexplained { get; set; }
        public double CleanPL
        {
            get
            {
                var result = this.ActualPL - this.NewTrades - this.Ammends - this.Adjustment;
                return result;
            }
            private set { }
        }
    }
}
