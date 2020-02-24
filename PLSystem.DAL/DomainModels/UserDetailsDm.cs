using System;
using System.Collections.Generic;
using System.Text;

namespace PLSystem.DAL.DomainModels
{
    public class UserDetailsDm
    {
        public int Id { get; set; }
        public string UserName { get; set; }
        public string Gender { get; set; }
        public DateTime Created { get; set; }
        public DateTime LastActive { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
    }
}
