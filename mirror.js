gulp.task('mirror', function (done) {
	var files = ['res/**',
		'www/*.*',
		'www/css/*.min.css',
		'www/js/*.js',
		'www/templates/**',
		'www/img/**',
		'www/lib/custom/**',
		'www/lib/**/*min.js',
		'www/lib/ionic/**',
		'!www/lib/ionic/scss/**',
		'!www/lib/ionic/css/ionic.css',
		'!www/lib/ionic/js/ionic.bundle.js',
		'!www/lib/ionic/js/ionic.js',
		'!www/lib/ionic/js/ionic.min.js',
		'!www/lib/ionic/js/ionic-angular*'
	];
	gulp.src(files, { base: "." })
		.pipe(chmod(666))
		.pipe(gulp.dest('tmp'))
		.on('end', done);
});