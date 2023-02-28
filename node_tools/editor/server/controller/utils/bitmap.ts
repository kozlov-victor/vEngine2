
declare const __non_webpack_require__:any;

const {PNG} = __non_webpack_require__("pngjs");
const fs = __non_webpack_require__("fs");


export class Bitmap {

    private readonly width: number;
    private readonly height: number;
    private readonly data:Buffer;

    constructor(width:number,height:number) {
        this.width = width;
        this.height = height;
        this.data = Buffer.alloc(width*height*4);
    }

    static async fromPNG(url:string):Promise<Bitmap> {
        return new Promise((resolve,reject)=>{
            fs.createReadStream(url)
                .pipe(
                    new PNG({
                        filterType: 4,
                    })
                )
                .on("parsed", function () {
                    // @ts-ignore
                    const bitmap = new Bitmap(this.width,this.height);
                    for(let i=0; i<bitmap.data.length; i++) {
                        // @ts-ignore
                        bitmap.data[i] = this.data[i];
                    }
                    resolve(bitmap);
                }).
                on('error',function(e:any){
                    reject(e);
                });
        });
    }

    async toPng(url:string) {
        return new Promise((resolve,reject)=>{
            // eslint-disable-next-line @typescript-eslint/no-this-alias
            const self = this;
            const png = new PNG({
                width: self.width,
                height: self.height
            })

            for(let i=0; i<self.width; i++) {
                for(let j=0; j<self.height; j++) {
                    const col = self.getPixelRGBA(i, j)
                    const n = (j * self.width + i) * 4
                    png.data[n  ] = col.r;
                    png.data[n+1] = col.g;
                    png.data[n+2] = col.b;
                    png.data[n+3] = col.a;
                }
            }

            png
                .on('error', (err:any) => { reject(err); })
                .pack()
                .pipe(fs.createWriteStream(url))
                .on('finish', () => { resolve(undefined); })
                .on('error', (err:any) => { reject(err); });
        });
    }

    private calculateIndex (x:number,y:number) {
        x = Math.floor(x);
        y = Math.floor(y);
        if (x<0 || y<0 || x >= this.width || y >= this.height) return undefined;
        return (this.width*y+x)*4;
    }

    public setPixelRGBA(x:number,y:number,col:{r:number,g:number,b:number,a:number}) {
        const i = this.calculateIndex(x, y);
        if (i===undefined) return;
        if (col.r===-1) return;
        this.data[i  ] = col.r;
        this.data[i+1] = col.g;
        this.data[i+2] = col.b;
        this.data[i+3] = col.a;
    }

    public getPixelRGBA(x:number,y:number) {
        const i = this.calculateIndex(x, y);
        if (i===undefined) return {
            r: -1,
            g: -1,
            b: -1,
            a: -1
        }
        const
            r = this.data[i  ],
            g = this.data[i+1],
            b = this.data[i+2],
            a = this.data[i+3];
        return {r,g,b,a};
    }

    public drawImageAt(x:number,y:number,bitmap:Bitmap) {
        for (let cy=0;cy<bitmap.height;cy++) {
            for (let cx=0;cx<bitmap.width;cx++) {
                const col = bitmap.getPixelRGBA(cx,cy);
                this.setPixelRGBA(x+cx,y+cy,col);
            }
        }
    }

}

exports.Bitmap = Bitmap;
