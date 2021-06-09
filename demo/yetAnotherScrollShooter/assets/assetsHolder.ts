import {ResourceAutoHolder} from "@engine/resources/resourceAutoHolder";
import {Resource} from "@engine/resources/resourceDecorators";
import {ITexture} from "@engine/renderer/common/texture";

const base = 'yetAnotherScrollShooter';

export class AssetsHolder extends ResourceAutoHolder {

    @Resource.Text(`./${base}/assets/models/mainShip/mainShip.obj`)
    public dataMainShip:string;

    @Resource.Text(`./${base}/assets/models/mainShip/mainShip.mtl`)
    public dataMainShipMaterial:string;

    @Resource.Text(`./${base}/assets/models/rocket/rocket.obj`)
    public dataRocket:string;

    @Resource.Text(`./${base}/assets/models/rocket/rocket.mtl`)
    public dataRocketMaterial:string;

    @Resource.Text(`./${base}/assets/models/bomb/bomb.obj`)
    public dataBomb:string;

    @Resource.Text(`./${base}/assets/models/bomb/bomb.mtl`)
    public dataBombMaterial:string;

    @Resource.Text(`./${base}/assets/models/stone/stone.obj`)
    public dataStone:string;

    @Resource.Text(`./${base}/assets/models/stone/stone.mtl`)
    public dataStoneMaterial:string;

    @Resource.Text(`./${base}/assets/models/ring/ring.obj`)
    public dataRing:string;

    @Resource.Text(`./${base}/assets/models/ring/ring.mtl`)
    public dataRingMaterial:string;

    // pack 1

    @Resource.Texture(`./${base}/assets/images/pack1/bg1.png`)
    public pack1bg1:ITexture;

    @Resource.Texture(`./${base}/assets/images/pack1/bg2.png`)
    public pack1bg2:ITexture;

    @Resource.Texture(`./${base}/assets/images/pack1/bg3.png`)
    public pack1bg3:ITexture;

    // pack 2
    @Resource.Texture(`./${base}/assets/images/pack2/bg1.png`)
    public pack2bg1:ITexture;

    @Resource.Texture(`./${base}/assets/images/pack2/cloud.png`)
    public cloud:ITexture;

}
