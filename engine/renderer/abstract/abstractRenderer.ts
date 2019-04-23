import {AbstractFilter} from "../webGl/filters/abstract/abstractFilter";
import {TextField} from "@engine/model/impl/ui/components/textField";
import {Device} from "../../misc/device";
import {Game} from "../../game";
import {Rect} from "../../geometry/rect";
import {Point2d} from "../../geometry/point2d";
import {Color} from "../color";
import {Size} from "../../geometry/size";
import {Rectangle} from "@engine/model/impl/ui/drawable/rectangle";
import {Ellipse} from "@engine/model/impl/ui/drawable/ellipse";
import {NinePatchImage} from "@engine/model/impl/ui/drawable/ninePatchImage";
import {Image} from "@engine/model/impl/ui/drawable/image";
import {ResourceLink} from "@engine/resources/resourceLink";
import {GameObject3d} from "@engine/model/impl/gameObject3d";
import {Font} from "@engine/model/impl/font";
import {Texture} from "@engine/renderer/webGl/base/texture";

export class AbstractRenderer {

    public container:HTMLElement;
    public debugTextField:TextField;

    public readonly fullScreenSize:Size = new Size(0,0);

    protected renderableCache:{[path:string]:Texture} = {};

    constructor(protected game:Game){
        this.game = game;
        if (Device.isCocoonJS) {
            let dpr = window.devicePixelRatio||1;
            this.fullScreenSize.setW(window.innerWidth*dpr);
            this.fullScreenSize.setH(window.innerHeight*dpr);
        } else {
            this.fullScreenSize.setWH(this.game.width,this.game.height);
        }

    }

    onResize():void {}

    requestFullScreen():void {
        let element:HTMLElement = this.container;
        if((element as any).requestFullScreen) {
            (element as any).requestFullScreen();
        } else if((element as any).mozRequestFullScreen) {
            (element as any).mozRequestFullScreen();
        } else if((element as any).webkitRequestFullScreen) {
            (element as any).webkitRequestFullScreen();
        }
    }

    cancelFullScreen():void {
        if((document as any).cancelFullScreen) {
            (document as any).cancelFullScreen();
        } else if((document as any).mozCancelFullScreen) {
            (document as any).mozCancelFullScreen();
        } else if((document as any).webkitCancelFullScreen) {
            (document as any).webkitCancelFullScreen();
        }
    }

    beforeFrameDraw(color:Color):void {}

    afterFrameDraw(filters:AbstractFilter[]):void {}

    registerResize():void {
        this.onResize();
        window.addEventListener('resize',()=>this.onResize());
    }

    destroy():void {
        window.removeEventListener('resize',this.onResize);
    }

    getError():number{
        return 0;
    }

    drawImage(img:Image):void {}

    drawNinePatch(img:NinePatchImage):void {}

    drawTiledImage(texturePath:string,
                   srcRect:Rect,
                   dstRect:Rect,
                   offset:Point2d):void {}

    drawRectangle(rectangle:Rectangle):void {}

    lockRect(rect:Rect):void {}

    unlockRect():void {}

    drawLine(x1:number,y1:number,x2:number,y2:number,color:Color):void {}


    drawModel(go:GameObject3d):void {}

    drawEllipse(ellispe:Ellipse):void {}

    resetTransform():void {}

    save():void {}

    restore():void {}

    translate(x:number,y:number,z:number = 0):void {}

    scale(x:number,y:number,z:number = 0):void {}

    rotateZ(a:number):void {}

    rotateY(a:number):void {}

    log(args:any):void {
        if (!DEBUG) return;
        let textField:TextField = this.debugTextField;
        if (!textField) {
            textField = new TextField(this.game);
            textField.setFont(Font.getSystemFont());
            textField.revalidate();
            this.debugTextField = textField;
        }
        let res:string = '';
        Array.prototype.slice.call(arguments).forEach((txt:any)=>{
            if (txt===undefined) txt = 'undefined';
            else if (txt===null) txt = 'null';
            else if (txt.toJSON) {
                txt = JSON.stringify(txt.toJSON(),null,4);
            }
            else {
                if (typeof txt !== 'string') {
                    try{
                        txt = JSON.stringify(txt);
                    } catch (e){
                        txt = `[Object](${e.error})`;
                    }
                }
            }
            res+=`${txt}\n`;
        });
        textField.pos.x = 10;
        textField.pos.y = 10;
        textField.setText(textField.getText()+res);
    }

    clearLog():void {
        if (!DEBUG) return;
        if (!this.debugTextField) return;
        this.debugTextField.setText('');
    }

    loadTextureInfo(url:string,link:ResourceLink<Texture>,onLoaded:()=>void):void {}
}