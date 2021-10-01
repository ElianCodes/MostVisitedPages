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

    async getPages(limit?: number): Promise<Page[]> {
        const response: Page[] = [];
        const [report] = await this.analytics.runReport({
            property: `properties/${this.propertyId}`,
            dateRanges: [{ startDate: '90daysAgo', endDate: 'today' }],
            dimensions: [{ name: 'fullPageUrl' }, { name: 'pageTitle' }],
            metrics: [{ name: 'engagedSessions' }],
            limit: limit ?? 10
        });
        report.rows?.forEach((row: any) => {
            const record: Page = {
                name: row.dimensionValues[1].value,
                link: row.dimensionValues[0].value,
                views: Number.parseInt(row.metricValues[0].value)
            }
            response.push(record)
        });
        return response
    }
}