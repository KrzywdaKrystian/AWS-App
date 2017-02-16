function fileDirective() {
    return {
        restrict: 'AE',
        scope: {
            file: '@'
        },
        link: function(scope, el, attrs){
            console.log('file init');
            el.bind('change', function(event){
                var files = event.target.files;
                var file = files[0];
                scope.file = file;
                scope.$parent.file = file;
                scope.$apply();
            });
        }
    };
}