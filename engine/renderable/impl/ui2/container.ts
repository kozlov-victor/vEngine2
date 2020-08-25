import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {Game} from "@engine/core/game";
import {IRectJSON, Rect} from "@engine/geometry/rect";

export class Container extends RenderableModel{


    constructor(game: Game) {
        super(game);
    }

    private static normalizeBorders(top:number,right?:number,bottom?:number,left?:number)
        :{top:number,right:number,bottom:number,left:number} {
        if (right===undefined && bottom===undefined && left===undefined) {
            // noinspection JSSuspiciousNameCombination
            right = bottom = left = top;
        }
        else if (bottom===undefined && left===undefined) {
            bottom = top;
            left = right;
        }
        else if (left===undefined) {
            left = right;
        }
        return {top,right:right!,bottom:bottom!,left:left!};
    }

    private marginLeft      :number = 0;
    private marginTop       :number = 0;
    private marginRight     :number = 0;
    private marginBottom    :number = 0;
    private paddingLeft     :number = 0;
    private paddingTop      :number = 0;
    private paddingRight    :number = 0;
    private paddingBottom   :number = 0;

    private background?: RenderableModel;
    private clientRect:Rect = new Rect();


    public setMargin(top:number,right?:number,bottom?:number,left?:number):void{
        ({top,right,bottom,left} = Container.normalizeBorders(top,right,bottom,left));
        this.marginTop = top;
        this.marginRight = right;
        this.marginBottom = bottom;
        this.marginLeft = left;
        this.fitBackgroundToSize();
        this.recalculateClientRect();
    }

    public setBackground(background: RenderableModel):void {
        if (this.background!==undefined) this.removeChild(this.background);
        this.background = background;
        this.appendChild(this.background);
        this.fitBackgroundToSize();
    }

    public setPadding(top:number, right?:number, bottom?:number, left?:number):void{

        ({top,right,bottom,left} = Container.normalizeBorders(top,right,bottom,left));

        this.paddingTop = top;
        this.paddingRight = right;
        this.paddingBottom = bottom;
        this.paddingLeft = left;
        this.fitBackgroundToSize();
        this.recalculateClientRect();
    }

    public draw(): void {}

    public revalidate(): void {
        super.revalidate();
        this.fitBackgroundToSize();
        this.recalculateClientRect();
    }

    public getClientRect():Readonly<IRectJSON> {
        return this.clientRect;
    }

    private fitBackgroundToSize():void {
        if (this.background===undefined) return;
        this.background.setPosAndSize(
            this.marginLeft,
            this.marginTop,
            this.size.width - this.marginRight - this.marginLeft,
            this.size.height - this.marginBottom - this.marginTop);
        if (this.background.size.width<=0) {
            this.background.pos.x = 0;
            this.background.size.width = this.size.width;
        }
        if (this.background.size.height<=0) {
            this.background.pos.y = 0;
            this.background.size.height = this.size.height;
        }
    }

    private recalculateClientRect():void {
        this.clientRect.setXYWH(
            this.marginLeft+this.paddingLeft,
            this.marginTop+this.paddingTop,
            this.size.width - this.marginLeft - this.paddingLeft - this.marginRight - this.paddingRight,
            this.size.height - this.marginTop - this.paddingTop - this.marginBottom - this.paddingBottom,
        );
        if (this.clientRect.width<=0) {
            this.clientRect.x = 0;
            this.clientRect.width = this.size.width;
        }
        if (this.clientRect.height<=0) {
            this.clientRect.y = 0;
            this.clientRect.height = this.size.height;
        }
    }

}
