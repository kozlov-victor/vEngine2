
import {DebugError} from "@engine/debug/debugError";
import {Game} from "@engine/game";
import {Texture} from "@engine/renderer/webGl/base/texture";
import {ResourceLink} from "@engine/resources/resourceLink";
import {WebGlRenderer} from "@engine/renderer/webGl/webGlRenderer";
export class PbmReader {

    private currentPos:number = 0;
    private file:Int8Array;

    constructor(private game:Game,buff:ArrayBuffer){
        this.file = new Int8Array(buff);
    }

    private isEOF():boolean{
        return this.currentPos==this.file.length;
    }

    private getNextByte():number{
        if (this.isEOF()) throw new DebugError('unexpected and of file');
        return this.file[this.currentPos++];
    }

    private getNextChar():string{
        return String.fromCharCode(this.getNextByte());
    }

    private skipNextChar(charAs:string):void{
        const char:string = this.getNextChar();
        if (char!==charAs) throw new DebugError(`unexpected char ${char}, expected ${charAs}`)
    }

    private skipNewLine():void{
        this.skipNextChar('\n');
    }

    private showNextChar():string{
        const char:string = this.getNextChar();
        this.currentPos--;
        return char;
    }

    private readNextString(l:number):string {
        let res:string = '';
        for (let i:number=0;i<l;i++){
            res+=this.getNextChar();
        }
        return res;
    }

    private readNextLine():string{
        return this.readNextStringUntil(['\n']);
    }

    private readNextStringUntil(charsUntil:string[]):string{
        let res:string = '';
        for (;;){
            const char:string = this.getNextChar();
            if (charsUntil.indexOf(char)>-1) break;
            res+=char;
        }
        return res;
    }

    private readNextIntUntil(charsUntil:string[]):number{
         const str:string = this.readNextStringUntil(charsUntil);
         const num:number = parseInt(str);
         if (isNaN(num)) throw new DebugError(`can not read number: wrong character sequence '${str}'`);
         return num;
    }


    private charAsBits(char:string):number[]{
        const code:number = char.charCodeAt(0);
        const arr:number[] = [];
        for (let i:number=7;i>=0;i--){
            const powOfTwo:number = Math.pow(2,i);
            arr.push((code & powOfTwo)>0?1:0);
        }
        return arr;
    }

    private read():{width:number,height:number,data:number[]}{
        const header:string = this.readNextString(2);
        if (header!=='P4') throw new DebugError('only P4 headers are supported');
        this.skipNewLine();
        if (this.showNextChar()==='#') {
            this.readNextLine();
        }
        const width:number = this.readNextIntUntil([' ']);
        const height:number = this.readNextIntUntil([' ','\n']);

        const desiredSize:number = width*height*4;
        const data:number[] = new Array(desiredSize);
        data.fill(255);
        let i:number = 0;
        while (!this.isEOF()) {
            const char:string = this.getNextChar();
            const bits:number[] = this.charAsBits(char);
            for (const bit of bits) {
                if (bit===0) {
                    data[i++]=100;
                    data[i++]=255;
                    data[i++]=255;
                    data[i++]=255;
                }
                else {
                    data[i++]=0;
                    data[i++]=33;
                    data[i++]=0;
                    data[i++]=255;
                }
            }

        }
        return {width,height,data}
    }

    createTextureLink():ResourceLink<Texture>{
        const renderer:WebGlRenderer = this.game.getRenderer() as WebGlRenderer;
        const gl:WebGLRenderingContext = renderer.getNativeContext();
        const t:Texture = new Texture(gl);

        const link:ResourceLink<Texture> = new ResourceLink<Texture>('url'+Math.random()+'_'+Math.random());
        renderer.putToCache(link,t);

        const bitmap = this.read();

        t.setRawData(new Uint8Array(bitmap.data),bitmap.width,bitmap.height);
        link.setTarget(t);
        return link;
    }

}