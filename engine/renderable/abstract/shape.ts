import {RenderableModel} from "./renderableModel";
import {Color} from "@engine/renderer/common/color";
import {Game} from "@engine/core/game";
import {Image} from "@engine/renderable/impl/general/image";
import {IRenderTarget} from "@engine/renderer/abstract/abstractRenderer";
import {Size} from "@engine/geometry/size";
import {Optional} from "@engine/core/declarations";
import {AbstractGradient} from "@engine/renderable/impl/fill/abstract/abstractGradient";

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
    public fillGradient:Optional<AbstractGradient>;

    protected constructor(game:Game){
        super(game);
    }

    public override setProps(props:IShapeProps):void{
        super.setProps(props);
        if (props.color!==undefined) {
            if (typeof props.color === "string") {
                this.color.set(Color.fromCssLiteral(props.color));
            } else {
                this.color.setRGBA(props.color.r,props.color.g,props.color.b,props.color.a);
            }
        }
        if (props.fillColor!==undefined) {
            if (typeof props.fillColor === "string") {
                this.fillColor.set(Color.fromCssLiteral(props.fillColor));
            } else {
                this.fillColor.setRGBA(props.fillColor.r,props.fillColor.g,props.fillColor.b,props.fillColor.a);
            }
        }
        if (props.lineWidth!==undefined) this._lineWidth = props.lineWidth;
    }

    protected override setClonedProperties(cloned:Shape):void{
        cloned.color.set(this.color);
        cloned._lineWidth = this._lineWidth;
        cloned.fillColor = this.fillColor.clone();
        if (this.fillGradient!==undefined) cloned.fillGradient = this.fillGradient.clone();
        cloned.filters = [...this.filters];
        super.setClonedProperties(cloned);
    }

}
