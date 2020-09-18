import {Color, IColorJSON} from "./color";
import {DebugError} from "../../debug/debugError";
import {ICloneable} from "../../core/declarations";
import {MathEx} from "@engine/misc/mathEx";

interface IJSON {
    colorFrom:IColorJSON;
    colorTo:IColorJSON;
}

export class LinearGradient implements ICloneable<LinearGradient>{

    public type:string = 'LinearGradient';

    public colorFrom:Color = new Color(0,0,0);
    public colorTo:Color = new Color(200,200,200);
    public angle:number = 0.1;

    private _arr:number[] = new Array(12);

    public fromJSON(json:IJSON):void{
        if (DEBUG) {
            if (!json.colorFrom)
                throw new DebugError(`can not parse LinearGradient from JSON: colorFrom not defined`);
            if (!json.colorTo)
                throw new DebugError(`can not parse LinearGradient from JSON: colorTo not defined`);
        }
        this.colorFrom.fromJSON(json.colorFrom);
        this.colorTo.fromJSON(json.colorTo);
    }

    public set(g:LinearGradient):void{
        this.colorFrom.set(g.colorFrom);
        this.colorTo.set(g.colorTo);
        this.angle = g.angle;
    }

    public toJSON():IJSON{
        return {
            colorFrom: this.colorFrom.toJSON(),
            colorTo: this.colorTo.toJSON()
        };
    }

    public asGL():number[]{
        const cFrom:number[] = this.colorFrom.asGL();
        const cTo:number[] = this.colorTo.asGL();
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

    public asCSS():string{
        return `linear-gradient(${-MathEx.radToDeg(this.angle)}deg, ${this.colorFrom.asCSS()} 0%, ${this.colorTo.asCSS()} 100%)`;
    }

    public clone():LinearGradient {
        const cloned:LinearGradient = new LinearGradient();
        cloned.fromJSON(this.toJSON());
        return cloned;
    }


}
