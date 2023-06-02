import {VEngineTsxFactory} from "@engine/renderable/tsx/genetic/vEngineTsxFactory.h";
import {BaseTsxComponent} from "@engine/renderable/tsx/genetic/baseTsxComponent";
import {Game} from "@engine/core/game";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {ColorFactory} from "@engine/renderer/common/colorFactory";

export class BgMatrix extends BaseTsxComponent {

    private cellSize = 20;
    private numOfCellsX = ~~(Game.getInstance().width/this.cellSize)+1;
    private numOfCellsY = ~~(Game.getInstance().height/this.cellSize)+1;
    private refs:Rectangle[] = [];

    constructor() {
        super();
        this.nextTick();
    }

    private range(n:number):number[] {
        return new Array(n).fill(0).map((it,index)=>index);
    }

    private getRandomAlpha():number {
        return Math.random()>0.5?0.1:0.2
    }

    private nextTick() {
        this.refs.forEach(r=>{
            if (Math.random()>0.9) r.alpha = this.getRandomAlpha();
        });
        setTimeout(()=>{
            this.nextTick();
        },100);
    }

    render() {

        const cells:IPositionableProps[] = [];
        let cnt = 0;
        this.refs = [];
        this.range(this.numOfCellsY).forEach(y=>{
            this.range(this.numOfCellsX).forEach(x=>{
                cells.push(
                    <v_rectangle
                        ref={e=>{
                            if ((e as RenderableModel).alpha===1) {
                                (e as RenderableModel).alpha = 0;
                            }
                            this.refs.push(e as Rectangle)
                        }}
                        lineWidth={0}
                        fillColor={ColorFactory.fromCSS('#497607')}
                        size={{width:this.cellSize,height:this.cellSize}}
                        pos={{x:x*this.cellSize,y:y*this.cellSize}}
                    />);
                cnt++;
            });
        });

        return (
            <>
                {cells}
            </>
        );
    }

}
