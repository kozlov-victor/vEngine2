import {Optional} from "@engine/core/declarations";
import {ICubeMapTexture, ITexture} from "@engine/renderer/common/texture";
import {Mesh2d} from "@engine/renderable/abstract/mesh2d";
import {Game} from "@engine/core/game";
import {IPrimitive} from "@engine/renderer/webGl/primitives/abstractPrimitive";
import {BufferInfo} from "@engine/renderer/webGl/base/bufferInfo";
import {MeshMaterial} from "@engine/renderable/impl/3d/meshMaterial";

export abstract class Mesh3d extends Mesh2d {

    public declare fillColor:never;

    public texture:Optional<ITexture>;
    public cubeMapTexture:Optional<ICubeMapTexture>;
    public normalsTexture:Optional<ITexture>;
    public specularTexture:Optional<ITexture>;
    public invertY:boolean = false;

    public material:MeshMaterial = new MeshMaterial();

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

    public override _transform(): void {
        super._transform();
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
        cloned.specularTexture = this.specularTexture;
        cloned.material = this.material.clone();
        cloned.invertY = this.invertY;
    }

}
