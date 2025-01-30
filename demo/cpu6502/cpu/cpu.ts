
// https://www.masswerk.at/6502/6502_instruction_set.html
// https://skilldrick.github.io/easy6502/

import {Ram} from "./ram";

class Command {
    constructor(
        public code: number,
        public addrGetter:()=>number,
        public size:number,
        public cycles:number,
        public execution:(addr:number,value:number)=>void
    ) {
    }
}

export class Cpu {
    public A: Uint8 = 0;
    public X: Uint8 = 0;
    public Y: Uint8 = 0;
    public PC = 0; // 0 - 0xFFFF
    public SP = 0; // 0 - 0xFFFF

    public C = false; // Carry
    public Z = false; // Zero
    public I = false; // Interrupt Disable
    public D = false; // Decimal
    public B = false; // Break
    public U = false; // Unused
    public V = false; // Overflow
    public N = false; // Negative

    private immediateValue = false;
    private clock = 0;
    public halt = false;
    private commandsMap:Record<number, Command> = {};

    constructor(private memory: Ram) {
        const commands: Command[] = [];

        commands.push(new Command(0x00, ()=>this.implied(),2,2,(addr,value)=>this.BRK(addr,value)));

        commands.push(new Command(0x69, ()=>this.immediate(),2,2,(addr,value)=>this.ADC(addr,value)));
        commands.push(new Command(0x65, ()=>this.zeroPage(),2,3,(addr,value)=>this.ADC(addr,value)));
        commands.push(new Command(0x75, ()=>this.zeroPageX(),2,4,(addr,value)=>this.ADC(addr,value)));
        commands.push(new Command(0x6d, ()=>this.absolute(),3,4,(addr,value)=>this.ADC(addr,value)));
        commands.push(new Command(0x7d, ()=>this.absoluteX(),3,4,(addr,value)=>this.ADC(addr,value)));
        commands.push(new Command(0x79, ()=>this.absoluteY(),3,4,(addr,value)=>this.ADC(addr,value)));
        commands.push(new Command(0x61, ()=>this.indirectX(),2,6,(addr,value)=>this.ADC(addr,value)));
        commands.push(new Command(0x71, ()=>this.indirectY(),2,5,(addr,value)=>this.ADC(addr,value)));

        commands.push(new Command(0x29, ()=>this.immediate(),2,2,(addr,value)=>this.AND(addr,value)));
        commands.push(new Command(0x25, ()=>this.zeroPage(),2,3,(addr,value)=>this.AND(addr,value)));
        commands.push(new Command(0x35, ()=>this.zeroPageX(),2,4,(addr,value)=>this.AND(addr,value)));
        commands.push(new Command(0x2d, ()=>this.absolute(),3,4,(addr,value)=>this.AND(addr,value)));
        commands.push(new Command(0x3d, ()=>this.absoluteX(),3,4,(addr,value)=>this.AND(addr,value)));
        commands.push(new Command(0x39, ()=>this.absoluteY(),3,4,(addr,value)=>this.AND(addr,value)));
        commands.push(new Command(0x21, ()=>this.indirectX(),2,6,(addr,value)=>this.AND(addr,value)));
        commands.push(new Command(0x31, ()=>this.indirectY(),2,5,(addr,value)=>this.AND(addr,value)));

        commands.push(new Command(0x0a, ()=>this.accumulator(),1,2,(addr,value)=>this.ASL(addr,value)));
        commands.push(new Command(0x16, ()=>this.zeroPageX(),2,6,(addr,value)=>this.ASL(addr,value)));
        commands.push(new Command(0x0e, ()=>this.absolute(),3,6,(addr,value)=>this.ASL(addr,value)));
        commands.push(new Command(0x1e, ()=>this.absoluteX(),3,7,(addr,value)=>this.ASL(addr,value)));

        commands.push(new Command(0x90, ()=>this.relative(),2,2,(addr,value)=>this.BCC(addr,value)));
        commands.push(new Command(0xb0, ()=>this.relative(),2,2,(addr,value)=>this.BCS(addr,value)));
        commands.push(new Command(0xf0, ()=>this.relative(),2,2,(addr,value)=>this.BEQ(addr,value)));
        commands.push(new Command(0x30, ()=>this.relative(),2,2,(addr,value)=>this.BMI(addr,value)));
        commands.push(new Command(0xd0, ()=>this.relative(),2,2,(addr,value)=>this.BNE(addr,value)));

        commands.push(new Command(0x24, ()=>this.zeroPage(),2,3,(addr,value)=>this.BIT(addr,value)));
        commands.push(new Command(0x2c, ()=>this.absolute(),3,4,(addr,value)=>this.BIT(addr,value)));


        for (const command of commands) {
            this.commandsMap[command.code] = command;
        }
    }

    // commands

    private BRK(addr: number, value:number):void {
        this.halt = true;
    }

    // Add Memory to Accumulator with Carry
    //  only two instructions are affected by the D flag: ADC and SBC
    private ADC(addr: number, value:number):void {
        let temp: number;
        if (this.D) {
            // https://github.com/laamella-gad/Mpu6502/blob/master/src/main/java/com/laamella/mpu6502/Mpu6502.java
            temp = (this.A & 0xf) + (value & 0xf) + (this.C?1:0);
            if (temp > 0x9) temp += 0x6;
            if (temp <= 0x0f) temp = (temp & 0xf) + (this.A & 0xf0) + (value & 0xf0);
            else temp = (temp & 0xf) + (this.A & 0xf0) + (value & 0xf0) + 0x10;
            this.Z = ((this.A + value + (this.C?1:0) & 0xff))===0;
            this.N  = (temp & 0x0080) > 0;
            this.V = (((this.A ^ temp) & 0x80) > 0 && (this.A ^ value) &  0x80) === 0;
            if ((temp & 0x1f0) > 0x90) temp += 0x60;
            this.C = (temp & 0xff0) > 0xf0;
        }
        else {
            temp = this.A + value + (this.C?1:0);
            this.C  = temp > 0x00FF;
            this.Z  = (temp & 0x00FF) === 0;
            this.N = (temp & 0x0080) === 0x0080;
            this.V = (~(this.A^value) & (this.A^temp) & 0x0080)===0x0080;
        }
        this.A = (temp & 0x00FF) as Uint8;
    }

    // AND Memory with Accumulator
    private AND(addr: number, value:number):void {
        this.A &= value;
        this.Z = this.A===0x00;
        this.N = (this.A & 0x0080)==0x0080;
    }

    // Shift Left One Bit (Memory or Accumulator)
    private ASL(addr: number, value:number):void {
        const temp = value << 1;
        this.Z = (temp & 0x00FF)==0x00;
        this.C = (temp & 0xFF00) > 0;
        this.N = (temp & 0x80)===0x0080;

        if (this.immediateValue) {
            this.A = (temp & 0x00FF) as Uint8;
        } else {
            this.memory.set(addr, (temp & 0x00FF) as Uint8);
        }
    }

    // Branch on Carry Clear
    private BCC(addr: number, value:number):void {
        if (!this.C) this._BRANCH(addr);
    }

    // Branch on Carry Set
    private BCS(addr: number, value:number):void {
        if (this.C) this._BRANCH(addr);
    }

    // Branch on Result Zero
    private BEQ(addr: number, value:number):void {
        if (this.Z) this._BRANCH(addr);
    }

    // Branch on Result Minus
    private BMI(addr: number, value:number):void {
        if (this.N) this._BRANCH(addr);
    }

    // Branch on Result not Zero
    private BNE(addr: number, value:number):void {
        if (!this.Z) this._BRANCH(addr);
    }

    private _BRANCH(addr: number):void {
        this.clock++;
        const addressAbsolute = (this.PC + addr) & 0xffff;
        if ((addressAbsolute & 0xFF00) != (this.PC & 0xFF00)) this.clock++;
        this.PC = addressAbsolute;
    }

    private BIT(addr: number, value:number) {
        const temp = this.A & value;
        this.Z = (temp & 0x00FF)===0x00;
        this.N = (value & 0x80)===0x80;
        this.V = (value & 0x40)===0x40;
    }

    // addressing modes
    private accumulator():Uint8 {
        this.immediateValue = true;
        return this.A;
    }

    private implied():Uint8 {
        this.immediateValue = true;
        return 0;
    }

    private immediate() { // #oper
        this.immediateValue = true;
        return this.memory.get(this.PC + 1);
    }

    private zeroPage() { // oper
        this.immediateValue = false;
        const mem = this.memory.get(this.PC+1);
        return mem & 0x00FF;
    }

    private zeroPageX() { // oper,X
        this.immediateValue = false;
        const mem = this.memory.get(this.PC+1)+this.X;
        return mem & 0x00FF;
    }

    private zeroPageY() { // oper,Y
        this.immediateValue = false;
        const mem = this.memory.get(this.PC+1)+this.Y;
        return mem & 0x00FF;
    }

    private absolute() { // oper
        this.immediateValue = false;
        const lo = this.memory.get(this.PC+1);
        const hi = this.memory.get(this.PC+2);
        return (hi << 8) | lo;
    }

    private relative() { // oper
        this.immediateValue = true;
        let addr = this.memory.get(this.PC+1);
        if ((addr & 0x80)===0x80) addr |= 0xFF00;
        return addr;
    }

    private absoluteX() { // oper,X
        this.immediateValue = false;
        const lo = this.memory.get(this.PC+1);
        const hi = this.memory.get(this.PC+2);
        const addr = ((hi << 8) | lo) + this.X;
        if ((addr & 0xFF00) != (hi << 8)) this.clock++;
        return addr;
    }

    private absoluteY() { // oper,Y
        this.immediateValue = false;
        const lo = this.memory.get(this.PC+1);
        const hi = this.memory.get(this.PC+2);
        const addr = ((hi << 8) | lo) + this.Y;
        if ((addr & 0xFF00) != (hi << 8)) this.clock++;
        return addr;
    }

    private indirect() { // ($LLHH)
        this.immediateValue = false;
        const lo = this.memory.get(this.PC + 1);
        const hi = this.memory.get(this.PC + 2);
        const pointer = (hi << 8) | lo;
        return ((pointer + 1) << 8) | (pointer);
    }

    private indirectX() { // (oper,X)
        this.immediateValue = false;
        const t = this.memory.get(this.PC + 1);
        const lo = this.memory.get((t+this.X) & 0x00FF);
        const hi = this.memory.get((t+this.X+1) & 0x00FF);
        return (hi << 8) | lo;
    }

    private indirectY() { // (oper),Y
        this.immediateValue = false;
        const t = this.memory.get(this.PC + 1);
        const lo = this.memory.get(t);
        const hi = this.memory.get((t + 1) & 0x00FF);
        const addr = ((hi << 8) | lo) + this.Y;
        if ((addr & 0xFF00) != (hi<<8)) this.clock++;
        return addr;
    }

    public step() {
        const commandValue = this.memory.get(this.PC);
        const command = this.commandsMap[commandValue];
        if (command===undefined) {
            console.error(this.memory);
            throw new Error(`wrong command: 0x${commandValue.toString(16)} (${commandValue})`);
        }
        this.clock = command.cycles;
        const addrOrImmediateValue = command.addrGetter();
        const value = this.immediateValue?addrOrImmediateValue:this.memory.get(addrOrImmediateValue);
        command.execution(addrOrImmediateValue,value);
        if (!this.halt) this.PC+=command.size;
    }

    public tick() {
        if (this.halt) return;
        if (this.clock>0) this.clock--;
        else {
            this.step();
        }
    }

}



// var disassembly={
//     0x00:"BRK",
//     0x01:"ORA (zp,X)",
//     0x05:"ORA zp",
//     0x06:"ASL zp",
//     0x08:"PHP",
//     0x09:"ORA #",
//     0x0A:"ASL ",
//     0x0D:"ORA Abs",
//     0x0E:"ASL Abs",
//     0x10:"BPL ",
//     0x11:"ORA (zp),Y",
//     0x15:"ORA zp,X",
//     0x16:"ASL zp,X",
//     0x18:"CLC",
//     0x19:"ORA Abs,Y",
//     0x1D:"ORA Abs,X",
//     0x1E:"ASL Abs,X",
//     0x20:"JSR Abs",
//     0x21:"AND (zp,X)",
//     0x24:"BIT zp",
//     0x25:"AND zp",
//     0x26:"ROL zp",
//     0x28:"PLP",
//     0x29:"AND #",
//     0x2A:"ROL ",
//     0x2C:"BIT Abs",
//     0x2D:"AND Abs",
//     0x2E:"ROL Abs",
//     0x30:"BMI ",
//     0x31:"AND (zp),Y",
//     0x35:"AND zp,X",
//     0x36:"ROL zp,X",
//     0x38:"SEC",
//     0x39:"AND Abs,Y",
//     0x3D:"AND Abs,X",
//     0x3E:"ROL Abs,X",
//     0x40:"RTI",
//     0x41:"EOR (zp,X)",
//     0x45:"EOR zp",
//     0x46:"LSR zp",
//     0x48:"PHA",
//     0x49:"EOR #",
//     0x4A:"LSR ",
//     0x4C:"JMP Abs",
//     0x4D:"EOR Abs",
//     0x4E:"LSR Abs",
//     0x50:"BVC ",
//     0x51:"EOR (zp),Y",
//     0x55:"EOR zp,X",
//     0x56:"LSR zp,X",
//     0x58:"CLI",
//     0x59:"EOR Abs,Y",
//     0x5D:"EOR Abs,X",
//     0x5E:"LSR Abs,X",
//     0x60:"RTS",
//     0x61:"ADC (zp,X)",
//     0x65:"ADC zp",
//     0x66:"ROR zp",
//     0x68:"PLA",
//     0x69:"ADC #",
//     0x6A:"ROR ",
//     0x6C:"JMP (Abs)",
//     0x6D:"ADC Abs",
//     0x6E:"ROR Abs",
//     0x70:"BVS ",
//     0x71:"ADC (zp),Y",
//     0x75:"ADC zp,X",
//     0x76:"ROR zp,X",
//     0x78:"SEI",
//     0x79:"ADC Abs,Y",
//     0x7D:"ADC Abs,X",
//     0x7E:"ROR Abs,X",
//     0x81:"STA (zp,X)",
//     0x84:"STY zp",
//     0x85:"STA zp",
//     0x86:"STX zp",
//     0x88:"DEY",
//     0x8A:"TXA",
//     0x8C:"STY Abs",
//     0x8D:"STA Abs",
//     0x8E:"STX Abs",
//     0x90:"BCC ",
//     0x91:"STA (zp),Y",
//     0x94:"STY zp,X",
//     0x95:"STA zp,X",
//     0x96:"STX zp,Y",
//     0x98:"TYA",
//     0x99:"STA Abs,Y",
//     0x9A:"TXS",
//     0x9D:"STA Abs,X",
//     0xA0:"LDY #",
//     0xA1:"LDA (zp,X)",
//     0xA2:"LDX #",
//     0xA4:"LDY zp",
//     0xA5:"LDA zp",
//     0xA6:"LDX zp",
//     0xA8:"TAY",
//     0xA9:"LDA #",
//     0xAA:"TAX",
//     0xAC:"LDY Abs",
//     0xAD:"LDA Abs",
//     0xAE:"LDX Abs",
//     0xB0:"BCS ",
//     0xB1:"LDA (zp),Y",
//     0xB4:"LDY zp,X",
//     0xB5:"LDA zp,X",
//     0xB6:"LDX zp,Y",
//     0xB8:"CLV",
//     0xB9:"LDA Abs,Y",
//     0xBA:"TSX",
//     0xBC:"LDY Abs,X",
//     0xBD:"LDA Abs,X",
//     0xBE:"LDX Abs,Y",
//     0xC0:"CPY #",
//     0xC1:"CMP (zp,X)",
//     0xC4:"CPY zp",
//     0xC5:"CMP zp",
//     0xC6:"DEC zp",
//     0xC8:"INY",
//     0xC9:"CMP #",
//     0xCA:"DEX",
//     0xCC:"CPY Abs",
//     0xCD:"CMP Abs",
//     0xCE:"DEC Abs",
//     0xD0:"BNE ",
//     0xD1:"CMP (zp),Y",
//     0xD5:"CMP zp,X",
//     0xD6:"DEC zp,X",
//     0xD8:"CLD",
//     0xD9:"CMP Abs,Y",
//     0xDD:"CMP Abs,X",
//     0xDE:"DEC Abs,X",
//     0xE0:"CPX #",
//     0xE1:"SBC (zp,X)",
//     0xE4:"CPX zp",
//     0xE5:"SBC zp",
//     0xE6:"INC zp",
//     0xE8:"INX",
//     0xE9:"SBC #",
//     0xEA:"NOP",
//     0xEC:"CPX Abs",
//     0xED:"SBC Abs",
//     0xEE:"INC Abs",
//     0xF0:"BEQ ",
//     0xF1:"SBC (zp),Y",
//     0xF5:"SBC zp,X",
//     0xF6:"INC zp,X",
//     0xF8:"SED",
//     0xF9:"SBC Abs,Y",
//     0xFD:"SBC Abs,X",
//     0xFE:"INC Abs,X",
// };
