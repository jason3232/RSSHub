const tongli = {
    _name: '拷贝漫画',
    'ebook': [
        {
            title: '漫画更新',
            docs: 'https://docs.rsshub.app/anime.html#tong-li',
            source: ['/book/:id'],
            target: '/tongli/book/:id',
        },
    ],
};

module.exports = {
    'tongli.com.tw': tongli,
};
