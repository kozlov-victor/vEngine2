import {AbstractFilter} from "../webGl/filters/abstract/abstractFilter";
import {TextField} from "@engine/model/impl/ui/components/textField";
import {Device} from "../../misc/device";
import {Game, SCALE_STRATEGY} from "../../game";
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
import {Line} from "@engine/model/impl/ui/drawable/line";
import {RenderableModel} from "@engine/model/renderableModel";
import {ITexture} from "@engine/renderer/texture";

export class AbstractRenderer {

    public container:HTMLElement;
    public debugTextField:TextField;

    public readonly fullScreenSize:Size = new Size(0,0);

    protected renderableCache:{[path:string]:ITexture} = {};

    constructor(protected game:Game){
        this.game = game;
        if (Device.isCocoonJS) {
            const dpr:number = window.devicePixelRatio||1;
            this.fullScreenSize.setW(window.innerWidth*dpr);
            this.fullScreenSize.setH(window.innerHeight*dpr);
        } else {
            this.fullScreenSize.setWH(this.game.width,this.game.height);
        }
    }

    protected onResize():void {
        const container:HTMLElement = this.container;
        if (this.game.scaleStrategy===SCALE_STRATEGY.NO_SCALE) return;
        else if (this.game.scaleStrategy===SCALE_STRATEGY.STRETCH) {
            container.style.width = `${window.innerWidth}px`;
            container.style.height = `${window.innerHeight}px`;
            return;
        }
        const canvasRatio:number = this.game.height / this.game.width;
        const windowRatio:number = window.innerHeight / window.innerWidth;
        let width:number;
        let height:number;

        if (windowRatio < canvasRatio) {
            height = window.innerHeight;
            width = height / canvasRatio;
        } else {
            width = window.innerWidth;
            height = width * canvasRatio;
        }
        this.game.scale.setXY(width / this.game.width, height / this.game.height);
        this.game.pos.setXY(
            (window.innerWidth - width) / 2,
            (window.innerHeight - height) / 2
        );

        this.container.style.width = width + 'px';
        this.container.style.height = height + 'px';
        this.container.style.marginTop = `${this.game.pos.y}px`;
    }

    requestFullScreen():void {
        const element:HTMLElement = this.container;
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


    drawRectangle(rectangle:Rectangle):void {}

    lockRect(rect:Rect):void {}

    unlockRect():void {}

    drawLine(line:Line):void {}

    drawModel(go:GameObject3d):void {}

    drawEllipse(ellispe:Ellipse):void {}

    resetTransform():void {}

    save():void {}

    restore():void {}

    translate(x:number,y:number,z:number = 0):void {}

    scale(x:number,y:number,z:number = 0):void {}

    rotateX(a:number):void {}

    rotateY(a:number):void {}

    rotateZ(a:number):void {}

    killObject(r:RenderableModel):void{}

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

    loadTextureInfo(url:string,link:ResourceLink<ITexture>,onLoaded:()=>void):void {}
}