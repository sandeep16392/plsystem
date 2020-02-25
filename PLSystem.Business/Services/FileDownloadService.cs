using AutoMapper;
using PLSystem.Business.Common;
using PLSystem.Business.Contract;
using PLSystem.DAL.Contracts;
using PLSystem.DAL.DomainModels;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace PLSystem.Business.Services
{
    public class FileDownloadService : IFileDownloadService
    {
        private readonly IProfitLossRepository _profitLossRepository;
        private readonly IMapper _mapper;

        public FileDownloadService(IProfitLossRepository profitLossRepository, IMapper mapper)
        {
            this._profitLossRepository = profitLossRepository;
            this._mapper = mapper;
        }
        public async Task<string> DownloadCsv(string deskId, DateTime date)
        {
            var plDetails = await _profitLossRepository.GetDailyPLTradeAsync(deskId, date);
            var deskData = _mapper.Map<PLDataExportDm>(plDetails);

            //var deskHR = CSVUtil<PLDataExportDm>.ConvertHeaderRow(deskData);
            var tradeHR = CSVUtil<DailyPLTradeDm>.ConvertHeaderRow(plDetails.DailyPLTrades[0]);

            //var finalHR = deskHR + "," + tradeHR + Environment.NewLine;
            //var dailyDeskCsv = CSVUtil<PLDataExportDm>.ConvertObjectToCSV(new List<PLDataExportDm> { deskData });
            var transactCsv = CSVUtil<DailyPLTradeDm>.ConvertObjectToCSV(plDetails.DailyPLTrades);

            //var finalDataCsv = finalHR + Environment.NewLine + dailyDeskCsv + "," + transactCsv;
            var finalDataCsv = tradeHR + Environment.NewLine + transactCsv;
            return finalDataCsv;
        }

        public Task<bool> DownloadPdf()
        {
            throw new NotImplementedException();
        }
    }
}
