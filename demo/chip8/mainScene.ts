import {Scene} from "@engine/scene/scene";
import {Emulator} from "./emulator";
import {Game} from "@engine/core/game";
import {Image} from "@engine/renderable/impl/general/image";
import {DataTexture} from "@engine/renderer/webGl/base/dataTexture";
import {ResourceLink} from "@engine/resources/resourceLink";
import {KEYBOARD_EVENTS} from "@engine/control/keyboard/keyboardEvents";
import {KEYBOARD_KEY} from "@engine/control/keyboard/keyboardKeys";
import {ResourceLoader} from "@engine/resources/resourceLoader";

class EngineEmulator extends Emulator {

    private readonly img:Image;
    private texture:DataTexture;

    constructor(game:Game) {
        super(game);
        const t:DataTexture = new DataTexture(game,64,32);
        this.img = new Image(game,t);
        this.img.scale.setXY(10);
        this.img.setPixelPerfect(true);
        this.texture = t;
    }

    public getImage():Image{
        return this.img;
    }

    protected flipScreen(screen: (1|0)[][]): void {
        for (let y = 0; y < screen.length; y++) {
            const screenElement = screen[y];
            for (let x = 0; x < screenElement.length; x++) {
                const col = screen[y][x];
                if (col===1) this.texture.setRawPixelAt(x,y,255,155,155, 255);
                else this.texture.setRawPixelAt(x,y,0,0,0,255);
            }
        }
        this.texture.flush();
    }


}

export class MainScene extends Scene {

    private emulator:EngineEmulator;
    private rom:ArrayBuffer;


    constructor(protected game:Game, private romPath:string) {
        super(game);
    }

    public onPreloading(resourceLoader:ResourceLoader):void {
        super.onPreloading(resourceLoader);
        resourceLoader.addNextTask(async _=>{
            this.emulator = new EngineEmulator(this.game);
            this.rom = await resourceLoader.loadBinary(this.romPath);
        });

    }

    public onReady():void {
        this.appendChild(this.emulator.getImage());
        this.emulator.setRom(new Uint8Array(this.rom));


        const pressOfRelease = (code:number,pressed:boolean)=>{
            if (pressed) this.emulator.keyboard.press(code);
            else this.emulator.keyboard.release(code);
        };

        const keyFn = (code:number,pressed:boolean)=>{
            switch (code) {
                case KEYBOARD_KEY.DIGIT_1:
                    pressOfRelease(0x1,pressed);
                    break;
                case KEYBOARD_KEY.DIGIT_2:
                    pressOfRelease(0x2,pressed);
                    break;
                case KEYBOARD_KEY.DIGIT_3:
                    pressOfRelease(0x3,pressed);
                    break;
                case KEYBOARD_KEY.DIGIT_4:
                    pressOfRelease(0xC,pressed);
                    break;
                case KEYBOARD_KEY.Q:
                    pressOfRelease(0x4,pressed);
                    break;
                case KEYBOARD_KEY.W:
                    pressOfRelease(0x5,pressed);
                    break;
                case KEYBOARD_KEY.E:
                    pressOfRelease(0x6,pressed);
                    break;
                case KEYBOARD_KEY.R:
                    pressOfRelease(0xD,pressed);
                    break;
                case KEYBOARD_KEY.A:
                    pressOfRelease(0x7,pressed);
                    break;
                case KEYBOARD_KEY.S:
                    pressOfRelease(0x8,pressed);
                    break;
                case KEYBOARD_KEY.D:
                    pressOfRelease(0x9,pressed);
                    break;
                case KEYBOARD_KEY.F:
                    pressOfRelease(0xE,pressed);
                    break;
                case KEYBOARD_KEY.Z:
                    pressOfRelease(0xA,pressed);
                    break;
                case KEYBOARD_KEY.X:
                    pressOfRelease(0x0,pressed);
                    break;
                case KEYBOARD_KEY.C:
                    pressOfRelease(0xB,pressed);
                    break;
                case KEYBOARD_KEY.V:
                    pressOfRelease(0xF,pressed);
                    break;
                case KEYBOARD_KEY.ESC: {
                    this.game.popScene();
                    break;
                }
                default:
                    break;
            }
        };

        this.on(KEYBOARD_EVENTS.keyPressed, e=>{
            keyFn(e.key,true);
        });
        this.on(KEYBOARD_EVENTS.keyReleased, e=>{
            keyFn(e.key,false);
        });
        // this.on(MOUSE_EVENTS.click, ()=>{
        //     this.emulator.nextTick();
        // });
        // (window as any).emu = this.emulator;
    }

    protected onUpdate(): void {
        super.onUpdate();
        this.emulator.nextTick();
    }

}
