
const path = require('path');
const webpack = require('webpack');
const fs = require('fs');
const TSLintPlugin = require('tslint-webpack-plugin');
const colors = require('./node_tools/colors');

class WebpackDonePlugin{
    apply(compiler){
        compiler.hooks.done.tap('compilation',  (stats)=> {
            console.log(colors.fg.Green,'---===compiled===---',colors.Reset);
        });

    }
}

module.exports = (env={})=>{

    console.log('env',env);

    const debug = env.debug==='true';

    const entry = {};
    const output = {
        path: path.resolve('./demo/out'),
        filename:'[name].js'
    };

    let dirs = fs.readdirSync('./demo');
    dirs.forEach((dir)=>{
        if (['demo.html','assets','out','index.html','.DS_Store','generateIndexPage.js'].includes(dir)) return;
        entry[`${dir}`] = [`./demo/${dir}/index.ts`]
    });

    entry['debug'] = './engine/debug/debug.ts';



    console.log('webpack started at',new Date());
    console.log({entry,output});

    const config = {
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
                    test: /\.glsl$/,
                    use: [
                        {loader: "glsl/glsl-loader",options: {debug}},
                    ]
                },
                {
                    test: /\.xml$/,
                    use: [
                        {loader: "xml/xml-loader",options: {debug}},
                    ]
                },
                {
                    test: /\.(png|jpe?g|svg)$/,
                    use: [
                        {
                            loader: 'url-loader',
                            options: {}
                        }
                    ]
                },
                {
                    test: /\.ts$/,
                    use: [
                        {loader: "awesome-typescript-loader",options: {}},
                    ]
                },
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
            BUILD_AT: webpack.DefinePlugin.runtimeValue(() => new Date().getTime()),
            DEBUG: debug,
        }),
        new TSLintPlugin({
            files: ['./demo/**/*.ts','./engine/**/*.ts']
        }),
        new WebpackDonePlugin()
    ];

    return config;
};


