import {Scene} from "@engine/scene/scene";
import {Emulator} from "./emulator";
import {Game} from "@engine/core/game";
import {Image} from "@engine/renderable/impl/geometry/image";
import {DataTexture} from "@engine/renderer/webGl/base/dataTexture";
import {ResourceLink} from "@engine/resources/resourceLink";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";

class EngineEmulator extends Emulator {

    private readonly img:Image;
    private texture:DataTexture;

    constructor(game:Game) {
        super(game);
        this.img = new Image(game);
        const t:DataTexture = new DataTexture(game,64,32);
        this.texture = t;
        this.img.setResourceLink(t.getLink());
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
    private rom:ResourceLink<ArrayBuffer>;

    public onPreloading() {
        this.emulator = new EngineEmulator(this.game);
        this.rom = this.resourceLoader.loadBinary('./chip8/roms/Hello.ch8');
    }

    public onReady() {
        this.appendChild(this.emulator.getImage());
        this.emulator.setRom(new Uint8Array(this.rom.getTarget()));
        this.on(MOUSE_EVENTS.click, ()=>{
            this.emulator.nextTick();
        });
    }

    protected onUpdate(): void {
        super.onUpdate();
        //this.emulator.nextTick();
    }

}
