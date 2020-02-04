
import {Scene} from "@engine/scene/scene";
import {Color} from "@engine/renderer/common/color";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable";
import {PolyLine} from "@engine/renderable/impl/geometry/polyLine";

const font = {"glyphs":{"a":{"ha":799,"x_min":18,"x_max":786,"o":"m 786 0 q 763 17 774 11 q 685 149 704 47 q 650 318 663 261 q 624 518 624 451 q 631 574 624 565 q 699 647 669 622 l 335 647 q 126 653 324 647 q 132 635 126 643 q 197 588 183 610 q 207 535 207 572 q 169 308 207 490 q 124 106 138 153 q 75 47 115 76 q 19 14 60 36 q 18 0 18 8 l 364 0 q 303 31 303 31 q 261 93 261 53 q 286 186 261 172 q 539 189 456 186 q 552 146 546 179 q 558 96 558 113 q 533 31 558 53 q 467 0 515 15 l 786 0 m 532 314 q 300 308 525 308 q 338 544 324 464 l 482 544 q 504 471 499 511 q 511 407 506 446 q 532 314 525 342 "},"b":{"ha":685,"x_min":7,"x_max":663,"o":"m 663 203 q 631 297 663 246 q 560 365 599 347 q 619 489 619 419 q 544 628 619 574 q 389 676 476 676 q 231 633 299 676 q 218 636 222 632 q 220 697 218 657 q 222 757 222 736 q 8 583 94 607 q 24 567 7 574 q 63 550 58 551 q 92 506 83 539 q 99 450 94 493 q 103 263 99 318 l 104 243 q 86 89 111 154 q 57 42 78 68 q 18 0 50 33 l 453 0 q 486 8 443 0 q 611 76 560 22 q 663 203 663 129 m 483 481 q 458 439 483 458 q 346 388 418 408 l 224 351 l 224 435 q 282 519 224 481 q 383 557 336 557 q 451 535 418 557 q 483 481 483 514 m 526 197 q 499 143 526 167 q 442 119 472 119 l 224 119 l 224 231 q 424 281 374 281 q 494 261 465 281 q 526 197 526 238 "},"c":{"ha":664,"x_min":17,"x_max":644,"o":"m 644 593 q 481 633 581 589 q 319 681 376 681 q 90 556 178 681 q 17 326 17 450 q 103 88 17 188 q 331 -17 194 -17 q 528 60 451 -17 q 622 253 599 129 q 501 314 589 265 q 419 356 426 356 l 401 356 q 450 218 450 250 q 415 137 450 167 q 328 107 379 107 q 192 190 242 107 q 151 335 151 257 q 183 464 151 397 q 311 557 228 557 q 370 538 344 557 q 396 486 396 518 q 391 457 396 476 q 386 428 386 438 q 644 593 519 497 "},"d":{"ha":710,"x_min":15,"x_max":682,"o":"m 682 344 q 633 541 682 465 q 474 663 585 617 q 383 675 443 675 q 311 667 338 675 q 236 632 293 661 q 231 740 228 681 l 136 656 q 21 588 68 594 q 53 564 25 576 q 89 536 82 551 q 107 310 107 496 q 79 68 107 106 q 15 0 35 18 l 329 -7 q 590 83 493 -11 q 682 344 682 172 m 546 344 q 381 124 546 135 q 238 124 254 115 l 238 422 q 280 512 238 474 q 375 550 322 550 q 504 486 457 550 q 546 344 546 429 "},"e":{"ha":767,"x_min":17,"x_max":757,"o":"m 757 0 q 569 214 681 67 q 568 163 574 192 q 532 117 560 117 l 264 117 l 264 269 l 413 269 q 510 165 450 269 l 510 479 q 403 382 433 382 l 264 382 l 264 535 q 500 533 382 533 q 542 499 528 533 q 554 453 547 476 q 736 654 704 608 l 28 654 q 29 644 28 653 q 140 493 140 601 l 140 350 q 128 83 140 206 q 117 63 121 72 q 17 0 54 17 l 757 0 "},"f":{"ha":721,"x_min":1,"x_max":699,"o":"m 699 650 l 1 650 q 57 608 1 647 q 108 535 108 572 l 108 108 q 97 69 108 92 q 72 42 86 47 q 17 18 26 22 q 236 -236 165 -74 q 240 -121 236 -215 q 242 -6 243 -61 q 239 215 239 121 q 247 225 246 222 q 328 225 328 225 q 463 133 433 224 q 475 128 471 128 l 475 435 q 457 424 465 435 q 393 350 435 365 q 308 343 374 343 l 278 343 q 238 343 250 342 l 238 528 q 468 528 325 529 q 525 471 525 526 q 524 447 525 463 q 522 425 522 432 l 699 650 "}},"familyName":"Mortal Kombat 4","ascender":1111,"descender":-312,"underlinePosition":-185,"underlineThickness":28,"boundingBox":{"yMin":-312,"xMin":-39,"yMax":1281,"xMax":1685},"resolution":1000,"original_font_information":{"format":0,"copyright":"Mortal Kombat 4 Font v. 1.0 - Copyright 1997, The Realm of Mortal Kombat - Mortal Kombat 4 is TM and Copyright 1997, Midway Manufactoring Company.","fontFamily":"Mortal Kombat 4","fontSubfamily":"Regular","uniqueID":"Altsys Fontographer 4.0 MK4","fullName":"Mortal Kombat 4","version":"Altsys Fontographer 4.1 7/28/1997","postScriptName":"MortalKombat4","trademark":""},"cssFontWeight":"normal","cssFontStyle":"normal"};

export class MainScene extends Scene {



    public onPreloading() {

        const path = font.glyphs.b.o.toUpperCase();
        console.log(path);

        const polyLine1:PolyLine = PolyLine.fromSvgPath(this.game,path);

        polyLine1.pos.setXY(0,0);
        polyLine1.color = Color.RGB(100,20,222);
        polyLine1.scale.setXY(0.5,0.5);
        polyLine1.lineWidth = 2;
        this.appendChild(polyLine1);
        polyLine1.addBehaviour(new DraggableBehaviour(this.game));

    }

    public onProgress(val: number) {

    }

    public onReady() {

    }

}
