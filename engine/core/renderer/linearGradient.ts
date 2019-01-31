
import {Color, ColorJSON} from "./color";
import {DebugError} from "../../debugError";


export class LinearGradient {

    type:string = 'LinearGradient';

    colorFrom:Color = new Color(0,0,0);
    colorTo:Color = new Color(200,200,200);
    angle:number = 0.1;

    private _arr:number[] = new Array(12);

    fromJSON(json:{colorFrom:ColorJSON,colorTo:ColorJSON}){
        if (DEBUG) {
            if (!json.colorFrom)
                throw new DebugError(`can not parse LinearGradient from JSON: colorFrom not defined`);
            if (!json.colorTo)
                throw new DebugError(`can not parse LinearGradient from JSON: colorTo not defined`);
        }
        this.colorFrom.fromJSON(json.colorFrom);
        this.colorTo.fromJSON(json.colorTo);
    }

    asGL():number[]{
        let cFrom:number[] = this.colorFrom.asGL();
        let cTo:number[] = this.colorTo.asGL();
        this._arr[0] = cFrom[0];
        this._arr[1] = cFrom[1];
        this._arr[2] = cFrom[2];
        this._arr[3] = cFrom[3];

        this._arr[4] = cTo[0];
        this._arr[5] = cTo[1];
        this._arr[6] = cTo[2];
        this._arr[7] = cTo[3];

        this._arr[8] =  this.angle;
        this._arr[9] =  0;  // unused
        this._arr[10] = 0;  // unused
        this._arr[11] = 0;  // unused

        return this._arr;
    }


}