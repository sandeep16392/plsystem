using System;
using System.Collections.Generic;
using System.Text;

namespace PLSystem.DAL.DomainModels
{
    public class DailyTradesDm
    {
        public DateTime Business_Date { get; set; }
        public double NewTrades { get; set; }
        public double Ammends { get; set; }
        public double Adjustment { get; set; }
        public double Unexplained { get; set; }
        public int PortfolioId { get; set; }
        public string Portfolio_Name { get; set; }
    }
}
