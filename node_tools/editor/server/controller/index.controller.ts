import {Controller, Get} from "../decorator/decorator";

declare const __non_webpack_require__:any;

const fs = __non_webpack_require__('fs');

@Controller('/')
export class IndexController {

    @Get({url:'/',contentType:'text/html'})
    public indexHtml() {
        return fs.readFileSync('./node_tools/editor/client/index.html','utf8');
    }

    @Get({url:'/index.js',contentType:'text/javaScript'})
    public indexJs() {
        return fs.readFileSync('./demo/out/editor-client.js','utf8');
    }

    @Get({url:'/PressStart2P-Regular.ttf',contentType:'application/octet-stream'})
    public getFont() {
        return fs.readFileSync('./node_tools/editor/client/PressStart2P-Regular.ttf');
    }

}
