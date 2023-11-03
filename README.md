# The Onion Bot
A cool wasteof.money bot built with Node.js that posts articles from The Onion (a well-regarded, world-renowned reputable news site) on wasteof every day.

## How it works
Basically, once per day, the bot visits The Onion's website (https://theonion.com/latest) and scrapes details about the most recent article (the headline, preview, article link, and post date), creates a nice-looking, well-formatted image (similar to the example below), and posts it to wasteof.money along with the link to the article.![1699026615394](https://github.com/imadeanaccount1/onionbot/assets/138229538/f5c7e54a-230c-47ed-8d14-ae80f1d94992)
![1699026615394](https://github.com/imadeanaccount1/onionbot/assets/138229538/32d628c0-9aeb-4ecc-a50f-40e175d75f9b)

Each day's image is also committed to this repository under the [`images`](/images) folder.

## What does it use
The bot uses Puppeteer, a Chromium-based Node.js library popular for web scraping, to scrape data about The Oniona articles, filters out articles containing profanity using the `bad-words` module, and generates an image using the Puppeteer-based module, `node-html-to-image`.


