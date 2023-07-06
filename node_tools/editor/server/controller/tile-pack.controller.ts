import {Controller, Get, Post} from "../decorator/decorator";
import {tmp} from "./utils/consts";
import {uuid} from "./utils/uuid";
import {Bitmap} from "./utils/bitmap";
import {cleanUp} from "./utils/cleanUp";
import * as fs from 'fs';
import {Type} from "../type/type";


const PSD = require('psd');
const storage = require('../../../common/storage');

const CheckFileDto = Type.Class({
    pathToPsdFile: Type.Required.String(),
});

const ConvertFileDto = Type.Class({
    pathToPsdFile:Type.Required.String(),
    numOfImagesInRow:Type.Required.Integer({min:1}),
});

const SaveFileDto = Type.Class({
    uuid:Type.Required.String(),
    saveToFileName:Type.Required.String(),
});

@Controller('tile-pack')
export class TilePackController {

    @Post()
    public async checkFile(params:Record<string, any>) {
        const model = CheckFileDto.createInstance(params);
        const success = fs.existsSync(model.pathToPsdFile);
        if (success) {
            storage.set('tile-pack:pathToPsdFile',model.pathToPsdFile);
            return {
                success,
                message: 'Ok'
            };
        }
        else return {
            success,
            message: 'File error',
        }
    }

    @Post()
    public async convertFile(params:Record<string, any>) {
        const model = ConvertFileDto.createInstance(params);
        if (!fs.existsSync(tmp)) fs.mkdirSync(tmp);
        const psd = PSD.fromFile(model.pathToPsdFile);
        psd.parse();
        const layers = psd.tree().children().map((c:any)=>c.layer);
        const images:{fileName:string,left:number,top:number}[] = [];
        const frameWidth =  psd.header.cols;
        const frameHeight = psd.header.rows;
        for (const layer of layers) {
            if (layer.name.toLowerCase().startsWith('ignore')) continue;
            const id = uuid();
            const fileName = `${tmp}/${id}.png`;
            await layer.image.saveAsPng(fileName);
            images.push({
                fileName,
                left: layer.left,
                top: layer.top,
            });
        }
        if (model.numOfImagesInRow>images.length) {
            model.numOfImagesInRow = images.length;
        }
        const imgWidth = model.numOfImagesInRow*frameWidth;
        let h = ~~(images.length/model.numOfImagesInRow);
        if (images.length%model.numOfImagesInRow>0) h++;
        const imgHeight = h*frameHeight;
        const bitmap = new Bitmap(imgWidth,imgHeight);
        let x = 0, y = 0;
        for (const img of images) {
            const bm = await Bitmap.fromPNG(img.fileName);
            bitmap.drawImageAt(x+img.left,y+img.top,bm);
            x+=frameWidth;
            if (x>=imgWidth) {
                x = 0;
                y+=frameHeight;
            }
            fs.unlinkSync(img.fileName);
        }
        const outFileUUID = uuid();
        await bitmap.toPng(`${tmp}/${outFileUUID}.png`);
        storage.set('tile-pack:numOfImagesInRow',model.numOfImagesInRow);
        return outFileUUID;
    }

    @Post()
    public async save(params:Record<string, any>) {
        const model = SaveFileDto.createInstance(params);
        fs.copyFileSync(`${tmp}/${model.uuid}.png`,model.saveToFileName);
        storage.set('tile-pack:saveToFileName',model.saveToFileName);
        cleanUp();
        return {};
    }

    @Get()
    public async loadParams() {
        return {
            saveToFileName: storage.get('tile-pack:saveToFileName'),
            numOfImagesInRow: storage.get('tile-pack:numOfImagesInRow'),
            pathToPsdFile: storage.get('tile-pack:pathToPsdFile'),
        };
    }

}
