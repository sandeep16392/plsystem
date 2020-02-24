using System;
using System.Collections.Generic;
using System.Text;

namespace PLSystem.DAL.DomainModels
{
    public class EmailResponseDm
    {
        public string Message { get; set; }
        public string To { get; set; }
        public bool IsSuccess { get; set; }
    }
}
