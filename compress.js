gulp.task('compress', gulpsync.sync(['clean', 'mirror', 'config', 'services']), function () {
	var env = config.ensure.environment(argv.env, argv.debugmode);
	var timestamp = moment().format('YYYYMMDDhhmmss');
	var archiveName = config.cordova[env].appNamespace + '_' + timestamp + '.zip';

	return gulp.src(['tmp/www/**', 'tmp/res/**'], { base: 'tmp' })
		.pipe(zip(archiveName))
		.pipe(gulp.dest('tmp'));
});
