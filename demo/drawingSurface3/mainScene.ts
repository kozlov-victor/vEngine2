import {Scene} from "@engine/scene/scene";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {DrawingSurface} from "@engine/renderable/impl/surface/drawingSurface";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable";

export class MainScene extends Scene {

    public onPreloading():void {
        const rect = new Rectangle(this.game);
        rect.fillColor.setRGB(10,100,100);
        rect.size.height = 10;
        this.preloadingGameObject = rect;
    }

    public onProgress(val: number):void {
        this.preloadingGameObject.size.width = val*this.game.size.width;
    }

    public onReady():void {
        const surface:DrawingSurface = new DrawingSurface(this.game,this.game.size);
        this.appendChild(surface);
        surface.setDrawColor(6,222,200);
        surface.setFillColor(12,122,3);
        surface.setLineWidth(2);
        surface.drawPolygon('m 124.84504,0.23952666 c 0,0 -13.74018,12.20413334 -28.234227,16.01835434 C 82.116778,20.072101 65.3376,37.620676 65.3376,37.620676 63.244534,34.02857 63.709738,28.294887 73.42163,16.677053 54.326654,29.67448 47.286482,35.619756 38.301013,45.1508 c -5.87025,6.226671 -0.02793,9.219247 -8.293615,11.871547 -7.505466,2.408369 -12.396263,3.310782 -18.174095,5.269588 -11.48712063,3.894381 -13.0946328,6.859291 -10.5541494,15.1351 0.5943905,-0.622722 1.1904625,-1.203948 1.7814805,-1.75154 0.8898373,1.427867 2.4388378,2.472137 4.3114821,3.338405 -1.1849006,-1.688558 -1.931453,-3.424399 -2.1108298,-5.224678 1.1447512,-0.898321 2.2798448,-1.672189 3.4132568,-2.335386 0.3088079,1.668753 1.1445837,3.076237 2.6797058,4.131837 -0.347946,-1.743621 -0.632647,-3.497892 -0.08982,-5.464206 1.563707,-0.70668 3.109982,-1.227263 4.655801,-1.616805 0.03253,1.457118 0.419335,2.838843 1.047931,4.176749 0.09511,-1.515511 0.593202,-3.076086 1.556924,-4.715684 1.743515,-0.28773 3.483246,-0.440476 5.209707,-0.523966 -0.104343,1.496281 0.407358,2.83676 1.227575,4.101897 0.03507,-1.47332 0.351826,-2.872429 1.0629,-4.176748 1.476127,-0.03287 2.948513,-0.04903 4.416276,-0.07485 -0.543803,1.773063 0.644762,3.324263 2.350356,4.655802 -0.477741,-1.758074 -0.857387,-3.064818 1.526983,-4.805506 1.591521,-0.120162 3.041507,-0.324665 4.386335,-0.628758 -0.136335,1.229979 -0.08346,2.501603 1.182663,4.012073 -0.06145,-1.481794 0.411732,-3.073866 1.541954,-4.820477 4.306936,-1.610276 7.454554,-4.572388 10.673913,-9.401426 0.709814,8.872638 -1.159194,14.092276 -6.422313,17.829776 -0.796388,-0.851001 -1.467025,-1.775728 -1.43716,-3.098878 -0.744583,1.425744 -0.601007,2.855796 -0.434143,4.281541 -0.436226,0.248725 -0.889181,0.49699 -1.362308,0.733551 -1.214607,0.607306 -2.43823,1.123883 -3.667755,1.586865 -0.686867,-1.08361 -0.901363,-2.403814 -0.628757,-3.967163 -0.979828,1.470815 -1.644338,3.053804 -1.78148,4.805507 -1.755617,0.556617 -3.503588,1.010209 -5.224679,1.42219 -0.678957,-1.092324 -0.74352,-2.541053 -0.628758,-4.086926 -1.137987,1.553777 -1.823018,3.116991 -1.901244,4.670772 -1.629107,0.369839 -3.217242,0.730452 -4.745624,1.122782 -1.107318,-1.098872 -1.755372,-2.53644 -1.721599,-4.491127 -0.835814,2.290547 -0.935774,3.837435 -0.868284,5.224678 -1.242493,0.387919 -2.429152,0.813673 -3.547991,1.332368 -1.392561,-1.039067 -2.039422,-2.486872 -1.991066,-4.326453 -0.937882,2.508819 -1.228328,4.505475 -0.673669,5.853436 -0.619384,0.423714 -1.213424,0.87583 -1.766511,1.39225 -1.310997,-0.748253 -2.58023,-1.128292 -4.0869259,-3.637813 -0.331351,2.771722 0.3312422,4.873241 1.7665109,6.467225 -0.198808,0.316652 -0.402142,0.644524 -0.583847,0.98805 5.613085,5.786648 0.381015,11.483591 8.293615,15.090181 0,0 -4.059102,-7.910041 5.224678,-15.284801 9.762193,-7.754799 26.103746,-13.258334 35.719433,-8.203792 4.903861,2.577744 10.931491,1.435474 15.733917,0.808402 -10.154396,-5.929057 -3.988257,-15.237652 5.344439,-12.96439 9.866264,2.40323 10.679171,18.303572 -0.763491,29.746238 -11.442665,11.442653 -64.786599,55.474413 -56.618146,92.457343 10.845418,109.359 132.613881,37.5121 148.356901,109.5835 7.45558,34.13154 -27.04878,67.11782 -45.24062,84.82243 -13.79226,13.29274 -26.541023,17.26835 -41.977067,14.2219 -29.58348,-5.83858 -18.510851,-35.88121 -5.658821,-42.0669 11.399112,-5.4864 34.142338,-13.53646 60.540398,5.71871 8.16569,-6.35661 13.51427,-14.08008 17.41061,-21.15321 -24.52393,-14.61194 -32.96936,-15.96481 -59.058335,-18.84776 -71.965166,-7.95251 -87.295532,76.24228 -50.135949,98.61018 23.81146,14.33311 54.337794,23.86817 103.924684,-5.77859 30.60312,-18.29682 58.00609,-51.46762 68.8939,-91.39443 4.75001,2.72121 11.64812,4.58901 24.34191,0.49402 -11.92502,-4.04902 -17.38467,-6.83536 -21.54244,-12.87456 1.3127,-7.33796 1.90725,-14.2703 1.93118,-20.82387 5.19084,1.01316 12.09923,0.46109 22.41072,-6.43728 -11.67018,-0.58129 -17.69997,-1.64592 -23.02451,-5.52409 -0.84098,-7.77906 -2.49263,-14.97334 -4.70071,-21.64723 5.39657,-0.59068 12.01103,-3.15132 19.85079,-13.65302 -11.67295,3.48516 -17.74004,4.43496 -24.35689,2.21562 -2.84628,-6.12258 -6.42418,-11.71267 -10.82362,-16.63214 4.47502,-3.34089 9.1173,-8.94645 10.09007,-22.8299 -7.70935,8.98133 -12.25518,13.08518 -18.71303,14.8806 -5.67898,-4.32594 -12.30801,-7.83886 -19.98552,-10.38947 2.03915,-4.75148 2.90085,-11.47698 -1.07787,-22.62032 -3.11302,10.19183 -5.47256,15.72585 -9.70084,19.82084 -7.01556,-1.36532 -14.75106,-2.05747 -23.24906,-1.99106 0.45028,-4.54461 -0.48187,-10.42875 -4.55101,-18.56333 -1.59772,9.00734 -3.04198,14.53609 -5.76362,18.81783 -7.88842,0.13501 -14.83901,-0.0707 -21.28794,-0.67367 1.9205,-4.54952 2.71284,-10.99176 -0.23952,-21.31788 -3.92875,10.40914 -6.69181,15.82691 -11.542201,19.67113 -2.950359,-0.56022 -5.84657,-1.22353 -8.74273,-2.00604 -8.428692,-2.27732 -15.495086,-14.13749 -19.087289,-19.49149 4.947373,-0.35915 11.073247,-2.59757 18.952557,-10.04516 -11.360219,1.34509 -17.464501,1.3332 -23.249068,-1.42218 -1.276319,-9.16533 1.60516,-19.22189 7.440301,-27.18629 3.086278,4.5018 8.494994,9.16163 21.617288,11.0332 -8.713453,-8.63806 -12.443676,-13.51463 -13.638052,-20.46457 4.121077,-4.91886 7.987435,-9.87923 11.407462,-14.85066 3.752979,3.42347 9.739602,6.37927 21.138232,6.58698 -8.47092,-6.54185 -12.82076,-10.71618 -15.150064,-16.15308 6.738124,-11.959498 10.372494,-23.838435 8.637934,-35.150562 9.35601,2.294955 17.6571,8.712745 27.11144,22.784985 -8.64247,-20.50192 -17.68206,-33.284253 -32.50079,-41.063872 12.23318,-5.535565 30.02978,-5.738976 47.0221,2.889292 C 137.96095,46.992839 120.5154,42.415719 97.868336,46.168788 104.85916,39.172306 122.43231,30.338738 147.83961,35.524816 125.82093,26.11225 104.44983,29.548074 91.236437,36.857184 c 0,0 -1.870313,-10.489484 12.245813,-16.018354 11.64986,-4.562912 21.36279,-20.59930422 21.36279,-20.59930422 z M 48.256346,42.69565 c -0.117396,5.200702 -2.693,9.168846 -5.000123,9.700836 -1.886522,0.435008 -3.821233,-1.584211 -1.497042,-2.994086 1.759962,-1.067609 5.021267,-2.506842 6.497165,-6.70675 z M 201.79302,373.79653 c -4.39549,6.41522 -5.60404,10.3132 -18.4735,23.47362 0,0 15.75691,34.13001 -4.94025,69.25318 -19.24276,32.65505 -7.12569,69.38016 30.50973,88.04107 -2.35892,0.53453 -3.22743,1.61997 -2.26053,4.9103 1.6156,5.49786 27.23929,17.16544 64.67223,5.70375 -30.68209,-0.56729 -43.10862,-8.80337 -45.71967,-16.07828 -1.73315,-4.82886 -6.65318,-5.77164 -11.40747,-4.52101 -1.90191,0.50022 -2.95845,1.9793 -2.91923,3.65277 -32.70941,-25.84393 -27.62325,-47.99124 -11.49729,-78.57978 18.96916,-35.9817 18.59585,-69.62869 2.03598,-95.85562 z');
        surface.addBehaviour(new DraggableBehaviour(this.game));
    }

}
