import {Scene} from "@engine/scene/scene";
import {FbxBinaryParser} from "@engine/renderable/impl/3d/fbxParser/fbxBinaryParser";
import {TrackBall} from "../model3dFromFbx/trackBall";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {ResourceLoader} from "@engine/resources/resourceLoader";
import {KEYBOARD_EVENTS} from "@engine/control/keyboard/keyboardEvents";
import {KEYBOARD_KEY} from "@engine/control/keyboard/keyboardKeys";


export class MainScene extends Scene {

    // 'heart'
    // test1 - test format

    private models:string[] = [
        'binary','BUTCHER','Can','heartglass','mouse','rocket',
        'rocket2','SM_chest','spitfire','tequila',
    ]
    private cnt:number = 0;
    private trackBall:TrackBall;
    private lastModel:RenderableModel;
    private loading:boolean = false;


    private async loadNextModel():Promise<void>{
        if (this.loading) return;
        this.loading = true;

        if (this.lastModel) {
            this.lastModel.removeSelf();
            this.lastModel.destroy();
        }
        const loader = new ResourceLoader(this.game);
        console.log(this.models[this.cnt]);
        const buffer = await loader.loadBinary(`./model3dFromFbx2/models/${this.models[this.cnt]}.fbx`);
        this.cnt++;
        this.cnt%=this.models.length;
        this.lastModel = new FbxBinaryParser(this.game,buffer).getModel();
        this.appendChild(this.lastModel);
        this.lastModel.pos.setXY(300,300);
        this.lastModel.size.setWH(400,400);
        if (!this.trackBall) this.trackBall = new TrackBall(this,this.lastModel);
        else this.trackBall.setModel(this.lastModel);

        this.loading = false;
    }

    public override async onReady():Promise<void> {
        await this.loadNextModel();
        this.keyboardEventHandler.on(KEYBOARD_EVENTS.keyPressed, async e=>{
            if (e.button===KEYBOARD_KEY.RIGHT) {
                await this.loadNextModel();
            }
        });
    }

}
