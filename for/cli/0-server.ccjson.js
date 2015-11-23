
exports.forLib = function (LIB) {
    var ccjson = this;

    return LIB.Promise.resolve({
        forConfig: function (defaultConfig) {

            const SERVER = require("./0-server.api").forLib(LIB);

            var Entity = function (instanceConfig) {
                var self = this;

                var config = {};
                LIB._.merge(config, defaultConfig);
                LIB._.merge(config, instanceConfig);
                config = ccjson.attachDetachedFunctions(config);

                self.spin = function () {
                    // This is called when the job is run manually or if
                    // 'config.runOnStartup === true'
                    return LIB.Promise.try(function () {
                        return SERVER.main(config);
                    });
                }

                if (config.runOnStartup) {
                    // We wait until the system has booted and then start the job.
                    ccjson.once("booted", function () {
                        if (LIB.VERBOSE) console.log("Running job:", config.$alias);
                        self.spin().then(function () {
                            if (LIB.VERBOSE) console.log("Finished running job:", config.$alias);
                            return null;
                        }).catch(function (err) {
                            console.log("Error while running job '" + config.$alias + "':", err.stack);
                        });
                    });
                }
            }
            Entity.prototype.config = defaultConfig;

            return Entity;
        }
    });
}
