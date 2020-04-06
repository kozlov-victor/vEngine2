
const path = require('path');
const webpack = require('webpack');
const fs = require('fs');
const colors = require('./node_tools/colors');
const engineTransformer = require('./node_tools/transformers/build/engineTransformer').engineTransformer;

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
        filename:'[name].js',
        //chunkFilename: "[name].chunk.js",
    };

    if (env.project) {
        entry[env.project] = [`./demo/${env.project}/index.ts`]
    } else {
        let dirs = fs.readdirSync('./demo');
        dirs.forEach((dir)=>{
            if (['demo.html','assets','out','index.html','.DS_Store','generateIndexPage.js','application.hta','VEngineNavigator.exe'].includes(dir)) return;
            entry[`${dir}`] = [`./demo/${dir}/index.ts`];
        });
    }



    entry['debug'] = './engine/debug/debug.ts';



    console.log('webpack started at',new Date());
    console.log({entry,output});

    const config = {
        entry,
        output,
        mode: 'production', //debug ? 'development' : 'production',
        //devtool: 'inline-source-map',
        resolveLoader: {
            modules: ['node_modules', path.resolve(__dirname, 'node_tools/loaders')]
        },
        watchOptions: {
            poll: true
        },
        performance: {
            maxEntrypointSize: 1024000,
            maxAssetSize: 1024000
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
                    test: /\.(xml)$/,
                    use: [
                        {loader: "xml/xml-loader",options: {debug}},
                    ]
                },
                {
                    test: /\.(png|jpe?g|svg)$/,
                    use: [
                        {
                            loader: 'url-loader',
                            options: {
                                esModule: false,
                            }
                        }
                    ]
                },
                {
                    test: /\.ts$/,
                    enforce: 'pre',
                    use: [
                        {
                            loader: 'tslint-loader',
                            options: { /* Loader options go here */ }
                        }
                    ]
                },
                {
                    test: /\.ts$/,
                    use: [
                        {
                            loader: "ts-loader",options: {
                                getCustomTransformers: program => {
                                    return {
                                        before: [
                                            engineTransformer
                                        ]
                                    }
                                },
                            },
                        },
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
        new WebpackDonePlugin()
    ];

    return config;
};


