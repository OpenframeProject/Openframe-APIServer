module.exports = function(Collection) {
    Collection.disableRemoteMethod('createChangeStream', true);
};
