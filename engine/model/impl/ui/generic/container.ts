import {Rect} from "@engine/geometry/rect";
import {RenderableModel} from "../../../renderableModel";
import {DebugError} from "@engine/debug/debugError";
import {Game} from "@engine/game";
import {Shape} from "./shape";


export enum OVERFLOW {
    HIDDEN,VISIBLE
}

export enum LAYOUT_SIZE {
    FIXED,
    WRAP_CONTENT,
    MATCH_PARENT
}


export abstract class Container extends RenderableModel {

    marginLeft      :number = 0;
    marginTop       :number = 0;
    marginRight     :number = 0;
    marginBottom    :number = 0;
    paddingLeft     :number = 0;
    paddingTop      :number = 0;
    paddingRight    :number = 0;
    paddingBottom   :number = 0;

    layoutWidth     :LAYOUT_SIZE =  LAYOUT_SIZE.WRAP_CONTENT;
    layoutHeight    :LAYOUT_SIZE =  LAYOUT_SIZE.WRAP_CONTENT;
    overflow        :OVERFLOW = OVERFLOW.HIDDEN; // todo change

    background      :Shape;

    drawingRect:Rect = new Rect();

    maxWidth: number = 0;
    maxHeight: number = 0;


    protected constructor(game:Game){
        super(game);
    }

    testLayout():void {
        if (DEBUG) {
            if (this.layoutWidth===LAYOUT_SIZE.FIXED && this.size.width===0)
                throw new DebugError(`layoutWidth is LAYOUT_SIZE.FIXED so width must be specified`);
            if (this.layoutHeight===LAYOUT_SIZE.FIXED && this.size.height===0)
                throw new DebugError(`layoutHeight is LAYOUT_SIZE.FIXED so height must be specified`);
        }
    }


    private static normalizeBorders(top:number,right:number,bottom:number,left:number){
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
        return {top,right,bottom,left};
    }

    setMargins(top:number):void;
    setMargins(top:number,right:number):void;
    setMargins(top:number,right:number,bottom:number):void;
    setMargins(top:number,right:number,bottom:number,left:number):void;
    setMargins(top:number,right?:number,bottom?:number,left?:number):void{

        ({top,right,bottom,left} = Container.normalizeBorders(top,right,bottom,left));
        this.marginTop = top;
        this.marginRight = right;
        this.marginBottom = bottom;
        this.marginLeft = left;
        this.setDirty();
    }

    setMarginsTopBottom(top:number,bottom?:number):void {
        if (bottom===undefined) bottom = top;
        this.paddingTop = top;
        this.paddingBottom = bottom;
        this.setDirty();
    }

    setMarginsLeftRight(left:number,right?:number):void {
        if (right===undefined) right = left;
        this.marginLeft = left;
        this.marginRight = right;
        this.setDirty();
    }

    setPaddings(top:number):void;
    setPaddings(top:number,right:number):void;
    setPaddings(top:number,right:number,bottom:number):void;
    setPaddings(top:number,right:number,bottom:number,left:number):void;
    setPaddings(top:number,right?:number,bottom?:number,left?:number):void{

        ({top,right,bottom,left} = Container.normalizeBorders(top,right,bottom,left));

        this.paddingTop = top;
        this.paddingRight = right;
        this.paddingBottom = bottom;
        this.paddingLeft = left;
        this.setDirty();
    }

    protected calcWorldRect():void {
        this._srcRect.setXYWH(
            this.pos.x,this.pos.y,
            this.size.width + this.marginLeft + this.marginRight,
            this.size.height + this.marginTop + this.marginBottom
        );
        this._screenRect.set(this._srcRect);
        let parent:RenderableModel = this.parent;
        while (parent) {
            this._screenRect.addXY(parent.getSrcRect().point.x,parent.getSrcRect().point.y);
            parent = parent.parent;
        }
    }

    setPaddingsTopBottom(top:number,bottom?:number):void {
        if (bottom===undefined) bottom = top;
        this.paddingTop = top;
        this.paddingBottom = bottom;
        this.setDirty();
    }

    setPaddingsLeftRight(left:number,right?:number){
        if (right===undefined) right = left;
        this.paddingLeft = left;
        this.paddingRight = right;
        this.setDirty();
    }


    revalidate():void {
        this.calcWorldRect();
        super.revalidate();
    }

    onGeometryChanged():void {
        this.revalidate();
    }


    setWH(w:number,h:number):void {
        this.size.setWH(w,h);
        this.drawingRect.setWH(w,h);
    }

    calcDrawableRect(contentWidth:number, contentHeight:number):void {
        let paddedWidth = contentWidth  + this.paddingLeft + this.paddingRight;
        let paddedHeight = contentHeight +  this.paddingTop +  this.paddingBottom;
        if (this.background) {
            this.background.setWH(paddedWidth,paddedHeight);
            this.size.set(this.background.size);
        } else {
            this.size.setWH(paddedWidth,paddedHeight);
        }
        this.calcWorldRect();
    }

    update():void {
        if (this._dirty) {
            this.onGeometryChanged();
            this._dirty = false;
        }
        super.update();
    }

    beforeRender():void {
        this.game.getRenderer().translate(
            this.pos.x + this.marginLeft,
            this.pos.y + this.marginTop
        );
    }


}