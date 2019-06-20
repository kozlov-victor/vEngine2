import {Rectangle} from "./rectangle";
import {Color} from "@engine/renderer/color";
import {Game} from "@engine/game";
import {ICloneable} from "@engine/declarations";

export class Border extends Rectangle implements ICloneable<Border>{

    readonly type:string = 'Border';

    constructor(game:Game){
        super(game);
        this.fillColor = Color.NONE;
    }

    protected setClonedProperties(cloned:Border):void{
        cloned.fillColor = this.fillColor.clone();
        super.setClonedProperties(cloned);
    }

    clone():Border{
        const cloned:Border = new Border(this.game);
        this.setClonedProperties(cloned);
        return cloned;
    }

}