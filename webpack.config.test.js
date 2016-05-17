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

exports.plugins.push(new webpack.DefinePlugin({
	'SERVER': false
}));
