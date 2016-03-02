gulp.task('build', gulpsync.sync(['unlock', 'compress']), function () {
	var endpoint = '/apps/' + config.phoneGap.appId;

	var env = config.ensure.environment(argv.env, argv.debugmode);

	pgBuild.auth({ token: config.phoneGap.authToken }, function (e, api) {
		gulp.src('tmp/*.zip').pipe(tap(function (file, t) {
			var options = {
				form: {
					data: {
						debug: config.phoneGap.debug[env],
						keys: config.phoneGap.keys[env]
					},
					file: file.path
				}
			};
			api.put(endpoint, options, buildCallBack);
			return t;
		}));
	});
});