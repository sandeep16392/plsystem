using System;

namespace PLSystem.DAL.EntityModels
{
    public class Estimate
    {
        public int Id { get; set; }
        public DateTime Date { get; set; }
        public double ExplainedVariance { get; set; }
        public double EstimateAmount { get; set; }
        public string HierarchyId { get; set; }
        public Hierarchy Hierarchy { get; set; }
    }
}
