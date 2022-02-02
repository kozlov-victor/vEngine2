import {Scene} from "@engine/scene/scene";
import {FbxBinaryParser} from "@engine/renderable/impl/3d/fbxParser/fbxBinaryParser";
import {TrackBall} from "../model3dFromFbx/trackBall";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {ResourceLoader} from "@engine/resources/resourceLoader";
import {KEYBOARD_KEY} from "@engine/control/keyboard/keyboardKeys";
import {Resource} from "@engine/resources/resourceDecorators";
import {ITexture} from "@engine/renderer/common/texture";
import {DebugLayer} from "@engine/scene/debugLayer";
import {Layer} from "@engine/scene/layer";
import {IFbxParams} from "@engine/renderable/impl/3d/fbxParser/_internal/fbxAbstractParser";

export class MainScene extends Scene {


    private models:string[] = [
        'donut','test2','test3','test4',
        'redis','station','heart',
        'binary','BUTCHER','Can','heartglass','mouse','rocket',
        'rocket2','SM_chest','spitfire','tequila'
    ]
    private cnt:number = 0;
    private trackBall:TrackBall;
    private lastModel:RenderableModel;
    private loading:boolean = false;
    private debugLayer:DebugLayer;
    private workLayer:Layer;

    @Resource.Texture('./model3dFromFbx2/models/textures/TestTexture.png') private testTexture:ITexture;
    @Resource.Texture('./model3dFromFbx2/models/textures/donut1.png') private donutTexture:ITexture;
    @Resource.Texture('./model3dFromFbx2/models/textures/wings.png') private wingsTexture:ITexture;
    @Resource.Texture('./model3dFromFbx2/models/textures/5.png') private redis5Texture:ITexture;

    private async loadNextModel():Promise<void>{
        if (this.loading) return;
        this.debugLayer.println('loading...')
        this.loading = true;

        if (this.lastModel) {
            this.lastModel.removeSelf();
            this.lastModel.destroy();
        }

        const loader = new ResourceLoader(this.game);
        const buffer = await loader.loadBinary(`./model3dFromFbx2/models/${this.models[this.cnt]}.fbx`);

        const textureMap:Record<string, IFbxParams['textures']> = {
            test2: {
                TestTexture:{texture:this.testTexture}
            },
            donut: {
                donut1:{texture:this.donutTexture}
            },
            rocket2: {
                wings: {texture:this.wingsTexture}
            },
            redis: {
                5: {texture:this.redis5Texture},
            },
        }

        this.lastModel = new FbxBinaryParser(this.game,buffer,{
            textures: textureMap[this.models[this.cnt]]
        }).getModel();
        this.workLayer.appendChild(this.lastModel);
        this.lastModel.pos.setXY(300,300);
        this.lastModel.size.setWH(400,400);
        if (!this.trackBall) this.trackBall = new TrackBall(this,this.lastModel);
        else this.trackBall.setModel(this.lastModel);
        this.debugLayer.println(this.models[this.cnt]);

        this.cnt++;
        this.cnt%=this.models.length;

        this.loading = false;
    }

    public override async onReady():Promise<void> {
        this.workLayer = new Layer(this.game);
        this.appendChild(this.workLayer);
        this.debugLayer = new DebugLayer(this.game);
        await this.loadNextModel();
        this.appendChild(this.debugLayer);
        this.keyboardEventHandler.onKeyPressed(KEYBOARD_KEY.RIGHT, async _=>{
            await this.loadNextModel();
        });
    }

}
