
// font collection example https://github.com/Tecate/bitmap-fonts/tree/master/bitmap

interface ILetterInfo {
    data: number[];
    width: number;
    widthExact: number;
    offsetX:number;
    offsetY:number;
}

export interface IBdfFont {
    fontHeight: number;
    chars: Record<string, ILetterInfo>;
}

export class BdfFontParser {

    private newLetterInfo() {
        return {data:[],width:0,widthExact:0,offsetX:0,offsetY:0} as ILetterInfo;
    }

    public parse(bdfFileSource: string) {
        const bdfFont= {fontHeight:8,chars:{}} as IBdfFont;
        const lines = bdfFileSource.split('\n');
        let currentLetterInfo = this.newLetterInfo();
        let bitMapStarted = false;
        let currentLetter: string = undefined!;
        for (const line of lines) {
            if (!line) continue;
            if (bitMapStarted && line!=='ENDCHAR') {
                currentLetterInfo.data.push(parseInt(line,16));
                continue;
            }
            const pair = line.split(' ')
            const [key, val] = [pair[0], pair.splice(1)];
            switch (key) {
                case 'ENCODING': {
                    currentLetter = String.fromCharCode(parseInt(val[0]));
                    break;
                }
                case 'BITMAP': {
                    bitMapStarted = true;
                    break;
                }
                case 'DWIDTH': {
                    currentLetterInfo.width = parseInt(val[0]);
                    currentLetterInfo.widthExact = currentLetterInfo.width;
                    break;
                }
                case 'SIZE': {
                    bdfFont.fontHeight = parseInt(val[0]);
                    break;
                }
                case 'BBX': {
                    currentLetterInfo.widthExact = parseInt(val[0]);
                    currentLetterInfo.offsetX = parseInt(val[2]);
                    currentLetterInfo.offsetY = parseInt(val[3]);
                    break;
                }
                case 'ENDCHAR': {
                    bitMapStarted = false;
                    if (currentLetter && currentLetterInfo.data.length && currentLetterInfo.width) {
                        bdfFont.chars[currentLetter] = currentLetterInfo;
                    }
                    currentLetterInfo = this.newLetterInfo();
                    break;
                }

            }
        }
        return bdfFont;
    }

}
