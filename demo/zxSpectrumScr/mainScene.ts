import {Scene} from "@engine/scene/scene";
import {Image} from "@engine/renderable/impl/general/image";
import {WebGlRenderer} from "@engine/renderer/webGl/renderer/webGlRenderer";
import {ScrReader} from "./scrReader";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {BORDER, SCALE} from "./index";
import {Barrel2DistortionFilter} from "@engine/renderer/webGl/filters/texture/barrel2DistortionFilter";
import {CellsAppearingTransition} from "@engine/scene/transition/appear/cells/cellsAppearingTransition";
import {TaskQueue} from "@engine/resources/taskQueue";
import {CrtScreenFilter} from "@engine/renderer/webGl/filters/texture/crtScreenFilter";

const files =
    'AAA - AY Megademo 3 Menu (2019),Grongy - Retromaniac (2021),athena,brunilda,cauldron,dlair,example,Gauntlet,KValley,Phantis,test,wtss'.split(',').map(it=>`./zxSpectrumScr/files/${it}.scr`);
let ptr:number = 0;

export class MainScene extends Scene {

    private border:Image;
    private screen:Image;

    public override onPreloading(taskQueue:TaskQueue):void {
        (this.game.getRenderer() as WebGlRenderer).setPixelPerfect(true);
        let binary:ArrayBuffer;
        taskQueue.addNextTask(async progress=>{
            binary = await taskQueue.getLoader().loadBinary(files[ptr++],progress);
            if (ptr>files.length-1) ptr = 0;
        });
        taskQueue.addNextTask(async _=>{
            const reader = new ScrReader(this.game,binary);
            const {border,screen} = reader.textures;
            this.border = new Image(this.game,border);
            this.screen = new Image(this.game,screen);
            this.border.scale.setXY(SCALE);
            this.screen.pos.setXY(BORDER);
        });
        this.mouseEventHandler.once(MOUSE_EVENTS.click, ()=>{
            this.game.runScene(new MainScene(this.game),new CellsAppearingTransition(this.game));
        });
        this.filters = [new CrtScreenFilter(this.game)];
    }

    public override onReady():void {
        this.border.appendChild(this.screen);
        this.border.setPixelPerfect(true);
        this.screen.setPixelPerfect(true);
        this.appendChild(this.border);
    }

}



