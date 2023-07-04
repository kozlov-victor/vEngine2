import {Controller, Post} from "../decorator/decorator";
declare const __non_webpack_require__:any;

const fs = __non_webpack_require__('fs');

@Controller('tile-pack')
export class TilePackController {

    @Post({contentType: 'application/json'})
    public async checkFile(params:{pathToPsdFile:string}) {
        const success = fs.existsSync(params.pathToPsdFile);
        if (success) return {
            success,
            message: 'Ok'
        };
        else return {
            success,
            message: 'File error',
        }
    }

}
