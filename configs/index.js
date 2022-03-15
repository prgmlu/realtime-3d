const devConfig = require('./config.development.json');
const betaConfig = require('./config.beta.json');
const prodConfig = require('./config.production.json');

function loadConfig(env) {
	if (env === 'production') {
		return prodConfig;
	}
	if (env === 'beta') {
		return betaConfig;
	}
	return devConfig;
}

module.exports = { loadConfig };
