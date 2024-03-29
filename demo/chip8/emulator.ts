import {Game} from "@engine/core/game";

declare type nibble = 0|1|2|3|4|5|6|7|8|9|10|11|12|13|14|15;

const ROM:Uint8[] = [
    0xF0, 0x90, 0x90, 0x90, 0xF0, // 0
    0x20, 0x60, 0x20, 0x20, 0x70, // 1
    0xF0, 0x10, 0xF0, 0x80, 0xF0, // 2
    0xF0, 0x10, 0xF0, 0x10, 0xF0, // 3
    0x90, 0x90, 0xF0, 0x10, 0x10, // 4
    0xF0, 0x80, 0xF0, 0x10, 0xF0, // 5
    0xF0, 0x80, 0xF0, 0x90, 0xF0, // 6
    0xF0, 0x10, 0x20, 0x40, 0x40, // 7
    0xF0, 0x90, 0xF0, 0x90, 0xF0, // 8
    0xF0, 0x90, 0xF0, 0x10, 0xF0, // 9
    0xF0, 0x90, 0xF0, 0x90, 0x90, // A
    0xE0, 0x90, 0xE0, 0x90, 0xE0, // B
    0xF0, 0x80, 0x80, 0x80, 0xF0, // C
    0xE0, 0x90, 0x90, 0x90, 0xE0, // D
    0xF0, 0x80, 0xF0, 0x80, 0xF0, // E
    0xF0, 0x80, 0xF0, 0x80, 0x80, // F
];

class Timer {
    private value:number = 0;

    public update():void{
        if (this.value>0) this.value--;
    }

    public getValue():number{
        return this.value;
    }

    public setValue(v:number):void{
        this.value = v;
    }

}

class Keyboard {

    private buttons:boolean[] = new Array(0xF+1);

    constructor(){

    }

    public reset():void{
        this.buttons.fill(false);
    }

    public press(b:number):void{
        this.buttons[b] = true;
    }

    public release(b:number):void{
        this.buttons[b] = false;
    }

    public isPressed(b:number):boolean {
        return this.buttons[b];
    }


}

export abstract class Emulator {

    protected constructor(private game: Game) {
        this.screen = [];
        for (let y: number = 0; y < Emulator.SCREEN_HEIGHT; y++) {
            this.screen[y] = new Array(Emulator.SCREEN_WIDTH);
        }
        this.reset();
    }

    private static readonly STACK_SIZE: number = 24;
    private static readonly MEMORY_SIZE: number = 0xFFF + 1;
    private static readonly SCREEN_WIDTH: number = 64;
    private static readonly SCREEN_HEIGHT: number = 32;
    private static readonly ROM_OFFSET: number = 0x200;
    public readonly keyboard: Keyboard = new Keyboard();

    private memory: Uint8[] = new Array(Emulator.MEMORY_SIZE);
    private V: Uint8[] = new Array(0xF + 1);
    private I: number;
    private stack: number[] = new Array(Emulator.STACK_SIZE);
    private SP: number;
    private delayTimer: Timer = new Timer();
    private soundTimer: Timer = new Timer();
    private PC: number;
    private waitingForKey:boolean = false;
    private readonly screen: (0 | 1)[][];

    // tslint:disable-next-line:variable-name
    private PC_altered: boolean = false;

    private debug: boolean = false;

    private static _UNKNOWN_OPCODE(opCode: number): void {
        throw new Error(`unknown opCode: hex: ${opCode.toString(16)} (dec: ${opCode} bin: ${opCode.toString(2)})`);
    }

    public nextTick():void {
        for (let i: number = 0; i < 9; i++) {
            this.oneTick();
        }
        this.flipScreen(this.screen);
        this.delayTimer.update();
        this.soundTimer.update();
    }

    public setRom(rom: Uint8Array):void {
        if (this.debug) console.log({rom});
        for (let i = 0; i < rom.length; i++) {
            this.memory[Emulator.ROM_OFFSET + i] = rom[i] as Uint8;
        }
        this.oneTick();
        if (this.debug) console.log({memory: this.memory});

    }

    protected abstract flipScreen(screen: (1 | 0)[][]): void;


    private reset():void {
        this.memory.fill(0);
        this.V.fill(0);
        this.I = 0;
        this.stack.fill(0);
        this.SP = 0;
        this.delayTimer.setValue(0);
        this.soundTimer.setValue(0);
        for (let i: number = 0; i < ROM.length; i++) {
            this.memory[i] = ROM[i];
        }
        for (let y: number = 0; y < Emulator.SCREEN_HEIGHT; y++) {
            this.screen[y].fill(0);
        }
        this.PC = Emulator.ROM_OFFSET;
        this.keyboard.reset();
    }

    private oneTick():void {
        const opCode: number = (this.memory[this.PC] << 8) | this.memory[this.PC + 1];
        if (Number.isNaN(opCode)) throw new Error(`wrong opCode with PC=${this.PC}`);
        this.executeOpCode(opCode);
        if (!this.PC_altered && !this.waitingForKey) this.PC += 2;
        this.PC_altered = false;
    }

    private SYS(addr: number, opCode: number):void {
        if (this.debug) console.log(`0x${this.PC.toString(16)}: SYS 0x${addr.toString(16)}, SP=${this.SP}, opCode=${opCode}`);
    }

    private CLS():void {
        if (this.debug) console.log(`0x${this.PC.toString(16)}: CLS`);
        for (let y: number = 0; y < Emulator.SCREEN_HEIGHT; y++) {
            this.screen[y].fill(0);
        }
    }

    private RET():void {
        if (this.debug) console.log(`0x${this.PC.toString(16)}: RET`);
        if (this.SP === 0) throw new Error(`empty stack`);
        this.PC = this.stack[this.SP - 1];
        this.SP--;
    }

    private JP(addr: number):void {
        if (this.debug) console.log(`0x${this.PC.toString(16)}: JP 0x${addr.toString(16)}`);
        this.PC = addr;
        this.PC_altered = true;
    }

    private JP_V0(addr: number):void {
        if (this.debug) console.log(`0x${this.PC.toString(16)}: JP_V0 0x${addr.toString(16)}`);
        this.PC = addr + this.V[0];
        this.PC_altered = true;
    }

    private CALL(addr: number):void {
        if (this.debug) console.log(`0x${this.PC.toString(16)}: CALL 0x${addr.toString(16)}`);
        if (this.SP > Emulator.STACK_SIZE) throw new Error(`stack overflow`);
        this.SP++;
        this.stack[this.SP - 1] = this.PC;
        this.PC = addr;
        this.PC_altered = true;
    }

    private SE_X_NN(x: number, nn: number):void {
        if (this.V[x] === nn) {
            this.PC_altered = true;
            this.PC += 4;
        }
        if (this.debug) console.log(`0x${this.PC.toString(16)}: SE_X_NN ${x} ${nn} (v[${x}]=${this.V[x].toString(16)})`);
    }

    private SE_X_Y(x: nibble, y: nibble):void {
        if (this.debug) console.log(`0x${this.PC.toString(16)}: SE_X_Y ${x} ${y} (vx=${this.V[x].toString(16)},vy=${this.V[y].toString(16)})`);
        if (this.V[x] === this.V[y]) {
            this.PC_altered = true;
            this.PC += 4;
        }
    }

    private SNE_X_NN(x: nibble, nn: Uint8):void {
        if (this.debug) console.log(`0x${this.PC.toString(16)}: SNE_X_NN ${x} ${nn} (v[${x}]=${this.V[x].toString(16)})`);
        if (this.V[x] !== nn) {
            this.PC_altered = true;
            this.PC += 4;
        }
    }

    private SNE_X_Y(x: nibble, y: nibble):void {
        if (this.debug) console.log(`0x${this.PC.toString(16)}: SNE_X_Y ${x} ${y} (v[${x}]=${this.V[x].toString(16)})`);
        if (this.V[x] !== this.V[y]) {
            this.PC += 4;
            this.PC_altered = true;
        }
    }

    private LD_X_NN(x: nibble, nn: Uint8):void {
        this.V[x] = (nn & 0xFF) as Uint8;
        if (this.debug) console.log(`0x${this.PC.toString(16)}: LD_X_NN ${x} ${nn} (v[${x}]=${this.V[x].toString(16)})`);
    }

    private LD_X_Y(x: nibble, y: nibble):void {
        this.V[x] = this.V[y];
        if (this.debug) console.log(`0x${this.PC.toString(16)}: LD_X_Y ${x} ${y} (v[${x}]=${this.V[x].toString(16)})`);
    }

    private LD_I_NNN(addr: number):void {
        if (this.debug) console.log(`0x${this.PC.toString(16)}: LD_I_NNN 0x${addr.toString(16)}`);
        this.I = addr;
    }

    private LD_I_SPR_X(x: nibble):void {
        this.I = this.V[x] * 5;
        if (this.debug) console.log(`0x${this.PC.toString(16)}: LD_I_SPR_X ${x} (I=${this.I.toString(16)})`);
    }

    private LD_B_X(x: nibble):void {
        const vx: Uint8 = this.V[x];
        const hundreds: number = ~~(vx / 100);
        const tens: number = ~~((vx - 100 * hundreds) / 10);
        const ones: number = (vx - 100 * hundreds - 10 * tens);
        this.writeMemory(this.I, (hundreds & 0xFF) as Uint8);
        this.writeMemory(this.I + 1, (tens & 0xFF) as Uint8);
        this.writeMemory(this.I + 2, (ones & 0xFF) as Uint8);
        if (this.debug) console.log(`0x${this.PC.toString(16)}: LD_B_X ${x}`);
    }

    private LD_I_X(x: nibble):void {
        if (this.debug) console.log(`0x${this.PC.toString(16)}: LD_I_X ${x}`);
        for (let i: number = 0; i <= x; i++) {
            this.writeMemory(this.I + i, this.V[i]);
        }
    }

    private LD_X_I(x: nibble):void {
        if (this.debug) console.log(`0x${this.PC.toString(16)}: LD_X_I ${x}`);
        for (let i: number = 0; i <= x; i++) {
            this.V[i] = this.readMemory(this.I + i);
        }
    }

    private ADD_X_NN(x: nibble, nn: Uint8):void {
        this.V[x] = ((this.V[x] + nn) & 0xFF) as Uint8;
        if (this.debug) console.log(`0x${this.PC.toString(16)}: ADD_X_NN ${x} ${nn} (x[${x}]=${this.V[x].toString(16)})`);
    }

    private ADD_X_Y(x: nibble, y: nibble):void {
        this.V[x] = (this.V[x] + this.V[y]) as Uint8;
        if (this.V[x] > 0xFF) {
            this.V[0xF] = 0x1;
            this.V[x] = (this.V[x] & 0xFF) as Uint8;
        } else {
            this.V[0xF] = 0x0;
        }
        if (this.debug) console.log(`0x${this.PC.toString(16)}: ADD_X_Y ${x} ${y} (x[${x}]=${this.V[x].toString(16)}, v[0xf]=${this.V[0xF]})`);
    }

    private ADD_I_X(x: nibble):void {
        this.I = (this.I + this.V[x]) & 0xFFFF;
        if (this.debug) console.log(`0x${this.PC.toString(16)}: ADD_I_X ${x} (I=${this.I.toString(16)})`);
    }

    private OR(x: nibble, y: nibble):void {
        this.V[x] = ((this.V[x] | this.V[y]) & 0xFF) as Uint8;
        if (this.debug) console.log(`OR ${x} ${y} (x[${x}]=${this.V[x].toString(16)}`);
    }

    private AND(x: nibble, y: nibble):void {
        this.V[x] = ((this.V[x] & this.V[y]) & 0xFF) as Uint8;
        if (this.debug) console.log(`0x${this.PC.toString(16)}: AND ${x} ${y} (x[${x}]=${this.V[x].toString(16)})`);
    }

    private XOR(x: nibble, y: nibble):void {
        this.V[x] = ((this.V[x] ^ this.V[y]) & 0xFF) as Uint8;
        if (this.debug) console.log(`0x${this.PC.toString(16)}: XOR ${x} ${y} (x[${x}]=${this.V[x].toString(16)})`);
    }

    private SUB(x: nibble, y: nibble):void {
        if (this.V[x] > this.V[y]) this.V[0xF] = 0x1;
        else this.V[0xF] = 0x0;
        this.V[x] = ((this.V[x] - this.V[y]) & 0xFF) as Uint8;
        if (this.debug) console.log(`0x${this.PC.toString(16)}: SUB ${x} ${y} (x[${x}]=${this.V[x].toString(16)} v[0xf]=${this.V[0xF]})`);
    }

    private SUBN(x: nibble, y: nibble):void {
        if (this.V[y] > this.V[x]) this.V[0xF] = 0x1;
        else this.V[0xF] = 0x0;
        this.V[x] = ((this.V[y] - this.V[x]) & 0xFF) as Uint8;
        if (this.debug) console.log(`0x${this.PC.toString(16)}: SUBN ${x} ${y} (x[${x}]=${this.V[x].toString(16)} v[0xf]=${this.V[0xF]})`);
    }

    private SHR(x: nibble):void {
        this.V[0xF] = (this.V[x] & 0b0000_0001) as Uint8;
        this.V[x] = ((this.V[x] >> 1) & 0xFF) as Uint8;
        if (this.debug) console.log(`0x${this.PC.toString(16)}: SHR ${x} (x[${x}]=${this.V[x].toString(16)})`);
    }

    private SHL(x: nibble):void {
        this.V[0xF] = (this.V[x] & 0b0000_0001) as Uint8;
        this.V[x] = ((this.V[x] << 1) & 0xFF) as Uint8;
        if (this.debug) console.log(`0x${this.PC.toString(16)}: SHL ${x} (x[${x}]=${this.V[x].toString(16)} v[0xf]=${this.V[0xF]})`);
    }

    private RND(x: nibble, nn: Uint8):void {
        this.V[x] = ((~~(Math.random() * 256)) & nn) as Uint8;
        if (this.debug) console.log(`0x${this.PC.toString(16)}: RND ${x} ${x} ${nn} ((x[${x}]=${this.V[x].toString(16)}))`);
    }

    private DRW(x: nibble, y: nibble, n: nibble):void {
        if (this.debug) console.log(`0x${this.PC.toString(16)}: DRW ${x} ${y} ${n}`);
        let posY: number = this.V[y];
        const posX: number = this.V[x];
        let flipped: boolean = false;
        if (this.debug) console.log('for', this.I, this.I + n);
        for (let b: number = this.I; b < this.I + n; b++) {
            const currByte: Uint8 = this.readMemory(b);
            if (this.debug) console.log(currByte.toString(2));
            for (let i: number = 7; i >= 0; i--) {
                const powOfTwo: number = Math.pow(2, i);
                const currVal: 1 | 0 = (currByte & powOfTwo) > 0 ? 1 : 0;
                const currPosX: number = (posX + (7 - i)) % Emulator.SCREEN_WIDTH;
                const currPoxY: number = posY % Emulator.SCREEN_HEIGHT;
                const oldVal: 1 | 0 = this.screen[currPoxY][currPosX];
                const newVal: 1 | 0 = (currVal ^ oldVal) as (0 | 1);
                this.screen[currPoxY][currPosX] = newVal;
                if (oldVal === 1 && newVal === 0) flipped = true;
            }
            posY++;
        }
        this.V[0xF] = flipped ? 0x1 : 0x0;
    }

    private LD_X_DT(x: nibble):void {
        if (this.debug) console.log(`0x${this.PC.toString(16)}: LD_X_DT ${x}`);
        this.V[x] = (this.delayTimer.getValue() & 0xFF) as Uint8;
    }

    private LD_DT_X(x: nibble):void {
        if (this.debug) console.log(`0x${this.PC.toString(16)}: LD_DT_X ${x}`);
        this.delayTimer.setValue(this.V[x]);
    }

    private LD_ST_X(x: nibble):void {
        if (this.debug) console.log(`0x${this.PC.toString(16)}: LD_ST_X ${x}`);
        this.soundTimer.setValue(this.V[x]);
    }

    private S_KEY_E(x: nibble):void {
        if (this.debug) console.log(`0x${this.PC.toString(16)}: S_KEY_E ${x}`);
        if (this.keyboard.isPressed(this.V[x])) {
            this.PC += 4;
            this.PC_altered = true;
        }
    }

    private S_KEY_NE(x: nibble):void {
        if (this.debug) console.log(`0x${this.PC.toString(16)}: S_KEY_E ${x}`);
        if (!this.keyboard.isPressed(this.V[x])) {
            this.PC += 4;
            this.PC_altered = true;
        }
    }

    private WAIT_FOR_KEY(x: nibble):void {
        if (this.debug) console.log(`0x${this.PC.toString(16)}: WAIT_FOR_KEY ${x}`);
        this.waitingForKey = true;
        for (let i:number=0;i<16;i++) {
            if (this.keyboard.isPressed(i)) {
                this.V[i] = 1;
                this.waitingForKey = false;
                return;
            }
        }
    }


    private executeOpCode(opCode: number):void {

        const lastNibble: nibble = ((opCode & 0b1111_0000_0000_0000) >> 0xC) as nibble;
        const NNN: number = opCode & 0b0000_1111_1111_1111;
        const NN: Uint8 = (opCode & 0b0000_0000_1111_1111) as Uint8;
        const N: nibble = (opCode & 0b0000_0000_0000_1111) as nibble;
        const X: nibble = ((opCode & 0b0000_1111_0000_0000) >> 0x8) as nibble;
        const Y: nibble = ((opCode & 0b0000_0000_1111_0000) >> 0x4) as nibble;
        switch (lastNibble as number) {
            case 0x0: {
                if (NNN === 0xEE) this.RET();
                if (NNN === 0xE0) this.CLS();
                else {
                    this.SYS(NNN, opCode);
                }
                break;
            }
            case 0x1: {
                this.JP(NNN);
                break;
            }
            case 0x2: {
                this.CALL(NNN);
                break;
            }
            case 0x3: {
                this.SE_X_NN(X, NN);
                break;
            }
            case 0x4: {
                this.SNE_X_NN(X, NN);
                break;
            }
            case 0x5: {
                this.SE_X_Y(X, Y);
                break;
            }
            case 0x6: {
                this.LD_X_NN(X, NN);
                break;
            }
            case 0x7: {
                this.ADD_X_NN(X, NN);
                break;
            }
            case 0x8: {
                if (N === 0) this.LD_X_Y(X, Y);
                else if (N === 0x1) this.OR(X, Y);
                else if (N === 0x2) this.AND(X, Y);
                else if (N === 0x3) this.XOR(X, Y);
                else if (N === 0x4) this.ADD_X_Y(X, Y);
                else if (N === 0x5) this.SUB(X, Y);
                else if (N === 0x6) this.SHR(X);
                else if (N === 0x7) this.SUBN(X, Y);
                else if (N === 0xE) this.SHL(X);
                else Emulator._UNKNOWN_OPCODE(opCode);
                break;
            }
            case 0x9: {
                if (N === 0) this.SNE_X_Y(X, Y);
                else Emulator._UNKNOWN_OPCODE(opCode);
                break;
            }
            case 0xA: {
                this.LD_I_NNN(NNN);
                break;
            }
            case 0xB: {
                this.JP_V0(NNN);
                break;
            }
            case 0xC: {
                this.RND(X, NN);
                break;
            }
            case 0xD: {
                this.DRW(X, Y, N);
                break;
            }
            case 0xE: {
                if (NN === 0x9E) this.S_KEY_E(X);
                else if (NN === 0xA1) this.S_KEY_NE(X);
                else Emulator._UNKNOWN_OPCODE(opCode);
                break;
            }
            case 0xF: {
                if (NN === 0x7) this.LD_X_DT(X);
                else if (NN=== 0x0A) this.WAIT_FOR_KEY(X);
                else if (NN === 0x15) this.LD_DT_X(X);
                else if (NN === 0x18) this.LD_ST_X(X); //
                else if (NN === 0x1E) this.ADD_I_X(X);
                else if (NN === 0x29) this.LD_I_SPR_X(X);
                else if (NN === 0x33) this.LD_B_X(X);
                else if (NN === 0x55) this.LD_I_X(X);
                else if (NN === 0x65) this.LD_X_I(X);
                else Emulator._UNKNOWN_OPCODE(opCode);
                break;
            }
            default:
                Emulator._UNKNOWN_OPCODE(opCode);
        }
    }

    private readMemory(addr: number):Uint8 {
        if (addr > Emulator.MEMORY_SIZE - 1) throw new Error(`address ${addr.toString(16)}: memory can not be read`);
        return this.memory[addr];
    }

    private writeMemory(addr: number, value: Uint8):void {
        if (addr > Emulator.MEMORY_SIZE - 1 || addr < Emulator.ROM_OFFSET) throw new Error(`address ${addr.toString(16)}: memory can not be write`);
        this.memory[addr] = value;
    }

}
