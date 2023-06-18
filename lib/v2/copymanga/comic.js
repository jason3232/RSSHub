const cheerio = require('cheerio');
const got = require('@/utils/got');
const CryptoJS = require('crypto-js');
const { parseDate } = require('@/utils/parse-date');

const host = 'copymanga.site';
const baseUrl = `https://${host}`;

// 直接调用拷贝漫画的接口
module.exports = async (ctx) => {
    const { id } = ctx.params;

    const link = `${baseUrl}/comic/${id}`;
    const html = await got(link);
    const $ = cheerio.load(html.body);

    const title = $('.comicParticulars-title h6').text().trim();
    const description = $('p.intro').text().trim();
    const author = $('a[href*="/author"]').toArray().map((a) => $(a).text()).join(', ');
    const pubDate = parseDate($('.comicParticulars-sigezi ~ .comicParticulars-right-txt').text().trim());

    const response = await got(`${baseUrl}/comic/${id}/chapters`);
    const iv = response.data.results.substring(0, 16),
          cipher = response.data.results.substring(16),
          result = JSON.parse(CryptoJS.AES.decrypt(
            CryptoJS.enc.Base64.stringify(
                CryptoJS.enc.Hex.parse(cipher)
            ),
            CryptoJS.enc.Utf8.parse('xxxmanga.woo.key'),
            {
                'iv': CryptoJS.enc.Utf8.parse(iv),
                'mode': CryptoJS.mode.CBC,
                'padding': CryptoJS.pad.Pkcs7
            }
        ).toString(CryptoJS.enc.Utf8));

    const item = result.groups.default.chapters.map((chapter) => ({
        title: chapter.name,
        link: `${baseUrl}/comic/${id}/chapters/${chapter.id}`,
        author
    }));

    ctx.state.data = {
        title,
        link,
        author,
        description,
        pubDate,
        item
    };
};
