import {Controller, Get, Post} from "../decorator/decorator";
import {Rectangle, TexturePacker} from "./utils/rectPacker";
import {Bitmap} from "./utils/bitmap";
import {ITextureAtlasJSON} from "@engine/animation/frameAnimation/atlas/texturePackerAtlas";
import {uuid} from "./utils/uuid";
import {tmp} from "./utils/consts";
import {cleanUp} from "./utils/cleanUp";
import * as fs from 'fs';
import * as path from 'path';

const PSD = require('psd');
const storage = require('../../../common/storage');

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
    psdFileName: string;
    size: {
        width: number,
        height: number,
    }
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

@Controller('texture-pack')
export class TexturePackController {


    @Get()
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

    @Post()
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
                    psdFileName: psdFileNameNoExt,
                    name: `${psdFileNameNoExt}_${layer.name}`,
                    size: {
                        width: psd.header.cols,
                        height: psd.header.rows,
                    },
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
                image.size.width  + 2 * params.padding,
                image.size.height + 2 * params.padding
            );
            r.image = image;
            rects.push(r);
        }
        const {rect:packed} = new TexturePacker(rects).pack();

        const bitmap = new Bitmap(packed.width,packed.height);
        const descriptions:ITextureAtlasJSON = {
            frames: {} as ITextureAtlasJSON['frames'],
            width: packed.width,
            height: packed.height,
        };
        for (const r of rects) {
            const bm = await Bitmap.fromPNG(r.image.fileName);
            bitmap.drawImageAt(
                r.x + r.image.rect.left + params.padding,
                r.y + r.image.rect.top + params.padding,
                bm
            );
            const name = getSafeName(descriptions,r.image.name);
            descriptions.frames[name] = {
                frame: {
                    x: r.x + params.padding,
                    y: r.y + params.padding,
                    w: r.image.size.width,
                    h: r.image.size.height,
                }
            }
        }
        const outFileUUID = uuid();
        await bitmap.toPng(`${tmp}/${outFileUUID}.png`);
        const saved:Record<string, boolean> = {};
        for (const r of rects) {
            if (saved[r.image.psdFileName]) continue;
            saved[r.image.psdFileName] = true;
            fs.copyFileSync(r.image.fileName,`${params.saveLayerImagesTo}/${r.image.name}.png`);
            fs.unlinkSync(r.image.fileName);
        }
        fs.writeFileSync(`${tmp}/${outFileUUID}.json`,JSON.stringify(descriptions,undefined!,4));
        storage.set('texture-pack:saveLayerImagesTo',params.saveLayerImagesTo);
        return outFileUUID;
    }

    @Get()
    public async getConvertedImage(params:{uuid:string}) {
        return fs.readFileSync(`${tmp}/${params.uuid}.png`);
    }

    @Get()
    public async loadParams() {
        return {
            saveTo: storage.get('texture-pack:saveTo'),
            saveToFileName: storage.get('texture-pack:saveToFileName'),
            folder: storage.get('texture-pack:folder'),
            saveLayerImagesTo: storage.get('texture-pack:saveLayerImagesTo'),
        };
    }

    @Post()
    public async save(params:{uuid:string,saveTo:string,saveToFileName:string,folder:string}) {
        fs.copyFileSync(`${tmp}/${params.uuid}.png`,`${params.saveTo}/${params.saveToFileName}.png`);
        fs.copyFileSync(`${tmp}/${params.uuid}.json`,`${params.saveTo}/${params.saveToFileName}.json`);
        storage.set('texture-pack:saveTo',params.saveTo);
        storage.set('texture-pack:saveToFileName',params.saveToFileName);
        storage.set('texture-pack:folder',params.folder);
        cleanUp();
        return {};
    }

    @Post()
    public async cleanUp() {
        cleanUp();
        return {};
    }


}
