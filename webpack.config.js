
const path = require('path');
const webpack = require('webpack');
const fs = require('fs');

const debug = false;

class WebpackDonePlugin{
    apply(compiler){
        // compiler.hooks.done.tap('compilation',  (stats)=> {
        //     let indexHtml = fs.readFileSync('./game/index.html',{encoding:'UTF-8'});
        //     indexHtml = indexHtml.replace('</body>','<script src="js/app.bundle.js"></script></body>');
        //     fs.writeFileSync('./out/index.html',indexHtml);
        // });
    }
}

module.exports = (env={})=>{

    const entry = {

    };
    const output = {
        path: path.resolve('./demo/out'),
        filename:'[name].js'
    };

    let dirs = fs.readdirSync('./demo');
    dirs.forEach((dir)=>{
        if (['assets','out','index.html'].includes(dir)) return;
        entry[`${dir}`] = [`./demo/${dir}/index.ts`]
    });



    console.log('webpack started at',new Date());
    console.log({entry,output});

    let config = {
        entry,
        output,
        mode: 'production', //debug ? 'development' : 'production',
        resolveLoader: {
            modules: ['node_modules', path.resolve(__dirname, 'node_tools/loaders')]
        },
        watchOptions: {
            poll: true
        },
        performance: {
            maxEntrypointSize: 512000,
            maxAssetSize: 512000
        },
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    loader: "awesome-typescript-loader",
                    options: {}
                },
                {
                    test: /\.(png|jpe?g|svg)$/,
                    use: [
                        {
                            loader: 'url-loader',
                            options: {}
                        }
                    ]
                }
            ]
        },
        resolve: {
            extensions: ['.ts'],
            modules: [
                path.resolve(__dirname, 'node_modules'),
            ],
            alias: {
                '@engine': path.resolve(__dirname, 'engine'),
            },
        },
        optimization: {
            minimize: !debug,
            noEmitOnErrors: true,
           // usedExports: true
        },
    };

    config.plugins = [
        new webpack.DefinePlugin({
            BUILD_AT: new Date().getTime(),
            DEBUG: true,
            EMBED_RESOURCES: false,
        }),
        new WebpackDonePlugin()
    ];

    return config;
};


