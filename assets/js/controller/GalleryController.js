function GalleryController($scope) {

    // http://stackoverflow.com/questions/32702431/display-images-fetched-from-s3
    $scope.creds = CONFIG_CREDS;
    $scope.gallery = [];
    $scope.inProgress = false;

    // listObjects
    function encode(data)
    {
        var str = data.reduce(function(a,b){ return a+String.fromCharCode(b) },'');
        return btoa(str).replace(/.{76}(?=.)/g,'$&\n');
    }

    (function () {
        $scope.inProgress = true;

        var bucket = new AWS.S3();

        var params = {
            Bucket: $scope.creds.bucket
        };

        bucket.listObjects(params, function(err, data) {
            // an error occurred
            if (err) {
                alert(err + ' ' + err.stack);
            }
            // successful response
            else {
                setTimeout(function () {
                    $scope.$apply(function () {
                        console.log(data.Contents);
                        for(var i = 0; i < data.Contents.length; i++) {

                            if(data.Contents[i]['Size'] > 0) {
                                bucket.getObject({
                                    Bucket: $scope.creds.bucket,
                                    Key: data.Contents[i]['Key']
                                },function(err,file) {
                                    if(err) {
                                        console.error(err);
                                    }
                                    else {
                                        setTimeout(function () {
                                            $scope.$apply(function () {
                                                $scope.gallery.push('data:image/jpeg;base64,' + encode(file.Body));
                                            });
                                        });
                                    }
                                });
                            }
                        }
                        $scope.inProgress = false;
                    });
                }, 1000)
            }
        });

    }())

}