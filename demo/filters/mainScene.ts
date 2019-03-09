import {Scene} from "@engine/model/impl/scene";
import {GameObject} from "@engine/model/impl/gameObject";
import {SpriteSheet} from "@engine/model/impl/spriteSheet";
import {ResourceLink} from "@engine/core/resources/resourceLink";
import {Color} from "@engine/core/renderer/color";
import {BlackWhiteFilter} from "@engine/core/renderer/webGl/filters/textureFilters/blackWhiteFilter";
import {WebGlRenderer} from "@engine/core/renderer/webGl/webGlRenderer";
import {ColorizeFilter} from "@engine/core/renderer/webGl/filters/textureFilters/colorizeFilter";
import {PixelFilter} from "@engine/core/renderer/webGl/filters/textureFilters/pixelFilter";
import {PosterizeFilter} from "@engine/core/renderer/webGl/filters/textureFilters/posterizeFilter";
import {SimpleBlurFilter} from "@engine/core/renderer/webGl/filters/textureFilters/simpleBlurFilter";


export class MainScene extends Scene {

    private logoObj:GameObject;
    private logoLink:ResourceLink;

    onPreloading() {
        this.logoLink = this.resourceLoader.loadImage('../assets/logo.png');
    }



    onReady() {
        console.log('ready');
        this.logoObj = new GameObject(this.game);
        let spr:SpriteSheet = new SpriteSheet(this.game);
        spr.setResourceLink(this.logoLink);
        this.logoObj.spriteSheet = spr;
        this.logoObj.pos.fromJSON({x:10,y:10});
        this.appendChild(this.logoObj);

        const bw:BlackWhiteFilter = new BlackWhiteFilter((this.game.getRenderer() as WebGlRenderer)['gl']);

        const cl:ColorizeFilter = new ColorizeFilter((this.game.getRenderer() as WebGlRenderer)['gl']);
        cl.setColor(Color.RGB(0,200,23,122));

        const pf:PixelFilter = new PixelFilter((this.game.getRenderer() as WebGlRenderer)['gl']);

        const ps:PosterizeFilter = new PosterizeFilter((this.game.getRenderer() as WebGlRenderer)['gl']);

        const sb:SimpleBlurFilter = new SimpleBlurFilter((this.game.getRenderer() as WebGlRenderer)['gl']);
        sb.setSize(1);

        this.logoObj.spriteSheet.filters = [
            cl,
            bw,
            pf,
            ps,
            //sb,
        ];
        (window as any).logoObj = this.logoObj;


        // const circle:Circle = new Circle(this.game);
        // circle.radius = 40;
        // circle.center.setXY(50,50);
        // circle.color = Color.RGB(30,40,55);
        // circle.lineWidth = 2;
        // circle.color = Color.RGB(0,100,12);
        // this.appendChild(circle);
        // circle.filters = [cl,
        //     bw,
        //     pf,
        //     ps,
        //     sb];

        //this.filters.push(bw);
    }

}
