
import {RenderableModel} from "../../../renderableModel";
import {Color} from "../../../../core/renderer/color";
import {Game} from "../../../../core/game";
import {DrawableInfo} from "../../../../core/renderer/webGl/renderPrograms/interface/drawableInfo";
import {LinearGradient} from "../../../../core/renderer/linearGradient";

export abstract class Shape extends RenderableModel {

    color:Color = Color.BLACK.clone();
    lineWidth:number = 0;
    fillColor:Color|LinearGradient = Color.RGB(100,100,100);

    setWH(w:number,h:number){
        this.setXYWH(this.pos.x,this.pos.y,w,h);
    }

    setXYWH(x:number,y:number,w:number,h:number){
        this.pos.x = x;
        this.pos.y = y;
        this.width = w;
        this.height = h;
        this.getRect().setXYWH(x,y,w,h);
    }

    getDrawableInfo():DrawableInfo { // todo remove this method
        return {blendMode:this.blendMode,acceptLight:false,alpha:this.alpha};
    }

    protected constructor(game:Game){
        super(game);
    }

    protected setClonedProperties(cloned:Shape){
        cloned.color = this.color.clone();
        cloned.lineWidth = this.lineWidth;
        cloned.fillColor = this.fillColor.clone();
        super.setClonedProperties(cloned);
    }

}