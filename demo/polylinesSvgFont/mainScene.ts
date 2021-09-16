import {Scene} from "@engine/scene/scene";
import {DrawingSurface} from "@engine/renderable/impl/surface/drawingSurface";
import {ResourceLoader} from "@engine/resources/resourceLoader";
import {XmlParser} from "@engine/misc/xml/xmlParser";
import {Polygon} from "@engine/renderable/impl/geometry/polygon";
import {EvenOddCompositionFilter} from "@engine/renderer/webGl/filters/composition/evenOddCompositionFilter";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable";


export class MainScene extends Scene {


    public override async onReady():Promise<void> {
        const drawingSurface = new DrawingSurface(this.game,this.game.size);
        drawingSurface.addBehaviour(new DraggableBehaviour(this.game));
        drawingSurface.setPixelPerfect(true);
        this.appendChild(drawingSurface);
        const xmlRaw = await new ResourceLoader(this.game).loadText('./polylinesSvgFont/zx.svg');
        const document = new XmlParser(xmlRaw).getTree();

        const string = '-=hello svg fonts world, WOW@%=-';
        let posX = 0;
        const scale = 0.05;

        const hexEntityToStr = (str:string = ''):string=>{
            if (str.indexOf('&#x')===0) {
                str = str.replace('&#x','');
                return String.fromCharCode(Number.parseInt(str,16));
            } else {
                return str;
            }
        }

        string.split('').forEach(c=>{
            if (c===' ') {
                posX+=25;
                return;
            }
            const node = document.getElementsByTagName('glyph').find(it=>hexEntityToStr(it.getAttribute('unicode'))===c);
            if (!node) return;
            const path = node.getAttribute('d');
            if (!path) return;
            const polygons = Polygon.fromMultiCurveSvgPath(this.game,path);
            if (!polygons.length) return;
            polygons.forEach(p=>{
                p.scale.setXY(0.05,-0.05);
                p.pos.x = posX;
                p.pos.y = 400;
                p.filters = [new EvenOddCompositionFilter(this.game)];
                drawingSurface.drawModel(p);
            });
            posX+=polygons[0].size.width*scale;
        });

    }

}
