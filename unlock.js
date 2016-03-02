gulp.task('unlock', function () {
	var env = config.ensure.environment(argv.env, argv.debugmode);

	pgBuild.auth({ token: config.phoneGap.authToken }, function (e, api) {

		var key = config.phoneGap.keys[env];
		for (var platform in key) {
			var endpoint = '/keys/' + platform + '/' + key[platform];
			api.put(endpoint, config.phoneGap.unlockData[platform], buildCallBack);
		}
	});
});