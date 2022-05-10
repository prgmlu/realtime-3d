const { ModuleFederationPlugin } = require('webpack').container;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const { loadConfig } = require('../configs');
const deps = require('../package.json').dependencies;

module.exports = (options) => {
	const { WEBPACK_SERVE, buildEnv } = options;
	const config = {
		entry: './src/index.jsx',
		mode: 'development',
		devtool: 'source-map',
		output: {
			path: path.join(__dirname, '../dist'),
			// publicPath: 'http://localhost:3000/',
			clean: true,
		},
		resolve: {
			extensions: ['.jsx','.ts', '.js', '.json', '.css', '.scss'],
		},
		plugins: [new MiniCssExtractPlugin()],
		module: {
			rules: [
				{
					test: /\.(glb|jpg|gltf|png)$/,
					use:
					[
						{
							loader: 'file-loader',
							options:
							{
								outputPath: 'assets/models/'
							}
						}
					]
				},
				{
					test: /\.jsx?$/,
					loader: 'babel-loader',
					exclude: /node_modules/,
					options: {
						presets: ['@babel/preset-react'],
					},
				},
				{
					test: /\.(sa|sc|c)ss$/,
					use: [
						MiniCssExtractPlugin.loader,
						'css-loader',
						'postcss-loader',
						'sass-loader',
					],
				},
			],
		},
	};

	config.optimization = {
		runtimeChunk: 'single',
		splitChunks: {
			chunks: 'all',
			maxInitialRequests: Infinity,
			minSize: 0,
			cacheGroups: {
				reactVendor: {
					test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
					name: 'vendor_react',
				},
				utilityVendor: {
					test: /[\\/]node_modules[\\/](axios|react-redux|redux)[\\/]/,
					name: 'vendor_utility',
				},
				bootstrapVendor: {
					test: /[\\/]node_modules[\\/](react-bootstrap|bootstrap)[\\/]/,
					name: 'vendor_bootstrap',
				},
			},
		},
	};

	config.plugins.push(
		// new ModuleFederationPlugin({}),
	);

	const webpackPluginOptions = {
		template: './public/index.html',
	};

	webpackPluginOptions.storeId = loadConfig(buildEnv).STORE_ID;
	config.plugins.push(new HtmlWebpackPlugin(webpackPluginOptions));

	if (WEBPACK_SERVE) {
		config.devServer = {
			port: 3000,
			historyApiFallback: true,
			open: true,
			hot: 'only',
		};
	}

	config.externals = {
		config: JSON.stringify(loadConfig('development')),
	};

	return config;
};
