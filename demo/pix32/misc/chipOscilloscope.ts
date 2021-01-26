import {Sound} from "@engine/media/sound";
import {BasePix32Scene} from "../scenes/base/basePix32Scene";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {Game} from "@engine/core/game";
import {SimpleGameObjectContainer} from "@engine/renderable/impl/general/simpleGameObjectContainer";
import {Color} from "@engine/renderer/common/color";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {NoiseHorizontalFilter} from "@engine/renderer/webGl/filters/texture/noiseHorizontalFilter";
import {AbstractChipTrack} from "../ym-player/abstract/abstractChipTrack";

export class ChipOscilloscope {

    private indicatorA:RenderableModel;
    private indicatorB:RenderableModel;
    private indicatorC:RenderableModel;

    public constructor(private game:Game,private scene: BasePix32Scene) {

        const container = new SimpleGameObjectContainer(game);
        scene.topLayer.appendChild(container);
        container.pos.setXY(110,410);
        const f = new NoiseHorizontalFilter(this.game);
        container.filters = [f];

        const indicatorA = new Rectangle(game);
        indicatorA.size.setWH(1,10);
        indicatorA.fillColor = Color.fromCssLiteral('#21ec3e');
        container.appendChild(indicatorA);

        const indicatorB = new Rectangle(game);
        indicatorB.size.setWH(1,10);
        indicatorB.pos.setXY(0,10);
        indicatorB.fillColor = indicatorA.fillColor;
        container.appendChild(indicatorB);

        const indicatorC = new Rectangle(game);
        indicatorC.size.setWH(1,10);
        indicatorC.pos.setXY(0,20);
        indicatorC.fillColor = indicatorA.fillColor;
        container.appendChild(indicatorC);

        this.indicatorA = indicatorA;
        this.indicatorB = indicatorB;
        this.indicatorC = indicatorC;


    }

    public listen(sound:Sound,track:AbstractChipTrack):void{
        this.scene.setInterval((()=>{

            const time = sound.getCurrentTime();
            if (time===-1) return;
            const frame = track.getFrameSnapshotByTime(time);
            if (!frame) return;
            const periodA = (frame[1] & 0xF) << 8 | frame[0];
            const periodB = (frame[3] & 0xF) << 8 | frame[2];
            const periodC = (frame[5] & 0xF) << 8 | frame[4];

            let frA:number =  (1000000/(16*periodA)) || 1;
            let frB:number =  (1000000/(16*periodB)) || 1;
            let frC:number =  (1000000/(16*periodC)) || 1;
            if (Number.isNaN(frA)) frA = 1;
            if (Number.isNaN(frB)) frB = 1;
            if (Number.isNaN(frC)) frC = 1;
            if (frA===Infinity) frA = 1;
            if (frB===Infinity) frB = 1;
            if (frC===Infinity) frC = 1;

            this.indicatorA.size.width = frA;
            this.indicatorB.size.width = frB;
            this.indicatorC.size.width = frC;
        }),100);
    }

}
