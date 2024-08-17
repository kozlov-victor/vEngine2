import {Game} from "@engine/core/game";
import {IRectJSON} from "@engine/geometry/rect";
import {Optional} from "@engine/core/declarations";
import {Color} from "@engine/renderer/common/color";
import {IRigidBody} from "@engine/physics/common/interfaces";
import {ARCADE_RIGID_BODY_TYPE, ArcadeRigidBody, RectWithUpdateId} from "@engine/physics/arcade/arcadeRigidBody";

let cnt = 0;
const initialColor = Color.GREY.clone();
const activeColor = Color.from({r:90,g:255,b:90});

const alreadyCheckedTiles = new Set<number>();

export class SpatialCell {
    public readonly id = cnt++;
    //public debugView:Rectangle;
    public objects:IRigidBody[] = [];
    public hasDynamicObjects = false;

    public clear(): void {
        this.objects.length = 0;
        this.hasDynamicObjects = false;
        //this.debugView.fillColor = initialColor;
    }

}

export class SpatialSpace {

    private numOfCellsX:number;
    private numOfCellsY:number;

    private cells:SpatialCell[] = [];
    private notEmptyCells:SpatialCell[] = []; // is is faster to iterate plain array
    private notEmptyCellsToCheck = new Set<SpatialCell>(); // but it is faster to check if element in notEmptyCells

    constructor(private game:Game, private cellWidth:number, private cellHeight:number, private spaceWidth:number, private spaceHeight:number) {
        this.rebuild(cellWidth,cellHeight,spaceWidth,spaceHeight);
    }

    public rebuild(cellWidth:number, cellHeight:number, spaceWidth:number, spaceHeight:number):void {
        this.numOfCellsX = ~~(spaceWidth / cellWidth) + ((cellWidth % spaceWidth)===0?0:1);
        this.numOfCellsY = ~~(spaceHeight / cellHeight) + ((cellHeight % spaceHeight)===0?0:1);
        const l = this.numOfCellsX*this.numOfCellsY;
        this.cells.length = 0;

        let x = 0;
        let y = 0;
        for (let i=0;i<l;i++) {
            const cell = new SpatialCell();
            x++;
            if (x===this.numOfCellsX) {
                x = 0;
                y++;
            }
            //cell.debugView = new Rectangle(this.game);
            //cell.debugView.pos.setXY(x*cellWidth,y*cellHeight);
            // cell.debugView.size.setWH(cellWidth,cellHeight);
            // cell.debugView.alpha = 0.1;
            // cell.debugView.fillColor = initialColor;
            // this.game.getCurrentScene().appendChild(cell.debugView);
            this.cells.push(cell);
        }
        this.clear();
    }

    // public debugClear():void {
    //     this.cells.forEach(c=>{
    //         c.debugView.fillColor = initialColor;
    //     });
    // }

    private getCellAtXY(x:number,y:number):Optional<SpatialCell> {
        const cellX:number = ~~(x / this.cellWidth);
        if (cellX>=this.numOfCellsX) return undefined;
        const cellY:number = ~~(y / this.cellHeight);
        if (cellY>=this.numOfCellsY) return undefined;
        // index by x y: index = (y+1)*width - (width - x)
        const index = (cellY+1)*this.numOfCellsX - this.numOfCellsX + cellX;
        return this.cells[index];
    }

    public getCellsInRect(rect:IRectJSON,result:SpatialCell[]):void {
        alreadyCheckedTiles.clear();
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
                    if (!alreadyCheckedTiles.has(cell.id)) {
                        result.push(cell);
                        alreadyCheckedTiles.add(cell.id);
                    }
                }
                if (y===maxY) break;
                y+=this.cellHeight;
                if (y>maxY) y = maxY;
            }
            if (x===maxX) break;
            x+=this.cellWidth;
            if (x>maxX) x = maxX;
        }
    }

    public updateSpaceByObject(body:IRigidBody, rect:RectWithUpdateId):void {
        if (body.lastBoundRectId!==rect.id) {
            body.spatialCellsOccupied.length = 0;
            this.getCellsInRect(rect,body.spatialCellsOccupied);
            body.lastBoundRectId = rect.id;
        }
        for (const c of body.spatialCellsOccupied) {
            c.objects.push(body);
            if (!this.notEmptyCellsToCheck.has(c)) {
                this.notEmptyCellsToCheck.add(c);
                this.notEmptyCells.push(c);
            }
            c.hasDynamicObjects = c.hasDynamicObjects || body._isDynamic;
            //c.debugView.fillColor = activeColor;
        }
    }

    public clear():void {
        this.notEmptyCells.length = 0;
        this.notEmptyCellsToCheck.clear();
    }

    public getCellsToCheck():readonly SpatialCell[] {
        return this.notEmptyCells;
    }

}
