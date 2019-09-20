import {AbstractFilter} from "../webGl/filters/abstract/abstractFilter";
import {TextField} from "@engine/renderable/impl/ui/components/textField";
import {Device} from "../../misc/device";
import {Game, SCALE_STRATEGY} from "../../core/game";
import {Rect} from "../../geometry/rect";
import {Color} from "../color";
import {Size} from "../../geometry/size";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {Ellipse} from "@engine/renderable/impl/geometry/ellipse";
import {Image} from "@engine/renderable/impl/geometry/image";
import {ResourceLink} from "@engine/resources/resourceLink";
import {Mesh} from "@engine/renderable/abstract/mesh";
import {Font} from "@engine/renderable/impl/general/font";
import {Line} from "@engine/renderable/impl/geometry/line";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {ITexture} from "@engine/renderer/texture";
import {IDestroyable, Optional} from "@engine/core/declarations";
import {TileMap} from "@engine/renderable/impl/general/tileMap";

interface IHTMLElement extends HTMLElement{
    requestFullScreen:()=>void;
    mozRequestFullScreen:()=>void;
    webkitRequestFullScreen:()=>void;
}

interface IDocument extends Document {
    cancelFullScreen:()=>void;
    mozCancelFullScreen:()=>void;
    webkitCancelFullScreen:()=>void;
}

export abstract class AbstractRenderer implements IDestroyable {

    public abstract type:string;

    public container:HTMLElement;
    public debugTextField:TextField;

    public readonly fullScreenSize:Size = new Size(0,0);

    protected renderableCache:{[path:string]:ITexture} = {};

    protected constructor(protected game:Game){
        this.game = game;
        if (Device.isCocoonJS) {
            const [innerWidth,innerHeight] = this.getScreenResolution();
            const dpr:number = globalThis.devicePixelRatio||1;
            this.fullScreenSize.setW(innerWidth*dpr);
            this.fullScreenSize.setH(innerHeight*dpr);
        } else {
            this.fullScreenSize.setWH(this.game.width,this.game.height);
        }
    }

    public requestFullScreen():void {
        const element:IHTMLElement = this.container as IHTMLElement;
        if((element).requestFullScreen) {
            (element).requestFullScreen();
        } else if((element).mozRequestFullScreen) {
            (element).mozRequestFullScreen();
        } else if((element).webkitRequestFullScreen) {
            (element).webkitRequestFullScreen();
        }
    }

    public cancelFullScreen():void {
        const doc:IDocument = globalThis.document as IDocument;
        if(doc.cancelFullScreen) {
            (doc).cancelFullScreen();
        } else if(doc.mozCancelFullScreen) {
            doc.mozCancelFullScreen();
        } else if(doc.webkitCancelFullScreen) {
            doc.webkitCancelFullScreen();
        }
    }

    public beforeFrameDraw(color:Color):void {}

    public afterFrameDraw(filters:AbstractFilter[]):void {}

    public destroy():void {
        globalThis.removeEventListener('resize',this.onResize);
    }

    public abstract getError():Optional<{code:number,desc:string}>;

    public abstract drawImage(img:Image):void;

    public abstract drawRectangle(rectangle:Rectangle):void;

    public abstract lockRect(rect:Rect):void;

    public abstract unlockRect():void;

    public abstract drawLine(line:Line):void;

    public abstract drawMesh(m:Mesh):void;

    public abstract drawEllipse(ellispe:Ellipse):void;

    public abstract drawTileMap(tileMap:TileMap):void;

    public abstract resetTransform():void;

    public abstract save():void;

    public abstract restore():void;

    public abstract translate(x:number,y:number,z?:number):void;

    public abstract scale(x:number,y:number,z?:number):void;

    public abstract rotateX(a:number):void;

    public abstract skewX(a:number):void;

    public abstract skewY(a:number):void;

    public abstract rotateY(a:number):void;

    public abstract rotateZ(a:number):void;

    public abstract killObject(r:RenderableModel):void;

    public log(...args:any[]):void {
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
            else if (txt instanceof HTMLElement) {
                txt = `[object ${txt.tagName}]`;
            }
            else if (txt.toJSON) {
                txt = JSON.stringify(txt.toJSON(),null,4);
            }
            else if (typeof txt==='function') {
                txt = txt.toString();
            }
            else {
                if (!(txt as string).substr) {
                    try{
                        txt = JSON.stringify(txt);
                    } catch (e){
                        if (txt.constructor && txt.constructor.name) txt = `[object ${txt.constructor.name}]`;
                        else txt = txt.toString();
                    }
                }
            }
            res+=`${txt}\n`;
        });
        textField.setText(textField.getText()+res);
        textField.onGeometryChanged();
        while (textField.size.height>this.game.height) {
            const strings:string[] = textField.getText().split('\n');
            strings.shift();
            textField.setText(strings.join('\n'));
            textField.onGeometryChanged();
        }
    }

    public clearLog():void {
        if (!DEBUG) return;
        if (!this.debugTextField) return;
        this.debugTextField.setText('');
    }

    public abstract createTexture(imgData:ArrayBuffer|string, link:ResourceLink<ITexture>, onLoaded:()=>void):void;

    public abstract getCachedTarget(l:ResourceLink<ITexture>):Optional<ITexture>;

    protected registerResize():void {
        this.onResize();
        globalThis.addEventListener('resize', () => {
            this.onResize();
            setTimeout(()=>this.onResize(),100);
        });
        // to prevent zoom on ios
        document.addEventListener('gesturestart', (e:Event)=>e.preventDefault());
        this.container.addEventListener('gesturestart', (e:Event)=>e.preventDefault());
    }

    protected onResize():void {
        const container:HTMLElement = this.container;

        const [innerWidth,innerHeight] = this.getScreenResolution();

        if (this.game.scaleStrategy===SCALE_STRATEGY.NO_SCALE) return;
        else if (this.game.scaleStrategy===SCALE_STRATEGY.STRETCH) {

            container.style.width = `${innerWidth}px`;
            container.style.height = `${innerHeight}px`;
            this.game.screenSize.setXY(innerWidth,innerHeight);
            this.game.scale.setXY(innerWidth/this.game.width,innerHeight/this.game.height);
            this.game.pos.setXY(0);
            return;
        }
        // else FIT
        const canvasRatio:number = this.game.height / this.game.width;
        const windowRatio:number = innerHeight / innerWidth;
        let width:number;
        let height:number;

        if (windowRatio < canvasRatio) {
            height = innerHeight;
            width = height / canvasRatio;
        } else {
            width = innerWidth;
            height = width * canvasRatio;
        }
        this.game.scale.setXY(width / this.game.width, height / this.game.height);
        this.game.pos.setXY(
            (innerWidth - width) / 2,
            (innerHeight - height) / 2
        );

        this.container.style.width = width + 'px';
        this.container.style.height = height + 'px';
        this.container.style.marginTop = `${this.game.pos.y}px`;
        this.game.screenSize.setXY(width,height);
    }

    private getScreenResolution():[number,number]{
        return [globalThis.innerWidth,globalThis.innerHeight];
    }
}