import {AbstractFilter} from "../webGl/filters/abstract/abstractFilter";
import {TextField} from "@engine/model/impl/ui/components/textField";
import {Device} from "../../misc/device";
import {Game, SCALE_STRATEGY} from "../../game";
import {Rect} from "../../geometry/rect";
import {Color} from "../color";
import {Size} from "../../geometry/size";
import {Rectangle} from "@engine/model/impl/geometry/rectangle";
import {Ellipse} from "@engine/model/impl/geometry/ellipse";
import {NinePatchImage} from "@engine/model/impl/geometry/ninePatchImage";
import {Image} from "@engine/model/impl/geometry/image";
import {ResourceLink} from "@engine/resources/resourceLink";
import {Mesh} from "@engine/model/abstract/mesh";
import {Font} from "@engine/model/impl/general/font";
import {Line} from "@engine/model/impl/geometry/line";
import {RenderableModel} from "@engine/model/abstract/renderableModel";
import {ITexture} from "@engine/renderer/texture";

export abstract class AbstractRenderer {

    public abstract type:string;

    public container:HTMLElement;
    public debugTextField:TextField;

    public readonly fullScreenSize:Size = new Size(0,0);

    protected renderableCache:{[path:string]:ITexture} = {};

    protected constructor(protected game:Game){
        this.game = game;
        if (Device.isCocoonJS) {
            const dpr:number = window.devicePixelRatio||1;
            this.fullScreenSize.setW(window.innerWidth*dpr);
            this.fullScreenSize.setH(window.innerHeight*dpr);
        } else {
            this.fullScreenSize.setWH(this.game.width,this.game.height);
        }
    }

    public requestFullScreen():void {
        const element:HTMLElement = this.container;
        if((element as any).requestFullScreen) {
            (element as any).requestFullScreen();
        } else if((element as any).mozRequestFullScreen) {
            (element as any).mozRequestFullScreen();
        } else if((element as any).webkitRequestFullScreen) {
            (element as any).webkitRequestFullScreen();
        }
    }

    public cancelFullScreen():void {
        if((document as any).cancelFullScreen) {
            (document as any).cancelFullScreen();
        } else if((document as any).mozCancelFullScreen) {
            (document as any).mozCancelFullScreen();
        } else if((document as any).webkitCancelFullScreen) {
            (document as any).webkitCancelFullScreen();
        }
    }

    public beforeFrameDraw(color:Color):void {}

    public afterFrameDraw(filters:AbstractFilter[]):void {}

    public registerResize():void {
        this.onResize();
        window.addEventListener('resize',()=>this.onResize());
    }

    public destroy():void {
        window.removeEventListener('resize',this.onResize);
    }

    public getError():{code:number,desc:string}{
        return undefined;
    }

    public drawImage(img:Image):void {}

    public drawNinePatch(img:NinePatchImage):void {}


    public drawRectangle(rectangle:Rectangle):void {}

    public lockRect(rect:Rect):void {}

    public unlockRect():void {}

    public drawLine(line:Line):void {}

    public drawMesh(m:Mesh):void {}

    public drawEllipse(ellispe:Ellipse):void {}

    public resetTransform():void {}

    public save():void {}

    public restore():void {}

    public translate(x:number,y:number,z:number = 0):void {}

    public scale(x:number,y:number,z:number = 0):void {}

    public rotateX(a:number):void {}

    public rotateY(a:number):void {}

    public rotateZ(a:number):void {}

    public killObject(r:RenderableModel):void{}

    public log(args:any):void {
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
            else if (typeof txt==='function') {
                txt = txt.toString();
            }
            else {
                if (typeof txt !== 'string') {
                    try{
                        txt = JSON.stringify(txt);
                    } catch (e){
                        txt = txt.toString();
                    }
                }
            }
            res+=`${txt}\n`;
        });
        textField.pos.x = 10;
        textField.pos.y = 10;
        textField.setText(textField.getText()+res);
    }

    public clearLog():void {
        if (!DEBUG) return;
        if (!this.debugTextField) return;
        this.debugTextField.setText('');
    }

    public loadTextureInfo(url:string,link:ResourceLink<ITexture>,onLoaded:()=>void):void {}

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
}