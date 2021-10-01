# MostVisitedPages

Package created to fetch your x most frequent visited pages from Google Analytics and the Google Analytics Data API.

Both TypeScript and ESModules are supported

## Installation

```bash
npm i @elianvancutsem/mostvisitedpages
```

## Using `@elianvancutsem/mostvisitedpages`

The MostVisitedPages constructor takes in two parameters: `credentials` and `propertyId`.

### `credentials`

Credentials has two variables; `client_email` and `private_key`. Both of these can be created by creating a JSON Service Account.

Follow [the Official Google Analytics Data API documentation](<https://developers.google.com/analytics/devguides/reporting/data/v1/quickstart-client-libraries>) for more information about this.

### `propertyId`

The PropertyId is the PropertyID of the Google analytics property.

NOTE: the Service account should be added with `read & analyze` access to the property.

### Example

```js
import { MostVisitedPages } from "@elianvancutsem/mostvisitedpages";

const testEmail = "xxx"
const testKey = "xxx"

const mostVisitedPages = new MostVisitedPages({client_email: testEmail, private_key: testKey}, 'xxxxxxxx')
```

## Functions

### `getPages(limit: string): Promise<Page[]>`

This function returns an array of the `Page` type (which can be imported from `@elianvancutsem/mostvisitedpages`)

The `limit` parameter provides a limit to the number of pages returned, will default to 10 if none is set.

## Full Example

```js
import { MostVisitedPages } from "@elianvancutsem/mostvisitedpages";

const testEmail = "xxx"
const testKey = "xxx"

const mostVisitedPages = new MostVisitedPages({client_email: testEmail, private_key: testKey}, 'xxxxxxxx')

const getReport = async () => {
    console.log(await mostVisitedPages.getPages(4));
}

getReport();
```
