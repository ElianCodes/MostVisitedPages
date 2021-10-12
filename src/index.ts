import { BetaAnalyticsDataClient } from '@google-analytics/data';
import { Page } from './interfaces/Page'
import { Credentials } from './interfaces/Credentials'
import { Options } from './interfaces/Options';

export { Page, Credentials, Options }

interface Metric {
    name: string
}

export class MostVisitedPages {
    analytics: BetaAnalyticsDataClient;
    propertyId: string;
    options?: Options;

    constructor(credentials: Credentials, propertyId: string, options?: Options) {
        this.analytics = new BetaAnalyticsDataClient({credentials: credentials});
        this.propertyId = propertyId;
        this.options = options;
    }

    private async runReport(metrics: Metric[], startDate: string, limit?: number): Promise<Page[]> {
        let response: Page[] = []
        const calculatedLimit = (this.options?.excludeUrls?.length ?? 0) + (limit ?? 10)
        const [report] = await this.analytics.runReport({
            property: `properties/${this.propertyId}`,
            dateRanges: [{ startDate: startDate, endDate: 'today' }],
            dimensions: [{ name: 'fullPageUrl' }, { name: 'pageTitle' }],
            metrics: metrics,
            limit: calculatedLimit
        });
        report.rows?.forEach((row: any) => {
            const record: Page = this.determinePageResult(metrics, row);
            response.push(record)
        });
        if (this.options?.excludeUrls != null) {
            response = response.filter((page: Page) => !this.options?.excludeUrls?.includes(page.url))
            response = response.slice(0, limit ?? 10)
        }
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