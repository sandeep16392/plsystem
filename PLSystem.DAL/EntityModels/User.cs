using System;
using System.Collections.Generic;
using System.Text;

namespace PLSystem.DAL.EntityModels
{
    public class User
    {
        public User()
        {
            UserGroups = new List<UserUserGroup>();
        }
        public int Id { get; set; }
        public string UserName { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public byte[] PasswordHash { get; set; }
        public byte[] PasswordSalt { get; set; }
        public DateTime Created { get; set; }
        public DateTime LastActive { get; set; }
        public ICollection<UserUserGroup> UserGroups { get; set; }
        public ICollection<User> Users { get; set; }
    }
}
