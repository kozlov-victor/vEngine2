import {DebugError} from "@engine/debug/debugError";
import {AbstractTexture} from "@engine/renderer/webGl/base/abstract/abstractTexture";

interface IFaceInfo {
    target: GLenum;
    img:HTMLImageElement;
}

export class CubeTexture extends AbstractTexture {

    constructor(protected readonly gl:WebGLRenderingContext) {
        super(gl);
    }

    public setImages(
        top:HTMLImageElement,
        bottom:HTMLImageElement,
        left:HTMLImageElement,
        right:HTMLImageElement,
        front:HTMLImageElement,
        back:HTMLImageElement
    ):void{
        this.validate(top,bottom,left,right,front,back);
        this.init(top,bottom,left,right,front,back);
    }

    private validate(
        top:HTMLImageElement,
        bottom:HTMLImageElement,
        left:HTMLImageElement,
        right:HTMLImageElement,
        front:HTMLImageElement,
        back:HTMLImageElement
    ):void {
        if (DEBUG) {
            if (!this.gl) throw new DebugError("can not create Texture, gl context not passed to constructor, expected: Texture(gl)");

            const isZeroImage = (img:HTMLImageElement):boolean=>{
                return img.width===0 || img.height===0;
            };

            const isOfSize = (img:HTMLImageElement,width:number,height:number):boolean=>{
                return img.width === width && img.height === height;
            };

            if (
                isZeroImage(top) ||
                isZeroImage(bottom) ||
                isZeroImage(left) ||
                isZeroImage(right) ||
                isZeroImage(top) ||
                isZeroImage(bottom)
            ) {
                throw new DebugError(`can not create cube texture: wrong image is passed`);
            }

            const w:number = top.width, h: number = top.height;

            if (
                !isOfSize(bottom,w,h) ||
                !isOfSize(left,w,h) ||
                !isOfSize(right,w,h) ||
                !isOfSize(front,w,h) ||
                !isOfSize(back,w,h)
            ) {
                throw new DebugError(`can not create cube texture: the same size of images is required`);
            }

        }
    }


    private init(
        top:HTMLImageElement,
        bottom:HTMLImageElement,
        left:HTMLImageElement,
        right:HTMLImageElement,
        front:HTMLImageElement,
        back:HTMLImageElement
    ):void{
        const gl:WebGLRenderingContext = this.gl;
        const faceInfos: IFaceInfo[] = [
            {
                target: gl.TEXTURE_CUBE_MAP_POSITIVE_X,
                img: left,
            },
            {
                target: gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
                img: right,
            },
            {
                target: gl.TEXTURE_CUBE_MAP_POSITIVE_Y,
                img: top,
            },
            {
                target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
                img: bottom,
            },
            {
                target: gl.TEXTURE_CUBE_MAP_POSITIVE_Z,
                img: front,
            },
            {
                target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Z,
                img: back,
            },
        ];

        gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.tex);
        this.size.setWH(top.width,top.height);

        faceInfos.forEach((faceInfo) => {
            gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.tex);
            gl.texImage2D(faceInfo.target, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, faceInfo.img);
            gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
        });
        gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
        // tslint:disable-next-line:no-null-keyword
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
    }

}
