const _ = require('lodash');
const java = require('java');
const Promise = require('bluebird');

const JavaMap = java.import('java.util.HashMap');
const JavaDate = java.import('java.util.Date');
const Long = java.import('java.lang.Long');
const Double = java.import('java.lang.Double');
const JavaList = java.import('java.util.ArrayList');

function convert(obj) {
    if (_.isArray(obj)) {
        return convertCollection(obj);
    };

    if (!_.isObject(obj) || _.isDate(obj)) {
        return convertPrimitive(obj);
    }

    var objValues = new JavaMap();
    var objKeys = _.keys(obj);

    return Promise
        .each(objKeys, function (key) {
            return convert(obj[key])
                .then(function (bean) {
                    return objValues.putPromise(key, bean);
                });
        })
        .then(function () {
            return objValues;
        });
}

function convertCollection(collection) {
    const list = new JavaList();

    return Promise
        .each(collection, function (item) {
            return convert(item)
                .then(function (bean) {
                    return list.addPromise(bean)
                });
        })
        .then(function () {
            return list;
        });
}

function convertPrimitive(value) {
    return new Promise(function (resolve) {
        if (_.isDate(value)) {
            return resolve(new JavaDate(new Long(String(value.getTime()))));
        }

        if (_.isNumber(value)) {
            if (_.isInteger(value)) {
                return resolve(new Long(String(value)));
            }
            return resolve(new Double(String(value)));
        }

        return resolve(value);
    });
}

module.exports = {
    convert: convert
};