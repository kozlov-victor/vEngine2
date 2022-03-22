import {Scene} from "@engine/scene/scene";
import {TrackBall} from "../model3dFromFbx/trackBall";
import {ResourceLoader} from "@engine/resources/resourceLoader";
import {KEYBOARD_KEY} from "@engine/control/keyboard/keyboardKeys";
import {FbxAsciiParser} from "@engine/renderable/impl/3d/fbxParser/fbxAsciiParser";
import {KEYBOARD_EVENTS} from "@engine/control/abstract/keyboardEvents";
import {ICubeMapTexture} from "@engine/renderer/common/texture";
import {Resource} from "@engine/resources/resourceDecorators";
import {FbxModelWrapper} from "@engine/renderable/impl/3d/fbxParser/_internal/fbxNodes";

export class MainScene extends Scene {

    @Resource.CubeTexture(
        './cubeMapTexture/textures/cm_left.jpg',
        './cubeMapTexture/textures/cm_right.jpg',
        './cubeMapTexture/textures/cm_top.jpg',
        './cubeMapTexture/textures/cm_bottom.jpg',
        './cubeMapTexture/textures/cm_front.jpg',
        './cubeMapTexture/textures/cm_back.jpg'
    )
    private cubeTexture:ICubeMapTexture;

    private models:string[] = [
        'test_cinema_4d','test1'
    ]
    private cnt:number = 0;
    private trackBall:TrackBall;
    private lastModel:FbxModelWrapper;
    private loading:boolean = false;

    private async loadNextModel():Promise<void>{
        if (this.loading) return;
        this.loading = true;

        this.cnt%=this.models.length;

        if (this.lastModel) {
            this.lastModel.removeSelf();
            this.lastModel.destroy();
        }

        const loader = new ResourceLoader(this.game);
        console.log(this.models[this.cnt]);
        const textData = await loader.loadText(`./model3dFromFbx3/models/${this.models[this.cnt]}.fbx`);


        const parser = new FbxAsciiParser(this.game,textData,{
            textures: {
                base_color_texture:{
                    texture: undefined!,
                    type: 'color'
                }
            }
        });
        this.lastModel = await parser.getModel();
        this.appendChild(this.lastModel);
        this.lastModel.pos.setXY(300,300);
        this.lastModel.size.setWH(400,400);
        this.lastModel.getMeshes().forEach(m=>{
            m.material.reflectivity = 0.05;
            m.cubeMapTexture = this.cubeTexture;
        });
        if (!this.trackBall) this.trackBall = new TrackBall(this,this.lastModel);
        else this.trackBall.setModel(this.lastModel);
        console.log(this.lastModel);
        this.cnt++;

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
