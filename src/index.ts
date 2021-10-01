import { BetaAnalyticsDataClient } from '@google-analytics/data';
import { Page } from './interfaces/Page'
import { Credentials } from './interfaces/Credentials'

export { Page, Credentials }

export class MostVisitedPages {
    analytics: BetaAnalyticsDataClient;
    propertyId: string;

    constructor(credentials: Credentials, propertyId: string) {
        this.analytics = new BetaAnalyticsDataClient({credentials: credentials});
        this.propertyId = propertyId;
    }

    private async runReport(startDate: string, limit?: number): Promise<Page[]> {
        const response: Page[] = [];
        const [report] = await this.analytics.runReport({
            property: `properties/${this.propertyId}`,
            dateRanges: [{ startDate: startDate, endDate: 'today' }],
            dimensions: [{ name: 'fullPageUrl' }, { name: 'pageTitle' }],
            metrics: [{ name: 'engagedSessions' }],
            limit: limit ?? null
        });
        report.rows?.forEach((row: any) => {
            const record: Page = {
                title: row.dimensionValues[1].value,
                url: row.dimensionValues[0].value,
                views: Number.parseInt(row.metricValues[0].value)
            }
            response.push(record)
        });
        return response
    }

    public async getPageViews(limit?: number): Promise<Page[]>{
        return await this.runReport('90daysAgo', limit ?? 10)
    }

    public async getPageViewsSince(startDate: string, limit?: number): Promise<Page[]>{
        return await this.runReport(startDate, limit ?? 10)
    }

    public async getAllPageViewsSince(startDate: string): Promise<Page[]> {
        return await this.runReport(startDate)
    }
}