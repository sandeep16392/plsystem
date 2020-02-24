import { TradesData } from './TradesData';

export interface PLData {
    'heirarchyId': string;
    'desk': string;
    'businessDate': Date;
    'currency': 'AUD';
    'dailyPLTrades': TradesData[];
    'totalNewTrades': number;
    'totalAmmendments': number;
    'totalAdjustments': number;
    'totalCleanPL': number;
    'totalUnexplained': number;
    'totalPL': number;
    'dealerEstimate': number;
    'variance': number;
    'explainedVariance': number;
    'unExplainedVariance': number;
    'plCommentarty': string;
    'varianceComentary': string;
    'isApproved': boolean;
    'isReviewed': boolean;
    'sent_To_FO_Flag': boolean;
  }
