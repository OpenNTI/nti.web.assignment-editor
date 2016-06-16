const webpack = require('webpack');
const path = require('path');

exports = module.exports = Object.assign(require('./webpack.config'), {
	entry: './test/app/index.js',
	externals: [],
	output: {
		path: '/', //this controls where the files are written. Since we're writting to an in-memory volume(dev server), this is root.
		filename: 'index.js',
		// publicPath: '/'	//This controls the prefix of the urls that get written into asset references.
							// By not setting it, we let the urls be relative.
	}
});

delete exports.node;

exports.resolveLoader = { root: [path.join(__dirname, 'node_modules') ] };

exports.module.loaders.push({
	test: /\.(eot|ttf|woff)$/,
	loader: 'file-loader',
	query: {
		name: 'resources/fonts/[name].[ext]'
	}
});

exports.plugins.push(new webpack.DefinePlugin({
	'SERVER': false
}));
