var app = angular.module('app', []);

app.run(function () {
    var creds = CONFIG_CREDS;
    AWS.config.update({accessKeyId: creds.access_key, secretAccessKey: creds.secret_key});
    AWS.config.region = CONFIG_REGION;
});

app.controller('MainController', MainController);
app.controller('GalleryController', GalleryController);

app.directive('file', fileDirective);