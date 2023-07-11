const got = require('@/utils/got');
const cheerio = require('cheerio');
const { parseDate } = require('@/utils/parse-date');

module.exports = async (ctx) => {
    const { titlePinyin } = ctx.params;
 
    const baseUrl = 'https://m.idmzj.com';
    const link = `${baseUrl}/info/${titlePinyin}.html`;
    const html = await got(link);
    const $ = cheerio.load(html.body);

    const title = $('#comicName').text().trim();
    const description = $('p.txtDesc').text().trim();
    const author = $('a.pd.introName').text().trim();
    const pubDate = parseDate($('.txtItme span.date').text().trim());

    const items = $('ul.Drama a').map((_, item) => ({
        title: `${title} - $(item).text()`,
        link: `${baseUrl}${$(item).attr('href')}`,
        author,
    })).get().reverse();

    ctx.state.data = {
        title,
        link,
        description,
        pubDate,
        author,
        item: items,
    };
};