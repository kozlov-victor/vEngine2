import {Optional} from "@engine/core/declarations";
import {Reactive} from "@engine/renderable/tsx/decorator/reactive";

export const wait = Reactive.Function((n:number)=>{
    return new Promise<void>(resolve=>{
        setTimeout(resolve,n)
    });
});


export const SIZE = 12;
export type SYMBOL = 'X'|'0';
const MAX_AI_LEVEL = 10;
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

    private actionPatterns = [
        {val: '0xxxx', score: 40},
        {val: '00xxx', score: 35},
        {val: '0x0xx', score: 35},
        {val: '0xx0x', score: 35},
        {val: '0xxx0', score: 35},
        {val: '0xxx', score: 30},
        {val: '0x0x', score: 25},
        {val: '0xx', score: 20},
        {val: '0x', score: 10},

    ]

    private constructPattern(cell:Cell,rowFactor:0|1|-1,colFactor:0|1|-1,symbol:SYMBOL):{value:string,cells:Cell[]} {
        const result = {
            value:'',
            cells: [] as Cell[],
        }
        for (let k=0;k<5;k++) {
            const row = cell.row+k*rowFactor;
            const col = cell.col+k*colFactor;
            if (row>SIZE-1) break;
            if (col>SIZE-1) break;
            if (row<0) break;
            if (col<0) break;
            switch (this.board.field[row][col].value) {
                case undefined:
                    result.value+='0';
                    result.cells.push(undefined!);
                    break;
                case symbol:
                    result.value+='x';
                    result.cells.push(this.board.field[row][col]);
                    break;
                default:
                    result.value+='.';
                    break;
            }
        }
        return result;
    }

    private getPatternScore(pattern:string) {
        const allScores:number[] = [0];
        this.actionPatterns.forEach(p=>{
            if (pattern.startsWith(p.val)) {
                allScores.push(p.score);
            }
        });
        return Math.max(...allScores);
    }

    private getAllPatterns(cell:Cell, symbol: SYMBOL) {
        return [
            this.constructPattern(cell,0,1, symbol),
            this.constructPattern(cell,0,-1, symbol),
            this.constructPattern(cell,1,0, symbol),
            this.constructPattern(cell,-1,0, symbol),
            this.constructPattern(cell,1,1, symbol),
            this.constructPattern(cell,-1,1, symbol),
            this.constructPattern(cell,1,-1, symbol),
            this.constructPattern(cell,-1,-1, symbol)
        ]
    }

    private getCellScore(cell:Cell,symbol:SYMBOL):number {
        if (cell.value!=undefined) return -1;
        return Math.max(
            ...this.getAllPatterns(cell,symbol).map(p=>this.getPatternScore(p.value))
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
            )
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
        for (const c of this.board.cells) {
            const allRows = this.getAllPatterns(c,symbol);
            const winRow = allRows.find(it=>it.value==='xxxxx');
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
        await wait(500);
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
