import {Controller, Get, Post} from "../decorator/decorator";
import {IRectJSON} from "@engine/geometry/rect";
import {Rectangle, TexturePacker} from "./utils/rectPacker";
import {Bitmap} from "./utils/bitmap";

declare const __non_webpack_require__:any;

const fs = __non_webpack_require__('fs');
const PSD = __non_webpack_require__('psd');
const path = __non_webpack_require__('path');

let cnt = 0;
const rnd = ()=>{
    return '0123456789abcdef'.split('').sort(it=>Math.random()>0.5?-1:1)[0];
}

const uuid = ()=>{
    let res = '';
    for (let i=0;i<16;i++) {
        res+=rnd();
    }
    cnt++;
    res+=cnt;
    return res;
}

const getSafeName = (obj:Record<string, any>,name:string)=> {
    if (obj[name]===undefined) return name;
    let cnt = 1;
    // eslint-disable-next-line no-constant-condition
    while (true) {
        const n = `${name}_${cnt}`;
        if (obj[n]===undefined) return n;
        cnt++;
    }
}

interface IImage {
    fileName: string;
    name: string;
    rect: {
        left: number;
        top: number;
        width: number;
        height: number;
    }
}

class RectangleEx extends Rectangle {
    public image:IImage;
}

const tmp = './__tmp';

@Controller('main')
export class MainController {


    @Get({url:'/getFiles',contentType:'application/json'})
    public async getFiles(params:{folder:string}) {
        const result:string[] = [];
        const folder = params.folder;
        if (!folder || !fs.existsSync(folder)) return {
            contentType:'application/json',
            content:result,
        }
        fs.readdirSync(folder).forEach((d:string)=>{
            if (d.endsWith('.psd')) result.push(path.join(folder,d));
        });
        return result;
    }

    @Post({url:'/convert',contentType:'text/plain'})
    public async convert(params:{files:string}) {
        if (!fs.existsSync(tmp)) fs.mkdirSync(tmp);
        const psds = params.files.split(',').map(it=>PSD.fromFile(it));
        const images:IImage[] = [];
        for (const psd of psds) {
            psd.parse();
            const layers = psd.tree().children().map((c:any)=>c.layer);
            for (const layer of layers) {
                const id = uuid();
                const fileName = `${tmp}/${id}.png`;
                await layer.image.saveAsPng(fileName);
                images.push({
                    fileName,
                    name: layer.name,
                    rect: {
                        left: layer.left,
                        top: layer.top,
                        width: layer.width,
                        height: layer.height,
                    }
                });
            }
        }

        const rects:RectangleEx[] = [];
        for (const image of images) {
            const r = new Rectangle(image.rect.width,image.rect.height) as Rectangle&{image:IImage};
            r.image = image;
            rects.push(r);
        }
        const {rect:packed} = new TexturePacker(rects).pack();

        const bitmap = new Bitmap(packed.width,packed.height);
        const descriptions:Record<string, IRectJSON> = {};
        for (const r of rects) {
            const bm = await Bitmap.fromPNG(r.image.fileName);
            bitmap.drawImageAt(r.x,r.y,bm);
            const name = getSafeName(descriptions,r.image.name);
            descriptions[name] = {
                x:r.x,y:r.y,
                width:r.width,height:r.height,
            }
        }
        const outFileUUID = uuid();
        await bitmap.toPng(`${tmp}/${outFileUUID}.png`);
        for (const image of images) {
            fs.unlinkSync(image.fileName);
        }
        fs.writeFileSync(`${tmp}/${outFileUUID}.json`,JSON.stringify(descriptions,undefined,4));
        return outFileUUID;
    }

    @Get({url:'/getConvertedImage',contentType:'application/octet-stream'})
    public async getConvertedImage(params:{uuid:string}) {
        return fs.readFileSync(`${tmp}/${params.uuid}.png`);
    }

    @Post({url:'/save',contentType:'application/json'})
    public async save(params:{uuid:string,saveTo:string,saveToFileName:string}) {
        fs.copyFileSync(`${tmp}/${params.uuid}.png`,`${params.saveTo}/${params.saveToFileName}.png`);
        fs.copyFileSync(`${tmp}/${params.uuid}.json`,`${params.saveTo}/${params.saveToFileName}.json`);
        return {};
    }

}
