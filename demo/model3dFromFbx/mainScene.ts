import {Scene} from "@engine/scene/scene";
import {Resource} from "@engine/resources/resourceDecorators";
import {FbxBinaryParser} from "@engine/renderable/impl/3d/fbxParser/fbxBinaryParser";
import {ITexture} from "@engine/renderer/common/texture";
import {TrackBall} from "./trackBall";

// https://sketchfab.com/3d-models/generator-4b50a06663fe44079503ca53f7eb399f

export class MainScene extends Scene {

    @Resource.Binary('./model3dFromFbx/models/generator.fbx') public dataBuff:ArrayBuffer;
    @Resource.Texture('./model3dFromFbx/models/textures/generator/generatorColor.png') public generatorColor:ITexture;
    @Resource.Texture('./model3dFromFbx/models/textures/generator/generatorNormal.png') public generatorNormal:ITexture;
    @Resource.Texture('./model3dFromFbx/models/textures/generator/generatorSpecular.png') public generatorSpecular:ITexture;

    public override async onReady() {

        const parser = new FbxBinaryParser(
            this.game,this.dataBuff,
            {
                textures: {
                    generatorColor: [{texture:this.generatorColor},{texture:this.generatorSpecular,type:'specular'}],
                    generatorNormal: {texture:this.generatorNormal,type:'normals'},
                }
            }
        );
        const model = await parser.getModel();
        this.appendChild(model);
        model.pos.setXY(300,300);
        model.size.setWH(400,400);
        model.scale.setXYZ(0.2);

        const trackBall = new TrackBall(this,model);

    }

}
