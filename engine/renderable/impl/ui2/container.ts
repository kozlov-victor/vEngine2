import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {Game} from "@engine/core/game";
import {IRectJSON, Rect} from "@engine/geometry/rect";
import {NullGameObject} from "@engine/renderable/impl/general/nullGameObject";

interface IContainerWithMarginPadding {
    marginLeft      :number;
    marginTop       :number;
    marginRight     :number;
    marginBottom    :number;
    paddingLeft     :number;
    paddingTop      :number;
    paddingRight    :number;
    paddingBottom   :number;
}

export class Container extends RenderableModel implements IContainerWithMarginPadding{

    public readonly type:string = 'Container';

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

    public readonly marginLeft      :number = 0;
    public readonly marginTop       :number = 0;
    public readonly marginRight     :number = 0;
    public readonly marginBottom    :number = 0;
    public readonly paddingLeft     :number = 0;
    public readonly paddingTop      :number = 0;
    public readonly paddingRight    :number = 0;
    public readonly paddingBottom   :number = 0;

    protected background: RenderableModel = new NullGameObject(this.game);

    private clientRect:Rect = new Rect();

    constructor(game: Game) {
        super(game);
        this.appendChild(this.background);
    }

    public setMargin(top:number,right?:number,bottom?:number,left?:number):void{
        ({top,right,bottom,left} = Container.normalizeBorders(top,right,bottom,left));
        const thisWriteable = this as IContainerWithMarginPadding;
        thisWriteable.marginTop = top;
        thisWriteable.marginRight = right;
        thisWriteable.marginBottom = bottom;
        thisWriteable.marginLeft = left;
        this.recalculateClientRect();
        this.fitBackgroundToSize();
    }

    public setBackground(background: RenderableModel):void {
        this.replaceChild(this.background,background);
        this.background = background;
        this.fitBackgroundToSize();
    }

    public setPadding(top:number, right?:number, bottom?:number, left?:number):void{

        ({top,right,bottom,left} = Container.normalizeBorders(top,right,bottom,left));

        const thisWriteable = this as IContainerWithMarginPadding;
        thisWriteable.paddingTop = top;
        thisWriteable.paddingRight = right;
        thisWriteable.paddingBottom = bottom;
        thisWriteable.paddingLeft = left;
        this.recalculateClientRect();
        this.fitBackgroundToSize();
    }

    public draw(): void {}

    public revalidate(): void {
        super.revalidate();
        this.recalculateClientRect();
        this.fitBackgroundToSize();
    }

    public getClientRect():Readonly<IRectJSON> {
        return this.clientRect;
    }

    private fitBackgroundToSize():void {
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
