using System;
using System.Collections.Generic;
using System.Text;
using Newtonsoft.Json;

namespace PLSystem.DAL.Common
{
    public static class ConfigHelper
    {
        public static string GetCommentaryConfigs()
        {
            var configs = new List<CommentaryConfig>
            {
                new CommentaryConfig
                {
                    Value = "No estimate"
                },
                new CommentaryConfig
                {
                    Value = "FO error"
                },
                new CommentaryConfig
                {
                    Value = "Finance adjustment"
                },
                new CommentaryConfig
                {
                    Value = "Market data issue"
                },
                new CommentaryConfig
                {
                    Value = "System operational issue"
                },
                new CommentaryConfig
                {
                    Value = "System valuation issue"
                },
                new CommentaryConfig
                {
                    Value = "Valuation estimation issue"
                }
            };

            return JsonConvert.SerializeObject(configs);
        }
    }
}
