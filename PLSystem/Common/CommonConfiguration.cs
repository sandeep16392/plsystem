using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PLSystem.Common
{
    public class CommonConfigurations : ICommonConfigurations
    {
        private readonly IConfiguration _configuration;
        public CommonConfigurations(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public string Token => _configuration["Token"];
        public string ConnectionString => _configuration["PLSystemDatabase"];
    }
}
