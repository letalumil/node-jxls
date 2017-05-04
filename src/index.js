const _ = require('lodash');
const Promise = require('bluebird');
const mvn = Promise.promisify(require('node-java-maven'));
const path = require('path');

const java = require('java');
java.asyncOptions = {
    syncSuffix: 'Sync',
    asyncSuffix: 'Async',
    promiseSuffix: 'Promise',
    promisify: Promise.promisify
};

(function (exports) {
    exports.init = function () {
        console.log(__dirname);
        return mvn({ packageJsonPath: path.resolve(__dirname, '../package.json') })
            .then(function (mvnResults) {
                mvnResults.classpath.forEach(function (c) {
                    java.classpath.push(c);
                });

                return require('./jxls')(java.import('org.jxls.util.JxlsHelper'))
            });
    };
})(module.exports);