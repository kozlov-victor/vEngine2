
const injectCss = (str:string):void=>{
    const style = document.createElement('style');
    style.textContent = str;
    document.head.appendChild(style);
}

export const init = ()=>{
    //language=css
    injectCss(`
    /* Remove default bullets */

    .panel {
        background-color: #e5e5e5ed;
        border-radius: 7px 7px 0 0;
    }

    ul {
        list-style-type: none;
    }

    ul.root {
        margin: 0;
        padding: 0;
    }

    /* Hide the nested list */
    ul.nested {
        padding-left: 10px;
    }

    /* Show the nested list when the user clicks on the caret/arrow (with JavaScript) */
    ul.active {
        display: block;
    }

    /* Show the nested list when the user clicks on the caret/arrow (with JavaScript) */
    ul.inactive {
        display: none;
    }

    /* Style the caret/arrow */
    .caret {
        cursor: pointer;
        user-select: none; /* Prevent text selection */
    }

    /* Create the caret/arrow with a unicode, and style it */
    .caret::before {
        content: "\\25B6";
        color: black;
        display: inline-block;
        margin-right: 10px;
    }

    /* Rotate the caret/arrow icon when clicked on (using JavaScript) */
    .caret-down::before {
        transform: rotate(90deg);
    }

    .tooManyChildrenWarn {
        font-size: 10px;
        margin-right: 5px;
        color: #840000;
    }

    .win-header {
        background-color: #8585ff;
        color: white;
        padding: 2px;
    }

    .reload-btn,.close-btn {
        display: inline-block;
        cursor: pointer;
        font-size: 15px;
    }

    .close-btn {
        float: right;
        font-family: monospace;
        padding-right: 5px;
        color: #ffa9a9;
    }

    .listWrap {
        padding: 3px;
    }

`);
}

export const createDraggableElement = ({className = ''} = {}):HTMLDivElement=>{
    const el = document.createElement('div');
    el.style.position = 'absolute';
    el.style.left = '0';
    el.style.top = '0';
    el.className = className;
    const mouseDownPoint = {x:0,y:0};
    let isMouseDown:boolean = false;
    el.onmousedown = e=>{
        mouseDownPoint.x = e.screenX - parseInt(el.style.left);
        mouseDownPoint.y = e.screenY -  parseInt(el.style.top);
        isMouseDown = true;
    };
    document.body.addEventListener('mouseup',e=>{
        isMouseDown = false;
    },true);
    document.body.addEventListener('mousemove',e=>{
        if (!isMouseDown) return;
        el.style.left = `${e.screenX - mouseDownPoint.x}px`;
        el.style.top =  `${e.screenY - mouseDownPoint.y}px`;
    },true);
    return el;
};
