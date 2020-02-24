using System;
using System.Collections.Generic;
using System.Text;

namespace PLSystem.DAL.EntityModels
{
    public class DailyTrade
    {
        public int Id { get; set; }

        public DateTime Business_Date { get; set; }
        public double NewTrades { get; set; }
        public double Ammends { get; set; }
        public double Adjustment { get; set; }
        public double Unexplained { get; set; }
        public int PortfolioId { get; set; }
        public Portfolio Portfolio { get; set; }
    }
}
