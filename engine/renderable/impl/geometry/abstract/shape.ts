import {RenderableModel} from "../../../abstract/renderableModel";
import {Color} from "@engine/renderer/color";
import {Game} from "@engine/core/game";
import {LinearGradient} from "@engine/renderer/linearGradient";
import {IFilterable} from "@engine/core/declarations";
import {IFilter} from "@engine/renderer/ifilter";

export abstract class Shape extends RenderableModel implements IFilterable{

    public color:Color = Color.BLACK.clone();
    public lineWidth:number = 0;
    public fillColor:Color|LinearGradient = Color.RGB(100,100,100);
    public filters: IFilter[] = [];

    protected constructor(game:Game){
        super(game);
    }

    public setWH(w:number,h:number = w):void{
        this.setXYWH(this.pos.x,this.pos.y,w,h);
    }

    public setXYWH(x:number,y:number,w:number,h:number):void{
        this.pos.setXY(x,y);
        this.size.setWH(w,h);
        this.getSrcRect().setXYWH(x,y,w,h);
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