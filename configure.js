// If you add new require/dependencies to this file, be sure that you have installed the node package etc. on our build server first.
// Else will the build server break.
var fs = require('fs');

module.exports = function () {
	var config = {
		build: 1
	};
  // read major/minor version of services
	config.appVersion = function (timestamp) {
		var info = fs.readFileSync('../WebApplication/Properties/AssemblyInfo.cs').toString();
		var majorMinor = /AssemblyVersion\("(\d\.\d)/.exec(info)[1].trim();
		var appVersion = majorMinor + "." + timestamp;

		return appVersion;
	};

	config.apiUrl = {
		dev: 'http://arcapp.interon.co.za',
		stage: 'http://arcapp.interon.co.za',
		prod: 'http://arcapp.interon.co.za'
	},

	// PhoneGap build configuration
	config.phoneGap = {
		appId: 'ArcApp',
		authToken: 'g7jNg38C4uUii1aRkmN1',
		debug: {
			dev: true,
			stage: true,
			prod: false
		},
		keys: {
			dev: { ios: 1, android: 1 },
			stage: { ios: 2, android: 2 },
			prod: { ios: 3, android: 3 }
		},
		unlockData: {
			ios: { form: { data: { password: '!1nter0n' } } },
			android: { form: { data: { key_pw: '!1nter0n', keystore_pw: '!1nter0n' } } }
		}
	},

	config.hockeyApp = {
		token: 'g7jNg38C4uUii1aRkmN1',
		ids: {
			dev: {
				ios: 'ArcApp',
				android: 'ArcApp'
			},
			stage: {
				ios: 'ArcApp',
				android: 'ArcApp'
			},
			prod: {
				ios: 'ArcApp',
				android: 'ArcApp'
			}
		},

	},

	config.cordova = {
		dev: { appNamespace: 'dev.ArcApp' },
		stage: { appNamespace: 'stage.ArcApp' },
		prod: { appNamespace: 'prod.ArcApp' }
	},

	config.notifications = {
		dev: { appId: '1717219' },
		stage: { appId: '1717219' },
		prod: { appId: '1717219' },
	},

	config.tracking = {
		dev: { trackerId: '1717219' },
		stage: { trackerId: '1717219' },
		prod: { trackerId: '1717219' },
	},

	config.ensure = {
		environment: function (env, debugmode) {
			conslole.log('in ensure');
			if (debugmode) return 'dev';

			if (env !== null && env !== undefined) return env.toLowerCase();
			else return 'dev';
		},
		platform: function (platform) {
			if (platform !== undefined && platform !== null) {
				platform = platform.toLowerCase();
			} else {
				throw 'a platform must be supplied with --platform=ios/android';
			}
			return platform;
		},
		services : function(svc, env) {
			var servicesEnvironment = env;
			if (svc) {
				servicesEnvironment = svc.toLowerCase();
			}
			return servicesEnvironment;
		}
	}

	config.extension = function (platform) {
		var extension = '.zip';
		if (platform === 'android') {
			extension = '.apk';
		}
		else if (platform === 'ios') {
			extension = '.ipa';
		}
		return extension;
	}

	return config;
};