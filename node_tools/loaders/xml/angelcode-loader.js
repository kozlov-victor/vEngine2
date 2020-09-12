
// http://www.angelcode.com/products/bmfont/
// http://www.angelcode.com/products/bmfont/doc/file_format.html

const parseToNode = (row)=>{
    const tags = row.split(' ').map(it=>it.trim()).filter(it=>it.length);
    const tagName = tags.shift();
    const element = {tagName,attributes:{}};
    tags.forEach(it=>{
       const pair = it.split('=');
       const key = pair[0].trim();
       let value = pair[1];
       if (value) value = value.trim();
       element.attributes[key] = value;
    });
    return element;
}


const parseToDocument = (source)=>{
    const document = {children:[]};
    source.split('\n').forEach(row=>{
        document.children.push(parseToNode(row));
    });
    return document;
}

module.exports = function(content) {
    const document = parseToDocument(content);
    return `module.exports = ${JSON.stringify(document)}`;
};


