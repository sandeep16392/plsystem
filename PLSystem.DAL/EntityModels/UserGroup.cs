using System;
using System.Collections.Generic;
using System.Text;

namespace PLSystem.DAL.EntityModels
{
    public class UserGroup
    {
        public string Id { get; set; }
        public ICollection<UserUserGroup> UserGroups { get; set; }
        public ICollection<UserGroupHierarchy> UserGroupHierarchies { get; set; }
    }
}
