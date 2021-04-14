
const path = require('path');
const webpack = require('webpack');
const fs = require('fs');
const TerserPlugin = require('terser-webpack-plugin');
const cliUI = require('./node_tools/cliUI');

let project;
let allProjects;


class InputOutputResolver {

    resolve(project,allProjects){
        const entry = {};
        const output = {};
        let isToolsBuild = false;

        if (project==='build_tools') {
            isToolsBuild = true;
            entry['xmlParser'] = './engine/misc/xml/xmlParser.ts';
            entry['engineTransformer'] = './node_tools/transformers/src/engineTransformer.ts';
            output.path = path.resolve('./node_tools/build');
        } else {
            if (!project) {
                allProjects.forEach((dir)=>{
                    entry[`${dir}`] = [`./demo/${dir}/index.ts`];
                });
            } else {
                entry[project] = [`./demo/${project}/index.ts`];
            }

            entry['debug'] = './engine/debug/debug.ts';
            entry['inspector'] = './engine/debug/inspector.tsx';
            entry['polyfills-separate'] = './engine/misc/polyfills-separate.ts';
            output.path = path.resolve('./demo/out');
        }

        output.filename = '[name].js';
        output.chunkFilename = "[name].chunk.js";

        return {entry,output,isToolsBuild};
    }

}


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
                            (()=>{
                                if (project) return `-=project: ${project}=-`;
                                else return `-=${allProjects.length} projects=-`
                            })(),
                            `-----${hh}:${mm}:${ss}-----`
                        ]
                    );
                }

            },10);

        });

    }
}

const getAllProjects = ()=>{
    return fs.
        readdirSync('./demo').
        filter((dir)=>{
            return fs.lstatSync(`./demo/${dir}`).isDirectory() && fs.existsSync(`./demo/${dir}/index.ts`)
    });
};


module.exports = async (env={})=>{

    await cliUI.showInfoWindow(
        [
            ` --===started===-- `,
            `--vEngine compiler--`,
        ]
    );
    allProjects = getAllProjects();
    fs.writeFileSync('./demo/index.json',JSON.stringify(allProjects));
    const mode = await cliUI.choose('Choose option',[
        'Compile all projects',
        'Choose project from list',
        'Enter project name to compile'
        ]
    );
    if (mode===1) {
        const projectsToSelect = [...allProjects,'build_tools']
        const index = await cliUI.choose('Select a project',projectsToSelect);
        project = projectsToSelect[index];
        console.log(`Selected: ${project}`);
    } if (mode===2) {
        project = await cliUI.prompt("Enter project name to compile")
    }

    const debug = env.debug==='true';

    const {entry,output,isToolsBuild} = new InputOutputResolver().resolve(project,allProjects);

    console.log('webpack started at',new Date());
    console.log('env',env);
    console.log({entry,output});

    const config = {
        entry,
        output,
        target: ['web', 'es5'],
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
                (()=>{
                    if (project!=='build_tools') {
                        return {
                            test: /\.xml$/,
                            use: [
                                {loader: "xml/xml-loader",options: {debug}},
                            ]
                        }
                    }
                    else return undefined;
                })(),
                {
                    test: /\.(png|jpe?g)$/,
                    use: [
                        {loader: 'base64/base64-loader',options: {debug}}
                    ]
                },
                (()=>{
                    if (project!=='build_tools') {
                        return {
                            test: /\.tsx?$/,
                            enforce: 'pre',
                            use: [
                                {
                                    loader: "ts-engine-precompiler/ts-engine-precompiler"
                                },
                            ]
                        }
                    }
                    else return undefined;
                })(),
                {
                    test: /\.tsx?$/,
                    enforce: 'pre',
                    use: [
                        {
                            loader: 'tslint-loader',
                            options: {
                                emitErrors: true,
                                failOnHint: true
                            }
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
                                        before:  (()=>{
                                            if (isToolsBuild) return undefined;
                                            const engineTransformer = require('./node_tools/build/engineTransformer').engineTransformer;
                                            return [engineTransformer];
                                        })()
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
            emitOnErrors: false,
        },
    };

    config.module.rules = config.module.rules.filter(it=>!!it);

    if (!debug) {

        config.optimization.minimizer = [new TerserPlugin({
            terserOptions: {
                ecma: false,
                parse: {},
                compress: {},
                mangle: {
                    properties: {
                        regex: "/^_/",
                    },
                },
                module: false,
                toplevel: true,
                ie8: true,
                keep_classnames: undefined,
                keep_fnames: false,
                safari10: true,
            }
        })]
    }

    config.plugins = [
        new webpack.DefinePlugin({
            BUILD_AT: webpack.DefinePlugin.runtimeValue(() => new Date().getTime()),
            DEBUG: debug,
        }),
        new WebpackDonePlugin()
    ];

    return config;
};


