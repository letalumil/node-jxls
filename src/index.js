const _ = require('lodash');
const Promise = require('bluebird');
const mvn = Promise.promisify(require('node-java-maven'));

const java = require('java');
java.asyncOptions = {
    syncSuffix: 'Sync',
    asyncSuffix: 'Async',
    promiseSuffix: 'Promise',
    promisify: Promise.promisify
};

(function (exports) {
    exports.init = function () {
        return mvn({ packageJsonPath: '../package.json' })
            .then(function (mvnResults) {
                mvnResults.classpath.forEach(function (c) {
                    java.classpath.push(c);
                });

                return require('./jxls')(java.import('org.jxls.util.JxlsHelper'))
            });
    };
})(module.exports);