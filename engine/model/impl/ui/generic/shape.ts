import {RenderableModel} from "../../../renderableModel";
import {Color} from "@engine/renderer/color";
import {Game} from "@engine/game";
import {LinearGradient} from "@engine/renderer/linearGradient";
import {IFilterable} from "@engine/declarations";
import {AbstractFilter} from "@engine/renderer/webGl/filters/abstract/abstractFilter";

export abstract class Shape extends RenderableModel implements IFilterable{

    color:Color = Color.BLACK.clone();
    lineWidth:number = 0;
    fillColor:Color|LinearGradient = Color.RGB(100,100,100);
    filters: AbstractFilter[] = [];

    setWH(w:number,h:number = w):void{
        this.setXYWH(this.pos.x,this.pos.y,w,h);
    }

    setXYWH(x:number,y:number,w:number,h:number):void{
        this.pos.setXY(x,y);
        this.size.setWH(w,h);
        this.getSrcRect().setXYWH(x,y,w,h);
    }

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