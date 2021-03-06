import {DebugError} from "@engine/debug/debugError";
/**
 * adopted from https://raw.githubusercontent.com/libgdx/libgdx/master/gdx/src/com/badlogic/gdx/math/EarClippingTriangulator.java
 */

export class EarClippingTriangulator {
    private static readonly _CONCAVE: number = -1;
    private static readonly _CONVEX: number = 1;

    private indices: number[] = [];
    private vertices: number[];
    private vertexCount: number;
    private vertexTypes: number[] = [];
    private triangles: number[] = [];

    private static areVerticesClockwise(vertices: number[], offset: number, count: number): boolean {
        if (count <= 2) return false;
        let area: number = 0, p1x, p1y, p2x, p2y:number;
        for (let i: number = offset, n = offset + count - 3; i < n; i += 2) {
            p1x = vertices[i];
            p1y = vertices[i + 1];
            p2x = vertices[i + 2];
            p2y = vertices[i + 3];
            area += p1x * p2y - p2x * p1y;
        }
        p1x = vertices[offset + count - 2];
        p1y = vertices[offset + count - 1];
        p2x = vertices[offset];
        p2y = vertices[offset + 1];
        return area + p1x * p2y - p2x * p1y < 0;
    }

    private static computeSpannedAreaSign(p1x: number, p1y: number,
                                          p2x: number, p2y: number,
                                          p3x: number, p3y: number): 0|1|-1 {
        let area: number = p1x * (p3y - p2y);
        area += p2x * (p1y - p3y);
        area += p3x * (p2y - p1y);
        if (area===0) return 0;
        return area>0?1:-1;
    }


    public computeTriangles(vertices: number[]): number[] {
        this.vertices = vertices;
        const offset:number = 0;
        const count = vertices.length;
        if (DEBUG && count%2!==0) throw new DebugError(`wrong vertices size`);
        const vertexCount: number = this.vertexCount = ~~(count / 2);
        const vertexOffset: number = ~~(offset / 2);

        this.indices = [];
        if (EarClippingTriangulator.areVerticesClockwise(vertices, offset, count)) {
            for (let i: number = 0; i < vertexCount; i++)
                this.indices[i] = vertexOffset + i;
        } else {
            for (let i = 0, n = vertexCount - 1; i < vertexCount; i++)
                this.indices[i] = vertexOffset + n - i; // Reversed.
        }

        const vertexTypes: number[] = [];
        for (let i = 0, n = vertexCount; i < n; ++i)
            vertexTypes.push(this.classifyVertex(i));

        // A polygon with n vertices has a triangulation of n-2 triangles.
        const triangles: number[] = this.triangles = [];
        this.vertexTypes = vertexTypes;
        this.triangulate();
        return triangles;
    }

    private triangulate():void {
        const vertexTypes: number[] = this.vertexTypes;
        const triangles: number[] = this.triangles;

        while (this.vertexCount > 3) {
            const earTipIndex: number = this.findEarTip();
            this.cutEarTip(earTipIndex);

            // The type of the two vertices adjacent to the clipped vertex may have changed.
            const previousIndex: number = this.previousIndex(earTipIndex);
            const nextIndex: number = earTipIndex === this.vertexCount ? 0 : earTipIndex;
            vertexTypes[previousIndex] = this.classifyVertex(previousIndex);
            vertexTypes[nextIndex] = this.classifyVertex(nextIndex);
        }

        if (this.vertexCount === 3) {
            const indices: number[] = this.indices;
            triangles.push(indices[0]);
            triangles.push(indices[1]);
            triangles.push(indices[2]);
        }
        this.vertexTypes = vertexTypes;
        this.triangles = triangles;
    }


    private classifyVertex(index: number): number {
        const indices: number[] = this.indices;
        const previous: number = indices[this.previousIndex(index)] * 2;
        const current: number = indices[index] * 2;
        const next: number = indices[this.nextIndex(index)] * 2;
        const vertices: number[] = this.vertices;
        return EarClippingTriangulator.computeSpannedAreaSign(vertices[previous], vertices[previous + 1], vertices[current], vertices[current + 1],
            vertices[next], vertices[next + 1]);
    }

    private findEarTip(): number {
        const vertexCount: number = this.vertexCount;
        for (let i: number = 0; i < vertexCount; i++)
            if (this.isEarTip(i)) return i;

        // Return a convex or tangential vertex if one exists.
        const vertexTypes: readonly number[] = this.vertexTypes;
        for (let i: number = 0; i < vertexCount; i++)
            if (vertexTypes[i] !== EarClippingTriangulator._CONCAVE) return i;
        return 0; // If all vertices are concave, just return the first one.
    }

    private isEarTip(earTipIndex: number): boolean {
        const vertexTypes: readonly number[] = this.vertexTypes;
        if (vertexTypes[earTipIndex] === EarClippingTriangulator._CONCAVE) return false;

        const previousIndex: number = this.previousIndex(earTipIndex);
        const nextIndex: number = this.nextIndex(earTipIndex);
        const indices: number[] = this.indices;
        const p1: number = indices[previousIndex] * 2;
        const p2: number = indices[earTipIndex] * 2;
        const p3: number = indices[nextIndex] * 2;
        const vertices: readonly number[] = this.vertices;
        const p1x: number = vertices[p1], p1y = vertices[p1 + 1];
        const p2x: number = vertices[p2], p2y = vertices[p2 + 1];
        const p3x: number = vertices[p3], p3y = vertices[p3 + 1];

        // Check if any point is inside the triangle formed by previous, current and next vertices.
        // Only consider vertices that are not part of this triangle, or else we'll always find one inside.
        for (let i: number = this.nextIndex(nextIndex); i !== previousIndex; i = this.nextIndex(i)) {
            // Concave vertices can obviously be inside the candidate ear, but so can tangential vertices
            // if they coincide with one of the triangle's vertices.
            if (vertexTypes[i] !== EarClippingTriangulator._CONVEX) {
                const v: number = indices[i] * 2;
                const vx: number = vertices[v];
                const vy: number = vertices[v + 1];
                // Because the polygon has clockwise winding order, the area sign will be positive if the point is strictly inside.
                // It will be 0 on the edge, which we want to include as well.
                // note: check the edge defined by p1->p3 first since this fails _far_ more then the other 2 checks.
                if (EarClippingTriangulator.computeSpannedAreaSign(p3x, p3y, p1x, p1y, vx, vy) >= 0) {
                    if (EarClippingTriangulator.computeSpannedAreaSign(p1x, p1y, p2x, p2y, vx, vy) >= 0) {
                        if (EarClippingTriangulator.computeSpannedAreaSign(p2x, p2y, p3x, p3y, vx, vy) >= 0) return false;
                    }
                }
            }
        }
        return true;
    }

    private cutEarTip(earTipIndex: number): void {
        const indices: readonly number[] = this.indices;
        const triangles: number[] = this.triangles;

        triangles.push(indices[this.previousIndex(earTipIndex)]);
        triangles.push(indices[earTipIndex]);
        triangles.push(indices[this.nextIndex(earTipIndex)]);

        this.triangles = triangles;

        this.indices.splice(earTipIndex,1);
        this.vertexTypes.splice(earTipIndex,1);
        this.vertexCount--;
    }

    private previousIndex(index: number): number {
        return (index === 0 ? this.vertexCount : index) - 1;
    }

    private nextIndex(index: number): number {
        return (index + 1) % this.vertexCount;
    }
}
