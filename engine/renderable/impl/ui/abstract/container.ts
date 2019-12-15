import {Rect} from "@engine/geometry/rect";
import {RenderableModel} from "../../../abstract/renderableModel";
import {DebugError} from "@engine/debug/debugError";
import {Game} from "@engine/core/game";
import {Shape} from "../../../abstract/shape";


export const enum OVERFLOW {
    HIDDEN,VISIBLE
}

export const enum LAYOUT_SIZE {
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


    private _dirty:boolean = false;


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

    public setPaddingsTopBottom(top:number,bottom:number = top):void {
        if (bottom===undefined) bottom = top;
        this.paddingTop = top;
        this.paddingBottom = bottom;
        this.setDirty();
    }

    public setPaddingsLeftRight(left:number,right:number = left){
        this.paddingLeft = left;
        this.paddingRight = right;
        this.setDirty();
    }


    public revalidate():void {
        this.updateUIRect();
        if (this.background) this.background.size.set(this.size);
        super.revalidate();
    }

    public onGeometryChanged():void {
        this.revalidate();
        this._dirty = false;
    }


    public setWH(w:number,h:number):void { // todo remove it
        this.size.setWH(w,h);
        this.drawingRect.setWH(w,h);
        this.setDirty();
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
        this.updateUIRect();
    }

    public update():void {
        if (this.isDirty()) {
            this.onGeometryChanged();
        }
        super.update();
    }

    public translate():void {
        super.translate();
        this.game.getRenderer().transformTranslate(
            this.marginLeft,
            this.marginTop
        );
    }

    protected setDirty():void {
        this._dirty = true;
    }

    protected isDirty():boolean {
        return this._dirty;
    }

    private updateUIRect():void{
        this.size.setWH(
            this.size.width + this.marginLeft + this.marginRight,
            this.size.height + this.marginTop + this.marginBottom
        );
    }



}