import {Controller, Get} from "../decorator/decorator";
import * as fs from 'fs';

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

}
