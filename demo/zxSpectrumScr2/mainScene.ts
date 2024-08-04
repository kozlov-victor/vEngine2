import {Scene} from "@engine/scene/scene";
import {TaskQueue} from "@engine/resources/taskQueue";
import {ZxScreen} from "./screen";
import {TapePlayer} from "./tapePlayer";
import {KEYBOARD_KEY} from "@engine/control/keyboard/keyboardKeys";

const files =
    'AAA - AY Megademo 3 Menu (2019),Grongy - Retromaniac (2021),athena,brunilda,cauldron,dlair,example,Gauntlet,KValley,Phantis,test,wtss'.split(',').map(it=>`./zxSpectrumScr2/files/${it}.scr`);
let ptr:number = 0;

export class MainScene extends Scene {

    private screen:ZxScreen;
    private tapePlayer: TapePlayer;
    private bin:ArrayBuffer;

    public override onPreloading(taskQueue:TaskQueue):void {
        taskQueue.addNextTask(async progress=>{
            this.bin = await taskQueue.getLoader().loadBinary(files[ptr],progress);
        });
        this.keyboardEventHandler.onceKeyPressed(KEYBOARD_KEY.SPACE, ()=>{
            this.screen?.destroy();
            this.tapePlayer?.stop();
            ptr++;
            if (ptr===files.length) ptr = 0;
            this.game.runScene(new MainScene(this.game));
        });
    }

    public override async onReady() {
        this.keyboardEventHandler.onKeyPressed(KEYBOARD_KEY.F,()=>{
            this.game.getRenderer().requestFullScreen();
        });
        this.screen = new ZxScreen(this);
        await this.screen.testMemory();
        this.keyboardEventHandler.onceKeyPressed(KEYBOARD_KEY.ENTER, ()=>{
            this.tapePlayer = new TapePlayer(this.bin,this.screen);
            this.tapePlayer.start();
        });
    }

}



