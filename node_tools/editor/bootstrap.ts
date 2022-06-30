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
        res.end(JSON.stringify(result));
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

const requestListener = (req:IncomingMessage, res:ServerResponse)=> {
    const headers = req.headers;
    const method = req.method;
    const parsedUrl = urlModule.parse(req.url!, true);
    const url = parsedUrl.pathname;
    const queryObject = parsedUrl.query;

    let found = false;
    Object.keys(Registry.getInstance().registry).forEach(methodUrl=>{
        const registryItem = Registry.getInstance().registry[methodUrl];
        if (url===methodUrl && method===registryItem.method) {
            found = true;
            try {
                const result = registryItem.controllerInstance[registryItem.controllerMethodName].call(registryItem.controllerInstance);
                if (!result) {
                    res.writeHead(200);
                    res.end();
                }
                else if (result instanceof Promise) {
                    result.then((returnVal)=>{
                        writeResultToResponse(returnVal,registryItem,res);
                    }).catch(err=>{
                        writeErrorToResponse(err, res);
                    });
                }
                else {
                    writeResultToResponse(result,registryItem,res);
                }
            } catch (e:any) {
                writeErrorToResponse(e, res);
            }
        }
    });
    if (!found) {
        res.writeHead(404);
        res.end();
    }
}

export const init = ()=>{
    const server = http.createServer(requestListener);
    server.listen(8080);
}
