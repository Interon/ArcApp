gulp.task('config', function (done) {
	var env = config.ensure.environment(argv.env, argv.debugmode);
	var timestamp = moment().format('YYYYMMDDhhmmss');

	gulp.src(['config.xml'])
		.pipe(replace('%APP_NAMESPACE%', config.cordova[env].appNamespace))
		.pipe(replace('%APP_VERSION%', config.appVersion(timestamp)))
		.pipe(replace('%APP_BUILD%', config.build))
		.pipe(gulp.dest('tmp/www'))
		.on('end', done);
});