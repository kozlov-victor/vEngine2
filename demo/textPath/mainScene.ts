import {Scene} from "@engine/scene/scene";
import {Resource} from "@engine/resources/resourceDecorators";
import {Font} from "@engine/renderable/impl/general/font/font";
import {TextPath} from "@engine/renderable/impl/ui/textField/textPath/TextPath";
import {PolyLine} from "@engine/renderable/impl/geometry/polyLine";
import {Tween} from "@engine/animation/tween";

export class MainScene extends Scene {

    @Resource.FontFromCssDescription({fontFamily:'monospace',fontSize:35})
    private fnt:Font;

    public override onReady():void {

        const polyline = PolyLine.fromSvgPath(this.game,'M19.75,99.82c16.41-13.24,33.44-26.8,53.74-32.49s44.94-1.46,57.31,15.61\n' +
            '\tc5.3,7.31,7.9,16.23,9.43,25.13c2.62,15.16,2.42,30.74,5.63,45.78s10.65,30.25,24.13,37.66c12.9,7.1,28.7,5.77,43.16,2.99\n' +
            '\tc64.35-12.37,123.37-50.54,161.05-104.15');

        //const polyline = PolyLine.fromSvgPath(this.game,'M 10 10 V 400');

        const textPath = new TextPath(this.game,"123 456 long text by path",this.fnt,polyline);
        textPath.fillColor.fromCSS('#313bc3');
        this.appendChild(textPath);
        this.appendChild(polyline);

        const tweenObj = {offset:0};
        this.addTween(new Tween(this.game,{
            target: tweenObj,
            from: {offset: -500},
            to:  {offset: 500},
            loop: true,
            yoyo: true,
            progress:it=>{
                textPath.offset = it.offset;
            },
            time: 5000,
        }));

    }

}
