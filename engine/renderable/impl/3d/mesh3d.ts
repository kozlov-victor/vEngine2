import {Optional} from "@engine/core/declarations";
import {ICubeMapTexture, ITexture} from "@engine/renderer/common/texture";
import {Mesh2d} from "@engine/renderable/abstract/mesh2d";
import {Game} from "@engine/core/game";
import {IPrimitive} from "@engine/renderer/webGl/primitives/abstractPrimitive";
import {BufferInfo} from "@engine/renderer/webGl/base/bufferInfo";

export abstract class Mesh3d extends Mesh2d {

    public texture:Optional<ITexture>;
    public cubeMapTexture:Optional<ICubeMapTexture>;
    public normalsTexture:Optional<ITexture>;
    public colorMix:number = 0;// 0..1
    public reflectivity:number = 0;// 0..1
    public invertY:boolean = false;
    public specular:number = 0; // 0..1

    private _lightAccepted:Optional<boolean>;

    protected constructor(game:Game,modelPrimitive:IPrimitive,bufferInfo?:BufferInfo) {
        super(game,modelPrimitive,bufferInfo);
    }

    public acceptLight(val:boolean):void{
        this._lightAccepted = val;
    }

    public isLightAccepted():Optional<boolean>{
        return this._lightAccepted;
    }

    public override transform(): void {
        super.transform();
        if (this.invertY) this.game.getRenderer().transformScale(1,-1,1);
    }

    public override draw():void{
        this.game.getRenderer().drawMesh3d(this);
    }

    public onUpdatingBuffers():void {}

    protected override setClonedProperties(cloned: Mesh3d):void {
        super.setClonedProperties(cloned);
        cloned.texture = this.texture;
        cloned.cubeMapTexture = this.cubeMapTexture;
        cloned.normalsTexture = this.normalsTexture;
        cloned.colorMix = this.colorMix;
        cloned.reflectivity = this.reflectivity;
        cloned.invertY = this.invertY;
        cloned.specular = this.specular;
    }

}
