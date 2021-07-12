const LiveReloadPlugin = require('webpack-livereload-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin')
const getWebpackConfig = require('./webpack.common.config');
const MODES = require('./tools/modes');
const PATHS = require('./tools/paths');
const glob = require('glob');
const path = require('path');
const loaders = require('./tools/loaders');

const statsOptions = {
  assets: true,
  hash: false,
  timings: true,
  chunks: false,
  chunkModules: false,
  modules: false,
  depth: false,
  children: false,
  version: true,
  warnings: false,
  cached: false,
  cachedAssets: false,
  reasons: false,
  source: false,
  errorDetails: true,
  moduleTrace: true,
  performance: true
};


function getEntries(pattern) {
	const entries = {};

	glob.sync(pattern).forEach((file) => {
	  entries[file.replace('src/', '')] = path.join(__dirname, file);
	});

	return entries;
}

// module.exports = {...getWebpackConfig({
//   mode: MODES.DEVELOPMENT,
//   devtool: 'inline-source-map',
//   plugins: [
//     new CleanWebpackPlugin([path.resolve(PATHS.PROJECT_DIR, './frontend/test/*.js')	], {
//       root: PATHS.PROJECT_DIR,
//       watch: true,
//       beforeEmit: true
//     })
//  ],
//   performance: {
//     hints: 'warnings'
//   },
//   stats: statsOptions
// }), entry: 
// 		[path.resolve(PATHS.PROJECT_DIR, './frontend/test/sagas.spec.ts')],
// 	output: {
//     	path: path.resolve(PATHS.PROJECT_DIR, './frontend/test/'),
//     	filename: '[name].js'
// 	}
// };


module.exports = {
	mode: MODES.DEVELOPMENT,
	context: PATHS.APP_DIR,
	entry: {
		'sagas.spec': path.resolve(PATHS.PROJECT_DIR, './frontend/test/sagas.spec.ts')
	},
	output: {
		path: path.resolve(PATHS.PROJECT_DIR, './frontend/test/'),
		filename: '[name].js'
	},

	module: {
		rules: [
			loaders.TSLoader({transpileOnly: true}),
			loaders.LodashTSLoader,
		],
	},
	resolve: {
		extensions: ['.ts', '.js', '.tsx'],
		descriptionFiles: ['package.json'],
		modules: ['node_modules'],
		alias: {
			'@': PATHS.SRC_DIR,
			'@assets': PATHS.ASSETS_DIR,
		  },
	},
	target: 'node',
	stats: statsOptions
}
