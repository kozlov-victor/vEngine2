import {Rect} from "@engine/geometry/rect";
import {RenderableModel} from "../../../abstract/renderableModel";
import {DebugError} from "@engine/debug/debugError";
import {Game} from "@engine/game";
import {Shape} from "../../geometry/abstract/shape";


export enum OVERFLOW {
    HIDDEN,VISIBLE
}

export enum LAYOUT_SIZE {
    FIXED,
    WRAP_CONTENT,
    MATCH_PARENT
}


export abstract class Container extends RenderableModel {


    private static normalizeBorders(top:number,right?:number,bottom?:number,left?:number)
    :{top:number,right:number,bottom:number,left:number} {
        if (right===undefined && bottom===undefined && left===undefined) {
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

    public marginLeft      :number = 0;
    public marginTop       :number = 0;
    public marginRight     :number = 0;
    public marginBottom    :number = 0;
    public paddingLeft     :number = 0;
    public paddingTop      :number = 0;
    public paddingRight    :number = 0;
    public paddingBottom   :number = 0;

    public layoutWidth     :LAYOUT_SIZE =  LAYOUT_SIZE.WRAP_CONTENT;
    public layoutHeight    :LAYOUT_SIZE =  LAYOUT_SIZE.WRAP_CONTENT;
    public overflow        :OVERFLOW = OVERFLOW.HIDDEN; // todo change

    public background      :Shape;

    public drawingRect:Rect = new Rect();

    public maxWidth: number = 0;
    public maxHeight: number = 0;


    protected constructor(game:Game){
        super(game);
    }

    public testLayout():void {
        if (DEBUG) {
            if (this.layoutWidth===LAYOUT_SIZE.FIXED && this.size.width===0)
                throw new DebugError(`layoutWidth is LAYOUT_SIZE.FIXED so width must be specified`);
            if (this.layoutHeight===LAYOUT_SIZE.FIXED && this.size.height===0)
                throw new DebugError(`layoutHeight is LAYOUT_SIZE.FIXED so height must be specified`);
        }
    }


    public setMargins(top:number,right?:number,bottom?:number,left?:number):void{

        ({top,right,bottom,left} = Container.normalizeBorders(top,right,bottom,left));
        this.marginTop = top;
        this.marginRight = right;
        this.marginBottom = bottom;
        this.marginLeft = left;
        this.setDirty();
    }

    public setMarginsTopBottom(top:number,bottom?:number):void {
        if (bottom===undefined) bottom = top;
        this.paddingTop = top;
        this.paddingBottom = bottom;
        this.setDirty();
    }

    public setMarginsLeftRight(left:number,right?:number):void {
        if (right===undefined) right = left;
        this.marginLeft = left;
        this.marginRight = right;
        this.setDirty();
    }


    public setPaddings(top:number,right?:number,bottom?:number,left?:number):void{

        ({top,right,bottom,left} = Container.normalizeBorders(top,right,bottom,left));

        this.paddingTop = top;
        this.paddingRight = right;
        this.paddingBottom = bottom;
        this.paddingLeft = left;
        this.setDirty();
    }

    public setPaddingsTopBottom(top:number,bottom?:number):void {
        if (bottom===undefined) bottom = top;
        this.paddingTop = top;
        this.paddingBottom = bottom;
        this.setDirty();
    }

    public setPaddingsLeftRight(left:number,right?:number){
        if (right===undefined) right = left;
        this.paddingLeft = left;
        this.paddingRight = right;
        this.setDirty();
    }


    public revalidate():void {
        this.calcWorldRect();
        if (this.background) this.background.size.set(this.size);
        super.revalidate();
    }

    public onGeometryChanged():void {
        this.revalidate();
    }


    public setWH(w:number,h:number):void {
        this.size.setWH(w,h);
        this.drawingRect.setWH(w,h);
    }

    public calcDrawableRect(contentWidth:number, contentHeight:number):void {
        const paddedWidth:number = contentWidth  + this.paddingLeft + this.paddingRight;
        const paddedHeight:number = contentHeight +  this.paddingTop +  this.paddingBottom;
        if (this.background) {
            this.background.setWH(paddedWidth,paddedHeight);
            this.size.set(this.background.size);
        } else {
            this.size.setWH(paddedWidth,paddedHeight);
        }
        this.calcWorldRect();
    }

    public update():void {
        if (this._dirty) {
            this.onGeometryChanged();
            this._dirty = false;
        }
        super.update();
    }

    public beforeRender():void {
        this.game.getRenderer().translate(
            this.pos.x + this.marginLeft,
            this.pos.y + this.marginTop
        );
    }

    protected calcWorldRect():void {
        this._srcRect.setXYWH(
            this.pos.x,this.pos.y,
            this.size.width + this.marginLeft + this.marginRight,
            this.size.height + this.marginTop + this.marginBottom
        );
        this._screenRect.set(this._srcRect);
        let parent:RenderableModel|null = this.parent;
        while (parent) {
            this._screenRect.addXY(parent.getSrcRect().point.x,parent.getSrcRect().point.y);
            parent = parent.parent;
        }
    }


}