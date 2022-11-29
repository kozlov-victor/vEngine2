
export class CalcUtils {

    private static noteString = [
        {name: "C", sharp: false},
        {name: "C", sharp: true},
        {name: "D", sharp: false},
        {name: "D", sharp: true},
        {name: "E", sharp: false},
        {name: "F", sharp: false},
        {name: "F", sharp: true},
        {name: "G", sharp: false},
        {name: "G", sharp: true},
        {name: "A", sharp: false},
        {name: "A", sharp: true},
        {name: "B", sharp: false}
    ];

    public static midiNumberToFr(x: number): number {
        return (440 / 32) * Math.pow(2, ((x - 9) / 12)); //  let a = 440; // a is 440 hz...
    }

    public static letterToNoteNum(str: string): number {
        const letter = str[0].toUpperCase();
        let sharp = false;
        let number: number;
        if (str.indexOf('#') > -1) {
            sharp = true;
            number = parseInt(str.substr(2));
        } else {
            sharp = false;
            number = parseInt(str.substr(1));
        }
        const baseNumber = CalcUtils.noteString.findIndex(it => {
            return it.name == letter && it.sharp == sharp;
        });
        return baseNumber + number * 24;
    }

    public static noteNumToLetter(noteNum: number) {
        const octave = ~~((noteNum / 12) - 1);
        const noteIndex = (noteNum % 12);
        const note = CalcUtils.noteString[noteIndex];
        return `${note.name}${note.sharp ? '#' : ''}${octave}`;
    }

}
