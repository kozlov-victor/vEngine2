import {Controller, Get, Post} from "../decorator/decorator";
import {Rectangle, TexturePacker} from "./utils/rectPacker";
import {Bitmap} from "./utils/bitmap";

declare const __non_webpack_require__:any;

const fs = __non_webpack_require__('fs');
const PSD = __non_webpack_require__('psd');
const path = __non_webpack_require__('path');
const storage = __non_webpack_require__('../../node_tools/common/storage');

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
    public async convert(params:{files:string,padding:number,saveLayerImagesTo:string}) {
        if (!fs.existsSync(tmp)) fs.mkdirSync(tmp);
        if (!params.padding) params.padding = 0;
        const psdFileNames = params.files.split(',');
        const images:IImage[] = [];
        for (const psdFileName of psdFileNames) {
            const psd = PSD.fromFile(psdFileName);
            const psdFileNameNoExt =
                path.basename(psdFileName).replace('.psd','');
            psd.parse();
            const layers = psd.tree().children().map((c:any)=>c.layer);
            for (const layer of layers) {
                if (layer.name.toLowerCase().startsWith('ignore')) continue;
                const id = uuid();
                const fileName = `${tmp}/${id}.png`;
                await layer.image.saveAsPng(fileName);
                images.push({
                    fileName,
                    name: `${psdFileNameNoExt}_${layer.name}`,
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
            const r = new RectangleEx(
                image.rect.width  + 2 * params.padding,
                image.rect.height + 2 * params.padding
            );
            r.image = image;
            rects.push(r);
        }
        const {rect:packed} = new TexturePacker(rects).pack();

        const bitmap = new Bitmap(packed.width,packed.height);
        const descriptions = {
            frames:{} as Record<string, {frame:{x:number,y:number,w:number,h:number}}>,
            width: packed.width,
            height: packed.height,
        };
        for (const r of rects) {
            const bm = await Bitmap.fromPNG(r.image.fileName);
            bitmap.drawImageAt(
                r.x+params.padding,
                r.y+params.padding,
                bm
            );
            const name = getSafeName(descriptions,r.image.name);
            descriptions.frames[name] = {
                frame: {
                    x:      r.x + params.padding,
                    y:      r.y + params.padding,
                    w:      r.image.rect.width,
                    h:      r.image.rect.height,
                }
            }
        }
        const outFileUUID = uuid();
        await bitmap.toPng(`${tmp}/${outFileUUID}.png`);
        for (const r of rects) {
            fs.copyFileSync(r.image.fileName,`${params.saveLayerImagesTo}/${r.image.name}.png`);
            fs.unlinkSync(r.image.fileName);
        }
        fs.writeFileSync(`${tmp}/${outFileUUID}.json`,JSON.stringify(descriptions,undefined,4));
        storage.set('saveLayerImagesTo',params.saveLayerImagesTo);
        return outFileUUID;
    }

    @Get({url:'/getConvertedImage',contentType:'application/octet-stream'})
    public async getConvertedImage(params:{uuid:string}) {
        return fs.readFileSync(`${tmp}/${params.uuid}.png`);
    }

    @Get({url:'/loadParams',contentType:'application/json'})
    public async loadParams() {
        return {
            saveTo: storage.get('saveTo'),
            saveToFileName: storage.get('saveToFileName'),
            folder: storage.get('folder'),
            saveLayerImagesTo: storage.get('saveLayerImagesTo'),
        };
    }

    @Post({url:'/save',contentType:'application/json'})
    public async save(params:{uuid:string,saveTo:string,saveToFileName:string,folder:string}) {
        fs.copyFileSync(`${tmp}/${params.uuid}.png`,`${params.saveTo}/${params.saveToFileName}.png`);
        fs.copyFileSync(`${tmp}/${params.uuid}.json`,`${params.saveTo}/${params.saveToFileName}.json`);
        storage.set('saveTo',params.saveTo);
        storage.set('saveToFileName',params.saveToFileName);
        storage.set('folder',params.folder);
        this._cleanUp();
        return {};
    }

    @Post({url:'/cleanUp',contentType:'application/json'})
    public async cleanUp() {
        this._cleanUp();
        return {};
    }

    private _cleanUp() {
        if (fs.existsSync(tmp)) {
            fs.readdirSync(tmp).forEach((f:string)=>{
                fs.unlinkSync(`${tmp}/${f}`);
            });
        }
    }

}
