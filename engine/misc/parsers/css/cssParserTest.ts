import {CssParser} from "@engine/misc/parsers/css/cssParser";

const parser = new CssParser();



//language=css
const rules = parser.parseCSS(`
    body {
        color: red;
        text-align: center;
    }

    a,body {
        font-weight: bold;
    }

    /*comment*/
    .selected>ul,body {
        text-blink: none;
    }

    @media screen and (max-width: 300px){
        body {
            color: green;
        }
    }
    @keyframes testKeyFrames {
        0% {
            margin: 0;
        }
        40% {
            margin: 10px;
        }
        50% {
            margin: auto;
        }
    }
`)

console.log(parser.getRulesBySelector('body'));


export const CSS_PARSE_TEST = {};
