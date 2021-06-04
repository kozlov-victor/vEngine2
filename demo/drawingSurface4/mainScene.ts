import {Scene} from "@engine/scene/scene";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {DrawingSurface} from "@engine/renderable/impl/surface/drawingSurface";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable";

export class MainScene extends Scene {

    public override onPreloading():void {
        const rect = new Rectangle(this.game);
        rect.fillColor.setRGB(10,100,100);
        rect.size.height = 10;
        this.preloadingGameObject = rect;
    }

    public override onProgress(val: number):void {
        this.preloadingGameObject.size.width = val*this.game.size.width;
    }

    // https://svgsilh.com/3f51b5/image/2055208.html
    public override onReady():void {
        const surface:DrawingSurface = new DrawingSurface(this.game,this.game.size);
        this.appendChild(surface);
        surface.setDrawColor(0,12,2);
        surface.setFillColor(12,122,3);
        surface.setLineWidth(1);
        surface.transformTranslate(0,1280);
        surface.transformScale(0.1,-0.1);
        surface.drawPolygon('M8338 11691 c-145 -47 -225 -135 -251 -276 -11 -57 -16 -66 -57 -97 -141 -107 -138 -264 8 -416 60 -61 248 -206 344 -264 l57 -34 -204 4 c-304 7 -512 -20 -733 -94 -349 -117 -606 -333 -712 -597 -17 -42 -30 -79 -30 -84 0 -4 -18 -30 -41 -58 -42 -53 -93 -127 -142 -210 -29 -49 -28 -48 65 40 l93 89 6 -90 c17 -233 107 -424 285 -600 238 -237 551 -341 689 -230 29 23 30 28 29 98 0 61 -6 85 -30 138 -40 86 -73 123 -136 154 -70 35 -112 34 -149 -3 -24 -24 -29 -38 -29 -76 0 -56 20 -97 55 -113 34 -16 35 -15 35 6 0 28 11 34 32 15 37 -33 16 -73 -40 -73 -107 0 -229 139 -247 283 -15 118 38 263 124 339 25 22 109 82 186 133 139 91 143 96 309 284 283 323 446 446 665 502 131 33 169 28 322 -45 74 -35 167 -76 206 -92 40 -16 73 -32 73 -35 0 -3 -42 1 -92 8 -141 21 -433 21 -543 -1 -176 -34 -296 -79 -405 -151 -140 -93 -210 -203 -218 -341 -5 -100 12 -164 76 -289 105 -201 287 -319 402 -260 45 23 66 91 53 169 -25 147 -141 298 -215 278 -22 -5 -58 -58 -58 -85 0 -9 15 -26 33 -37 45 -26 58 -40 52 -51 -12 -19 -46 -8 -85 27 -79 71 -86 186 -20 319 122 249 524 429 875 394 96 -10 202 -36 212 -52 4 -6 -3 -8 -19 -4 -14 4 -73 2 -130 -3 -325 -31 -568 -177 -648 -388 -26 -68 -31 -180 -11 -262 51 -209 214 -407 309 -374 39 14 76 93 80 175 3 55 0 77 -18 115 -38 77 -118 110 -142 58 -11 -23 -9 -28 12 -45 21 -15 23 -21 14 -36 -20 -33 -47 -21 -74 32 -22 44 -25 63 -25 160 0 121 13 174 68 279 69 130 225 240 381 267 137 23 301 -4 401 -66 l40 -25 -55 7 c-30 5 -118 8 -195 8 -126 -1 -148 -4 -220 -29 -200 -69 -305 -191 -305 -353 0 -102 52 -179 137 -202 88 -25 187 72 213 208 18 94 -19 156 -90 154 -81 -4 -100 -38 -55 -97 29 -38 31 -49 11 -65 -23 -19 -54 3 -67 49 -16 54 7 115 67 170 75 69 129 80 202 41 44 -24 67 -91 31 -91 -6 0 -9 7 -5 15 9 24 -22 18 -39 -9 -28 -43 17 -106 65 -91 30 9 60 54 60 89 0 45 -32 90 -81 113 l-42 20 69 7 c114 11 177 -4 243 -60 21 -17 31 -35 31 -54 0 -32 -23 -55 -45 -46 -17 6 -21 46 -4 46 5 0 7 5 4 10 -13 21 -57 10 -91 -24 -29 -29 -34 -41 -34 -79 0 -77 69 -132 136 -107 101 39 148 177 89 264 -28 41 -32 40 90 26 571 -66 1230 -455 1523 -899 188 -285 305 -576 359 -900 25 -147 24 -499 -1 -661 -82 -532 -199 -934 -375 -1295 l-78 -160 -138 -143 c-146 -152 -311 -296 -460 -402 -92 -65 -337 -212 -343 -205 -5 5 46 82 103 155 28 36 88 116 133 177 76 105 80 113 60 117 -77 16 -78 15 -177 -52 -204 -138 -623 -460 -900 -691 l-115 -95 40 -17 39 -17 -65 -29 c-36 -16 -75 -33 -86 -38 -12 -6 -68 -65 -124 -132 -79 -94 -130 -144 -225 -217 -79 -61 -142 -120 -176 -163 -108 -138 -287 -305 -706 -657 -205 -171 -260 -223 -171 -157 23 17 44 29 46 26 9 -9 -84 -122 -183 -220 -183 -183 -565 -493 -720 -583 -25 -15 95 116 365 398 630 658 1019 1034 1440 1391 121 103 215 196 530 523 111 117 109 115 -120 -73 -672 -555 -1055 -919 -1710 -1626 -418 -450 -483 -526 -514 -592 -11 -22 -59 -74 -116 -125 l-98 -88 -28 37 c-15 20 -33 53 -40 74 -8 21 -46 83 -86 139 -39 55 -73 107 -74 116 -5 33 -59 97 -250 298 -258 270 -314 332 -308 339 4 3 -335 316 -406 374 -2 2 1 8 9 12 23 15 -578 550 -895 797 -98 76 -185 145 -194 152 -40 35 25 -10 155 -106 128 -94 140 -101 144 -80 4 28 -9 39 -284 251 -263 201 -474 372 -587 474 -48 43 -109 95 -135 117 -63 51 -386 350 -541 501 -350 340 -571 678 -767 1175 -88 221 -220 630 -250 770 -41 189 -44 196 -39 80 14 -303 92 -627 250 -1037 208 -539 433 -892 837 -1309 66 -68 116 -124 112 -124 -11 0 -254 203 -362 303 -55 50 -113 103 -130 117 -16 14 -23 21 -15 15 20 -13 15 -5 -69 116 -189 269 -355 606 -468 947 -83 252 -160 576 -182 762 -12 104 -8 345 8 440 6 39 8 41 13 20 5 -20 8 -14 14 30 53 388 246 783 528 1085 230 246 674 487 1113 602 95 25 112 27 355 27 188 0 288 -5 380 -17 558 -78 993 -282 1346 -632 105 -104 238 -276 286 -368 31 -61 30 -38 -2 52 l-30 83 20 65 c11 36 23 90 26 119 4 30 10 54 15 54 4 0 59 -41 121 -91 219 -175 322 -192 273 -44 -48 143 -202 331 -392 479 -38 29 -64 58 -68 74 -3 15 -28 72 -55 127 -302 624 -1011 1069 -1882 1181 -125 16 -130 15 -230 -6 -207 -43 -507 -136 -693 -215 -639 -272 -1173 -676 -1655 -1255 -106 -127 -290 -365 -290 -374 0 -15 50 -3 81 19 19 14 131 123 249 243 223 225 384 367 555 489 101 72 259 173 271 173 3 0 -30 -38 -75 -86 -44 -47 -111 -124 -148 -172 -37 -48 -121 -143 -188 -212 -66 -69 -151 -164 -188 -210 -73 -91 -204 -282 -253 -367 -16 -29 -34 -53 -41 -53 -18 0 -56 -54 -102 -145 -38 -74 -65 -138 -151 -362 -32 -86 -45 -99 -59 -61 -6 16 -15 -6 -39 -98 -31 -117 -72 -333 -72 -380 0 -36 -59 -213 -84 -250 -41 -63 -86 -53 -200 45 -37 33 -81 63 -98 66 -94 21 -150 -140 -164 -468 -5 -126 -3 -179 5 -195 15 -28 26 -22 51 29 11 21 27 39 35 39 32 0 80 -151 93 -295 7 -81 9 -86 16 -50 35 193 59 247 109 253 64 8 124 -112 267 -533 56 -165 157 -437 223 -605 66 -168 155 -412 199 -543 88 -265 121 -354 174 -460 39 -76 114 -207 120 -207 2 0 -32 69 -76 153 -86 166 -133 279 -128 311 2 14 24 -17 72 -99 65 -115 254 -403 297 -455 26 -31 -8 32 -157 290 -126 220 -174 313 -232 450 -46 110 -86 229 -79 236 2 2 24 -42 48 -98 40 -93 48 -105 86 -126 33 -18 59 -48 117 -136 211 -322 517 -706 1016 -1276 234 -267 322 -362 222 -240 -144 177 -276 364 -398 563 -75 122 -88 152 -56 125 9 -8 62 -43 117 -78 87 -55 136 -100 378 -344 272 -275 276 -279 204 -181 -129 177 -147 203 -147 209 0 21 108 -58 284 -207 110 -95 210 -179 221 -187 11 -8 -66 77 -172 190 -274 294 -663 735 -663 752 0 3 18 2 40 -2 32 -6 58 -24 123 -86 175 -167 362 -329 333 -289 -22 30 -9 21 49 -35 l78 -75 -108 130 c-150 180 -153 186 -32 60 58 -60 111 -109 117 -107 5 1 81 -67 168 -151 86 -85 184 -172 218 -193 42 -27 115 -98 234 -229 96 -104 199 -208 229 -231 99 -72 214 -134 239 -127 20 5 5 23 -130 167 -145 153 -163 176 -73 97 22 -20 11 -4 -25 34 -36 39 -81 88 -100 110 -31 36 -29 35 20 -10 30 -27 108 -101 172 -163 71 -69 121 -111 128 -107 19 12 -91 117 -480 463 -346 309 -593 540 -500 471 128 -97 490 -400 930 -779 307 -264 380 -325 380 -317 0 3 -123 119 -273 258 -305 284 -598 569 -690 673 -77 87 -64 79 91 -52 185 -157 343 -302 712 -656 357 -343 408 -391 565 -531 154 -139 65 -39 -277 311 -160 165 -321 330 -357 369 -56 59 -52 56 28 -20 143 -137 625 -628 815 -830 93 -99 268 -275 390 -391 121 -116 366 -355 544 -531 l323 -321 137 131 c733 702 1555 1397 2362 1996 194 145 191 143 -152 -80 -142 -92 -258 -164 -258 -159 0 4 62 68 138 140 132 128 278 258 740 660 241 209 304 266 282 254 -8 -4 -82 -52 -165 -106 -119 -79 -139 -89 -95 -51 155 137 463 405 525 459 95 83 409 405 524 538 239 278 441 598 566 896 15 36 55 112 90 170 86 145 127 220 122 220 -3 0 -15 -17 -28 -37 -45 -77 -102 -163 -105 -161 -2 2 15 57 37 123 106 323 201 797 218 1087 30 515 -104 987 -410 1442 -106 158 -191 259 -348 416 -266 264 -568 473 -925 640 -137 64 -196 84 -331 110 -137 27 -217 72 -270 152 -42 64 -45 128 -5 128 27 0 36 -21 16 -35 -15 -12 -15 -13 0 -19 28 -11 69 -6 92 10 32 22 31 91 -2 127 -35 38 -96 53 -148 38 -63 -19 -98 -60 -98 -113 1 -75 38 -133 140 -218 l25 -20 -30 6 c-211 42 -455 154 -549 253 -27 28 -27 30 -12 59 24 47 83 58 110 21 18 -26 11 -46 -17 -55 -20 -6 -20 -7 -1 -21 27 -20 129 -13 179 13 76 39 104 118 71 198 -28 68 -124 116 -230 116 -92 0 -149 -23 -212 -86 l-54 -54 -30 52 c-63 110 -126 307 -137 428 -5 60 -3 68 21 97 45 54 122 53 114 -1 -2 -16 -9 -20 -30 -18 -22 2 -29 -2 -34 -23 -8 -32 -5 -35 44 -42 61 -8 146 21 191 66 52 52 62 104 30 161 -58 103 -216 147 -361 101z m-6121 -6496 c122 -148 316 -359 521 -568 85 -87 152 -160 150 -163 -10 -9 -468 449 -561 559 -92 110 -186 233 -222 292 -28 45 -1 16 112 -120z m3506 -1564 c37 -29 66 -56 63 -58 -5 -5 -216 165 -216 174 0 3 19 -10 43 -29 23 -18 73 -58 110 -87z');
        surface.transformRestore();
        surface.addBehaviour(new DraggableBehaviour(this.game));
    }
}
