'use strict';

module.exports = function() {
    //4XX - URLs not found
    return function customRaiseUrlNotFoundError(req, res, next) {
        // res.redirect('http://openframe.io');
        res.render('404');
    };
};
