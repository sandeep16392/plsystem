using System;
using System.Collections.Generic;
using System.Text;

namespace PLSystem.DAL.DomainModels
{
    public class DesksPortfolioViewDm
    {
        public DesksPortfolioViewDm()
        {
            PortfolioTrades = new List<PortfolioTradeDm>();
        }
        public string DeskId { get; set; }
        public string Desk { get; set; }
        public List<PortfolioTradeDm> PortfolioTrades { get; set; }
    }
}
