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

    @Resource.Text(`./${base}/assets/models/engine/engine.obj`)
    public dataEngine:string;

    @Resource.Text(`./${base}/assets/models/engine/engine.mtl`)
    public dataEngineMaterial:string;

    @Resource.Text(`./${base}/assets/models/submarine/submarine.obj`)
    public dataSubmarine:string;

    @Resource.Text(`./${base}/assets/models/submarine/submarine.mtl`)
    public dataSubmarineMaterial:string;

    @Resource.Text(`./${base}/assets/models/submarine2/submarine2.obj`)
    public dataSubmarine2:string;

    @Resource.Text(`./${base}/assets/models/submarine2/submarine2.mtl`)
    public dataSubmarine2Material:string;

    @Resource.Text(`./${base}/assets/models/spinner/spinner.obj`)
    public dataSpinner:string;

    @Resource.Text(`./${base}/assets/models/spinner/spinner.mtl`)
    public dataSpinnerMaterial:string;

    // pack 1

    @Resource.Texture(`./${base}/assets/images/pack1/bg1.png`)
    public pack1bg1:ITexture;

    @Resource.Texture(`./${base}/assets/images/pack1/bg2.png`)
    public pack1bg2:ITexture;

    @Resource.Texture(`./${base}/assets/images/pack1/bg3.png`)
    public pack1bg3:ITexture;

    // pack 2

    @Resource.Texture(`./${base}/assets/images/pack2/cloud.png`)
    public cloud:ITexture;

    // pack 3

    @Resource.Texture(`./${base}/assets/images/pack3/bg2.png`)
    public pack3bg2:ITexture;


    // pack 4

    @Resource.Texture(`./${base}/assets/images/pack4/bg1.png`)
    public pack4bg1:ITexture;

    @Resource.Texture(`./${base}/assets/images/pack4/bg2.png`)
    public pack4bg2:ITexture;


}
