import * as path from 'path';
import * as webpack from 'webpack';
import * as fs from 'fs';
import * as child_process from 'child_process';
import * as TerserPlugin from 'terser-webpack-plugin';
import * as cliUI from './node_tools/cliUI.mjs';
import * as ESLintPlugin from 'eslint-webpack-plugin';
import * as storage from './node_tools/common/storage.js';
import {fileURLToPath} from 'url';

let project;
let allProjectsGrouped;
let allProjectsFlat;
let TextTable;


class InputOutputResolver {

    async resolve(project,allProjects){
        const entry = {};
        const output = {};

        if (project==='build_tools') {
            entry['xmlParser'] = './engine/misc/parsers/xml/xmlParser.ts';
            entry['angelCodeParser'] = './engine/misc/parsers/angelCode/angelCodeParser.ts';
            entry['textTable'] = './engine/renderable/impl/ui/textHelpers/textTable.ts';
            output.path = path.resolve('./node_tools/build');
        } else {

            if (!fs.existsSync("./node_tools/build/textTable.js")) {
                throw new Error('invoke "build_tools" task');
            }

            TextTable = (await import("./node_tools/build/textTable.js")).TextTable;

            if (!project) {
                allProjects.forEach((dir)=>{
                    entry[`${dir}`] = [`./demo/${dir}/index.ts`];
                });
            } else {
                entry[project] = [`./demo/${project}/index.ts`];
            }

            entry['editor-server'] = './node_tools/editor/server/index.ts';
            entry['editor-client'] = './node_tools/editor/client/index.ts';
            entry['debug'] = './engine/debug/debug.ts';
            entry['inspector'] = './engine/debug/inspector/inspector.tsx';
            entry['polyfills-separate'] = './engine/misc/polyfills-separate.ts';
            output.path = path.resolve('./demo/out');
        }

        output.filename = '[name].js';
        output.chunkFilename = "[name].chunk.js";

        return {entry,output};
    }

}

const getTime = ()=>{
    const date = new Date();
    const leadZero = (val)=>{
        if ((''+val).length===1) return `0${val}`;
        else return `${val}`;
    };
    const hh = leadZero(date.getHours());
    const mm = leadZero(date.getMinutes());
    const ss = leadZero(date.getSeconds());
    return {mm,hh,ss};
}

const getCommitHash = ()=>{
    try {
        return child_process
            .execSync('git rev-parse HEAD')
            .toString().trim().substr(0,6);
    } catch (e) {
        return '';
    }
}

const getBranchName = ()=>{
    try {
        return child_process
            .execSync('git branch --show-current')
            .toString().trim();
    } catch (e) {
        return '';
    }
}

class WebpackDonePlugin{
    apply(compiler){
        compiler.hooks.done.tap('compilation',  (stats)=> {
            const {mm,hh,ss} = getTime();
            setTimeout(()=>{
                if (stats.compilation.errors && stats.compilation.errors.length) {
                    cliUI.showErrorWindow(
                        [
                            `--===compiled with errors===--`,
                            `total errors number: ${stats.compilation.errors.length}`,
                            (()=>{
                                if (project) return `-=project: ${project}=-`;
                                else return `-=${allProjectsFlat.length} projects=-`
                            })(),
                            `-----${hh}:${mm}:${ss}-----`
                        ]
                    );
                } else {
                    cliUI.showInfoWindow(
                        [
                            `--===compiled===--`,
                            (()=>{
                                if (project) return `-=project: ${project}=-`;
                                else return `-=${allProjectsFlat.length} projects=-`
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
    let arr = fs.
        readdirSync('./demo').
        filter((dir)=>{
            return fs.lstatSync(`./demo/${dir}`).isDirectory() && fs.existsSync(`./demo/${dir}/index.ts`)
    });

    const extractNumber = (str)=>{
        let digits = '';
        str.split('').forEach(c=>{
            if (['0','1','2','3','4','5','6','7','8','9'].indexOf(c)>-1) {
                digits+=c;
            }
        });
        return parseInt(digits);
    }

    const extractText = (str)=>{
        let text = '';
        str.split('').forEach(c=>{
            if (['0','1','2','3','4','5','6','7','8','9'].indexOf(c)===-1) {
                text+=c;
            }
        });
        return text;
    }

    const groupNames = arr => {
        const map = arr.reduce((acc, val) => {
            let char = val.charAt(0).toUpperCase();
            acc[char] = [].concat((acc[char] || []), val);
            return acc;
        }, {});
        return Object.keys(map).map(el => ({
            letter: el,
            names: map[el]
        }));
    };

    arr.sort((item1, item2)=> {
        const firstStr = extractText(item1);
        const secondStr = extractText(item2);
        let byText;
        if (firstStr===secondStr) byText = 0;
        else byText = firstStr>secondStr?1:-1;
        if (byText!==0) return byText;

        const firstInt = extractNumber(item1);
        const secondInt = extractNumber(item2);
        return firstInt - secondInt;
    });


    return groupNames(arr);
};


export default async (env = {})=>{
    await cliUI.showInfoWindow(
        [
            `--===started===--`,
            `--vEngine compiler--`,
        ]
    );
    allProjectsGrouped = getAllProjects();
    allProjectsFlat = allProjectsGrouped.map(it=>it.names).flatMap(it=>it);
    fs.writeFileSync('./demo/index.json',JSON.stringify(allProjectsGrouped.filter(it=>it.letter!=='_'),undefined, 4));
    const mode = await cliUI.choose('Choose option',[
            'Compile all projects',
            'Choose project from list',
            'Last compiled project',
            'Enter project name to compile',
            'exit'
        ]
    );
    if (mode===1) {
        const projectsToSelect = [...allProjectsFlat,'build_tools'];
        const index = await cliUI.choose('Select a project',projectsToSelect);
        project = projectsToSelect[index];
    }
    else if (mode===2) {
        project = storage.get('project');
        if (!project) {
            throw new Error(`no last compiled project found`);
        }
    }
    else if (mode===3) {
        project = await cliUI.prompt("Enter project name to compile")
    }
    else if (mode===4) {
        console.clear();
        process.exit(1);
    }

    storage.set('project',project);


    const debug = env.debug==='true';

    const {entry,output} = await new InputOutputResolver().resolve(project,allProjectsFlat);


    if (project==='build_tools') {
        console.log({entry,output});
    } else {
        const {mm,hh,ss} = getTime();
        console.clear();
        cliUI.showInfoWindow(TextTable.fromArrays([
            ['webpack started at',`${hh}:${mm}:${ss}`],
            ['Selected',project ?? 'all'],
            ['Branch',getBranchName()],
            ['Commit',getCommitHash()],
        ],{border:true,pad:true}).toString());
    }

    const __dirname = path.dirname(fileURLToPath(import.meta.url));

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
            aggregateTimeout: 2000,
            ignored: ['**/demo/out/', '/node_modules/'],
        },
        performance: {
            maxEntrypointSize: 1024000,
            maxAssetSize: 1024000
        },
        module: {
            rules: [
                {
                    test: /\.txt/,
                    use: [
                        {loader: "txt/txt-loader",options: {debug}},
                    ]
                },
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
                                    loader: "ts-engine-precompiler/resource-loader-precompiler"
                                },
                            ]
                        }
                    }
                    else return undefined;
                })(),
                {
                    test: /\.tsx$/,
                    enforce: 'pre',
                    use: [
                        {
                            loader: "ts-engine-precompiler/tsx-precompiler"
                        },
                    ]
                },
                {
                    test: /\.tsx?$/,
                    use: [
                        {
                            loader: "ts-loader",options: {},
                        },
                    ]
                },
            ]
        },
        resolve: {
            extensions: ['.ts','.tsx','.js'],
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
        externals: {
            fs: "require('fs')",
            path: "require('path')",
            psd: "require('psd')",
        }
    };

    config.module.rules = config.module.rules.filter(it=>!!it);

    if (!debug) {

        config.optimization.minimizer = [new TerserPlugin.default({
            terserOptions: {
                ecma: 5,
                parse: {},
                compress: !debug,
                mangle: {
                    properties: {
                        regex: "/^_/",
                    },
                },
                module: false,
                toplevel: true,
                ie8: true,
                keep_classnames: false,
                keep_fnames: false,
                safari10: true,
            }
        })]
    }

    config.plugins = [
        new webpack.default.DefinePlugin({
            BUILD_AT: webpack.default.DefinePlugin.runtimeValue(() => new Date().getTime()),
            COMMIT_HASH: webpack.default.DefinePlugin.runtimeValue(() => `'${getBranchName()} (${getCommitHash()})'`),
            DEBUG: debug,
        }),
        new ESLintPlugin.default({
            context: '../',
            emitError: true,
            emitWarning: true,
            failOnError: true,
            extensions: ["ts", "tsx"],
        }),
        new WebpackDonePlugin()
    ];

    return config;
}



