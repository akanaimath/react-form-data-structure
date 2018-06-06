var webpack = require('webpack');
var path = require('path');
var BUILD_DIR = path.resolve(__dirname, 'demo');
var APP_DIR = path.resolve(__dirname, '.');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

var config = {
	entry : [  
	         'babel-polyfill',
		APP_DIR + '/react-form.css' ,
		BUILD_DIR + '/demo.jsx'
		],
	    target : 'web',
	    output : {
		  path : BUILD_DIR,
		  filename : 'site.js',
		
	},
	devtool : '#eval-source-map',
	module : {
		loaders : [
				{
					test : /\.jsx?$/,
					loader : "babel-loader",
					    exclude: /node_modules/,
					query : {
					    compact : false,
						presets : [ [ 'react' ], ['env',{}] ],
						plugins : [ "babel-plugin-transform-react-jsx",
								"transform-class-properties" ]
				
					}
				}, {
					test : /\.css$/,
					loaders : [ "style-loader", "css-loader" ],
				}, {
					test : /\.(jpe?g|png|gif)$/i,
					loader : "file-loader",
					query : {
						name : '[name].[ext]',
						outputPath : 'images/'
					}
				}, ],
	},
	plugins : [
	           new webpack.optimize.UglifyJsPlugin({
        sourceMap : true,
        warnings : true,
        uglifyOptions : { },
  })
	],
};

module.exports = config;