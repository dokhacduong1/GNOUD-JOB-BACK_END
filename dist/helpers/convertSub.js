"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.slugCheckAB = exports.convertSub = void 0;
function convertSub(subtitle) {
    const lines = subtitle.split('\n');
    let start = 2;
    const convertedSubtitle = lines.map((line, index) => {
        const timeRegex = /\d{2}:\d{2}:\d{2},\d{3} --> \d{2}:\d{2}:\d{2},\d{3}/;
        const match = line.match(timeRegex);
        if (match) {
            const startTime = match[0].split(' ')[0].split(",")[0];
            return `[${startTime.replace(/^00:/, '')}]${line.replace(timeRegex, '').trim()}`;
        }
        else {
            if (index === start) {
                start += 4;
                return line.trim();
            }
        }
        return "\n";
    });
    return convertedSubtitle.join("");
}
exports.convertSub = convertSub;
function slugCheckAB(unidecodeSlug, unidecodeElement) {
    const regex = new RegExp(unidecodeSlug);
    const regexCheck = regex.test(unidecodeElement);
    return regexCheck;
}
exports.slugCheckAB = slugCheckAB;
