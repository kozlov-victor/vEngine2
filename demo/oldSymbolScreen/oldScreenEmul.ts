import {Optional} from "@engine/core/declarations";
import {TextField} from "@engine/renderable/impl/ui/textField/simple/textField";
import {Game} from "@engine/core/game";
import {IKeyBoardEvent} from "@engine/control/keyboard/iKeyBoardEvent";
import {KEYBOARD_KEY} from "@engine/control/keyboard/keyboardKeys";
import {DrawingSurface} from "@engine/renderable/impl/surface/drawingSurface";
import {Color} from "@engine/renderer/common/color";
import {KEYBOARD_EVENTS} from "@engine/control/abstract/keyboardEvents";

class ProgramInstruction {
    public number:number;
    public subNumber:number;
    public instruction:()=>void;
}

class LoopContext {
    public pointer:number;
    public variableName:string;
    public to:number;
    public step:number;
    public currCounter:number;
}

export class BasicEnv {

    private _data:any = [];
    private res:string = '';
    private cursorPos:number = 0;
    private variables:Record<string,any> = {};
    private program:ProgramInstruction[] = [];
    private pointer:number = 0;
    private skipCommandsWhile:Optional<string>;
    private instructionPointSet:boolean = false;
    private userInputMode:boolean = false;
    private userInputString:string = '';

    private loopContexts:LoopContext[] = [];
    private subroutinesStack:number[] = [];
    private ended:boolean = false;
    private readonly drawingSurface:DrawingSurface;

    constructor(private game:Game,private textField:TextField) {
        game.getCurrentScene().appendChild(textField);
        this.drawingSurface = new DrawingSurface(this.game,this.game.size);
        this.drawingSurface.setLineWidth(1);
        this.drawingSurface.setDrawColor(Color.RGB(0,222,0).asRGBNumeric());
        this.drawingSurface.setFillColor(Color.NONE.asRGBNumeric(),0);
        game.getCurrentScene().appendChild(this.drawingSurface);
    }

    public INPUT(message:string,varName:string):void{
        this.PRINT();
        this.PRINT(message+"? ");
        this.userInputMode = true;
        let cursorShow:boolean = false;
        const currText:string = this.res;
        const redrawTextWithCursor = ()=>{
            this.res = currText + this.userInputString;
            if (cursorShow) {
                this.res += '_';
            }
            this.redraw();
        };
        const timer = setInterval(()=>{
            cursorShow=!cursorShow;
            redrawTextWithCursor();
        },600);
        const handler = this.game.getCurrentScene().keyboardEventHandler.on(KEYBOARD_EVENTS.keyPressed, (e:IKeyBoardEvent)=>{
            const kbEv:KeyboardEvent = e.nativeEvent as KeyboardEvent;
            const keycode = kbEv.keyCode;

            if (e.button===KEYBOARD_KEY.ENTER) {
                clearInterval(timer);
                this.ASSIGN_VAR(varName,this.userInputString);
                this.res = currText + this.userInputString;
                this.userInputString = '';
                this.userInputMode = false;
                this.PRINT();
                this.game.getCurrentScene().keyboardEventHandler.off(KEYBOARD_EVENTS.keyPressed,handler);
                this.redraw();
                return;
            } else if (e.button===KEYBOARD_KEY.BACKSPACE) {
                this.userInputString = this.userInputString.substr(0,this.userInputString.length-2);
                redrawTextWithCursor();
            }

            const acceptableChar =
                (keycode > 47 && keycode < 58)   || // number keys
                keycode === 32 || keycode === 13   || // spacebar & return key(s) (if you want to allow carriage returns)
                (keycode > 64 && keycode < 91)   || // letter keys
                (keycode > 95 && keycode < 112)  || // numpad keys
                (keycode > 185 && keycode < 193) || // ;=,-./` (in order)
                (keycode > 218 && keycode < 223);   // [\]' (in order)

            if (acceptableChar) {
                this.userInputString+=kbEv.key;
                redrawTextWithCursor();
            }

        });
    }

    public DATA(arr:any[]):void{
        if (this.skipCommandsWhile!==undefined) return;
        this._data.push(...arr);
    }

    public PRINT_TAB(n:number):void{
        if (this.skipCommandsWhile!==undefined) return;
        let numOfSpaces:number;
        if (n<this.cursorPos) {
            this.res+='\n';
            this.cursorPos = 0;
            numOfSpaces = n;
        }
        else numOfSpaces = n - this.cursorPos;
        const newStr = new Array(numOfSpaces).fill(' ').join('');
        this.cursorPos+=newStr.length;
        this.res+=newStr;
        this.redraw();
    }

    public REM(s?:string):void{

    }

    public LEN(s:string):number{
        return s.length;
    }

    public MID(s:string,from:number,length:number):string{
        return s.substr(from - 1,length);
    }

    public READ(varName:string,index?:number):void {
        if (this.skipCommandsWhile!==undefined) return;
        const data = this._data.shift();
        if (data===undefined) throw new Error(`nothing to READ`);
        this.ASSIGN_VAR(varName,data,index);
    }

    public CHR$(n:number):string {
        return String.fromCharCode(n);
    }

    public PRINT(s?:string):void{
        if (this.skipCommandsWhile!==undefined) return;
        if (!s) {
            this.cursorPos = 0;
            this.res+='\n';
        }  else {
            this.res+=s;
            this.cursorPos+=s.length;
        }
        if (this.res.split('\n').length>22) {
            const newRes = this.res.split('\n');
            newRes.shift();
            this.res = newRes.join('\n');
        }
        this.redraw();
    }

    public FOR(varName:string,from:number,to:number,step:number = 1):void{
        if (this.skipCommandsWhile!==undefined) return;
        if (step>0) {
            if (from>to) {
                this.skipCommandsWhile = varName;
                return;
            }
        } else if (step<0) {
            if (from<to) {
                this.skipCommandsWhile = varName;
                return;
            }
        }
        const lc:LoopContext = new LoopContext();
        this.variables[varName] = from;
        lc.currCounter = from;
        lc.to = to;
        lc.step = step;
        lc.variableName = varName;
        lc.pointer = this.pointer+1;
        this.loopContexts.push(lc);
    }

    public NEXT(varName:string):void {
        if (this.skipCommandsWhile===varName) {
            this.skipCommandsWhile = undefined;
            return;
        }
        if (this.skipCommandsWhile!==undefined) return;
        const lcn: number = this.loopContexts.findIndex(it => it.variableName === varName);
        if (lcn===-1) throw new Error(`wrong NEXT variable: ${varName}`);
        const lc: LoopContext = this.loopContexts[lcn];
        lc.currCounter += lc.step;
        if ((lc.step>0 && lc.currCounter > lc.to) || (lc.step<0 && lc.currCounter < lc.to)) {
            this.loopContexts.splice(lcn, 1);
        }
        else {
            this.pointer = lc.pointer;
            this.variables[lc.variableName] = lc.currCounter;
            this.instructionPointSet = true;
        }
    }

    public GET_VAR(varName:string,index?:number):any {
        if (this.skipCommandsWhile!==undefined) return undefined!;
        if (this.variables[varName]===undefined) throw new Error(`no such variable: ${varName}`);
        if (index===undefined) {
            if (this.variables[varName].splice) throw new Error(`${varName}: wrong variable invocation: index is expected`);
            const v = this.variables[varName];
            if (v===undefined) throw new Error(`unexpected variable ${varName}`);
            return v;
        }
        if (!this.variables[varName].splice) throw new Error(`variable ${varName} is not an array`);
        if (index>this.variables[varName].length-1) throw new Error(`${varName}[${index}]: out of range`);
        const val = this.variables[varName][index];
        if (val===undefined) throw new Error(`unexpected variable ${varName}[${index}]`);
        return val;
    }

    public ASSIGN_VAR(varName:string, value:any, index?:number):void {
        if (value===undefined) {
            throw new Error(`can not assign value to ${varName}${index===undefined?'':`[${index}]`}: bad value to assign`);
        }
        if (this.skipCommandsWhile!==undefined) return;
        if (index===undefined) this.variables[varName] = value;
        else {
            if (!this.variables[varName]) this.variables[varName] = [];
            this.variables[varName][index] = value;
        }
    }

    public GOTO(n:number):void{
        if (this.skipCommandsWhile!==undefined) return;
        const line = this.program.findIndex(it=>it.number===n);
        if (line===-1) throw new Error('can not GO TO line ${n}');
        this.pointer = line;
        this.instructionPointSet = true;
    }

    public CLS():void{
        this.res = '';
        this.cursorPos = 0;
        this.redraw();
        this.drawingSurface.clear();
    }

    public IF(res:boolean,fn:()=>void):void {
        if (this.skipCommandsWhile!==undefined) return;
        if (res) fn();
    }

    public INT(n:number):number{
        return ~~(+n);
    }

    public SIN(n:number):number{
        return Math.sin(+n);
    }

    public COS(n:number):number{
        return Math.cos(+n);
    }

    public SQRT(n:number):number{
        return Math.sqrt(+n);
    }

    public GOSUB(n:number):void{
        this.subroutinesStack.push(this.pointer+1);
        this.GOTO(n);
    }

    public RETURN():void{
        const pointer:number = this.subroutinesStack.pop()!;
        if (pointer===undefined) throw new Error(`unexpected RETURN`);
        this.pointer = pointer;
        this.instructionPointSet = true;
    }


    public CIRCLE(x:number,y:number,radius:number):void{
        this.drawingSurface.drawCircle(x,y,radius);
    }

    public LINE(x1:number,y1:number,x2:number,y2:number,color:number,attribute:undefined|'B'|'BF'):void {
        if (attribute===undefined) {
            this.drawingSurface.moveTo(x1,y1);
            this.drawingSurface.lineTo(x2,y2);
            this.drawingSurface.completePolyline();
        } else if (attribute==='B') {
            this.drawingSurface.setFillColor(Color.NONE.asRGBNumeric(),0);
            this.drawingSurface.drawRect(x1,y1,x2-x1,y2-y1);
        } else if (attribute==='BF') {
            this.drawingSurface.setFillColor(Color.RGB(255,0,0).asRGBNumeric(),255);
            this.drawingSurface.drawRect(x1,y1,x2-x1,y2-y1);
        }
    }

    public PLOT(x:number,y:number):void {
        this.drawingSurface.moveTo(x,y);
    }

    public DRAW(x:number,y:number):void {
        this.drawingSurface.lineTo(x,y);
        this.drawingSurface.completePolyline();
    }

    public END():void{
        this.ended = true;
    }

    public DEBUG():void{
        console.log('variables',JSON.stringify(this.variables));
    }

    public setProgram(p:Record<number,((()=>void)[])|(()=>void)|void>):void{
        const keys:number[] = Object.keys(p).map(s=>+s);
        // tslint:disable-next-line:no-shadowed-variable
        keys.sort((a:number,b:number):number=>{
            if (a>b) return 1;
            else return -1;
        });
        keys.forEach((k:number)=>{
            if (p[k]===undefined) {
                // already performed instruction like DATA
                return;
            }
            if ((p[k] as unknown as any[]).splice!==undefined) {
                (p[k] as unknown as any[]).forEach((instr,i)=>{
                    const pi:ProgramInstruction = new ProgramInstruction();
                    pi.number = k;
                    pi.subNumber = i;
                    pi.instruction = instr as ()=>void;
                    this.program.push(pi);
                });
            } else if ((p[k] as unknown as ()=>void).call!==undefined) {
                const pi:ProgramInstruction = new ProgramInstruction();
                pi.number = k;
                pi.subNumber = 0;
                pi.instruction = p[k] as ()=>void;
                this.program.push(pi);
            }
        });
    }

    private redraw():void {
        this.textField.setText(this.res);
    }

    private complete():void {
        this.PRINT();
        this.PRINT("OK");
        this.PRINT();
    }

    public RUN():void{
        if (this.ended) {
            this.complete();
            return;
        }
        if (this.userInputMode) {
            setTimeout(()=>this.RUN(),1);
            return;
        }
        const all = this.program.length;
        if (this.pointer>all-1) {
            this.complete();
            return;
        }
        const instruction = this.program[this.pointer].instruction;
        instruction();
        if (this.instructionPointSet) {
            this.instructionPointSet = false;
        }
        else this.pointer++;
        setTimeout(()=>this.RUN(),1);
    }

}
