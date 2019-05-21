
const fs = require('fs');

const allDirectories = [];

const dirs = fs.readdirSync('./demo');
dirs.forEach((dir)=>{
    if (['assets','out','index.html','.DS_Store','generateIndexPage.js'].includes(dir)) return;
    allDirectories.push(dir);
});


const template = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title></title>
    <style>
        #frame {
            width: 320px;
            height: 240px;
            box-shadow: 0 0 2px black;
        }
        .left,.right {
            display: inline-block;
            box-sizing: border-box;
            vertical-align: top;
        }
        .left {
            width:20%
        }
        .right {
            width: 70%;
        }
    </style>
</head>
<body>
    <div class="left">
        <ul id="list"></ul>
    </div>
    <div class="right">
        <iframe frameborder="0" id="frame"></iframe>
    </div>

    <script>
        (()=>{

            var items = ${JSON.stringify(allDirectories.map(it=>({title:it,name:it})),null,4)};

            var res = '';
            items.map(it=>{
                res+='\\
                            <li>'+
                    '            <a onclick="onClick(event)" target="_blank" href="#" data-href="'+it.name+'/index.html">\\n' +
                    '                \\n' + it.title +
                    '            </a>\\n' +
                    '        </li>\\
                    ';
            });
            document.getElementById('list').innerHTML = res;
            var frame = document.getElementById('frame');
            window.onClick = function (e) {
                e.preventDefault();
                frame.src =  e.target.getAttribute('data-href');
            }
        })();
    </script>
</body>
</html>

`;

fs.writeFileSync('./demo/index.html',template);