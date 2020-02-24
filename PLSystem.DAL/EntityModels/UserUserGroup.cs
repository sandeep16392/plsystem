using System;
using System.Collections.Generic;
using System.Text;

namespace PLSystem.DAL.EntityModels
{
    public class UserUserGroup
    {
        public string UserName { get; set; }
        public User User { get; set; }
        public string UserGroupId { get; set; }
        public UserGroup UserGroup { get; set; }
    }
}
