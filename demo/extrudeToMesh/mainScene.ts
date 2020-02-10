
import {Scene} from "@engine/scene/scene";
import {Color} from "@engine/renderer/common/color";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable";
import {PolyLine} from "@engine/renderable/impl/geometry/polyLine";
import {Polygon} from "@engine/renderable/impl/geometry/polygon";
import {NullGameObject} from "@engine/renderable/impl/general/nullGameObject";
import {ResourceLink} from "@engine/resources/resourceLink";
import {ICubeMapTexture} from "@engine/renderer/common/texture";


export class MainScene extends Scene {


    private cubeTextureLink:ResourceLink<ICubeMapTexture>;


    public onPreloading() {


        // https://onlinefontconverter.com/
        // https://gero3.github.io/facetype.js/

        this.cubeTextureLink = this.resourceLoader.loadCubeTexture(
            './cubeMapTexture/textures/cm_left.jpg',
            './cubeMapTexture/textures/cm_right.jpg',
            './cubeMapTexture/textures/cm_top.jpg',
            './cubeMapTexture/textures/cm_bottom.jpg',
            './cubeMapTexture/textures/cm_front.jpg',
            './cubeMapTexture/textures/cm_back.jpg',
        );




    }

    public onProgress(val: number) {

    }

    public onReady() {

        const path = `

            M302,59 C 302,59,302,59,300,59 299,59,298,60,297,60 297,60,294.70709228515625,60.29289245605469,294,61 293.29290771484375,61.70710754394531,293,62,292,62 291,62,289.4142150878906,61.585784912109375,288,63 287.29290771484375,63.70710754394531,286.92388916015625,63.61731719970703,286,64 284.6934509277344,64.54119873046875,284,65,283,66 283,66,282,66,281,66 281,66,280,67,280,67 279,68,278,68,277,69 276,70,275,71,274,72 273,73,272,75,271,76 270,77,268.54119873046875,78.69343566894531,268,80 267.6173095703125,80.92388153076172,267,81,267,83 267,84,267,85,267,85 267,86,267.45880126953125,86.69343566894531,268,88 268.3826904296875,88.92388153076172,268.85272216796875,90.173095703125,270,91 271.8139953613281,92.30744934082031,274.8682861328125,94.28858947753906,279,96 281.92156982421875,97.21015167236328,284.0534973144531,97.54049682617188,286,98 288.1762390136719,98.51374053955078,289,99,289,99 290,100,290.07611083984375,99.61731719970703,291,100 292.3065490722656,100.54119873046875,292.29290771484375,101.29289245605469,293,102 293.70709228515625,102.70710754394531,294,104,294,105 294,106,294,107,294,107 294,110,294,110,294,111 294,112,295,114,295,115 295,116,295,117,295,117 295,118,295.29290771484375,118.29289245605469,296,119 296.70709228515625,119.70710754394531,296.6934509277344,121.45880126953125,298,122 298.92388916015625,122.38268280029297,298.6934509277344,122.45880126953125,300,123 300.92388916015625,123.38268280029297,300.85272216796875,123.173095703125,302,124 303.8139953613281,125.30744934082031,306,125,309,125 310,125,312,125,313,125 314,125,315,125,315,125 315,125,316,125,316,125 316,125,317,125,317,126 317,127,317,129,317,130 317,133,318.173095703125,134.8527374267578,319,136 320.3074645996094,137.81399536132812,320,139,321,140 322,141,324,142,324,142 325,142,325.8237609863281,143.4862518310547,328,144 328.9732360839844,144.22975158691406,330,145,332,145 334,145,335,146,336,146 337,146,338,146,339,146 340,146,341.1860046386719,145.3074493408203,343,144 344.14727783203125,143.173095703125,344.173095703125,142.1472625732422,345,141 346.3074645996094,139.18600463867188,346.6934509277344,137.54119873046875,348,137 348.92388916015625,136.6173095703125,349,136,350,135 350,135,351,134,351,134 352,134,353,136,355,138 357,140,360,143,363,146 367,150,370,153,374,157 377,160,379.1860046386719,160.6925506591797,381,162 382.14727783203125,162.826904296875,384,163,384,163 386,163,386,163,387,163 388,163,389,163,390,163 390,163,390,162,391,161 392,160,393,158,393,158 394,157,394.85272216796875,154.826904296875,396,154 397.8139953613281,152.6925506591797,399.1860046386719,151.3074493408203,401,150 402.14727783203125,149.173095703125,403.4188537597656,147.58114624023438,405,146 406.5811462402344,144.41885375976562,408.1860046386719,145.3074493408203,410,144 411.14727783203125,143.173095703125,411.6934509277344,142.54119873046875,413,142 413.92388916015625,141.6173095703125,414,142,415,141 415,141,415,141,416,141 416,141,417,141,417,140 417,140,418.3826904296875,139.9238739013672,418,139 417.45880126953125,137.6934356689453,417.70709228515625,137.7071075439453,417,137 416.29290771484375,136.2928924560547,415.70709228515625,135.7071075439453,415,135 413.5857849121094,133.58578491210938,412,134,412,134 410,133,409,133,408,132 408,132,406.8477478027344,131.76536560058594,405,131 403.6934509277344,130.45880126953125,403,130,402,129 402,129,401,129,400,128 400,128,399.3065490722656,127.54119873046875,398,127 397.07611083984375,126.61731719970703,396,127,396,127 395,127,394,127,394,127 393,126,391.9732360839844,126.22975158691406,391,126 388.8237609863281,125.48625946044922,387.92388916015625,125.38268280029297,387,125 385.6934509277344,124.45880126953125,384,124,382,124 381,124,379,124,378,124 377,124,375,124,373,124 373,124,372,123,370,123 370,123,367.70709228515625,123.70710754394531,367,123 366.29290771484375,122.29289245605469,365,122,364,122 364,122,362.70709228515625,121.70710754394531,362,121 361.29290771484375,120.29289245605469,361,120,361,119 361,119,361,119,361,118 361,118,361,117,361,117 361,116,361,115,361,114 361,114,361,113,363,111 363,111,364.29290771484375,110.70710754394531,365,110 365.70709228515625,109.29289245605469,366,109,367,108 368,107,368.6934509277344,106.54119873046875,370,106 371.8477478027344,105.23463439941406,372,105,374,105 375,105,376,104,377,104 378,104,379,104,380,104 381,104,382,104,383,104 385,104,386,104,388,104 389,104,390,104,392,103 394,102,394.8237609863281,101.51374053955078,397,101 397.9732360839844,100.77024841308594,399.6934509277344,99.54119873046875,401,99 401.92388916015625,98.61731719970703,402.29290771484375,98.70710754394531,403,98 403.70709228515625,97.29289245605469,404.29290771484375,96.70710754394531,405,96 405.70709228515625,95.29289245605469,405,94,405,94 406,93,406,92,406,92 406,91,406,90,406,89 406,88,405,87,405,87 404,86,403.5257263183594,84.85065460205078,403,84 401.8244323730469,82.09788513183594,400.3065490722656,82.54119873046875,399,82 398.07611083984375,81.61731719970703,396.3065490722656,81.54119873046875,395,81 392.2283630371094,79.8519515991211,391,81,389,81 387,81,385,81,384,81 381,81,379,81,377,81 376,81,374.6131286621094,81.91761016845703,372,83 370.1522521972656,83.76536560058594,367.97418212890625,83.67963409423828,366,84 362.8785705566406,84.50653839111328,361.7716369628906,84.8519515991211,359,86 357.6934509277344,86.54119873046875,355,88,354,88 353,88,352,89,352,89 351,89,351,89,350,89 350,89,349,88,349,88 349,86,349,85,349,83 349,81,348.234619140625,78.8477554321289,349,77 349.54119873046875,75.69343566894531,350,75,350,74 350,73,350,72,350,71 350,70,351,69,351,68 351,66,351.234619140625,64.8477554321289,352,63 352.54119873046875,61.69343566894531,352.6173095703125,59.92387771606445,353,59 353.54119873046875,57.69343566894531,354,57,354,56 354,56,354,55,354,54 354,54,354,53,354,51 354,51,354,50,354,49 354,48,353,47,352,46 352,46,350,45,349,45 348,45,347,45,345,45 344,45,343,45,342,45 340,45,340.3065490722656,45.458805084228516,339,46 337.1522521972656,46.76536560058594,336.3065490722656,47.458805084228516,335,48 333.1522521972656,48.76536560058594,332.902099609375,49.82442855834961,331,51 330.14935302734375,51.52573013305664,329.70709228515625,52.29289245605469,329,53 328.29290771484375,53.70710754394531,327.54119873046875,53.69343566894531,327,55 326.6173095703125,55.92387771606445,327,56,327,57 327,58,327,59,327,61 327,63,327.2297668457031,65.02674865722656,327,66 326.48626708984375,68.17625427246094,326.70709228515625,68.29289245605469,326,69 325.29290771484375,69.70710754394531,325,70,325,70 325,69,325,68,325,67 325,65,324,63,324,62 324,62,323,60,323,58 323,57,323,56,323,55 323,54,323,52,323,52 323,51,323,50,323,49 323,48,323.765380859375,46.84775924682617,323,45 322.45880126953125,43.69343566894531,322.3826904296875,43.92387771606445,322,43 321.45880126953125,41.69343566894531,321,42,321,42 321,41,320.70709228515625,41.70710754394531,320,41 319.29290771484375,40.29289245605469,319,39,319,39 318,38,317,37,316,37 316,37,315,36,314,36 314,36,313,35,312,35 311,35,311,35,310,35 310,35,310,35,309,35 309,35,309,35,308,35 308,35,307,35,306,35 306,35,305,36,305,36 305,36,303.54119873046875,35.69343566894531,303,37 302.6173095703125,37.92387771606445,303,38,302,39 302,39,301.70709228515625,39.29289245605469,301,40 300.29290771484375,40.70710754394531,300,42,300,42 300,42,299.70709228515625,42.29289245605469,299,43 298.29290771484375,43.70710754394531,299,44,299,45 299,46,299.3826904296875,46.07612228393555,299,47 298.45880126953125,48.30656433105469,298,48,298,49 298,49,298,49,298,50 298,50,298,50,298,51 298,51,298,51,297,52 297,52,297,53,297,53 297,54,297,54,297,54 297,55,297,55,297,56 297,56,297,56,297,57 297,57,297,58,296,58 296,58,296,58,296,59 296,59,296,59,296,60 L 297,61 297,61 297,61 z
            `;

        const p:Polygon = Polygon.fromSvgPath(this.game,path);
        const m = p.extrudeToMesh(50);
        m.setWH(150);
        m.transformPoint.setToCenter();
        m.cubeMapTexture = this.cubeTextureLink.getTarget();
        m.reflectivity = 0.1;
        m.pos.setXY(200,200);
        m.addBehaviour(new DraggableBehaviour(this.game));
        this.appendChild(m);
        m.setInterval(()=>{
            m.angle3d.y+=0.01;
            //m.angle3d.z+=0.01;
        },1);
    }

}
