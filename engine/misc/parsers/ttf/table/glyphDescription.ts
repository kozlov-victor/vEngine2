
export interface GlyphDescription {
    getEndPtOfContours(i: number): number;
    getFlags(i:number):number;
    getXCoordinate(i: number): number;
    getYCoordinate(i: number): number;
    getXMaximum(): number;
    getXMinimum(): number;
    getYMaximum(): number;
    getYMinimum(): number;
    isComposite(): boolean;
    getPointCount(): number;
    getContourCount(): number;
    //  public int getComponentIndex(int c);
    //  public int getComponentCount();
}
