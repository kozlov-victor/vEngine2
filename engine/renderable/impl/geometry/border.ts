import {Rectangle} from "./rectangle";
import {Color} from "@engine/renderer/color";
import {Game} from "@engine/core/game";
import {ICloneable} from "@engine/core/declarations";

export class Border extends Rectangle implements ICloneable<Border>{

    public readonly type:string = 'Border';

    constructor(game:Game){
        super(game);
        this.fillColor = Color.NONE;
    }

    public clone():Border{
        const cloned:Border = new Border(this.game);
        this.setClonedProperties(cloned);
        return cloned;
    }

    protected setClonedProperties(cloned:Border):void{
        cloned.fillColor = this.fillColor.clone();
        super.setClonedProperties(cloned);
    }

}