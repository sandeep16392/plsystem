using System;
using System.Collections.Generic;
using System.Text;

namespace PLSystem.Business.Common
{
    public static class Constants
    {
        public static string EmailTemplate = @"
            <div>Total PL - {0}</div><br>
            <div>Dealer Estimate - {1}</div><br>
            <div>Variance - {2}</div><br>
            <div>Explained Variance - {3}</div><br>
            <div>Unexplained Variance - {4}</div><br>
            <div>P&L Comment - {5}</div><br>
            <div>Variance Comment - {6}</div>
        ";
    }
}
