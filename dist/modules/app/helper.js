"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTodayFromDateTime = exports.convertArrayParametersToObject = exports.convertObjectToParameters = void 0;
const convertObjectToParameters = (obj) => {
    const keys = Object.keys(obj);
    const parameters = [];
    for (let key of keys) {
        parameters.push(key);
        parameters.push(obj[key]);
    }
    return parameters;
};
exports.convertObjectToParameters = convertObjectToParameters;
const convertArrayParametersToObject = (arr) => {
    let obj = {};
    for (let index = 0; index < arr.length;) {
        obj[arr[index]] = arr[index + 1];
        index += 2;
    }
    return obj;
};
exports.convertArrayParametersToObject = convertArrayParametersToObject;
const getTodayFromDateTime = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const today = `${year}-${month}-${day}`;
    return today;
};
exports.getTodayFromDateTime = getTodayFromDateTime;
