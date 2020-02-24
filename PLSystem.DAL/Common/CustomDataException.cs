using System;
using System.Collections.Generic;
using System.Text;

namespace PLSystem.DAL.Common
{
    public class CustomDataException : Exception
    {
        public CustomDataException()
        {

        }

        public CustomDataException(string name)
            : base(String.Format("Record not found with given Id: {0}", name))
        {
        }
    }
}
