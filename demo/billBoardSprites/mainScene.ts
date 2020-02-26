import {Scene} from "@engine/scene/scene";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {Color} from "@engine/renderer/common/color";
import {NullGameObject} from "@engine/renderable/impl/general/nullGameObject";
import {Circle} from "@engine/renderable/impl/geometry/circle";
import {MathEx} from "@engine/misc/mathEx";
import {VignetteFilter} from "@engine/renderer/webGl/filters/texture/vignetteFilter";
import {ResourceLink} from "@engine/resources/resourceLink";
import {ITexture} from "@engine/renderer/common/texture";
import {Image} from "@engine/renderable/impl/general/image";

export class MainScene extends Scene {


    private textureResourceLink:ResourceLink<ITexture>;

    public onPreloading() {
        this.textureResourceLink = this.resourceLoader.loadTexture('./assets/star.png');
        const rect = new Rectangle(this.game);
        (rect.fillColor as Color).setRGB(10,100,100);
        rect.size.height = 10;
        this.preloadingGameObject = rect;
    }

    public onProgress(val: number) {
        this.preloadingGameObject.size.width = val*this.game.size.width;
    }

    public onReady() {

        const container:NullGameObject = new NullGameObject(this.game);
        this.appendChild(container);
        container.pos.setXY(this.game.size.width/2,this.game.size.height/2);

        const image:Image = new Image(this.game);
        image.setResourceLink(this.textureResourceLink);
        container.appendChild(image);
        image.anchorPoint.setToCenter();
        image.transformPoint.setToCenter();
        image.billBoard = true;
        image.depthTest = true;


        const maxRadius:number = 250;
        for (let i:number=0;i<500;i++) {
            const billBoardObj = MathEx.random(0,1)>0.5?new Circle(this.game):new Rectangle(this.game);
            billBoardObj.billBoard = true;
            billBoardObj.depthTest = true;
            billBoardObj.fillColor = Color.RGB(MathEx.randomByte(0,122),MathEx.randomByte(12,22),MathEx.randomByte(0,255));
            billBoardObj.lineWidth = 2;
            billBoardObj.color = Color.RGB(MathEx.randomByte(0,255),MathEx.randomByte(0,255),MathEx.randomByte(0,255));

            const fi:number = MathEx.random(0,Math.PI*2);
            const theta:number = MathEx.random(0,Math.PI);
            const radius:number = maxRadius+MathEx.random(-40,10);

            // https://ru.wikipedia.org/wiki/%D0%A1%D1%84%D0%B5%D1%80%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B0%D1%8F_%D1%81%D0%B8%D1%81%D1%82%D0%B5%D0%BC%D0%B0_%D0%BA%D0%BE%D0%BE%D1%80%D0%B4%D0%B8%D0%BD%D0%B0%D1%82
            const x:number = radius*Math.cos(fi)*Math.sin(theta);
            const y:number = radius*Math.sin(fi)*Math.sin(theta);
            const z:number = radius*Math.cos(theta);

            billBoardObj.pos.setXY(x,y);
            billBoardObj.posZ = z;
            container.appendChild(billBoardObj);
        }
        this.setInterval(()=>{
            container.angle3d.x+=0.01;
            container.angle3d.y+=0.01;
            container.angle3d.z+=0.01;
        },1);

        const filter1 = new VignetteFilter(this.game);
        this.filters = [filter1];

    }

}
