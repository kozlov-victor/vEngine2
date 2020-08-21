
const path = require('path');
const webpack = require('webpack');
const fs = require('fs');
const cliUI = require('./node_tools/cliUI');
const engineTransformer = require('./node_tools/transformers/build/engineTransformer').engineTransformer;


class WebpackDonePlugin{
    apply(compiler){
        compiler.hooks.done.tap('compilation',  (stats)=> {
            const date = new Date();
            const leadZero = (val)=>{
                if ((''+val).length===1) return `0${val}`;
                else return `${val}`;
            };
            const hh = leadZero(date.getHours());
            const mm = leadZero(date.getMinutes());
            const ss = leadZero(date.getSeconds());
            setTimeout(()=>{
                if (stats.compilation.errors && stats.compilation.errors.length) {
                    cliUI.showErrorWindow(
                        [
                            `--===compiled with errors===--`,
                            `-----${hh}:${mm}:${ss}-----`
                        ]
                    );
                } else {
                    cliUI.showInfoWindow(
                        [
                            `--===compiled===--`,
                            `-----${hh}:${mm}:${ss}-----`
                        ]
                    );
                }

            },10);

        });

    }
}

const getAllProjects = ()=>{
    return fs.readdirSync('./demo').filter((dir)=>{
        return !['demo.html', 'assets', 'out', 'index.html', 'index.json', '.DS_Store', 'generateIndexPage.js', 'application.hta', 'VEngineNavigator.exe'].includes(dir);
    });
};

module.exports = async (env={})=>{

    console.log('env',env);
    await cliUI.showInfoWindow(
        [
            ` --===started===-- `,
            `--vEngine compiler--`,
        ]
    );
    let project;
    const mode = await cliUI.choose('Choose option',[
        'Compile all projects',
        'Choose project from list',
        'Enter project name to compile'
        ]
    );
    if (mode===1) {
        const allPROJECTS = getAllProjects();
        const index = await cliUI.choose('Select a project',allPROJECTS);
        project = allPROJECTS[index];
        console.log(`Selected: ${project}`);
    } if (mode===2) {
        project = await cliUI.prompt("Enter project name to compile")
    }

    const debug = env.debug==='true';

    const entry = {};
    const output = {
        path: path.resolve('./demo/out'),
        filename:'[name].js',
        //chunkFilename: "[name].chunk.js",
    };

    if (project) {
        entry[project] = [`./demo/${project}/index.ts`]
    } else {
        getAllProjects().forEach((dir)=>{
            entry[`${dir}`] = [`./demo/${dir}/index.ts`];
        });
    }



    entry['debug'] = './engine/debug/debug.ts';
    entry['polyfills-separate'] = './engine/misc/polyfills-separate.ts';



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
                            loader: "ts-engine-precompiler/ts-engine-precompiler"
                        },
                    ]
                },
                {
                    test: /\.tsx?$/,
                    enforce: 'pre',
                    use: [
                        {
                            loader: 'tslint-loader',
                            options: { /* Loader options go here */ }
                        }
                    ]
                },
                {
                    test: /\.tsx?$/,
                    use: [
                        {
                            loader: "awesome-typescript-loader",options: {
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
            extensions: ['.ts','.tsx'],
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


