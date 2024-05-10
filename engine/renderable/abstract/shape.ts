import {RenderableModel} from "./renderableModel";
import {Color} from "@engine/renderer/common/color";
import {Game} from "@engine/core/game";
import {IRealNode} from "@engine/renderable/tsx/_genetic/realNode";

export abstract class Shape extends RenderableModel implements IShapeProps{

    get lineWidth(): number {
        return this._lineWidth;
    }

    set lineWidth(value: number) {
        this._lineWidth = value;
    }

    public color:Color = Color.BLACK.clone();
    protected _lineWidth:number = 0;
    public fillColor:Color = Color.GREY.clone();

    protected constructor(game:Game){
        super(game);
    }

    public override setProps(props:IShapeProps,parent:IRealNode):void{
        super.setProps(props,parent);
        if (props.color!==undefined) {
            this.color.setRGBA(props.color.r,props.color.g,props.color.b,props.color.a);
        }
        if (props.fillColor!==undefined) {
            this.fillColor.setRGBA(props.fillColor.r,props.fillColor.g,props.fillColor.b,props.fillColor.a);
        }
        if (props.lineWidth!==undefined) this._lineWidth = props.lineWidth;
    }

    protected override setClonedProperties(cloned:Shape):void{
        cloned.color.setFrom(this.color);
        cloned._lineWidth = this._lineWidth;
        cloned.fillColor = this.fillColor.clone();
        cloned.filters = [...this.filters];
        super.setClonedProperties(cloned);
    }

}
