
exports.forLib = function (LIB) {
    
    var exports = {};
    
    // TODO: Load adapters as needed on demand
    
    exports.adapters = {
        cli: require("./for/cli/0-server.api").forLib(LIB)
    };

    return exports;
}
