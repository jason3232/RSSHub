const got = require('@/utils/got');
const cheerio = require('cheerio');
const { parseDate } = require('@/utils/parse-date');

module.exports = async (ctx) => {
    const { titlePinyin } = ctx.params;
 
    const baseUrl = 'https://manhua.dmzj.com';
    const link = `${baseUrl}/${titlePinyin}`;
    const html = await got(link);
    const $ = cheerio.load(html.body);

    const title = $('.anim_title_text a h1').text().trim();
    const description = $('.middleright_mr.margin_top_10px .line_height_content').text().trim();
    const author = $('.anim-main_list tr:nth-child(3) td a').text().trim();
    const pubDate = parseDate($('.update2').text().trim());

    const items = $('.cartoon_online_border a').map((_, item) => ({
        title: $(item).text(),
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