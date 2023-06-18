const got = require('@/utils/got');

const host = 'https://ebook.tongli.com.tw';
const api = `https://api.tongli.tw`;

module.exports = async (ctx) => {
    const { id } = ctx.params;

    const infoApi = `${api}/Book?bookGroupId=${id}&isSerial=true`;
    const { data: info } = await got(infoApi);
    const author = info.Authors.map((author) => author.Name).join(', ');

    const chaptersApi = `${api}/Book/BookVol/${id}?bookID=null&isSerial=true`;
    const { data: chapters } = await got(chaptersApi);

    ctx.state.data = {
        title: info.Title,
        link: `${host}/book?id=${id}}&isGroup=true&isSerials=true`,
        author,
        description: info.Introduction,
        item: chapters.map((chapter) => ({
            title: chapter.Vol,
            link: `${host}/reader/FireBase3.html?bookID=${chapter.BookID}&isSerial=true`,
            author
        }))
    };
};
