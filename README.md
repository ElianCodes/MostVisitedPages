# MostVisitedPages

Package created to fetch your x most frequent visited pages from Google Analytics and the Google Analytics Data API

## Installation

```bash
npm i @elianvancutsem/mostvisitedpages
```

## Example

```js
import { MostVisitedPages } from "@elianvancutsem/mostvisitedpages";

const testEmail = "xxx"
const testKey = "xxx"

const mostVisitedPages = new MostVisitedPages({client_email: testEmail, private_key: testKey}, 'xxxxxxxx')

const testFunc = async () => {
    console.log(await mostVisitedPages.fetch(4));
}

testFunc();
```
