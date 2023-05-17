const got = require('@/utils/got');
const cheerio = require('cheerio');
const { parseDate } = require('@/utils/parse-date');

module.exports = async (ctx) => {
    const { id } = ctx.params;
 
    const baseUrl = 'https://comic-walker.com';
    const link = `${baseUrl}/contents/detail/${id}`;
    const html = await got(link);
    const $ = cheerio.load(html.body);

    const title = $('#detailIndex .comicIndex-box > h1:first-child').text().trim();
    const description = $('.acItem-summary').text().trim();
    const author = $('.acItem-copy a').toArray().map(a => $(a).text()); 
    const pubDate = parseDate($('#detailIndex .comicIndex-date').text().replace('更新', '').trim());

    const items = $('#backnumberComics li a').toArray().map(item => ({
        title: $(item).attr('title').replace(title, '').trim(),
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