const logger = require('@/utils/logger');
const cheerio = require('cheerio');
const { parseDate } = require('@/utils/parse-date');

module.exports = async (ctx) => {
    const { titlePinyin } = ctx.params;
    const baseUrl = 'https://m.idmzj.com';
    const link = `${baseUrl}/info/${titlePinyin}.html`;

    const browser = await require('@/utils/puppeteer')();
    const page = await browser.newPage();
    await page.setRequestInterception(true);
    page.on('request', (request) => {
        request.resourceType() === 'document' ? request.continue() : request.abort();
    });

    logger.debug(`Requesting ${link}`);
    await page.goto(link, {
        waitUntil: 'domcontentloaded',
    });
    const response = await page.content();
    page.close();
    const $ = cheerio.load(response);

    const title = $('#comicName').text().trim();
    const description = $('p.txtDesc').text().trim();
    const author = $('a.pd.introName').text().trim();
    const pubDate = parseDate($('.txtItme span.date').text().trim());

    const items = $('ul.Drama a')
        .map((_, item) => ({
            title: `${title} - $(item).text()`,
            link: `${baseUrl}${$(item).attr('href')}`,
            author,
        }))
        .get()
        .reverse();

    browser.close();

    ctx.state.data = {
        title,
        link,
        description,
        pubDate,
        author,
        item: items,
    };
};
