
exports.forLib = function (LIB) {

    var exports = {};

    exports.main = function (config) {

        return LIB.Promise.try(function () {

            if (config.jobs) {

                const JOB = require(LIB.path.join(process.env.Z0_ROOT, "proto/job.js"));

                return LIB.Promise.mapSeries(Object.keys(config.jobs), function (job) {

                    if (LIB.VERBOSE) console.log("Running test job '" + job + "' ...");

                    return JOB.boot(job).then(function () {

                        if (LIB.VERBOSE) console.log("Done: Running test job '" + job + "'!");

                        return null;
                    }).catch(function (err) {
                        // We fail fast.
                        console.error("Error running job:", err.stack);
                        process.exit(1);
                    });
                });
            }

            var job = require(config.modulePath);

            if (typeof job.forLib !== "function") {
                throw new Error("Job implementation at '" + config.modulePath + "' does not export 'forLib()'!");
            }

            job = job.forLib(LIB);

            if (typeof job.forContext !== "function") {
                throw new Error("Job implementation at '" + config.modulePath + "' does not export 'forContext()' after calling 'forLib()'!");
            }

            job = job.forContext(config.context());

            if (typeof job.main !== "function") {
                throw new Error("Job implementation at '" + config.modulePath + "' does not export 'main()' after calling 'forContext()'!");
            }

            return job.main(config.config || {});
        }).then(function () {

            // We exit the process once the script is done.
            process.exit(0);
        }).catch(function (err) {

            console.error("Error running job:", err.stack);
            process.exit(1);
        });
    }

    return exports;
}
