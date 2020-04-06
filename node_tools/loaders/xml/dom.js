

const emptyTags = "area,base,basefont,br,col,frame,iframe,hr,img,input,isindex,link,meta,param,embed".split(',');

class SimpleHtmlParser {

    constructor(){
        this.handler = null;

        // regexps

        this.startTagRe =  /^<([^>\s\/]+)((\s+[^=>\s]+(\s*=\s*((\"[^"]*\")|(\'[^']*\')|[^>\s]+))?)*)\s*\/?\s*>/m;
        this.endTagRe =    /^<\/([^>\s]+)[^>]*>/m;
        this.attrRe =     /([^=\s]+)(\s*=\s*((\"([^"]*)\")|(\'([^']*)\')|[^>\s]+))?/gm;
    }


    parse(s, oHandler) {
        if (oHandler)
            this.contentHandler = oHandler;

        let lc, lm, rc, index;
        let treatAsChars = false;
        let oThis = this;
        while (s.length > 0)
        {
            // Comment
            if (s.substring(0, 4) === "<!--")
            {
                index = s.indexOf("-->");
                if (index !== -1)
                {
                    this.contentHandler.comment(s.substring(4, index));
                    s = s.substring(index + 3);
                    treatAsChars = false;
                }
                else
                {
                    treatAsChars = true;
                }
            }

            // end tag
            else if (s.substring(0, 2) === "</")
            {
                if (this.endTagRe.test(s))
                {
                    lc = RegExp.leftContext;
                    lm = RegExp.lastMatch;
                    rc = RegExp.rightContext;

                    lm.replace(this.endTagRe, function ()
                    {
                        return oThis.parseEndTag.apply(oThis, arguments);
                    });

                    s = rc;
                    treatAsChars = false;
                }
                else
                {
                    treatAsChars = true;
                }
            }
            // start tag
            else if (s.charAt(0) === "<")
            {
                if (this.startTagRe.test(s))
                {
                    lc = RegExp.leftContext;
                    lm = RegExp.lastMatch;
                    rc = RegExp.rightContext;

                    lm.replace(this.startTagRe, function ()
                    {
                        return oThis.parseStartTag.apply(oThis, arguments);
                    });

                    s = rc;
                    treatAsChars = false;
                }
                else
                {
                    treatAsChars = true;
                }
            }

            if (treatAsChars)
            {
                index = s.indexOf("<");
                if (index === -1)
                {
                    this.contentHandler.characters(s);
                    s = "";
                }
                else
                {
                    this.contentHandler.characters(s.substring(0, index));
                    s = s.substring(index);
                }
            }

            treatAsChars = true;
        }
    }

    parseStartTag(sTag, sTagName, sRest) {
        const selfClosed = sTag.indexOf('/>')>-1;
        let attrs = this.parseAttributes(sTagName, sRest);
        this.contentHandler.startElement(sTagName, attrs,selfClosed);
    }

    parseEndTag(sTag, sTagName) {
        this.contentHandler.endElement(sTagName);
    }

    parseAttributes(sTagName, s) {
        let oThis = this;
        let attrs = [];
        s.replace(this.attrRe, function (a0, a1, a2, a3, a4, a5, a6) {
            attrs.push(oThis.parseAttribute(sTagName, a0, a1, a2, a3, a4, a5, a6));
        });
        return attrs;
    }

    parseAttribute(sTagName, sAttribute, sName) {
        let value = "";
        if (arguments[7])
            value = arguments[8];
        else if (arguments[5])
            value = arguments[6];
        else if (arguments[3])
            value = arguments[4];

        if (!value) value = arguments[7];
        if (value && value.startsWith && value.startsWith("'") && value.endsWith("'")) {
            value = value.substr(1,value.length-2);
            value = value.split('"').join("'");
        }

        let empty = !value && !arguments[3];
        return {name: sName, value: empty ? null : value};
    }

}



class Element {
    constructor(strictClosing){
        this.id=null;
        this.tagName = undefined;
        this.attributes = [];
        this.children = [];
        this.childNodes = [];
        this.parentNode = null;
        this._strictClosing = strictClosing;
    }

    toJSON(){
        const obj = {
            tagName: this.tagName,
            attributes: {},
            children: []
        };
        this.attributes.forEach(attr=>{
           obj.attributes[attr.name] = attr.value;
        });
        this.childNodes.forEach(c=>{
            obj.children.push(c.toJSON());
        });
        return obj;
    }

    getElementById(id){
        let res = null;
        Element.__iterateAll(this,(el)=>{
            if (el.id===id) {
                res = el;
                return true;
            }
        });
        return res;
    }

    getElementsByTagName(tagName){
        tagName = tagName.toLowerCase();
        let res = [];
        Element.__iterateAll(this,(el)=>{
            if (el.tagName && el.tagName.toLowerCase()===tagName)
                res.push(el);
        });
        return res;
    }

    getElementsByTagNameNS(nameSpace,tagName){
        tagName = `${nameSpace.toLowerCase()}:${tagName.toLowerCase()}`;
        let res = [];
        Element.__iterateAll(this,(el)=>{
            if (el.tagName && el.tagName.toLowerCase()===tagName)
                res.push(el);
        });
        return res;
    }

    remove(){
        let indexOfMe = this.parentNode.children.indexOf(this);
        this.parentNode.children.splice(indexOfMe,1);
    }

    appendChild(el){
        el.parentNode = this;
        this.children.push(el);
        if (!(el instanceof TextNode)) this.childNodes.push(el);
    }

    removeChild(el){
        this.children.splice(this.children.indexOf(el),1)
    }

    static __iterateAll(el,cb){
        if (el instanceof TextNode) return false;
        if (cb(el)) return true;
        return el.children.some(c=>{
            return Element.__iterateAll(c,cb);
        });
    }

    static __getInnerHtml(root){
        if (!root) return '';
        if (root instanceof TextNode) return root.textContent;
        let attrs = root.attributes.length?root.attributes.map(a=>{
            let res = `${a.name}`;
            if (a.value) res+=`="${a.value}"`;
            return res;
        }).join(' '):'';
        let openedTag = root.tagName?`<${root.tagName}${attrs?` ${attrs}`:''}>`:'';
        let closedTag = (root.tagName && emptyTags.indexOf(root.tagName)===-1)?`</${root.tagName}>`:'';
        return `${openedTag}${root.children.map(c=>c.innerHTML).join('')}${closedTag}`;
    }

    get innerHTML(){
        return Element.__getInnerHtml(this);
    }

    set innerHTML(html){
        let fragment =  HTMLtoDOM(html,this._strictClosing);
        this.children = fragment.children;
        if (fragment.children) fragment.children.forEach(c=>{
            if (!(c instanceof TextNode)) this.childNodes.push(c);
        })
    }

    get textContent(){
        let res = '';
        if (!this.children) return res;
        this.children.forEach(el=>{
            let elTextContent = el.textContent;
            if (elTextContent) res+=elTextContent;
        });
        return res;
    }

    setAttribute(name,value){
        let attrIndex = this.attributes.findIndex(attr=>attr.name===name);
        if (attrIndex>-1) this.attributes[attrIndex] = {name,value};
        else this.attributes.push({name,value});
    }

    cloneNode(deep){
        let el = new Element();
        el.id=this.id;
        el.tagName = this.tagName;
        el.attributes = this.attributes;
        if (deep) {
            this.children.forEach(c=>{
                el.children.push(c.cloneNode(deep));
            })
        } else {
            el.children = this.children;
        }
        return el;
    }

}

class TextNode{
    constructor(){
        this.textContent = '';
    }

    set innerHTML(html){
        this.textContent = html;
    }

    get innerHTML(){
        return this.textContent;
    }

    toJSON(){
        return this.textContent;
    }
}

class Comment {
    constructor(text){
        this.data = text;
    }
}

class Document extends Element {

    constructor(strictClosing){
        super(strictClosing);
    }

    //noinspection JSMethodCanBeStatic
    createElement(tagName){
        let el = new Element();
        el.tagName = tagName;
        return el;
    }

    toJSON(){
        const document = {type:'document',children:[]};
        this.childNodes.forEach(c=>{
            document.children.push(c.toJSON());
        });
        return document;
    }

}

const trim = (str)=>{
    if (!str) return str;
    return str.replace(/[\n\r\s\t]+/gi,' ').trim();
};

/**
 * @return {string}
 */
let HTMLtoXML = html=> {
    let results = "";
    let lastTag = null;

    new SimpleHtmlParser().parse(html, {
        startElement: function( tag, attrs ) {
            results += "<" + tag;

            for (let i = 0; i < attrs.length; i++ )
                results += " " + trim(attrs[i].name + '="' + attrs[i].value) + '"';
            results += ">";
            lastTag = tag;
        },
        endElement: function( tag ) {
            if (tag!==lastTag && emptyTags.indexOf(lastTag)===-1) this.endElement(lastTag);
            results += "</" + tag + ">";
        },
        characters: function( text ) {
            results += trim(text);
        },
        comment: function( text ) {
            results += "<!--" + text + "-->";
        }
    });

    return results;
};

let HTMLtoDOM = (html,strictClosing)=> {
    let currRoot = new Element();
    let result = currRoot;
    let currElement = currRoot;
    let hasClosed = false;

    new SimpleHtmlParser().parse(html, {
        startElement: function( tag, attrs,isNestedClosed ) {
            if (!hasClosed) {
                currRoot = currElement;
            }
            hasClosed = false;
            currElement = new Element();
            // noinspection JSAnnotator
            currElement.tagName = tag;
            attrs.forEach(attr=>{
                if (attr.name==='id') currElement.id = attr.value;
            });
            //console.log('start',tag,currElement);
            currElement.attributes = attrs.map(attr=>{
                return {
                    name: trim(attr.name),
                    value: trim(attr.value)
                }
            });
            currRoot.appendChild(currElement);
            if (!strictClosing && emptyTags.indexOf(tag)>-1) {
                //console.log('self closing',tag);
                hasClosed = true;
            }
            if (isNestedClosed) hasClosed = true; // self closed xml tags
        },
        endElement: function(tag) {
            if (hasClosed) {
                currRoot =  currRoot.parentNode || currRoot;
            } else {
                currRoot = currElement.parentNode || currRoot;
            }
            hasClosed = true;
        },
        characters: function( characters ) {
            let textNode = new TextNode();
            textNode.innerHTML = trim(characters);
            if (!hasClosed ||
                (!strictClosing && emptyTags.indexOf(currElement.tagName)>-1)
            ) currElement.appendChild(textNode);
            else currElement.parentNode.appendChild(textNode);
        },
        comment: function( text ) {
            let c = new Comment(text);
            currElement.parentNode.appendChild(c);
        }
    });
    return result;
};


module.exports.createDocument = (html,strictClosing)=>{
    let doc = new Document(strictClosing);
    doc.innerHTML = html;
    return doc;
};
