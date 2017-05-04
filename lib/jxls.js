'use strict';

var _ = require('lodash');
var Promise = require('bluebird');
var java = require('java');

var converter = require('./converter');

module.exports = function (JxlsHelper) {
    var Context = java.import('org.jxls.common.Context');
    var JavaFile = java.import('java.io.File');
    var JavaFileInputStream = java.import('java.io.FileInputStream');
    var JavaFileOutputStream = java.import('java.io.FileOutputStream');

    return {
        transform: function transform(templatePath, targetPath, data) {
            if (!_.isObject(data)) {
                return Promise.reject(new Error('Template data should be an object'));
            }

            var context = new Context();
            return Promise.map(_.keys(data), function (key) {
                return converter.convert(data[key]).then(function (converted) {
                    return context.putVarPromise(key, converted);
                });
            }).then(function () {
                var template = new JavaFile(templatePath);
                var inputStream = new JavaFileInputStream(template);
                var outputStream = new JavaFileOutputStream(targetPath);

                return JxlsHelper.getInstancePromise().then(function (JxlsHelperInstance) {
                    return JxlsHelperInstance.processTemplatePromise(inputStream, outputStream, context);
                });
            });
        }
    };
};