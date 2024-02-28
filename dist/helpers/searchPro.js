"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchPro = void 0;
const convertSub_1 = require("./convertSub");
const convertToSlug_1 = require("./convertToSlug");
function searchPro(listItem, unidecodeSlug, keyOne = "", keyTwo = "") {
    const convertArrr = listItem
        .flatMap((item) => item[keyOne].map((element, index) => {
        const unidecodeElement = (0, convertToSlug_1.convertToSlug)(element);
        if ((0, convertSub_1.slugCheckAB)(unidecodeSlug, unidecodeElement)) {
            return {
                listTagName: element,
                listTagSlug: item[keyTwo][index],
            };
        }
    }))
        .filter(Boolean);
    return convertArrr;
}
exports.searchPro = searchPro;
