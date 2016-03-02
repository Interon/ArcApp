gulp.task('deploy', function (done) {
	var platform = config.ensure.platform(argv.platform);
	var env = config.ensure.environment(argv.env, argv.debugmode);

	if (env === 'prod' && platform === 'ios') {
		throw 'ios applications cannot be distributed via HockeyApp';
	}

	var endpoint = '/apps/' + config.phoneGap.appId;

	pgBuild.auth({ token: config.phoneGap.authToken }, function (e, api) {
		api.get(endpoint, function (ee, data) {
			var status = (!ee && data) ? data.status[platform] : null;
			if (status === 'complete') {
				var filePath = 'tmp/' + data.package + '.' + data.version + config.extension(platform);
				var write = api.get(endpoint + '/' + platform).pipe(fs.createWriteStream(filePath));
				write.on('finish', function () {
					var form = {
						ipa: fs.createReadStream(filePath),
						status: 2
					};
					var header = {
						'X-HockeyAppToken': config.hockeyApp.token
					};

					endpoint = 'https://rink.hockeyapp.net/api/2/apps/' + config.hockeyApp.ids[env][platform] + '/app_versions/upload';
					request.post({ url: endpoint, formData: form, headers: header }, function (err, httpResponse, body) {
						requestCallBack(err, httpResponse, body);
						done();
					});
				});
			} else {
				console.log(
					gutil.colors.red('Cannnot download application'),
					gutil.colors.white('\n  plaform: ' + platform) +
					gutil.colors.white('\n  status: ' + status));
				done();
			}
		});
	});
});