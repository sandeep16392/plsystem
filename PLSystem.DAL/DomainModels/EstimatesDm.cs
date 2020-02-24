using System;
using System.Collections.Generic;
using System.Text;

namespace PLSystem.DAL.DomainModels
{
    public class EstimatesDm
    {
        public DateTime Date { get; set; }
        public double EstimateAmount { get; set; }
        public double ExplainedVariance { get; set; }
        public string HierarchyId { get; set; }
        public string Desk { get; set; }
    }
}
