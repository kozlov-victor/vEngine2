import {Scene} from "@engine/scene/scene";
import {Font} from "@engine/renderable/impl/general/font/font";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {Resource} from "@engine/resources/resourceDecorators";
import {EditTextField} from "@engine/renderable/impl/ui/textField/editTextField/editTextField";
import {ColorFactory} from "@engine/renderer/common/colorFactory";
// https://getemoji.com/

// const text:string=
// `Lorem ipsum dolor sit 📯 amet,\t\n\r
// 😀 🥰 consectetur 🖐 🩸 adipiscing elit,
// sed do eiusmod
// tempor incididunt ut labore et
// dolore magna aliqua.
// Ut enim ad minim veniam,
// quis nostrud exercitation
// ullamco laboris nisi ut
// aliquip ex ea
// commodo`;

const text =
`940 REM The IBM Personal Computer Donkey
950 REM Version 1.10 (C)Copyright IBM Corp 1981, 1982
960 REM Licensed Material - Program Property of IBM
975 DEF SEG: POKE 106,0
980 SAMPLES$="NO"
990 GOTO 1010
1000 SAMPLES$="YES"
1010 KEY OFF:SCREEN 0,1:COLOR 15,0,0:WIDTH 40:CLS:LOCATE 5,19:PRINT "IBM"
1020 LOCATE 7,12,0:PRINT "Personal Computer"
1030 COLOR 10,0:LOCATE 10,9,0:PRINT CHR$(213)+STRING$(21,205)+CHR$(184)
1040 LOCATE 11,9,0:PRINT CHR$(179)+"       DONKEY        "+CHR$(179)
1050 LOCATE 12,9,0:PRINT CHR$(179)+STRING$(21,32)+CHR$(179)
1060 LOCATE 13,9,0:PRINT CHR$(179)+"    Version 1.1O     "+CHR$(179)
1070 LOCATE 14,9,0:PRINT CHR$(212)+STRING$(21,205)+CHR$(190)
1080 COLOR 15,0:LOCATE 17,4,0:PRINT "(C) Copyright IBM Corp 1981, 1982"
1090 COLOR 14,0:LOCATE 23,7,0:PRINT "Press space bar to continue"
1100 IF INKEY$<>"" THEN GOTO 1100
1110 CMD$ = INKEY$
1120 IF CMD$ = "" THEN GOTO 1110
1130 IF CMD$ = CHR$(27) THEN GOTO 1298
1140 IF CMD$ = " " THEN GOTO 1160
1150 GOTO 1110
1160 DEF SEG=0
1170 IF (PEEK(&H410) AND &H30)<>&H30 THEN DEF SEG:GOTO 1291
1180 WIDTH 80:CLS:LOCATE 3,1
1190 PRINT "HOLD IT!"
1200 PRINT "YOU'RE NOT USING THE COLOR/GRAPHICS MONITOR ADAPTER!"
1210 PRINT "THIS PROGRAM USES GRAPHICS AND REQUIRES THAT ADAPTER."
1220 PRINT "PRESS THE SPACE BAR TO CONTINUE."
1230 DEF SEG
1240 IF INKEY$<>"" THEN GOTO 1240
1250 CMD$ = INKEY$
1260 IF CMD$ = "" THEN GOTO 1250
1270 IF CMD$ = CHR$(27) THEN GOTO 1298
1280 IF CMD$ = " " THEN GOTO 1298
1290 GOTO 1250
1291 KEY OFF
1292 ON ERROR GOTO 1295
1293 PLAY "p16"
1294 GOTO 1300
1295 COLOR 31,0,0
1296 PRINT "THIS PROGRAM REQUIRES ADVANCED BASIC -- USE COMMAND 'BASICA'":COLOR 15,0,0:FOR I=1 TO 9000:NEXT: RESUME 1298
1298 ON ERROR GOTO 0
1299 SCREEN 0,1:IF SAMPLES$="YES" THEN CHAIN"samples",1000 ELSE COLOR 7,0,0:CLS:END
1300 REM
1410 COLOR 0
1420 DEFINT A-Y
1440 SCREEN 1,0:COLOR 8,1
1450 DIM Q%(500)
1460 DIM D1%(150),D2%(150),C1%(200),C2%(200)
1470 DIM DNK%(300)
1480 GOSUB 1940
1490 GOSUB 1780
1500 CLS
1510 DIM B%(300)
1520 FOR I=2 TO 300:B%(I)=-16384+192:NEXT
1530 B%(0)=2:B%(1)=193
1540 REM
1550 CX=110:CLS
1590 LINE (0,0)-(305,199),,B
1600 LINE (6,6)-(97,195),1,BF
1610 LINE (183,6)-(305,195),1,BF
1620 LOCATE 3,5:PRINT "Donkey"
1630 LOCATE 3,29:PRINT "Driver"
1631 LOCATE 19,25:PRINT"Press Space  ";
1632 LOCATE 20,25:PRINT"Bar to switch";
1633 LOCATE 21,25:PRINT"lanes        ";
1635 LOCATE 23,25:PRINT"Press ESC    ";
1636 LOCATE 24,25:PRINT"to exit      ";
1640 FOR Y=4 TO 199 STEP 20:LINE(140,Y)-(140,Y+10):NEXT
1650 CY=105:CX=105
1660 LINE (100,0)-(100,199):LINE(180,0)-(180,199)
1670 LOCATE 5,6:PRINT SD:LOCATE 5,31:PRINT SM
1680 CY=CY-4:IF CY<60 THEN 2230
1690 PUT (CX,CY),CAR%,PRESET
1700 DX=105+42*INT(RND*2)
1710 FOR Y=(RND*-4)*8 TO 124 STEP 6
1720 SOUND 20000,1
1730 A$=INKEY$:IF A$=CHR$(27) THEN 1298 ELSE POKE 106,0:IF LEN(A$)>0 THEN LINE (CX,CY)-(CX+28,CY+44),0,BF:CX=252-CX:PUT (CX,CY),CAR%,PRESET:SOUND 200,1
1740 IF Y=>3 THEN PUT (DX,Y),DNK%,PSET
1750 IF CX=DX AND Y+25>=CY THEN 2060
1760 IF Y AND 3 THEN PUT (140,6),B%
1770 NEXT:LINE (DX,124)-(DX+32,149),0,BF:GOTO 1670
1780 CLS
1790 DRAW "S8C3"
1800 DRAW"BM12,1r3m+1,3d2R1ND2u1r2d4l2u1l1"
1810 DRAW"d7R1nd2u2r3d6l3u2l1d3m-1,1l3"
1820 DRAW"m-1,-1u3l1d2l3u6r3d2nd2r1u7l1d1l2"
1830 DRAW"u4r2d1nd2R1U2"
1840 DRAW"M+1,-3"
1850 DRAW"BD10D2R3U2M-1,-1L1M-1,1"
1860 DRAW"BD3D1R1U1L1BR2R1D1L1U1
1870 DRAW"BD2BL2D1R1U1L1BR2R1D1L1U1
1880 DRAW"BD2BL2D1R1U1L1BR2R1D1L1U1
1890 LINE(0,0)-(40,60),,B
1900 PAINT (1,1)
1910 DIM CAR%(900)
1920 GET(1,1)-(29,45),CAR%
1930 RETURN
1940 CLS
1950 DRAW"S08"
1960 DRAW "BM14,18"
1970 DRAW"M+2,-4R8M+1,-1U1M+1,+1M+2,-1
1980 DRAW"M-1,1M+1,3M-1,1M-1,-2M-1,2"
1990 DRAW"D3L1U3M-1,1D2L1U2L3D2L1U2M-1,-1"
2000 DRAW"D3L1U5M-2,3U1"
2010 PAINT (21,14),3
2020 PRESET (37,10):PRESET (40,10)
2030 PRESET (37,11):PRESET (40,11)
2040 GET (13,0)-(45,25),DNK%
2050 RETURN
2060 SD=SD+1:LOCATE 14,6:PRINT "BOOM!"
2070 GET (DX,Y)-(DX+16,Y+25),D1%
2080 D1X=DX:D1Y=Y:D2X=DX+17
2090 GET (DX+17,Y)-(DX+31,Y+25),D2%
2100 GET (CX,CY)-(CX+14,CY+44),C1%
2110 GET (CX+15,CY)-(CX+28,CY+44),C2%
2120 C1X=CX:C1Y=CY:C2X=CX+15
2130 FOR P=6 TO 0 STEP -1:Z=1/(2^P):Z1=1-Z
2140 PUT (C1X,C1Y),C1%:PUT(C2X,C1Y),C2%
2150 PUT (D1X,D1Y),D1%:PUT(D2X,D1Y),D2%
2160 C1X=CX*Z1:D1Y=Y*Z1:C2X=C2X+(291-C2X)*Z
2170 D1X=DX*Z1:C1Y=C1Y+(155-C1Y)*Z:D2X=D2X+(294-D2X)*Z
2180 PUT (C1X,C1Y),C1%:PUT(C2X,C1Y),C2%
2190 PUT (D1X,D1Y),D1%:PUT(D2X,D1Y),D2%
2200 SOUND 37+RND*200,4:NEXT
2210 FOR Y=1 TO 2000:NEXT
2220 CLS:GOTO 1540
2230 SM=SM+1:LOCATE 7,25:PRINT "Donkey loses!"
2240 FOR Y=1 TO 1000:NEXT
2250 CLS:GOTO 1540`;


// const text =
// `abaca\n
// gg `;


export class MainScene extends Scene {

    @Resource.FontFromCssDescription({fontFamily:'monospace',fontSize:15,extraChars:['😀','🥰','🖐','🩸','📯']})
    public readonly fnt:Font;


    public override onReady():void {

        const tf:EditTextField = new EditTextField(this.game,this.fnt);
        tf.cursorColor = ColorFactory.fromCSS(`#ffd8d8`);

        tf.pos.setXY(50,50);
        tf.size.setWH(700,420);
        //tf.setAlignText(AlignText.JUSTIFY);
        //tf.setWordBrake(WordBrake.PREDEFINED_BREAK_LONG_WORDS);
        // tf.setAlignTextContentHorizontal(AlignTextContentHorizontal.CENTER);
        // tf.setAlignTextContentVertical(AlignTextContentVertical.TOP);
        tf.textColor.setFrom(ColorFactory.fromCSS('#0cc306'));
        const background = new Rectangle(this.game);
        background.fillColor = ColorFactory.fromCSS('#03164c');
        background.borderRadius = 5;
        tf.setText(text);
        tf.setBackground(background);
        tf.setPadding(10);
        tf.setMargin(20);
        this.appendChild(tf);
        this.backgroundColor = ColorFactory.fromCSS('#e0e6fc');
        document.body.style.backgroundColor = this.backgroundColor.asCssRgba();
    }

}
