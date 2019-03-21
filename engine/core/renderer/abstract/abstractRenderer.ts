
import {AbstractFilter} from "../webGl/filters/abstract/abstractFilter";
import {TextField} from '@engine/model/impl/ui/components/textField'
import {Device} from '../../device'
import {Game} from "../../game";
import {GameObject} from '@engine/model/impl/gameObject';
import {Rect} from "../../geometry/rect";
import {Point2d} from "../../geometry/point2d";
import {Color} from "../color";
import {TextureInfo} from "../webGl/programs/abstract/abstractDrawer";
import {Size} from "../../geometry/size";
import {DebugError} from "@engine/debugError";
import {Rectangle} from "@engine/model/impl/ui/drawable/rectangle";
import {Ellipse} from "@engine/model/impl/ui/drawable/ellipse";
import {NinePatchImage} from "@engine/model/impl/ui/drawable/ninePatchImage";
import {Image} from "@engine/model/impl/ui/drawable/image";
import {ResourceLink} from "@engine/core/resources/resourceLink";
import {GameObject3d} from "@engine/model/impl/gameObject3d";
import {Font} from "@engine/model/impl/font";

declare const document:any, window:any;

export class AbstractRenderer {

    public container:HTMLElement;
    public debugTextField:TextField;

    renderableCache:{[path:string]:TextureInfo} = {};
    public fullScreenSize:Size = new Size(0,0);
    protected game:Game;

    constructor(game:Game){
        this.game = game;
        if (Device.isCocoonJS) {
            let dpr = window.devicePixelRatio||1;
            this.fullScreenSize.setW(window.innerWidth*dpr);
            this.fullScreenSize.setH(window.innerHeight*dpr);
        } else {
            this.fullScreenSize.setWH(this.game.width,this.game.height);
        }

    }

    onResize(){}

    requestFullScreen(){
        let element = this.container as any;
        if(element.requestFullScreen) {
            element.requestFullScreen();
        } else if(element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if(element.webkitRequestFullScreen) {
            element.webkitRequestFullScreen();
        }
    }

    cancelFullScreen(){
        if(document.cancelFullScreen) {
            document.cancelFullScreen();
        } else if(document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if(document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
        }
    }

    beginFrameBuffer(){}

    flipFrameBuffer(filters:Array<AbstractFilter>){}

    registerResize(){
        this.onResize();
        window.addEventListener('resize',()=>this.onResize());
    }

    destroy(){
        window.removeEventListener('resize',this.onResize);
    }

    getError():number{
        return 0;
    }

    drawImage(img:Image){}

    drawNinePatch(img:NinePatchImage){}

    drawTiledImage(texturePath:string,
                   srcRect:Rect,
                   dstRect:Rect,
                   offset:Point2d){}

    drawRectangle(rectangle:Rectangle){}

    lockRect(rect:Rect) {}

    unlockRect(){}

    drawLine(x1:number,y1:number,x2:number,y2:number,color:Color){}


    drawModel(go:GameObject3d){}

    drawEllipse(ellispe:Ellipse){}

    resetTransform(){}

    clear(){}

    clearColor(c:Color){}

    save(){}

    restore(){}

    translate(x:number,y:number,z:number = 0){}

    scale(x:number,y:number,z:number = 0){}

    rotateZ(a:number){}

    rotateY(a:number){}

    log(args:any){
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

    clearLog(){
        if (!DEBUG) return;
        if (!this.debugTextField) return;
        this.debugTextField.setText('');
    }


    loadTextureInfo(url:string,link:ResourceLink,onLoaded:()=>void){}

    getTextureInfo(textureId:string):TextureInfo{
        let t:TextureInfo =  this.renderableCache[textureId];
        if (!t) throw new DebugError(`can not find resource with id ${textureId}`);
        return t;
    }
}