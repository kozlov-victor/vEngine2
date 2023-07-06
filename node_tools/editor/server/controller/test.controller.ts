import {Controller, Get} from "../decorator/decorator";

@Controller('/base')
export class TestController {

    @Get({url:'/testMethod-url',contentType:'application/json'})
    public async testMethod():Promise<any> {
        await Promise.resolve();
        return {val:'123'};
    }

    @Get({contentType:'text/html'})
    public testMethod1() {
        return '<b>test html</b>';
    }

}

