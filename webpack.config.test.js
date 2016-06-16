const webpack = require('webpack');

exports = module.exports = Object.assign(require('./webpack.config'), {
	entry: './test/app/index.js',
	externals: [],
	output: {
		path: '/',
		filename: 'index.js',
		publicPath: '/'
	}
});

delete exports.node;

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
