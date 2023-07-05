import {tmp} from "./consts";

declare const __non_webpack_require__:any;
const fs = __non_webpack_require__('fs');

export const cleanUp = ()=>{
    if (fs.existsSync(tmp)) {
        fs.readdirSync(tmp).forEach((f:string)=>{
            fs.unlinkSync(`${tmp}/${f}`);
        });
    }
}
