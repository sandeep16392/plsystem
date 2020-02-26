import { PortfolioTrade } from './PortfolioTrade';

export interface PortfolioView {
    deskId: string;
    desk: string;
    portfolioTrades: PortfolioTrade[];
}
