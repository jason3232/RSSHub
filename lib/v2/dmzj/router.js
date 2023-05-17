module.exports = (router) => {
    router.get('/news/:category?', require('./news'));
    router.get('/manhua/:titlePinyin', require('./manhua'));
};
