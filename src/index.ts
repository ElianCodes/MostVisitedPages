import { BetaAnalyticsDataClient } from '@google-analytics/data';
import { Page } from './interfaces/Page'
import { Credentials } from './interfaces/Credentials'

export { Page, Credentials }

interface Metric {
    name: string
}

export class MostVisitedPages {
    analytics: BetaAnalyticsDataClient;
    propertyId: string;

    constructor(credentials: Credentials, propertyId: string) {
        this.analytics = new BetaAnalyticsDataClient({credentials: credentials});
        this.propertyId = propertyId;
    }

    private async runReport(metrics: Metric[], startDate: string, limit?: number): Promise<Page[]> {
        const response: Page[] = [];
        const [report] = await this.analytics.runReport({
            property: `properties/${this.propertyId}`,
            dateRanges: [{ startDate: startDate, endDate: 'today' }],
            dimensions: [{ name: 'fullPageUrl' }, { name: 'pageTitle' }],
            metrics: metrics,
            limit: limit ?? null
        });
        report.rows?.forEach((row: any) => {
            const record: Page = this.determinePageResult(metrics, row);
            response.push(record)
        });
        return response
    }

    private determinePageResult(metrics: Metric[], row: any): Page {
        const page: Page = {
            title: row.dimensionValues[1].value,
            url: row.dimensionValues[0].value,
        }
        if (metrics.filter((metric: Metric) => metric.name == 'engagedSessions').length > 0) {
            page.views = Number.parseInt(row.metricValues[0].value)
        } else if (metrics.filter((metric: Metric) => metric.name == 'activeUsers').length > 0) {
            page.users = Number.parseInt(row.metricValues[0].value)
        }
        return page
    }

    public async getPageViews(limit?: number): Promise<Page[]>{
        return await this.runReport([{ name: 'engagedSessions' }], '90daysAgo', limit ?? 10)
    }

    public async getPageViewsSince(startDate: string, limit?: number): Promise<Page[]>{
        return await this.runReport([{ name: 'engagedSessions' }], startDate, limit ?? 10)
    }

    public async getAllPageViewsSince(startDate: string): Promise<Page[]> {
        return await this.runReport([{ name: 'engagedSessions' }], startDate)
    }

    public async getActiveUsers(limit?: number): Promise<Page[]>{
        return await this.runReport([{ name: 'activeUsers' }], '90daysAgo', limit ?? 10)
    }

    public async getActiveUsersSince(startDate: string, limit?: number): Promise<Page[]>{
        return await this.runReport([{ name: 'activeUsers' }], startDate, limit ?? 10)
    }
}