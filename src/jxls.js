const _ = require('lodash');
const Promise = require('bluebird');
const java = require('java');

const converter = require('./converter');

module.exports = function (JxlsHelper) {
    const Context = java.import('org.jxls.common.Context');
    const JavaFile = java.import('java.io.File');
    const JavaFileInputStream = java.import('java.io.FileInputStream');
    const JavaFileOutputStream = java.import('java.io.FileOutputStream');

    return {
        transform: function (templatePath, targetPath, data) {
            if (!_.isObject(data)) {
                return Promise.reject(new Error('Template data should be an object'));
            }

            var context = new Context();
            return Promise
                .map(_.keys(data), function (key) {
                    return converter.convert(data[key])
                        .then(function (converted) {
                            return context.putVarPromise(key, converted);
                        });
                })
                .then(function () {
                    const template = new JavaFile(templatePath);
                    const inputStream = new JavaFileInputStream(template);
                    const outputStream = new JavaFileOutputStream(targetPath);

                    return JxlsHelper.getInstancePromise()
                        .then(function (JxlsHelperInstance) {
                            return JxlsHelperInstance.processTemplatePromise(inputStream, outputStream, context);
                        });
                });
        }
    };
};