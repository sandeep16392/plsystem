using System;
using System.Collections.Generic;
using System.Text;

namespace PLSystem.DAL.EntityModels
{
    public class Portfolio
    {
        public int PortfolioId { get; set; }
        public string Portfolio_Name { get; set; }
        public string Source_System { get; set; }
        public string Region { get; set; }
        public DateTime Start_Date { get; set; }
        public DateTime End_Date { get; set; }
        public bool IsActive { get; set; }
        public string HierarchyId { get; set; }
        public Hierarchy Hierarchy { get; set; }
        public string Currency { get; set; }
        public ICollection<DailyPL> DailyPLs { get; set; }
        public ICollection<DailyTrade> DailyTrades { get; set; }

        public Portfolio()
        {
            DailyTrades = new List<DailyTrade>();
            DailyPLs = new List<DailyPL>();
        }
    }
}
