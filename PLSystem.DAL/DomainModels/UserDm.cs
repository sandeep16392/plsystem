using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace PLSystem.DAL.DomainModels
{
    public class UserDm
    {
        [Required]
        [StringLength(20, MinimumLength = 7, ErrorMessage = "Username should have 7 to 20 characters.")]
        public string UserName { get; set; }

        [Required]
        [StringLength(15, MinimumLength = 7, ErrorMessage = "Password Length should be between 7 to 15 characters.")]
        public string Password { get; set; }
        [Required]
        public string FirstName { get; set; }
        [Required]
        public string LastName { get; set; }
        public DateTime LastActive { get; set; }
        public DateTime Created { get; set; }
        public List<string> UserGroup { get; set; }

        public UserDm()
        {
            LastActive = DateTime.Now;
            Created = DateTime.Now;
        }
    }
}
