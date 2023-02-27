import {IRegistryItem, Registry} from "./registry/registry";
import type {IncomingMessage, ServerResponse} from 'http';

declare const __non_webpack_require__:any;

const http = __non_webpack_require__('http');
const urlModule = __non_webpack_require__('url');

const writeResultToResponse = (result:any,registryItem:IRegistryItem, res:ServerResponse):void=>{
    if (registryItem.contentType) res.setHeader('content-type',registryItem.contentType);
    if (result.charAt!==undefined) {
        res.end(result);
    } else {
        if (registryItem.contentType?.includes('json')) res.end(JSON.stringify(result));
        else res.end(result);
    }
}

const writeErrorToResponse = (error:any,res:ServerResponse):void=>{
    res.writeHead(500);
    try {
        res.end(JSON.stringify(error));
    } catch (e) {
        res.end(error.toString());
    }
    console.log(error);
}

const getReqBody = (request:IncomingMessage):Promise<string>=> {
    return new Promise<string>((resolve, reject) => {
        const body:any[] = [];
        request.on('error', (err:any) => {
            reject(err);
        }).on('data', (chunk:any) => {
            body.push(chunk);
        }).on('end', () => {
            resolve(Buffer.concat(body).toString());
        });
    })
}

const requestListener = async (req:IncomingMessage, res:ServerResponse)=> {
    const headers = req.headers;
    const method = req.method;
    const parsedUrl = urlModule.parse(req.url!, true);
    let url:string = parsedUrl.pathname;
    if (!url.endsWith('/')) url = url + '/';
    const queryObject = parsedUrl.query;
    const bodyRaw = await getReqBody(req);
    let body:Record<string, any> = {};
    if (bodyRaw) body = JSON.parse(bodyRaw);
    const params:Record<string, any> = {};
    Object.keys(queryObject).forEach(k=>params[k]=queryObject[k]);
    Object.keys(body).forEach(k=>params[k]=body[k]);

    for (const registryItem of Registry.getInstance().registry) {
        if (url===registryItem.url && method===registryItem.method) {
            try {
                const result =
                    await registryItem.controllerInstance[registryItem.controllerMethodName].
                    call(registryItem.controllerInstance,params);
                if (!result) {
                    res.writeHead(203);
                    res.end();
                }
                writeResultToResponse(result,registryItem,res);
                return;
            } catch (e:any) {
                writeErrorToResponse(e, res);
                return;
            }
        }
    }
    res.writeHead(404);
    res.end();
}

const PORT = 8088;
export const init = ()=>{
    const server = http.createServer(requestListener);
    server.listen(PORT);
    console.log(`server is running`);
    console.log(`http://localhost:${PORT}`);
}
