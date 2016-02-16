module.exports = function(Channel) {
    Channel.disableRemoteMethod('createChangeStream', true);
};
