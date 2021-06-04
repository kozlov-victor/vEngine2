import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {Scene} from "@engine/scene/scene";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {SpriterObject} from "../scml/scml";
import {Sound} from "@engine/media/sound";
import {WaveFilter} from "@engine/renderer/webGl/filters/texture/waveFilter";
import {Resource} from "@engine/resources/resourceDecorators";
import {TaskQueue} from "@engine/resources/taskQueue";


export class MainScene extends Scene {

    private player:SpriterObject;

    @Resource.Sound('./moonAnimation/moon_sound.wav')
    private sound:Sound;

    public override async onPreloading(taskQueue:TaskQueue):Promise<void> {
        const rect = new Rectangle(this.game);
        rect.fillColor.setRGB(10,100,100);
        rect.size.height = 10;
        this.preloadingGameObject = rect;
        taskQueue.addNextTask(async progress=>{
            this.player =
                await SpriterObject.create(
                    this.game,taskQueue,
                    {url:'./moonAnimation/moon/moon.scon',headers:[{name:'test-header',value:'nonsense'}],responseType:'text'}
                );
        });
    }

    public override onProgress(val: number):void {
        this.preloadingGameObject.size.width = val*this.game.size.width;
    }

    public override onReady():void {

        this.sound.play();
        this.appendChild(this.player);
        this.player.pos.setXY(this.game.size.width/2,this.game.size.height/2+40);

        this.mouseEventHandler.on(MOUSE_EVENTS.click, ()=>{
            this.sound.play();
            this.player.nextAnimation();
        });

        this.filters = [new WaveFilter(this.game)];

    }

}
