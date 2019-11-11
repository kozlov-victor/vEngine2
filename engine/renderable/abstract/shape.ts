import {RenderableModel} from "./renderableModel";
import {Color} from "@engine/renderer/common/color";
import {Game} from "@engine/core/game";
import {LinearGradient} from "@engine/renderer/common/linearGradient";
import {IFilterable} from "@engine/core/declarations";
import {IFilter} from "@engine/renderer/common/ifilter";

export abstract class Shape extends RenderableModel implements IFilterable{

    public color:Color = Color.BLACK.clone();
    public lineWidth:number = 0;
    public fillColor:Color|LinearGradient = Color.RGB(100,100,100);
    public filters: IFilter[] = [];

    protected constructor(game:Game){
        super(game);
    }

    protected setClonedProperties(cloned:Shape):void{
        cloned.color.set(this.color);
        cloned.lineWidth = this.lineWidth;
        if (!cloned.fillColor)cloned.fillColor = this.fillColor.clone();
        else (cloned.fillColor as Color).set(this.fillColor as Color); //todo not very nice
        cloned.filters = [...this.filters];
        super.setClonedProperties(cloned);
    }

}