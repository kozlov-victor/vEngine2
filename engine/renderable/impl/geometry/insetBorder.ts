import {MarkableGameObjectContainer} from "@engine/renderable/impl/ui/textField/_internal/markableGameObjectContainer";
import {Color} from "@engine/renderer/common/color";
import {Polygon} from "@engine/renderable/impl/geometry/polygon";
import {Game} from "@engine/core/game";

export class InsetBorder extends MarkableGameObjectContainer {

    private borderWidth:number = 3;
    private color1:IColor = Color.GREY.clone();
    private color2:IColor = Color.BLACK.clone();

    private leftPoly:Polygon;
    private topPoly:Polygon;
    private rightPoly:Polygon;
    private bottomPoly:Polygon;

    constructor(game:Game) {
        super(game);
    }

    public setBorderWidth(borderWidth:number):void{
        this.borderWidth = borderWidth;
        this.markAsDirty();
    }

    public setColor1(col:IColor):void {
        this.color1 = col;
        this.markAsDirty();
    }

    public setColor2(col:IColor):void {
        this.color2 = col;
        this.markAsDirty();
    }

    protected override onCleared():void {
        super.onCleared();
        const border = this.borderWidth;
        const width = this.size.width;
        const height = this.size.height;
        // left
        const leftPoly:Polygon = Polygon.fromSvgPath(this.game,
            `
            M 0 0
            L ${border} ${border}
            L ${border} ${height-border}
            L 0 ${this.size.height}
            Z
        `);
        leftPoly.fillColor.setFrom(this.color1);
        this.appendChild(leftPoly);
        if (this.leftPoly!==undefined) this.removeChild(leftPoly);
        this.leftPoly = leftPoly;

        //top
        const topPoly:Polygon = Polygon.fromSvgPath(this.game,
            `
            M 0 0
            L ${this.size.width} 0
            L ${width-border} ${border}
            L ${border} ${border}
            Z
        `);
        topPoly.fillColor.setFrom(this.color1);
        this.appendChild(topPoly);
        if (this.topPoly!==undefined) this.removeChild(topPoly);
        this.topPoly = topPoly;

        // right
        const rightPoly:Polygon = Polygon.fromSvgPath(this.game,
            `
            M ${width} 0
            L ${width} ${height}
            L ${width-border} ${height-border}
            L ${width-border} ${border}
            Z
        `);
        rightPoly.fillColor.setFrom(this.color2);
        this.appendChild(rightPoly);
        if (this.rightPoly!==undefined) this.removeChild(rightPoly);
        this.rightPoly = rightPoly;

        // bottom
        const bottomPoly:Polygon = Polygon.fromSvgPath(this.game,
            `
            M ${width} ${height}
            L 0 ${height}
            L ${border} ${height-border}
            L ${width-border} ${height-border}
            Z
        `);
        bottomPoly.fillColor.setFrom(this.color2);
        this.appendChild(bottomPoly);
        if (this.bottomPoly!==undefined) this.removeChild(bottomPoly);
        this.bottomPoly = bottomPoly;

    }

}
