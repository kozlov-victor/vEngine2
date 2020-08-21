import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {Game} from "@engine/core/game";

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


    public setMargin(top:number,right?:number,bottom?:number,left?:number):void{
        ({top,right,bottom,left} = Container.normalizeBorders(top,right,bottom,left));
        this.marginTop = top;
        this.marginRight = right;
        this.marginBottom = bottom;
        this.marginLeft = left;
        this.fitBackgroundToSize();
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
    }

    public draw(): void {}

    public revalidate(): void {
        super.revalidate();
        this.fitBackgroundToSize();
    }

    private fitBackgroundToSize():void {
        if (this.background===undefined) return;
        this.background.setPosAndSize(
            this.marginLeft,
            this.marginTop,
            this.size.width - this.marginRight - this.marginLeft,
            this.size.height - this.marginBottom - this.marginTop);
    }

}
