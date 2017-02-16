var app = angular.module('app', []);

app.controller('MainController', MainController);
app.controller('GalleryController', GalleryController);

app.directive('file', fileDirective);