module.exports = (router) => {
    router.get('/book/:id', require('./book'));
};
