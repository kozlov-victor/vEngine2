import {Scene} from "@engine/scene/scene";
import {ResourceLink} from "@engine/resources/resourceLink";
import {ITexture} from "@engine/renderer/common/texture";
import {KernelBlurAccumulativeFilter} from "@engine/renderer/webGl/filters/accumulative/kernelBlurAccumulativeFilter";
import {DrawingSurface} from "@engine/renderable/impl/surface/drawingSurface";
import {Color} from "@engine/renderer/common/color";
import {WebGlRenderer} from "@engine/renderer/webGl/webGlRenderer";
import {MathEx} from "@engine/misc/mathEx";
import {Tween} from "@engine/animation/tween";
import {NoiseHorizontalFilter} from "@engine/renderer/webGl/filters/texture/noiseHorizontalFilter";

// inspired by https://m.habr.com/ru/post/482826/
export class MainScene extends Scene {

    private logoLink:ResourceLink<ITexture>;

    public onPreloading():void {
        this.logoLink = this.resourceLoader.loadTexture('./assets/logo.png');
    }


    public onReady():void {
        this.backgroundColor.setRGB(0,0,0);
        const surface = new DrawingSurface(this.game,this.game.size);
        surface.setLineWidth(2);
        surface.setDrawColor(Color.RGB(244,0,0).asRGBNumeric());
        surface.moveTo(30,39);
        surface.lineTo(128,238);
        surface.lineTo(246,38);
        surface.lineTo(7,135);
        surface.lineTo(281,153);
        surface.lineTo(30,39);
        const blurAccumulativeFilter = new KernelBlurAccumulativeFilter(this.game);
        blurAccumulativeFilter.setNoiseIntensity(10);
        surface.filters = [new NoiseHorizontalFilter(this.game),blurAccumulativeFilter, ];
        this.game.getRenderer<WebGlRenderer>().setPixelPerfect(true);
        this.appendChild(surface);
        surface.transformPoint.setToCenter();

        this.setInterval(()=>{
            const xx = MathEx.random(30,50);
            const yy = MathEx.random(0,10);
            blurAccumulativeFilter.setKernel([
                0 ,10,0 ,
                10,yy,10,
                xx ,10,xx
            ]);
        },500);
        this.addTween(
            new Tween({
                target: surface.pos,
                from: {x:15},
                to: {x: 25},
                time: 1500,
                loop: true,
                yoyo: true,
        }));
        this.addTween(
            new Tween({
                target: surface.pos,
                from: {y:-10},
                to: {y: 10},
                time: 2500,
                loop: true,
                yoyo: true,
            }));
    }

}
