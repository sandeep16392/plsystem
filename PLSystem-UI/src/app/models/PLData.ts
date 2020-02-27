import { TradesData } from './TradesData';

export interface PLData {
    heirarchyId: string;
    desk: string;
    businessDate: Date;
    currency: string;
    dailyPLTrades: TradesData[];
    totalNewTrades: number;
    totalAmmendments: number;
    totalAdjustments: number;
    totalCleanPL: number;
    totalUnexplained: number;
    totalPL: number;
    dealerEstimate: number;
    variance: number;
    explainedVariance: number;
    unExplainedVariance: number;
    plCommentary: string;
    varianceComentary: string;
    isApproved: boolean;
    isReviewed: boolean;
    sent_To_FO_Flag: boolean;
  }
