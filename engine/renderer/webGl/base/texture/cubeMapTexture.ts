import {DebugError} from "@engine/debug/debugError";
import {AbstractTexture, isPowerOf2} from "@engine/renderer/webGl/base/abstract/abstractTexture";
import {ICubeMapTexture} from "@engine/renderer/common/texture";

interface IFaceInfo {
    target: GLenum;
    img:HTMLImageElement|ImageBitmap;
}

export class CubeMapTexture extends AbstractTexture implements ICubeMapTexture{

    public readonly type = 'CubeMapTexture' as const;
    public readonly __kind__ = this.type;

    protected samplerType: GLenum = this.gl.TEXTURE_CUBE_MAP;

    constructor(gl:WebGLRenderingContext) {
        super(gl);
    }

    public setImages(
        left:HTMLImageElement|ImageBitmap,
        right:HTMLImageElement|ImageBitmap,
        top:HTMLImageElement|ImageBitmap,
        bottom:HTMLImageElement|ImageBitmap,
        front:HTMLImageElement|ImageBitmap,
        back:HTMLImageElement|ImageBitmap
    ):void {
        this.validate(left,right,top,bottom,front,back);
        this.init(left,right,top,bottom,front,back);
    }

    public setAsZero():void{
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
            gl.texImage2D(faceInfo, 0, gl.RGBA, 2, 2, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        });
        gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
    }

    private validate(
        left:HTMLImageElement|ImageBitmap,
        right:HTMLImageElement|ImageBitmap,
        top:HTMLImageElement|ImageBitmap,
        bottom:HTMLImageElement|ImageBitmap,
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

            if (w!==h) {
                throw new DebugError(`with and height must be the same for cubeMapTexture, but ${w}*${h} size provided`)
            }

        }
    }


    private init(
        left:HTMLImageElement|ImageBitmap,
        right:HTMLImageElement|ImageBitmap,
        top:HTMLImageElement|ImageBitmap,
        bottom:HTMLImageElement|ImageBitmap,
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
                img: back,
            },
            {
                target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Z,
                img: front,
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
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
    }

}
