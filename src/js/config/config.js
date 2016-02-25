angular.module("app.config")

.constant("APP", {
	"routerDefaultState": "demo",
	"devMode": true,
	"testMode": true,
	"noTracking": true,
	"SubVersion": "D8"
})

.constant("ParseConfiguration", {
	"applicationId": "applicationId",
	"javascriptKey": "javascriptKey",
	"serverURL": "/parse-api"
})

.constant("FirebaseConfiguration", {
	"url": "http://arcapp.firebaseio.com"
})

.constant("ionicIO", {
	"appId": "appId",
	"apiKey": "apiKey"
})

.constant("Server", {
	"url": "http://arcapp.interon.co.za"
})

;