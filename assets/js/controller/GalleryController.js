function GalleryController($scope) {

    var creds = CONFIG_CREDS;
    var bucket = new AWS.S3();
    var params = {
        Bucket: creds.bucket
    };

    $scope.gallery = [];
    $scope.inProgress = false;

    $scope.deletePhoto = deletePhoto;

    // listObjects
    (function () {
        $scope.inProgress = true;

        bucket.listObjects(params, function (err, data) {
            // an error occurred
            if (err) {
                alert(err + ' ' + err.stack);
            }
            // successful response
            else {
                setTimeout(function () {
                    $scope.$apply(function () {
                        console.log(data.Contents);
                        for (var i = 0; i < data.Contents.length; i++) {

                            if (data.Contents[i]['Size'] > 0) {
                                var key = data.Contents[i]['Key'];
                                bucket.getObject({
                                    Bucket: creds.bucket,
                                    Key: key
                                }, function (err, file) {
                                    if (!err) {
                                        setTimeout(function () {
                                            $scope.$apply(function () {
                                                $scope.gallery.push({
                                                    'key': key,
                                                    'src': 'data:image/jpeg;base64,' + encode(file.Body)
                                                });
                                            });
                                        });
                                    } else {
                                        console.error(err);
                                    }
                                });
                            }
                        }
                        $scope.inProgress = false;
                    });
                }, 1000)
            }
        });

    }());

    function encode(data) {
        var str = data.reduce(function (a, b) {
            return a + String.fromCharCode(b)
        }, '');
        return btoa(str).replace(/.{76}(?=.)/g, '$&\n');
    }

    function deletePhoto(index) {
        console.log(index);

        var photo = $scope.gallery[index];

        var object = {
            Bucket: creds.bucket,
            Key : photo.key
        };

        bucket.deleteObject(object, function (err, data) {
            if (err) {
                alert(err);
            }
            else {
                setTimeout(function () {
                    $scope.$apply(function () {
                        $scope.gallery.splice(index, 1);
                    });
                });
            }
        });
    }

}