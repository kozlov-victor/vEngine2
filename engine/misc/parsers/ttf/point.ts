
export class Point {

    public touched = false;

    constructor(public x: number, public y: number, public onCurve: boolean, public endOfContour: boolean) {

    }
}
