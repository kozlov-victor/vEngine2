
const fs = require('fs');

const allDirectories = [];

const dirs = fs.readdirSync('./demo');
dirs.forEach((dir)=>{
    if (['assets','out','index.html','demo.html','.DS_Store','generateIndexPage.js','application.hta'].includes(dir)) return;
    allDirectories.push(dir);
});


const template = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name ="viewport" content="width=device-width,initial-scale=1,user-scalable=1">
    <title></title>
    <style>
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }
        #frame {
            width: 320px;
            height: 240px;
            box-shadow: 0 0 2px black;
            margin: 5px;
        }
        #frameLoadingInfo {
            position: absolute;
            top: 20px;
            left: 20px
        }
        .layout {
            display: flex;
            flex-direction: column;
        }
        html,body,.layout {
            height: 100%;
        }
        body  {
            position: fixed;
            overflow: hidden;
            width: 100%;
            height: 100%;
        }
        .up,.down {
            display: flex;
            margin: 0 auto;
            position: relative;
        }
        .up {
            display: block;
            dislpay: flex;
            width: 320px;
        }
        .down {
            flex: 1;
            overflow-y: scroll;
            -webkit-overflow-scrolling: touch;
            width: 100%;
        }
        /* hide hosting ads */
        div[style] {
            display: none;
        }
        #list {
            display: block;
            width: 100%;
            text-align: center;
        }
        #list li {
            padding: 10px;
        }
        .active {
            background-color: aqua;
        }
    </style>
</head>
<body>
    <div class="layout">
        <div class="up">
            <div id="frameLoadingInfo"></div>
            <iframe frameborder="0" id="frame"></iframe>
        </div>
        <div class="down">
            <ul id="list"></ul>
        </div>
    </div>

    <script>
        (function(){

            var items = ${JSON.stringify(allDirectories.map(it=>({title:it,name:it})),null,4)};

            var res = '';
            items.map(function(it){
                res+='\\
                            <li>'+
                    '            <a onclick="onClick(event)" target="_blank" href="#" data-href="./demo.html?name='+it.name+'">\\n' +
                    '                \\n' + it.title +
                    '            </a>\\n' +
                    '<a target="_blank" href="./demo.html?name='+it.name+'"> . </a>'+
                    '        </li>\\
                    ';
            });
            document.getElementById('list').innerHTML = res;
            var frame = document.getElementById('frame');
            var lastActive;
            window.onClick = function (e) {
                e.preventDefault();
                frame.src =  e.target.getAttribute('data-href');
                if (lastActive) lastActive.classList.remove('active');
                lastActive = e.target.parentNode;
                lastActive.classList.add('active');
                document.getElementById('frameLoadingInfo').textContent = 'loading...';
                frame.onload = frame.onerror = function(){
                    document.getElementById('frameLoadingInfo').textContent = '';
                };
                
            }
        })();
    </script>
</body>
</html>

`;

fs.writeFileSync('./demo/index.html',template);