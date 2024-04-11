"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectFields = void 0;
function selectFields(data, fields) {
    if (!data || !fields)
        return [];
    return data.map(item => fields.reduce((acc, field) => {
        if (item.hasOwnProperty(field)) {
            acc[field] = item[field];
        }
        return acc;
    }, {}));
}
exports.selectFields = selectFields;
