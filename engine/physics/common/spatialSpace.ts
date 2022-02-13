import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {Game} from "@engine/core/game";
import {IRectJSON} from "@engine/geometry/rect";
import {Optional} from "@engine/core/declarations";
import {Color} from "@engine/renderer/common/color";
import {IRigidBody} from "@engine/physics/common/interfaces";

let cnt = 0;
const initialColor = Color.GREY.clone();
const activeColor = Color.from({r:90,g:255,b:90});

export class SpatialCell {
    public readonly id = cnt++;
    public debugView:Rectangle;
    public objects:IRigidBody[] = [];
}

export class SpatialSpace {

    private numOfCellsX:number;
    private numOfCellsY:number;

    private readonly cells:SpatialCell[] = [];

    public all:IRigidBody[] = [];

    constructor(private game:Game, private cellWith:number, private cellHeight:number, private spaceWidth:number, private spaceHeight:number) {
        this.numOfCellsX = ~~(spaceWidth / cellWith) + ((cellWith % spaceWidth)===0?0:1);
        this.numOfCellsY = ~~(spaceHeight / cellHeight) + ((cellHeight % spaceHeight)===0?0:1);
        const l = this.numOfCellsX*this.numOfCellsY;

        let x = 0;
        let y = 0;
        for (let i=0;i<l;i++) {
            const cell = new SpatialCell();
            cell.debugView = new Rectangle(game);
            cell.debugView.pos.setXY(x*cellWith,y*cellHeight);
            x++;
            if (x===this.numOfCellsX) {
                x = 0;
                y++;
            }
            cell.debugView.size.setWH(cellWith,cellHeight);
            cell.debugView.alpha = 0.1;
            cell.debugView.fillColor = initialColor;
            cell.debugView.passMouseEventsThrough = true;
            //game.getCurrentScene().appendChild(cell.debugView);
            this.cells.push(cell);
        }

        // const debugRect = new Rectangle(game);
        // debugRect.passMouseEventsThrough = true;
        // debugRect.alpha = 0.6;
        // debugRect.size.setWH(200,100);
        // game.getCurrentScene().appendChild(debugRect);
        // game.getCurrentScene().mouseEventHandler.on(MOUSE_EVENTS.mouseMove, e=>{
        //     this.debugClear();
        //     debugRect.pos.setXY(e.sceneX,e.sceneY);
        //     const cells = this.getCellsInRect({x:e.sceneX,y:e.sceneY,width:200,height:100});
        //     cells.forEach(c=>{
        //         c.debugView.fillColor = activeColor;
        //     });
        // });
    }

    private debugClear():void {
        this.cells.forEach(c=>{
            c.debugView.fillColor = initialColor;
        });
    }

    private getCellAtXY(x:number,y:number):Optional<SpatialCell> {
        const cellX:number = ~~(x / this.cellWith);
        if (cellX>=this.numOfCellsX) return undefined;
        const cellY:number = ~~(y / this.cellHeight);
        if (cellY>=this.numOfCellsY) return undefined;
        // index by x y: index = (y+1)*width - (width - x)
        const index = (cellY+1)*this.numOfCellsX - this.numOfCellsX + cellX;
        return this.cells[index];
    }

    public getCellsInRect(rect:IRectJSON,result:SpatialCell[]):void {
        const alreadyCheckedTiles:{[key:string]:boolean} = {};

        let x:number = rect.x,y:number;
        const maxX:number = rect.x+rect.width,
            maxY:number = rect.y+rect.height;
        // eslint-disable-next-line
        while (true) {
            y = rect.y;
            // eslint-disable-next-line
            while (true) {
                const cell = this.getCellAtXY(x,y);
                if (cell) {
                    if (!alreadyCheckedTiles[cell.id]) {
                        result.push(cell);
                        alreadyCheckedTiles[cell.id] = true;
                    }
                }
                if (y===maxY) break;
                y+=this.cellHeight;
                if (y>maxY) y = maxY;
            }
            if (x===maxX) break;
            x+=this.cellWith;
            if (x>maxX) x = maxX;
        }
    }

    public clear():void {
        this.all.length = 0;
        for (const c of this.cells) {
            c.objects.length = 0;
            c.debugView.fillColor = initialColor;
        }
    }

    public updateSpaceByObject(body:IRigidBody, rect:IRectJSON):void {
        this.all.push(body);
        body.spacialCellsOccupied.length = 0;
        this.getCellsInRect(rect,body.spacialCellsOccupied);
        for (const c of body.spacialCellsOccupied) {
            c.objects.push(body);
            c.debugView.fillColor = activeColor;
        }
    }

}
