import {DebugError} from "@engine/debug/debugError";
import {AbstractTexture, isPowerOf2} from "@engine/renderer/webGl/base/abstract/abstractTexture";
import {ICubeMapTexture} from "@engine/renderer/common/texture";

interface IFaceInfo {
    target: GLenum;
    img:HTMLImageElement|ImageBitmap;
}

export class CubeMapTexture extends AbstractTexture implements ICubeMapTexture{

    public readonly type:'cubeMapTexture';
    protected samplerType: GLenum = this.gl.TEXTURE_CUBE_MAP;

    constructor(protected readonly gl:WebGLRenderingContext) {
        super(gl);
    }

    public setImages(
        left:HTMLImageElement|ImageBitmap,
        right:HTMLImageElement|ImageBitmap,
        top:HTMLImageElement|ImageBitmap,
        bottom:HTMLImageElement|ImageBitmap,
        front:HTMLImageElement|ImageBitmap,
        back:HTMLImageElement|ImageBitmap,
    ):void{
        this.validate(left,right,top,bottom,front,back);
        this.init(left,right,top,bottom,front,back);
    }

    public setAsZero(){
        const gl = this.gl;

        const faceInfos =  [
            gl.TEXTURE_CUBE_MAP_POSITIVE_X,
            gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
            gl.TEXTURE_CUBE_MAP_POSITIVE_Y,
            gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
            gl.TEXTURE_CUBE_MAP_POSITIVE_Z,
            gl.TEXTURE_CUBE_MAP_NEGATIVE_Z
        ];

        gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.tex);

        faceInfos.forEach((faceInfo) => {
            gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.tex);
            // tslint:disable-next-line:no-null-keyword
            gl.texImage2D(faceInfo, 0, gl.RGBA, 2, 2, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        });
        gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
        // tslint:disable-next-line:no-null-keyword
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
    }

    private validate(
        top:HTMLImageElement|ImageBitmap,
        bottom:HTMLImageElement|ImageBitmap,
        left:HTMLImageElement|ImageBitmap,
        right:HTMLImageElement|ImageBitmap,
        front:HTMLImageElement|ImageBitmap,
        back:HTMLImageElement|ImageBitmap,
    ):void {
        if (DEBUG) {
            if (!this.gl) throw new DebugError("can not create Texture, gl context not passed to constructor, expected: Texture(gl)");

            const isZeroImage = (img:HTMLImageElement|ImageBitmap,):boolean=>{
                return img.width===0 || img.height===0;
            };

            const isOfSize = (img:HTMLImageElement|ImageBitmap,width:number,height:number):boolean=>{
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
        top:HTMLImageElement|ImageBitmap,
        bottom:HTMLImageElement|ImageBitmap,
        left:HTMLImageElement|ImageBitmap,
        right:HTMLImageElement|ImageBitmap,
        front:HTMLImageElement|ImageBitmap,
        back:HTMLImageElement|ImageBitmap,
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
        });
        if (isPowerOf2(this.size.width) && isPowerOf2(this.size.height)) {
            gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
        }
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
        // tslint:disable-next-line:no-null-keyword
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
    }

}
