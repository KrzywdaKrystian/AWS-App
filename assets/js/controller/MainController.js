function MainController($scope) {

    $scope.sizeLimit = CONFIG_MAX_FILE_SIZE;
    $scope.uploadProgress = 0;
    $scope.uploadStatus = 0;
    $scope.uploadMsg = '';
    $scope.creds = CONFIG_CREDS;

    $scope.upload = function () {
        $scope.uploadProgress = 1;
        $scope.uploadStatus = 0;
        $scope.uploadMsg = '';

        var bucket = new AWS.S3({params: {Bucket: $scope.creds.bucket}});

        if ($scope.file) {
            console.log($scope.file);
            // Perform File Size Check First
            var fileSize = Math.round(parseInt($scope.file.size));
            if (fileSize > $scope.sizeLimit) {
                $scope.uploadStatus = 2;
                $scope.uploadProgress = 0;
                $scope.uploadMsg = 'Sorry, your attachment is too big. <br/> Maximum 10MB file attachment allowed. File Too Large';
                console.error('Sorry, your attachment is too big. <br/> Maximum 10MB file attachment allowed', 'File Too Large');
                //toastr.error('Sorry, your attachment is too big. <br/> Maximum 10MB file attachment allowed','File Too Large');
                return false;
            }
            // Prepend Unique String To Prevent Overwrites
            var uniqueFileName = $scope.file.name;

            var params = {
                Key: uniqueFileName,
                ContentType: $scope.file.type,
                Body: $scope.file,
                ServerSideEncryption: 'AES256'
            };

            bucket.putObject(params, function (err, data) {
                if (err) {
                    $scope.uploadStatus = 2;
                    $scope.uploadMsg = err.message + ' ' + err.code;
                    $scope.uploadProgress = 0;
                    console.error(err.message, err.code);
                    return false;
                }
                else {
                    // Upload Successfully Finished
                    console.log('File Uploaded Successfully', 'Done');

                    $scope.$apply(function () {
                        $scope.uploadStatus = 1;
                        $scope.uploadMsg = 'File Uploaded Successfully'
                    });
                }
            }).on('httpUploadProgress', function (progress) {
                $scope.uploadProgress = Math.round(progress.loaded / progress.total * 100);
                $scope.uploadMsg = $scope.uploadProgress + "%";
                $scope.$digest();
            });
        }
        else {
            // No File Selected
            $scope.uploadStatus = 2;
            $scope.uploadProgress = 0;
            $scope.uploadMsg = 'Please select a file to upload';
            console.error('Please select a file to upload');
        }
    }

}