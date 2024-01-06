export function convertSub(subtitle: string) : string{
    const lines = subtitle.split('\n');
    let start: number = 2;
    const convertedSubtitle = lines.map((line, index) => {
        const timeRegex = /\d{2}:\d{2}:\d{2},\d{3} --> \d{2}:\d{2}:\d{2},\d{3}/;
        const match = line.match(timeRegex);

        if (match) {
            const startTime = match[0].split(' ')[0].split(",")[0];

            return `[${startTime.replace(/^00:/, '')}]${line.replace(timeRegex, '').trim()}`;
        } else {
            if (index === start) {
                start += 4;
                return line.trim();
            }
        }
        return "\n";
    });
    return convertedSubtitle.join("")
}
