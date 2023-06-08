const got = require('@/utils/got');
const cheerio = require('cheerio');
const { parseDate } = require('@/utils/parse-date');

module.exports = async (ctx) => {
    const { id } = ctx.params;
 
    const baseUrl = 'https://yawaspi.com';
    const link = `${baseUrl}/${id}`;
    const html = await got(link);
    const $ = cheerio.load(html.body);

    const title = $('.page__header h2').text().trim();
    const description = $('.page__message__inner p').text().trim();
    const author = $('.page__header p strong').text().trim();
    const pubDate = parseDate($('.inner__content a[href*="/comic"]').eq(0).find('dt').text().trim());

    const items = $('.page__read li a[href*="/comic"]').toArray().map(item => ({
        title: $(item).find('dt').text().trim(),
        link: `${baseUrl}${$(item).attr('href')}`,
        author
    }));

    ctx.state.data = {
        title,
        link,
        description,
        pubDate,
        author,
        item: items,
    };
};