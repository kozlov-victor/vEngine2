import {Optional} from "@engine/core/declarations";
import {ICubeMapTexture, ITexture} from "@engine/renderer/common/texture";
import {DebugError} from "@engine/debug/debugError";
import {Mesh2d} from "@engine/renderable/abstract/mesh2d";

export class Mesh3d extends Mesh2d {

    public texture:Optional<ITexture>;
    public cubeMapTexture:Optional<ICubeMapTexture>;
    public normalsTexture:Optional<ITexture>;
    public vertexItemSize:2|3 = 3;
    public colorMix:number = 0;// 0..1
    public reflectivity:number = 0;// 0..1
    public invertY:boolean = false;
    public specular:number = 0; // 0..1

    private _lightAccepted:Optional<boolean>;

    public acceptLight(val:boolean):void{
        this._lightAccepted = val;
    }

    public isLightAccepted():Optional<boolean>{
        return this._lightAccepted;
    }

    public transform(): void {
        super.transform();
        if (this.invertY) this.game.getRenderer().transformScale(1,-1,1);
    }

    public draw():void{
        this.game.getRenderer().drawMesh3d(this);
    }

    protected setClonedProperties(cloned: Mesh3d):void {
        super.setClonedProperties(cloned);
        cloned.texture = this.texture;
        cloned.cubeMapTexture = this.cubeMapTexture;
        cloned.normalsTexture = this.normalsTexture;
        cloned.colorMix = this.colorMix;
        cloned.specular = this.specular;
        cloned.reflectivity = this.reflectivity;
    }

}
