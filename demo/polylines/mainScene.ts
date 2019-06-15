import {Scene} from "@engine/model/impl/general/scene";
import {Color} from "@engine/renderer/color";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable";
import {PolyLine} from "@engine/model/impl/geometry/polyLine";


export class MainScene extends Scene {



    public onPreloading() {

        const polyLine1:PolyLine = new PolyLine(this.game);
        polyLine1.pos.setXY(81,68);
        polyLine1.scale.setXY(1,-1);
        polyLine1.vectorScaleFactor = 5;
        polyLine1.color = Color.RGB(100,20,222);
        polyLine1.lineWidth = 2;

        polyLine1.setSvgPath(`
            M -3 9 L -1 10 L -1 11 L 0 12 L 1.5 11 L 1.5 7
            L -0.5 4 L -0.5 3 L 1 2
            L 8 2 L 10 5 L 9 -1 L 7 -4 L 1 -4 L -2 0
            L -2 4 L 0 7 L 0 9 L -3 9`
        );
        polyLine1.complete();
        polyLine1.setSvgPath(`M 1 1 L 7 1 L 7 -1 L 2 -3 L 1 1`);

        polyLine1.addBehaviour(new DraggableBehaviour(this.game));
        this.appendChild(polyLine1);


        const polyLine2:PolyLine = new PolyLine(this.game);
        polyLine2.pos.setXY(187,83);
        polyLine2.scale.setXY(1,-1);
        polyLine2.vectorScaleFactor = 5;
        polyLine2.color = Color.RGB(100,20,2);
        polyLine2.lineWidth = 2;

        polyLine2.setSvgPath(`
            M -9 5 L -7 5 L -6 6 L -5 6 L -4 7
            L -4 6 L -1 3 L 8 3 L 10 1 L 10 -4
            L 9 -5 L 9 -1 L 7 -7 L 5 -7 L 6 -6
            L 6 -4 L 5 -2 L 5 -1 L 3 -2 L 0 -1
            L -3 -2 L -3 -7 L -5 -7 L -4 -6 L -4 -1
            L -6 3 L -9 4 L -9 5`
        );
        polyLine2.complete();
        polyLine2.addBehaviour(new DraggableBehaviour(this.game));
        this.appendChild(polyLine2);

        const polyLine3:PolyLine = new PolyLine(this.game);
        polyLine3.pos.setXY(100,200);
        polyLine3.scale.setXY(1,-1);
        polyLine3.vectorScaleFactor = 5;
        polyLine3.color = Color.RGB(23,234,2);
        polyLine3.lineWidth = 2;

        polyLine3.setSvgPath(`
            M -10 -4 L -10 -3 L -7 6 L 1 6 L 8 2
            L 11 2 L 11 -4 L -10 -4`
        );
        polyLine3.complete();

        polyLine3.setSvgPath(`
            M -6 1 L -6 3 L -4 3 L -4 1 L -6 1`
        );
        polyLine3.complete();

        polyLine3.setSvgPath(`
            M -5 10 L -5 11 L -1 11 L -1 10`
        );
        polyLine3.complete();

        polyLine3.setSvgPath(`
            M -3 6 L -3 11`
        );
        polyLine3.complete();

        polyLine3.setSvgPath(`
            M -10 -2 L -5 -2 L -5 -4`
        );
        polyLine3.complete();

        polyLine3.setSvgPath(`
            M -10 -3 L -5 -3`
        );
        polyLine3.complete();
        polyLine3.addBehaviour(new DraggableBehaviour(this.game));
        this.appendChild(polyLine3);


        const polyLine4:PolyLine = new PolyLine(this.game);
        polyLine4.pos.setXY(18,27);
        polyLine4.lineWidth = 2;
        polyLine4.color = Color.RGB(12,2,233);
        polyLine4.setSvgPath(`
            M150 0 L75 200 L225 200 z`
        );
        polyLine4.complete();
        polyLine4.addBehaviour(new DraggableBehaviour(this.game));
        this.appendChild(polyLine4);



        const polyLine5:PolyLine = new PolyLine(this.game);
        polyLine5.pos.setXY(64,158);
        polyLine5.color = Color.RGB(234,12,34);
        polyLine5.lineWidth = 4;
        polyLine5.vectorScaleFactor = 0.2;

        polyLine5.setPoints(`50,375
                    150,375 150,325 250,325 250,375
                    350,375 350,250 450,250 450,375
                    550,375 550,175 650,175 650,375
                    750,375 750,100 850,100 850,375
                    950,375 950,25 1050,25 1050,375
                    1150,375`);
        polyLine5.addBehaviour(new DraggableBehaviour(this.game));
        this.appendChild(polyLine5);



        const polyLine6:PolyLine = new PolyLine(this.game);
        polyLine6.pos.setXY(135,-50);
        polyLine6.lineWidth = 2;
        polyLine6.color = Color.RGB(122,12,122);
        polyLine6.setPoints(`50,80 140,80 80,100 180,100 160,85 160,115 180,100`);
        polyLine6.addBehaviour(new DraggableBehaviour(this.game));
        this.appendChild(polyLine6);


        const polyLine7:PolyLine = new PolyLine(this.game);
        polyLine7.pos.setXY(135,50);
        polyLine7.lineWidth = 2;
        polyLine7.color = Color.RGB(8,12,22);
        polyLine7.setSvgPath('M 227 239 L 328 90 346 250 201 124 410 150 228 238');
        polyLine7.complete();
        polyLine7.setSvgPath('M10 80 C 40 10 65 10 95 80 S 150 150, 180 80');
        polyLine7.complete();
        polyLine7.vectorScaleFactor = 0.3;
        polyLine7.setSvgPath('m128.312484,137.498709l0,0c0,-11.572243 15.236309,-20.953398 34.031247,-20.953398l15.468757,0l0,0l74.250011,0l139.218731,0c9.025671,0 17.681646,2.20758 24.063757,6.137107c6.382072,3.929528 9.967509,9.259109 9.967509,14.816291l0,52.383502l0,0l0,31.430092l0,0c0,11.572249 -15.236299,20.953398 -34.031257,20.953398l-139.218731,0l-96.998477,53.279623l22.748466,-53.279623l-15.468757,0c-18.794938,0 -34.031247,-9.381149 -34.031247,-20.953398l0,0l0,-31.430092l0,0l-0.00001,-52.383502z');
        polyLine7.addBehaviour(new DraggableBehaviour(this.game));
        this.appendChild(polyLine7);
    }

    onProgress(val: number) {

    }

    onReady() {

    }

}
