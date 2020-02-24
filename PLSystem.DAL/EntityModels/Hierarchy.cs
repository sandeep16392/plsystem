using System;
using System.Collections.Generic;
using System.Text;

namespace PLSystem.DAL.EntityModels
{
    public class Hierarchy
    {
        public Hierarchy()
        {
            Portfolios = new List<Portfolio>();
            Estimates = new List<Estimate>();
        }
        public string DEPT_L3_NODE_M { get; set; }
        public string DEPT_L4_NODE_M { get; set; }
        public string DEPT_L5_NODE_M { get; set; }
        public string DEPT_L6_NODE_M { get; set; }
        public string DEPT_L7_NODE_M { get; set; }
        public string DEPT_LEAF_NODE { get; set; }
        public ICollection<UserGroupHierarchy> UserGroupHierarchies { get; set; }
        public ICollection<Portfolio> Portfolios { get; set; }
        public ICollection<Estimate> Estimates { get; set; }
    }
}
