import {Scene} from "@engine/scene/scene";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {Color} from "@engine/renderer/common/color";
import {SimpleGameObjectContainer} from "@engine/renderable/impl/general/simpleGameObjectContainer";
import {MathEx} from "@engine/misc/math/mathEx";
import {VignetteFilter} from "@engine/renderer/webGl/filters/texture/vignetteFilter";
import {ITexture} from "@engine/renderer/common/texture";
import {Image} from "@engine/renderable/impl/general/image/image";
import {Resource} from "@engine/resources/resourceDecorators";

export class MainScene extends Scene {

    @Resource.Texture('./assets/star.png')
    public readonly textureResource:ITexture;


    public override onReady():void {

        const container:SimpleGameObjectContainer = new SimpleGameObjectContainer(this.game);
        this.appendChild(container);
        container.pos.setXY(this.game.size.width/2,this.game.size.height/2);

        const image:Image = new Image(this.game,this.textureResource);
        container.appendChild(image);
        image.anchorPoint.setToCenter();
        image.transformPoint.setToCenter();
        image.billBoard = true;
        image.depthTest = true;


        const maxRadius:number = 250;
        for (let i:number=0;i<5000;i++) {
            const billBoardObj = new Rectangle(this.game);
            billBoardObj.billBoard = true;
            billBoardObj.depthTest = true;
            billBoardObj.fillColor = Color.RGB(MathEx.randomUint8(0,122),MathEx.randomUint8(12,22),MathEx.randomUint8(0,255));
            billBoardObj.lineWidth = 2;
            billBoardObj.color = Color.RGB(MathEx.randomUint8(0,255),MathEx.randomUint8(0,255),MathEx.randomUint8(0,255));

            const fi:number = MathEx.random(0,Math.PI*2);
            const theta:number = MathEx.random(0,Math.PI);
            const radius:number = maxRadius+MathEx.random(-40,10);

            // https://ru.wikipedia.org/wiki/%D0%A1%D1%84%D0%B5%D1%80%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B0%D1%8F_%D1%81%D0%B8%D1%81%D1%82%D0%B5%D0%BC%D0%B0_%D0%BA%D0%BE%D0%BE%D1%80%D0%B4%D0%B8%D0%BD%D0%B0%D1%82
            const x:number = radius*Math.cos(fi)*Math.sin(theta);
            const y:number = radius*Math.sin(fi)*Math.sin(theta);
            const z:number = radius*Math.cos(theta);

            billBoardObj.pos.setXYZ(x,y,z);
            container.appendChild(billBoardObj);
        }
        this.setInterval(()=>{
            container.angle3d.x+=0.001;
            container.angle3d.y+=0.001;
            container.angle3d.z+=0.001;
        },1);

        const filter1 = new VignetteFilter(this.game);
        this.filters = [filter1];

    }

}
