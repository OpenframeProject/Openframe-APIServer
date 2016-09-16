var blacklist = require('the-big-username-blacklist');

module.exports = {
    blacklist: [
        'create-account',
        'login-success',
        'test',
        'verified'
    ].concat(blacklist.list)
};
