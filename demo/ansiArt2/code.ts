
// original data from PK-01 LVIV assembler file
// ; ÄÐÀÊÎÍ×ÈÊ
// ; 10 POKE36864,110:POKE36865,85:POKE73,00:POKE74,128:X=USR(X)
// ;run
//
//
//
// BEGIN	EQU	8000h
// ORG	BEGIN-016h
//
// DB	"LVOV/2.0/"
// DB	0D0h
// DB	"PROBA1"
// DW	BEGIN
// DW	BEGIN+END-START
// DW	BEGIN
//
// START:
//     PUSH B
// PUSH D
// PUSH H
// PUSH PSW
// MVI A ,0FDh
// OUT 0C2h
// CALL LABEL1
// LXI D, 09010h ; ÃÄÅ ëåæèò â ïàìÿòè
// LHLD  09000h   ; ÑÒÈÒÛÂÀÅÌ êîîðäèíàòû
// MVI B ,023h  ; ÐÀÇÌÅÐÛ ñïðàéòà ÂÛÑÎÒÀ
// MVI C ,09h  ; ØÈÐÈÍÀ
// LDAX D
// MOV M,A
// INX H
// INX D
// DCR C
// JNZ  8015h
// DCR B
// JZ  802Ah
// PUSH D
// LXI D, 0037h
// DAD D
// POP D
// JMP  8013h
// MVI A ,0FFh
// OUT 0C2h
// POP PSW
// POP H
// POP D
// POP B
// LABEL2:	JMP LABEL2
// LABEL1:
//     MVI A, 0	;32772	------------
//     STA 0BE38h	;32774
// CALL 0EBBCh	;
// RET
// EQU	9000h
// ORG
// DB 110,85 ; ýòî êîîðäèíàòû
// EQU	9010h
// ORG       ; ýòî äðàêîøà
// DB 0,0,0,0,119,0,0,0,0
// DB 0,0,0,0,248,136,0,0,0
// DB 0,0,0,16,240,243,0,0,0
// DB 0,0,0,48,240,243,0,0,0
// DB 0,0,0,112,240,241,0,0,0
// DB 0,0,0,225,120,240,0,0,0
// DB 0,0,16,225,120,240,136,00,0
// DB 0,0,48,240,240,240,204,00,0
// DB 0,0,240,240,240,240,238,00,0
// DB 0,240,240,240,240,240,204,0,0
// DB 0,240,240,244,240,240,136,00,0
// DB 0,0,255,248,240,241,0,0,0
// DB 0,0,240,240,240,243,0,0,0
// DB 0,0,16,240,240,247,0,0,0
// DB 0,0,0,7,15,0,0,0,0
// DB 0,0,0,15,15,0,0,0,0
// DB 0,0,0,15,15,0,0,0,0
// DB 0,0,1,15,15,0,0,0,0
// DB 0,0,3,15,15,0,0,0,0
// DB 0,0,7,7,15,0,0,0,0
// DB 0,0,14,7,7,0,0,0,0
// DB 0,0,0,15,7,0,0,0,0
// DB 0,225,15,15,7,8,0,0,0
// DB 0,225,15,15,7,8,0,0,0
// DB 0,225,15,15,7,192,0,0,0
// DB 0,0,0,0,7,12,0,0,0
// DB 0,0,15,15,15,14,0,0,0
// DB 0,0,15,15,15,14,0,0,0
// DB 0,0,15,15,15,15,0,0,0
// DB 0,0,7,7,15,15,0,0,0
// DB 0,0,3,7,7,15,8,0,0
// DB 0,0,1,7,7,15,8,0,0
// DB 0,0,17,7,7,15,12,0,0
// DB 0,0,119,255,207,15,12,0,0
// DB 0,0,119,255,00,15,00,00,0
//
// END


const data:number[] = [
    0,0,0,0,119,0,0,0,0,
    0,0,0,0,248,136,0,0,0,
    0,0,0,16,240,243,0,0,0,
    0,0,0,48,240,243,0,0,0,
    0,0,0,112,240,241,0,0,0,
    0,0,0,225,120,240,0,0,0,
    0,0,16,225,120,240,136,0,0,
    0,0,48,240,240,240,204,0,0,
    0,0,240,240,240,240,238,0,0,
    0,240,240,240,240,240,204,0,0,
    0,240,240,244,240,240,136,0,0,
    0,0,255,248,240,241,0,0,0,
    0,0,240,240,240,243,0,0,0,
    0,0,16,240,240,247,0,0,0,
    0,0,0,7,15,0,0,0,0,
    0,0,0,15,15,0,0,0,0,
    0,0,0,15,15,0,0,0,0,
    0,0,1,15,15,0,0,0,0,
    0,0,3,15,15,0,0,0,0,
    0,0,7,7,15,0,0,0,0,
    0,0,14,7,7,0,0,0,0,
    0,0,0,15,7,0,0,0,0,
    0,225,15,15,7,8,0,0,0,
    0,225,15,15,7,8,0,0,0,
    0,225,15,15,7,192,0,0,0,
    0,0,0,0,7,12,0,0,0,
    0,0,15,15,15,14,0,0,0,
    0,0,15,15,15,14,0,0,0,
    0,0,15,15,15,15,0,0,0,
    0,0,7,7,15,15,0,0,0,
    0,0,3,7,7,15,8,0,0,
    0,0,1,7,7,15,8,0,0,
    0,0,17,7,7,15,12,0,0,
    0,0,119,255,207,15,12,0,0,
    0,0,119,255,0,15,0,0,0,
];

const leftPad = (s:string,toLength:number):string=>{
    let pad = "";
    for (let i=s.length;i<toLength;i++) pad+="0";
    return pad + s;
};

const toBin = (n:number)=>{
    return leftPad(n.toString(2), 8);
};

const strLength = 9;


export const RESULT = (reverted:boolean):string=>{
    let str = '';
    for (let i=0;i<data.length/strLength;i++) {
        let res = '';
        for (let j=0;j<strLength;j++) {
            res+=toBin(data[i*strLength+j]);
        }
        if (reverted) res = res.split('').reverse().join('');
        str+=(res.split('0').join('-').split('1').join('+'))+'\n';
    }
    return str;
};
