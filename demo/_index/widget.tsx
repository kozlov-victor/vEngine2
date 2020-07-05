import {VEngineTsxComponent} from "@engine/renderable/tsx/genetic/vEngineTsxComponent";
import {VEngineTsxFactory} from "@engine/renderable/tsx/genetic/vEngineTsxFactory.h";
import {HtmlTsxDOMRenderer} from "@engine/renderable/tsx/dom/htmlTsxDOMRenderer";

const style = `

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }
        #frame {
            width: 320px;
            height: 240px;
            box-shadow: 0 0 2px black;
            margin: 5px;
        }
        #frameLoadingInfo {
            position: absolute;
            top: 20px;
            left: 20px
        }
        .layout {
            display: flex;
            flex-direction: column;
        }
        html,body,.layout {
            height: 100%;
        }
        body  {
            position: fixed;
            overflow: hidden;
            width: 100%;
            height: 100%;
        }
        .up,.down {
            display: flex;
            margin: 0 auto;
            position: relative;
        }
        .up {
            display: block;
            dislpay: flex;
            width: 320px;
        }
        .down {
            flex: 1;
            overflow-y: scroll;
            -webkit-overflow-scrolling: touch;
            width: 100%;
        }
        /* hide hosting ads */
        div[style] {
            display: none;
        }
        #list {
            display: block;
            width: 100%;
            text-align: center;
        }
        #list li {
            padding: 10px;
        }
        .active {
            background-color: aqua;
        }


`;

const items = [
    {
        "title": "atlas",
        "name": "atlas"
    },
    {
        "title": "basic",
        "name": "basic"
    },
    {
        "title": "basicBase64",
        "name": "basicBase64"
    },
    {
        "title": "basicWithDI",
        "name": "basicWithDI"
    },
    {
        "title": "billBoardSprites",
        "name": "billBoardSprites"
    },
    {
        "title": "camera",
        "name": "camera"
    },
    {
        "title": "cameraScreenToWorld",
        "name": "cameraScreenToWorld"
    },
    {
        "title": "catGame",
        "name": "catGame"
    },
    {
        "title": "chip8",
        "name": "chip8"
    },
    {
        "title": "cubeMapTexture",
        "name": "cubeMapTexture"
    },
    {
        "title": "cubeMapTextureBlur",
        "name": "cubeMapTextureBlur"
    },
    {
        "title": "dataTexture",
        "name": "dataTexture"
    },
    {
        "title": "debugToScreen",
        "name": "debugToScreen"
    },
    {
        "title": "dragAndDrop",
        "name": "dragAndDrop"
    },
    {
        "title": "drawingSurface",
        "name": "drawingSurface"
    },
    {
        "title": "drawingSurface2",
        "name": "drawingSurface2"
    },
    {
        "title": "drawingSurface3",
        "name": "drawingSurface3"
    },
    {
        "title": "drawingSurface4",
        "name": "drawingSurface4"
    },
    {
        "title": "drawingSurface5",
        "name": "drawingSurface5"
    },
    {
        "title": "drawingSurface6",
        "name": "drawingSurface6"
    },
    {
        "title": "drawingSurfaceArc",
        "name": "drawingSurfaceArc"
    },
    {
        "title": "drawingSurfaceArc2",
        "name": "drawingSurfaceArc2"
    },
    {
        "title": "dwitter1",
        "name": "dwitter1"
    },
    {
        "title": "dwitter10",
        "name": "dwitter10"
    },
    {
        "title": "dwitter11",
        "name": "dwitter11"
    },
    {
        "title": "dwitter12",
        "name": "dwitter12"
    },
    {
        "title": "dwitter13",
        "name": "dwitter13"
    },
    {
        "title": "dwitter14",
        "name": "dwitter14"
    },
    {
        "title": "dwitter15",
        "name": "dwitter15"
    },
    {
        "title": "dwitter16",
        "name": "dwitter16"
    },
    {
        "title": "dwitter2",
        "name": "dwitter2"
    },
    {
        "title": "dwitter3",
        "name": "dwitter3"
    },
    {
        "title": "dwitter4",
        "name": "dwitter4"
    },
    {
        "title": "dwitter5",
        "name": "dwitter5"
    },
    {
        "title": "dwitter6",
        "name": "dwitter6"
    },
    {
        "title": "dwitter7",
        "name": "dwitter7"
    },
    {
        "title": "dwitter8",
        "name": "dwitter8"
    },
    {
        "title": "dwitter9",
        "name": "dwitter9"
    },
    {
        "title": "extrudeToMesh",
        "name": "extrudeToMesh"
    },
    {
        "title": "filters",
        "name": "filters"
    },
    {
        "title": "filterStack",
        "name": "filterStack"
    },
    {
        "title": "fnt",
        "name": "fnt"
    },
    {
        "title": "fnt2",
        "name": "fnt2"
    },
    {
        "title": "font",
        "name": "font"
    },
    {
        "title": "fontTtf",
        "name": "fontTtf"
    },
    {
        "title": "fontTtf2",
        "name": "fontTtf2"
    },
    {
        "title": "frameAnimation",
        "name": "frameAnimation"
    },
    {
        "title": "frameAnimation2",
        "name": "frameAnimation2"
    },
    {
        "title": "gamepad",
        "name": "gamepad"
    },
    {
        "title": "glitchFilter",
        "name": "glitchFilter"
    },
    {
        "title": "glowAndShadow",
        "name": "glowAndShadow"
    },
    {
        "title": "lensDistortion",
        "name": "lensDistortion"
    },
    {
        "title": "light",
        "name": "light"
    },
    {
        "title": "lightNormalMap",
        "name": "lightNormalMap"
    },
    {
        "title": "lightNormalMap2",
        "name": "lightNormalMap2"
    },
    {
        "title": "longLoading",
        "name": "longLoading"
    },
    {
        "title": "lowFPS",
        "name": "lowFPS"
    },
    {
        "title": "mk-alfa",
        "name": "mk-alfa"
    },
    {
        "title": "model3d",
        "name": "model3d"
    },
    {
        "title": "model3d2",
        "name": "model3d2"
    },
    {
        "title": "model3dCubeNormalMap",
        "name": "model3dCubeNormalMap"
    },
    {
        "title": "model3dCubeTextured",
        "name": "model3dCubeTextured"
    },
    {
        "title": "model3dFromMesh",
        "name": "model3dFromMesh"
    },
    {
        "title": "model3dFromObj",
        "name": "model3dFromObj"
    },
    {
        "title": "model3dFromObj2",
        "name": "model3dFromObj2"
    },
    {
        "title": "model3dFromObj3",
        "name": "model3dFromObj3"
    },
    {
        "title": "model3dFromObj4",
        "name": "model3dFromObj4"
    },
    {
        "title": "model3dFromObj5",
        "name": "model3dFromObj5"
    },
    {
        "title": "model3dFromObj6",
        "name": "model3dFromObj6"
    },
    {
        "title": "model3dFromObj7",
        "name": "model3dFromObj7"
    },
    {
        "title": "model3dFromObj8",
        "name": "model3dFromObj8"
    },
    {
        "title": "model3dFromObj9",
        "name": "model3dFromObj9"
    },
    {
        "title": "model3dTeapot",
        "name": "model3dTeapot"
    },
    {
        "title": "model3dTrackBall",
        "name": "model3dTrackBall"
    },
    {
        "title": "model3dWireFrame",
        "name": "model3dWireFrame"
    },
    {
        "title": "moonAnimation",
        "name": "moonAnimation"
    },
    {
        "title": "motionBlurFilter",
        "name": "motionBlurFilter"
    },
    {
        "title": "mouseEnterMouseLeave",
        "name": "mouseEnterMouseLeave"
    },
    {
        "title": "multiImageAnim",
        "name": "multiImageAnim"
    },
    {
        "title": "multiImageAnim2",
        "name": "multiImageAnim2"
    },
    {
        "title": "ninePatchImage",
        "name": "ninePatchImage"
    },
    {
        "title": "offsetMap",
        "name": "offsetMap"
    },
    {
        "title": "oldSymbolScreen",
        "name": "oldSymbolScreen"
    },
    {
        "title": "particles",
        "name": "particles"
    },
    {
        "title": "particles2",
        "name": "particles2"
    },
    {
        "title": "particlesFire",
        "name": "particlesFire"
    },
    {
        "title": "physicsBasic",
        "name": "physicsBasic"
    },
    {
        "title": "physicsBasic2",
        "name": "physicsBasic2"
    },
    {
        "title": "physicsBasicParticles",
        "name": "physicsBasicParticles"
    },
    {
        "title": "pixelPerfectStretch",
        "name": "pixelPerfectStretch"
    },
    {
        "title": "pixelPerfectStretch2",
        "name": "pixelPerfectStretch2"
    },
    {
        "title": "pixelPerfectStretch3",
        "name": "pixelPerfectStretch3"
    },
    {
        "title": "plasma",
        "name": "plasma"
    },
    {
        "title": "pointGeometry",
        "name": "pointGeometry"
    },
    {
        "title": "polygon",
        "name": "polygon"
    },
    {
        "title": "polylines",
        "name": "polylines"
    },
    {
        "title": "polylines10",
        "name": "polylines10"
    },
    {
        "title": "polylines11",
        "name": "polylines11"
    },
    {
        "title": "polylines12",
        "name": "polylines12"
    },
    {
        "title": "polylines13",
        "name": "polylines13"
    },
    {
        "title": "polylines14",
        "name": "polylines14"
    },
    {
        "title": "polylines15",
        "name": "polylines15"
    },
    {
        "title": "polylines16",
        "name": "polylines16"
    },
    {
        "title": "polylines2",
        "name": "polylines2"
    },
    {
        "title": "polylines3",
        "name": "polylines3"
    },
    {
        "title": "polylines4",
        "name": "polylines4"
    },
    {
        "title": "polylines5",
        "name": "polylines5"
    },
    {
        "title": "polylines6",
        "name": "polylines6"
    },
    {
        "title": "polylines7",
        "name": "polylines7"
    },
    {
        "title": "polylines8",
        "name": "polylines8"
    },
    {
        "title": "polylines9",
        "name": "polylines9"
    },
    {
        "title": "propertyAnimation",
        "name": "propertyAnimation"
    },
    {
        "title": "propertyAnimation2",
        "name": "propertyAnimation2"
    },
    {
        "title": "propertyAnimation3",
        "name": "propertyAnimation3"
    },
    {
        "title": "propertyAnimation4",
        "name": "propertyAnimation4"
    },
    {
        "title": "propertyAnimation5",
        "name": "propertyAnimation5"
    },
    {
        "title": "propertyAnimation6",
        "name": "propertyAnimation6"
    },
    {
        "title": "propertyAnimation7",
        "name": "propertyAnimation7"
    },
    {
        "title": "renderSceneToTexture",
        "name": "renderSceneToTexture"
    },
    {
        "title": "renderToTexture",
        "name": "renderToTexture"
    },
    {
        "title": "renderToTexture2",
        "name": "renderToTexture2"
    },
    {
        "title": "repeatingTexture",
        "name": "repeatingTexture"
    },
    {
        "title": "scaling",
        "name": "scaling"
    },
    {
        "title": "sceneTransition",
        "name": "sceneTransition"
    },
    {
        "title": "sceneTransitionWithFilters",
        "name": "sceneTransitionWithFilters"
    },
    {
        "title": "scml",
        "name": "scml"
    },
    {
        "title": "scml2",
        "name": "scml2"
    },
    {
        "title": "scml3",
        "name": "scml3"
    },
    {
        "title": "scml4",
        "name": "scml4"
    },
    {
        "title": "scml5",
        "name": "scml5"
    },
    {
        "title": "scml6",
        "name": "scml6"
    },
    {
        "title": "shapes",
        "name": "shapes"
    },
    {
        "title": "skew",
        "name": "skew"
    },
    {
        "title": "slotMashine",
        "name": "slotMashine"
    },
    {
        "title": "sound",
        "name": "sound"
    },
    {
        "title": "spline",
        "name": "spline"
    },
    {
        "title": "spriteRotation3d",
        "name": "spriteRotation3d"
    },
    {
        "title": "spriteZposition",
        "name": "spriteZposition"
    },
    {
        "title": "steamSeaBattle",
        "name": "steamSeaBattle"
    },
    {
        "title": "tileMap",
        "name": "tileMap"
    },
    {
        "title": "trianglesMosaicFilter",
        "name": "trianglesMosaicFilter"
    },
    {
        "title": "tsx",
        "name": "tsx"
    },
    {
        "title": "tsx2",
        "name": "tsx2"
    },
    {
        "title": "tsx3",
        "name": "tsx3"
    },
    {
        "title": "tsx4",
        "name": "tsx4"
    },
    {
        "title": "tsxDom",
        "name": "tsxDom"
    },
    {
        "title": "ui",
        "name": "ui"
    },
    {
        "title": "waterRipple",
        "name": "waterRipple"
    },
    {
        "title": "waveDistortion",
        "name": "waveDistortion"
    },
    {
        "title": "zxSpectrumScr",
        "name": "zxSpectrumScr"
    }
];


export class Widget extends VEngineTsxComponent<{}> {

    private loadingInfo:string = '';
    private selectedItem:{title:string,name:string};

    constructor() {
        super(new HtmlTsxDOMRenderer());
    }

    private selectItem(e:Event,index:number){
        e.preventDefault();
        this.selectedItem = items[index];
        this.loadingInfo = 'loading...';
        this.triggerRendering();
    }

    private onFrameLoaded(){
        this.loadingInfo = '';
        this.triggerRendering();
    }

    render() {
        return(
            <div className="layout">
                <div className="up">
                    <div id="frameLoadingInfo">{this.loadingInfo}</div>
                    <iframe
                        onLoad={()=>this.onFrameLoaded()}
                        src={this.selectedItem?'./demo.html?name='+this.selectedItem.name:undefined}
                        frameBorder="0" id="frame"/>
                </div>
                <div className="down">
                    <ul id="list">
                        {
                            items.map((it,index)=>
                                <li className={it===this.selectedItem?'active':undefined}>
                                    <a onClick={(e)=>this.selectItem(e,index)} target="_blank" href="#">{it.title}</a>
                                    <a target="_blank" href={'./demo.html?name='+it.name}> . </a>
                                </li>
                            )
                        }
                    </ul>
                </div>
            </div>

        );
    }
}



