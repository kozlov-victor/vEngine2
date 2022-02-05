import {FBXNode, MappingType} from "@engine/renderable/impl/3d/fbxParser/_internal/types";

export namespace Utils {
    const _findNodes = (node:FBXNode,name:string,out:FBXNode[]):FBXNode[]=>{
        if (!node) return out;
        if (node.name===name) out.push(node);
        node.nodes.forEach(n=>_findNodes(n,name,out));
        return out;
    }

    export const findNodes = (node:FBXNode,name:string):FBXNode[] => {
        const out:FBXNode[] = [];
        _findNodes(node,name,out);
        return out;
    }

    export const findNode = (node:FBXNode,name:string):FBXNode=>{
        return findNodes(node,name)[0];
    }

    export const findProperty = (node:FBXNode,path:string)=>{
        const pathSegments = path.split('/');
        for (let i = 0; i < pathSegments.length; i++) {
            const pathSegment = pathSegments[i];
            node = findNode(node,pathSegment);
        }
        return node?.props?.[0] as any;
    }

    export const findProperty70 = (node:FBXNode,name:string):undefined|any[]=>{
        for (const nodeElement of node.nodes) {
            if (nodeElement.props[0]===name) return nodeElement.props as any[];
        }
        return undefined;
    }

    export const findFaces = (indices:readonly number[]):number[][]=> {
        const faces:number[][] = [];
        let currFace:number[] = [];
        for (let i=0;i<indices.length;i++) {
            let inx = indices[i];
            if (inx<0) {
                inx = ~inx;
                currFace.push(inx);
                faces.push(currFace);
                currFace = [];
            } else {
                currFace.push(inx);
            }
        }
        return faces;
    }

    export const getVertex3ByIndex = (index:number,vertices:readonly number[]):[number,number,number]=>{
        const pos = index*3;
        return [
            vertices[pos+2],
            vertices[pos+0],
            vertices[pos+1],
        ]
    }

    export const getVertex3ByIndexAndMappingType = (vertexIndex:number,faceIndex:number,mapType:MappingType,vertices:readonly number[]):[number,number,number]=>{
        let index:number;
        if (mapType==='ByPolygonVertex') index = vertexIndex;
        else if (mapType==='ByVertex' || mapType==='ByVertice') {
            index = faceIndex;
        } else {
            throw new Error(`unsupported mapping type: ${mapType}`);
        }
        return getVertex3ByIndex(index,vertices);
    }

    export const getVertex2ByIndexAndMappingType = (vertexIndex:number,faceIndex:number,mapType:MappingType,vertices:readonly number[],indices?:readonly number[]):[number,number]=>{
        let index:number;
        if (mapType==='ByPolygonVertex') index = vertexIndex;
        else if (mapType==='ByVertex' || mapType==='ByVertice') {
            index = faceIndex;
        } else {
            throw new Error(`unsupported mapping type: ${mapType}`);
        }
        if (indices) { // // byVertex or byVertexIndex
            index = indices[index];
        }
        const pos = index*2;
        return [
            vertices[pos+0],
            vertices[pos+1],
        ];
    }

    export const extractFileNameFromPath = (path:string):string=>{
        const segments = path.split('\\');
        if (segments.length===1) return path;
        return segments.pop()!;
    };

    export const extractNameWithoutExtension = (name:string):string=>{
        const segments = name.split('.');
        if (segments.length===1) return name;
        segments.pop();
        return segments.join('.');
    };

}
