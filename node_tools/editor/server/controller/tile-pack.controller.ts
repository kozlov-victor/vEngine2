import {Controller, Get, Post} from "../decorator/decorator";
import {tmp} from "./utils/consts";
import {uuid} from "./utils/uuid";
import {Bitmap} from "./utils/bitmap";
import {cleanUp} from "./utils/cleanUp";
declare const __non_webpack_require__:any;

const fs = __non_webpack_require__('fs');
const PSD = __non_webpack_require__('psd');
const storage = __non_webpack_require__('../../node_tools/common/storage');

@Controller('tile-pack')
export class TilePackController {

    @Post()
    public async checkFile(params:{pathToPsdFile:string}) {
        const success = fs.existsSync(params.pathToPsdFile);
        if (success) {
            storage.set('tile-pack:pathToPsdFile',params.pathToPsdFile);
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
    public async convertFile(params:{pathToPsdFile:string,numOfImagesInRow:number}) {
        if (!fs.existsSync(tmp)) fs.mkdirSync(tmp);
        const psd = PSD.fromFile(params.pathToPsdFile);
        psd.parse();
        const layers = psd.tree().children().map((c:any)=>c.layer);
        const imageFileNames:string[] = [];
        const frameWidth =  psd.header.cols;
        const frameHeight = psd.header.rows;
        for (const layer of layers) {
            if (layer.name.toLowerCase().startsWith('ignore')) continue;
            const id = uuid();
            const fileName = `${tmp}/${id}.png`;
            await layer.image.saveAsPng(fileName);
            imageFileNames.push(fileName);
        }
        if (params.numOfImagesInRow>imageFileNames.length) {
            params.numOfImagesInRow = imageFileNames.length;
        }
        const imgWidth = params.numOfImagesInRow*frameWidth;
        let h = ~~(imageFileNames.length/params.numOfImagesInRow);
        if (imageFileNames.length%params.numOfImagesInRow>0) h++;
        const imgHeight = h*frameHeight;
        const bitmap = new Bitmap(imgWidth,imgHeight);
        let x = 0, y = 0;
        for (const imgFileName of imageFileNames) {
            const bm = await Bitmap.fromPNG(imgFileName);
            bitmap.drawImageAt(x,y,bm);
            x+=frameWidth;
            if (x>=imgWidth) {
                x = 0;
                y+=frameHeight;
            }
            fs.unlinkSync(imgFileName);
        }
        const outFileUUID = uuid();
        await bitmap.toPng(`${tmp}/${outFileUUID}.png`);
        storage.set('tile-pack:numOfImagesInRow',params.numOfImagesInRow);
        return outFileUUID;
    }

    @Post()
    public async save(params:{uuid:string,saveTo:string,saveToFileName:string,folder:string}) {
        fs.copyFileSync(`${tmp}/${params.uuid}.png`,`${params.saveTo}/${params.saveToFileName}.png`);
        storage.set('tile-pack:saveTo',params.saveTo);
        storage.set('tile-pack:saveToFileName',params.saveToFileName);
        cleanUp();
        return {};
    }

    @Get()
    public async loadParams() {
        return {
            saveTo: storage.get('tile-pack:saveTo'),
            saveToFileName: storage.get('tile-pack:saveToFileName'),
            numOfImagesInRow: storage.get('tile-pack:numOfImagesInRow'),
            pathToPsdFile: storage.get('tile-pack:pathToPsdFile'),
        };
    }

}