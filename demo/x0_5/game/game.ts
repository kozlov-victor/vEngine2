import {Optional} from "@engine/core/declarations";
import {Reactive} from "@engine/renderable/tsx/decorator/reactive";

export const wait = Reactive.Function((n:number)=>{
    return new Promise<void>(resolve=>{
        setTimeout(resolve,n)
    });
});


export const SIZE = 12;
export type SYMBOL = 'X'|'0';
const MAX_AI_LEVEL = 20;
export class Cell {
    value:Optional<SYMBOL>;
    score:number;

    constructor(
        public row: number,
        public col: number,
    ) {
    }

}

export interface IActionResult {
    result: 'win' | 'loose' | 'keep' | 'tie',
    cells: Cell[] | undefined
}

class AI {

    constructor(private board:Board, private aiLevel: number) {
        if (aiLevel<0 || aiLevel>MAX_AI_LEVEL) {
            throw new Error(`wrong ai level: ${aiLevel}`);
        }
    }

    private getRowScore(cell:Cell,rowFactor:0|1|-1,colFactor:0|1|-1,from:0|1,symbol:SYMBOL):{score:number,full:boolean,cells:Cell[]} {
        const result = {
            score:0,
            full: false,
            cells: [] as Cell[],
        }
        for (let k=from;k<5;k++) {
            const row = cell.row+k*rowFactor;
            const col = cell.col+k*colFactor;
            if (row>SIZE-1) break;
            if (col>SIZE-1) break;
            if (row<0) break;
            if (col<0) break;
            switch (this.board.field[row][col].value) {
                case symbol:
                    result.score+=1;
                    result.cells.push(this.board.field[row][col]);
                    break;
                default:
                    return result;
            }
        }
        result.full = result.cells.length===5 && result.cells.every(it=>it && it.value===symbol);
        return result;
    }

    private getCellScore(cell:Cell,symbol:SYMBOL):number {
        if (cell.value!=undefined) return -1;
        return Math.max(...
            [
                this.getRowScore(cell,1,0, 1,symbol).score + this.getRowScore(cell,-1,0, 1,symbol).score,
                this.getRowScore(cell,0,1, 1,symbol).score + this.getRowScore(cell,0,-1, 1,symbol).score,
                this.getRowScore(cell,1,1, 1,symbol).score + this.getRowScore(cell,-1,-1, 1,symbol).score,
                this.getRowScore(cell,1,-1, 1,symbol).score + this.getRowScore(cell,-1,1, 1,symbol).score,
            ]
        );
    }

    public getTheBestCell():Cell|undefined {
        this.board.cells.forEach(c=>{
            c.score=0;
        });
        this.board.cells.forEach(cell=>{
            cell.score = Math.max(
                this.getCellScore(cell,'X'),
                this.getCellScore(cell,'0'),
            );
        });
        // додаємо шум в розрахований miniMax
        this.board.cells.forEach(c=>{
            if (c.score>0) {
                c.score+=Math.random()*(MAX_AI_LEVEL-this.aiLevel);
            }
        });

        const maxScore = Math.max(0,...this.board.cells.map(it=>it.score));
        const theBestCells = this.board.cells.filter(c=>c.score===maxScore);
        return theBestCells[Math.floor((Math.random()*theBestCells.length))];
    }

    public checkPossibleWinner(symbol:SYMBOL):Cell[]|undefined {
        for (const cell of this.board.cells) {
            const allRows = [
                this.getRowScore(cell,0,1, 0,symbol),
                this.getRowScore(cell,1,0, 0,symbol),
                this.getRowScore(cell,1,1, 0,symbol),
                this.getRowScore(cell,1,-1, 0,symbol),
            ]
            const winRow = allRows.find(it=>it.full);
            if (winRow) {
                return winRow.cells;
            }
        }
        return undefined;
    }


}

export class Board {

    public readonly field: Cell[][];
    public readonly cells:Cell[] = [];
    public ai = new AI(this,this.aiLevel);

    private waitingForOpponentAction = false;
    private finished = false;

    constructor(private aiLevel: number) {
        this.field = [];
        for (let j=0;j<SIZE;j++) {
            const row:Cell[] = [];
            for (let i=0;i<SIZE;i++) {
                const cell = new Cell(j,i);
                row.push(cell);
                this.cells.push(cell);
            }
            this.field.push(row);
        }
    }

    public reset() {
        this.cells.forEach(c=>{
           c.value = undefined;
        });
        this.waitingForOpponentAction = false;
        this.finished = false;
    }

    private allCellsAreOccupied() {
        return this.cells.every(it=>it.value!==undefined);
    }

    public async actByUser(row:number, col: number):Promise<IActionResult> {
        const cell = this.field[row][col];
        if (cell.value!=undefined) return {result:'keep',cells:undefined};
        if (this.finished) return {result:'keep',cells:undefined};
        if (this.waitingForOpponentAction) return {result:'keep',cells:undefined};
        cell.value = 'X';

        this.waitingForOpponentAction = true;
        await wait(800);
        const winCells = this.ai.checkPossibleWinner('X');
        if (winCells) {
            this.finished = true;
            return {
                result: 'win',
                cells: winCells
            };
        }
        const theBestCell = this.ai.getTheBestCell();
        if (theBestCell) {
            theBestCell.value = '0';
        }
        const looseCells = this.ai.checkPossibleWinner('0');
        if (looseCells) {
            this.finished = true;
            return {
                result: 'loose',
                cells: looseCells
            };
        }
        await wait(800);
        this.waitingForOpponentAction = false;
        if (this.allCellsAreOccupied()) {
            this.finished = true;
            return {
                result: 'tie',
                cells: undefined
            }
        }
        return {result:'keep',cells:undefined};
    }

}
