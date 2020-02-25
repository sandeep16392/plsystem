using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace PLSystem.Business.Contract
{
    public interface IFileDownloadService
    {
        Task<bool> DownloadPdf();
        Task<string> DownloadCsv(string deskId, DateTime date);
    }
}
